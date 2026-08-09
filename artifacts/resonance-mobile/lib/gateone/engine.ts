/**
 * Gate One NATIVE engine — continuous physical traversal, trigger-driven
 * authored script, independent NPC schedules, spatial audio through the
 * protected native path.
 *
 * Architecture rules honoured here:
 * - The protected semantic spatial model (lib/spatial/world.ts) stays the
 *   presentation source of truth: player pose and audible entities are
 *   expressed as a SpatialWorld, and the native AVAudioEnvironmentNode HRTF
 *   engine is fed through the existing bridge (lib/native/bridge.ts).
 * - In Expo Go (no compiled native module) the bridge no-ops; direction is
 *   then carried by stereo-panned WAV cues (lib/spatial/audio.ts), captions,
 *   announcements, and haptics — equivalence, never a lesser story.
 * - Anti-shortcut protections: continuous coordinates only; no location
 *   cards, destination menus, dialogue wheels, or teleports. Look Around and
 *   Repeat Guidance DESCRIBE; they never move the player.
 */
import {
  WALKABLE, PLACES, NPC_PATHS, PLAYER_START,
  isWalkable, zoneAt, dist, relativeDirection, type ZoneId,
} from './world';
import { buildScript, type ScriptEvent, type ScriptLine } from './script';
import type { CharacterId } from './characters';
import type { SpatialWorld, WorldObject, WorldObjectKind } from '../spatial/world';
import { stereoGains, spatialToneUri } from '../spatial/audio';
import { syncNativeSpatialAudio, stopNativeSpatialAudio } from '../native/bridge';
import { isNativeSpatialAudioAvailable } from '../../modules/resonance-native';

export type Caption = { id: number; speaker: string; kind: ScriptLine['kind']; text: string };

export type EngineSnapshot = {
  x: number;
  y: number;
  heading: number; // radians, 0 = +Y (north), clockwise
  zone: ZoneId;
  zoneName: string;
  hatchOpen: boolean;
  gateOneComplete: boolean;
  npcs: { id: string; label: string; x: number; y: number }[];
};

export type EngineCallbacks = {
  onCaption: (c: Caption) => void;
  onAnnounce: (text: string) => void;
  onStateChange: () => void;
  onGateOneComplete: () => void;
  /** Play a synthesized stereo cue (Expo Go path; harmless alongside native). */
  onPlayTone: (uri: string) => void;
  onHaptic: (kind: 'badge' | 'bump' | 'step') => void;
};

const TURN_SPEED = 2.4; // rad/s
const MOVE_SPEED = 2.1; // m/s
const NATIVE_SYNC_MS = 150;

/** Tone identity for Gate One ambient entities via the canonical kind map. */
const AMBIENT_KIND: Record<string, WorldObjectKind> = {
  chatter: 'signal', // 440
  machine: 'pillar', // 330
  memorial: 'landmark', // 550
};

type Fixture = { id: string; x: number; y: number; kind: 'chatter' | 'machine' | 'memorial'; zone: ZoneId };

const FIXTURES: Fixture[] = [
  { id: 'fx-child', x: PLACES.childAndParent.x, y: PLACES.childAndParent.y, kind: 'chatter', zone: 'cabin' },
  { id: 'fx-sign', x: PLACES.signingEmployee.x, y: PLACES.signingEmployee.y, kind: 'chatter', zone: 'concourse' },
  { id: 'fx-mem', x: PLACES.memorial.x, y: PLACES.memorial.y, kind: 'memorial', zone: 'concourse' },
  { id: 'fx-berth', x: PLACES.berthWindow.x, y: PLACES.berthWindow.y, kind: 'machine', zone: 'concourse' },
  { id: 'fx-wall', x: PLACES.wallWorker.x, y: PLACES.wallWorker.y, kind: 'machine', zone: 'hearth' },
  { id: 'fx-arrivals', x: PLACES.crewCheck.x, y: PLACES.crewCheck.y, kind: 'chatter', zone: 'hearth' },
];

export type HeldControl = 'forward' | 'back' | 'left' | 'right';

export class GateOneNativeEngine {
  x = PLAYER_START.x;
  y = PLAYER_START.y;
  heading = PLAYER_START.heading;
  hatchOpen = false;
  gateOneComplete = false;

  private events: ScriptEvent[];
  private fired = new Set<string>();
  private firedAt = new Map<string, number>();
  private lingerStart = new Map<string, number>();
  private startTime = 0;
  private lastFrame = 0;
  private raf = 0;
  private held = new Set<HeldControl>();
  private captionSeq = 0;
  private stepAccum = 0;
  private bumpAccum = 0;
  private npcState = new Map<string, { x: number; y: number; wp: number }>();
  private cb: EngineCallbacks;
  private running = false;
  private lineQueue: { line: ScriptLine; at?: { x: number; y: number }; effectAfter?: ScriptEvent['effect'] }[] = [];
  private lineTimer: ReturnType<typeof setTimeout> | null = null;
  private endTimer: ReturnType<typeof setTimeout> | null = null;
  private lastGuidance = 'Hearth transfer intake: forward, through the central concourse.';
  private lastNativeSync = 0;
  private soundOn = true;

  constructor(
    character: CharacterId,
    cb: EngineCallbacks,
    restore?: { x: number; y: number; heading: number; fired: string[]; hatchOpen: boolean },
  ) {
    this.cb = cb;
    this.events = buildScript(character);
    if (restore) {
      const known = new Set(this.events.map((e) => e.id));
      for (const id of restore.fired) {
        if (known.has(id)) {
          this.fired.add(id);
          this.firedAt.set(id, 0); // seed so restored "after" chains still fire
        }
      }
      this.hatchOpen = restore.hatchOpen || this.fired.has('docking');
      if (
        Number.isFinite(restore.x) && Number.isFinite(restore.y) &&
        isWalkable(restore.x, restore.y, this.hatchOpen)
      ) {
        this.x = restore.x;
        this.y = restore.y;
        this.heading = Number.isFinite(restore.heading) ? restore.heading : 0;
      }
    }
    for (const p of NPC_PATHS) {
      this.npcState.set(p.id, { x: p.waypoints[0].x, y: p.waypoints[0].y, wp: 1 });
    }
  }

  start(soundOn: boolean) {
    this.soundOn = soundOn;
    this.startTime = Date.now();
    this.lastFrame = this.startTime;
    this.running = true;
    this.loop();
  }

  setSound(on: boolean) {
    this.soundOn = on;
    if (!on) void stopNativeSpatialAudio();
  }

  hold(control: HeldControl) { this.held.add(control); }
  release(control: HeldControl) { this.held.delete(control); }
  releaseAll() { this.held.clear(); }

  /**
   * Discrete step for assistive-tech activation (VoiceOver double-tap fires
   * press-in and press-out together, so holds never sustain). One activation
   * = one bounded physical step or one 45° turn — the SAME continuous
   * collision rules apply; this is never a teleport.
   */
  step(control: HeldControl) {
    if (this.gateOneComplete || !this.running) return;
    if (control === 'left' || control === 'right') {
      this.heading += control === 'left' ? -Math.PI / 4 : Math.PI / 4;
      return;
    }
    const total = control === 'forward' ? 1.5 : -0.9;
    const inc = 0.15 * Math.sign(total);
    const prevZone = zoneAt(this.x, this.y).id;
    let remaining = Math.abs(total);
    let blocked = false;
    while (remaining > 0) {
      const nx = this.x + Math.sin(this.heading) * inc;
      const ny = this.y + Math.cos(this.heading) * inc;
      if (isWalkable(nx, ny, this.hatchOpen)) {
        this.x = nx; this.y = ny;
      } else if (isWalkable(nx, this.y, this.hatchOpen)) {
        this.x = nx;
      } else if (isWalkable(this.x, ny, this.hatchOpen)) {
        this.y = ny;
      } else {
        blocked = true;
        break;
      }
      remaining -= Math.abs(inc);
    }
    if (blocked) {
      this.cb.onHaptic('bump');
      if (!this.hatchOpen && dist(this.x, this.y, PLACES.hatch.x, PLACES.hatch.y) < 2.5) {
        this.cb.onAnnounce('The transfer hatch is still sealed.');
      } else {
        this.cb.onAnnounce('A wall.');
      }
    } else {
      this.cb.onHaptic('step');
    }
    const newZone = zoneAt(this.x, this.y).id;
    if (newZone !== prevZone) this.cb.onAnnounce(`Entering the ${zoneAt(this.x, this.y).name}.`);
  }

  getFiredEvents(): string[] { return [...this.fired]; }

  snapshot(): EngineSnapshot {
    const z = zoneAt(this.x, this.y);
    return {
      x: this.x, y: this.y, heading: this.heading,
      zone: z.id, zoneName: z.name,
      hatchOpen: this.hatchOpen,
      gateOneComplete: this.gateOneComplete,
      npcs: NPC_PATHS
        .filter((p) => p.zone === z.id || (z.id === 'bridge' && p.zone === 'hearth'))
        .map((p) => {
          const s = this.npcState.get(p.id)!;
          return { id: p.id, label: p.label, x: s.x, y: s.y };
        }),
    };
  }

  /** The protected semantic model view of Gate One, for the native bridge. */
  private toSpatialWorld(): SpatialWorld {
    const z = zoneAt(this.x, this.y).id;
    const objects: WorldObject[] = [];
    for (const f of FIXTURES) {
      if (f.zone !== z) continue;
      objects.push({
        id: f.id,
        kind: AMBIENT_KIND[f.kind],
        label: f.id,
        position: { x: f.x, y: f.y, z: 0 },
        state: 'resonating',
        discovered: true,
        interactable: false,
        interactRange: 0,
      });
    }
    for (const p of NPC_PATHS) {
      if (p.zone !== z) continue;
      const s = this.npcState.get(p.id)!;
      objects.push({
        id: `npc-${p.id}`,
        kind: p.voice === 'cart' ? 'pillar' : 'signal',
        label: p.label,
        position: { x: s.x, y: s.y, z: 0 },
        state: 'resonating',
        discovered: true,
        interactable: false,
        interactRange: 0,
      });
    }
    return {
      player: {
        position: { x: this.x, y: this.y, z: 0 },
        headingDeg: (this.heading * 180) / Math.PI,
      },
      objects,
    };
  }

  /** Look Around — describes surroundings; never moves the player. */
  lookAround(): string {
    const z = zoneAt(this.x, this.y);
    const parts: string[] = [`You are in the ${z.name}.`];
    const nearby: { label: string; d: number; dir: string }[] = [];
    for (const key of Object.keys(PLACES) as (keyof typeof PLACES)[]) {
      const p = PLACES[key];
      const d = dist(this.x, this.y, p.x, p.y);
      if (d < 14 && zoneAt(p.x, p.y).id === z.id) {
        nearby.push({ label: p.label, d, dir: relativeDirection(this.x, this.y, this.heading, p.x, p.y) });
      }
    }
    for (const npc of NPC_PATHS.filter((p) => p.zone === z.id)) {
      const s = this.npcState.get(npc.id)!;
      const d = dist(this.x, this.y, s.x, s.y);
      if (d < 10) {
        nearby.push({ label: npc.label, d, dir: relativeDirection(this.x, this.y, this.heading, s.x, s.y) });
      }
    }
    nearby.sort((a, b) => a.d - b.d);
    for (const n of nearby.slice(0, 4)) {
      parts.push(`${capitalize(n.label)} is ${n.dir}, about ${Math.max(1, Math.round(n.d))} metres.`);
    }
    parts.push(this.actionableInstruction());
    return parts.join(' ');
  }

  /** Repeat the latest badge guidance with a live direction. Descriptive only. */
  repeatGuidance(): string {
    const target = this.currentTarget();
    const dir = relativeDirection(this.x, this.y, this.heading, target.x, target.y);
    const d = Math.max(1, Math.round(dist(this.x, this.y, target.x, target.y)));
    this.badgeCue();
    return `${this.lastGuidance} ${capitalize(target.hint)} is ${dir}, about ${d} metres. ${this.turnHelp(dir)}`;
  }

  private currentTarget(): { x: number; y: number; hint: string } {
    if (!this.hatchOpen) return { x: PLACES.hatch.x, y: PLACES.hatch.y, hint: 'the transfer hatch' };
    if (this.gateOneComplete || this.fired.has('crew-scan'))
      return { x: PLACES.lift.x, y: PLACES.lift.y, hint: 'the first lift' };
    if (this.y >= 78) return { x: PLACES.crewCheck.x, y: PLACES.crewCheck.y, hint: 'the arrivals check' };
    if (this.y >= 62) return { x: PLACES.hearthThreshold.x, y: PLACES.hearthThreshold.y, hint: 'the Hearth airlock' };
    if (this.y >= 40) return { x: 16, y: 60, hint: 'the boarding bridge' };
    return { x: PLACES.junction.x, y: PLACES.junction.y, hint: 'the central concourse' };
  }

  private actionableInstruction(): string {
    const target = this.currentTarget();
    const dir = relativeDirection(this.x, this.y, this.heading, target.x, target.y);
    return `To continue: ${capitalize(target.hint)} is ${dir}. ${this.turnHelp(dir)}`;
  }

  private turnHelp(dir: string): string {
    if (dir === 'ahead') return 'Move forward.';
    if (dir.includes('right') && dir.includes('behind')) return 'Turn around to your right, then move forward.';
    if (dir.includes('left') && dir.includes('behind')) return 'Turn around to your left, then move forward.';
    if (dir === 'behind you') return 'Turn around, then move forward.';
    if (dir.includes('right')) return 'Turn right, then move forward.';
    if (dir.includes('left')) return 'Turn left, then move forward.';
    return 'Move forward.';
  }

  private loop = () => {
    if (!this.running) return;
    const now = Date.now();
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const t = (now - this.startTime) / 1000;

    // --- movement ---------------------------------------------------------
    if (!this.gateOneComplete) {
      if (this.held.has('left')) this.heading -= TURN_SPEED * dt;
      if (this.held.has('right')) this.heading += TURN_SPEED * dt;
      let step = 0;
      if (this.held.has('forward')) step = MOVE_SPEED * dt;
      if (this.held.has('back')) step = -MOVE_SPEED * 0.6 * dt;
      if (step !== 0) {
        const nx = this.x + Math.sin(this.heading) * step;
        const ny = this.y + Math.cos(this.heading) * step;
        const prevZone = zoneAt(this.x, this.y).id;
        let moved = false;
        if (isWalkable(nx, ny, this.hatchOpen)) {
          this.x = nx; this.y = ny; moved = true;
        } else if (isWalkable(nx, this.y, this.hatchOpen)) {
          this.x = nx; moved = true;
        } else if (isWalkable(this.x, ny, this.hatchOpen)) {
          this.y = ny; moved = true;
        } else {
          this.bumpAccum += Math.abs(step);
          if (this.bumpAccum > 0.5) {
            this.bumpAccum = 0;
            this.cb.onHaptic('bump');
            if (!this.hatchOpen && dist(this.x, this.y, PLACES.hatch.x, PLACES.hatch.y) < 2.5) {
              this.cb.onAnnounce('The transfer hatch is still sealed.');
            } else {
              this.cb.onAnnounce('A wall.');
            }
          }
        }
        if (moved) {
          this.stepAccum += Math.abs(step);
          if (this.stepAccum > 0.9) {
            this.stepAccum = 0;
            this.cb.onHaptic('step');
          }
          const newZone = zoneAt(this.x, this.y).id;
          if (newZone !== prevZone) {
            this.cb.onAnnounce(`Entering the ${zoneAt(this.x, this.y).name}.`);
          }
        }
      }
    }

    // --- NPC schedules (independent; they never wait) ----------------------
    for (const p of NPC_PATHS) {
      const s = this.npcState.get(p.id)!;
      const target = p.waypoints[s.wp];
      const d = dist(s.x, s.y, target.x, target.y);
      if (d < 0.3) {
        s.wp = (s.wp + 1) % p.waypoints.length;
      } else {
        s.x += ((target.x - s.x) / d) * p.speed * dt;
        s.y += ((target.y - s.y) / d) * p.speed * dt;
      }
    }

    // --- native HRTF sync (throttled; no-op without the compiled module) ---
    if (this.soundOn && isNativeSpatialAudioAvailable() && now - this.lastNativeSync > NATIVE_SYNC_MS) {
      this.lastNativeSync = now;
      void syncNativeSpatialAudio(this.toSpatialWorld(), () => false).catch(() => {});
    }

    // --- triggers -----------------------------------------------------------
    for (const ev of this.events) {
      if (this.fired.has(ev.id)) continue;
      if (this.triggerMet(ev, t)) this.fire(ev, t);
    }

    this.cb.onStateChange();
    this.raf = requestAnimationFrame(this.loop);
  };

  private triggerMet(ev: ScriptEvent, t: number): boolean {
    const tr = ev.trigger;
    switch (tr.type) {
      case 'time':
        return t >= tr.atSeconds;
      case 'near':
        return dist(this.x, this.y, tr.x, tr.y) <= tr.radius;
      case 'cross':
        return this.y >= tr.y;
      case 'after': {
        const base = this.firedAt.get(tr.eventId);
        return base !== undefined && t - base >= tr.delaySeconds;
      }
      case 'linger': {
        if (dist(this.x, this.y, tr.x, tr.y) <= tr.radius) {
          if (!this.lingerStart.has(ev.id)) this.lingerStart.set(ev.id, t);
          return t - (this.lingerStart.get(ev.id) ?? t) >= tr.seconds;
        }
        this.lingerStart.delete(ev.id);
        return false;
      }
      case 'leave':
        return this.fired.has(tr.afterEventId) && dist(this.x, this.y, tr.x, tr.y) > tr.radius;
    }
  }

  private fire(ev: ScriptEvent, t: number) {
    this.fired.add(ev.id);
    this.firedAt.set(ev.id, t);
    const last = ev.lines.length - 1;
    ev.lines.forEach((line, i) => {
      this.lineQueue.push({ line, at: ev.at, effectAfter: i === last ? ev.effect : undefined });
    });
    this.drainQueue();
  }

  private drainQueue() {
    if (this.lineTimer || this.lineQueue.length === 0) return;
    const { line, at, effectAfter } = this.lineQueue.shift()!;
    this.emitLine(line, at);
    if (effectAfter) this.applyEffect(effectAfter);
    const holdMs = Math.max(1600, Math.min(5200, 900 + line.text.length * 42));
    this.lineTimer = setTimeout(() => {
      this.lineTimer = null;
      this.drainQueue();
    }, holdMs);
  }

  private emitLine(line: ScriptLine, at?: { x: number; y: number }) {
    const caption: Caption = {
      id: ++this.captionSeq,
      speaker: line.speaker,
      kind: line.kind,
      text: line.text,
    };
    this.cb.onCaption(caption);
    const spoken = line.speaker ? `${line.speaker}: ${line.text}` : line.text;
    this.cb.onAnnounce(spoken);
    if (line.kind === 'badge') {
      this.lastGuidance = line.text;
      this.badgeCue();
    } else if (at && (line.kind === 'npc' || line.kind === 'player') && this.soundOn) {
      // Direction cue at the speaker's position: stereo-panned in Expo Go,
      // true HRTF when the native engine is live (source already synced).
      const angle = this.relAngleDeg(at.x, at.y);
      const d = dist(this.x, this.y, at.x, at.y);
      const { left, right } = stereoGains(angle, d);
      this.cb.onPlayTone(spatialToneUri(494, left, right));
    }
  }

  private relAngleDeg(tx: number, ty: number): number {
    const bearing = Math.atan2(tx - this.x, ty - this.y);
    let rel = ((bearing - this.heading) * 180) / Math.PI;
    while (rel > 180) rel -= 360;
    while (rel < -180) rel += 360;
    return rel;
  }

  private badgeCue() {
    this.cb.onHaptic('badge');
    if (this.soundOn) this.cb.onPlayTone(spatialToneUri(880, 0.5, 0.5));
  }

  private applyEffect(effect: NonNullable<ScriptEvent['effect']>) {
    switch (effect) {
      case 'openHatch':
        this.hatchOpen = true;
        break;
      case 'brakingAudio':
        if (this.soundOn) this.cb.onPlayTone(spatialToneUri(65, 0.6, 0.6));
        break;
      case 'boardingAcoustics':
        break; // ambience colour shifts via the zone-filtered source set
      case 'badgePulse':
        this.cb.onHaptic('badge');
        break;
      case 'endGateOne':
        this.gateOneComplete = true;
        this.cb.onGateOneComplete();
        if (this.endTimer) clearTimeout(this.endTimer);
        this.endTimer = setTimeout(() => this.shutdown(), 6000);
        break;
    }
  }

  /** Stop the simulation and release timers/native audio. Idempotent. */
  private shutdown() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    if (this.lineTimer) {
      clearTimeout(this.lineTimer);
      this.lineTimer = null;
    }
    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }
    this.lineQueue = [];
    this.held.clear();
    void stopNativeSpatialAudio();
  }

  dispose() {
    this.shutdown();
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export { WALKABLE, PLACES };

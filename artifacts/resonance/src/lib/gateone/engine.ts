/**
 * Gate One engine — continuous physical traversal, trigger-driven authored
 * script, independent NPC schedules, layered spatial audio.
 *
 * Anti-shortcut protections (AAA Production Control Spec):
 * - Movement is continuous coordinates; there are NO location cards,
 *   destination menus, dialogue wheels, or teleports.
 * - "Look Around" and "Repeat guidance" DESCRIBE; they never move the player
 *   and are not a parallel navigation system.
 * - World geometry is stable (world.ts constants only).
 */
import {
  WALKABLE, PLACES, NPC_PATHS, PLAYER_START,
  isWalkable, zoneAt, dist, relativeDirection, type ZoneId,
} from "./world";
import { buildScript, type ScriptEvent, type ScriptLine } from "./script";
import { SpatialAudio, type AmbientProfile } from "./audio";
import type { CharacterId } from "./characters";

export type Caption = { id: number; speaker: string; kind: ScriptLine["kind"]; text: string };

export type EngineSnapshot = {
  x: number;
  y: number;
  heading: number;
  zone: ZoneId;
  zoneName: string;
  hatchOpen: boolean;
  gateOneComplete: boolean;
  npcs: { id: string; label: string; x: number; y: number }[];
};

export type EngineCallbacks = {
  onCaption: (c: Caption) => void;
  onAnnounce: (text: string) => void; // aria-live
  onStateChange: () => void;
  onGateOneComplete: () => void;
};

const TURN_SPEED = 2.4; // rad/s
const MOVE_SPEED = 2.1; // m/s

export class GateOneEngine {
  x = PLAYER_START.x;
  y = PLAYER_START.y;
  heading = PLAYER_START.heading;
  hatchOpen = false;
  gateOneComplete = false;

  private character: CharacterId;
  private events: ScriptEvent[];
  private fired = new Set<string>();
  private firedAt = new Map<string, number>();
  private lingerStart = new Map<string, number>();
  private startTime = 0;
  private lastFrame = 0;
  private raf = 0;
  private keys = new Set<string>();
  private captionSeq = 0;
  private stepAccum = 0;
  private stepAlt = false;
  private npcState = new Map<string, { x: number; y: number; wp: number }>();
  private audio = new SpatialAudio();
  private cb: EngineCallbacks;
  private running = false;
  private lineQueue: { line: ScriptLine; at?: { x: number; y: number }; effectAfter?: ScriptEvent["effect"] }[] = [];
  private lineTimer: ReturnType<typeof setTimeout> | null = null;
  private currentAmbient: AmbientProfile | null = null;
  private lastGuidance = "Hearth transfer intake: forward, through the central concourse.";

  constructor(
    character: CharacterId,
    cb: EngineCallbacks,
    restore?: { x: number; y: number; heading: number; fired: string[]; hatchOpen: boolean },
  ) {
    this.character = character;
    this.cb = cb;
    this.events = buildScript(character);
    if (restore) {
      // Validate restored state against the authorized world: only known
      // event ids; hatch state reconciled with the docking event; position
      // clamped to walkable geometry (else reset to the start).
      const known = new Set(this.events.map((e) => e.id));
      for (const id of restore.fired) {
        if (known.has(id)) {
          this.fired.add(id);
          // Seed timing base so "after" events restored mid-chain still fire.
          this.firedAt.set(id, 0);
        }
      }
      this.hatchOpen = restore.hatchOpen || this.fired.has("docking");
      const rx = restore.x;
      const ry = restore.y;
      if (
        Number.isFinite(rx) && Number.isFinite(ry) &&
        isWalkable(rx, ry, this.hatchOpen)
      ) {
        this.x = rx;
        this.y = ry;
        this.heading = Number.isFinite(restore.heading) ? restore.heading : 0;
      }
    }
    for (const p of NPC_PATHS) {
      this.npcState.set(p.id, { x: p.waypoints[0].x, y: p.waypoints[0].y, wp: 1 });
    }
  }

  /** Must be called from a user gesture so the AudioContext can start. */
  async start(soundOn: boolean, speechOn: boolean) {
    const ok = await this.audio.ensure();
    if (!ok) {
      this.cb.onAnnounce(
        "Audio could not start in this browser. Captions and descriptions carry everything sound does.",
      );
    }
    this.audio.setEnabled(soundOn);
    this.audio.setSpeechEnabled(speechOn);
    this.startTime = performance.now();
    this.lastFrame = this.startTime;
    this.running = true;
    this.applyAmbient();
    this.spawnZoneSources();
    this.loop();
  }

  setSound(on: boolean) { this.audio.setEnabled(on); }
  setSpeech(on: boolean) { this.audio.setSpeechEnabled(on); }

  keyDown(code: string) { this.keys.add(code); }
  keyUp(code: string) { this.keys.delete(code); }
  clearKeys() { this.keys.clear(); }

  getFiredEvents(): string[] { return [...this.fired]; }

  snapshot(): EngineSnapshot {
    const z = zoneAt(this.x, this.y);
    return {
      x: this.x, y: this.y, heading: this.heading,
      zone: z.id, zoneName: z.name,
      hatchOpen: this.hatchOpen,
      gateOneComplete: this.gateOneComplete,
      npcs: NPC_PATHS
        .filter((p) => p.zone === z.id || (z.id === "bridge" && p.zone === "hearth"))
        .map((p) => {
          const s = this.npcState.get(p.id)!;
          return { id: p.id, label: p.label, x: s.x, y: s.y };
        }),
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
    // End with an actionable instruction toward the current objective.
    parts.push(this.actionableInstruction());
    return parts.join(" ");
  }

  /** Repeat the latest badge guidance with a live direction. Descriptive only. */
  repeatGuidance(): string {
    const target = this.currentTarget();
    const dir = relativeDirection(this.x, this.y, this.heading, target.x, target.y);
    const d = Math.max(1, Math.round(dist(this.x, this.y, target.x, target.y)));
    this.audio.badgeChirp();
    vibrate(30);
    return `${this.lastGuidance} ${capitalize(target.hint)} is ${dir}, about ${d} metres. ${this.turnHelp(dir)}`;
  }

  private currentTarget(): { x: number; y: number; hint: string } {
    if (!this.hatchOpen) return { x: PLACES.hatch.x, y: PLACES.hatch.y, hint: "the transfer hatch" };
    if (this.gateOneComplete || this.fired.has("crew-scan"))
      return { x: PLACES.lift.x, y: PLACES.lift.y, hint: "the first lift" };
    if (this.y >= 78) return { x: PLACES.crewCheck.x, y: PLACES.crewCheck.y, hint: "the arrivals check" };
    if (this.y >= 62) return { x: PLACES.hearthThreshold.x, y: PLACES.hearthThreshold.y, hint: "the Hearth airlock" };
    if (this.y >= 40) return { x: 16, y: 60, hint: "the boarding bridge" };
    return { x: PLACES.junction.x, y: PLACES.junction.y, hint: "the central concourse" };
  }

  private actionableInstruction(): string {
    const target = this.currentTarget();
    const dir = relativeDirection(this.x, this.y, this.heading, target.x, target.y);
    return `To continue: ${capitalize(target.hint)} is ${dir}. ${this.turnHelp(dir)}`;
  }

  private turnHelp(dir: string): string {
    if (dir === "ahead") return "Move forward.";
    if (dir.includes("right") && dir.includes("behind")) return "Turn around to your right, then move forward.";
    if (dir.includes("left") && dir.includes("behind")) return "Turn around to your left, then move forward.";
    if (dir === "behind you") return "Turn around, then move forward.";
    if (dir.includes("right")) return "Turn right, then move forward.";
    if (dir.includes("left")) return "Turn left, then move forward.";
    return "Move forward.";
  }

  private loop = () => {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const t = (now - this.startTime) / 1000;

    // --- movement ---------------------------------------------------------
    let moved = false;
    if (!this.gateOneComplete) {
      if (this.keys.has("ArrowLeft") || this.keys.has("KeyA")) this.heading -= TURN_SPEED * dt;
      if (this.keys.has("ArrowRight") || this.keys.has("KeyD")) this.heading += TURN_SPEED * dt;
      let step = 0;
      if (this.keys.has("ArrowUp") || this.keys.has("KeyW")) step = MOVE_SPEED * dt;
      if (this.keys.has("ArrowDown") || this.keys.has("KeyS")) step = -MOVE_SPEED * 0.6 * dt;
      if (step !== 0) {
        const nx = this.x + Math.sin(this.heading) * step;
        const ny = this.y + Math.cos(this.heading) * step;
        const prevZone = zoneAt(this.x, this.y).id;
        if (isWalkable(nx, ny, this.hatchOpen)) {
          this.x = nx; this.y = ny; moved = true;
        } else if (isWalkable(nx, this.y, this.hatchOpen)) {
          this.x = nx; moved = true; // slide along wall
        } else if (isWalkable(this.x, ny, this.hatchOpen)) {
          this.y = ny; moved = true;
        } else {
          this.stepAccum += Math.abs(step);
          if (this.stepAccum > 0.5) {
            this.stepAccum = 0;
            this.audio.bump();
            if (!this.hatchOpen && dist(this.x, this.y, PLACES.hatch.x, PLACES.hatch.y) < 2.5) {
              this.cb.onAnnounce("The transfer hatch is still sealed.");
            } else {
              this.cb.onAnnounce("A wall.");
            }
          }
        }
        if (moved) {
          this.stepAccum += Math.abs(step);
          if (this.stepAccum > 0.72) {
            this.stepAccum = 0;
            this.stepAlt = !this.stepAlt;
            this.audio.footstep(this.stepAlt);
          }
          const newZone = zoneAt(this.x, this.y).id;
          if (newZone !== prevZone) {
            this.applyAmbient();
            this.spawnZoneSources();
            this.cb.onAnnounce(`Entering the ${zoneAt(this.x, this.y).name}.`);
          }
        }
      }
    }

    // --- NPC schedules (independent; they never wait) -----------------------
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
      this.audio.movePositional(`npc-${p.id}`, s.x, s.y);
    }

    // --- audio listener -----------------------------------------------------
    this.audio.updateListener(this.x, this.y, this.heading);

    // --- triggers ------------------------------------------------------------
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
      case "time":
        return t >= tr.atSeconds;
      case "near":
        return dist(this.x, this.y, tr.x, tr.y) <= tr.radius;
      case "cross":
        return this.y >= tr.y;
      case "after": {
        const base = this.firedAt.get(tr.eventId);
        return base !== undefined && t - base >= tr.delaySeconds;
      }
      case "linger": {
        if (dist(this.x, this.y, tr.x, tr.y) <= tr.radius) {
          if (!this.lingerStart.has(ev.id)) this.lingerStart.set(ev.id, t);
          return t - (this.lingerStart.get(ev.id) ?? t) >= tr.seconds;
        }
        this.lingerStart.delete(ev.id);
        return false;
      }
      case "leave":
        return (
          this.fired.has(tr.afterEventId) &&
          dist(this.x, this.y, tr.x, tr.y) > tr.radius
        );
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

  /** Lines are paced so overlapping triggers stay readable and listenable. */
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
    // In-world voices announce their DIRECTION with a spatial HRTF cue at the
    // speaker's position (browser speech synthesis itself cannot be panned).
    if (at && (line.kind === "npc" || line.kind === "player")) {
      this.audio.voiceCue(at.x, at.y);
    }
    const caption: Caption = {
      id: ++this.captionSeq,
      speaker: line.speaker,
      kind: line.kind,
      text: line.text,
    };
    this.cb.onCaption(caption);
    const spoken = line.speaker ? `${line.speaker}: ${line.text}` : line.text;
    this.cb.onAnnounce(spoken);
    if (line.kind === "badge") {
      this.audio.badgeChirp();
      vibrate(40);
      this.lastGuidance = line.text;
      this.audio.speak(line.text, { rate: 1.05, pitch: 1.1 });
    } else if (line.kind === "pa") {
      this.audio.speak(line.text, { rate: 0.98, pitch: 0.9 });
    } else if (line.kind === "narration") {
      this.audio.speak(line.text, { rate: 1.04 });
    } else {
      this.audio.speak(spoken, { rate: 1.0 });
    }
  }

  private applyEffect(effect: NonNullable<ScriptEvent["effect"]>) {
    switch (effect) {
      case "openHatch":
        this.hatchOpen = true;
        break;
      case "brakingAudio":
        this.audio.brakingShift();
        break;
      case "boardingAcoustics":
        this.applyAmbient();
        this.spawnZoneSources();
        break;
      case "badgePulse":
        vibrate([30, 60, 30]);
        break;
      case "endGateOne":
        this.gateOneComplete = true;
        this.cb.onGateOneComplete();
        // Terminal shutdown: let the closing line finish, then stop the
        // loop, timers, and audio graph entirely.
        setTimeout(() => this.shutdown(), 6000);
        break;
    }
  }

  private applyAmbient() {
    const z = zoneAt(this.x, this.y).id;
    const profile: AmbientProfile =
      z === "cabin" ? "cabin" : z === "concourse" ? "concourse" : z === "bridge" ? "bridge" : "hearth";
    if (profile !== this.currentAmbient) {
      this.currentAmbient = profile;
      this.audio.setAmbient(profile);
    }
  }

  /** Positional beds for the current zone's fixed features + NPC chatter. */
  private spawnZoneSources() {
    const z = zoneAt(this.x, this.y).id;
    // fixed features
    const fixtures: { id: string; x: number; y: number; kind: "chatter" | "machine" | "vent" | "memorial"; vol: number; zone: ZoneId }[] = [
      { id: "fx-child", x: PLACES.childAndParent.x, y: PLACES.childAndParent.y, kind: "chatter", vol: 0.25, zone: "cabin" },
      { id: "fx-sign", x: PLACES.signingEmployee.x, y: PLACES.signingEmployee.y, kind: "chatter", vol: 0.4, zone: "concourse" },
      { id: "fx-mem", x: PLACES.memorial.x, y: PLACES.memorial.y, kind: "memorial", vol: 0.18, zone: "concourse" },
      { id: "fx-berth", x: PLACES.berthWindow.x, y: PLACES.berthWindow.y, kind: "machine", vol: 0.3, zone: "concourse" },
      { id: "fx-wall", x: PLACES.wallWorker.x, y: PLACES.wallWorker.y, kind: "machine", vol: 0.35, zone: "hearth" },
      { id: "fx-arrivals", x: PLACES.crewCheck.x, y: PLACES.crewCheck.y, kind: "chatter", vol: 0.4, zone: "hearth" },
    ];
    for (const f of fixtures) {
      if (f.zone === z) this.audio.addPositionalLoop(f.id, f.x, f.y, f.kind, f.vol);
      else this.audio.removePositional(f.id);
    }
    for (const p of NPC_PATHS) {
      const s = this.npcState.get(p.id)!;
      if (p.zone === z) {
        this.audio.addPositionalLoop(
          `npc-${p.id}`, s.x, s.y,
          p.voice === "cart" ? "machine" : "chatter",
          p.voice === "child" ? 0.35 : 0.28,
        );
      } else {
        this.audio.removePositional(`npc-${p.id}`);
      }
    }
  }

  /** Stop the simulation and release all audio/timers. Idempotent. */
  private shutdown() {
    if (!this.running && !this.lineTimer) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
    if (this.lineTimer) {
      clearTimeout(this.lineTimer);
      this.lineTimer = null;
    }
    this.lineQueue = [];
    this.keys.clear();
    this.audio.dispose();
  }

  dispose() {
    this.shutdown();
  }
}

function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

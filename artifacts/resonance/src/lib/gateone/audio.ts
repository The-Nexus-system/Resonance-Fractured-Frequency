/**
 * Gate One layered spatial audio — Web Audio API with HRTF panning.
 *
 * Sound sources (Gate One audio wiring, phase 1 — environments):
 * - Zone beds and mapped positional fixtures play REGISTERED audio files
 *   (assets/REGISTRY.json; served from /audio/gateone/) composed per zone
 *   from layered recordings — see the Gate One wiring map.
 * - The original synthesised beds remain as a FALLBACK ONLY: they start
 *   immediately (no silent gap) and fade out once every file layer of the
 *   current profile is playing. Unmapped fixtures (memorial, wall worker),
 *   NPC/cart loops, event one-shots, footsteps and earcons are still
 *   synthesised in this phase; those layers are scaffolding pending their
 *   own wiring phases and must not be mistaken for finished audio.
 * Speech is delivered via captions + optional browser speech synthesis (a
 * personal, non-spatial channel — the badge and narration are "with you",
 * world voices are attributed in captions).
 */

export type AmbientProfile = "cabin" | "concourse" | "bridge" | "hearth";

type Positional = {
  panner: PannerNode;
  gain: GainNode;
  stop: () => void;
};

/** Registered file layers per zone profile (wiring map identities in brackets). */
const BED_LAYERS: Record<AmbientProfile, { file: string; volume: number; lowpass?: number }[]> = {
  cabin: [
    { file: "pod__735.ogg", volume: 0.55 }, // [01] transport pod bed — main
    { file: "background1__1109.ogg", volume: 0.3, lowpass: 600 }, // [14] deep hull bed, low layer
  ],
  concourse: [
    { file: "pod__735.ogg", volume: 0.28 }, // [01] same transport presence, set back
    { file: "chatter__328.ogg", volume: 0.34 }, // [05] crowd wash
    { file: "background4__1112.ogg", volume: 0.26 }, // [14] deep hull bed
    { file: "boilerRoom06.ogg", volume: 0.2, lowpass: 500 }, // [07] concourse HVAC — SONNISS boiler-room texture (phase 6)
  ],
  bridge: [
    { file: "background3__1111.ogg", volume: 0.5 }, // [15] bridge interior bed — main
    { file: "geofon17.ogg", volume: 0.3, lowpass: 300 }, // [12] geophone rumble base — SONNISS (phase 6)
  ],
  hearth: [
    { file: "background2__1110.ogg", volume: 0.5 }, // [15] Hearth interior bed — main
    { file: "pod__735.ogg", volume: 0.22 }, // [01] ship systems beneath
    { file: "chatter__328.ogg", volume: 0.16 }, // [05] arrivals presence
  ],
};

/** Positional fixtures with a registered file (wiring map). Keyed by fixture id. */
const FIXTURE_FILES: Record<string, { file: string; lowpass?: number }> = {
  "fx-berth": { file: "dockingBay__164.ogg", lowpass: 900 }, // [11] berth viewport machinery
  "fx-child": { file: "chatter__328.ogg" }, // [05] chatter fixtures
  "fx-sign": { file: "chatter__328.ogg" },
  "fx-arrivals": { file: "chatter__328.ogg" },
};

/** Bridge accent rotation: hull creaks [12] + starship deck plates [12]. */
const BRIDGE_ACCENTS = [
  "creak1__1126.ogg", "creak2__1127.ogg", "creak3__1128.ogg", "creak4__1129.ogg",
  "starship1__1527.ogg", "starship2__1528.ogg", "starship3__1529.ogg", "starship4__1530.ogg",
  "starship5__1531.ogg", "starship6__1532.ogg", "starship7__1533.ogg", "starship8__1534.ogg",
];

const STEP_GRATING: string[] = [
  "starship1__1527.ogg", "starship2__1528.ogg", "starship3__1529.ogg", "starship4__1530.ogg",
  "starship5__1531.ogg", "starship6__1532.ogg", "starship7__1533.ogg", "starship8__1534.ogg",
];

/** Gate One file wiring, phase 3-5 (wiring map, Oct 17 2026).
 *  Positional one-shot sets + interface palette + footstep surfaces.
 *  Every entry is a registered asset (RSN-SFX-009..076). */
const PAPER_FILES: string[] = [
  "crumble1__624.ogg", "crumble2__625.ogg", "crumble3__626.ogg", "page__627.ogg", "paste__628.ogg",
];
const PA_FILES: Record<string, string[]> = {
  concourse: ["announcement__326.ogg", "paYou__345.ogg"],
  hearth: ["announcement__693.ogg", "arrive1__694.ogg", "leave1__699.ogg"],
};
const VOICE_BAND_FILES: string[] = ["say__350.ogg", "directsay__331.ogg"];
const VOICE_SPOTS: Record<string, { x: number; y: number }[]> = {
  concourse: [{ x: -14, y: 40 }, { x: 10, y: 52 }, { x: -4, y: 36 }],
  hearth: [{ x: 10, y: 86 }],
};
const UI_FILES: Record<string, string> = {
  confirm: "beep1__575.ogg", select: "beep2__586.ogg", badge: "beep10__576.ogg",
  error: "beep20__587.ogg", scan: "beep23__590.ogg",
};
const STEP_CABIN: string[] = [
  "indoors1__1514.ogg", "indoors2__1515.ogg", "indoors3__1516.ogg", "indoors4__1517.ogg",
];
const STEP_STONE_L: string[] = ["Fantozzi-StoneL1.ogg", "Fantozzi-StoneL2.ogg", "Fantozzi-StoneL3.ogg"];
const STEP_STONE_R: string[] = ["Fantozzi-StoneR1.ogg", "Fantozzi-StoneR2.ogg", "Fantozzi-StoneR3.ogg"];
const STEP_HEARTH: string[] = [
  "station1.ogg", "station2.ogg", "station3.ogg", "station4.ogg",
  "station5.ogg", "station6.ogg", "station7.ogg", "station8.ogg",
];

function audioUrl(file: string): string {
  // Public assets are served relative to the app base; resolve against the
  // document so sub-path deployments keep working.
  return new URL(`audio/gateone/${file}`, document.baseURI).href;
}

function makeNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // pink-ish noise via simple low-pass random walk
    const white = Math.random() * 2 - 1;
    last = last * 0.96 + white * 0.04;
    data[i] = last * 3.2;
  }
  return buffer;
}

export class SpatialAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambient: { stop: () => void }[] = [];
  private sources = new Map<string, Positional>();
  private enabled = true;
  private speechEnabled = true;
  private brakingOsc: OscillatorNode | null = null;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private ambientGen = 0;
  private accentTimer: ReturnType<typeof setTimeout> | null = null;
  private sceneTimer: ReturnType<typeof setInterval> | null = null;
  private sceneProfile: string = "";
  private sceneT = 0;
  private nextPA = 6;
  private nextVoice = 4;
  private nextPaper = 3;
  private paIdx = 0;
  private lastStep = "";

  async ensure(): Promise<boolean> {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume().catch(() => {});
      return true;
    }
    try {
      const ctx = new AudioContext();
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(ctx.destination);
      this.noise = makeNoiseBuffer(ctx);
      return true;
    } catch {
      return false;
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? 0.6 : 0;
  }
  setSpeechEnabled(on: boolean) {
    this.speechEnabled = on;
    if (!on && typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }

  /** Fetch + decode a registered audio file once; null on any failure. */
  private loadBuffer(file: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(file);
    if (!p) {
      p = (async () => {
        if (!this.ctx) return null;
        try {
          const res = await fetch(audioUrl(file));
          if (!res.ok) return null;
          const raw = await res.arrayBuffer();
          return await this.ctx.decodeAudioData(raw);
        } catch {
          return null;
        }
      })();
      this.buffers.set(file, p);
    }
    return p;
  }

  updateListener(x: number, y: number, heading: number) {
    if (!this.ctx) return;
    const l = this.ctx.listener;
    // Map world (x, y) to audio (x, 0, -y): forward = -Z in Web Audio.
    const fx = Math.sin(heading);
    const fz = -Math.cos(heading);
    try {
      if (l.positionX) {
        const t = this.ctx.currentTime;
        l.positionX.setTargetAtTime(x, t, 0.05);
        l.positionY.setTargetAtTime(0, t, 0.05);
        l.positionZ.setTargetAtTime(-y, t, 0.05);
        l.forwardX.setTargetAtTime(fx, t, 0.05);
        l.forwardY.setTargetAtTime(0, t, 0.05);
        l.forwardZ.setTargetAtTime(fz, t, 0.05);
        l.upX.setTargetAtTime(0, t, 0.05);
        l.upY.setTargetAtTime(1, t, 0.05);
        l.upZ.setTargetAtTime(0, t, 0.05);
      } else {
        // eslint-disable-next-line deprecation/deprecation
        l.setPosition(x, 0, -y);
        // eslint-disable-next-line deprecation/deprecation
        l.setOrientation(fx, 0, fz, 0, 1, 0);
      }
    } catch {
      /* listener update best-effort */
    }
  }

  private makePanner(x: number, y: number): PannerNode {
    const p = this.ctx!.createPanner();
    p.panningModel = "HRTF";
    p.distanceModel = "inverse";
    p.refDistance = 1.5;
    p.maxDistance = 60;
    p.rolloffFactor = 1.4;
    p.positionX?.setValueAtTime(x, this.ctx!.currentTime);
    p.positionZ?.setValueAtTime(-y, this.ctx!.currentTime);
    return p;
  }

  /** Continuous positional loop for an entity; call movePositional each frame. */
  addPositionalLoop(
    id: string,
    x: number,
    y: number,
    kind: "chatter" | "machine" | "vent" | "memorial",
    volume = 0.5,
  ) {
    if (!this.ctx || !this.noise || this.sources.has(id)) return;
    const ctx = this.ctx;
    const panner = this.makePanner(x, y);
    const gain = ctx.createGain();
    gain.gain.value = volume;

    const fixture = FIXTURE_FILES[id];
    if (fixture) {
      // Registered file loop. The entry exists immediately (silent) so
      // movePositional works while the file decodes; on failure the source
      // simply stays silent and the zone bed still carries the space.
      let src: AudioBufferSourceNode | null = null;
      let cancelled = false;
      let lfo: OscillatorNode | null = null;
      this.loadBuffer(fixture.file).then((buf) => {
        if (cancelled || !buf) return;
        src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        let node: AudioNode = src;
        if (fixture.lowpass) {
          const f = ctx.createBiquadFilter();
          f.type = "lowpass";
          f.frequency.value = fixture.lowpass;
          node.connect(f);
          node = f;
        }
        node.connect(gain).connect(panner).connect(this.master!);
        src.start();
        if (kind === "chatter") {
          lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.23 + Math.random() * 0.3;
          lfoGain.gain.value = volume * 0.45;
          lfo.connect(lfoGain).connect(gain.gain);
          lfo.start();
        }
      });
      this.sources.set(id, {
        panner,
        gain,
        stop: () => {
          cancelled = true;
          try { src?.stop(); lfo?.stop(); } catch { /* already stopped */ }
        },
      });
      return;
    }

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    if (kind === "chatter") {
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 0.8;
    } else if (kind === "machine") {
      filter.type = "lowpass";
      filter.frequency.value = 220;
    } else if (kind === "memorial") {
      filter.type = "bandpass";
      filter.frequency.value = 520;
      filter.Q.value = 6;
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 400;
    }
    src.connect(filter).connect(gain).connect(panner).connect(this.master!);
    src.start();

    // chatter gets a slow amplitude wobble so crowds feel alive, not static
    let lfoStop = () => {};
    if (kind === "chatter") {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.23 + Math.random() * 0.3;
      lfoGain.gain.value = volume * 0.45;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
      lfoStop = () => lfo.stop();
    }

    this.sources.set(id, {
      panner,
      gain,
      stop: () => {
        try { src.stop(); lfoStop(); } catch { /* already stopped */ }
      },
    });
  }

  movePositional(id: string, x: number, y: number) {
    const s = this.sources.get(id);
    if (!s || !this.ctx) return;
    const t = this.ctx.currentTime;
    s.panner.positionX?.setTargetAtTime(x, t, 0.1);
    s.panner.positionZ?.setTargetAtTime(-y, t, 0.1);
  }

  removePositional(id: string) {
    const s = this.sources.get(id);
    if (s) {
      s.stop();
      this.sources.delete(id);
    }
  }

  /**
   * One positional one-shot of a registered file (bridge accents, hatch
   * cycle, braking event). Safe to call before the file has decoded; the
   * shot is simply skipped if the file cannot load.
   */
  playFileOnce(file: string, x: number, y: number, volume: number, delayMs = 0) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const fire = () => {
      this.loadBuffer(file).then((buf) => {
        if (!buf || !this.ctx) return;
        const panner = this.makePanner(x, y);
        const gain = ctx.createGain();
        gain.gain.value = volume;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(gain).connect(panner).connect(this.master!);
        src.start();
      });
    };
    if (delayMs > 0) setTimeout(fire, delayMs);
    else fire();
  }

  /** Zone ambient bed. Replaces the previous bed with a short crossfade. */
  setAmbient(profile: AmbientProfile) {
    if (!this.ctx || !this.noise || !this.master) return;
    const ctx = this.ctx;
    for (const a of this.ambient) a.stop();
    this.ambient = [];
    if (this.accentTimer) {
      clearTimeout(this.accentTimer);
      this.accentTimer = null;
    }
    const gen = ++this.ambientGen;

    const synthStops: (() => void)[] = [];
    const mk = (type: BiquadFilterType, freq: number, vol: number, oscFreq?: number) => {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.8);
      let stopInner: () => void;
      if (oscFreq) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = oscFreq;
        osc.connect(gain).connect(this.master!);
        osc.start();
        stopInner = () => { try { osc.stop(ctx.currentTime + 1); } catch { /**/ } };
      } else {
        const src = ctx.createBufferSource();
        src.buffer = this.noise!;
        src.loop = true;
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        src.connect(f).connect(gain).connect(this.master!);
        src.start();
        stopInner = () => { try { src.stop(ctx.currentTime + 1); } catch { /**/ } };
      }
      const stop = () => {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
        setTimeout(stopInner, 1200);
      };
      synthStops.push(stop);
      this.ambient.push({ stop });
    };

    // Synthesised fallback bed (scaffolding): audible immediately so a zone
    // is never silent while files load; faded out below once every file
    // layer of this profile is playing. If any file fails, it stays.
    if (profile === "cabin") {
      mk("lowpass", 140, 0.20);          // engine rumble bed
      mk("lowpass", 0, 0.05, 62);        // engine fundamental hum
    } else if (profile === "concourse") {
      mk("lowpass", 500, 0.10);          // hall air
      mk("bandpass", 1000, 0.05);        // distant crowd wash
    } else if (profile === "bridge") {
      mk("lowpass", 300, 0.08);          // narrow corridor air
      mk("lowpass", 0, 0.03, 84);        // structural hum
    } else {
      mk("lowpass", 260, 0.14);          // Hearth ventilation — different colour
      mk("lowpass", 0, 0.045, 49);       // deeper hull resonance
      mk("bandpass", 800, 0.05);         // more people
    }

    // Registered file layers for this profile.
    const layers = BED_LAYERS[profile];
    const fileStops: (() => void)[] = [];
    let ready = 0;
    let failed = false;
    for (const layer of layers) {
      this.loadBuffer(layer.file).then((buf) => {
        if (gen !== this.ambientGen) return;
        if (!buf) {
          failed = true;
          return;
        }
        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.gain.setTargetAtTime(layer.volume, ctx.currentTime, 0.8);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        let node: AudioNode = src;
        if (layer.lowpass) {
          const f = ctx.createBiquadFilter();
          f.type = "lowpass";
          f.frequency.value = layer.lowpass;
          node.connect(f);
          node = f;
        }
        node.connect(gain).connect(this.master!);
        src.start();
        const stop = () => {
          gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
          setTimeout(() => { try { src.stop(); } catch { /**/ } }, 1200);
        };
        fileStops.push(stop);
        this.ambient.push({ stop });
        ready++;
        if (ready === layers.length && !failed) {
          // The real environment is fully up — retire the synth fallback.
          for (const s of synthStops) s();
        }
      });
    }

    // Bridge accents: occasional positional creaks and deck ticks [12].
    if (profile === "bridge") {
      const tick = () => {
        if (gen !== this.ambientGen) return;
        const file = BRIDGE_ACCENTS[Math.floor(Math.random() * BRIDGE_ACCENTS.length)];
        const x = -8 + Math.random() * 16;
        const y = 64 + Math.random() * 12;
        this.playFileOnce(file, x, y, file.startsWith("creak") ? 0.5 : 0.3);
        this.accentTimer = setTimeout(tick, 9000 + Math.random() * 11000);
      };
      this.accentTimer = setTimeout(tick, 4000 + Math.random() * 4000);
    }
    this.startScene(profile);
  }

  /** Periodic in-world one-shots for the current zone (wiring map phase 3):
   *  cabin paper foley at the reader's seat, concourse/hearth PA rotation,
   *  and short voice-band phrases at traveller spots. All positional. */
  private startScene(profile: string) {
    if (this.sceneTimer) { clearInterval(this.sceneTimer); this.sceneTimer = null; }
    this.sceneProfile = profile;
    this.sceneT = 0;
    this.nextPA = 6; this.nextVoice = 4; this.nextPaper = 3;
    if (!this.ctx) return;
    this.sceneTimer = setInterval(() => {
      if (!this.enabled || !this.ctx || !this.master) return;
      this.sceneT += 1;
      const p = this.sceneProfile;
      if (p === "cabin" && this.sceneT >= this.nextPaper) {
        this.nextPaper = this.sceneT + 6 + Math.random() * 6;
        this.playFileOnce(PAPER_FILES[Math.floor(Math.random() * PAPER_FILES.length)], -9, 28, 0.4);
      }
      const pa = PA_FILES[p];
      if (pa && this.sceneT >= this.nextPA) {
        this.nextPA = this.sceneT + 16 + Math.random() * 12;
        const pos = p === "hearth" ? { x: 16, y: 88 } : { x: 0, y: 44 };
        this.playFileOnce(pa[this.paIdx++ % pa.length], pos.x, pos.y, 0.5);
      }
      const spots = VOICE_SPOTS[p];
      if (spots && this.sceneT >= this.nextVoice) {
        this.nextVoice = this.sceneT + 8 + Math.random() * 8;
        const s = spots[Math.floor(Math.random() * spots.length)];
        this.playFileOnce(VOICE_BAND_FILES[Math.floor(Math.random() * VOICE_BAND_FILES.length)], s.x, s.y, 0.45);
      }
    }, 1000);
  }

  /** Non-positional one-shot through the master bus (the player's own
   *  sounds: interface, footsteps). Silent until the file has loaded. */
  playSelfOnce(file: string, volume = 0.5) {
    if (!this.ctx || !this.master || !this.enabled) return;
    const ctx = this.ctx;
    const master = this.master;
    void this.loadBuffer(file).then((buf) => {
      if (!buf || !this.enabled) return;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = volume;
      src.connect(g).connect(master);
      src.start();
    });
  }

  /** Interface palette [08]: one consistent beep per meaning, everywhere. */
  uiSound(name: "confirm" | "select" | "badge" | "error" | "scan") {
    const f = UI_FILES[name];
    if (f) this.playSelfOnce(f, 0.5);
  }

  /**
   * Engine braking event: the recorded braking one-shot at the cabin
   * viewport [02] over a softened synthesised pitch drop (the ship's hum
   * falling — kept as a layer because the recording carries the brake
   * mechanics, not the hum itself).
   */
  brakingShift() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    this.playFileOnce("decelerate2__1210.ogg", 0, 34, 0.85);
    this.playFileOnce("buckle1.ogg", 0, 20, 0.4); // [01] restraint buckle at the seats (phase 6)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(88, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 3.2);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 6);
    this.brakingOsc = osc;
  }

  /** Badge earcon: soft two-tone chirp, personal (non-spatial). */
  badgeChirp() {
    this.uiSound("badge");
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    for (const [i, f] of [740, 988].entries()) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.14);
      osc.connect(g).connect(this.master);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.2);
    }
  }

  /**
   * Spatial voice cue: a short HRTF-panned voice-band burst at the speaker's
   * world position, so the DIRECTION of an in-world voice is audible even
   * though browser speech synthesis itself cannot be routed spatially.
   */
  voiceCue(x: number, y: number) {
    if (!this.ctx || !this.master || !this.noise) return;
    const ctx = this.ctx;
    const panner = this.makePanner(x, y);
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1100;
    f.Q.value = 1.2;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    src.connect(f).connect(g).connect(panner).connect(this.master);
    src.start(t, Math.random(), 0.6);
  }

  /** Single soft footstep tick; alternate slightly for left/right. */
  footstep(alt: boolean, surface?: string) {
    // Recorded surfaces (wiring map phase 5): cabin boards, concourse stone
    // (Fantozzi CC0, left/right matched to the step), bridge grating plates.
    // The Hearth deck has its own recorded set (station steps, phase 6) —
    // the cabin set is never reused there (design rule: a surface's sound
    // belongs to that surface).
    if (surface === "cabin" || surface === "stone" || surface === "grating" || surface === "hearth") {
      const set = surface === "cabin" ? STEP_CABIN
        : surface === "grating" ? STEP_GRATING
        : surface === "hearth" ? STEP_HEARTH
        : alt ? STEP_STONE_R : STEP_STONE_L;
      let f = set[Math.floor(Math.random() * set.length)];
      if (f === this.lastStep && set.length > 1) f = set[(set.indexOf(f) + 1) % set.length];
      this.lastStep = f;
      this.playSelfOnce(f, surface === "grating" ? 0.4 : 0.5);
      return;
    }
    if (!this.ctx || !this.master || !this.enabled) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = alt ? 240 : 200;
    f.Q.value = 2;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    src.connect(f).connect(g).connect(this.master);
    src.start(t, Math.random(), 0.09);
  }

  /** Wall bump feedback. */
  bump() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 110;
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  speak(text: string, opts?: { rate?: number; pitch?: number }) {
    if (!this.speechEnabled || typeof speechSynthesis === "undefined") return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts?.rate ?? 1.02;
      u.pitch = opts?.pitch ?? 1;
      speechSynthesis.speak(u);
    } catch {
      /* speech best-effort */
    }
  }

  stopSpeech() {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }

  dispose() {
    this.stopSpeech();
    if (this.accentTimer) {
      clearTimeout(this.accentTimer);
      this.accentTimer = null;
    }
    this.ambientGen++;
    for (const a of this.ambient) a.stop();
    for (const [, s] of this.sources) s.stop();
    this.sources.clear();
    this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}

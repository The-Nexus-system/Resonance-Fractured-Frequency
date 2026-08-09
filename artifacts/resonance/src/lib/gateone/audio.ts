/**
 * Gate One layered spatial audio — Web Audio API with HRTF panning.
 * All sound is synthesised (no assets): ambient beds, positional sources,
 * footsteps, badge earcons. Speech is delivered via captions + optional
 * browser speech synthesis (a personal, non-spatial channel — the badge and
 * narration are "with you", world voices are attributed in captions).
 */

export type AmbientProfile = "cabin" | "concourse" | "bridge" | "hearth";

type Positional = {
  panner: PannerNode;
  gain: GainNode;
  stop: () => void;
};

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

  /** Zone ambient bed. Replaces the previous bed with a short crossfade. */
  setAmbient(profile: AmbientProfile) {
    if (!this.ctx || !this.noise || !this.master) return;
    const ctx = this.ctx;
    for (const a of this.ambient) a.stop();
    this.ambient = [];

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
      this.ambient.push({ stop });
    };

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
  }

  /** Engine braking: audible pitch drop on the cabin hum. */
  brakingShift() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(88, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 3.2);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 6);
    this.brakingOsc = osc;
  }

  /** Badge earcon: soft two-tone chirp, personal (non-spatial). */
  badgeChirp() {
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
  footstep(alt: boolean) {
    if (!this.ctx || !this.master || !this.noise) return;
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
    for (const a of this.ambient) a.stop();
    for (const [, s] of this.sources) s.stop();
    this.sources.clear();
    this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}

/**
 * Musical synth — renders one or more musical voices into a single stereo
 * 16-bit WAV data URI. Supports timbres, per-voice stereo pan, gain, and
 * detuned twin oscillators (fracture instability = audible beating).
 *
 * Pure computation: safe to unit test in node.
 */

import { detuneFreq, type Timbre } from './theory';

const SAMPLE_RATE = 22050;

export type RenderVoice = {
  freq: number;
  gain: number; // 0..1 pre-mix
  pan: number; // -1 (left) .. 1 (right)
  timbre: Timbre;
  detuneCents?: number; // >0 adds a detuned twin → beating
};

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function bytesToBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    out += BASE64[b0 >> 2];
    out += BASE64[((b0 & 3) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? '=' : BASE64[((b1 & 15) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? '=' : BASE64[b2 & 63];
  }
  return out;
}
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/**
 * Additive recipe per timbre: [partialMultiple, relativeGain][].
 * Voice identities (Phase 4 completion — richer than raw oscillator tones):
 *  - drone   (low F): warm foundation — full even/odd partial ladder with a
 *    soft body resonance around the 2nd partial and a slow chorus swell.
 *  - chime   (A): bell-like — slightly INHARMONIC upper partials (real bells
 *    are never integer-perfect) with a long singing decay and slow vibrato.
 *  - pulse   (C): structural voice — hollow odd-partial core with a soft
 *    percussive re-strike each beat rather than a bare amplitude wobble.
 *  - shimmer (high F): air and light — high partial ladder whose upper
 *    partials breathe against each other, plus a whisper of filtered noise.
 */
const TIMBRE_HARMONICS: Record<Timbre, [number, number][]> = {
  chime: [
    [1, 1],
    [2.02, 0.55], // slightly inharmonic: bell body
    [3.01, 0.28],
    [4.16, 0.14],
    [5.43, 0.07], // hum partials fade fast (handled in envelope)
  ],
  drone: [
    [0.5, 0.18], // sub-octave body warmth
    [1, 1],
    [2, 0.42],
    [3, 0.2],
    [4, 0.09],
    [5, 0.05],
  ],
  pulse: [
    [1, 1],
    [2, 0.3],
    [3, 0.35], // hollow, odd-leaning core
    [5, 0.12],
  ],
  shimmer: [
    [1, 0.5],
    [2, 0.55],
    [3, 0.5],
    [4, 0.3],
    [5, 0.28],
    [6, 0.16],
    [8, 0.1],
  ],
};

/** Deterministic pseudo-noise (no Math.random: renders stay cacheable). */
function noiseAt(t: number, freq: number): number {
  const x = Math.sin(t * 12345.678 + freq) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function voiceSample(v: RenderVoice, t: number, durationS: number): number {
  const harmonics = TIMBRE_HARMONICS[v.timbre];

  // Gentle vibrato per timbre — musical motion, not siren wobble.
  let vibrato = 0;
  if (v.timbre === 'chime') vibrato = Math.sin(2 * Math.PI * 4.5 * t) * 0.0018;
  if (v.timbre === 'drone') vibrato = Math.sin(2 * Math.PI * 0.35 * t) * 0.0012; // slow chorus swell
  if (v.timbre === 'shimmer') vibrato = Math.sin(2 * Math.PI * 5.5 * t) * 0.0025;
  const f0 = v.freq * (1 + vibrato);

  let s = 0;
  for (let hi = 0; hi < harmonics.length; hi++) {
    const [mult, g] = harmonics[hi];
    // Upper partials of the chime decay faster than the fundamental (bell physics).
    const partialDecay =
      v.timbre === 'chime' ? Math.exp(-(hi * 0.9) * (t / durationS) * 2) : 1;
    // Shimmer upper partials breathe slowly against each other.
    const breathe =
      v.timbre === 'shimmer' && hi >= 3
        ? 0.7 + 0.3 * Math.sin(2 * Math.PI * (0.4 + hi * 0.13) * t)
        : 1;
    s += Math.sin(2 * Math.PI * f0 * mult * t) * g * partialDecay * breathe;
    if (v.detuneCents && v.detuneCents > 0) {
      // Detuned twin at half strength — creates beating (instability).
      s +=
        Math.sin(2 * Math.PI * detuneFreq(f0, v.detuneCents) * mult * t) *
        g * 0.5 * partialDecay * breathe;
    }
  }

  // A whisper of "air": band-limited noise for shimmer, sub-audible texture
  // for the drone body. Fractured voices get grittier air (granular
  // instability); resolved voices keep only a clean trace of it.
  const airAmount =
    v.timbre === 'shimmer' ? 0.05 : v.timbre === 'drone' ? 0.02 : 0;
  const grit = v.detuneCents && v.detuneCents > 0 ? 1 + v.detuneCents / 8 : 1;
  if (airAmount > 0) {
    // Two nearby noise taps average into softer, band-limited hiss.
    const n = (noiseAt(t, v.freq) + noiseAt(t + 0.0004, v.freq)) * 0.5;
    s += n * airAmount * grit;
  }

  // Envelope: soft attack, gentle exponential release.
  const attack = v.timbre === 'chime' ? 0.02 : 0.06; // bells speak faster
  const attackGain = t < attack ? t / attack : 1;
  const release = Math.exp(-1.8 * (t / durationS));
  let env = attackGain * release;
  if (v.timbre === 'pulse') {
    // Soft re-strike each beat (~2.2 Hz): each pulse gets its own little
    // percussive envelope instead of a bare sine wobble.
    const beatHz = 2.2;
    const phase = (t * beatHz) % 1;
    const strike = Math.exp(-5.5 * phase);
    env *= 0.35 + 0.65 * strike;
  }
  return s * env * v.gain;
}

/** Equal-power stereo gains for a pan value in -1..1. */
export function panGains(pan: number): { left: number; right: number } {
  const p = Math.max(-1, Math.min(1, pan));
  const angle = ((p + 1) / 2) * (Math.PI / 2);
  return { left: Math.cos(angle), right: Math.sin(angle) };
}

const cache = new Map<string, string>();

/**
 * Render voices to a stereo WAV data URI. Deterministic and cached: the same
 * voices always produce the same sound (stable sound-object identity).
 */
export function renderVoicesUri(voices: RenderVoice[], durationS = 2.4): string {
  const key = JSON.stringify([durationS, voices.map((v) => [v.freq, v.gain, v.pan, v.timbre, v.detuneCents ?? 0])]);
  const hit = cache.get(key);
  if (hit) return hit;

  const numSamples = Math.floor(SAMPLE_RATE * durationS);
  const dataSize = numSamples * 4;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const gains = voices.map((v) => panGains(v.pan));
  // Normalisation guard so stacked chords never clip.
  const totalGain = voices.reduce((acc, v) => acc + v.gain, 0);
  const norm = totalGain > 0.6 ? 0.6 / totalGain : 1;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let l = 0;
    let r = 0;
    for (let vi = 0; vi < voices.length; vi++) {
      const s = voiceSample(voices[vi], t, durationS) * norm;
      l += s * gains[vi].left;
      r += s * gains[vi].right;
    }
    view.setInt16(44 + i * 4, Math.round(Math.max(-1, Math.min(1, l)) * 32767), true);
    view.setInt16(46 + i * 4, Math.round(Math.max(-1, Math.min(1, r)) * 32767), true);
  }
  const uri = `data:audio/wav;base64,${bytesToBase64(new Uint8Array(buffer))}`;
  cache.set(key, uri);
  return uri;
}

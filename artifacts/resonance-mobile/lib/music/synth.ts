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

/** Additive-harmonic recipe per timbre: [harmonicMultiple, relativeGain][] */
const TIMBRE_HARMONICS: Record<Timbre, [number, number][]> = {
  chime: [
    [1, 1],
    [2, 0.4],
    [3, 0.18],
    [4.2, 0.08],
  ],
  drone: [
    [1, 1],
    [2, 0.25],
    [3, 0.1],
  ],
  pulse: [
    [1, 1],
    [2, 0.5],
  ],
  shimmer: [
    [1, 0.6],
    [2, 0.5],
    [3, 0.45],
    [5, 0.25],
  ],
};

function voiceSample(v: RenderVoice, t: number, durationS: number): number {
  const harmonics = TIMBRE_HARMONICS[v.timbre];
  let s = 0;
  for (const [mult, g] of harmonics) {
    s += Math.sin(2 * Math.PI * v.freq * mult * t) * g;
    if (v.detuneCents && v.detuneCents > 0) {
      // Detuned twin at half strength — creates beating (instability).
      s += Math.sin(2 * Math.PI * detuneFreq(v.freq, v.detuneCents) * mult * t) * g * 0.5;
    }
  }
  // Envelope: soft attack, gentle exponential release.
  const attack = 0.06;
  const attackGain = t < attack ? t / attack : 1;
  const release = Math.exp(-1.8 * (t / durationS));
  let env = attackGain * release;
  if (v.timbre === 'pulse') {
    // Slow amplitude pulse (~2.2 Hz) — rhythmic identity, never harsh.
    env *= 0.55 + 0.45 * Math.sin(2 * Math.PI * 2.2 * t - Math.PI / 2);
  }
  if (v.timbre === 'shimmer') {
    env *= 0.75 + 0.25 * Math.sin(2 * Math.PI * 0.9 * t);
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

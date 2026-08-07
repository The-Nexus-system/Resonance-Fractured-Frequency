/**
 * Synthesised sine tones, matching the web build's Web Audio cues
 * (220/330/440/550 Hz node tones, 150 Hz error buzz).
 *
 * React Native has no oscillator API, so we synthesise a small 16-bit mono
 * WAV in memory and expose it as a base64 data URI playable by expo-audio.
 */

const SAMPLE_RATE = 22050;
const DURATION_S = 1.2;

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    out += BASE64_CHARS[b0 >> 2];
    out += BASE64_CHARS[((b0 & 3) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? '=' : BASE64_CHARS[((b1 & 15) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? '=' : BASE64_CHARS[b2 & 63];
  }
  return out;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function synthesizeWav(freq: number): Uint8Array {
  const numSamples = Math.floor(SAMPLE_RATE * DURATION_S);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const attack = Math.floor(SAMPLE_RATE * 0.05);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Gentle attack, exponential-style decay — mirrors the web envelope.
    const attackGain = i < attack ? i / attack : 1;
    const decayGain = Math.exp(-2.5 * (t / DURATION_S));
    const amp = 0.3 * attackGain * decayGain;
    const sample = Math.max(-1, Math.min(1, amp * Math.sin(2 * Math.PI * freq * t)));
    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }

  return new Uint8Array(buffer);
}

const cache = new Map<number, string>();

export function toneUri(freq: number): string {
  const cached = cache.get(freq);
  if (cached) return cached;
  const uri = `data:audio/wav;base64,${bytesToBase64(synthesizeWav(freq))}`;
  cache.set(freq, uri);
  return uri;
}

export const ERROR_TONE_FREQ = 150;

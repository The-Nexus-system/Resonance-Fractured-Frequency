/**
 * Spatial audio foundation — Phase 3.
 *
 * A spatial sound source corresponds to a semantic world object: the
 * object's identity determines its tone frequency (consistent sound-object
 * identity), its relative angle determines stereo left/right positioning,
 * and its distance determines attenuation. Front/back is approximated by a
 * gentle rear volume reduction (a full HRTF back-cue awaits native 3-D
 * audio APIs on real hardware — flagged as a real-device item).
 *
 * We synthesise a 16-bit STEREO WAV in memory (RN has no oscillator or
 * panner API) and hand back a data URI plus a caption, so every spatial
 * sound always has an equivalent text channel. Nothing here is required
 * to play the game: sound-off mode remains fully playable.
 */

import type { ObjectView, WorldObjectKind } from './world';
import { relativeAngleDeg, type PlayerPose } from './world';

const SAMPLE_RATE = 22050;
const DURATION_S = 0.9;

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
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/** Stable tone identity per object kind (no new canon — plain cue tones). */
export const KIND_TONE_FREQ: Record<WorldObjectKind, number> = {
  fracture: 220,
  pillar: 330,
  signal: 440,
  landmark: 550,
};

/** Stereo gains for a source at `angleDeg` (relative, -180..180) and `distance` metres. */
export function stereoGains(angleDeg: number, distanceMeters: number): { left: number; right: number } {
  const rad = (angleDeg * Math.PI) / 180;
  // Equal-power pan from the left/right component of the angle.
  const panValue = Math.sin(rad); // -1 left .. +1 right
  const left = Math.cos(((panValue + 1) / 2) * (Math.PI / 2));
  const right = Math.sin(((panValue + 1) / 2) * (Math.PI / 2));
  // Distance attenuation: full volume at <=1m, fading toward 0.12 at 20m.
  const attenuation = Math.max(0.12, Math.min(1, 1 / (1 + 0.25 * Math.max(0, distanceMeters - 1))));
  // Behind the listener: soften slightly (front/back cue within stereo limits).
  const behindFactor = Math.abs(angleDeg) > 90 ? 0.6 : 1;
  const gain = attenuation * behindFactor;
  return { left: left * gain, right: right * gain };
}

function synthesizeStereoWav(freq: number, leftGain: number, rightGain: number): Uint8Array {
  const numSamples = Math.floor(SAMPLE_RATE * DURATION_S);
  const dataSize = numSamples * 4; // 2 channels x 16-bit
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 2, true); // stereo
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const attack = Math.floor(SAMPLE_RATE * 0.04);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const attackGain = i < attack ? i / attack : 1;
    const decayGain = Math.exp(-2.5 * (t / DURATION_S));
    const wave = Math.sin(2 * Math.PI * freq * t) * 0.3 * attackGain * decayGain;
    const l = Math.max(-1, Math.min(1, wave * leftGain));
    const r = Math.max(-1, Math.min(1, wave * rightGain));
    view.setInt16(44 + i * 4, Math.round(l * 32767), true);
    view.setInt16(46 + i * 4, Math.round(r * 32767), true);
  }
  return new Uint8Array(buffer);
}

const cache = new Map<string, string>();

/** Data URI for a positioned tone. Gains are quantised for cacheability. */
export function spatialToneUri(freq: number, leftGain: number, rightGain: number): string {
  const l = Math.round(leftGain * 20) / 20;
  const r = Math.round(rightGain * 20) / 20;
  const key = `${freq}:${l}:${r}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const uri = `data:audio/wav;base64,${bytesToBase64(synthesizeStereoWav(freq, l, r))}`;
  cache.set(key, uri);
  return uri;
}

export type SpatialSound = {
  uri: string;
  /** Caption — every meaningful sound has a text equivalent. */
  caption: string;
};

/** Build the positioned ping (and its caption) for a world object. */
export function objectPing(player: PlayerPose, view: ObjectView): SpatialSound {
  const angle = relativeAngleDeg(player, view.object.position);
  const { left, right } = stereoGains(angle, view.distance);
  const freq = KIND_TONE_FREQ[view.object.kind];
  const side =
    view.direction === 'ahead' || view.direction === 'behind'
      ? view.direction
      : view.direction.replace('-', ' and ');
  return {
    uri: spatialToneUri(freq, left, right),
    caption: `[Ping: ${view.object.label.toLowerCase()}, ${side}, ${view.distanceCategory}]`,
  };
}

/**
 * Musical object system — theory layer (Phase 4 vertical slice).
 *
 * Campaigns describe encounters musically: a root, a set of voices (one per
 * semantic world object), each with a note, octave, timbre, and plain-language
 * identity. Nothing here requires the PLAYER to know music theory — every
 * musical event also carries a plain-language caption ("A low, warm tone
 * joins the soundscape from your left").
 *
 * This is data + pure functions only: no audio hardware, no rendering.
 */

export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

const SEMITONE_FROM_A: Record<NoteName, number> = {
  C: -9,
  'C#': -8,
  D: -7,
  'D#': -6,
  E: -5,
  F: -4,
  'F#': -3,
  G: -2,
  'G#': -1,
  A: 0,
  'A#': 1,
  B: 2,
};

/** Frequency in Hz for a note (A4 = 440). */
export function noteFreq(note: NoteName, octave: number): number {
  const semitones = SEMITONE_FROM_A[note] + (octave - 4) * 12;
  return 440 * Math.pow(2, semitones / 12);
}

/** Shift a frequency by cents (used for fracture detuning/beating). */
export function detuneFreq(freq: number, cents: number): number {
  return freq * Math.pow(2, cents / 1200);
}

export type Timbre = 'chime' | 'drone' | 'pulse' | 'shimmer';

/** How advanced the player's relationship with an object's sound is. */
export type VoicePresence = 'faint' | 'clear' | 'confident';

export type MusicalVoice = {
  /** Semantic world object this voice belongs to. */
  objectId: string;
  note: NoteName;
  octave: number;
  timbre: Timbre;
  /** Plain-language identity, e.g. "a low, warm tone". */
  plainIdentity: string;
};

export type EncounterScore = {
  /** e.g. 'F' — used in captions like "Low F resonance". */
  root: NoteName;
  /** Plain-language description of the completed harmony. */
  resolvedPlain: string;
  voices: MusicalVoice[];
};

/** Presence → mix parameters. Fractured (faint) voices beat against a detuned pair. */
export const PRESENCE_MIX: Record<
  VoicePresence,
  { gain: number; detuneCents: number }
> = {
  faint: { gain: 0.08, detuneCents: 9 }, // unstable: audible beating
  clear: { gain: 0.16, detuneCents: 3 }, // steadier, slight tension
  confident: { gain: 0.3, detuneCents: 0 }, // resolved, in tune
};

export function voiceForObject(score: EncounterScore, objectId: string): MusicalVoice | null {
  return score.voices.find((v) => v.objectId === objectId) ?? null;
}

/** All voices resolved and in tune — the completion harmony. */
export function isScoreComplete(presences: Record<string, VoicePresence>, score: EncounterScore): boolean {
  return score.voices.every((v) => presences[v.objectId] === 'confident');
}

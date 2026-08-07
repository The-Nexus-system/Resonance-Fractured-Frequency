/**
 * Soundscape — pure mapping from world/encounter state to a renderable mix
 * and plain-language captions. The player's actions literally change what
 * this produces: undiscovered objects contribute faint unstable texture,
 * discovered ones become clearer, attuned ones join confidently, and a
 * completed group resolves into the encounter's harmony.
 */

import {
  PRESENCE_MIX,
  type EncounterScore,
  type MusicalVoice,
  type VoicePresence,
  isScoreComplete,
  noteFreq,
} from './theory';
import type { RenderVoice } from './synth';

export type VoiceState = {
  presence: VoicePresence;
  /** Stereo position from the player's perspective, -1..1. */
  pan: number;
  /** 0..1 distance attenuation (1 = near). */
  proximity: number;
};

/** Renderable voice for one object in its current state. */
export function voiceRender(voice: MusicalVoice, state: VoiceState): RenderVoice {
  const mix = PRESENCE_MIX[state.presence];
  return {
    freq: noteFreq(voice.note, voice.octave),
    gain: mix.gain * (0.4 + 0.6 * Math.max(0, Math.min(1, state.proximity))),
    pan: state.pan,
    timbre: voice.timbre,
    detuneCents: mix.detuneCents,
  };
}

/** The current environmental mix: every audible voice in its present state. */
export function soundscapeVoices(
  score: EncounterScore,
  states: Record<string, VoiceState>,
): RenderVoice[] {
  const out: RenderVoice[] = [];
  for (const voice of score.voices) {
    const state = states[voice.objectId];
    if (!state) continue; // silent until it enters the soundscape
    out.push(voiceRender(voice, state));
  }
  return out;
}

/** The resolved completion harmony: all voices confident, centred and full. */
export function resolutionVoices(score: EncounterScore): RenderVoice[] {
  return score.voices.map((voice, i) => ({
    freq: noteFreq(voice.note, voice.octave),
    gain: 0.3,
    // Spread the chord gently across the stereo field.
    pan: score.voices.length > 1 ? -0.5 + (i / (score.voices.length - 1)) * 1 : 0,
    timbre: voice.timbre,
    detuneCents: 0,
  }));
}

function sideWord(pan: number): string {
  if (pan < -0.25) return 'from your left';
  if (pan > 0.25) return 'from your right';
  return 'ahead of you';
}

/**
 * Plain-language caption for a voice change. No music theory needed:
 * the note letter is included as identity, the words carry the meaning.
 */
export function voiceChangeCaption(
  voice: MusicalVoice,
  presence: VoicePresence,
  pan: number,
): string {
  const where = sideWord(pan);
  const name = `${voice.plainIdentity} (${voice.note})`;
  switch (presence) {
    case 'faint':
      return `[A faint, wavering trace of ${name} drifts ${where}]`;
    case 'clear':
      return `[${capitalize(name)} becomes clearer ${where}, still unsteady]`;
    case 'confident':
      return `[${capitalize(name)} settles and joins the soundscape ${where}]`;
  }
}

export function resolutionCaption(score: EncounterScore): string {
  return `[The tones align: ${score.resolvedPlain}]`;
}

export function isResolved(
  score: EncounterScore,
  states: Record<string, VoiceState>,
): boolean {
  const presences: Record<string, VoicePresence> = {};
  for (const [id, s] of Object.entries(states)) presences[id] = s.presence;
  return isScoreComplete(presences, score);
}

function capitalize(s: string): string {
  return s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s;
}

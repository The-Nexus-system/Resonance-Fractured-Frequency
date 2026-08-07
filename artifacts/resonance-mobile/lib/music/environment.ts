/**
 * Environmental music system (Phase 4 completion).
 *
 * The environment itself is musical, not just the four resonators. This
 * module maps WORLD STATE (how many resonators are restored, which unlocks
 * are active) to an ambient mix and to plain-language stage captions.
 *
 * Reusable: any campaign supplies its EncounterScore and a restored count;
 * nothing here is specific to The First Fracture except that campaigns
 * choose their own scores.
 *
 * Pure functions: safe to unit test in node.
 */

import { noteFreq, detuneFreq, type EncounterScore } from './theory';
import type { RenderVoice } from './synth';

export type EnvironmentOptions = {
  /** Lower the fractured noise-bed (Quiet Focus field effect unlock). */
  quietFocus?: boolean;
  /** Add a fifth high crown voice to the restored harmony (music layer unlock). */
  overtoneCrown?: boolean;
};

/**
 * The ambient environmental bed for a given restoration stage.
 *
 * 0 restored: sparse, unstable — two detuned low smears, no stable pitch.
 * 1–3 restored: each restored voice joins in tune while the unstable bed
 *   thins out proportionally.
 * 4 restored: the full harmony stands with no unstable bed at all; with the
 *   Overtone Crown unlock a fifth high voice joins above it.
 */
export function environmentVoices(
  score: EncounterScore,
  restoredIds: readonly string[],
  options: EnvironmentOptions = {},
): RenderVoice[] {
  const total = score.voices.length;
  const restored = score.voices.filter((v) => restoredIds.includes(v.objectId));
  const out: RenderVoice[] = [];

  // Unstable fracture bed: fades as restoration progresses.
  const instability = 1 - restored.length / total;
  if (instability > 0) {
    const bedGain = 0.10 * instability * (options.quietFocus ? 0.4 : 1);
    const root = noteFreq(score.root, 2);
    out.push(
      { freq: root, gain: bedGain, pan: -0.6, timbre: 'drone', detuneCents: 14 },
      { freq: detuneFreq(root * 1.5, 8), gain: bedGain * 0.7, pan: 0.6, timbre: 'drone', detuneCents: 22 },
    );
  }

  // Restored voices stand in tune, spread across the field.
  restored.forEach((v, i) => {
    out.push({
      freq: noteFreq(v.note, v.octave),
      gain: 0.16 + 0.04 * (restored.length / total),
      pan: restored.length > 1 ? -0.5 + (i / (restored.length - 1)) : 0,
      timbre: v.timbre,
      detuneCents: 0,
    });
  });

  // Overtone Crown unlock: a fifth voice one octave above the root.
  if (options.overtoneCrown && restored.length === total) {
    out.push({ freq: noteFreq(score.root, 5), gain: 0.10, pan: 0, timbre: 'shimmer', detuneCents: 0 });
  }

  return out;
}

/**
 * Plain-language stage caption. A nonmusician should feel the progression
 * "fractured → coming together → whole" with no theory terms.
 */
export function environmentCaption(restoredCount: number, total: number): string {
  if (restoredCount <= 0) {
    return '[The fracture zone sounds sparse and unstable — layers of sound drift against each other, none of them settled]';
  }
  if (restoredCount === 1) {
    return '[One resonance now holds steady. The rest of the zone still wavers around it]';
  }
  if (restoredCount === total - 2) {
    return `[${countWord(restoredCount)} resonances hold steady together — a harmony is beginning to emerge from the noise]`;
  }
  if (restoredCount < total) {
    return `[${countWord(restoredCount)} resonances now hold steady. The zone is close to coming together — one voice still wavers]`;
  }
  return '[The fractured layers settle into one stable harmony. The whole zone sounds whole]';
}

function countWord(n: number): string {
  const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];
  return words[n] ?? String(n);
}

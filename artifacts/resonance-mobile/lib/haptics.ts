/**
 * Gameplay haptic language (Phase 4 completion).
 *
 * A small, documented, reusable set of semantic haptic patterns shared by
 * all campaigns. Patterns are sequences of primitive expo-haptics steps
 * with delays; the game provider executes them on the GAMEPLAY channel
 * (interface haptics remain simple selection ticks on the UI channel).
 *
 * Design rules:
 * - Few patterns, each distinct — a language, not a soundboard.
 * - Haptics are never REQUIRED for comprehension: every haptic event has an
 *   equivalent caption / announcement / text channel.
 * - Later campaigns reuse these identifiers so the language stays
 *   consistent across the whole game.
 */

export type HapticStep =
  | { kind: 'impact'; strength: 'light' | 'medium' | 'heavy' }
  | { kind: 'notify'; tone: 'success' | 'warning' | 'error' }
  | { kind: 'select' }
  | { kind: 'wait'; ms: number };

export type GameplayHaptic =
  | 'discovery' // something new found nearby
  | 'approach' // drawing close to a resonance
  | 'success' // an interaction worked
  | 'error' // action unavailable / wrong answer
  | 'attuned' // a resonator restored
  | 'restoration' // major environmental restoration (all resonators)
  | 'reward'; // a reward was earned

/**
 * The pattern table. Documented meanings:
 * - discovery: two quick light taps — "look, something's here".
 * - approach: single light tap — a gentle pull, used sparingly.
 * - success: one medium tap — clean confirmation.
 * - error: error buzz — unmistakably different from all taps.
 * - attuned: medium tap, pause, success notify — "settled, then whole".
 * - restoration: heavy tap, pause, heavy tap, pause, success — the biggest
 *   moment in a chapter gets the biggest, slowest gesture.
 * - reward: light tap then success notify — a little lift.
 */
export const GAMEPLAY_HAPTIC_PATTERNS: Record<GameplayHaptic, HapticStep[]> = {
  discovery: [
    { kind: 'impact', strength: 'light' },
    { kind: 'wait', ms: 90 },
    { kind: 'impact', strength: 'light' },
  ],
  approach: [{ kind: 'impact', strength: 'light' }],
  success: [{ kind: 'impact', strength: 'medium' }],
  error: [{ kind: 'notify', tone: 'error' }],
  attuned: [
    { kind: 'impact', strength: 'medium' },
    { kind: 'wait', ms: 160 },
    { kind: 'notify', tone: 'success' },
  ],
  restoration: [
    { kind: 'impact', strength: 'heavy' },
    { kind: 'wait', ms: 220 },
    { kind: 'impact', strength: 'heavy' },
    { kind: 'wait', ms: 220 },
    { kind: 'notify', tone: 'success' },
  ],
  reward: [
    { kind: 'impact', strength: 'light' },
    { kind: 'wait', ms: 120 },
    { kind: 'notify', tone: 'success' },
  ],
};

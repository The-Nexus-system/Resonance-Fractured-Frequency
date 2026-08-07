/**
 * Reward / progression foundation (Phase 4).
 *
 * Not a coin economy: rewards reinforce discovery, resonance, exploration,
 * and mastery. Pure logic + sanitization here; persistence handled by the
 * game provider under its own storage key so existing saves are untouched.
 */

export type RewardType = 'fragment' | 'discovery' | 'milestone' | 'archive';

export type RewardDef = {
  id: string;
  type: RewardType;
  title: string;
  /** Plain-language description shown when earned and in future archives. */
  description: string;
  campaignId: string;
  encounterId?: string;
  repeatable: boolean;
  /** Hidden rewards are not hinted at before being earned. */
  hidden?: boolean;
  /** Optional unlock identifier for future systems. */
  unlock?: string;
};

export type EarnedReward = {
  earnedAt: number; // epoch ms of first earn
  count: number; // >1 only for repeatable rewards
};

export type RewardState = {
  earned: Record<string, EarnedReward>;
};

export const REWARDS_STORAGE_KEY = 'resonance_rewards_v1';

export function emptyRewardState(): RewardState {
  return { earned: {} };
}

/** Defensive sanitization mirroring the save-corruption protection pattern. */
export function sanitizeRewardState(raw: unknown): RewardState {
  const state = emptyRewardState();
  if (typeof raw !== 'object' || raw === null) return state;
  const earned = (raw as { earned?: unknown }).earned;
  if (typeof earned !== 'object' || earned === null) return state;
  for (const [id, value] of Object.entries(earned as Record<string, unknown>)) {
    if (typeof id !== 'string' || id.length === 0 || id.length > 128) continue;
    if (typeof value !== 'object' || value === null) continue;
    const at = (value as { earnedAt?: unknown }).earnedAt;
    const count = (value as { count?: unknown }).count;
    if (typeof at !== 'number' || !Number.isFinite(at) || at < 0) continue;
    const safeCount =
      typeof count === 'number' && Number.isFinite(count) && count >= 1
        ? Math.floor(count)
        : 1;
    state.earned[id] = { earnedAt: at, count: safeCount };
  }
  return state;
}

export type EarnResult = {
  state: RewardState;
  /** True only when this call actually granted something new. */
  newlyEarned: boolean;
};

/** Earn a reward with duplicate protection. Returns a NEW state object. */
export function earnReward(state: RewardState, def: RewardDef, now: number): EarnResult {
  const existing = state.earned[def.id];
  if (existing && !def.repeatable) {
    return { state, newlyEarned: false };
  }
  const next: RewardState = { earned: { ...state.earned } };
  if (existing && def.repeatable) {
    next.earned[def.id] = { earnedAt: existing.earnedAt, count: existing.count + 1 };
  } else {
    next.earned[def.id] = { earnedAt: now, count: 1 };
  }
  return { state: next, newlyEarned: true };
}

export function hasReward(state: RewardState, id: string): boolean {
  return id in state.earned;
}

/* ------------------------------------------------------------------ */
/* The First Fracture demonstration content.                           */
/* All titles/descriptions are noncanonical technical-demo content —   */
/* logged in docs/design_notes/first_fracture_expansion_log.md.        */
/* ------------------------------------------------------------------ */

export const FIRST_FRACTURE_REWARDS: RewardDef[] = [
  {
    id: 'ff-resonator-all',
    type: 'milestone',
    title: 'Beacon Restored',
    description: 'All four resonators attuned. The beacon signal is whole again.',
    campaignId: 'the-first-fracture',
    repeatable: false,
  },
  {
    id: 'ff-fragment-a',
    type: 'fragment',
    title: 'Echo Fragment I',
    description: 'A splinter of stored resonance, still humming faintly.',
    campaignId: 'the-first-fracture',
    repeatable: false,
    hidden: true,
  },
  {
    id: 'ff-fragment-b',
    type: 'fragment',
    title: 'Echo Fragment II',
    description: 'A splinter of stored resonance, cool to the touch.',
    campaignId: 'the-first-fracture',
    repeatable: false,
    hidden: true,
  },
  {
    id: 'ff-fragment-c',
    type: 'fragment',
    title: 'Echo Fragment III',
    description: 'A splinter of stored resonance, its pattern almost legible.',
    campaignId: 'the-first-fracture',
    repeatable: false,
    hidden: true,
  },
  {
    id: 'ff-hidden-1',
    type: 'discovery',
    title: 'Quiet Hollow',
    description: 'Found a sheltered spot where the fracture noise falls away.',
    campaignId: 'the-first-fracture',
    repeatable: false,
    hidden: true,
  },
  {
    id: 'ff-hidden-2',
    type: 'discovery',
    title: 'Overtone Ridge',
    description: 'Found a rise where every resonator can be heard at once.',
    campaignId: 'the-first-fracture',
    repeatable: false,
    hidden: true,
  },
  {
    id: 'ff-surveyor',
    type: 'archive',
    title: 'Field Notes',
    description: 'Inspected every optional survey object in the fracture zone.',
    campaignId: 'the-first-fracture',
    repeatable: false,
  },
  {
    id: 'ff-afterglow',
    type: 'discovery',
    title: 'Afterglow',
    description: 'Returned to a restored resonator and listened to it at rest.',
    campaignId: 'the-first-fracture',
    repeatable: false,
    hidden: true,
  },
];

export function rewardDef(id: string): RewardDef | null {
  return FIRST_FRACTURE_REWARDS.find((r) => r.id === id) ?? null;
}

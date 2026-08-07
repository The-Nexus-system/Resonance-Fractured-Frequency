/**
 * Reusable reward engine (Phase 4 completion).
 *
 * Not a coin economy: rewards reinforce discovery, resonance, exploration,
 * and mastery. Pure logic + sanitization here; persistence handled by the
 * game provider under its own storage key so existing saves are untouched.
 *
 * Architecture:
 * - RewardDef: declarative definition — id, category, campaign source,
 *   optional source object, a declarative CONDITION, and an optional
 *   UNLOCK PAYLOAD. Future campaigns register defs; nothing here is
 *   hard-coded to The First Fracture except the demo content at the bottom.
 * - evaluateRewards(): the engine evaluates conditions against a campaign
 *   progress snapshot and reports which rewards are newly earnable. Gameplay
 *   code never writes `if fragment3 then award fragment3` logic.
 * - Payloads: earning a reward can unlock content (archive entries,
 *   alternate ambient mixes, extra music layers, field effects). Unlocks are
 *   derived from earned state — they need no separate persistence and can
 *   never desync from it.
 */

export type RewardType = 'fragment' | 'discovery' | 'milestone' | 'archive';

/**
 * Declarative earn conditions evaluated against a RewardContext snapshot.
 * Extensible: future campaigns add snapshot fields + condition kinds here
 * rather than scattering award logic through gameplay code.
 */
export type RewardCondition =
  | { kind: 'collect'; objectId: string }
  | { kind: 'visit'; objectId: string }
  | { kind: 'inspectAll'; objectIds: readonly string[] }
  | { kind: 'attunedCount'; atLeast: number }
  | { kind: 'listenAtRest'; role: string }
  | { kind: 'manual' }; // granted explicitly by campaign script

/** What earning the reward unlocks, if anything. */
export type RewardPayload =
  | { kind: 'archiveEntry'; title: string; text: string }
  | { kind: 'ambientMix'; mixId: string; label: string }
  | { kind: 'musicLayer'; layerId: string; label: string }
  | { kind: 'fieldEffect'; effectId: string; label: string };

export type RewardDef = {
  /** Stable, versioned reward ID. */
  id: string;
  type: RewardType;
  title: string;
  /** Plain-language description shown when earned and in archives. */
  description: string;
  campaignId: string;
  /** Source encounter/object where applicable. */
  encounterId?: string;
  condition: RewardCondition;
  repeatable: boolean;
  /** Hidden rewards are not hinted at before being earned. */
  hidden?: boolean;
  /** Optional rewards are never required for campaign completion. */
  required?: boolean;
  payload?: RewardPayload;
};

export type EarnedReward = {
  earnedAt: number; // epoch ms of first earn
  count: number; // >1 only for repeatable rewards
};

export type RewardState = {
  earned: Record<string, EarnedReward>;
};

/**
 * Storage key. Version suffix covers migration: if the earned-record shape
 * ever changes incompatibly, bump to _v2 and migrate in the provider. The
 * v1 shape is forward-compatible (unknown fields are dropped by
 * sanitizeRewardState, unknown ids are preserved harmlessly).
 */
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

/**
 * Anti-forgery reconciliation (Protected Foundation §14: "Rewards must not
 * become forgeable"). A persisted rewards ledger is only trusted where the
 * sanitized exploration state actually SUPPORTS each earned reward's
 * declarative condition. Known reward ids with unmet conditions are dropped;
 * unknown ids are dropped too (nothing can activate from them, but a clean
 * ledger keeps counts honest).
 */
export function reconcileRewardState(
  defs: readonly RewardDef[],
  state: RewardState,
  contextFor: (campaignId: string) => RewardContext | null,
): RewardState {
  const out = emptyRewardState();
  for (const [id, entry] of Object.entries(state.earned)) {
    const def = defs.find((d) => d.id === id);
    if (!def) continue; // unknown id: cannot be validated, cannot unlock — drop
    const ctx = contextFor(def.campaignId);
    if (!ctx) continue;
    if (conditionMet(def.condition, ctx)) out.earned[id] = entry;
  }
  return out;
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
/* Condition evaluation — the reusable engine.                         */
/* ------------------------------------------------------------------ */

/**
 * Snapshot of campaign progress the engine evaluates conditions against.
 * Gameplay code builds this from its own state; the engine stays generic.
 */
export type RewardContext = {
  campaignId: string;
  collected: readonly string[];
  visited: readonly string[];
  inspected: readonly string[];
  attunedCount: number;
  /** Object roles the player has listened to at rest (post-attunement). */
  listenedAtRestRoles: readonly string[];
};

export function conditionMet(condition: RewardCondition, ctx: RewardContext): boolean {
  switch (condition.kind) {
    case 'collect':
      return ctx.collected.includes(condition.objectId);
    case 'visit':
      return ctx.visited.includes(condition.objectId);
    case 'inspectAll':
      return condition.objectIds.every((id) => ctx.inspected.includes(id));
    case 'attunedCount':
      return ctx.attunedCount >= condition.atLeast;
    case 'listenAtRest':
      return ctx.listenedAtRestRoles.includes(condition.role);
    case 'manual':
      return false; // only ever granted explicitly
  }
}

/**
 * Evaluate a registry of reward defs against a context and current state.
 * Returns defs that are met but not yet earned (non-repeatable) — the
 * caller grants them through the normal duplicate-protected path.
 */
export function evaluateRewards(
  defs: readonly RewardDef[],
  ctx: RewardContext,
  state: RewardState,
): RewardDef[] {
  return defs.filter(
    (def) =>
      def.campaignId === ctx.campaignId &&
      !(def.id in state.earned) &&
      def.condition.kind !== 'manual' &&
      conditionMet(def.condition, ctx),
  );
}

/** All unlock payloads currently active given earned state. */
export function activeUnlocks(defs: readonly RewardDef[], state: RewardState): RewardPayload[] {
  return defs
    .filter((def) => def.payload && def.id in state.earned)
    .map((def) => def.payload!) ;
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
    condition: { kind: 'attunedCount', atLeast: 4 },
    repeatable: false,
    required: true,
    payload: {
      kind: 'ambientMix',
      mixId: 'ff-restored-ambience',
      label: 'Restored Ambience — the fracture zone at rest, available from Listen',
    },
  },
  {
    id: 'ff-fragment-a',
    type: 'fragment',
    title: 'Echo Fragment I',
    description: 'A splinter of stored resonance, still humming faintly.',
    campaignId: 'the-first-fracture',
    encounterId: 'fragment-a',
    condition: { kind: 'collect', objectId: 'fragment-a' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'archiveEntry',
      title: 'Echo Fragment I — playback',
      text: 'The fragment holds a few seconds of the beacon as it sounded before the fracture: one low, even tone, unhurried, certain of itself.',
    },
  },
  {
    id: 'ff-fragment-b',
    type: 'fragment',
    title: 'Echo Fragment II',
    description: 'A splinter of stored resonance, cool to the touch.',
    campaignId: 'the-first-fracture',
    encounterId: 'fragment-b',
    condition: { kind: 'collect', objectId: 'fragment-b' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'archiveEntry',
      title: 'Echo Fragment II — playback',
      text: 'This fragment caught the moment the fracture opened: the even tone splits mid-breath into two voices that cannot agree.',
    },
  },
  {
    id: 'ff-fragment-c',
    type: 'fragment',
    title: 'Echo Fragment III',
    description: 'A splinter of stored resonance, its pattern almost legible.',
    campaignId: 'the-first-fracture',
    encounterId: 'fragment-c',
    condition: { kind: 'collect', objectId: 'fragment-c' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'archiveEntry',
      title: 'Echo Fragment III — playback',
      text: 'A maintenance tone-check, recorded by some patient hand: four notes struck one after another, each held until it settled. A tuning ritual.',
    },
  },
  {
    id: 'ff-hidden-1',
    type: 'discovery',
    title: 'Quiet Hollow',
    description: 'Found a sheltered spot where the fracture noise falls away.',
    campaignId: 'the-first-fracture',
    encounterId: 'hidden-1',
    condition: { kind: 'visit', objectId: 'hidden-1' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'fieldEffect',
      effectId: 'ff-quiet-focus',
      label: 'Quiet Focus — the Listen mix plays with the fracture noise-bed lowered',
    },
  },
  {
    id: 'ff-hidden-2',
    type: 'discovery',
    title: 'Overtone Ridge',
    description: 'Found a rise where every resonator can be heard at once.',
    campaignId: 'the-first-fracture',
    encounterId: 'hidden-2',
    condition: { kind: 'visit', objectId: 'hidden-2' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'musicLayer',
      layerId: 'ff-overtone-crown',
      label: 'Overtone Crown — a fifth high voice joins the restored harmony',
    },
  },
  {
    id: 'ff-surveyor',
    type: 'archive',
    title: 'Field Notes',
    description: 'Inspected every optional survey object in the fracture zone.',
    campaignId: 'the-first-fracture',
    condition: { kind: 'inspectAll', objectIds: ['inspect-1', 'inspect-2'] },
    repeatable: false,
    payload: {
      kind: 'archiveEntry',
      title: 'Field Notes — fracture survey',
      text: 'Compiled survey record: the fracture boundary was mapped and monitored long before it was healed. Whoever kept these instruments working expected someone to come.',
    },
  },
  {
    id: 'ff-bloom',
    type: 'discovery',
    title: 'Resonance Bloom',
    description: 'Found a bloom of standing sound that only forms over a healed fracture.',
    campaignId: 'the-first-fracture',
    encounterId: 'bloom-1',
    condition: { kind: 'visit', objectId: 'bloom-1' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'archiveEntry',
      title: 'Resonance Bloom — field observation',
      text: 'Post-restoration phenomenon: where a fracture heals completely, the settled harmonics can knot into a stable standing bloom. Noted for future survey teams — a healed zone is not an empty zone.',
    },
  },
  {
    id: 'ff-afterglow',
    type: 'discovery',
    title: 'Afterglow',
    description: 'Returned to a restored resonator and listened to it at rest.',
    campaignId: 'the-first-fracture',
    condition: { kind: 'listenAtRest', role: 'resonator' },
    repeatable: false,
    hidden: true,
    payload: {
      kind: 'archiveEntry',
      title: 'Afterglow — listening note',
      text: 'A restored resonator does not go silent; it keeps a low, even afterglow. Standing with it for a while is its own kind of maintenance.',
    },
  },
];

export function rewardDef(id: string): RewardDef | null {
  return FIRST_FRACTURE_REWARDS.find((r) => r.id === id) ?? null;
}

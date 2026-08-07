/**
 * Replay / discovery-record infrastructure (Phase 4 completion).
 *
 * Everything here is DERIVED from persisted campaign explore state and the
 * reward ledger — no separate persistence, so records can never desync from
 * real progress and old saves need no migration.
 *
 * Reusable: campaigns describe their content surface (CampaignSurface) and
 * the engine computes exploration percentage, discovery records, and a
 * mastery summary. Optional content only — required puzzle objects are
 * never randomized or withheld.
 */

import type { RewardState } from './rewards';
import type { ExploreState } from './save';

export type CampaignSurface = {
  campaignId: string;
  requiredIds: readonly string[]; // e.g. resonators
  collectibleIds: readonly string[];
  inspectIds: readonly string[];
  hiddenIds: readonly string[];
};

export type DiscoveryRecord = {
  id: string;
  kind: 'required' | 'collectible' | 'inspect' | 'hidden';
  done: boolean;
  /** First-earn timestamp where the reward ledger knows it. */
  earnedAt?: number;
};

export type CampaignRecords = {
  completionPercent: number; // whole exploration surface, 0–100
  requiredComplete: boolean;
  records: DiscoveryRecord[];
  /** Mastery: required complete AND every optional discovery found. */
  mastered: boolean;
};

export function campaignRecords(
  surface: CampaignSurface,
  explore: ExploreState,
  rewards: RewardState,
): CampaignRecords {
  const records: DiscoveryRecord[] = [];
  const push = (id: string, kind: DiscoveryRecord['kind'], done: boolean) => {
    const earned = Object.entries(rewards.earned).find(([rid]) => rid.includes(id));
    records.push({ id, kind, done, earnedAt: earned?.[1].earnedAt });
  };
  for (const id of surface.requiredIds) push(id, 'required', explore.attuned.includes(id));
  for (const id of surface.collectibleIds) push(id, 'collectible', explore.collected.includes(id));
  for (const id of surface.inspectIds) push(id, 'inspect', explore.inspected.includes(id));
  for (const id of surface.hiddenIds) push(id, 'hidden', explore.visitedHidden.includes(id));

  const done = records.filter((r) => r.done).length;
  const completionPercent = records.length === 0 ? 0 : Math.round((done / records.length) * 100);
  const requiredComplete = surface.requiredIds.every((id) => explore.attuned.includes(id));
  return {
    completionPercent,
    requiredComplete,
    records,
    mastered: requiredComplete && done === records.length,
  };
}

/** Plain-language exploration summary, e.g. for the campaign header. */
export function explorationSummary(r: CampaignRecords): string {
  if (r.mastered) return 'Fully explored — every discovery found.';
  return `${r.completionPercent}% explored`;
}

/**
 * Progression guidance (Phase 4, Protected Foundation addendum §6–§8).
 *
 * Extends — never replaces — the Phase 3 semantic navigation. These pure
 * helpers rank the player's unresolved objectives and produce plain-language
 * guidance in the protected eight-direction / near-medium-far vocabulary.
 * They never reveal puzzle answers or raw coordinates.
 */
import type { SpatialWorld, WorldObject } from './spatial/world';
import { relativeDirection, distanceCategory, viewObject } from './spatial/world';
import type { ActionContext } from './actions';

export type Guidance = {
  objectId: string;
  /** Plain sentence, e.g. "Nearest unresolved signal: a resonator, ahead and left, medium distance." */
  text: string;
  distance: number;
};

function kindWord(role: string | undefined, discovered: boolean, label: string): string {
  if (discovered) return label;
  switch (role) {
    case 'resonator':
      return 'a resonator signal';
    case 'fragment':
      return 'a faint collectible signal';
    case 'hidden':
      return 'an unusual quiet in the fracture noise';
    default:
      return 'an unresolved signal';
  }
}

function elevationWord(z: number): string {
  if (z > 1) return ', above you';
  if (z < -1) return ', below you';
  return '';
}

/**
 * The nearest UNRESOLVED objective, required progression first. Hidden
 * objects that exist in the world are included (hidden ≠ undetectable):
 * undiscovered ones are described by kind, not by name.
 */
export function nextObjective(world: SpatialWorld, ctx: ActionContext): Guidance | null {
  const unresolved = world.objects.filter((o) => o.interactable && !(ctx.isDone?.(o.id) ?? false));
  if (unresolved.length === 0) return null;
  const required = unresolved.filter((o) => ctx.roleOf(o.id) === 'resonator');
  const pool = required.length > 0 ? required : unresolved;
  let best: WorldObject | null = null;
  let bestDist = Infinity;
  for (const o of pool) {
    const v = viewObject(world, o);
    if (v.distance < bestDist) {
      bestDist = v.distance;
      best = o;
    }
  }
  if (!best) return null;
  const dir = relativeDirection(world.player, best.position).replace('-', ' and ');
  const what = kindWord(ctx.roleOf(best.id), best.discovered, best.label);
  const text = `Nearest unresolved signal: ${what}, ${dir}, ${distanceCategory(bestDist)}${elevationWord(
    best.position.z,
  )}.`;
  return { objectId: best.id, text, distance: bestDist };
}

/**
 * Ping with progress feedback: same objective as last ping → say whether
 * the player is getting closer or farther. Semantic thresholds only — no
 * per-step announcements (coalescing stays protected).
 */
export function pingGuidance(
  world: SpatialWorld,
  ctx: ActionContext,
  lastPing: Guidance | null,
): { guidance: Guidance | null; text: string } {
  const guidance = nextObjective(world, ctx);
  if (!guidance) {
    return { guidance: null, text: 'No unresolved signals remain. Everything has been found.' };
  }
  let trend = '';
  if (lastPing && lastPing.objectId === guidance.objectId) {
    if (guidance.distance < lastPing.distance - 0.5) trend = ' You are getting closer.';
    else if (guidance.distance > lastPing.distance + 0.5) trend = ' You are getting farther away.';
    else trend = ' About the same distance as before.';
  }
  return { guidance, text: guidance.text + trend };
}

/**
 * Prioritised Look Around opener: unresolved objectives first, then the
 * regular Phase 3 orientation summary (passed in unchanged — this function
 * prepends, it does not replace).
 */
export function prioritizedLookAround(
  world: SpatialWorld,
  ctx: ActionContext,
  baseSummary: string,
  objectivesRemaining: number,
): string {
  const parts: string[] = [];
  if (objectivesRemaining > 0) {
    parts.push(
      `${objectivesRemaining} resonator${objectivesRemaining === 1 ? '' : 's'} still to attune.`,
    );
    const g = nextObjective(world, ctx);
    if (g) parts.push(g.text);
  } else {
    parts.push('All resonators attuned.');
  }
  parts.push(baseSummary);
  return parts.join(' ');
}

/**
 * Semantic interaction system (Phase 4 completion).
 *
 * ONE action model underneath every input mechanism. The on-screen button,
 * a 3-D object tap, a VoiceOver custom action, the shake gesture, and the
 * Shortcut/deep-link route (Action Button / Back Tap) all resolve to the
 * same `SemanticAction` and are performed by the same dispatcher in the
 * campaign screen. Inputs never duplicate gameplay logic.
 *
 * Pure functions: safe to unit test in node.
 */

import type { SpatialWorld, WorldObject } from './spatial/world';
import { interactableObjects, relativeDirection, viewObject } from './spatial/world';

export type SemanticActionKind =
  | 'attune' // open a resonator's original puzzle
  | 'listen-rest' // post-completion: listen to an attuned resonator at rest
  | 'collect' // pick up a collectible
  | 'inspect' // read an environmental object
  | 'visit'; // record a hidden place

export type SemanticAction = {
  kind: SemanticActionKind;
  objectId: string;
  /** Player-facing label, e.g. "Attune the channel resonator". */
  label: string;
};

export type ActionContext = {
  /** Role of each object id (resonator / fragment / inspect / hidden). */
  roleOf: (objectId: string) => string | undefined;
  /**
   * Whether this object's action has already been completed (fragment
   * collected, hidden place visited, inspect read, resonator attuned).
   * Used to steer guidance toward things that are still NEW; completed
   * objects remain interactable (e.g. listen-at-rest) but are not what a
   * lost player is looking for.
   */
  isDone?: (objectId: string) => boolean;
};

function verbFor(role: string | undefined, object: WorldObject): SemanticActionKind {
  switch (role) {
    case 'resonator':
      return object.state === 'attuned' ? 'listen-rest' : 'attune';
    case 'fragment':
      return 'collect';
    case 'hidden':
      return 'visit';
    default:
      return 'inspect';
  }
}

function labelFor(kind: SemanticActionKind, object: WorldObject): string {
  switch (kind) {
    case 'attune':
      return `Attune ${object.label}`;
    case 'listen-rest':
      return `Listen to ${object.label}`;
    case 'collect':
      return `Collect ${object.label}`;
    case 'inspect':
      return `Inspect ${object.label}`;
    case 'visit':
      return `Enter ${object.label}`;
  }
}

/** The semantic action for one specific object (used by 3-D taps / VoiceOver). */
export function actionForObject(
  world: SpatialWorld,
  objectId: string,
  ctx: ActionContext,
): SemanticAction | null {
  const object = world.objects.find((o) => o.id === objectId);
  if (!object || !object.discovered) return null;
  const kind = verbFor(ctx.roleOf(objectId), object);
  return { kind, objectId, label: labelFor(kind, object) };
}

/**
 * The primary CONTEXTUAL action: what the big accessible button does right
 * now. Chooses the nearest reachable object and names the action honestly
 * ("Collect an echo fragment", not a generic "Action").
 */
export function contextualAction(world: SpatialWorld, ctx: ActionContext): SemanticAction | null {
  const targets = interactableObjects(world);
  if (targets.length === 0) return null;
  // Prefer the nearest target that still has something NEW; fall back to
  // the nearest of any (post-completion actions like listen-at-rest).
  const fresh = ctx.isDone ? targets.find((t) => !ctx.isDone!(t.object.id)) : undefined;
  return actionForObject(world, (fresh ?? targets[0]).object.id, ctx);
}

/**
 * When nothing is reachable, give useful guidance instead of a dead button:
 * "Nothing is within reach. The nearest signal is ahead-right."
 */
export function noActionHint(world: SpatialWorld, ctx?: ActionContext): string {
  const interactable = world.objects.filter((o) => o.interactable);
  // Guide toward UNFINISHED content first; finished-but-interactable objects
  // (visited hidden places, attuned resonators) only when nothing new is left.
  const unfinished = ctx?.isDone ? interactable.filter((o) => !ctx.isDone!(o.id)) : interactable;
  const pool = unfinished.length > 0 ? unfinished : interactable;
  const discovered = pool.filter((o) => o.discovered);
  const candidates = discovered.length > 0 ? discovered : pool;
  if (candidates.length === 0) return 'Nothing is within reach.';
  let best: WorldObject | null = null;
  let bestDist = Infinity;
  for (const o of candidates) {
    const v = viewObject(world, o);
    if (v.distance < bestDist) {
      bestDist = v.distance;
      best = o;
    }
  }
  if (!best) return 'Nothing is within reach.';
  const dir = relativeDirection(world.player, best.position).replace('-', ' and ');
  const what = best.discovered ? best.label : 'the nearest signal';
  return `Nothing is within reach. ${capitalize(what)} is ${dir} of you.`;
}

/** Whether every reachable object shares this action (used to keep one clear button). */
export function reachableActions(world: SpatialWorld, ctx: ActionContext): SemanticAction[] {
  return interactableObjects(world)
    .map((t) => actionForObject(world, t.object.id, ctx))
    .filter((a): a is SemanticAction => a !== null);
}

function capitalize(s: string): string {
  return s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s;
}

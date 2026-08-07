/**
 * Phase 4 COMPLETION tests: reward engine, semantic action system,
 * environmental music evolution, scene entity adapter, replay records.
 * Pure-logic tests runnable in node — no React Native imports.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  FIRST_FRACTURE_REWARDS,
  conditionMet,
  evaluateRewards,
  activeUnlocks,
  type RewardContext,
  type RewardState,
} from '../../rewards';
import { actionForObject, contextualAction, noActionHint, reachableActions } from '../../actions';
import { environmentVoices, environmentCaption } from '../../music/environment';
import { sceneState, sceneDescription, stateWord } from '../../scene/entities';
import { campaignRecords, explorationSummary, type CampaignSurface } from '../../replay';
import { createFirstFractureWorld, FF_META, FF_RESONATOR_IDS, FF_INSPECT_IDS, FIRST_FRACTURE_SCORE } from '../firstFracture';
import { moveForward, turn, discoverNearby } from '../world';

const emptyRewards: RewardState = { earned: {} };
const baseCtx: RewardContext = {
  campaignId: 'the-first-fracture',
  collected: [],
  visited: [],
  inspected: [],
  attunedCount: 0,
  listenedAtRestRoles: [],
};

/* ---------------- reward engine ---------------- */

test('reward engine: every First Fracture reward has a declarative condition and payload', () => {
  for (const def of FIRST_FRACTURE_REWARDS) {
    assert.ok(def.condition, `${def.id} must declare a condition`);
    assert.ok(def.payload, `${def.id} must declare a functional payload (rewards unlock things)`);
  }
});

test('reward engine: conditions are data, not code — attunedCount gates the milestone', () => {
  const def = FIRST_FRACTURE_REWARDS.find((d) => d.id === 'ff-resonator-all')!;
  assert.equal(conditionMet(def.condition, baseCtx), false);
  assert.equal(conditionMet(def.condition, { ...baseCtx, attunedCount: 4 }), true);
});

test('reward engine: evaluateRewards returns met-but-unearned defs only', () => {
  const ctx = { ...baseCtx, collected: ['fragment-a'], attunedCount: 4 };
  const due = evaluateRewards(FIRST_FRACTURE_REWARDS, ctx, emptyRewards).map((d) => d.id);
  assert.ok(due.includes('ff-fragment-a'));
  assert.ok(due.includes('ff-resonator-all'));
  assert.ok(!due.includes('ff-fragment-b'));
  // Already earned → not returned again.
  const earned: RewardState = { earned: { 'ff-fragment-a': { earnedAt: 1, count: 1 } } };
  const due2 = evaluateRewards(FIRST_FRACTURE_REWARDS, ctx, earned).map((d) => d.id);
  assert.ok(!due2.includes('ff-fragment-a'));
});

test('reward engine: inspectAll requires the full list, listenAtRest matches role', () => {
  const surveyor = FIRST_FRACTURE_REWARDS.find((d) => d.id === 'ff-surveyor')!;
  assert.equal(conditionMet(surveyor.condition, { ...baseCtx, inspected: [FF_INSPECT_IDS[0]] }), false);
  assert.equal(conditionMet(surveyor.condition, { ...baseCtx, inspected: [...FF_INSPECT_IDS] }), true);
  const afterglow = FIRST_FRACTURE_REWARDS.find((d) => d.id === 'ff-afterglow')!;
  assert.equal(conditionMet(afterglow.condition, baseCtx), false);
  assert.equal(conditionMet(afterglow.condition, { ...baseCtx, listenedAtRestRoles: ['resonator'] }), true);
});

test('reward engine: activeUnlocks reflect earned payloads (unlocks actually exist)', () => {
  const earned: RewardState = {
    earned: { 'ff-hidden-1': { earnedAt: 1, count: 1 }, 'ff-hidden-2': { earnedAt: 2, count: 1 }, 'ff-resonator-all': { earnedAt: 3, count: 1 } },
  };
  const unlocks = activeUnlocks(FIRST_FRACTURE_REWARDS, earned);
  assert.ok(unlocks.some((p) => p.kind === 'fieldEffect' && p.effectId === 'ff-quiet-focus'));
  assert.ok(unlocks.some((p) => p.kind === 'musicLayer' && p.layerId === 'ff-overtone-crown'));
  assert.ok(unlocks.some((p) => p.kind === 'ambientMix' && p.mixId === 'ff-restored-ambience'));
  assert.equal(activeUnlocks(FIRST_FRACTURE_REWARDS, emptyRewards).length, 0);
});

/* ---------------- semantic action system ---------------- */

const roleCtx = { roleOf: (id: string) => FF_META[id]?.role };

test('actions: contextual action names the object and verb honestly', () => {
  const world = createFirstFractureWorld();
  // Walk to the first resonator.
  const res = world.objects.find((o) => o.id === FF_RESONATOR_IDS[0])!;
  world.player.position = { x: res.position.x, y: res.position.y - 1, z: 0 };
  discoverNearby(world);
  const action = contextualAction(world, roleCtx);
  assert.ok(action);
  assert.equal(action!.kind, 'attune');
  assert.ok(action!.label.toLowerCase().startsWith('attune'), action!.label);
  assert.ok(action!.label.includes(res.label));
});

test('actions: collect/inspect/visit/listen-rest map from role and state', () => {
  const world = createFirstFractureWorld();
  for (const o of world.objects) o.discovered = true;
  const frag = actionForObject(world, 'fragment-a', roleCtx);
  assert.equal(frag?.kind, 'collect');
  assert.ok(frag!.label.startsWith('Collect'));
  const insp = actionForObject(world, FF_INSPECT_IDS[0], roleCtx);
  assert.equal(insp?.kind, 'inspect');
  // Attuned resonator becomes a listen-at-rest action, not attune.
  const res = world.objects.find((o) => o.id === FF_RESONATOR_IDS[0])!;
  res.state = 'attuned';
  assert.equal(actionForObject(world, res.id, roleCtx)?.kind, 'listen-rest');
});

test('actions: noActionHint points toward the nearest signal instead of a dead end', () => {
  const world = createFirstFractureWorld();
  world.player.position = { x: -40, y: -40, z: 0 };
  assert.equal(contextualAction(world, roleCtx), null);
  const hint = noActionHint(world);
  assert.ok(hint.length > 10);
  assert.ok(/nearest|Nothing/i.test(hint));
});

test('actions: reachableActions lists every in-range action for VoiceOver', () => {
  const world = createFirstFractureWorld();
  for (const o of world.objects) o.discovered = true;
  const frag = world.objects.find((o) => o.id === 'fragment-a')!;
  world.player.position = { ...frag.position, z: 0 };
  const acts = reachableActions(world, roleCtx);
  assert.ok(acts.some((a) => a.objectId === 'fragment-a'));
});

/* ---------------- environmental music evolution ---------------- */

test('music: fracture bed fades as restoration progresses and crown appears at full restore', () => {
  const none = environmentVoices(FIRST_FRACTURE_SCORE, []);
  const all = environmentVoices(FIRST_FRACTURE_SCORE, [...FF_RESONATOR_IDS], { overtoneCrown: true });
  // With nothing restored the bed is detuned (off-pitch voices present).
  assert.ok(none.length > 0);
  // Full restoration adds the crown voice above every base voice.
  const withoutCrown = environmentVoices(FIRST_FRACTURE_SCORE, [...FF_RESONATOR_IDS]);
  const maxBase = Math.max(...withoutCrown.map((v) => v.freq));
  assert.ok(all.some((v) => v.freq > maxBase), 'crown voice expected above the restored harmony');
  assert.equal(all.length, withoutCrown.length + 1);
  // Captions change meaningfully per stage and never repeat blandly.
  const caps = [0, 1, 2, 3, 4].map((n) => environmentCaption(n, 4));
  assert.equal(new Set(caps).size, 5);
  for (const c of caps) assert.ok(c.length > 15);
});

/* ---------------- scene entity adapter (3-D over semantic world) ---------------- */

test('scene: entities are pure derivations keyed by semantic id', () => {
  const world = createFirstFractureWorld();
  discoverNearby(world);
  const scene = sceneState(world, { roleOf: roleCtx.roleOf, requiredIds: FF_RESONATOR_IDS });
  assert.equal(scene.entities.length, world.objects.length);
  for (const e of scene.entities) {
    const o = world.objects.find((x) => x.id === e.id)!;
    assert.deepEqual(e.position, o.position);
    assert.equal(e.visible, o.discovered);
    assert.equal(e.state, o.state);
    assert.ok(e.accessibility.label && e.accessibility.direction && e.accessibility.stateWord);
  }
  assert.equal(scene.environmentCoherence, 0);
});

test('scene: environment coherence tracks restored resonators; description reads like the text UI', () => {
  const world = createFirstFractureWorld();
  for (const o of world.objects) o.discovered = true;
  for (const id of FF_RESONATOR_IDS.slice(0, 2)) {
    world.objects.find((o) => o.id === id)!.state = 'attuned';
  }
  const scene = sceneState(world, { requiredIds: FF_RESONATOR_IDS });
  assert.equal(scene.environmentCoherence, 0.5);
  const desc = sceneDescription(scene);
  assert.ok(desc.includes('attuned and steady'));
  assert.equal(stateWord('dormant'), 'dormant');
});

test('scene: player movement is reflected without a second state store', () => {
  const world = createFirstFractureWorld();
  moveForward(world, 2);
  turn(world, 'right');
  const scene = sceneState(world);
  assert.deepEqual(scene.player.position, world.player.position);
  assert.equal(scene.player.headingDeg, world.player.headingDeg);
});

/* ---------------- replay / post-completion records ---------------- */

const surface: CampaignSurface = {
  campaignId: 'the-first-fracture',
  requiredIds: FF_RESONATOR_IDS,
  collectibleIds: ['fragment-a', 'fragment-b', 'fragment-c'],
  inspectIds: FF_INSPECT_IDS,
  hiddenIds: Object.entries(FF_META)
    .filter(([, m]) => m.role === 'hidden')
    .map(([id]) => id),
};

test('replay: records derive from explore state + rewards, no separate persistence', () => {
  const explore = { attuned: [...FF_RESONATOR_IDS], collected: ['fragment-a'], inspected: [], visitedHidden: [], listenedAtRest: [] };
  const rewards: RewardState = { earned: { 'ff-resonator-all': { earnedAt: 1, count: 1 } } };
  const rec = campaignRecords(surface, explore, rewards);
  assert.equal(rec.requiredComplete, true);
  assert.equal(rec.records.filter((r) => r.kind === 'collectible' && r.done).length, 1);
  assert.ok(rec.completionPercent > 0 && rec.completionPercent < 100);
  assert.equal(rec.mastered, false);
  const summary = explorationSummary(rec);
  assert.ok(/%/.test(summary));
});

test('replay: mastered requires everything, including hidden discoveries', () => {
  const explore = {
    attuned: [...FF_RESONATOR_IDS],
    collected: ['fragment-a', 'fragment-b', 'fragment-c'],
    inspected: [...FF_INSPECT_IDS],
    visitedHidden: surface.hiddenIds.slice(),
    listenedAtRest: [],
  };
  const rewards: RewardState = { earned: {} };
  const rec = campaignRecords(surface, explore, rewards);
  assert.equal(rec.completionPercent, 100);
  assert.equal(rec.mastered, true);
});

/* ---------------- post-completion content ---------------- */

test('post-completion: resonance bloom only appears after full restoration and grants an archive entry', () => {
  const meta = FF_META['bloom-1'];
  assert.equal(meta.role, 'hidden');
  assert.equal(meta.revealAfterAttuned, 4);
  const def = FIRST_FRACTURE_REWARDS.find((d) => d.id === 'ff-bloom')!;
  assert.equal(def.payload?.kind, 'archiveEntry');
  assert.equal(conditionMet(def.condition, { ...baseCtx, visited: ['bloom-1'] }), true);
});

/* ---------------- guidance (Protected Foundation §6–§8) ---------------- */

import { nextObjective, pingGuidance, prioritizedLookAround } from '../../guidance';

test('guidance: nextObjective prefers required resonators and uses protected vocabulary', () => {
  const world = createFirstFractureWorld();
  const ctx = { ...roleCtx, isDone: () => false };
  const g = nextObjective(world, ctx);
  assert.ok(g);
  // Protected language: eight-direction words + near/medium/far, never coordinates.
  assert.ok(/ahead|behind|left|right/.test(g!.text));
  assert.ok(/near|medium|far/.test(g!.text));
  assert.ok(!/\d+\.\d+|[xyz]=/i.test(g!.text), 'no raw coordinates in player-facing guidance');
  // Undiscovered required objects are described by kind, not named.
  const obj = world.objects.find((o) => o.id === g!.objectId)!;
  if (!obj.discovered) assert.ok(g!.text.includes('signal'));
});

test('guidance: ping reports closer/farther against the previous ping', () => {
  const world = createFirstFractureWorld();
  const ctx = { ...roleCtx, isDone: () => false };
  const first = pingGuidance(world, ctx, null);
  assert.ok(first.guidance);
  // Step toward the objective and ping again.
  const target = world.objects.find((o) => o.id === first.guidance!.objectId)!;
  world.player.position = {
    x: (world.player.position.x + target.position.x) / 2,
    y: (world.player.position.y + target.position.y) / 2,
    z: 0,
  };
  const second = pingGuidance(world, ctx, first.guidance);
  assert.ok(second.text.includes('closer'), second.text);
  // Everything done → honest completion message.
  const done = pingGuidance(world, { ...roleCtx, isDone: () => true }, null);
  assert.ok(done.text.includes('Everything has been found'));
});

test('guidance: prioritised Look Around prepends objectives and keeps the base summary', () => {
  const world = createFirstFractureWorld();
  const ctx = { ...roleCtx, isDone: () => false };
  const base = 'You are facing north.';
  const text = prioritizedLookAround(world, ctx, base, 3);
  assert.ok(text.includes('3 resonators still to attune'));
  assert.ok(text.endsWith(base));
  const doneText = prioritizedLookAround(world, ctx, base, 0);
  assert.ok(doneText.includes('All resonators attuned.'));
});

/* ---------------- cross-system agreement (§25) ---------------- */

test('cross-system: semantic state drives scene, description, and contextual action in agreement', () => {
  const world = createFirstFractureWorld();
  const res = world.objects.find((o) => o.id === FF_RESONATOR_IDS[0])!;
  world.player.position = { x: res.position.x, y: res.position.y - 1, z: 0 };
  discoverNearby(world);
  const ctx = { ...roleCtx, isDone: () => false };
  // Contextual action targets the resonator…
  const action = contextualAction(world, ctx);
  assert.equal(action?.objectId, res.id);
  // …the 3-D scene entity for it sits at the same semantic coordinates…
  const scene = sceneState(world, { roleOf: roleCtx.roleOf, requiredIds: FF_RESONATOR_IDS });
  const entity = scene.entities.find((e) => e.id === res.id)!;
  assert.deepEqual(entity.position, res.position);
  assert.equal(entity.interactable, true);
  // …and the text channel describes the same object, direction and state.
  assert.equal(entity.accessibility.stateWord, 'resonating, unstable');
  assert.ok(sceneDescription(scene).includes(res.label));
  // After attunement every channel flips together from the ONE state change.
  res.state = 'attuned';
  const scene2 = sceneState(world, { roleOf: roleCtx.roleOf, requiredIds: FF_RESONATOR_IDS });
  const entity2 = scene2.entities.find((e) => e.id === res.id)!;
  assert.equal(entity2.state, 'attuned');
  assert.equal(entity2.coherence, 1);
  assert.equal(scene2.environmentCoherence, 0.25);
  assert.equal(contextualAction(world, ctx)?.kind, 'listen-rest');
});

/* ---------------- anti-forgery reconciliation (§14) ---------------- */

import { reconcileRewardState, sanitizeRewardState } from '../../rewards';

test('rewards: forged earned ledger is rejected unless the save supports each condition', () => {
  // Attacker writes every reward id straight into storage…
  const forged = sanitizeRewardState({
    earned: Object.fromEntries(
      FIRST_FRACTURE_REWARDS.map((d) => [d.id, { earnedAt: 1, count: 1 }]),
    ),
  });
  // …but the sanitized save shows an untouched campaign.
  const empty = {
    attuned: [], collected: [], inspected: [], visitedHidden: [], listenedAtRest: [],
  };
  const cleaned = reconcileRewardState(FIRST_FRACTURE_REWARDS, forged, () => ({
    campaignId: 'the-first-fracture',
    collected: empty.collected,
    visited: empty.visitedHidden,
    inspected: empty.inspected,
    attunedCount: empty.attuned.length,
    listenedAtRestRoles: empty.listenedAtRest,
  }));
  // Only 'manual'-condition rewards can survive an empty save (if any); no
  // progression-conditioned reward may.
  for (const id of Object.keys(cleaned.earned)) {
    const def = FIRST_FRACTURE_REWARDS.find((d) => d.id === id)!;
    assert.equal(def.condition.kind, 'manual', `${id} must not survive an empty save`);
  }
  // Unknown ids are dropped entirely.
  const junk = reconcileRewardState(
    FIRST_FRACTURE_REWARDS,
    sanitizeRewardState({ earned: { 'ff-made-up': { earnedAt: 1, count: 1 } } }),
    () => null,
  );
  assert.deepEqual(junk.earned, {});
  // And a LEGITIMATE ledger survives when the save supports it.
  const legit = reconcileRewardState(FIRST_FRACTURE_REWARDS, forged, () => ({
    campaignId: 'the-first-fracture',
    collected: ['fragment-a', 'fragment-b', 'fragment-c'],
    visited: ['hidden-1', 'hidden-2', 'bloom-1'],
    inspected: ['inspect-1', 'inspect-2'],
    attunedCount: 4,
    listenedAtRestRoles: ['anchor', 'pulse', 'crown', 'channel'],
  }));
  assert.ok(Object.keys(legit.earned).length >= Object.keys(forged.earned).length - 1);
});

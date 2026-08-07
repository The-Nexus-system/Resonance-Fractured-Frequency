/**
 * Phase 4 vertical-slice tests: musical object system, harmony combination,
 * reward persistence logic, duplicate protection, optional discoveries,
 * exploration save sanitization, and haptics-split migration.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  noteFreq,
  detuneFreq,
  isScoreComplete,
  voiceForObject,
  type VoicePresence,
} from '../../music/theory';
import { panGains, renderVoicesUri } from '../../music/synth';
import {
  resolutionVoices,
  soundscapeVoices,
  voiceChangeCaption,
  voiceRender,
  isResolved,
  resolutionCaption,
  type VoiceState,
} from '../../music/soundscape';
import {
  FIRST_FRACTURE_SCORE,
  FF_META,
  FF_RESONATOR_IDS,
  createFirstFractureWorld,
  sanitizeFirstFractureExplore,
} from '../firstFracture';
import {
  earnReward,
  emptyRewardState,
  sanitizeRewardState,
  FIRST_FRACTURE_REWARDS,
  rewardDef,
} from '../../rewards';
import { sanitizeSave, defaultSettings } from '../../save';
import { campaigns } from '../../campaigns';
import { discoverNearby, moveForward } from '../world';

/* ---------------- musical object assignment ---------------- */

test('musical assignment: each resonator has a distinct voice; F-A-C-F spells the harmony', () => {
  const notes = FIRST_FRACTURE_SCORE.voices.map((v) => `${v.note}${v.octave}`);
  assert.deepEqual(notes, ['F3', 'A3', 'C4', 'F4']);
  const ids = FIRST_FRACTURE_SCORE.voices.map((v) => v.objectId);
  assert.deepEqual(ids, [...FF_RESONATOR_IDS]);
  // Every voice has a plain-language identity (no music theory required).
  for (const v of FIRST_FRACTURE_SCORE.voices) {
    assert.ok(v.plainIdentity.length > 5);
  }
});

test('note frequencies: A4=440, F3 and F4 an octave apart', () => {
  assert.ok(Math.abs(noteFreq('A', 4) - 440) < 1e-9);
  assert.ok(Math.abs(noteFreq('F', 4) / noteFreq('F', 3) - 2) < 1e-9);
  assert.ok(Math.abs(detuneFreq(440, 1200) - 880) < 1e-6);
});

/* ---------------- harmony combination ---------------- */

test('harmonic state: score completes only when every voice is confident', () => {
  const presences: Record<string, VoicePresence> = {};
  for (const id of FF_RESONATOR_IDS) presences[id] = 'confident';
  assert.equal(isScoreComplete(presences, FIRST_FRACTURE_SCORE), true);
  presences['resonator-3'] = 'clear';
  assert.equal(isScoreComplete(presences, FIRST_FRACTURE_SCORE), false);
});

test('soundscape reflects world state: faint voices are quieter and detuned', () => {
  const states: Record<string, VoiceState> = {
    'resonator-1': { presence: 'faint', pan: 0, proximity: 1 },
    'resonator-2': { presence: 'confident', pan: 0, proximity: 1 },
  };
  const voices = soundscapeVoices(FIRST_FRACTURE_SCORE, states);
  assert.equal(voices.length, 2); // undeclared voices stay silent
  const faint = voices[0];
  const confident = voices[1];
  assert.ok(faint.gain < confident.gain);
  assert.ok((faint.detuneCents ?? 0) > 0); // instability
  assert.equal(confident.detuneCents ?? 0, 0); // resolved, in tune
});

test('resolution: all four voices, in tune, spread across the stereo field', () => {
  const voices = resolutionVoices(FIRST_FRACTURE_SCORE);
  assert.equal(voices.length, 4);
  assert.ok(voices.every((v) => (v.detuneCents ?? 0) === 0));
  assert.ok(voices[0].pan < voices[3].pan);
  assert.match(resolutionCaption(FIRST_FRACTURE_SCORE), /tones align/);
});

test('captions are plain language with note identity, positioned', () => {
  const voice = voiceForObject(FIRST_FRACTURE_SCORE, 'resonator-1')!;
  const c = voiceChangeCaption(voice, 'confident', -0.8);
  assert.match(c, /low, warm tone \(F\)/);
  assert.match(c, /from your left/);
  assert.match(voiceChangeCaption(voice, 'faint', 0.9), /from your right/);
});

test('synth renders stereo WAV, deterministic per input, pan follows sign', () => {
  const uri1 = renderVoicesUri([{ freq: 220, gain: 0.2, pan: -1, timbre: 'drone' }], 0.3);
  const uri2 = renderVoicesUri([{ freq: 220, gain: 0.2, pan: -1, timbre: 'drone' }], 0.3);
  assert.equal(uri1, uri2); // stable identity
  assert.ok(uri1.startsWith('data:audio/wav;base64,'));
  const left = panGains(-1);
  assert.ok(left.left > 0.99 && left.right < 0.01);
});

/* ---------------- rewards ---------------- */

test('reward earn + duplicate protection', () => {
  const def = rewardDef('ff-fragment-a')!;
  let state = emptyRewardState();
  const first = earnReward(state, def, 1000);
  assert.equal(first.newlyEarned, true);
  assert.equal(first.state.earned['ff-fragment-a'].earnedAt, 1000);
  const second = earnReward(first.state, def, 2000);
  assert.equal(second.newlyEarned, false); // duplicate protected
  assert.equal(second.state.earned['ff-fragment-a'].earnedAt, 1000);
});

test('reward state sanitization survives malformed data', () => {
  assert.deepEqual(sanitizeRewardState(null).earned, {});
  assert.deepEqual(sanitizeRewardState('garbage').earned, {});
  assert.deepEqual(sanitizeRewardState({ earned: { x: { earnedAt: -5 } } }).earned, {});
  const ok = sanitizeRewardState({
    earned: { 'ff-hidden-1': { earnedAt: 123, count: 2.9 }, bad: 'nope' },
  });
  assert.deepEqual(ok.earned, { 'ff-hidden-1': { earnedAt: 123, count: 2 } });
});

test('every First Fracture reward is non-repeatable and well-formed', () => {
  const ids = new Set<string>();
  for (const r of FIRST_FRACTURE_REWARDS) {
    assert.ok(!ids.has(r.id));
    ids.add(r.id);
    assert.equal(r.campaignId, 'the-first-fracture');
    assert.equal(r.repeatable, false);
    assert.ok(r.title.length > 0 && r.description.length > 0);
  }
});

/* ---------------- chapter world / optional discoveries ---------------- */

test('chapter world: resonators map to the four established campaign nodes', () => {
  const campaign = campaigns.find((c) => c.id === 'the-first-fracture')!;
  for (const id of FF_RESONATOR_IDS) {
    const nodeId = FF_META[id].nodeId!;
    assert.ok(campaign.nodes.some((n) => n.id === nodeId), `${id} → ${nodeId}`);
  }
  // The linkage never rewrites node content: meta stores only the id.
  assert.ok(!('narrative' in FF_META['resonator-1']));
});

test('chapter world: only the anchor is known at start; exploration reveals more', () => {
  const world = createFirstFractureWorld();
  const discovered = world.objects.filter((o) => o.discovered).map((o) => o.id);
  assert.deepEqual(discovered, ['resonator-1']);
  // Walking east reveals the channel resonator eventually.
  world.player.headingDeg = 90;
  moveForward(world, 2);
  moveForward(world, 2);
  const found = discoverNearby(world);
  assert.ok(found.some((o) => o.id === 'resonator-2'));
});

test('optional content exists and is optional: fragments/inspects/hidden are not puzzle nodes', () => {
  for (const [id, meta] of Object.entries(FF_META)) {
    if (meta.role === 'resonator') continue;
    assert.equal(meta.nodeId, undefined, id);
    assert.ok(meta.inspectText.length > 10, id);
  }
  // Hidden objects gate behind attunement progress.
  assert.equal(FF_META['hidden-1'].revealAfterAttuned, 2);
  assert.equal(FF_META['hidden-2'].revealAfterAttuned, 4);
});

/* ---------------- save: explore state + haptics migration ---------------- */

test('explore save state sanitizes malformed data and dedupes', () => {
  const save = sanitizeSave({
    settings: defaultSettings,
    progress: {},
    explore: {
      'the-first-fracture': {
        attuned: ['resonator-1', 'resonator-1', 42, null, 'resonator-2'],
        collected: 'nope',
        inspected: ['inspect-1'],
        visitedHidden: [],
      },
      broken: 'garbage',
    },
  });
  assert.deepEqual(save.explore!['the-first-fracture'], {
    attuned: ['resonator-1', 'resonator-2'],
    collected: [],
    inspected: ['inspect-1'],
    visitedHidden: [],
    listenedAtRest: [],
  });
  assert.equal('broken' in save.explore!, false);
});

test('haptics split migration: legacy master switch seeds both channels', () => {
  // A legacy save has NO hapticsInterface/hapticsGameplay keys at all.
  const legacy: Record<string, unknown> = { ...defaultSettings, haptics: false };
  delete legacy.hapticsInterface;
  delete legacy.hapticsGameplay;
  delete legacy.shakeToInteract;
  const off = sanitizeSave({ settings: legacy });
  assert.equal(off.settings.hapticsInterface, false);
  assert.equal(off.settings.hapticsGameplay, false);
  const explicit = sanitizeSave({
    settings: { ...defaultSettings, haptics: false, hapticsInterface: true, hapticsGameplay: true },
  });
  assert.equal(explicit.settings.hapticsInterface, true); // explicit values win
  assert.equal(explicit.settings.hapticsGameplay, true);
  // Shake is OFF by default and survives sanitization.
  assert.equal(sanitizeSave({}).settings.shakeToInteract, false);
});

test('explore whitelist: unknown IDs and ungated hidden visits are rejected', () => {
  // Four arbitrary strings must NOT count as restoration.
  const forged = sanitizeFirstFractureExplore({
    attuned: ['x1', 'x2', 'x3', 'x4'],
    collected: ['not-a-fragment'],
    inspected: ['inspect-1', 'nope'],
    visitedHidden: ['hidden-1', 'hidden-2'],
  });
  assert.deepEqual(forged.attuned, []);
  assert.deepEqual(forged.collected, []);
  assert.deepEqual(forged.inspected, ['inspect-1']);
  // Hidden visits without the attunement prerequisite are dropped.
  assert.deepEqual(forged.visitedHidden, []);

  // Legitimate progression passes through intact.
  const legit = sanitizeFirstFractureExplore({
    attuned: ['resonator-1', 'resonator-2'],
    collected: ['fragment-a'],
    inspected: ['inspect-2'],
    visitedHidden: ['hidden-1', 'hidden-2'],
  });
  assert.deepEqual(legit.attuned, ['resonator-1', 'resonator-2']);
  assert.deepEqual(legit.collected, ['fragment-a']);
  // hidden-1 gate (2 attuned) met; hidden-2 gate (4) not met.
  assert.deepEqual(legit.visitedHidden, ['hidden-1']);
});

test('resolved-state helper matches world attunement', () => {
  const states: Record<string, VoiceState> = {};
  for (const id of FF_RESONATOR_IDS) states[id] = { presence: 'confident', pan: 0, proximity: 1 };
  assert.equal(isResolved(FIRST_FRACTURE_SCORE, states), true);
  states['resonator-4'].presence = 'faint';
  assert.equal(isResolved(FIRST_FRACTURE_SCORE, states), false);
  // voiceRender scales gain by proximity.
  const near = voiceRender(FIRST_FRACTURE_SCORE.voices[0], { presence: 'clear', pan: 0, proximity: 1 });
  const far = voiceRender(FIRST_FRACTURE_SCORE.voices[0], { presence: 'clear', pan: 0, proximity: 0 });
  assert.ok(near.gain > far.gain);
});

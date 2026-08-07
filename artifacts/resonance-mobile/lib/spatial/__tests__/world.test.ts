/**
 * Automated tests for the semantic spatial system (node:test, run via tsx).
 * These are pure-model tests: no rendering, audio hardware, or RN runtime.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createPrototypeWorld,
  discoverNearby,
  distanceCategory,
  interactableObjects,
  moveForward,
  orientationSummary,
  relativeDirection,
  turn,
  viewObject,
  visibleObjects,
  facingWord,
  type PlayerPose,
  type SpatialWorld,
} from '../world';
import { KIND_TONE_FREQ, objectPing, stereoGains } from '../audio';

const at = (x: number, y: number, z = 0) => ({ x, y, z });
const player = (headingDeg = 0, x = 0, y = 0): PlayerPose => ({
  position: at(x, y),
  headingDeg,
});

test('relative direction: eight sectors while facing north', () => {
  const p = player(0);
  assert.equal(relativeDirection(p, at(0, 5)), 'ahead');
  assert.equal(relativeDirection(p, at(5, 5)), 'ahead-right');
  assert.equal(relativeDirection(p, at(5, 0)), 'right');
  assert.equal(relativeDirection(p, at(5, -5)), 'behind-right');
  assert.equal(relativeDirection(p, at(0, -5)), 'behind');
  assert.equal(relativeDirection(p, at(-5, -5)), 'behind-left');
  assert.equal(relativeDirection(p, at(-5, 0)), 'left');
  assert.equal(relativeDirection(p, at(-5, 5)), 'ahead-left');
});

test('relative direction respects player heading', () => {
  const p = player(90); // facing east
  assert.equal(relativeDirection(p, at(5, 0)), 'ahead');
  assert.equal(relativeDirection(p, at(0, 5)), 'left');
  assert.equal(relativeDirection(p, at(0, -5)), 'right');
  assert.equal(relativeDirection(p, at(-5, 0)), 'behind');
});

test('distance classification boundaries', () => {
  assert.equal(distanceCategory(0), 'near');
  assert.equal(distanceCategory(3), 'near');
  assert.equal(distanceCategory(3.01), 'medium');
  assert.equal(distanceCategory(8), 'medium');
  assert.equal(distanceCategory(8.01), 'far');
});

test('turning updates orientation in 45-degree steps and wraps', () => {
  const world = createPrototypeWorld();
  assert.equal(facingWord(world.player.headingDeg), 'north');
  turn(world, 'right');
  assert.equal(facingWord(world.player.headingDeg), 'north-east');
  turn(world, 'left');
  turn(world, 'left');
  assert.equal(facingWord(world.player.headingDeg), 'north-west');
  for (let i = 0; i < 8; i++) turn(world, 'left');
  assert.equal(facingWord(world.player.headingDeg), 'north-west'); // full circle
});

test('moving forward follows the heading', () => {
  const world = createPrototypeWorld();
  world.player.headingDeg = 90; // east
  moveForward(world, 2);
  assert.ok(Math.abs(world.player.position.x - 2) < 1e-9);
  assert.ok(Math.abs(world.player.position.y) < 1e-9);
});

test('discovery: hidden objects appear when player comes near', () => {
  const world = createPrototypeWorld();
  const hidden = world.objects.find((o) => o.id === 'signal-west')!;
  assert.equal(hidden.discovered, false);
  assert.equal(discoverNearby(world).length, 1); // antenna at (-2,-7) is within 10m
  // Walk west toward the signal at (-14, 2).
  world.player.headingDeg = 270;
  moveForward(world, 2);
  assert.equal(discoverNearby(world).length, 0); // still too far (~12m)
  moveForward(world, 2);
  moveForward(world, 2);
  const found = discoverNearby(world);
  assert.ok(found.some((o) => o.id === 'signal-west'));
  assert.equal(hidden.discovered, true);
});

test('interactable detection requires discovery, range, and interactable flag', () => {
  const world = createPrototypeWorld();
  // Pillar at (4,4), interactRange 3: too far from origin (~5.66m).
  assert.equal(interactableObjects(world).length, 0);
  world.player.position = { x: 3, y: 3, z: 0 };
  const ids = interactableObjects(world).map((v) => v.object.id);
  assert.deepEqual(ids, ['pillar-east']);
  // The fracture is near but interactable=false; must never appear.
  assert.ok(!ids.includes('fracture'));
});

test('object state changes flow into descriptions', () => {
  const world = createPrototypeWorld();
  const pillar = world.objects.find((o) => o.id === 'pillar-east')!;
  let desc = orientationSummary(world);
  assert.match(desc, /resonant pillar is ahead and right/i);
  assert.match(desc, /dormant/);
  pillar.state = 'attuned';
  desc = orientationSummary(world);
  assert.match(desc, /attuned/);
});

test('orientation summary lists nearest first and counts undiscovered', () => {
  const world = createPrototypeWorld();
  const summary = orientationSummary(world);
  assert.match(summary, /^You are facing north\./);
  const pillarIdx = summary.indexOf('resonant pillar');
  const fractureIdx = summary.indexOf('fracture');
  assert.ok(pillarIdx > 0 && fractureIdx > 0 && pillarIdx < fractureIdx); // pillar ~5.66m < fracture 6m
  assert.match(summary, /2 signals remain undiscovered/);
});

test('elevation is described in plain words', () => {
  const world = createPrototypeWorld();
  const antenna = world.objects.find((o) => o.id === 'landmark-high')!;
  antenna.discovered = true;
  const v = viewObject(world, antenna);
  assert.equal(v.elevation, 'above you');
});

test('spatial audio: pan follows direction, volume follows distance', () => {
  const right = stereoGains(90, 2);
  assert.ok(right.right > right.left);
  const left = stereoGains(-90, 2);
  assert.ok(left.left > left.right);
  const centerNear = stereoGains(0, 1);
  const centerFar = stereoGains(0, 15);
  assert.ok(centerNear.left + centerNear.right > centerFar.left + centerFar.right);
  const behind = stereoGains(180, 1);
  assert.ok(behind.left + behind.right < centerNear.left + centerNear.right);
});

test('spatial audio: consistent identity and caption per object', () => {
  const world = createPrototypeWorld();
  const pillar = visibleObjects(world).find((v) => v.object.id === 'pillar-east')!;
  const ping = objectPing(world.player, pillar);
  assert.match(ping.caption, /\[Ping: a resonant pillar, ahead and right, medium\]/);
  assert.ok(ping.uri.startsWith('data:audio/wav;base64,'));
  assert.equal(KIND_TONE_FREQ.pillar, 330);
  // Same query twice yields the same sound (stable identity).
  assert.equal(objectPing(world.player, pillar).uri, ping.uri);
});

test('malformed spatial state cannot crash queries', () => {
  const world = createPrototypeWorld() as SpatialWorld;
  // Simulate damage: NaN position and absurd heading.
  world.player.headingDeg = 987654;
  world.objects[0].position = { x: Number.NaN, y: Number.NaN, z: 0 };
  const summary = orientationSummary(world);
  assert.equal(typeof summary, 'string');
  assert.ok(summary.length > 0);
  assert.doesNotThrow(() => visibleObjects(world));
  assert.doesNotThrow(() => interactableObjects(world));
});

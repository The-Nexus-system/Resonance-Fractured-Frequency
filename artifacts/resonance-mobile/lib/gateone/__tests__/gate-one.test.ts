import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTERS } from '../characters';
import { buildScript } from '../script';
import { isWalkable, zoneAt, PLAYER_START, PLACES } from '../world';

test('all six authored identities have their own complete Gate One', () => {
  assert.equal(CHARACTERS.length, 6);
  assert.equal(new Set(CHARACTERS.map(c => c.id)).size, 6);
  for (const character of CHARACTERS) {
    const events = buildScript(character.id);
    assert.equal(new Set(events.map(e => e.id)).size, events.length, character.id);
    for (const id of ['cabin-open', 'docking', 'concourse-arrive', 'crew-scan', 'boarding', 'gate-one-end']) {
      assert.ok(events.some(e => e.id === id), character.id + ': missing ' + id);
    }
    assert.equal(events.find(e => e.id === 'docking')?.effect, 'openHatch');
    assert.equal(events.find(e => e.id === 'gate-one-end')?.effect, 'endGateOne');
    const scan = events.find(e => e.id === 'crew-scan');
    assert.ok(scan?.lines.some(line => line.text === character.boardingAnswer), character.id);
    assert.ok(events.every(e => e.lines.length > 0 && e.lines.every(line => line.text.length > 0)));
    // The chapter ends at the first lift, not invented post-intake gameplay.
    assert.equal(events.filter(e => e.effect === 'endGateOne').length, 1);
  }
});

test('the continuous walkable route has a physical sealed hatch and no teleport', () => {
  assert.deepEqual(PLAYER_START, { x: 0, y: 2, heading: 0 });
  assert.equal(isWalkable(PLAYER_START.x, PLAYER_START.y, false), true);
  assert.equal(isWalkable(PLACES.hatch.x, 13, false), false);
  assert.equal(isWalkable(PLACES.hatch.x, 13, true), true);
  assert.equal(isWalkable(16, 70, true), true);
  assert.equal(isWalkable(PLACES.lift.x, PLACES.lift.y, true), true);
  assert.equal(isWalkable(45, 100, true), false);
  assert.equal(zoneAt(0, 2).id, 'cabin');
  assert.equal(zoneAt(0, 30).id, 'concourse');
  assert.equal(zoneAt(16, 70).id, 'bridge');
  assert.equal(zoneAt(16, 100).id, 'hearth');
});

test('all meaningful scripted lines remain captionable across identities', () => {
  const kinds = new Set(['npc', 'pa', 'badge', 'player', 'narration']);
  for (const character of CHARACTERS) {
    const events = buildScript(character.id);
    for (const event of events) {
      for (const line of event.lines) {
        assert.ok(kinds.has(line.kind), event.id + ' has an unknown caption kind');
        assert.equal(typeof line.speaker, 'string');
        assert.ok(line.text.trim().length > 0, event.id + ' has an empty caption');
      }
    }
  }
});

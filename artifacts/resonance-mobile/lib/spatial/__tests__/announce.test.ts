/**
 * Tests for the speech-safe announcement coalescer: rapid routine updates
 * must not accumulate in the speech queue; critical updates always speak.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAnnouncementCoalescer } from '../announce';

/** Deterministic fake clock + scheduler. */
function harness(minIntervalMs = 1500) {
  let time = 0;
  const spoken: string[] = [];
  const timers: { at: number; fn: () => void; id: number; cancelled: boolean }[] = [];
  let nextId = 1;
  const coalescer = createAnnouncementCoalescer(
    (m) => spoken.push(m),
    minIntervalMs,
    () => time,
    (fn, ms) => {
      const id = nextId++;
      timers.push({ at: time + ms, fn, id, cancelled: false });
      return id as unknown as ReturnType<typeof setTimeout>;
    },
    (t) => {
      const rec = timers.find((x) => x.id === (t as unknown as number));
      if (rec) rec.cancelled = true;
    },
  );
  const advance = (ms: number) => {
    const target = time + ms;
    for (const rec of [...timers].sort((a, b) => a.at - b.at)) {
      if (!rec.cancelled && rec.at <= target) {
        time = rec.at;
        rec.cancelled = true;
        rec.fn();
      }
    }
    time = target;
  };
  return { spoken, advance, coalescer, timeOf: () => time };
}

test('routine announcements coalesce: rapid input speaks at most latest state', () => {
  const h = harness();
  h.coalescer.routine('Facing north-east.');
  assert.deepEqual(h.spoken, ['Facing north-east.']); // first speaks immediately
  // Six rapid turns within the interval — none should speak yet.
  for (const m of ['east', 'south-east', 'south', 'south-west', 'west', 'north-west']) {
    h.advance(100);
    h.coalescer.routine(`Facing ${m}.`);
  }
  assert.equal(h.spoken.length, 1);
  // After the interval elapses, exactly ONE trailing announcement: the latest.
  h.advance(2000);
  assert.deepEqual(h.spoken, ['Facing north-east.', 'Facing north-west.']);
});

test('slow routine announcements pass through unchanged', () => {
  const h = harness();
  h.coalescer.routine('Moved forward.');
  h.advance(2000);
  h.coalescer.routine('Facing east.');
  assert.deepEqual(h.spoken, ['Moved forward.', 'Facing east.']);
});

test('critical announcements speak immediately and drop pending routine text', () => {
  const h = harness();
  h.coalescer.routine('Facing east.');
  h.advance(100);
  h.coalescer.routine('Moved forward.'); // pending
  h.coalescer.critical('Discovered: A distant signal.');
  assert.deepEqual(h.spoken, ['Facing east.', 'Discovered: A distant signal.']);
  // The stale routine message must never speak later.
  h.advance(5000);
  assert.deepEqual(h.spoken, ['Facing east.', 'Discovered: A distant signal.']);
});

test('dispose cancels pending announcements', () => {
  const h = harness();
  h.coalescer.routine('Facing east.');
  h.advance(100);
  h.coalescer.routine('Moved forward.');
  h.coalescer.dispose();
  h.advance(5000);
  assert.deepEqual(h.spoken, ['Facing east.']);
});

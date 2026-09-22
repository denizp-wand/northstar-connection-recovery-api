import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isStale, recoveryOptions } from '../src/recovery.js';

test('the envelope no longer carries a reading time (v42.7.0)', () => {
  assert.equal('observedAt' in recoveryOptions([], '2026-09-23T09:00:00.000Z'), false);
});

test('infeasible options are not offered', () => {
  const out = recoveryOptions([{ optionId: 'A', feasible: false }, { optionId: 'B', feasible: true }], 'x');
  assert.deepEqual(out.options.map((o) => o.optionId), ['B']);
});

test('a list older than the published window is stale', () => {
  const now = Date.parse('2026-09-23T09:05:00.000Z');
  assert.equal(isStale({ observedAt: '2026-09-23T09:04:30.000Z' }, now), false);
  assert.equal(isStale({ observedAt: '2026-09-23T09:00:00.000Z' }, now), true);
});

test('an envelope with no reading time cannot be called fresh', () => {
  assert.equal(isStale({}, Date.now()), true);
});

/**
 * Breathing timing regression tests (SOS + 5-5)
 *
 * Run with:
 *   cd web
 *   npx tsx lib/__tests__/breathing-engine-timing.test.ts
 */

import { strict as assert } from 'assert';
import { getBreathingSnapshotAtElapsedMs } from '../breathing/engineSnapshot';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    // eslint-disable-next-line no-console
    console.log(`✓ ${name}`);
  } catch (err) {
    failed++;
    // eslint-disable-next-line no-console
    console.error(`✗ ${name}`);
    // eslint-disable-next-line no-console
    console.error(`  ${err instanceof Error ? err.message : String(err)}`);
  }
}

function describe(name: string, fn: () => void) {
  // eslint-disable-next-line no-console
  console.log(`\n${name}`);
  // eslint-disable-next-line no-console
  console.log('='.repeat(name.length));
  fn();
}

describe('Breathing engine timing', () => {
  test('SOS: transitions inhale->exhale at 4000ms and completes at 60000ms with 6 cycles', () => {
    const phases = [
      { name: 'Inhale', durationSeconds: 4 },
      { name: 'Exhale', durationSeconds: 6 },
    ];

    const t0 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 0, totalMs: 60_000 });
    assert.equal(t0.phaseName, 'Inhale');
    assert.equal(t0.cyclesCompleted, 0);

    const t3999 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 3_999, totalMs: 60_000 });
    assert.equal(t3999.phaseName, 'Inhale');

    const t4000 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 4_000, totalMs: 60_000 });
    assert.equal(t4000.phaseName, 'Exhale');

    const t9999 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 9_999, totalMs: 60_000 });
    assert.equal(t9999.phaseName, 'Exhale');
    assert.equal(t9999.cyclesCompleted, 0);

    const t10000 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 10_000, totalMs: 60_000 });
    assert.equal(t10000.phaseName, 'Inhale');
    assert.equal(t10000.cyclesCompleted, 1);

    const t60000 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 60_000, totalMs: 60_000 });
    assert.equal(t60000.isComplete, true);
    assert.equal(t60000.cyclesCompleted, 6);
    assert.equal(Math.round(t60000.progress), 100);
  });

  test('5-5: alternates every 5000ms and never sticks on inhale', () => {
    const phases = [
      { name: 'Inhale', durationSeconds: 5 },
      { name: 'Exhale', durationSeconds: 5 },
    ];

    const t0 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 0, totalMs: 60_000 });
    assert.equal(t0.phaseName, 'Inhale');

    const t4999 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 4_999, totalMs: 60_000 });
    assert.equal(t4999.phaseName, 'Inhale');

    const t5000 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 5_000, totalMs: 60_000 });
    assert.equal(t5000.phaseName, 'Exhale');

    const t10000 = getBreathingSnapshotAtElapsedMs({ phases, elapsedMs: 10_000, totalMs: 60_000 });
    assert.equal(t10000.phaseName, 'Inhale');
  });
});

if (failed > 0) {
  // eslint-disable-next-line no-console
  console.error(`\n${failed} tests failed`);
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`\nAll tests passed (${passed})`);

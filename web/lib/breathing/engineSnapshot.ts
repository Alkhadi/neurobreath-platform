export type BreathingPhaseDef = {
  name: string;
  durationSeconds: number;
};

export type BreathingSnapshot = {
  phaseIndex: number;
  phaseName: string;
  phaseMsRemaining: number;
  cyclesCompleted: number;
  progress: number; // 0..100
  isComplete: boolean;
};

function getCycleDurationMs(phases: BreathingPhaseDef[]): number {
  const total = phases.reduce((sum, phase) => sum + Math.max(0, phase.durationSeconds), 0);
  return Math.round(total * 1000);
}

function getPhaseAtWithinCycleMs(phases: BreathingPhaseDef[], withinCycleMs: number): {
  phaseIndex: number;
  phaseMsRemaining: number;
} {
  let remainingMs = withinCycleMs;

  for (let i = 0; i < phases.length; i++) {
    const phaseMs = Math.round(Math.max(0, phases[i].durationSeconds) * 1000);
    if (remainingMs < phaseMs) {
      return {
        phaseIndex: i,
        phaseMsRemaining: Math.max(0, phaseMs - remainingMs),
      };
    }
    remainingMs -= phaseMs;
  }

  // Fallback (shouldn't happen if withinCycleMs is in [0, cycleMs))
  return { phaseIndex: 0, phaseMsRemaining: Math.round(Math.max(0, phases[0]?.durationSeconds ?? 0) * 1000) };
}

export function getBreathingSnapshotAtElapsedMs(args: {
  phases: BreathingPhaseDef[];
  elapsedMs: number;
  totalMs?: number;
}): BreathingSnapshot {
  const phases = args.phases;
  if (!Array.isArray(phases) || phases.length === 0) {
    return {
      phaseIndex: 0,
      phaseName: 'Inhale',
      phaseMsRemaining: 0,
      cyclesCompleted: 0,
      progress: 0,
      isComplete: true,
    };
  }

  const elapsedMs = Math.max(0, Math.floor(args.elapsedMs));

  const hasFiniteTotalMs = Number.isFinite(args.totalMs) && (args.totalMs as number) >= 0;
  const totalMs = hasFiniteTotalMs ? Math.max(0, Math.floor(args.totalMs as number)) : Number.POSITIVE_INFINITY;
  const clampedElapsedMs = hasFiniteTotalMs ? Math.min(elapsedMs, totalMs) : elapsedMs;

  const cycleMs = getCycleDurationMs(phases);
  const safeCycleMs = cycleMs > 0 ? cycleMs : 1;

  const isComplete = hasFiniteTotalMs ? elapsedMs >= totalMs : false;
  const cyclesCompleted = Math.floor(clampedElapsedMs / safeCycleMs);
  const withinCycleMs = safeCycleMs === 0 ? 0 : clampedElapsedMs % safeCycleMs;

  const { phaseIndex, phaseMsRemaining } = getPhaseAtWithinCycleMs(phases, withinCycleMs);

  const progress = hasFiniteTotalMs ? (totalMs === 0 ? 100 : (clampedElapsedMs / totalMs) * 100) : 0;

  return {
    phaseIndex,
    phaseName: phases[phaseIndex]?.name ?? phases[0].name,
    phaseMsRemaining,
    cyclesCompleted,
    progress,
    isComplete,
  };
}

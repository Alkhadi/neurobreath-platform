/**
 * Experiments / A-B Testing Engine
 *
 * - Client-only localStorage store with in-memory cache
 * - Deterministic per-device assignment (persisted)
 * - Integrates with local analytics via hooks (exposure/conversion)
 */

import {
  createDefaultExperimentsStore,
  EXPERIMENTS_STORAGE_KEY,
  type ExperimentAssignment,
  type ExperimentDefinition,
  type ExperimentsStore,
  type ExperimentVariant,
} from './schema';

let memoryStore: ExperimentsStore | null = null;
let isInitialized = false;

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function safeParse(raw: string | null): ExperimentsStore | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExperimentsStore;
  } catch {
    return null;
  }
}

function loadFromStorage(): ExperimentsStore {
  if (!isStorageAvailable()) return createDefaultExperimentsStore();

  const existing = safeParse(window.localStorage.getItem(EXPERIMENTS_STORAGE_KEY));
  if (existing?.version === 1 && existing.assignments) return existing;

  return createDefaultExperimentsStore();
}

function saveToStorage(store: ExperimentsStore): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(EXPERIMENTS_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // never block UX
  }
}

export function initializeExperiments(): ExperimentsStore {
  if (!isInitialized) {
    memoryStore = loadFromStorage();
    isInitialized = true;
  }
  return memoryStore!;
}

export function getExperimentsStore(): ExperimentsStore {
  if (!memoryStore) return initializeExperiments();
  return memoryStore;
}

export function getAssignment<TVariant extends ExperimentVariant>(
  experimentId: string
): ExperimentAssignment<TVariant> | null {
  const store = getExperimentsStore();
  const found = store.assignments[experimentId];
  return (found as ExperimentAssignment<TVariant> | undefined) || null;
}

function clampRollout(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1;
  return Math.max(0, Math.min(1, value));
}

function normalizeWeights(variants: ReadonlyArray<string>, weights?: ReadonlyArray<number>): number[] {
  if (!weights || weights.length !== variants.length) {
    return variants.map(() => 1);
  }
  const safe = weights.map(w => (typeof w === 'number' && w > 0 ? w : 0));
  const sum = safe.reduce((a, b) => a + b, 0);
  if (sum <= 0) return variants.map(() => 1);
  return safe;
}

function pickWeighted<TVariant extends ExperimentVariant>(
  variants: ReadonlyArray<TVariant>,
  weights?: ReadonlyArray<number>
): TVariant {
  const normalized = normalizeWeights(variants, weights);
  const total = normalized.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < variants.length; i++) {
    acc += normalized[i];
    if (r <= acc) return variants[i];
  }
  return variants[variants.length - 1];
}

export function getOrAssignVariant<TVariant extends ExperimentVariant>(
  definition: ExperimentDefinition<TVariant>
): ExperimentAssignment<TVariant> {
  const store = getExperimentsStore();
  const existing = store.assignments[definition.id] as ExperimentAssignment<TVariant> | undefined;
  if (existing) return existing;

  const rollout = clampRollout(definition.rollout);
  const inExperiment = Math.random() < rollout;

  const variant = inExperiment
    ? pickWeighted(definition.variants, definition.weights)
    : definition.fallbackVariant;

  const assignment: ExperimentAssignment<TVariant> = {
    experimentId: definition.id,
    variant,
    assignedAt: Date.now(),
    inExperiment,
  };

  store.assignments[definition.id] = assignment as ExperimentAssignment;
  saveToStorage(store);

  return assignment;
}

export function markExposed(experimentId: string): void {
  const store = getExperimentsStore();
  const assignment = store.assignments[experimentId];
  if (!assignment) return;
  if (assignment.exposedAt) return;

  assignment.exposedAt = Date.now();
  saveToStorage(store);
}

export function resetExperiment(experimentId: string): void {
  const store = getExperimentsStore();
  delete store.assignments[experimentId];
  saveToStorage(store);
}

export function resetAllExperiments(): void {
  memoryStore = createDefaultExperimentsStore();
  isInitialized = true;
  saveToStorage(memoryStore);
}

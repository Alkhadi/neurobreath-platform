/**
 * Experiments / A-B Testing Schema
 *
 * Privacy-first client-side experiments.
 * - Assignment is stored locally (no server calls)
 * - Exposure + conversion are tracked via local analytics
 */

export type ExperimentVariant = string;

export interface ExperimentDefinition<TVariant extends ExperimentVariant = ExperimentVariant> {
  /** Unique stable identifier (include version) */
  id: string;
  /** Variants available for this experiment */
  variants: ReadonlyArray<TVariant>;
  /** Optional weights; must match variants length. Defaults to equal weights. */
  weights?: ReadonlyArray<number>;
  /** Rollout percentage 0..1 (default 1.0). */
  rollout?: number;
  /** Variant to use if not included or on any failure. */
  fallbackVariant: TVariant;
}

export interface ExperimentAssignment<TVariant extends ExperimentVariant = ExperimentVariant> {
  experimentId: string;
  variant: TVariant;
  assignedAt: number;
  inExperiment: boolean;
  exposedAt?: number;
}

export interface ExperimentsStore {
  version: number;
  assignments: Record<string, ExperimentAssignment>;
}

export const EXPERIMENTS_SCHEMA_VERSION = 1;
export const EXPERIMENTS_STORAGE_KEY = 'neurobreath_experiments_v1';

export function createDefaultExperimentsStore(): ExperimentsStore {
  return {
    version: EXPERIMENTS_SCHEMA_VERSION,
    assignments: {},
  };
}

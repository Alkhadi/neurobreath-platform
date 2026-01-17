/**
 * Experiment Definitions
 *
 * Central place to define experiment IDs and variants.
 */

import type { ExperimentDefinition } from './schema';

const MY_PLAN_EMPTY_STATE_CTA_COPY_VARIANTS = ['browse_tools', 'explore_tools'] as const;

export const MY_PLAN_EMPTY_STATE_CTA_COPY = {
  id: 'my_plan_empty_state_cta_copy_v1',
  variants: MY_PLAN_EMPTY_STATE_CTA_COPY_VARIANTS,
  fallbackVariant: 'browse_tools',
  rollout: 1,
} satisfies ExperimentDefinition<(typeof MY_PLAN_EMPTY_STATE_CTA_COPY_VARIANTS)[number]>;

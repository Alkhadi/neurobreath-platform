import type { UniversalProgressActivityType } from '@/contexts/UniversalProgressContext'

export interface ContentIdentity {
  activityType: UniversalProgressActivityType
  activityId: string
}

/**
 * Thin abstraction so content can later be sourced from a CMS
 * without rewriting progress tracking logic.
 */
export function getContentIdentity(input: { activityType: UniversalProgressActivityType; slug: string }): ContentIdentity {
  return {
    activityType: input.activityType,
    activityId: input.slug,
  }
}

/**
 * Resource Recommendation Engine
 * 
 * Deterministic (no AI) matching of NeuroBreath resources
 * to user context, topic, and question
 */

import type { UserContext, Topic, MainChallenge, Goal } from '@/types/user-context'
import { NEUROBREATH_RESOURCES, type NeuroBreathResource } from './neurobreath-resources'

export interface RecommendedResourceWithReason {
  id: string
  title: string
  type: string
  url: string
  whyThisFits: string
  howToUseThisWeek: string
}

interface RecommendationInput {
  context: UserContext
  topic?: Topic
  normalizedQuestion: string
}

/**
 * Calculate match score for a resource
 */
function calculateMatchScore(
  resource: NeuroBreathResource,
  context: UserContext,
  topic?: Topic
): number {
  let score = 0
  
  // Topic match (highest priority)
  if (topic && resource.tags.topics.includes(topic)) {
    score += 100
  }
  
  // Challenge match
  if (context.mainChallenge && resource.tags.challenges.includes(context.mainChallenge)) {
    score += 50
  }
  
  // Goal match
  if (context.goal && resource.tags.goals.includes(context.goal)) {
    score += 40
  }
  
  // Age group match
  if (context.ageGroup && resource.audience.includes(context.ageGroup)) {
    score += 20
  }
  
  // Setting-specific boosts
  if (context.setting === 'school' && resource.type === 'training') {
    score += 10
  }
  if (context.setting === 'home' && (resource.type === 'tool' || resource.type === 'challenge')) {
    score += 10
  }
  if (context.setting === 'workplace' && resource.tags.topics.includes('stress')) {
    score += 10
  }
  
  return score
}

/**
 * Generate "why this fits" explanation
 */
function generateWhyThisFits(
  resource: NeuroBreathResource,
  context: UserContext,
  topic?: Topic
): string {
  const reasons: string[] = []
  
  if (topic && resource.tags.topics.includes(topic)) {
    const topicLabel = topic.charAt(0).toUpperCase() + topic.slice(1)
    reasons.push(`Directly supports ${topicLabel}`)
  }
  
  if (context.mainChallenge && resource.tags.challenges.includes(context.mainChallenge)) {
    reasons.push(`Addresses ${context.mainChallenge}`)
  }
  
  if (context.goal && resource.tags.goals.includes(context.goal)) {
    const goalLabel = context.goal.replace(/-/g, ' ')
    reasons.push(`Helps ${goalLabel}`)
  }
  
  if (context.ageGroup && resource.audience.includes(context.ageGroup)) {
    reasons.push(`Suited for ${context.ageGroup}`)
  }
  
  if (context.setting) {
    reasons.push(`Works well in ${context.setting}`)
  }
  
  if (reasons.length === 0) {
    return resource.whenToUse
  }
  
  return reasons.join('; ')
}

/**
 * Generate "how to use this week" steps
 */
function generateHowToUseThisWeek(
  resource: NeuroBreathResource,
  context: UserContext
): string {
  const steps: string[] = []
  
  if (resource.type === 'breathing') {
    steps.push('Practice 2-3 times daily for 2-5 minutes')
    if (context.mainChallenge === 'sleep') {
      steps.push('Use before bed as part of wind-down routine')
    } else if (context.mainChallenge === 'anxiety' || context.mainChallenge === 'meltdowns') {
      steps.push('Use when you first notice anxiety rising')
    } else {
      steps.push('Try morning, midday, and evening sessions')
    }
  } else if (resource.type === 'challenge') {
    steps.push('Start Day 1 today; commit to 5 minutes daily')
    steps.push('Track progress and celebrate small wins')
  } else if (resource.type === 'tool') {
    if (context.setting === 'school') {
      steps.push('Explore with teacher or SENCO this week')
      steps.push('Try during one lesson or activity')
    } else if (context.setting === 'home') {
      steps.push('Set up this week; use daily for 10-15 minutes')
      steps.push('Build into morning or after-school routine')
    } else {
      steps.push('Explore and try one feature this week')
      steps.push('Use for 10 minutes daily')
    }
  } else if (resource.type === 'training') {
    steps.push('Complete first lesson/module this week')
    steps.push('Practice 15-20 minutes, 3-4 times')
  } else if (resource.type === 'article') {
    steps.push('Read and identify 1-2 strategies to try')
    steps.push('Implement one this week')
  }
  
  return steps.join('. ')
}

/**
 * Recommend resources based on context and topic
 * Returns top 3-6 resources with explanations
 */
export function recommendResources(input: RecommendationInput): RecommendedResourceWithReason[] {
  const { context, topic, normalizedQuestion } = input
  
  // Calculate scores for all resources
  const scoredResources = NEUROBREATH_RESOURCES.map(resource => ({
    resource,
    score: calculateMatchScore(resource, context, topic)
  }))
  
  // Sort by score (highest first)
  scoredResources.sort((a, b) => b.score - a.score)
  
  // Always include at least 1 breathing technique if anxiety/stress/meltdowns/sleep present
  const needsBreathing = 
    context.mainChallenge === 'anxiety' ||
    context.mainChallenge === 'meltdowns' ||
    context.mainChallenge === 'sleep' ||
    topic === 'anxiety' ||
    topic === 'stress' ||
    topic === 'sleep'
  
  const recommendations: RecommendedResourceWithReason[] = []
  
  if (needsBreathing) {
    // Force include top breathing resource
    const breathingResource = scoredResources.find(sr => sr.resource.type === 'breathing')
    if (breathingResource) {
      recommendations.push({
        id: breathingResource.resource.id,
        title: breathingResource.resource.title,
        type: breathingResource.resource.type,
        url: breathingResource.resource.url,
        whyThisFits: generateWhyThisFits(breathingResource.resource, context, topic),
        howToUseThisWeek: generateHowToUseThisWeek(breathingResource.resource, context)
      })
    }
  }
  
  // Add top-scoring resources (excluding ones already added)
  for (const scored of scoredResources) {
    if (recommendations.find(r => r.id === scored.resource.id)) {
      continue
    }
    
    if (scored.score > 0) {
      recommendations.push({
        id: scored.resource.id,
        title: scored.resource.title,
        type: scored.resource.type,
        url: scored.resource.url,
        whyThisFits: generateWhyThisFits(scored.resource, context, topic),
        howToUseThisWeek: generateHowToUseThisWeek(scored.resource, context)
      })
    }
    
    // Cap at 6 recommendations
    if (recommendations.length >= 6) break
  }
  
  // If we still have < 3, add generic high-value resources
  if (recommendations.length < 3) {
    const fallbackIds = ['calm-challenge', 'box-breathing', 'focus-garden']
    for (const id of fallbackIds) {
      if (recommendations.find(r => r.id === id)) continue
      
      const resource = NEUROBREATH_RESOURCES.find(r => r.id === id)
      if (resource) {
        recommendations.push({
          id: resource.id,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          whyThisFits: resource.whenToUse,
          howToUseThisWeek: generateHowToUseThisWeek(resource, context)
        })
      }
      
      if (recommendations.length >= 3) break
    }
  }
  
  return recommendations.slice(0, 6)
}






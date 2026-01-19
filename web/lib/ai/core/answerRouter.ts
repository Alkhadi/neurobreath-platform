/**
 * Unified AI Core - Answer Router
 * 
 * Routes AI requests to appropriate handlers based on query type and context.
 * Determines when to use:
 * - Evidence-based retrieval (NHS, NICE, PubMed)
 * - General knowledge base
 * - Page-specific help
 * - Crisis escalation
 */

import { checkQuerySafety, type SafetyCheckResult } from './safety';
import type { Topic } from '@/lib/evidence/sourceRegistry';

export type QueryType =
  | 'emergency' // Immediate crisis
  | 'health_evidence' // Requires evidence-based answer (NHS, NICE, PubMed)
  | 'navigation' // Page navigation or UI help
  | 'general_info' // Platform information, non-clinical
  | 'tool_help'; // Specific tool usage

export interface RoutingDecision {
  queryType: QueryType;
  requiresEvidence: boolean;
  topic?: Topic;
  safetyCheck: SafetyCheckResult;
  suggestedSources: ('nhs' | 'nice' | 'pubmed' | 'kb')[];
  priority: 'immediate' | 'high' | 'normal';
}

/**
 * Route query to appropriate handler
 */
export function routeQuery(
  query: string,
  context: {
    pagePath?: string;
    jurisdiction?: 'UK' | 'US' | 'EU';
    role?: 'buddy' | 'coach' | 'blog';
  }
): RoutingDecision {
  const { pagePath, jurisdiction = 'UK', role = 'buddy' } = context;

  // Safety check first
  const safetyCheck = checkQuerySafety(query, jurisdiction);

  // Emergency/safeguarding: immediate escalation
  if (safetyCheck.level === 'emergency' || safetyCheck.level === 'safeguarding') {
    return {
      queryType: 'emergency',
      requiresEvidence: false,
      safetyCheck,
      suggestedSources: [],
      priority: 'immediate',
    };
  }

  // Detect topic from query
  const topic = detectTopic(query);

  // Detect query type
  const queryType = detectQueryType(query, pagePath, role);

  // Determine if evidence is required
  const requiresEvidence = queryType === 'health_evidence';

  // Suggest sources
  const suggestedSources = getSuggestedSources(queryType, topic, jurisdiction);

  // Determine priority
  const priority =
    safetyCheck.level === 'crisis' || safetyCheck.level === 'urgent'
      ? 'high'
      : 'normal';

  return {
    queryType,
    requiresEvidence,
    topic,
    safetyCheck,
    suggestedSources,
    priority,
  };
}

/**
 * Detect query type from content
 */
function detectQueryType(query: string, _pagePath?: string, _role?: string): QueryType {
  const lowerQuery = query.toLowerCase();

  // Navigation keywords
  const navigationKeywords = [
    'where is',
    'how do i get to',
    'take me to',
    'show me',
    'navigate',
    'find the',
    'go to',
    'open',
  ];
  if (navigationKeywords.some((kw) => lowerQuery.includes(kw))) {
    return 'navigation';
  }

  // Tool help keywords
  const toolKeywords = [
    'how to use',
    'how does this work',
    'what does this button',
    'help with',
    'instructions for',
    'guide me through',
  ];
  if (toolKeywords.some((kw) => lowerQuery.includes(kw))) {
    return 'tool_help';
  }

  // Health/evidence keywords
  const healthKeywords = [
    'adhd',
    'autism',
    'dyslexia',
    'anxiety',
    'depression',
    'symptoms',
    'diagnosis',
    'treatment',
    'medication',
    'therapy',
    'support for',
    'help with',
    'strategies for',
    'managing',
    'coping with',
  ];
  if (healthKeywords.some((kw) => lowerQuery.includes(kw))) {
    return 'health_evidence';
  }

  // Default: general info
  return 'general_info';
}

/**
 * Detect topic from query
 */
function detectTopic(query: string): Topic | undefined {
  const lowerQuery = query.toLowerCase();

  const topicKeywords: Record<Topic, string[]> = {
    adhd: ['adhd', 'attention deficit', 'hyperactivity', 'inattention', 'focus'],
    autism: ['autism', 'autistic', 'asd', 'asperger', 'sensory', 'stimming'],
    dyslexia: ['dyslexia', 'dyslexic', 'reading difficulty', 'phonics'],
    anxiety: ['anxiety', 'anxious', 'worry', 'panic', 'nervous', 'fear'],
    depression: ['depression', 'depressed', 'low mood', 'sad', 'hopeless'],
    breathing: ['breathing', 'breath', 'calm', 'relaxation', 'grounding'],
    sleep: ['sleep', 'insomnia', 'tired', 'rest', 'bedtime'],
    bipolar: ['bipolar', 'manic', 'mania', 'mood swings'],
    stress: ['stress', 'stressed', 'overwhelmed', 'pressure'],
    burnout: ['burnout', 'burnt out', 'exhausted', 'overworked'],
    safeguarding: ['abuse', 'harm', 'unsafe', 'protection'],
    general: [],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((kw) => lowerQuery.includes(kw))) {
      return topic as Topic;
    }
  }

  return 'general';
}

/**
 * Get suggested sources based on query type and topic
 */
function getSuggestedSources(
  queryType: QueryType,
  topic: Topic | undefined,
  jurisdiction: 'UK' | 'US' | 'EU'
): ('nhs' | 'nice' | 'pubmed' | 'kb')[] {
  // Navigation and tool help: use knowledge base only
  if (queryType === 'navigation' || queryType === 'tool_help') {
    return ['kb'];
  }

  // Health evidence: prioritize clinical sources
  if (queryType === 'health_evidence') {
    if (jurisdiction === 'UK') {
      return ['nhs', 'nice', 'pubmed', 'kb'];
    } else if (jurisdiction === 'US') {
      return ['pubmed', 'kb'];
    } else {
      return ['pubmed', 'kb'];
    }
  }

  // General info: knowledge base first
  return ['kb'];
}

/**
 * Determine if query needs external API (LLM)
 */
export function needsLLM(decision: RoutingDecision): boolean {
  // Emergency: no LLM, just signposting
  if (decision.queryType === 'emergency') {
    return false;
  }

  // Health evidence: may need LLM for synthesis
  if (decision.queryType === 'health_evidence') {
    return true;
  }

  // Navigation: may be handled by knowledge base
  if (decision.queryType === 'navigation') {
    return false;
  }

  // Tool help: knowledge base + optional LLM
  if (decision.queryType === 'tool_help') {
    return true;
  }

  // General: use LLM
  return true;
}

/**
 * Format routing decision as debug info
 */
export function formatRoutingDebug(decision: RoutingDecision): string {
  return `
Query Type: ${decision.queryType}
Requires Evidence: ${decision.requiresEvidence}
Topic: ${decision.topic || 'general'}
Safety Level: ${decision.safetyCheck.level}
Priority: ${decision.priority}
Suggested Sources: ${decision.suggestedSources.join(', ')}
Needs LLM: ${needsLLM(decision)}
`.trim();
}

/**
 * Unified AI Core - Index
 * 
 * Central export point for all AI core modules.
 * Used by Buddy, Coach, Blog, and all AI-powered features.
 */

// System Prompts
export {
  generateSystemPrompt,
  generateBuddyPrompt,
  generateCoachPrompt,
  generateBlogPrompt,
  type SystemPromptOptions,
} from './systemPrompts';

// Answer Routing
export {
  routeQuery,
  needsLLM,
  formatRoutingDebug,
  type QueryType,
  type RoutingDecision,
} from './answerRouter';

// Citations
export {
  createCitation,
  groupCitations,
  formatCitation,
  formatCitationGroup,
  createNHSCitation,
  createNICECitation,
  createPubMedCitation,
  validateCitation,
  deduplicateCitations,
  type Citation,
  type CitationGroup,
} from './citations';

// Safety
export {
  checkQuerySafety,
  generateEmergencyResponse,
  wrapAnswerWithSafety,
  sanitizeInput,
  detectFabricatedClaims,
  validateResponseSafety,
  type SafetyCheckResult,
} from './safety';

// User Preferences
export {
  loadPreferences,
  savePreferences,
  updatePreferences,
  resetPreferences,
  exportPreferences,
  importPreferences,
  getAvailableTTSVoices,
  getPreferredTTSVoice,
  DEFAULT_PREFERENCES,
  type UserPreferences,
  type TTSPreferences,
  type AccessibilityPreferences,
  type RegionalPreferences,
  type AIPreferences,
} from './userPreferences';

// Re-export commonly used types from evidence modules
export type { Topic, EvidenceSource, SourceTier, OrgType } from '@/lib/evidence/sourceRegistry';
export type {
  EvidencePolicyRules,
  SafeguardingKeywords,
  CrisisSignpost,
} from '@/lib/evidence/evidencePolicy';

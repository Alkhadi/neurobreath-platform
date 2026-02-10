/**
 * Unified AI Core - Safety Module
 * 
 * Handles safeguarding, crisis detection, and safe answer generation.
 */

import {
  detectSafeguardingConcerns,
  getCrisisSignposting,
  formatAnswerWithPolicy,
  DEFAULT_EVIDENCE_POLICY,
  type EvidencePolicyRules,
} from '@/lib/evidence/evidencePolicy';

export interface SafetyCheckResult {
  safe: boolean;
  level: 'emergency' | 'urgent' | 'crisis' | 'safeguarding' | 'none';
  keywords: string[];
  signposting?: string;
  action: 'answer' | 'escalate_only';
}

/**
 * Perform safety check on user query
 */
export function checkQuerySafety(
  query: string,
  jurisdiction: 'UK' | 'US' | 'EU' = 'UK'
): SafetyCheckResult {
  const concerns = detectSafeguardingConcerns(query);

  // Emergency or safeguarding: prioritize signposting
  if (concerns.level === 'emergency' || concerns.level === 'safeguarding') {
    return {
      safe: false,
      level: concerns.level,
      keywords: concerns.keywords,
      signposting: getCrisisSignposting(concerns.level, jurisdiction),
      action: 'escalate_only',
    };
  }

  // Crisis or urgent: provide signposting + answer
  if (concerns.level === 'crisis' || concerns.level === 'urgent') {
    return {
      safe: true,
      level: concerns.level,
      keywords: concerns.keywords,
      signposting: getCrisisSignposting(concerns.level, jurisdiction),
      action: 'answer',
    };
  }

  // No concerns
  return {
    safe: true,
    level: 'none',
    keywords: [],
    action: 'answer',
  };
}

/**
 * Generate safe emergency response (signposting only)
 */
export function generateEmergencyResponse(
  level: 'emergency' | 'safeguarding',
  jurisdiction: 'UK' | 'US' | 'EU' = 'UK'
): string {
  const signposting = getCrisisSignposting(level, jurisdiction);

  let response = `${signposting}\n\n`;

  if (level === 'emergency') {
    response += `**I'm here to help, but this sounds like an emergency situation.**\n\n`;
    response += `Please reach out to emergency services immediately. They are trained to help in crisis situations and can provide the immediate support you need.\n\n`;
  } else {
    response += `**Your safety is the top priority.**\n\n`;
    response += `I strongly encourage you to reach out to the services listed above. They are trained professionals who can help.\n\n`;
  }

  response += `While I can provide general educational information about neurodiversity and wellbeing, I cannot provide emergency support or counseling.`;

  return response;
}

/**
 * Wrap answer with safety signposting
 */
export function wrapAnswerWithSafety(
  answer: string,
  safetyCheck: SafetyCheckResult,
  jurisdiction: 'UK' | 'US' | 'EU' = 'UK',
  policy: EvidencePolicyRules = DEFAULT_EVIDENCE_POLICY
): string {
  // Emergency/safeguarding: signposting only
  if (safetyCheck.action === 'escalate_only') {
    return generateEmergencyResponse(
      safetyCheck.level as 'emergency' | 'safeguarding',
      jurisdiction
    );
  }

  // Crisis/urgent: signposting + answer
  if (safetyCheck.signposting) {
    return formatAnswerWithPolicy(answer, {
      includeDisclaimer: policy.requireDisclaimer,
      jurisdiction,
      safeguardingLevel: safetyCheck.level,
    });
  }

  // No concerns: just format with policy
  return formatAnswerWithPolicy(answer, {
    includeDisclaimer: policy.requireDisclaimer,
    jurisdiction,
    safeguardingLevel: 'none',
  });
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .slice(0, 5000); // Max 5000 chars
}

/**
 * Check if response contains fabricated claims
 */
export function detectFabricatedClaims(response: string): {
  hasFabrication: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Pattern: "NHS says X" without a citation nearby
  const nhsClaimPattern = /NHS says\s+(?:that\s+)?([^.!?]{20,100})/gi;
  const nhsMatches = response.match(nhsClaimPattern);
  if (nhsMatches) {
    // Check if there's a citation link nearby (within 200 chars)
    nhsMatches.forEach((match) => {
      const matchIndex = response.indexOf(match);
      const context = response.slice(matchIndex, matchIndex + 200);
      if (!context.includes('nhs.uk') && !context.includes('[source]')) {
        warnings.push(`Uncited NHS claim: ${match.slice(0, 50)}...`);
      }
    });
  }

  // Pattern: "Research shows/proves" without citation
  const researchPattern = /(Research|Studies|Evidence)\s+(shows?|proves?|demonstrates?)\s+([^.!?]{20,100})/gi;
  const researchMatches = response.match(researchPattern);
  if (researchMatches) {
    researchMatches.forEach((match) => {
      const matchIndex = response.indexOf(match);
      const context = response.slice(matchIndex, matchIndex + 200);
      if (!context.includes('pubmed') && !context.includes('[source]') && !context.includes('](')) {
        warnings.push(`Uncited research claim: ${match.slice(0, 50)}...`);
      }
    });
  }

  // Pattern: Overconfident language
  const overconfidentPattern = /\b(guaranteed|always works|100%|never fails|definitive cure|proven cure)\b/gi;
  const overconfidentMatches = response.match(overconfidentPattern);
  if (overconfidentMatches) {
    warnings.push(`Overconfident language detected: ${overconfidentMatches.join(', ')}`);
  }

  return {
    hasFabrication: warnings.length > 0,
    warnings,
  };
}

/**
 * Validate response safety
 */
export function validateResponseSafety(response: string): {
  safe: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for fabricated claims
  const fabrication = detectFabricatedClaims(response);
  if (fabrication.hasFabrication) {
    warnings.push(...fabrication.warnings);
  }

  // Check for medical advice language
  const medicalAdvicePattern = /\b(I (recommend|prescribe|diagnose|treat)|You should take|You must)\b/gi;
  if (medicalAdvicePattern.test(response)) {
    errors.push('Response contains medical advice language');
  }

  // Check for disclaimer
  const hasDisclaimer =
    response.includes('educational purposes') ||
    response.includes('not medical advice') ||
    response.includes('consult a healthcare professional');

  if (!hasDisclaimer && response.length > 200) {
    warnings.push('Response may need educational disclaimer');
  }

  return {
    safe: errors.length === 0,
    errors,
    warnings,
  };
}

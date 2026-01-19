/**
 * Evidence Policy & Health Answer Guardrails
 * 
 * Enforces safe, credible, and evidence-based health/neurodiversity answers
 * across NeuroBreath Buddy, AI Coach, Blog, and all AI systems.
 * 
 * Key Principles:
 * 1. Citation or Cautious Language: Either provide real citations OR explicitly state uncertainty
 * 2. No Fabrication: Never claim "NHS says..." without a real, linkable source
 * 3. Educational Only: All content is educational; not medical advice
 * 4. UK Crisis Signposting: Emergency guidance when appropriate
 * 5. Safeguarding First: Escalate serious concerns immediately
 */

import type { Topic } from './sourceRegistry';

export interface SafeguardingKeywords {
  emergency: string[]; // 999 / A&E territory
  urgent: string[]; // NHS 111 territory
  crisis: string[]; // Mental health crisis
  safeguarding: string[]; // Child protection, abuse
}

export interface CrisisSignpost {
  jurisdiction: 'UK' | 'US' | 'EU';
  emergency: {
    number: string;
    label: string;
    guidance: string;
  };
  urgent: {
    number: string;
    label: string;
    guidance: string;
  };
  crisis: {
    number?: string;
    label: string;
    guidance: string;
    url?: string;
  };
  safeguarding?: {
    label: string;
    guidance: string;
    url?: string;
  };
}

/**
 * Safeguarding keywords that trigger escalation guidance
 */
export const SAFEGUARDING_KEYWORDS: SafeguardingKeywords = {
  emergency: [
    'suicide',
    'kill myself',
    'end my life',
    'overdose',
    'self-harm crisis',
    'immediate danger',
    'life threatening',
    'chest pain',
    'severe bleeding',
    'can\'t breathe',
    'unconscious',
  ],
  urgent: [
    'very depressed',
    'can\'t cope',
    'urgent help',
    'crisis',
    'breakdown',
    'severe anxiety',
    'panic attack lasting hours',
    'not eating',
    'can\'t sleep for days',
  ],
  crisis: [
    'self-harm',
    'hurting myself',
    'suicidal thoughts',
    'want to die',
    'hopeless',
    'no point',
    'better off dead',
  ],
  safeguarding: [
    'abuse',
    'being hurt',
    'unsafe at home',
    'adult hurting me',
    'someone touching me',
    'scared of',
    'child protection',
    'domestic violence',
    'neglect',
  ],
};

/**
 * Crisis signposting by jurisdiction
 */
export const CRISIS_SIGNPOSTS: Record<string, CrisisSignpost> = {
  UK: {
    jurisdiction: 'UK',
    emergency: {
      number: '999',
      label: 'Emergency Services',
      guidance: 'If this is a medical emergency or someone is in immediate danger, call 999 or go to A&E immediately.',
    },
    urgent: {
      number: '111',
      label: 'NHS 111',
      guidance: 'For urgent but non-life-threatening concerns, call NHS 111 (available 24/7) or visit 111.nhs.uk.',
    },
    crisis: {
      label: 'Mental Health Crisis',
      guidance: 'If you\'re experiencing a mental health crisis, call NHS 111 and select the mental health option, or contact your local NHS urgent mental health helpline.',
      url: 'https://www.nhs.uk/service-search/mental-health/find-an-urgent-mental-health-helpline',
    },
    safeguarding: {
      label: 'Safeguarding Concerns',
      guidance: 'If you or someone else is at risk of abuse or neglect, contact your local council\'s safeguarding team or call the NSPCC on 0808 800 5000 (children) or Hourglass on 0808 808 8141 (adults).',
      url: 'https://www.gov.uk/report-child-abuse-to-local-council',
    },
  },
  US: {
    jurisdiction: 'US',
    emergency: {
      number: '911',
      label: 'Emergency Services',
      guidance: 'If this is a medical emergency or someone is in immediate danger, call 911 immediately.',
    },
    urgent: {
      number: '988',
      label: '988 Suicide & Crisis Lifeline',
      guidance: 'For mental health crisis support, call or text 988 (24/7 confidential support).',
    },
    crisis: {
      number: '988',
      label: 'Mental Health Crisis',
      guidance: 'Call or text 988 for the Suicide & Crisis Lifeline, or text "HELLO" to 741741 for Crisis Text Line.',
      url: 'https://988lifeline.org',
    },
    safeguarding: {
      label: 'Safeguarding Concerns',
      guidance: 'If you suspect child abuse or neglect, call the Childhelp National Child Abuse Hotline at 1-800-422-4453.',
      url: 'https://www.childwelfare.gov/topics/responding/reporting/',
    },
  },
  EU: {
    jurisdiction: 'EU',
    emergency: {
      number: '112',
      label: 'Emergency Services',
      guidance: 'If this is a medical emergency or someone is in immediate danger, call 112 (EU emergency number).',
    },
    urgent: {
      number: '116 117',
      label: 'Non-Emergency Medical Help',
      guidance: 'For non-emergency medical help, call 116 117 (available in many EU countries) or contact your local health service.',
    },
    crisis: {
      label: 'Mental Health Crisis',
      guidance: 'Contact your local mental health crisis service or emergency services. Check your country\'s national mental health helpline.',
      url: 'https://www.iasp.info/resources/Crisis_Centres/',
    },
  },
};

/**
 * Educational disclaimer (MUST be included in all health answers)
 */
export const EDUCATIONAL_DISCLAIMER = `
**Important:** This information is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.
`.trim();

/**
 * Evidence-first answer policy rules
 */
export interface EvidencePolicyRules {
  requireCitations: boolean; // Must provide citations for health claims
  allowGeneralGuidance: boolean; // Can provide general guidance without citations
  requireDisclaimer: boolean; // Must include educational disclaimer
  enforceSignposting: boolean; // Must check for crisis keywords
  maxAnswerLength: number; // Character limit for answers
  cautiousLanguage: boolean; // Use "may", "can", "some people" instead of "will", "always"
}

/**
 * Default evidence policy (strict mode)
 */
export const DEFAULT_EVIDENCE_POLICY: EvidencePolicyRules = {
  requireCitations: true,
  allowGeneralGuidance: true,
  requireDisclaimer: true,
  enforceSignposting: true,
  maxAnswerLength: 2000,
  cautiousLanguage: true,
};

/**
 * Check if query contains safeguarding keywords
 */
export function detectSafeguardingConcerns(query: string): {
  level: 'emergency' | 'urgent' | 'crisis' | 'safeguarding' | 'none';
  keywords: string[];
} {
  const lowerQuery = query.toLowerCase();

  // Check emergency (highest priority)
  const emergencyMatches = SAFEGUARDING_KEYWORDS.emergency.filter((keyword) =>
    lowerQuery.includes(keyword.toLowerCase())
  );
  if (emergencyMatches.length > 0) {
    return { level: 'emergency', keywords: emergencyMatches };
  }

  // Check safeguarding
  const safeguardingMatches = SAFEGUARDING_KEYWORDS.safeguarding.filter((keyword) =>
    lowerQuery.includes(keyword.toLowerCase())
  );
  if (safeguardingMatches.length > 0) {
    return { level: 'safeguarding', keywords: safeguardingMatches };
  }

  // Check crisis
  const crisisMatches = SAFEGUARDING_KEYWORDS.crisis.filter((keyword) =>
    lowerQuery.includes(keyword.toLowerCase())
  );
  if (crisisMatches.length > 0) {
    return { level: 'crisis', keywords: crisisMatches };
  }

  // Check urgent
  const urgentMatches = SAFEGUARDING_KEYWORDS.urgent.filter((keyword) =>
    lowerQuery.includes(keyword.toLowerCase())
  );
  if (urgentMatches.length > 0) {
    return { level: 'urgent', keywords: urgentMatches };
  }

  return { level: 'none', keywords: [] };
}

/**
 * Get crisis signposting message
 */
export function getCrisisSignposting(
  level: 'emergency' | 'urgent' | 'crisis' | 'safeguarding',
  jurisdiction: 'UK' | 'US' | 'EU' = 'UK'
): string {
  const signpost = CRISIS_SIGNPOSTS[jurisdiction];
  if (!signpost) return '';

  let message = '🚨 **Immediate Support:**\n\n';

  switch (level) {
    case 'emergency':
      message += `${signpost.emergency.guidance}\n\n**${signpost.emergency.label}:** ${signpost.emergency.number}`;
      break;

    case 'urgent':
      message += `${signpost.urgent.guidance}\n\n**${signpost.urgent.label}:** ${signpost.urgent.number}`;
      break;

    case 'crisis':
      message += `${signpost.crisis.guidance}\n\n`;
      if (signpost.crisis.number) {
        message += `**${signpost.crisis.label}:** ${signpost.crisis.number}\n`;
      }
      if (signpost.crisis.url) {
        message += `**More info:** ${signpost.crisis.url}`;
      }
      break;

    case 'safeguarding':
      if (signpost.safeguarding) {
        message += `${signpost.safeguarding.guidance}\n\n`;
        if (signpost.safeguarding.url) {
          message += `**More info:** ${signpost.safeguarding.url}`;
        }
      }
      break;
  }

  return message;
}

/**
 * Validate answer against evidence policy
 */
export function validateAnswer(
  answer: string,
  policy: EvidencePolicyRules = DEFAULT_EVIDENCE_POLICY
): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check length
  if (answer.length > policy.maxAnswerLength) {
    warnings.push(`Answer exceeds max length (${policy.maxAnswerLength} chars)`);
  }

  // Check for disclaimer if required
  if (policy.requireDisclaimer) {
    const hasDisclaimer =
      answer.includes('educational purposes') ||
      answer.includes('not medical advice') ||
      answer.includes('consult a healthcare professional');

    if (!hasDisclaimer) {
      errors.push('Missing educational disclaimer');
    }
  }

  // Check for fabricated claims (common patterns)
  const fabricatedPatterns = [
    /NHS says.*(?:guaranteed|always|never|100%)/i,
    /NICE recommends.*(?:everyone|all patients)/i,
    /Research proves.*(?:definitively|conclusively)/i,
    /Studies show.*(?:always|never)/i,
  ];

  fabricatedPatterns.forEach((pattern) => {
    if (pattern.test(answer)) {
      warnings.push(`Potentially overconfident claim detected: ${pattern.source}`);
    }
  });

  // Check for cautious language if required
  if (policy.cautiousLanguage) {
    const overconfidentPattern = /\b(will|must|always|never|guaranteed|definitely|certainly)\b/gi;

    const overconfidentMatches = answer.match(overconfidentPattern);
    if (overconfidentMatches && overconfidentMatches.length > 3) {
      warnings.push('Consider using more cautious language (e.g., "may", "can", "some people")');
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Format answer with policy compliance
 */
export function formatAnswerWithPolicy(
  answer: string,
  options: {
    includeDisclaimer?: boolean;
    jurisdiction?: 'UK' | 'US' | 'EU';
    safeguardingLevel?: 'emergency' | 'urgent' | 'crisis' | 'safeguarding' | 'none';
  } = {}
): string {
  const { includeDisclaimer = true, jurisdiction = 'UK', safeguardingLevel = 'none' } = options;

  let formatted = answer;

  // Add crisis signposting if needed
  if (safeguardingLevel !== 'none') {
    const signposting = getCrisisSignposting(safeguardingLevel, jurisdiction);
    formatted = `${signposting}\n\n---\n\n${formatted}`;
  }

  // Add disclaimer
  if (includeDisclaimer) {
    formatted = `${formatted}\n\n---\n\n${EDUCATIONAL_DISCLAIMER}`;
  }

  return formatted;
}

/**
 * Topic-specific answer guidelines
 */
export const TOPIC_GUIDELINES: Record<Topic, string> = {
  adhd: 'ADHD assessment and diagnosis should be done by qualified healthcare professionals. Medication decisions require medical supervision.',
  autism: 'Autism diagnosis requires specialist assessment. Support strategies should be individualized and family-led.',
  dyslexia: 'Dyslexia assessment should be conducted by educational psychologists or specialist teachers. Interventions vary by individual.',
  anxiety: 'Severe or persistent anxiety may require professional support. Techniques should be practiced with guidance.',
  depression: 'Depression is a medical condition requiring professional assessment. If symptoms persist, seek help.',
  breathing: 'Breathing exercises are generally safe. If you experience dizziness or discomfort, stop and consult a professional.',
  sleep: 'Chronic sleep problems may indicate underlying health issues. Consult a GP if sleep disturbances persist.',
  bipolar: 'Bipolar disorder requires specialist psychiatric care. Never adjust medications without medical supervision.',
  stress: 'Chronic stress can affect physical and mental health. Seek support if stress becomes overwhelming.',
  burnout: 'Burnout requires rest, boundaries, and often professional support. Workplace adjustments may be needed.',
  safeguarding: 'Safeguarding concerns must be reported to appropriate authorities immediately.',
  general: 'For personalized advice, always consult a qualified healthcare professional.',
};

/**
 * Get topic-specific guideline
 */
export function getTopicGuideline(topic: Topic): string {
  return TOPIC_GUIDELINES[topic] || TOPIC_GUIDELINES.general;
}

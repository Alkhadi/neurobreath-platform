export function normalizeQuery(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractTopicCandidates(question: string): string[] {
  // Strip common English question prefixes so the residual is the actual topic.
  // Order matters: most-specific patterns first.
  const base = question
    // "what does/do/did the NHS/NICE/guidance say/recommend/suggest about X"
    // Handles multi-word authority phrases like "NHS guidance", "NICE guidelines"
    .replace(/^what\s+(?:does|do|did)\s+(?:the\s+)?(?:nhs(?:\s+(?:guidance|guidelines?|website|advice))?|nice(?:\s+guidelines?)?|gp|doctors?|guidance|evidence|research|guidelines?)\s+(?:say|recommend|suggest|advise|state)\s+(?:about|on|regarding|for)\s+/i, '')
    // "what are the treatments/symptoms/causes/signs for X"
    .replace(/^what\s+(?:are|is|were|was)\s+(?:the\s+)?(?:treatments?|therapies|therapy|symptoms?|causes?|signs?|options?|medications?|medicines?)\s+(?:for|of)\s+/i, '')
    // "how (?:do|can|should) you treat/manage/help X"
    .replace(/^how\s+(?:do|can|should|would)\s+(?:you|i|we|one)\s+(?:treat|manage|help|support|deal\s+with|cope\s+with)\s+/i, '')
    // "treatment(s)/therapy/medication for X"
    .replace(/^(?:treatments?|therapies|therapy|medication|medicines?|support)\s+for\s+/i, '')
    // Generic: "what is/are (the)" and "how is/are"
    .replace(/^(?:what|how)\s+(?:is|are)\s+(?:the\s+)?/i, '')
    .replace(/^what\s+is\s+/i, '')
    .replace(/^tell\s+me\s+about\s+/i, '')
    .replace(/^explain\s+/i, '')
    .replace(/\?+$/g, '')
    .trim()
    .slice(0, 120);

  const candidates = new Set<string>();
  if (base) candidates.add(base);

  const upperToken = base.replace(/[^A-Za-z]/g, '');
  const acronym = upperToken.length <= 6 && upperToken === upperToken.toUpperCase() ? upperToken : '';

  const expansions: Record<string, string[]> = {
    PTSD: ['post-traumatic stress disorder', 'post traumatic stress disorder'],
    ADHD: ['attention deficit hyperactivity disorder'],
    OCD: ['obsessive-compulsive disorder', 'obsessive compulsive disorder'],
    ASD: ['autism spectrum disorder'],
  };

  if (acronym && expansions[acronym]) {
    expansions[acronym].forEach((e) => candidates.add(e));
    candidates.add(acronym);
  }

  return Array.from(candidates);
}

export function scoreTextMatch(haystack: string, needles: string[]): number {
  const h = normalizeQuery(haystack);
  let score = 0;

  for (const needle of needles) {
    const n = normalizeQuery(needle);
    if (!n) continue;

    if (h === n) score += 200;
    if (h.includes(n)) score += 80;

    const tokens = n.split(' ').filter(Boolean);
    const tokenMatches = tokens.reduce((acc, t) => (h.includes(t) ? acc + 1 : acc), 0);
    score += Math.min(40, tokenMatches * 10);
  }

  return score;
}

export function normalizeQuery(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractTopicCandidates(question: string): string[] {
  const base = question
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

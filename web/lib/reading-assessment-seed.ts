/**
 * Seed data for reading assessments
 * Contains public domain passages and sample word lists
 */

export const SAMPLE_PASSAGES = [
  {
    id: 'passage-001',
    title: 'The Little Ant',
    levelBand: 'beginner',
    text: 'An ant ran in the sand. It was very small. It found some food. The ant was happy. It ran back to its home with the food. Many ants worked together. They made a big home under the ground. The ants were busy all day. At night they slept. Every day they worked hard. The ants never gave up.',
    wordCount: 73,
    license: 'user-authored',
    sourceAttribution: 'Original composition for educational purposes',
  },
  {
    id: 'passage-002',
    title: 'The Butterfly',
    levelBand: 'elementary',
    text: 'A butterfly started its life as a tiny egg on a leaf. The egg was very small, almost impossible to see. After a few days, a caterpillar hatched from the egg. The caterpillar was hungry right away. It ate the leaf it was born on. Every day, the caterpillar ate many leaves and grew larger. After several weeks, the caterpillar was ready to change. It made a cocoon, a protective shell around itself. Inside the cocoon, a magical transformation happened. Many days later, a beautiful butterfly came out. The butterfly flew away, looking for flowers to drink from.',
    wordCount: 127,
    license: 'user-authored',
    sourceAttribution: 'Original composition for educational purposes',
  },
  {
    id: 'passage-003',
    title: 'The Sleepy Moon',
    levelBand: 'intermediate',
    text: 'Every evening, as the sun dipped below the horizon, the moon began to rise in the night sky. The moon was tired from shining all night. It looked forward to its daytime rest, though humans would never see it sleep. The moon had many jobs to do. It pulled the oceans with its gravity, creating tides that moved in and out twice daily. Small creatures on the shore depended on the moon\'s pull to find food. The moon watched over the night, guiding lost travelers and inspiring artists and poets. Although we see the same face of the moon every night, the other side remains hidden. Scientists have sent rockets to explore this mysterious dark side. The moon continues its eternal dance with Earth, never stopping, always watching.',
    wordCount: 179,
    license: 'user-authored',
    sourceAttribution: 'Original composition for educational purposes',
  },
  {
    id: 'passage-004',
    title: 'Ancient Libraries',
    levelBand: 'advanced',
    text: 'The Library of Alexandria, one of antiquity\'s most celebrated intellectual institutions, represented an unprecedented accumulation of human knowledge. Established during the Ptolemaic period, this monumental repository contained hundreds of thousands of scrolls encompassing disciplines ranging from philosophy and mathematics to medicine and astronomy. The library functioned not merely as a storage facility but as a vibrant center of scholarly discourse, attracting luminaries from throughout the Mediterranean world. The loss of this magnificent collection through successive destruction represented an incalculable cultural tragedy. Centuries later, Islamic scholars preserved and expanded upon classical knowledge, developing advanced astronomical and mathematical treatises that would eventually influence European Renaissance thinkers. The historical trajectory of library development illuminates humanity\'s perpetual commitment to preserving wisdom and facilitating intellectual advancement across generations.',
    wordCount: 149,
    license: 'user-authored',
    sourceAttribution: 'Original composition for educational purposes',
  },
]

export const SAMPLE_WORD_LISTS = [
  {
    id: 'wordlist-001',
    title: 'Beginning Sight Words',
    levelBand: 'beginner',
    words: ['the', 'a', 'and', 'to', 'in', 'is', 'it', 'of', 'for', 'you', 'with', 'on', 'at', 'as', 'he', 'she', 'we', 'I', 'me', 'be'],
    license: 'public-domain',
  },
  {
    id: 'wordlist-002',
    title: 'Common Phonics Words',
    levelBand: 'elementary',
    words: ['cat', 'dog', 'run', 'jump', 'play', 'sit', 'stand', 'walk', 'talk', 'book', 'look', 'have', 'make', 'take', 'see', 'read', 'write', 'give', 'come', 'go'],
    license: 'public-domain',
  },
  {
    id: 'wordlist-003',
    title: 'Intermediate Vocabulary',
    levelBand: 'intermediate',
    words: ['understand', 'important', 'different', 'beautiful', 'interesting', 'develop', 'create', 'discover', 'explore', 'analyze', 'consider', 'question', 'challenge', 'opportunity', 'strength', 'weakness', 'character', 'community', 'environment', 'technology'],
    license: 'public-domain',
  },
  {
    id: 'wordlist-004',
    title: 'Academic Vocabulary',
    levelBand: 'advanced',
    words: ['phenomenon', 'synthesis', 'comprehensive', 'methodology', 'elucidate', 'juxtapose', 'ambiguous', 'coherent', 'eloquent', 'facilitate', 'jurisdiction', 'milieu', 'pragmatic', 'quintessential', 'redundant', 'sagacious', 'tangible', 'ubiquitous', 'vernacular', 'volatile'],
    license: 'public-domain',
  },
]

export const PSEUDOWORD_PATTERNS = {
  beginner: {
    description: 'CVC (Consonant-Vowel-Consonant) patterns',
    patterns: [
      { consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'], vowels: ['a', 'e', 'i', 'o', 'u'], final: ['b', 'c', 'd', 'f', 'g', 'k', 'l', 'm', 'n', 'p', 's', 't'] }
    ],
    count: 20,
  },
  elementary: {
    description: 'CVCC and CCVC patterns',
    patterns: [
      { consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'], vowels: ['a', 'e', 'i', 'o', 'u'], final: ['b', 'c', 'd', 'f', 'g', 'k', 'l', 'm', 'n', 'p', 's', 't'] }
    ],
    count: 30,
  },
  intermediate: {
    description: 'Multi-syllabic and vowel team patterns',
    patterns: [
      { consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'], vowels: ['a', 'e', 'i', 'o', 'u', 'ai', 'ee', 'oa', 'ou'], final: ['b', 'c', 'd', 'f', 'g', 'k', 'l', 'm', 'n', 'p', 's', 't'] }
    ],
    count: 40,
  },
  advanced: {
    description: 'Complex patterns with digraphs and affixes',
    patterns: [
      { consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'ch', 'sh', 'th'], vowels: ['a', 'e', 'i', 'o', 'u', 'ai', 'ee', 'oa', 'ou', 'igh'], final: ['b', 'c', 'd', 'f', 'g', 'k', 'l', 'm', 'n', 'p', 's', 't', 'ch', 'sh', 'th'] }
    ],
    count: 50,
  },
}

export const COMPREHENSION_QUESTIONS = [
  {
    id: 'comp-001',
    passageId: 'passage-001',
    prompt: 'What was the ant looking for?',
    choices: ['Water', 'Food', 'Other ants', 'A leaf'],
    correctChoiceIndex: 1,
    difficulty: 'easy',
    explanation: 'The passage states: "It found some food."',
  },
  {
    id: 'comp-002',
    passageId: 'passage-001',
    prompt: 'Where did the ants make their home?',
    choices: ['In a tree', 'Under the ground', 'In the sand', 'In a leaf'],
    correctChoiceIndex: 1,
    difficulty: 'easy',
    explanation: 'The text says: "They made a big home under the ground."',
  },
  {
    id: 'comp-003',
    passageId: 'passage-002',
    prompt: 'What was the caterpillar\'s main activity?',
    choices: ['Flying', 'Sleeping', 'Eating leaves', 'Making a web'],
    correctChoiceIndex: 2,
    difficulty: 'easy',
    explanation: 'The passage explains that the caterpillar ate leaves all day and grew larger.',
  },
  {
    id: 'comp-004',
    passageId: 'passage-002',
    prompt: 'What does the cocoon do for the caterpillar?',
    choices: ['Provides food', 'Protects it', 'Helps it fly', 'Keeps it awake'],
    correctChoiceIndex: 1,
    difficulty: 'intermediate',
    explanation: 'The text describes the cocoon as "a protective shell around itself."',
  },
]

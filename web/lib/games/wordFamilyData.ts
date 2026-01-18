/**
 * Word Family Data for Word Family Sorting Game
 * High-quality word lists for early readers
 */

export interface WordFamily {
  family: string;
  displayName: string;
  words: string[];
  color: string;
}

export const wordFamilies: WordFamily[] = [
  {
    family: '-at',
    displayName: 'AT Family',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    words: [
      'cat', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat',
      'flat', 'chat', 'that', 'brat', 'splat', 'gnat', 'vat'
    ]
  },
  {
    family: '-an',
    displayName: 'AN Family',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    words: [
      'can', 'man', 'pan', 'ran', 'tan', 'van', 'fan', 'ban',
      'plan', 'scan', 'span', 'bran', 'clan', 'than'
    ]
  },
  {
    family: '-ig',
    displayName: 'IG Family',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    words: [
      'big', 'dig', 'fig', 'pig', 'wig', 'jig', 'rig', 'gig',
      'twig', 'brig', 'sprig'
    ]
  },
  {
    family: '-op',
    displayName: 'OP Family',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    words: [
      'top', 'hop', 'mop', 'pop', 'shop', 'stop', 'drop', 'crop',
      'chop', 'flop', 'prop', 'plop'
    ]
  },
  {
    family: '-et',
    displayName: 'ET Family',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700',
    words: [
      'bet', 'get', 'jet', 'let', 'met', 'net', 'pet', 'set',
      'wet', 'yet', 'vet', 'fret'
    ]
  },
  {
    family: '-un',
    displayName: 'UN Family',
    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
    words: [
      'bun', 'fun', 'gun', 'run', 'sun', 'pun', 'nun', 'spun',
      'stun', 'shun'
    ]
  }
];

export type DifficultyLevel = 'beginner' | 'intermediate';

export interface GameConfig {
  difficulty: DifficultyLevel;
  numberOfBins: number;
  wordsPerRound: number;
  totalRounds: number;
  timerEnabled: boolean;
  timerDuration: number; // seconds
  hintsAvailable: number;
}

export const difficultyConfigs: Record<DifficultyLevel, Omit<GameConfig, 'timerEnabled' | 'timerDuration'>> = {
  beginner: {
    difficulty: 'beginner',
    numberOfBins: 2,
    wordsPerRound: 8,
    totalRounds: 3,
    hintsAvailable: 3
  },
  intermediate: {
    difficulty: 'intermediate',
    numberOfBins: 3,
    wordsPerRound: 10,
    totalRounds: 4,
    hintsAvailable: 2
  }
};

/**
 * Generate a random round of words for the game
 */
export function generateRound(
  difficulty: DifficultyLevel,
  excludeFamilies: string[] = []
): { families: WordFamily[]; words: Array<{ word: string; family: string }> } {
  const config = difficultyConfigs[difficulty];
  const availableFamilies = wordFamilies.filter(f => !excludeFamilies.includes(f.family));
  
  // Select random families for this round
  const selectedFamilies = availableFamilies
    .sort(() => Math.random() - 0.5)
    .slice(0, config.numberOfBins);
  
  // Select words from each family
  const wordsPerFamily = Math.ceil(config.wordsPerRound / config.numberOfBins);
  const roundWords: Array<{ word: string; family: string }> = [];
  
  selectedFamilies.forEach(family => {
    const selectedWords = family.words
      .sort(() => Math.random() - 0.5)
      .slice(0, wordsPerFamily);
    
    selectedWords.forEach(word => {
      roundWords.push({ word, family: family.family });
    });
  });
  
  // Shuffle all words and trim to exact count
  const shuffledWords = roundWords
    .sort(() => Math.random() - 0.5)
    .slice(0, config.wordsPerRound);
  
  return {
    families: selectedFamilies,
    words: shuffledWords
  };
}

/**
 * Check if a word belongs to a family
 */
export function checkWordFamily(word: string, family: string): boolean {
  return word.endsWith(family.replace('-', ''));
}

/**
 * Get explanation for incorrect placement
 */
export function getIncorrectExplanation(word: string, correctFamily: string): string {
  return `"${word}" ends with ${correctFamily}, so it belongs in the ${correctFamily} family.`;
}

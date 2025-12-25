import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ReadingLevel = 'easy' | 'medium' | 'hard';

interface ReadingLevelContextType {
  difficulty: ReadingLevel;
  currentLevel: number;
  setDifficulty: (level: ReadingLevel) => void;
  setLevel: (level: number) => void;
}

const ReadingLevelContext = createContext<ReadingLevelContextType | undefined>(undefined);

export function ReadingLevelProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficultyState] = useState<ReadingLevel>('easy');
  const [currentLevel, setCurrentLevel] = useState(1);

  const setDifficulty = useCallback((level: ReadingLevel) => {
    setDifficultyState(level);
    // Optionally save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('neurobreath-reading-level', level);
    }
  }, []);

  const setLevel = useCallback((level: number) => {
    setCurrentLevel(level);
    if (typeof window !== 'undefined') {
      localStorage.setItem('neurobreath-current-level', level.toString());
    }
  }, []);

  return (
    <ReadingLevelContext.Provider value={{ difficulty, currentLevel, setDifficulty, setLevel }}>
      {children}
    </ReadingLevelContext.Provider>
  );
}

export function useReadingLevelContext() {
  const context = useContext(ReadingLevelContext);
  if (!context) {
    throw new Error('useReadingLevelContext must be used within ReadingLevelProvider');
  }
  return context;
}

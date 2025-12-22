'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface WordData {
  word: string;
  definition: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const words: WordData[] = [
  // Easy - Common Words
  { word: 'the', definition: 'Used to refer to a specific thing or person', emoji: '👉', difficulty: 'easy' },
  { word: 'cat', definition: 'A small furry animal that says "meow"', emoji: '🐱', difficulty: 'easy' },
  { word: 'dog', definition: 'A friendly animal that says "woof"', emoji: '🐕', difficulty: 'easy' },
  { word: 'run', definition: 'To move quickly on your feet', emoji: '🏃', difficulty: 'easy' },
  { word: 'sun', definition: 'The bright star that gives us light during the day', emoji: '☀️', difficulty: 'easy' },
  { word: 'book', definition: 'Pages with words and stories bound together', emoji: '📖', difficulty: 'easy' },
  { word: 'home', definition: 'The place where you live', emoji: '🏠', difficulty: 'easy' },
  { word: 'happy', definition: 'Feeling good and joyful', emoji: '😊', difficulty: 'easy' },
  { word: 'tree', definition: 'A tall plant with a trunk, branches, and leaves', emoji: '🌳', difficulty: 'easy' },
  { word: 'water', definition: 'A clear liquid that we drink', emoji: '💧', difficulty: 'easy' },
  
  // Medium - Intermediate Words
  { word: 'friend', definition: 'Someone you like and enjoy spending time with', emoji: '👫', difficulty: 'medium' },
  { word: 'school', definition: 'A place where children go to learn', emoji: '🏫', difficulty: 'medium' },
  { word: 'family', definition: 'People who are related to you and live together', emoji: '👨‍👩‍👧‍👦', difficulty: 'medium' },
  { word: 'garden', definition: 'An outdoor area where plants and flowers grow', emoji: '🌻', difficulty: 'medium' },
  { word: 'library', definition: 'A building where many books are kept for people to borrow', emoji: '📚', difficulty: 'medium' },
  { word: 'mountain', definition: 'A very tall and high piece of land', emoji: '⛰️', difficulty: 'medium' },
  { word: 'rainbow', definition: 'An arc of colors that appears in the sky after rain', emoji: '🌈', difficulty: 'medium' },
  { word: 'bicycle', definition: 'A vehicle with two wheels that you pedal', emoji: '🚲', difficulty: 'medium' },
  { word: 'kitchen', definition: 'The room where food is prepared and cooked', emoji: '🍳', difficulty: 'medium' },
  { word: 'breakfast', definition: 'The first meal you eat in the morning', emoji: '🍳', difficulty: 'medium' },
  
  // Hard - Advanced Words
  { word: 'adventure', definition: 'An exciting or unusual experience', emoji: '🗺️', difficulty: 'hard' },
  { word: 'telescope', definition: 'A tool that makes distant objects look closer', emoji: '🔭', difficulty: 'hard' },
  { word: 'imagination', definition: 'The ability to create pictures and ideas in your mind', emoji: '💭', difficulty: 'hard' },
  { word: 'dinosaur', definition: 'A large reptile that lived millions of years ago', emoji: '🦕', difficulty: 'hard' },
  { word: 'astronaut', definition: 'A person who travels into space', emoji: '👨‍🚀', difficulty: 'hard' },
  { word: 'volcano', definition: 'A mountain with a hole at the top that can erupt with hot lava', emoji: '🌋', difficulty: 'hard' },
  { word: 'butterfly', definition: 'A colorful insect with large wings', emoji: '🦋', difficulty: 'hard' },
  { word: 'submarine', definition: 'A ship that can travel underwater', emoji: '🤿', difficulty: 'hard' },
  { word: 'orchestra', definition: 'A large group of musicians playing together', emoji: '🎻', difficulty: 'hard' },
  { word: 'laboratory', definition: 'A room where scientists do experiments', emoji: '🔬', difficulty: 'hard' }
];

export default function VocabularyBuilder() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<{ [key: string]: boolean }>({});
  const [showDefinition, setShowDefinition] = useState(false);

  const filteredWords = words.filter(w => w.difficulty === selectedDifficulty);
  const currentWord = filteredWords[currentIndex];
  const learnedCount = Object.keys(learnedWords).filter(key => 
    learnedWords[key] && key.startsWith(selectedDifficulty)
  ).length;

  useEffect(() => {
    // Load progress
    const saved = localStorage.getItem('vocabularyBuilder');
    if (saved) {
      setLearnedWords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem('vocabularyBuilder', JSON.stringify(learnedWords));
  }, [learnedWords]);

  const markAsLearned = () => {
    const key = `${selectedDifficulty}-${currentWord.word}`;
    setLearnedWords({ ...learnedWords, [key]: true });
    toast.success(`✓ "${currentWord.word}" marked as learned!`);
    
    // Auto-advance
    setTimeout(() => {
      if (currentIndex < filteredWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowDefinition(false);
      }
    }, 1000);
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setShowDefinition(false);
  };

  const getDifficultyColor = () => {
    switch (selectedDifficulty) {
      case 'easy': return 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800';
      case 'medium': return 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800';
      case 'hard': return 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800';
    }
  };

  const isLearned = () => {
    const key = `${selectedDifficulty}-${currentWord.word}`;
    return learnedWords[key] || false;
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getDifficultyColor()}`}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            📝 Vocabulary Builder
          </h3>
        </div>

        {/* Difficulty Selector */}
        <div className="grid grid-cols-3 gap-2">
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => {
                setSelectedDifficulty(difficulty);
                setCurrentIndex(0);
                setShowDefinition(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDifficulty === difficulty
                  ? difficulty === 'easy'
                    ? 'bg-green-600 text-white'
                    : difficulty === 'medium'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              {difficulty}
            </button>
          ))}
          <div className="col-span-3 text-sm text-gray-600 dark:text-gray-400 text-center">
            Auto-set from assessment
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Words learned
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {learnedCount} / {filteredWords.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(learnedCount / filteredWords.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Category Label */}
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-center font-medium">
          Common Words
        </div>

        {/* Word Display */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 min-h-[300px] flex flex-col items-center justify-center space-y-6">
          <div className="text-7xl">
            {currentWord.emoji}
          </div>
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {currentWord.word}
          </div>
          
          {isLearned() && (
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Learned</span>
            </div>
          )}
          
          {showDefinition ? (
            <div className="text-center space-y-2">
              <div className="text-lg text-gray-700 dark:text-gray-300">
                {currentWord.definition}
              </div>
              <Button
                onClick={markAsLearned}
                disabled={isLearned()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Learned
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowDefinition(true)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              Show Definition
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('prev')}
            disabled={currentIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Word {currentIndex + 1} of {filteredWords.length}
          </div>

          <Button
            onClick={() => navigate('next')}
            disabled={currentIndex === filteredWords.length - 1}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

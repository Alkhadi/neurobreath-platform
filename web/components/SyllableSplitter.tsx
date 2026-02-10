'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { toast } from 'sonner';

interface SyllableWord {
  word: string;
  syllables: string[];
  difficulty: 'Easy (2 syllables)' | 'Medium (3 syllables)' | 'Hard (4+ syllables)';
}

const words: SyllableWord[] = [
  // Easy (2 syllables)
  { word: 'happy', syllables: ['hap', 'py'], difficulty: 'Easy (2 syllables)' },
  { word: 'table', syllables: ['ta', 'ble'], difficulty: 'Easy (2 syllables)' },
  { word: 'water', syllables: ['wa', 'ter'], difficulty: 'Easy (2 syllables)' },
  { word: 'basket', syllables: ['bas', 'ket'], difficulty: 'Easy (2 syllables)' },
  { word: 'muffin', syllables: ['muf', 'fin'], difficulty: 'Easy (2 syllables)' },
  { word: 'dinner', syllables: ['din', 'ner'], difficulty: 'Easy (2 syllables)' },
  { word: 'pencil', syllables: ['pen', 'cil'], difficulty: 'Easy (2 syllables)' },
  { word: 'kitten', syllables: ['kit', 'ten'], difficulty: 'Easy (2 syllables)' },
  
  // Medium (3 syllables)
  { word: 'fantastic', syllables: ['fan', 'tas', 'tic'], difficulty: 'Medium (3 syllables)' },
  { word: 'important', syllables: ['im', 'por', 'tant'], difficulty: 'Medium (3 syllables)' },
  { word: 'umbrella', syllables: ['um', 'brel', 'la'], difficulty: 'Medium (3 syllables)' },
  { word: 'beautiful', syllables: ['beau', 'ti', 'ful'], difficulty: 'Medium (3 syllables)' },
  { word: 'computer', syllables: ['com', 'pu', 'ter'], difficulty: 'Medium (3 syllables)' },
  { word: 'delicious', syllables: ['de', 'li', 'cious'], difficulty: 'Medium (3 syllables)' },
  { word: 'remember', syllables: ['re', 'mem', 'ber'], difficulty: 'Medium (3 syllables)' },
  { word: 'banana', syllables: ['ba', 'na', 'na'], difficulty: 'Medium (3 syllables)' },
  
  // Hard (4+ syllables)
  { word: 'understanding', syllables: ['un', 'der', 'stan', 'ding'], difficulty: 'Hard (4+ syllables)' },
  { word: 'incredible', syllables: ['in', 'cre', 'di', 'ble'], difficulty: 'Hard (4+ syllables)' },
  { word: 'electricity', syllables: ['e', 'lec', 'tri', 'ci', 'ty'], difficulty: 'Hard (4+ syllables)' },
  { word: 'pronunciation', syllables: ['pro', 'nun', 'ci', 'a', 'tion'], difficulty: 'Hard (4+ syllables)' },
  { word: 'refrigerator', syllables: ['re', 'fri', 'ge', 'ra', 'tor'], difficulty: 'Hard (4+ syllables)' },
  { word: 'revolutionary', syllables: ['re', 'vo', 'lu', 'tion', 'a', 'ry'], difficulty: 'Hard (4+ syllables)' },
  { word: 'extraordinary', syllables: ['ex', 'tra', 'or', 'di', 'na', 'ry'], difficulty: 'Hard (4+ syllables)' },
  { word: 'encyclopedia', syllables: ['en', 'cy', 'clo', 'pe', 'di', 'a'], difficulty: 'Hard (4+ syllables)' }
];

export default function SyllableSplitter() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy (2 syllables)');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userBreaks, setUserBreaks] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const filteredWords = words.filter(w => w.difficulty === selectedDifficulty);
  const currentWord = filteredWords[currentWordIndex];
  const letters = currentWord.word.split('');

  useEffect(() => {
    // Load progress
    const saved = localStorage.getItem('syllableSplitterProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setScore(data.score || 0);
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem('syllableSplitterProgress', JSON.stringify({ score }));
  }, [score]);

  const toggleBreak = (index: number) => {
    if (userBreaks.includes(index)) {
      setUserBreaks(userBreaks.filter(i => i !== index));
    } else {
      setUserBreaks([...userBreaks, index].sort((a, b) => a - b));
    }
  };

  const getCorrectBreaks = (): number[] => {
    const breaks: number[] = [];
    let position = 0;
    for (let i = 0; i < currentWord.syllables.length - 1; i++) {
      position += currentWord.syllables[i].length;
      breaks.push(position);
    }
    return breaks;
  };

  const checkAnswer = () => {
    const correctBreaks = getCorrectBreaks();
    
    if (JSON.stringify(userBreaks.sort()) === JSON.stringify(correctBreaks.sort())) {
      setScore(score + 10);
      toast.success('✓ Perfect! That\'s correct!');
      setTimeout(() => nextWord(), 1500);
    } else {
      toast.error('Not quite right. Try again or use the hint!');
    }
  };

  const showHintHandler = () => {
    setShowHint(true);
    const correctBreaks = getCorrectBreaks();
    setUserBreaks(correctBreaks);
    toast.info(`The syllables are: ${currentWord.syllables.join(' • ')}`);
  };

  const nextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserBreaks([]);
      setShowHint(false);
    } else {
      toast.success('🎉 You completed all words in this difficulty!');
      setCurrentWordIndex(0);
      setUserBreaks([]);
      setShowHint(false);
    }
  };

  const hearWord = () => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(currentWord.word);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.6;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = () => {
    if (selectedDifficulty.includes('Easy')) return 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800';
    if (selectedDifficulty.includes('Medium')) return 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800';
    return 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800';
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getDifficultyColor()}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              ✂️ Syllable Splitter
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Tap between letters to split words into syllables!
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {score}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="grid grid-cols-3 gap-2">
          {['Easy (2 syllables)', 'Medium (3 syllables)', 'Hard (4+ syllables)'].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setCurrentWordIndex(0);
                setUserBreaks([]);
                setShowHint(false);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === diff
                  ? diff.includes('Easy')
                    ? 'bg-green-600 text-white'
                    : diff.includes('Medium')
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Word Progress */}
        <div className="text-center text-sm text-gray-700 dark:text-gray-300">
          (Word {currentWordIndex + 1} of {filteredWords.length})
        </div>

        {/* Word Display */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tap the spaces between letters where syllables break
          </p>
          
          <div className="flex justify-center items-center gap-1 flex-wrap">
            {letters.map((letter, index) => (
              <div key={index} className="flex items-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {letter}
                </div>
                {index < letters.length - 1 && (
                  <button
                    onClick={() => toggleBreak(index + 1)}
                    className={`mx-1 w-3 h-12 rounded transition-all ${
                      userBreaks.includes(index + 1)
                        ? 'bg-blue-500 w-1'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-300'
                    }`}
                    aria-label={`Toggle break after ${letter}`}
                  />
                )}
              </div>
            ))}
          </div>

          {userBreaks.length > 0 && (
            <div className="mt-4 text-center text-lg text-gray-700 dark:text-gray-300">
              Your split: {currentWord.word.split('').reduce((acc, letter, index) => {
                if (index === 0) return letter;
                if (userBreaks.includes(index)) return acc + ' • ' + letter;
                return acc + letter;
              }, '')}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={hearWord}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Hear Word
          </Button>
          <Button
            onClick={showHintHandler}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
            disabled={showHint}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint
          </Button>
          <Button
            onClick={checkAnswer}
            disabled={userBreaks.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Check
          </Button>
        </div>

        <Button
          onClick={nextWord}
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-50"
        >
          Next Word
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How to play:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Listen to the word by tapping "Hear Word"</li>
            <li>Tap the spaces between letters where syllables break</li>
            <li>Press "Check" to see if you're right!</li>
          </ol>
        </div>
      </div>
    </Card>
  );
}

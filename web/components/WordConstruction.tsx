'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Shuffle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface WordSet {
  id: number;
  letters: string[];
  validWords: string[];
}

const wordSets: WordSet[] = [
  {
    id: 1,
    letters: ['c', 'a', 't', 's', 'r', 'e'],
    validWords: ['cat', 'cats', 'rat', 'rats', 'car', 'cars', 'care', 'cares', 'race', 'races', 'scar', 'scare', 'crate', 'crates', 'reacts']
  },
  {
    id: 2,
    letters: ['d', 'o', 'g', 's', 'n', 'u'],
    validWords: ['dog', 'dogs', 'god', 'gods', 'song', 'songs', 'sung', 'dung', 'don', 'dons', 'duo', 'duos', 'nod', 'nods']
  },
  {
    id: 3,
    letters: ['b', 'o', 'o', 'k', 's', 't'],
    validWords: ['book', 'books', 'boot', 'boots', 'took', 'stook', 'stock']
  },
  {
    id: 4,
    letters: ['h', 'o', 'u', 's', 'e', 'r'],
    validWords: ['house', 'horse', 'shore', 'hose', 'rose', 'sore', 'hero', 'user']
  },
  {
    id: 5,
    letters: ['p', 'l', 'a', 'n', 't', 'e'],
    validWords: ['plant', 'plane', 'plate', 'panel', 'planet', 'petal', 'late', 'lean', 'peal']
  }
];

export default function WordConstruction() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [wordsFound, setWordsFound] = useState<string[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<{ letter: string; from: 'available' | 'built'; index: number } | null>(null);

  const currentSet = wordSets[currentSetIndex];

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('wordConstructionProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentSetIndex(data.currentSetIndex || 0);
      setWordsFound(data.wordsFound || []);
    }
    shuffleLetters();
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem('wordConstructionProgress', JSON.stringify({
      currentSetIndex,
      wordsFound
    }));
  }, [currentSetIndex, wordsFound]);

  const shuffleLetters = () => {
    const shuffled = [...currentSet.letters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setBuiltWord([]);
  };

  const addLetterToWord = (letter: string, index: number) => {
    setBuiltWord([...builtWord, letter]);
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
  };

  const removeLetterFromWord = (index: number) => {
    const letter = builtWord[index];
    setAvailableLetters([...availableLetters, letter]);
    const newBuilt = [...builtWord];
    newBuilt.splice(index, 1);
    setBuiltWord(newBuilt);
  };

  const checkWord = () => {
    const word = builtWord.join('');
    if (word.length === 0) {
      toast.error('Build a word first!');
      return;
    }

    if (currentSet.validWords.includes(word)) {
      if (wordsFound.includes(word)) {
        toast.info('You already found this word!');
      } else {
        setWordsFound([...wordsFound, word]);
        toast.success(`✓ "${word}" is correct!`);
        clearWord();

        // Check if set is complete
        if (wordsFound.length + 1 >= 5) {
          setTimeout(() => {
            toast.success('Set complete! Moving to next set...');
            nextSet();
          }, 1000);
        }
      }
    } else {
      toast.error(`"${word}" is not a valid word. Try again!`);
    }
  };

  const clearWord = () => {
    setAvailableLetters([...availableLetters, ...builtWord]);
    setBuiltWord([]);
  };

  const hearWord = () => {
    const word = builtWord.join('');
    if (word.length === 0) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextSet = () => {
    if (currentSetIndex < wordSets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setWordsFound([]);
      shuffleLetters();
    } else {
      toast.success('🎉 All sets completed!');
    }
  };

  const handleDragStart = (e: React.DragEvent, letter: string, from: 'available' | 'built', index: number) => {
    setDraggedLetter({ letter, from, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnWord = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedLetter) return;

    if (draggedLetter.from === 'available') {
      addLetterToWord(draggedLetter.letter, draggedLetter.index);
    }
    setDraggedLetter(null);
  };

  const handleDropOnAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedLetter) return;

    if (draggedLetter.from === 'built') {
      removeLetterFromWord(draggedLetter.index);
    }
    setDraggedLetter(null);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
              🔤 Word Construction
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              Arrange letters to form valid words. Click or drag to build.
            </p>
          </div>
          <Button
            onClick={nextSet}
            disabled={wordsFound.length < 5 || currentSetIndex >= wordSets.length - 1}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next Set
          </Button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 text-sm">
          <div className="bg-white/60 dark:bg-gray-800/60 px-4 py-2 rounded-lg">
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              {wordsFound.length} / 5 words
            </span>
          </div>
          <div className="text-purple-700 dark:text-purple-300">
            {currentSet.validWords.length} possible words in this set.
          </div>
        </div>

        {/* Word Building Area */}
        <div className="space-y-3">
          <div
            className="min-h-[100px] bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border-2 border-dashed border-purple-300 dark:border-purple-700"
            onDragOver={handleDragOver}
            onDrop={handleDropOnWord}
          >
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
              Drop letters here to build a word
            </p>
            <div className="flex flex-wrap gap-2">
              {builtWord.map((letter, index) => (
                <button
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter, 'built', index)}
                  onClick={() => removeLetterFromWord(index)}
                  className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-lg shadow-md cursor-move transition-all hover:scale-105"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={hearWord}
              disabled={builtWord.length === 0}
              variant="outline"
              className="flex-1 border-purple-300 hover:bg-purple-50"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Hear
            </Button>
            <Button
              onClick={checkWord}
              disabled={builtWord.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Check
            </Button>
            <Button
              onClick={clearWord}
              disabled={builtWord.length === 0}
              variant="outline"
              className="flex-1 border-purple-300 hover:bg-purple-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Available Letters */}
        <div
          className="space-y-2"
          onDragOver={handleDragOver}
          onDrop={handleDropOnAvailable}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
              Your Letters
            </h4>
            <Button
              onClick={shuffleLetters}
              size="sm"
              variant="ghost"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              <Shuffle className="w-4 h-4 mr-1" />
              Shuffle
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableLetters.map((letter, index) => (
              <button
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, letter, 'available', index)}
                onClick={() => addLetterToWord(letter, index)}
                className="w-12 h-12 bg-white hover:bg-purple-100 text-purple-900 text-xl font-bold rounded-lg shadow-md cursor-move border-2 border-purple-300 transition-all hover:scale-105"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Words Found */}
        {wordsFound.length > 0 && (
          <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Words Found:
            </h4>
            <div className="flex flex-wrap gap-2">
              {wordsFound.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                >
                  ✓ {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

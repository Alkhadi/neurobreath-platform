'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, PlayCircle, Music, Trophy, Star } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const alphabet = [
  { letter: 'A', sound: '/æ/ as in apple', example: '🍎', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', isVowel: true },
  { letter: 'B', sound: '/b/ as in ball', example: '⚽', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'C', sound: '/k/ as in cat', example: '🐱', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'D', sound: '/d/ as in dog', example: '🐕', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'E', sound: '/ɛ/ as in egg', example: '🥚', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', isVowel: true },
  { letter: 'F', sound: '/f/ as in fish', example: '🐟', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'G', sound: '/ɡ/ as in goat', example: '🐐', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'H', sound: '/h/ as in hat', example: '🎩', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'I', sound: '/ɪ/ as in igloo', example: '🏠', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', isVowel: true },
  { letter: 'J', sound: '/dʒ/ as in jump', example: '🦘', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'K', sound: '/k/ as in kite', example: '🪁', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'L', sound: '/l/ as in lion', example: '🦁', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'M', sound: '/m/ as in moon', example: '🌙', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'N', sound: '/n/ as in nest', example: '🪹', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'O', sound: '/ɒ/ as in octopus', example: '🐙', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', isVowel: true },
  { letter: 'P', sound: '/p/ as in pig', example: '🐷', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'Q', sound: '/kw/ as in queen', example: '👑', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'R', sound: '/r/ as in rat', example: '🐀', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'S', sound: '/s/ as in sun', example: '☀️', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'T', sound: '/t/ as in top', example: '🔝', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'U', sound: '/ʌ/ as in umbrella', example: '☂️', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', isVowel: true },
  { letter: 'V', sound: '/v/ as in van', example: '🚐', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'W', sound: '/w/ as in window', example: '🪟', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'X', sound: '/ks/ as in box', example: '📦', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'Y', sound: '/j/ as in yo-yo', example: '🪀', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
  { letter: 'Z', sound: '/z/ as in zebra', example: '🦓', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', isVowel: false },
];

export function PhonicsSoundBoard() {
  const [selectedLetter, setSelectedLetter] = useState<typeof alphabet[0] | null>(null);
  const [playedLetters, setPlayedLetters] = useState<Set<string>>(new Set());
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const speakSound = (letter: typeof alphabet[0], rate = speed) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(true);
      
      // Speak the letter name
      const letterUtterance = new SpeechSynthesisUtterance(letter.letter);
      letterUtterance.rate = rate;
      letterUtterance.pitch = 1.2;
      
      // Speak the sound description
      const soundUtterance = new SpeechSynthesisUtterance(letter.sound);
      soundUtterance.rate = rate * 0.9;
      
      letterUtterance.onend = () => {
        setTimeout(() => {
          window.speechSynthesis.speak(soundUtterance);
        }, 300);
      };
      
      soundUtterance.onend = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(letterUtterance);
    }
  };

  const handleLetterClick = (letter: typeof alphabet[0]) => {
    setSelectedLetter(letter);
    setPlayedLetters(new Set([...playedLetters, letter.letter]));
    speakSound(letter);
  };

  const playAllSounds = () => {
    let index = 0;
    const playNext = () => {
      if (index < alphabet.length) {
        const letter = alphabet[index];
        setSelectedLetter(letter);
        setPlayedLetters(new Set([...playedLetters, letter.letter]));
        speakSound(letter, speed);
        
        setTimeout(() => {
          index++;
          playNext();
        }, 3000 / speed);
      } else {
        setIsPlaying(false);
        incrementGameCompleted();
        addBadgeEarned('phonics-master');
      }
    };
    
    setIsPlaying(true);
    playNext();
  };

  const resetProgress = () => {
    setPlayedLetters(new Set());
    setSelectedLetter(null);
  };

  const progress = (playedLetters.size / alphabet.length) * 100;
  const remaining = alphabet.length - playedLetters.size;

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">🎵 Phonics Song Player</CardTitle>
              <CardDescription>Listen and follow along as each letter sings its sound!</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              onClick={playAllSounds} 
              disabled={isPlaying}
              className="gap-2"
              size="lg"
            >
              <PlayCircle className="w-5 h-5" />
              Play All Sounds
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Button
                variant={speed === 0.75 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSpeed(0.75)}
              >
                Slow
              </Button>
              <Button
                variant={speed === 1.0 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSpeed(1.0)}
              >
                Normal
              </Button>
              <Button
                variant={speed === 1.5 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSpeed(1.5)}
              >
                1.5x
              </Button>
            </div>

            <Button 
              variant="outline"
              onClick={resetProgress}
              size="sm"
            >
              Reset Progress
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {playedLetters.size} / {alphabet.length}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {playedLetters.size} letters completed • {remaining} remaining
            </p>
          </div>

          {playedLetters.size === alphabet.length && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Amazing! You've completed the entire alphabet! 🎉
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alphabet Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📚 Alphabet Sound Board</CardTitle>
          <CardDescription>
            Click any letter to hear its sound • Vowels in green • Consonants in orange
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {alphabet.map((letter) => (
              <button
                key={letter.letter}
                onClick={() => handleLetterClick(letter)}
                disabled={isPlaying}
                className={`
                  relative aspect-square rounded-lg font-bold text-2xl
                  transition-all duration-200 hover:scale-110
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${letter.color}
                  ${selectedLetter?.letter === letter.letter ? 'ring-2 ring-primary scale-105' : ''}
                `}
                aria-label={`Letter ${letter.letter}, ${letter.sound}`}
              >
                {letter.letter}
                {playedLetters.has(letter.letter) && (
                  <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Letter Display */}
      {selectedLetter && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-bold ${selectedLetter.color}`}>
                    {selectedLetter.letter}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedLetter.letter}</h3>
                    <p className="text-muted-foreground">{selectedLetter.sound}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-4xl">
                  <span className="text-muted-foreground text-base">Like in</span>
                  {selectedLetter.sound.split(' ').pop()?.replace(/[()]/g, '')} {selectedLetter.example}
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={() => speakSound(selectedLetter)}
                disabled={isPlaying}
                className="gap-2"
              >
                <Volume2 className="w-5 h-5" />
                Play Sound
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

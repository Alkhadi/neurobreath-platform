'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, Play } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { useProgress } from '@/contexts/ProgressContext';

const words = [
  { sounds: ['c', 'a', 't'], word: 'cat', image: '🐱' },
  { sounds: ['d', 'o', 'g'], word: 'dog', image: '🐶' },
  { sounds: ['s', 'u', 'n'], word: 'sun', image: '☀️' },
  { sounds: ['b', 'a', 't'], word: 'bat', image: '🦇' },
  { sounds: ['p', 'i', 'g'], word: 'pig', image: '🐷' },
  { sounds: ['f', 'o', 'x'], word: 'fox', image: '🦊' },
  { sounds: ['b', 'u', 's'], word: 'bus', image: '🚌' },
  { sounds: ['h', 'a', 't'], word: 'hat', image: '🎩' },
];

export function SoundBlending() {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [soundsPlayed, setSoundsPlayed] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const speakSound = (sound: string, delay: number = 0) => {
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        const cleanText = sanitizeForTTS(sound);
        if (!cleanText) return;
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.5;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      }, delay);
    }
  };

  const playBlendingSounds = () => {
    const word = words[currentWord];
    word.sounds.forEach((sound, index) => {
      speakSound(sound, index * 800);
    });
    setSoundsPlayed(true);
  };

  const handleSubmit = () => {
    const word = words[currentWord];
    const isCorrect = userInput.toLowerCase() === word.word.toLowerCase();
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
      speakSound(word.word);
    }

    setTimeout(() => {
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        setFeedback(null);
        setUserInput('');
        setSoundsPlayed(false);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 6) {
          addBadgeEarned('blending-champion');
        }
      }
    }, 1500);
  };

  const reset = () => {
    setCurrentWord(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setUserInput('');
    setSoundsPlayed(false);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Fantastic Blending!</h3>
          <p className="text-lg">You scored {score} out of {words.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 6 && <p className="text-emerald-600 font-semibold">🏆 Blending Champion Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const word = words[currentWord];

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Sound Blending Builder</h3>
          <div className="text-sm text-muted-foreground">
            {currentWord + 1} / {words.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">{word.image}</div>
            
            <div className="p-6 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg">
              <div className="flex items-center justify-center gap-4 mb-4">
                {word.sounds.map((sound, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-3xl font-bold font-mono px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
                      {sound}
                    </div>
                    {i < word.sounds.length - 1 && <span className="text-2xl text-muted-foreground">+</span>}
                  </div>
                ))}
              </div>

              <Button
                onClick={playBlendingSounds}
                size="lg"
                className="w-full"
              >
                <Play className="w-5 h-5 mr-2" />
                {soundsPlayed ? 'Play Sounds Again' : 'Play Sounds'}
              </Button>
            </div>

            <p className="text-lg font-semibold">Blend the sounds together. What word do you hear?</p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type the word..."
              className="w-full px-4 py-3 text-2xl text-center border-2 rounded-lg focus:outline-none focus:border-cyan-500"
              disabled={feedback !== null}
            />

            <Button
              onClick={handleSubmit}
              disabled={!userInput || feedback !== null}
              className="w-full"
              size="lg"
            >
              Check Answer
            </Button>
          </div>

          {feedback && (
            <div className={`text-center text-lg font-semibold ${
              feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" /> Excellent! The word is "{word.word}"!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-6 h-6" /> The word is "{word.word}". Try blending the sounds!
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>🎵 Listen carefully to each sound, then blend them together!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

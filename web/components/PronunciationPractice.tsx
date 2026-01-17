'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, ChevronLeft, ChevronRight } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { toast } from 'sonner';

interface Word {
  word: string;
  phonetic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tip: string;
}

const wordsList: Word[] = [
  // Easy
  { word: 'cat', phonetic: '/kæt/', difficulty: 'easy', tip: 'Short "a" sound, like in "hat"' },
  { word: 'dog', phonetic: '/dɔɡ/', difficulty: 'easy', tip: 'Short "o" sound, like in "hot"' },
  { word: 'sun', phonetic: '/sʌn/', difficulty: 'easy', tip: 'Short "u" sound, like in "run"' },
  { word: 'bed', phonetic: '/bɛd/', difficulty: 'easy', tip: 'Short "e" sound, like in "red"' },
  { word: 'pig', phonetic: '/pɪɡ/', difficulty: 'easy', tip: 'Short "i" sound, like in "big"' },
  
  // Medium
  { word: 'elephant', phonetic: '/ˈɛləfənt/', difficulty: 'medium', tip: 'Stress on first syllable: EL-e-phant' },
  { word: 'butterfly', phonetic: '/ˈbʌtərflaɪ/', difficulty: 'medium', tip: 'Two parts: BUT-ter-fly' },
  { word: 'rainbow', phonetic: '/ˈreɪnboʊ/', difficulty: 'medium', tip: 'Long "a" in rain, long "o" in bow' },
  { word: 'chocolate', phonetic: '/ˈtʃɔklət/', difficulty: 'medium', tip: 'Three syllables: CHOC-o-late' },
  { word: 'beautiful', phonetic: '/ˈbjutəfəl/', difficulty: 'medium', tip: 'Stress on first syllable: BEAU-ti-ful' },
  
  // Hard
  { word: 'rhinoceros', phonetic: '/raɪˈnɑsərəs/', difficulty: 'hard', tip: 'Stress on second syllable: rhi-NO-ce-ros' },
  { word: 'encyclopedia', phonetic: '/ɪnˌsaɪkləˈpidiə/', difficulty: 'hard', tip: 'Five syllables with stress on "pe": en-cy-clo-PE-di-a' },
  { word: 'pneumonia', phonetic: '/nuˈmoʊnjə/', difficulty: 'hard', tip: 'Silent "p": noo-MOH-nyah' },
  { word: 'extraordinary', phonetic: '/ɪkˈstrɔrdnˌɛri/', difficulty: 'hard', tip: 'Stress on "or": ex-TRAOR-di-na-ry' },
  { word: 'pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', difficulty: 'hard', tip: 'Five syllables: pro-nun-ci-A-tion' }
];

export default function PronunciationPractice() {
  const PERCENT_BUCKETS = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
  ];

  const WIDTH_CLASS_BY_PERCENT: Record<number, string> = {
    0: 'w-0',
    5: 'w-[5%]',
    10: 'w-[10%]',
    15: 'w-[15%]',
    20: 'w-[20%]',
    25: 'w-[25%]',
    30: 'w-[30%]',
    35: 'w-[35%]',
    40: 'w-[40%]',
    45: 'w-[45%]',
    50: 'w-[50%]',
    55: 'w-[55%]',
    60: 'w-[60%]',
    65: 'w-[65%]',
    70: 'w-[70%]',
    75: 'w-[75%]',
    80: 'w-[80%]',
    85: 'w-[85%]',
    90: 'w-[90%]',
    95: 'w-[95%]',
    100: 'w-[100%]',
  };

  const toPercentBucket = (value: number): number => {
    const clamped = Math.max(0, Math.min(100, value));
    return PERCENT_BUCKETS.reduce((closest, current) =>
      Math.abs(current - clamped) < Math.abs(closest - clamped) ? current : closest
    , 0);
  };

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiced, setPracticed] = useState<{ [key: string]: boolean }>({});
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const filteredWords = wordsList.filter(w => w.difficulty === selectedDifficulty);
  const currentWord = filteredWords[currentIndex];
  const practicedCount = Object.keys(practiced).filter(key => 
    practiced[key] && key.startsWith(selectedDifficulty)
  ).length;
  const progressPercent = filteredWords.length
    ? Math.round((practicedCount / filteredWords.length) * 100)
    : 0;
  const progressWidthClass = WIDTH_CLASS_BY_PERCENT[toPercentBucket(progressPercent)];

  useEffect(() => {
    // Load progress
    const saved = localStorage.getItem('pronunciationPractice');
    if (saved) {
      setPracticed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem('pronunciationPractice', JSON.stringify(practiced));
  }, [practiced]);

  const playCorrectPronunciation = () => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(currentWord.word);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Here you could implement playback or analysis
        toast.success('Recording saved!');
        
        // Mark as practiced
        const key = `${selectedDifficulty}-${currentWord.word}`;
        setPracticed({ ...practiced, [key]: true });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording... Speak the word clearly!');
    } catch (error) {
      toast.error('Microphone access denied. Please allow microphone access to record.');
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800';
      case 'medium': return 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800';
      case 'hard': return 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800';
      default: return '';
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getDifficultyColor(selectedDifficulty)}`}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            🎤 Pronunciation Practice
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {practicedCount} practiced
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => {
                setSelectedDifficulty(difficulty);
                setCurrentIndex(0);
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
        </div>

        {/* Word Display */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 text-center space-y-4">
          <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            {currentWord.word}
          </div>
          <div className="text-2xl text-gray-600 dark:text-gray-400 font-mono">
            {currentWord.phonetic}
          </div>
          <div className="inline-flex items-start gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-left">
            <span className="text-xl">💡</span>
            <span className="text-sm">{currentWord.tip}</span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
              Correct Pronunciation
            </h4>
            <Button
              onClick={playCorrectPronunciation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Listen
            </Button>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
              Your Recording
            </h4>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              <Mic className="w-4 h-4 mr-2" />
              {isRecording ? 'Stop' : 'Record'}
            </Button>
          </div>
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
            {currentIndex + 1} / {filteredWords.length}
          </div>

          <Button
            onClick={() => navigate('next')}
            disabled={currentIndex === filteredWords.length - 1}
            variant="outline"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Progress */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Words Practiced ({selectedDifficulty})
          </h4>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {practicedCount} / {filteredWords.length}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300 ${progressWidthClass}`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

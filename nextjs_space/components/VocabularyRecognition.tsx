'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface VocabWord {
  word: string;
  definition: string;
  example: string;
  grade: '9th Grade' | '10th Grade' | '11th Grade' | '12th Grade';
}

const vocabulary: VocabWord[] = [
  // 9th Grade
  { word: 'aberration', definition: 'a departure from what is normal or expected', example: 'His recent behavior was an aberration from his usual calm demeanor.', grade: '9th Grade' },
  { word: 'acrimonious', definition: 'angry and bitter in tone or manner', example: 'The debate became increasingly acrimonious as both sides refused to compromise.', grade: '9th Grade' },
  { word: 'ambidextrous', definition: 'able to use both hands equally well', example: 'The ambidextrous artist could draw with either hand.', grade: '9th Grade' },
  { word: 'anachronistic', definition: 'belonging to a period other than that being portrayed', example: 'The use of smartphones in a historical drama would be anachronistic.', grade: '9th Grade' },
  { word: 'antithesis', definition: 'a person or thing that is the direct opposite of someone or something else', example: 'His calm approach was the antithesis of her aggressive style.', grade: '9th Grade' },
  
  // 10th Grade
  { word: 'apprehensive', definition: 'anxious or fearful about something that might happen', example: 'She felt apprehensive about her first day at the new school.', grade: '10th Grade' },
  { word: 'asynchronous', definition: 'not occurring at the same time', example: 'Online classes allow for asynchronous learning at your own pace.', grade: '10th Grade' },
  { word: 'blasphemous', definition: 'showing disrespect for God or sacred things', example: 'The comedian\'s jokes were considered blasphemous by religious leaders.', grade: '10th Grade' },
  { word: 'burgeoning', definition: 'beginning to grow or increase rapidly', example: 'The burgeoning tech industry created thousands of new jobs.', grade: '10th Grade' },
  { word: 'cacophonous', definition: 'involving or producing a harsh, discordant mixture of sounds', example: 'The cacophonous sounds of the city made it hard to sleep.', grade: '10th Grade' },
  
  // 11th Grade
  { word: 'clandestine', definition: 'kept secret or done secretively', example: 'The spies held a clandestine meeting in the abandoned warehouse.', grade: '11th Grade' },
  { word: 'conglomerate', definition: 'a large corporation formed by merging several companies', example: 'The media conglomerate owns dozens of newspapers and TV stations.', grade: '11th Grade' },
  { word: 'disproportionate', definition: 'too large or too small in comparison with something else', example: 'The punishment seemed disproportionate to the crime.', grade: '11th Grade' },
  { word: 'ecclesiastic', definition: 'relating to the Christian Church or its clergy', example: 'He wore ecclesiastic robes for the special ceremony.', grade: '11th Grade' },
  { word: 'fluorescence', definition: 'the emission of light by a substance that has absorbed light', example: 'The fluorescence of the minerals was visible under UV light.', grade: '11th Grade' },
  
  // 12th Grade
  { word: 'gubernatorial', definition: 'relating to a state governor', example: 'She announced her gubernatorial campaign last month.', grade: '12th Grade' },
  { word: 'heuristic', definition: 'enabling someone to discover or learn something for themselves', example: 'The teacher used heuristic methods to help students solve problems independently.', grade: '12th Grade' },
  { word: 'idiosyncratic', definition: 'peculiar or individual in character', example: 'His idiosyncratic writing style made his work instantly recognizable.', grade: '12th Grade' },
  { word: 'juxtaposition', definition: 'the fact of two things being seen or placed close together with contrasting effect', example: 'The juxtaposition of wealth and poverty in the city was striking.', grade: '12th Grade' },
  { word: 'kaleidoscopic', definition: 'having complex patterns of colors; constantly changing', example: 'The sunset created a kaleidoscopic display of colors.', grade: '12th Grade' }
];

type CardStatus = 'new' | 'learning' | 'mastered';

interface CardState {
  word: string;
  status: CardStatus;
  lastReviewed: number;
}

export default function VocabularyRecognition() {
  const [selectedGrade, setSelectedGrade] = useState<string>('9th Grade');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStates, setCardStates] = useState<{ [key: string]: CardState }>({});

  const filteredWords = vocabulary.filter(w => w.grade === selectedGrade);
  const currentWord = filteredWords[currentIndex];

  const getStatus = (word: string): CardStatus => {
    return cardStates[word]?.status || 'new';
  };

  const statusCounts = {
    mastered: Object.values(cardStates).filter(s => s.status === 'mastered').length,
    learning: Object.values(cardStates).filter(s => s.status === 'learning').length,
    new: vocabulary.length - Object.keys(cardStates).length
  };

  useEffect(() => {
    // Load progress
    const saved = localStorage.getItem('vocabularyRecognition');
    if (saved) {
      setCardStates(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem('vocabularyRecognition', JSON.stringify(cardStates));
  }, [cardStates]);

  const updateStatus = (status: CardStatus) => {
    setCardStates({
      ...cardStates,
      [currentWord.word]: {
        word: currentWord.word,
        status,
        lastReviewed: Date.now()
      }
    });
    
    // Auto-advance after marking
    setTimeout(() => {
      if (currentIndex < filteredWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    }, 500);
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      setCardStates({});
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setIsFlipped(false);
  };

  const getGradeColor = () => {
    switch (selectedGrade) {
      case '9th Grade': return 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800';
      case '10th Grade': return 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800';
      case '11th Grade': return 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800';
      case '12th Grade': return 'from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800';
      default: return '';
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getGradeColor()}`}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            📚 Vocabulary Recognition
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            Practice high-frequency words with spaced repetition.
          </p>
        </div>

        {/* Grade Selector */}
        <div className="grid grid-cols-4 gap-2">
          {['9th Grade', '10th Grade', '11th Grade', '12th Grade'].map((grade) => (
            <button
              key={grade}
              onClick={() => {
                setSelectedGrade(grade);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedGrade === grade
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg p-2 text-center">
            <div className="font-bold">{statusCounts.mastered}</div>
            <div className="text-xs">mastered</div>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg p-2 text-center">
            <div className="font-bold">{statusCounts.learning}</div>
            <div className="text-xs">learning</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg p-2 text-center">
            <div className="font-bold">{statusCounts.new}</div>
            <div className="text-xs">new</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(statusCounts.mastered / vocabulary.length) * 100}%`
              }}
            />
          </div>
          <div className="text-xs text-center text-gray-600 dark:text-gray-400">
            {Math.round((statusCounts.mastered / vocabulary.length) * 100)}%
          </div>
        </div>

        {/* Flashcard */}
        <div
          className="relative min-h-[300px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`absolute w-full transition-all duration-500 transform ${
            isFlipped ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'
          }`}>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 text-center border-4 border-gray-300 dark:border-gray-700 min-h-[300px] flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Tap to reveal
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {currentWord.word}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                getStatus(currentWord.word) === 'mastered'
                  ? 'bg-green-100 text-green-700'
                  : getStatus(currentWord.word) === 'learning'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {getStatus(currentWord.word)}
              </div>
            </div>
          </div>

          <div className={`absolute w-full transition-all duration-500 transform ${
            isFlipped ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0'
          }`}>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 border-4 border-blue-300 dark:border-blue-700 min-h-[300px]">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {currentWord.word}
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {currentWord.definition}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-100 dark:bg-gray-900/50 p-3 rounded">
                <strong>Example:</strong> {currentWord.example}
              </div>
            </div>
          </div>
        </div>

        {/* Card Counter */}
        <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
          Card {currentIndex + 1} of {filteredWords.length}
        </div>

        {/* Action Buttons */}
        {isFlipped && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                updateStatus('new');
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Again
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                updateStatus('learning');
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Good
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                updateStatus('mastered');
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Easy
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('prev')}
            disabled={currentIndex === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={() => navigate('next')}
            disabled={currentIndex === filteredWords.length - 1}
            variant="outline"
            className="flex-1"
          >
            Next
          </Button>
        </div>

        {/* Word List */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 max-h-40 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Word List Progress
          </h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {vocabulary.map((word, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded ${
                  getStatus(word.word) === 'mastered'
                    ? 'bg-green-100 text-green-700'
                    : getStatus(word.word) === 'learning'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {word.word}
              </div>
            ))}
          </div>
        </div>

        {/* Action Tabs */}
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => toast.info('Tricky Parts highlighting coming soon! Identify challenging word segments.')}
          >
            Tricky Parts
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => toast.info('Syllable breakdown coming soon! Break words into manageable chunks.')}
          >
            Syllables
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => toast.info('Spelling practice coming soon! Test your spelling skills.')}
          >
            Spell
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => toast.info('Letter tracing coming soon! Practice writing letter forms.')}
          >
            Trace
          </Button>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={resetProgress}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
          <Button
            onClick={() => {
              resetProgress();
              toast.success('New session started! All cards have been reset.');
            }}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            New Session
          </Button>
        </div>
      </div>
    </Card>
  );
}

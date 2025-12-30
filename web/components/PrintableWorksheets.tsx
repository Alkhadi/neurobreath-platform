import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Printer,
  FileText,
  PenTool,
  BookOpen,
  Puzzle,
  Eye,
  Shuffle,
  Type,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReadingLevelContext } from '@/contexts/ReadingLevelContext';

type WorksheetType = 
  | 'letter-tracing'
  | 'sight-words'
  | 'word-search'
  | 'fill-blanks'
  | 'syllable-count'
  | 'rhyming-words';

interface WorksheetConfig {
  type: WorksheetType;
  title: string;
  icon: typeof FileText;
  description: string;
}

const WORKSHEET_TYPES: WorksheetConfig[] = [
  { type: 'letter-tracing', title: 'Letter Tracing', icon: PenTool, description: 'Practice writing letters' },
  { type: 'sight-words', title: 'Sight Words Practice', icon: Eye, description: 'Read and write common words' },
  { type: 'word-search', title: 'Word Search', icon: Puzzle, description: 'Find hidden words' },
  { type: 'fill-blanks', title: 'Fill in the Blanks', icon: Type, description: 'Complete the sentences' },
  { type: 'syllable-count', title: 'Syllable Counting', icon: BookOpen, description: 'Count syllables in words' },
  { type: 'rhyming-words', title: 'Rhyming Words', icon: Shuffle, description: 'Match rhyming pairs' },
];

const SIGHT_WORDS = {
  easy: ['the', 'and', 'is', 'it', 'to', 'in', 'I', 'you', 'a', 'was', 'he', 'she', 'for', 'on', 'are'],
  medium: ['have', 'with', 'they', 'be', 'at', 'one', 'said', 'what', 'there', 'use', 'each', 'which', 'do', 'how', 'their'],
  hard: ['about', 'many', 'then', 'them', 'write', 'would', 'like', 'so', 'these', 'her', 'long', 'make', 'thing', 'see', 'him'],
};

const SYLLABLE_WORDS = [
  { word: 'cat', syllables: 1 },
  { word: 'happy', syllables: 2 },
  { word: 'elephant', syllables: 3 },
  { word: 'butterfly', syllables: 3 },
  { word: 'dog', syllables: 1 },
  { word: 'banana', syllables: 3 },
  { word: 'sun', syllables: 1 },
  { word: 'computer', syllables: 3 },
  { word: 'water', syllables: 2 },
  { word: 'umbrella', syllables: 3 },
];

const RHYMING_PAIRS = [
  ['cat', 'hat', 'bat', 'mat'],
  ['dog', 'fog', 'log', 'frog'],
  ['sun', 'fun', 'run', 'bun'],
  ['day', 'play', 'say', 'way'],
  ['tree', 'bee', 'see', 'free'],
  ['book', 'look', 'cook', 'hook'],
];

const FILL_BLANK_SENTENCES = [
  { sentence: 'The ___ is in the sky.', answer: 'sun', options: ['sun', 'run', 'fun'] },
  { sentence: 'I like to ___ books.', answer: 'read', options: ['read', 'red', 'bed'] },
  { sentence: 'The cat sat on the ___.', answer: 'mat', options: ['mat', 'hat', 'bat'] },
  { sentence: 'We play in the ___.', answer: 'park', options: ['park', 'dark', 'bark'] },
  { sentence: 'The bird can ___.', answer: 'fly', options: ['fly', 'cry', 'try'] },
  { sentence: 'I drink ___ every day.', answer: 'water', options: ['water', 'later', 'paper'] },
];

export function PrintableWorksheets() {
  const { difficulty: recommendedDifficulty, currentLevel } = useReadingLevelContext();
  const [selectedType, setSelectedType] = useState<WorksheetType>('letter-tracing');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(recommendedDifficulty);
  const [studentName, setStudentName] = useState('');
  const [letterCount, setLetterCount] = useState(6);
  const printRef = useRef<HTMLDivElement>(null);

  // Sync difficulty with reading level
  useEffect(() => {
    setDifficulty(recommendedDifficulty);
  }, [recommendedDifficulty]);

  const handlePrint = () => {
    window.print();
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateWordSearch = () => {
    const words = SIGHT_WORDS[difficulty].slice(0, 6);
    const size = 10;
    const grid: string[][] = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );
    
    // Place words horizontally or vertically
    words.forEach((word, idx) => {
      const horizontal = idx % 2 === 0;
      const upperWord = word.toUpperCase();
      
      if (horizontal && upperWord.length <= size) {
        const row = idx;
        const startCol = Math.floor(Math.random() * (size - upperWord.length));
        for (let i = 0; i < upperWord.length; i++) {
          grid[row][startCol + i] = upperWord[i];
        }
      } else if (upperWord.length <= size) {
        const col = idx;
        const startRow = Math.floor(Math.random() * (size - upperWord.length));
        for (let i = 0; i < upperWord.length; i++) {
          grid[startRow + i][col] = upperWord[i];
        }
      }
    });
    
    return { grid, words };
  };

  const renderWorksheet = () => {
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    switch (selectedType) {
      case 'letter-tracing':
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, letterCount);
        return (
          <div className="worksheet-content">
            <div className="worksheet-header">
              <h2 className="text-2xl font-bold">Letter Tracing Practice</h2>
              <div className="flex justify-between text-sm mt-2">
                <span>Name: {studentName || '_______________'}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Trace each letter, then write it on your own.</p>
            <div className="grid grid-cols-3 gap-6">
              {letters.map((letter) => (
                <div key={letter} className="border-2 border-dashed border-muted rounded-lg p-4">
                  <div className="text-6xl font-bold text-muted-foreground/30 text-center mb-2 font-mono">
                    {letter}
                  </div>
                  <div className="border-b-2 border-dotted border-muted h-12 mb-2" />
                  <div className="border-b-2 border-dotted border-muted h-12" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'sight-words':
        const words = SIGHT_WORDS[difficulty];
        return (
          <div className="worksheet-content">
            <div className="worksheet-header">
              <h2 className="text-2xl font-bold">Sight Words Practice</h2>
              <div className="flex justify-between text-sm mt-2">
                <span>Name: {studentName || '_______________'}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Read each word. Write it 3 times. Use it in a sentence.</p>
            <div className="space-y-4">
              {words.slice(0, 8).map((word) => (
                <div key={word} className="border rounded-lg p-3">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold min-w-[80px]">{word}</span>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="border-b-2 border-dotted border-muted h-8" />
                      ))}
                    </div>
                  </div>
                  <div className="border-b-2 border-dotted border-muted h-8 mt-2" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'word-search':
        const { grid, words: searchWords } = generateWordSearch();
        return (
          <div className="worksheet-content">
            <div className="worksheet-header">
              <h2 className="text-2xl font-bold">Word Search</h2>
              <div className="flex justify-between text-sm mt-2">
                <span>Name: {studentName || '_______________'}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Find and circle these words:</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {searchWords.map((word) => (
                <span key={word} className="px-3 py-1 bg-muted rounded-full font-medium">
                  {word.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="grid gap-1 mx-auto w-fit font-mono text-lg">
              {grid.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className="w-8 h-8 border border-muted flex items-center justify-center font-bold"
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      case 'fill-blanks':
        return (
          <div className="worksheet-content">
            <div className="worksheet-header">
              <h2 className="text-2xl font-bold">Fill in the Blanks</h2>
              <div className="flex justify-between text-sm mt-2">
                <span>Name: {studentName || '_______________'}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Choose the correct word to complete each sentence.</p>
            <div className="space-y-6">
              {FILL_BLANK_SENTENCES.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <p className="text-lg mb-3">{idx + 1}. {item.sentence}</p>
                  <div className="flex gap-4 ml-4">
                    {shuffleArray(item.options).map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-foreground rounded-sm" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'syllable-count':
        return (
          <div className="worksheet-content">
            <div className="worksheet-header">
              <h2 className="text-2xl font-bold">Syllable Counting</h2>
              <div className="flex justify-between text-sm mt-2">
                <span>Name: {studentName || '_______________'}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Clap out each word. Write how many syllables you hear.</p>
            <div className="grid grid-cols-2 gap-4">
              {SYLLABLE_WORDS.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 flex items-center justify-between">
                  <span className="text-xl font-medium">{item.word}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Syllables:</span>
                    <div className="w-12 h-10 border-2 border-dashed border-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Tip: Clap your hands for each syllable!</p>
              <p className="text-sm text-muted-foreground">Example: "hap-py" = 2 claps = 2 syllables</p>
            </div>
          </div>
        );

      case 'rhyming-words':
        const pairs = shuffleArray(RHYMING_PAIRS).slice(0, 4);
        const allWords = pairs.flatMap(p => p.slice(0, 2));
        const shuffledWords = shuffleArray([...allWords]);
        return (
          <div className="worksheet-content">
            <div className="worksheet-header">
              <h2 className="text-2xl font-bold">Rhyming Words</h2>
              <div className="flex justify-between text-sm mt-2">
                <span>Name: {studentName || '_______________'}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Draw a line to match words that rhyme.</p>
            <div className="flex justify-between px-12">
              <div className="space-y-6">
                {shuffledWords.slice(0, 4).map((word, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-xl font-medium w-20">{word}</span>
                    <div className="w-4 h-4 rounded-full border-2 border-foreground" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {shuffledWords.slice(4, 8).map((word, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full border-2 border-foreground" />
                    <span className="text-xl font-medium w-20">{word}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t pt-4">
              <p className="font-medium mb-2">Bonus: Write your own rhyming words!</p>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((n) => (
                  <div key={n} className="flex items-center gap-2">
                    <div className="border-b-2 border-dotted border-muted flex-1 h-8" />
                    <span>rhymes with</span>
                    <div className="border-b-2 border-dotted border-muted flex-1 h-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedConfig = WORKSHEET_TYPES.find(w => w.type === selectedType)!;
  const SelectedIcon = selectedConfig.icon;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Printable Worksheets
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Controls - hidden when printing */}
          <div className="no-print grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Worksheet Type</Label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as WorksheetType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKSHEET_TYPES.map((type) => (
                    <SelectItem key={type.type} value={type.type}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Difficulty</Label>
                {currentLevel && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Sparkles className="w-3 h-3" />
                    Auto-set
                  </Badge>
                )}
              </div>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Student Name (optional)</Label>
              <Input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter name..."
              />
            </div>

            {selectedType === 'letter-tracing' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Letters to Practice</Label>
                  <span className="text-sm text-muted-foreground">{letterCount}</span>
                </div>
                <Slider
                  value={[letterCount]}
                  onValueChange={([v]) => setLetterCount(v)}
                  min={3}
                  max={26}
                  step={1}
                />
              </div>
            )}
          </div>

          {/* Selected worksheet info */}
          <div className="no-print flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <SelectedIcon className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-medium">{selectedConfig.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedConfig.description}</p>
            </div>
          </div>

          {/* Print/Download buttons */}
          <div className="no-print flex gap-3">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print Worksheet
            </Button>
          </div>

          {/* Worksheet Preview/Print Area */}
          <div 
            ref={printRef} 
            className={cn(
              "print-area border rounded-lg p-6 bg-card min-h-[600px]",
              "worksheet-page"
            )}
          >
            {renderWorksheet()}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

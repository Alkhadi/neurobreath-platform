'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, RefreshCw, CheckCircle, ChevronRight, Trophy } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export function LetterTracing() {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const { incrementGameCompleted, addBadgeEarned, addLetterCompleted } = useProgress();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        setCtx(context);
        drawLetter(context, letters[currentLetter]);
      }
    }
  }, [currentLetter]);

  const drawLetter = (context: CanvasRenderingContext2D, letter: string) => {
    context.clearRect(0, 0, 400, 400);
    context.font = '250px Arial';
    context.fillStyle = '#e0e0e0';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(letter, 200, 200);
  };

  const speakLetter = (letter: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (ctx) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (ctx) {
      drawLetter(ctx, letters[currentLetter]);
    }
  };

  const markComplete = () => {
    const letter = letters[currentLetter];
    setCompletedLetters([...completedLetters, letter]);
    addLetterCompleted(letter);
    speakLetter(`Great job tracing ${letter}!`);
    
    if (currentLetter < letters.length - 1) {
      setTimeout(() => {
        setCurrentLetter(currentLetter + 1);
      }, 1000);
    } else {
      incrementGameCompleted();
      addBadgeEarned('tracing-master');
    }
  };

  const reset = () => {
    setCurrentLetter(0);
    setCompletedLetters([]);
    if (ctx) {
      drawLetter(ctx, letters[0]);
    }
  };

  if (completedLetters.length >= letters.length) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Amazing Work!</h3>
          <p className="text-lg">You traced {completedLetters.length} letters!</p>
          <div className="text-sm text-muted-foreground">
            <p className="text-emerald-600 font-semibold">🏆 Tracing Master Badge Earned!</p>
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Letter Tracing</h3>
          <div className="text-sm text-muted-foreground">
            {currentLetter + 1} / {letters.length}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => speakLetter(letters[currentLetter])}
              className="text-4xl font-bold"
            >
              Trace: {letters[currentLetter]}
              <Volume2 className="w-6 h-6 ml-3" />
            </Button>
          </div>

          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white dark:bg-gray-800"
              style={{ touchAction: 'none' }}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={clearCanvas}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={markComplete}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {letters.map((letter, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold ${
                  completedLetters.includes(letter)
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700'
                    : i === currentLetter
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {completedLetters.includes(letter) ? <CheckCircle className="w-4 h-4" /> : letter}
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>🖊️ Use your mouse or finger to trace the letter shape</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

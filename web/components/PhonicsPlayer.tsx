import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDorothyAudio, PHONICS_LETTER_DATA } from "@/hooks/useDorothyAudio";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const VOWELS = ["A", "E", "I", "O", "U"];

export function PhonicsPlayer() {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [speed, setSpeed] = useState([1.5]);
  const { playLetterCall, stop } = useDorothyAudio();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playLetter = useCallback(
    (index: number) => {
      if (index >= ALPHABET.length) {
        setIsAutoPlaying(false);
        setCurrentIndex(-1);
        return;
      }

      const letter = ALPHABET[index];
      setCurrentIndex(index);
      const duration = playLetterCall(letter);
      
      // Schedule next letter based on duration
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (isAutoPlaying) {
          playLetter(index + 1);
        }
      }, duration + 400);
    },
    [playLetterCall, isAutoPlaying]
  );

  const handlePlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      setIsAutoPlaying(true);
      playLetter(currentIndex < 0 ? 0 : currentIndex);
    }
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(-1);
    stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleLetterClick = (index: number) => {
    stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex(index);
    playLetterCall(ALPHABET[index]);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section data-tutorial="phonics" className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
            🎵 Phonics Song Player
          </h2>
          <p className="text-muted-foreground">
            Listen and follow along as each letter sings its sound!
          </p>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-soft border border-border">
          {/* Letter Grid */}
          <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-2 mb-8">
            {ALPHABET.map((letter, index) => {
              const isVowel = VOWELS.includes(letter);
              const isActive = index === currentIndex;
              const isPast = index < currentIndex;

              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(index)}
                  className={`
                    aspect-square rounded-xl text-2xl font-bold transition-all duration-300
                    flex items-center justify-center cursor-pointer
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground scale-125 shadow-glow animate-pulse ring-4 ring-primary/30"
                        : isPast
                        ? isVowel
                          ? "bg-zone-vowel/60 text-foreground"
                          : "bg-zone-consonant/60 text-foreground"
                        : isVowel
                        ? "bg-zone-vowel text-foreground hover:scale-110"
                        : "bg-zone-consonant text-foreground hover:scale-110"
                    }
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Current Letter Display */}
          <div className="text-center mb-8">
            {currentIndex >= 0 ? (
              <div className="animate-scale-in">
                <span className="text-8xl font-display font-bold text-primary">
                  {ALPHABET[currentIndex]}
                </span>
                <p className="text-xl text-muted-foreground mt-2">
                  {ALPHABET[currentIndex]} says its sound, like {PHONICS_LETTER_DATA[ALPHABET[currentIndex]]?.word}
                </p>
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">
                Press play to start the phonics song!
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePlay}
                size="lg"
                className="rounded-full w-16 h-16"
              >
                {isAutoPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-48">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {speed[0].toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / ALPHABET.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {currentIndex >= 0 ? currentIndex + 1 : 0} / {ALPHABET.length}{" "}
              letters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

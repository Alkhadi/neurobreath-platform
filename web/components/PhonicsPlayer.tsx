import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDorothyAudio, PHONICS_LETTER_DATA } from "@/hooks/useDorothyAudio";

// Full 26-letter alphabet including Z
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // 26 letters: A-Z
const VOWELS = ["A", "E", "I", "O", "U"];

export function PhonicsPlayer() {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [speed, setSpeed] = useState([1.5]);
  const { playLetterCall, playLetterPhoneme, stop } = useDorothyAudio();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const phonemeOnlyLetters = useRef(new Set(["S", "T", "U", "V", "W", "X", "Y", "Z"]));

  const renderLetterButton = (letter: string, index: number) => {
    const isVowel = VOWELS.includes(letter);
    const isActive = index === currentIndex;
    const isPast = index < currentIndex;

    return (
      <button
        key={letter}
        onClick={() => handleLetterClick(index)}
        className={`
          w-9 h-9 sm:w-10 sm:h-10 md:w-16 md:h-16
          rounded-xl text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300
          flex items-center justify-center cursor-pointer flex-shrink-0
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
        aria-label={`Play letter ${letter}`}
        type="button"
      >
        {letter}
      </button>
    );
  };

  const playLetter = useCallback(
    (index: number) => {
      if (index >= ALPHABET.length) {
        setIsAutoPlaying(false);
        setCurrentIndex(-1);
        return;
      }

      const letter = ALPHABET[index];
      setCurrentIndex(index);
      const duration = playLetterCall(letter, speed[0]);
      
      // Schedule next letter based on duration
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (isAutoPlaying) {
          playLetter(index + 1);
        }
      }, duration + 400);
    },
    [playLetterCall, isAutoPlaying, speed]
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
    const letter = ALPHABET[index];
    // For S–Z, play the "phoneme-only" window for cleaner, accurate sounds.
    if (phonemeOnlyLetters.current.has(letter)) {
      playLetterPhoneme(letter, speed[0]);
      return;
    }
    playLetterCall(letter, speed[0]);
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
          {/* Mobile/Tablet: force 3 fixed rows so Z is always on the same row as Y */}
          <div className="md:hidden mb-8 space-y-4">
            <div className="flex justify-center gap-2 sm:gap-3">
              {ALPHABET.slice(0, 9).map((letter, i) => renderLetterButton(letter, i))}
            </div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {ALPHABET.slice(9, 18).map((letter, i) => renderLetterButton(letter, 9 + i))}
            </div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {ALPHABET.slice(18, 26).map((letter, i) => renderLetterButton(letter, 18 + i))}
            </div>
          </div>

          {/* Desktop: 13 columns => 2 perfect rows */}
          <div className="hidden md:grid grid-cols-13 gap-2 mb-8 justify-items-center">
            {ALPHABET.map((letter, index) => renderLetterButton(letter, index))}
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

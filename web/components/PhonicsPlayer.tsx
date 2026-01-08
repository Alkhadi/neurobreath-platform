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
          w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16
          rounded-lg sm:rounded-xl text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold transition-all duration-300
          flex items-center justify-center cursor-pointer flex-shrink-0
          shadow-md hover:shadow-xl active:scale-95
          border border-2
          ${
            isActive
              ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground scale-105 sm:scale-110 md:scale-125 shadow-2xl animate-pulse ring-2 sm:ring-4 ring-primary/40 border-primary/50 z-10"
              : isPast
              ? isVowel
                ? "bg-gradient-to-br from-zone-vowel to-zone-vowel/80 text-foreground border-zone-vowel/40 opacity-75"
                : "bg-gradient-to-br from-zone-consonant to-zone-consonant/80 text-foreground border-zone-consonant/40 opacity-75"
              : isVowel
              ? "bg-gradient-to-br from-zone-vowel via-zone-vowel to-zone-vowel/90 text-foreground hover:scale-105 sm:hover:scale-110 hover:shadow-2xl border-zone-vowel/30 hover:border-zone-vowel"
              : "bg-gradient-to-br from-zone-consonant via-zone-consonant to-zone-consonant/90 text-foreground hover:scale-105 sm:hover:scale-110 hover:shadow-2xl border-zone-consonant/30 hover:border-zone-consonant"
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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            🎵 Phonics Song Player
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Listen and follow along as each letter sings its sound!
          </p>
        </div>

        <div className="bg-gradient-to-br from-card via-card to-card/80 rounded-2xl sm:rounded-3xl p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border-2 border-border/50 backdrop-blur-sm">
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">📚</span>
              Alphabet Sound Board
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground px-2">
              Click any letter to hear its sound • Vowels in green • Consonants in orange
            </p>
          </div>

          {/* Letter Grid - Clean 3-row layout (9 + 9 + 8 letters) */}
          <div className="mb-8 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 bg-muted/20 rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6">
            {/* Row 1: A-I (9 letters) */}
            <div className="flex justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
              {ALPHABET.slice(0, 9).map((letter, i) => renderLetterButton(letter, i))}
            </div>
            {/* Row 2: J-R (9 letters) */}
            <div className="flex justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
              {ALPHABET.slice(9, 18).map((letter, i) => renderLetterButton(letter, 9 + i))}
            </div>
            {/* Row 3: S-Z (8 letters) */}
            <div className="flex justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
              {ALPHABET.slice(18, 26).map((letter, i) => renderLetterButton(letter, 18 + i))}
            </div>
          </div>

          {/* Current Letter Display */}
          <div className="text-center mb-6 sm:mb-8 py-4 sm:py-6 md:py-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl sm:rounded-2xl border border-primary/20">
            {currentIndex >= 0 ? (
              <div className="animate-scale-in px-2">
                <div className="inline-block mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full border-2 border-primary/30">
                  <span className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold text-primary drop-shadow-lg">
                  {ALPHABET[currentIndex]}
                </span>
                </div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground font-semibold">
                  {ALPHABET[currentIndex]} says its sound
                </p>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 sm:mt-2">
                  Like in <span className="font-bold text-primary">{PHONICS_LETTER_DATA[ALPHABET[currentIndex]]?.word}</span> {PHONICS_LETTER_DATA[ALPHABET[currentIndex]]?.emoji}
                </p>
              </div>
            ) : (
              <div className="py-2 sm:py-4 px-2">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎧</div>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium">
                Press play to start the phonics song!
              </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                  Or click any letter to hear its individual sound
                </p>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="bg-muted/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Play Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={handlePlay}
                size="lg"
                  className="rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isAutoPlaying ? (
                    <Pause className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5 sm:ml-1" />
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                  className="rounded-full w-11 h-11 sm:w-12 sm:h-12 hover:bg-muted transition-all duration-300 hover:scale-105"
              >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-64 bg-card/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-border/30">
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2}
                step={0.1}
                className="flex-1"
              />
                <span className="text-xs sm:text-sm font-semibold text-foreground w-10 sm:w-12 text-right">
                {speed[0].toFixed(1)}x
              </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
            <div className="mb-2 sm:mb-3">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Progress</span>
                <span className="text-xs sm:text-sm font-bold text-primary">
                  {currentIndex >= 0 ? currentIndex + 1 : 0} / {ALPHABET.length}
                </span>
              </div>
              <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden shadow-inner">
              <div
                  className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-500 rounded-full shadow-lg"
                style={{
                  width: `${((currentIndex + 1) / ALPHABET.length) * 100}%`,
                }}
              />
            </div>
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground px-2">
              {currentIndex >= 0 ? (
                <>
                  <span className="font-semibold text-foreground">{currentIndex + 1} letters</span> completed • {ALPHABET.length - (currentIndex + 1)} remaining
                </>
              ) : (
                "Ready to begin your phonics journey!"
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

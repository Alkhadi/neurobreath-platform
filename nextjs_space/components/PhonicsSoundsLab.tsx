// Phonics Sounds Lab - Certificate printing and download
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  X, 
  Printer, 
  Edit, 
  Volume2,
  VolumeX,
  Shuffle,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  DOROTHY_LETTER_TIMINGS, 
  PHONICS_LETTER_DATA,
  findLetterIndexForTime,
  checkMilestoneTime,
  getAudioPhase,
  type LetterTiming,
  type AudioPhase
} from '@/hooks/useDorothyAudio';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTER_CALL_HEADROOM = 0.15; // Small buffer before letter starts

// Letter segments for display grouping
const LETTER_SEGMENTS = [
  { letters: ['A', 'B', 'C', 'D', 'E', 'F'], label: 'A–F', milestone: 'bronze' },
  { letters: ['G', 'H', 'I', 'J', 'K', 'L'], label: 'G–L', milestone: 'silver' },
  { letters: ['M', 'N', 'O', 'P', 'Q', 'R'], label: 'M–R', milestone: 'gold' },
  { letters: ['S', 'T', 'U', 'V', 'W', 'X'], label: 'S–X', milestone: 'platinum' },
  { letters: ['Y', 'Z'], label: 'Y–Z', milestone: 'platinum' }
];

// Milestone configuration
const MILESTONES = [
  {
    id: "bronze",
    label: "Bronze breath break achieved",
    letters: "A–F",
    triggerLetter: "F",
    seconds: 10,
    body: "You just wrapped the A–F repeats with perfect pacing. Hold this bronze pause for a sip of air, then tap Continue to glide into the G–L crew.",
    nextLetter: "G"
  },
  {
    id: "silver",
    label: "Silver sound sweep complete",
    letters: "G–L",
    triggerLetter: "L",
    seconds: 10,
    body: "Beautiful focus through the G–L set. Take this silver pause for ten calm seconds of breathing, then tap Continue to meet the M–R team.",
    nextLetter: "M"
  },
  {
    id: "gold",
    label: "Gold glide mastered",
    letters: "M–R",
    triggerLetter: "R",
    seconds: 10,
    body: "You've moved through M–R with smooth, steady sound work. Hold this gold pause, breathe out slowly, then tap Continue to glide into the final S–Z stretch.",
    nextLetter: "S"
  },
  {
    id: "platinum",
    label: "Platinum phoneme circuit",
    letters: "S–Z",
    triggerLetter: "Z",
    seconds: 12,
    body: "Full alphabet circuit complete — S through Z sounded with calm control. Enjoy this platinum spotlight, then decide if you'd like to claim an official NeuroBreath certificate.",
    nextLetter: null
  }
];

const MILESTONE_COLORS: Record<string, { 
  bg: string; 
  clock: string; 
  banner: string;
  confetti: string[];
  gradient: string;
}> = {
  bronze: { 
    bg: "from-amber-900/80 via-orange-900/70 to-amber-950/90", 
    clock: "#fbbf77", 
    banner: "bg-gradient-to-r from-amber-600 to-orange-600",
    confetti: ["#CD7F32", "#B87333", "#8B4513", "#D2691E"],
    gradient: "from-amber-500 to-orange-600"
  },
  silver: { 
    bg: "from-slate-700/80 via-slate-600/70 to-slate-800/90", 
    clock: "#e5e7eb", 
    banner: "bg-gradient-to-r from-slate-400 to-slate-500",
    confetti: ["#C0C0C0", "#A8A8A8", "#D4D4D4", "#808080"],
    gradient: "from-slate-400 to-slate-500"
  },
  gold: { 
    bg: "from-yellow-900/80 via-amber-800/70 to-yellow-950/90", 
    clock: "#facc15", 
    banner: "bg-gradient-to-r from-yellow-500 to-amber-500",
    confetti: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520"],
    gradient: "from-yellow-400 to-amber-500"
  },
  platinum: { 
    bg: "from-purple-900/80 via-indigo-800/70 to-purple-950/90", 
    clock: "#a5b4fc", 
    banner: "bg-gradient-to-r from-purple-500 to-indigo-500",
    confetti: ["#E5E4E2", "#9B59B6", "#8E44AD", "#A78BFA"],
    gradient: "from-purple-400 to-indigo-500"
  }
};

const HEAD_VARIANTS = [
  { name: "sunrise", gradient: "from-amber-500 to-orange-600" },
  { name: "onyx", gradient: "from-slate-600 to-slate-800" },
  { name: "neon", gradient: "from-green-400 to-emerald-600" },
  { name: "aurora", gradient: "from-purple-500 to-pink-600" }
];

export function PhonicsSoundsLab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [headVariant, setHeadVariant] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  
  // Milestone state
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const [triggeredMilestones, setTriggeredMilestones] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState(0);
  
  // Audio phase state for visual indicator
  const [audioPhase, setAudioPhase] = useState<AudioPhase>('intro');
  
  // Certificate state
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentLetter = ALPHABET[Math.min(currentIndex, ALPHABET.length - 1)];
  const currentData = PHONICS_LETTER_DATA[currentLetter] || { word: "", emoji: "" };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/audio/dorothy-alphabet-sounds.mp3');
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle audio time updates - main synchronization logic
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current || showMilestone) return;
    
    const t = audioRef.current.currentTime;
    setElapsedTime(Math.floor(t));
    
    // Update audio phase for visual indicator
    const { phase } = getAudioPhase(t);
    setAudioPhase(phase);
    
    // Find which letter should be displayed based on current time (with delay)
    const idx = findLetterIndexForTime(t);
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      const letter = ALPHABET[idx];
      setCompletedLetters(prev => new Set([...prev, letter]));
    }
    
    // Check for milestone triggers using the centralized function
    const milestoneLetter = checkMilestoneTime(t, triggeredMilestones);
    if (milestoneLetter) {
      const milestone = MILESTONES.find(m => m.triggerLetter === milestoneLetter);
      if (milestone) {
        triggerMilestone(milestone);
      }
    }
  }, [showMilestone, currentIndex, triggeredMilestones]);

  const triggerMilestone = (milestone: typeof MILESTONES[0]) => {
    if (!audioRef.current) return;
    
    // Pause audio immediately
    audioRef.current.pause();
    setIsPlaying(false);
    
    // Mark this milestone as triggered
    setTriggeredMilestones(prev => new Set([...prev, milestone.triggerLetter]));
    
    // Show milestone celebration
    setCurrentMilestone(milestone);
    setCountdown(milestone.seconds);
    setShowMilestone(true);
    
    // Fire confetti with milestone-specific colors
    const colors = MILESTONE_COLORS[milestone.id]?.confetti || ["#FFD700"];
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.35 },
      colors: colors
    });
    
    // Additional confetti bursts
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
    }, 250);
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 400);
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    const handleEnded = () => {
      setIsPlaying(false);
      // Set current index to Z (last letter)
      setCurrentIndex(ALPHABET.length - 1);
      setCompletedLetters(new Set(ALPHABET));
      
      // When audio ends, trigger the platinum milestone if not already triggered
      if (!triggeredMilestones.has('Z')) {
        const platinumMilestone = MILESTONES.find(m => m.triggerLetter === 'Z');
        if (platinumMilestone) {
          // Small delay to let Z display settle
          setTimeout(() => triggerMilestone(platinumMilestone), 500);
        }
      } else if (!showCertificate) {
        // If Z milestone was already triggered, show certificate
        setShowCertificate(true);
        setCertificateId(`NB-${Math.floor(10000 + Math.random() * 90000)}`);
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeUpdate, triggeredMilestones, showCertificate]);

  // Countdown timer for milestones
  useEffect(() => {
    if (!showMilestone || countdown <= 0) return;
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showMilestone]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    audioRef.current.muted = isMuted;
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
    setCurrentIndex(0);
    setCompletedLetters(new Set());
    setTriggeredMilestones(new Set());
    setElapsedTime(0);
    setShowMilestone(false);
    setCurrentMilestone(null);
    setShowCertificate(false);
    setShowCertificatePreview(false);
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setShowMilestone(false);
    setShowCertificate(false);
    setShowCertificatePreview(false);
    setCurrentMilestone(null);
    setTriggeredMilestones(new Set());
    setCompletedLetters(new Set());
    handleStart();
  };

  const handleContinue = () => {
    if (!audioRef.current || !currentMilestone) return;
    
    setShowMilestone(false);
    setCurrentMilestone(null);
    
    if (currentMilestone.id === "platinum") {
      setShowCertificate(true);
      setCertificateId(`NB-${Math.floor(10000 + Math.random() * 90000)}`);
    } else if (currentMilestone.nextLetter) {
      const nextTiming = DOROTHY_LETTER_TIMINGS.find(t => t.letter === currentMilestone.nextLetter);
      if (nextTiming) {
        audioRef.current.currentTime = nextTiming.start - LETTER_CALL_HEADROOM;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleLetterClick = (letter: string) => {
    if (!audioRef.current) return;
    
    const timing = DOROTHY_LETTER_TIMINGS.find(t => t.letter === letter.toUpperCase());
    if (!timing) {
      console.warn(`No timing found for letter: ${letter}`);
      return;
    }
    
    // Clear any milestone state
    setShowMilestone(false);
    setShowCertificate(false);
    setShowCertificatePreview(false);
    setCurrentMilestone(null);
    
    // Update current index to match clicked letter
    const letterIndex = ALPHABET.indexOf(letter.toUpperCase());
    if (letterIndex >= 0) {
      setCurrentIndex(letterIndex);
    }
    
    // Seek to letter start with small headroom and play
    const seekTime = Math.max(0, timing.start - LETTER_CALL_HEADROOM);
    audioRef.current.currentTime = seekTime;
    audioRef.current.muted = isMuted;
    audioRef.current.play().catch(err => console.error('Play failed:', err));
    setIsPlaying(true);
  };

  const handleShuffleHead = () => {
    setHeadVariant(prev => (prev + 1) % HEAD_VARIANTS.length);
  };

  const handleClose = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsOpen(false);
    setIsPlaying(false);
    setShowMilestone(false);
    setShowCertificate(false);
  };

  const handlePrint = async () => {
    const element = document.getElementById('certificate-print-area');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const imgData = canvas.toDataURL('image/png');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>NeuroBreath Certificate</title>
            <style>
              @page { size: A4 portrait; margin: 0; }
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body { width: 210mm; height: 297mm; }
              body { display: flex; justify-content: center; align-items: center; background: white; }
              img { max-width: 190mm; max-height: 277mm; width: auto; height: auto; }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-print-area');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `NeuroBreath-Certificate-${certificateName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDesignCertificate = () => {
    if (certificateName.trim()) {
      setShowCertificatePreview(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const progress = audioRef.current?.duration 
    ? (elapsedTime / audioRef.current.duration) * 100 
    : (currentIndex / ALPHABET.length) * 100;

  const getHeadGradient = () => HEAD_VARIANTS[headVariant].gradient;

  return (
    <>
      {/* Entry Card */}
      <Card className="overflow-hidden" data-tutorial="phonics-sounds-lab">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 p-4 sm:p-6">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-primary font-semibold mb-1">
              Stage 2 • Phonics Training
            </p>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              Phonics Letters Sounds Lab
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Full-screen phonics studio with A–Z sounds, breathing pauses, milestone celebrations, and printable certificates.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
              {ALPHABET.slice(0, 13).map(letter => (
                <span
                  key={letter}
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-all",
                    completedLetters.has(letter)
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
              {ALPHABET.slice(13).map(letter => (
                <span
                  key={letter}
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-all",
                    completedLetters.has(letter)
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {letter}
                </span>
              ))}
            </div>
            <Button 
              onClick={() => { setIsOpen(true); handleStart(); }} 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start Phonics Sounds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full-screen Phonics Studio */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden phonics-lab-focus-screen animate-fade-in">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Ambient light rays */}
            <div className="absolute top-0 left-[15%] w-0.5 h-40 bg-gradient-to-b from-yellow-400/60 to-transparent" />
            <div className="absolute top-0 left-[30%] w-0.5 h-32 bg-gradient-to-b from-green-400/50 to-transparent" />
            <div className="absolute top-0 left-[45%] w-0.5 h-48 bg-gradient-to-b from-cyan-400/60 to-transparent" />
            <div className="absolute top-0 left-[60%] w-0.5 h-36 bg-gradient-to-b from-orange-400/50 to-transparent" />
            <div className="absolute top-0 left-[75%] w-0.5 h-44 bg-gradient-to-b from-pink-400/60 to-transparent" />
            <div className="absolute top-0 left-[85%] w-0.5 h-28 bg-gradient-to-b from-purple-400/50 to-transparent" />
            
            {/* Floating orbs */}
            <div className="absolute top-[20%] left-[25%] w-4 h-4 rounded-full bg-pink-500/40 blur-sm animate-pulse" />
            <div className="absolute top-[35%] right-[20%] w-3 h-3 rounded-full bg-yellow-400/50 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-[60%] left-[15%] w-2 h-2 rounded-full bg-green-400/40 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[45%] right-[30%] w-3 h-3 rounded-full bg-cyan-400/50 blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 h-full overflow-y-auto p-2 sm:p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-full sm:w-auto">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">Phoneme Studio</p>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Phonics Sounds · Letters Only</h3>
                  <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">Watch the animated letter stage while Coach Dorothy speaks every letter sound.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={handleStart} 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-500 text-white font-medium text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden xs:inline">Start</span>
                  </Button>
                  <Button 
                    onClick={handlePause} 
                    size="sm" 
                    className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                    <span className="hidden xs:inline">{isPlaying ? 'Pause' : 'Continue'}</span>
                  </Button>
                  <Button 
                    onClick={handleShuffleHead} 
                    size="sm" 
                    className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm px-2 sm:px-3 hidden sm:flex"
                  >
                    <Shuffle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden md:inline">Shuffle head</span>
                  </Button>
                  <Button 
                    onClick={handleRestart} 
                    size="sm" 
                    className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1">Restart</span>
                  </Button>
                  <Button 
                    onClick={toggleMute} 
                    size="sm" 
                    className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                  <Button 
                    onClick={handleClose} 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline ml-1">Close</span>
                  </Button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                {/* Left: Letter Display */}
                <div className="bg-slate-800/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-600/50 backdrop-blur-sm">
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                    {/* Animated Head */}
                    <div className={cn(
                      "relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl md:text-6xl font-bold text-white shadow-2xl transition-all duration-300 shrink-0",
                      `bg-gradient-to-br ${getHeadGradient()}`,
                      isPlaying && "animate-pulse scale-105"
                    )}>
                      {currentLetter}
                      {/* Eyes */}
                      <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4">
                        <div className="w-1.5 h-2.5 sm:w-2 sm:h-3 md:w-2.5 md:h-4 bg-slate-900 rounded-full" />
                        <div className="w-1.5 h-2.5 sm:w-2 sm:h-3 md:w-2.5 md:h-4 bg-slate-900 rounded-full" />
                      </div>
                      {/* Mouth */}
                      <div className={cn(
                        "absolute bottom-4 sm:bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/80 rounded-full transition-all duration-150",
                        isPlaying ? "w-6 h-3 sm:w-8 sm:h-4 md:w-10 md:h-5" : "w-5 h-2 sm:w-6 sm:h-2.5 md:w-8 md:h-3"
                      )} />
                      {/* Star accessory */}
                      <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 text-lg sm:text-xl md:text-2xl animate-bounce">⭐</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{currentLetter} / {currentLetter.toLowerCase()}</p>
                      <p className="text-xs sm:text-sm md:text-base text-slate-300">Focus on the main sound of this letter.</p>
                      <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 mt-0.5 sm:mt-1 hidden sm:block">Stay relaxed and wait for the next letter.</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex-1 h-2 sm:h-2.5 md:h-3 rounded-full bg-slate-700 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs md:text-sm text-slate-300 font-mono min-w-[40px] sm:min-w-[50px]">{formatTime(elapsedTime)}</span>
                    </div>
                  </div>

                  {/* Audio Phase Indicator */}
                  <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">Phase:</span>
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      <span className={cn(
                        "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase transition-all duration-300",
                        audioPhase === 'call' 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 sm:scale-110" 
                          : "bg-slate-700 text-slate-400"
                      )}>
                        📢 <span className="hidden xs:inline">Call</span>
                      </span>
                      <span className={cn(
                        "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase transition-all duration-300",
                        audioPhase === 'repeat' 
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 sm:scale-110" 
                          : "bg-slate-700 text-slate-400"
                      )}>
                        🔁 <span className="hidden xs:inline">Repeat</span>
                      </span>
                      <span className={cn(
                        "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase transition-all duration-300",
                        audioPhase === 'recap' 
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105 sm:scale-110" 
                          : "bg-slate-700 text-slate-400"
                      )}>
                        🎯 <span className="hidden xs:inline">Recap</span>
                      </span>
                    </div>
                  </div>

                  {/* Current Letter Info with Animation - entire group moves together */}
                  <div className="bg-gradient-to-r from-slate-700/60 to-purple-900/40 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-slate-600/30 overflow-hidden">
                    <div className={cn(
                      "flex items-center gap-3 sm:gap-4 md:gap-5 transition-transform",
                      isPlaying && "animate-letter-group-move"
                    )}>
                      <div className="text-4xl sm:text-5xl md:text-6xl shrink-0">
                        <span className="inline-block">
                          {currentData.emoji}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{currentLetter}</p>
                        <p className="text-sm sm:text-base md:text-lg text-slate-300">{currentData.word}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Letter Grid - Grouped by segments */}
                <div className="bg-slate-800/70 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border border-slate-600/50 backdrop-blur-sm">
                  <div className="space-y-2 sm:space-y-3">
                    {LETTER_SEGMENTS.map((segment, segIdx) => (
                      <div key={segIdx}>
                        <p className="text-[10px] sm:text-xs text-slate-400 mb-1 sm:mb-2 font-medium">{segment.label}</p>
                        <div className="flex gap-1 sm:gap-1.5 md:gap-2 flex-wrap">
                          {segment.letters.map((letter) => {
                            const isCompleted = completedLetters.has(letter);
                            const isCurrent = letter === currentLetter;
                            const isVowel = 'AEIOU'.includes(letter);
                            
                            return (
                              <button
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                className={cn(
                                  "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex flex-col items-center justify-center font-bold transition-all duration-200",
                                  "border-2 hover:scale-105 sm:hover:scale-110 hover:shadow-lg active:scale-95",
                                  isCurrent 
                                    ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 scale-105 sm:scale-110 shadow-xl ring-2 ring-blue-400/50 text-white" 
                                    : isCompleted
                                      ? isVowel 
                                        ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white"
                                        : "bg-gradient-to-br from-amber-600 to-orange-600 border-amber-500 text-white"
                                      : "bg-slate-700/60 border-slate-600/50 text-slate-400 hover:text-white hover:border-slate-500"
                                )}
                              >
                                <span className="text-sm sm:text-base md:text-lg">{letter}</span>
                                <span className="text-[7px] sm:text-[8px] md:text-[9px] opacity-70">{letter.toLowerCase()}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-green-500 to-green-600" />
                      <span className="text-[10px] sm:text-xs text-slate-400">Vowels</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-amber-600 to-orange-600" />
                      <span className="text-[10px] sm:text-xs text-slate-400">Consonants</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-blue-400/50" />
                      <span className="text-[10px] sm:text-xs text-slate-400">Current</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Celebration Overlay */}
              {showMilestone && currentMilestone && (
                <div className={cn(
                  "rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-500/50 backdrop-blur-sm animate-scale-in",
                  `bg-gradient-to-b ${MILESTONE_COLORS[currentMilestone.id]?.bg || 'from-slate-800 to-slate-900'}`
                )}>
                  {/* Milestone Banner */}
                  <div className={cn(
                    "inline-block px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-white font-bold uppercase tracking-wider sm:tracking-widest text-xs sm:text-sm mb-4 sm:mb-6",
                    MILESTONE_COLORS[currentMilestone.id]?.banner
                  )}>
                    {currentMilestone.label}
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 md:gap-8">
                    <div className="flex-1">
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                        {currentMilestone.label}
                      </h4>
                      <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-2 sm:mb-4">{currentMilestone.body}</p>
                      <p className="text-xs sm:text-sm md:text-base text-slate-300">
                        {countdown > 0 
                          ? "Hold this pause, breathe calmly, then tap Continue when the countdown reaches zero."
                          : "Pause finished — tap Continue when you are ready."
                        }
                      </p>
                    </div>
                    
                    {/* Countdown Clock */}
                    <div className="flex flex-col items-center mx-auto md:mx-0">
                      <div 
                        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border-4 bg-slate-900/60 shadow-xl"
                        style={{ borderColor: MILESTONE_COLORS[currentMilestone.id]?.clock }}
                      >
                        {/* Circular progress */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-slate-700"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={MILESTONE_COLORS[currentMilestone.id]?.clock}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${(countdown / currentMilestone.seconds) * 283} 283`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <span 
                          className="text-2xl sm:text-3xl md:text-4xl font-bold z-10"
                          style={{ color: MILESTONE_COLORS[currentMilestone.id]?.clock }}
                        >
                          {countdown}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 mt-2 sm:mt-3 text-center max-w-[140px] sm:max-w-[160px]">
                        {countdown > 0 
                          ? `${currentMilestone.seconds} seconds of calm breathing`
                          : "Ready to continue!"
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                    <Button 
                      onClick={handleContinue}
                      disabled={countdown > 0}
                      className={cn(
                        "text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg transition-all",
                        countdown > 0 
                          ? "bg-slate-600 opacity-50 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-green-500/25"
                      )}
                    >
                      {currentMilestone.id === "platinum" ? "Finish & Get Certificate" : `Continue to ${currentMilestone.nextLetter}`}
                    </Button>
                    <Button 
                      onClick={handleClose} 
                      className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Close
                    </Button>
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                    <Button 
                      size="sm" 
                      onClick={handleClose} 
                      className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm"
                    >
                      ← Back to Hub
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 text-xs sm:text-sm"
                    >
                      🏠 Home
                    </Button>
                  </div>
                </div>
              )}

              {/* Certificate Form & Preview */}
              {showCertificate && (
                <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-600/50 backdrop-blur-sm mt-4 sm:mt-6 animate-fade-in">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-4">🏆 Platinum Achievement Complete!</h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 mb-4 sm:mb-6">
                    Enter the learner name (required) plus any optional details to personalise their official NeuroBreath certificate.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {/* Form */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-5">
                      <div>
                        <label className="block text-xs sm:text-sm text-white font-medium mb-1.5 sm:mb-2">Full name *</label>
                        <Input
                          value={certificateName}
                          onChange={(e) => setCertificateName(e.target.value)}
                          placeholder="e.g. Maya Solanke"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">Gender <span className="text-[10px] sm:text-xs">(optional)</span></label>
                        <select className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm sm:text-base">
                          <option>Prefer not to say</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Non-binary</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">Age <span className="text-[10px] sm:text-xs">(optional)</span></label>
                        <Input
                          type="number"
                          placeholder="10"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm sm:text-base"
                        />
                      </div>
                      
                      <p className="text-[10px] sm:text-xs text-slate-500">
                        Only the official NeuroBreath details and the learner's name appear on the certificate.
                      </p>
                      
                      {!showCertificatePreview && (
                        <Button 
                          onClick={handleDesignCertificate}
                          disabled={!certificateName.trim()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          Design certificate
                        </Button>
                      )}
                    </div>
                    
                    {/* Certificate Preview */}
                    {showCertificatePreview && (
                      <div className="overflow-auto max-h-[500px] rounded-xl">
                        <div id="certificate-print-area" className="print-certificate">
                          <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-100 via-amber-50 to-white border-4 border-amber-400 shadow-2xl min-h-[400px]">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-8">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                NB
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">NeuroBreath</p>
                                <p className="text-sm font-bold text-amber-800">Academy</p>
                              </div>
                            </div>
                            
                            {/* Certificate Content */}
                            <div className="text-center mb-8">
                              <p className="text-sm uppercase tracking-widest text-amber-600 mb-2">Certificate of Achievement</p>
                              <h2 className="text-3xl font-bold text-slate-800 mb-1">Platinum Letter</h2>
                              <h2 className="text-3xl font-bold text-slate-800 mb-4">Sound Mastery</h2>
                              <div className="py-4 border-y-2 border-amber-300 my-4">
                                <p className="text-4xl font-bold text-slate-900">{certificateName || "Learner Name"}</p>
                                <p className="text-lg text-amber-700 italic mt-2">Calm Focus Laureate</p>
                              </div>
                            </div>
                            
                            <p className="text-center text-slate-600 mb-8">
                              This certifies that the learner completed the full A–Z phoneme circuit with Platinum mastery, demonstrating calm focus and excellent phonics skills.
                            </p>
                            
                            {/* Certificate Details */}
                            <div className="bg-amber-100/70 rounded-xl p-4 grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-xs uppercase tracking-wide text-amber-600 font-medium">Certificate ID</span>
                                <p className="font-mono font-bold text-slate-800">{certificateId}</p>
                              </div>
                              <div>
                                <span className="text-xs uppercase tracking-wide text-amber-600 font-medium">Issued</span>
                                <p className="font-bold text-slate-800">
                                  {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="mt-8 pt-4 border-t border-amber-200 text-center">
                              <p className="text-xs text-amber-600">www.neurobreath.academy</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {showCertificatePreview && (
                      <Button 
                        onClick={handleDownloadPDF} 
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    )}
                    {showCertificatePreview && (
                      <Button 
                        onClick={handlePrint} 
                        className="bg-green-600 hover:bg-green-500 text-white font-semibold"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print certificate
                      </Button>
                    )}
                    {showCertificatePreview && (
                      <Button 
                        onClick={() => setShowCertificatePreview(false)} 
                        className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit details
                      </Button>
                    )}
                    <Button 
                      onClick={handleClose} 
                      className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Print Styles - A4 single page certificate */}
      <style>{`
        @media print {
          /* Force single page */
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          
          /* Reset and hide everything first */
          *, *::before, *::after {
            visibility: hidden !important;
            position: static !important;
            float: none !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            overflow: hidden !important;
            height: 0 !important;
            width: 0 !important;
            max-height: 0 !important;
            max-width: 0 !important;
            opacity: 0 !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            background: white !important;
          }
          
          /* Show only certificate container and its contents */
          #certificate-print-area,
          #certificate-print-area *,
          #certificate-print-area > div,
          #certificate-print-area > div * {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            height: auto !important;
            width: auto !important;
            max-height: none !important;
            max-width: none !important;
            position: static !important;
            overflow: visible !important;
          }
          
          #certificate-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            padding: 12mm !important;
            margin: 0 !important;
            background: white !important;
            z-index: 999999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          
          #certificate-print-area > div {
            width: 100% !important;
            max-width: 186mm !important;
            height: auto !important;
            max-height: 273mm !important;
            margin: 0 auto !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            background: linear-gradient(to bottom, #fef3c7, #fffbeb, white) !important;
            border: 4px solid #f59e0b !important;
            border-radius: 16px !important;
          }
          
          /* Ensure flex and grid layouts work in certificate */
          #certificate-print-area .flex {
            display: flex !important;
          }
          
          #certificate-print-area .grid {
            display: grid !important;
          }
          
          #certificate-print-area .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          /* Text styling preserved */
          #certificate-print-area p,
          #certificate-print-area h2,
          #certificate-print-area span {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
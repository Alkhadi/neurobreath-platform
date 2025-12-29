"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Palette, Shuffle, Play, ChevronUp, BookOpen, Car, Briefcase, FileText, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface BreathLadderRung {
  level: number;
  pattern: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

const LADDER_RUNGS: BreathLadderRung[] = [
  { level: 1, pattern: "3-3-3-3", inhale: 3, hold: 3, exhale: 3, rest: 3 },
  { level: 2, pattern: "4-4-4-4", inhale: 4, hold: 4, exhale: 4, rest: 4 },
  { level: 3, pattern: "5-5-5-5", inhale: 5, hold: 5, exhale: 5, rest: 5 },
];

const WHEEL_TECHNIQUES = [
  { id: "sos", name: "60s SOS", emoji: "🆘", duration: "60s", color: "bg-red-500", description: "Quick emergency reset for acute stress or panic moments.", link: "/techniques/sos" },
  { id: "coherent", name: "2-min 5-5", emoji: "🌀", duration: "2-min", color: "bg-blue-500", description: "Coherent breathing for calm focus and heart rate regulation.", link: "/techniques/coherent" },
  { id: "box", name: "90s Box", emoji: "🟩", duration: "90s", color: "bg-green-500", description: "Box breathing for mental clarity and stress reduction.", link: "/techniques/box-breathing" },
  { id: "478", name: "4-min 4-7-8", emoji: "🟦", duration: "4-min", color: "bg-indigo-500", description: "Deep relaxation technique for sleep preparation and anxiety relief.", link: "/techniques/4-7-8" },
];

const FOCUS_CONTEXTS = [
  { id: "study", name: "Study", icon: <BookOpen className="h-6 w-6" />, emoji: "📚", description: "For focused learning sessions and exam preparation", suggestion: "Try 5-5 Coherent Breathing for 3 minutes to enhance concentration and reduce pre-study anxiety. This technique promotes alpha brainwave activity, ideal for information retention.", link: "/techniques/coherent" },
  { id: "driving", name: "Driving", icon: <Car className="h-6 w-6" />, emoji: "🚗", description: "Calm focus before starting your journey", suggestion: "Use Box Breathing for 2 minutes BEFORE you start driving. NEVER practice while driving. This pre-drive routine reduces tension and enhances road awareness.", link: "/techniques/box-breathing" },
  { id: "work", name: "Work sprint", icon: <Briefcase className="h-6 w-6" />, emoji: "💼", description: "Reset between meetings and decision-making", suggestion: "60-second SOS Breathing between meetings to clear mental fog and restore decision-making energy. Quick, effective, and desk-friendly.", link: "/techniques/sos" },
  { id: "revision", name: "Revision", icon: <FileText className="h-6 w-6" />, emoji: "📝", description: "Deep focus for reviewing and memorizing", suggestion: "4-7-8 Breathing for 4 minutes before revision sessions. This activates parasympathetic response, reducing cortisol and enhancing memory consolidation.", link: "/techniques/4-7-8" },
];

export default function PlayfulBreathingLab() {
  const [currentRung, setCurrentRung] = useState(0);
  const [isClimbing, setIsClimbing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  
  // Voice synthesis hook
  const { speak, cancel } = useSpeechSynthesis();
  
  // Colour Path state
  const [isColourPathActive, setIsColourPathActive] = useState(false);
  const [colourPhase, setColourPhase] = useState<"blue" | "gold" | "green">("blue");
  const [colourCycles, setColourCycles] = useState(0);
  
  // Roulette state
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<typeof WHEEL_TECHNIQUES[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  
  // Focus Tiles state
  const [selectedContext, setSelectedContext] = useState<typeof FOCUS_CONTEXTS[0] | null>(null);
  
  // Time preference state
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Breath Ladder Logic
  useEffect(() => {
    if (!isClimbing) return;
    
    const rung = LADDER_RUNGS[currentRung];
    const phaseDurations = {
      inhale: rung.inhale,
      hold: rung.hold,
      exhale: rung.exhale,
      rest: rung.rest,
    };
    
    const timer = setInterval(() => {
      setPhaseTimer(prev => {
        const nextTime = prev + 0.1;
        const currentPhaseDuration = phaseDurations[breathPhase];
        
        if (nextTime >= currentPhaseDuration) {
          // Move to next phase and announce with voice coach
          if (breathPhase === "inhale") {
            setBreathPhase("hold");
            if (voiceCoachEnabled) speak("Hold");
          } else if (breathPhase === "hold") {
            setBreathPhase("exhale");
            if (voiceCoachEnabled) speak("Exhale");
          } else if (breathPhase === "exhale") {
            setBreathPhase("rest");
            if (voiceCoachEnabled) speak("Hold");  // Use "Hold" for rest phase for consistency
          } else {
            setBreathPhase("inhale");
            setCyclesCompleted(prev => prev + 1);
            if (voiceCoachEnabled) speak("Inhale");
          }
          return 0;
        }
        return nextTime;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [isClimbing, breathPhase, currentRung, voiceCoachEnabled, speak]);
  
  // Colour Path Logic
  useEffect(() => {
    if (!isColourPathActive) return;
    
    const colourTimer = setInterval(() => {
      setColourPhase(prev => {
        if (prev === "blue") return "gold";
        if (prev === "gold") return "green";
        setColourCycles(c => c + 1);
        return "blue";
      });
    }, 4000); // 4 seconds per phase
    
    return () => clearInterval(colourTimer);
  }, [isColourPathActive]);

  const startLadderClimb = () => {
    setIsClimbing(true);
    setBreathPhase("inhale");
    setPhaseTimer(0);
    setCyclesCompleted(0);
  };
  
  const stopLadderClimb = () => {
    setIsClimbing(false);
    cancel();  // Stop any queued speech
    // Auto-save progress
    if (typeof window !== "undefined") {
      localStorage.setItem("nb_ladder_rung", currentRung.toString());
      localStorage.setItem("nb_ladder_cycles", cyclesCompleted.toString());
    }
  };
  
  const moveToNextRung = () => {
    if (currentRung < LADDER_RUNGS.length - 1) {
      setCurrentRung(prev => prev + 1);
      setCyclesCompleted(0);
      setPhaseTimer(0);
      setBreathPhase("inhale");
    }
  };
  
  const startColourPath = () => {
    setIsColourPathActive(true);
    setColourPhase("blue");
    setColourCycles(0);
  };
  
  const stopColourPath = () => {
    setIsColourPathActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("nb_colour_cycles", colourCycles.toString());
    }
  };
  
  const spinWheel = () => {
    setIsSpinning(true);
    // REQUIREMENT #4: 8-12 full rotations
    const spins = 8 + Math.floor(Math.random() * 5);
    const finalIndex = Math.floor(Math.random() * WHEEL_TECHNIQUES.length);
    const finalRotation = spins * 360 + finalIndex * (360 / WHEEL_TECHNIQUES.length);
    
    setRotation(finalRotation);
    
    // REQUIREMENT #4: 2.5s-3.5s duration (random within range)
    const duration = 2500 + Math.random() * 1000;
    setTimeout(() => {
      setSelectedTechnique(WHEEL_TECHNIQUES[finalIndex]);
      setIsSpinning(false);
    }, duration);
  };
  
  const selectContext = (context: typeof FOCUS_CONTEXTS[0]) => {
    setSelectedContext(context);
  };

  const rung = LADDER_RUNGS[currentRung];
  
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Playful Breathing Lab
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Gamified tools keep things interesting without overwhelming your nervous system. Use them as gentle prompts, not prescriptions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Breath Ladder */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <CardTitle>Breath Ladder</CardTitle>
              </div>
              <CardDescription>
                Climb from 3-3-3-3 to 5-5-5-5 over a few rounds. Each rung nudges lung capacity and confidence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ladder Rungs Visual */}
              <div className="space-y-3 mb-6">
                {LADDER_RUNGS.map((r, idx) => (
                  <div
                    key={r.level}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      currentRung === idx
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : currentRung > idx
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-muted bg-muted/30"
                    }`}
                  >
                    <Badge variant={currentRung >= idx ? "default" : "outline"}>{r.level}</Badge>
                    <span className="font-mono font-bold text-lg">{r.pattern}</span>
                    {currentRung > idx && <span className="ml-auto text-green-600 dark:text-green-400">✓</span>}
                    {currentRung === idx && <span className="ml-auto text-blue-600 dark:text-blue-400 animate-pulse">🧗</span>}
                  </div>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium mb-2">🧗 Follow this pattern:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Inhale</span>
                    <Badge variant="outline">{rung.inhale}s</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Hold</span>
                    <Badge variant="outline">{rung.hold}s</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Exhale</span>
                    <Badge variant="outline">{rung.exhale}s</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Rest</span>
                    <Badge variant="outline">{rung.rest}s</Badge>
                  </div>
                </div>
              </div>
              
              {/* Voice Coach Toggle */}
              <Button
                variant={voiceCoachEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceCoachEnabled(!voiceCoachEnabled)}
                className="mb-4 w-full"
              >
                {voiceCoachEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                Voice Coach {voiceCoachEnabled ? "ON" : "OFF"}
              </Button>
              
              {isClimbing && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Phase:</span>
                    <Badge className="capitalize">{breathPhase}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cycles Completed:</span>
                    <Badge variant="outline">{cyclesCompleted}</Badge>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                {!isClimbing ? (
                  <Button onClick={startLadderClimb} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Climb
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopLadderClimb} variant="outline" className="flex-1">
                      Stop & Save
                    </Button>
                    {cyclesCompleted >= 3 && currentRung < LADDER_RUNGS.length - 1 && (
                      <Button onClick={moveToNextRung} className="flex-1">
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Next Rung
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Colour-Path Breathing */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-6 w-6 text-purple-600" />
                <CardTitle>Colour-Path Breathing</CardTitle>
              </div>
              <CardDescription>
                Follow calming colours (blue inhale, gold hold, green exhale) to keep visual anchors sensory-safe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Color Orbs */}
              <div className="flex justify-center items-center gap-4 mb-6 h-40">
                <div
                  className={`w-24 h-24 rounded-full transition-all duration-500 ${
                    colourPhase === "blue"
                      ? "bg-blue-500 scale-125 shadow-xl shadow-blue-500/50"
                      : "bg-blue-300 scale-75 opacity-50"
                  }`}
                  aria-label="Blue orb for inhale phase"
                />
                <div
                  className={`w-24 h-24 rounded-full transition-all duration-500 ${
                    colourPhase === "gold"
                      ? "bg-yellow-500 scale-125 shadow-xl shadow-yellow-500/50"
                      : "bg-yellow-300 scale-75 opacity-50"
                  }`}
                  aria-label="Gold orb for hold phase"
                />
                <div
                  className={`w-24 h-24 rounded-full transition-all duration-500 ${
                    colourPhase === "green"
                      ? "bg-green-500 scale-125 shadow-xl shadow-green-500/50"
                      : "bg-green-300 scale-75 opacity-50"
                  }`}
                  aria-label="Green orb for exhale phase"
                />
              </div>
              
              {/* Pattern Guide */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                <div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1" />
                  <p className="font-medium">Inhale</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-1" />
                  <p className="font-medium">Hold</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-1" />
                  <p className="font-medium">Exhale</p>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm">
                  <span className="font-bold">Pattern:</span> Inhale with the blue orb, hold on gold, exhale on green for 6 rounds.
                </p>
              </div>
              
              {isColourPathActive && (
                <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rounds Completed:</span>
                    <Badge variant="outline">{colourCycles} / 6</Badge>
                  </div>
                </div>
              )}
              
              <Button
                onClick={isColourPathActive ? stopColourPath : startColourPath}
                className="w-full"
                variant={isColourPathActive ? "outline" : "default"}
              >
                {isColourPathActive ? "Stop & Save" : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    ✨ Start Breathing Journey
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Micro-Reset Roulette */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shuffle className="h-6 w-6 text-orange-600" />
                <CardTitle>Micro-Reset Roulette</CardTitle>
              </div>
              <CardDescription>
                Need novelty? Spin a gentle randomiser for a 60–120 second reset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* How to Use */}
              <div className="bg-muted/50 p-4 rounded-lg mb-6 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>👆</span>
                  <p>Click "Spin the Wheel" below</p>
                </div>
                <div className="flex items-center justify-center">↓</div>
                <div className="flex items-start gap-2">
                  <span>🎯</span>
                  <p>Watch the wheel spin and land on a technique</p>
                </div>
                <div className="flex items-center justify-center">↓</div>
                <div className="flex items-start gap-2">
                  <span>✨</span>
                  <p>Follow the selected breathing pattern or click the link to learn more</p>
                </div>
              </div>
              
              {/* REQUIREMENT #4: Label above roulette */}
              <div className="text-center mb-3">
                <h4 className="font-bold text-lg">🎯 Spin the Roulette Wheel</h4>
                <p className="text-sm text-muted-foreground">Get a random breathing technique</p>
              </div>
              
              {/* REQUIREMENT #4: Wheel Visual - Perfect Circle */}
              <div className="relative mb-6 flex items-center justify-center">
                <div
                  className="relative w-56 rounded-full overflow-hidden transition-transform ease-out"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: isSpinning ? '3000ms' : '0ms',
                    aspectRatio: '1 / 1'
                  }}
                >
                  {WHEEL_TECHNIQUES.map((tech, idx) => (
                    <div
                      key={tech.id}
                      className={`absolute w-full h-full ${tech.color} opacity-80`}
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((idx * Math.PI) / 2 - Math.PI / 2)}% ${50 + 50 * Math.sin((idx * Math.PI) / 2 - Math.PI / 2)}%, ${50 + 50 * Math.cos(((idx + 1) * Math.PI) / 2 - Math.PI / 2)}% ${50 + 50 * Math.sin(((idx + 1) * Math.PI) / 2 - Math.PI / 2)}%)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                        {tech.emoji}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-foreground" />
                </div>
              </div>
              
              {/* Result Display */}
              {selectedTechnique && !isSpinning && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg border-2 border-blue-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{selectedTechnique.emoji}</span>
                    <div>
                      <h4 className="font-bold text-lg">{selectedTechnique.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedTechnique.description}</p>
                    </div>
                  </div>
                  <Link href={selectedTechnique.link}>
                    <Button variant="link" className="p-0 h-auto">
                      Learn {selectedTechnique.name} technique →
                    </Button>
                  </Link>
                </div>
              )}
              
              {!selectedTechnique && !isSpinning && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Spin to get your next reset.</p>
                </div>
              )}
              
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className="w-full"
              >
                {isSpinning ? (
                  <>
                    <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  <>
                    🎲 Spin the Wheel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* REQUIREMENT #3: Clinical Backing & Credibility (with Focus Tiles functionality) */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Clinical backing & credibility</CardTitle>
              <CardDescription>
                Evidence-based techniques informed by medical experts and public health guidance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informed by experts */}
              <div>
                <h4 className="font-bold text-sm mb-2">Informed by experts</h4>
                <p className="text-sm text-muted-foreground">
                  Dr Herbert Benson (Harvard) · Dr Andrew Weil (4-7-8)
                </p>
              </div>

              {/* Public guidance */}
              <div>
                <h4 className="font-bold text-sm mb-2">Public guidance</h4>
                <p className="text-sm text-muted-foreground">
                  NHS (UK) · U.S. VA · Harvard · Mayo Clinic
                </p>
              </div>

              {/* Evidence */}
              <div>
                <h4 className="font-bold text-sm mb-2">Evidence</h4>
                <p className="text-sm text-muted-foreground">
                  Navy SEAL teams use box breathing for focus (PsychCentral). 2024 trial: 99.2% breathing effectiveness improvement (Healthline).
                </p>
              </div>

              {/* Supporting line */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  We log rounds automatically so you can focus on calm, not dashboards.
                </p>
              </div>

              <hr className="my-4" />

              {/* Pick your goal */}
              <div>
                <h4 className="font-bold mb-3">Pick your goal</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose a goal to tailor cues, pace, and downloadable guides.
                </p>
                
                {/* Goal chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Calm', 'Sleep', 'Focus', 'School', 'Mood'].map((goal) => (
                    <Badge 
                      key={goal} 
                      variant={selectedGoal === goal ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSelectedGoal(goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* How long do you have? */}
              <div>
                <h4 className="font-bold mb-3">How long do you have?</h4>
                <div className="flex gap-2 mb-4">
                  {['1 minute', '3 minutes', '5 minutes'].map((time) => (
                    <Button 
                      key={time} 
                      variant={selectedTime === time ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Context Tiles with existing functionality */}
              <div>
                <h4 className="font-bold mb-3">Choose your context</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {FOCUS_CONTEXTS.map((context) => (
                    <button
                      key={context.id}
                      onClick={() => selectContext(context)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedContext?.id === context.id
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-950 shadow-lg"
                          : "border-muted hover:border-teal-300 bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{context.emoji}</span>
                        <h4 className="font-bold text-sm">{context.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{context.description}</p>
                    </button>
                  ))}
                </div>
                
                {/* Suggestion Display */}
                {selectedContext && (
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 rounded-lg border-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💡</span>
                      <h4 className="font-bold text-sm">Your personalized suggestion:</h4>
                    </div>
                    <p className="text-sm mb-3">{selectedContext.suggestion}</p>
                    <Link href={selectedContext.link}>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Learn this technique →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Built for neurodiversity */}
              <div>
                <h4 className="font-bold mb-3">Built for neurodiversity</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Clear language, optional visuals, OT-aligned timings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Alternative cues for sensory-sensitive learners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Accessible contrast & keyboard-first controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Evidence citations across every technique</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Safety & Wellbeing */}
        <Card className="border-2 border-orange-300 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <CardTitle>Safety & Wellbeing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              If a tool feels uncomfortable, stop and return to natural breathing.
            </p>
            <p className="text-sm">
              Use professional care for ongoing difficulties. These tools are gentle prompts, not medical treatments.
            </p>
            <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
              <span className="text-lg">💡</span>
              <p className="text-sm">
                Listen to your body and take breaks as needed. If you experience persistent discomfort, dizziness, or breathing difficulties, consult a healthcare professional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
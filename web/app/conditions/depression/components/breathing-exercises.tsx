'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Wind, Play, Pause, RotateCcw, Activity } from 'lucide-react';

type Exercise = {
  id: string;
  name: string;
  description: string;
  pattern: { phase: string; duration: number; instruction: string }[];
  totalDuration: number;
};

const exercises: Exercise[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal 4-second intervals for calm and focus',
    pattern: [
      { phase: 'Inhale', duration: 4, instruction: 'Breathe in through your nose' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath' },
      { phase: 'Exhale', duration: 4, instruction: 'Breathe out through your mouth' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath' },
    ],
    totalDuration: 16,
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Dr. Weil\'s technique for relaxation and sleep',
    pattern: [
      { phase: 'Inhale', duration: 4, instruction: 'Breathe in quietly through your nose' },
      { phase: 'Hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'Exhale', duration: 8, instruction: 'Exhale completely through your mouth' },
    ],
    totalDuration: 19,
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing (5-5)',
    description: '5-second inhale and exhale for heart-rate variability',
    pattern: [
      { phase: 'Inhale', duration: 5, instruction: 'Breathe in slowly through your nose' },
      { phase: 'Exhale', duration: 5, instruction: 'Breathe out slowly through your nose' },
    ],
    totalDuration: 10,
  },
  {
    id: 'sos',
    name: '60-Second SOS',
    description: 'Quick reset for acute stress',
    pattern: [
      { phase: 'Inhale', duration: 3, instruction: 'Quick breath in' },
      { phase: 'Exhale', duration: 7, instruction: 'Long breath out' },
    ],
    totalDuration: 10,
  },
];

export function BreathingExercises() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises?.[0] ?? exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [stats, setStats] = useState({ sessions: 0, totalMinutes: 0, lastUsed: '' });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage?.getItem('breathingStats');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setStats(parsed ?? { sessions: 0, totalMinutes: 0, lastUsed: '' });
        } catch (e) {
          console.error('Failed to parse breathing stats', e);
        }
      }
    }
  }, []);

  // Save stats to localStorage
  const saveStats = (newStats: typeof stats) => {
    if (typeof window !== 'undefined') {
      localStorage?.setItem('breathingStats', JSON.stringify(newStats));
      setStats(newStats);
    }
  };

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeInPhase((prev) => {
          const currentPattern = selectedExercise?.pattern?.[currentPhase];
          const phaseDuration = currentPattern?.duration ?? 0;
          
          if (prev >= phaseDuration - 1) {
            // Move to next phase
            const nextPhase = (currentPhase + 1) % (selectedExercise?.pattern?.length ?? 1);
            setCurrentPhase(nextPhase);
            return 0;
          }
          return prev + 1;
        });
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef?.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef?.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, currentPhase, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    if (sessionTime > 0) {
      const minutes = Math.floor(sessionTime / 60);
      const newStats = {
        sessions: (stats?.sessions ?? 0) + 1,
        totalMinutes: (stats?.totalMinutes ?? 0) + minutes,
        lastUsed: new Date().toLocaleDateString(),
      };
      saveStats(newStats);
    }
    setCurrentPhase(0);
    setTimeInPhase(0);
    setSessionTime(0);
  };

  const currentPattern = selectedExercise?.pattern?.[currentPhase];
  const progress = currentPattern ? ((timeInPhase / (currentPattern?.duration ?? 1)) * 100) : 0;

  return (
    <motion.section
      id="breathing"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Breathing Exercises</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Controlled breathing activates the parasympathetic nervous system, reducing stress and promoting calm
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center shadow-md">
          <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">{stats?.sessions ?? 0}</p>
          <p className="text-sm text-blue-700">Sessions</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center shadow-md">
          <Wind className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-900">{stats?.totalMinutes ?? 0}</p>
          <p className="text-sm text-purple-700">Minutes</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center shadow-md">
          <RotateCcw className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-900">{stats?.lastUsed || 'Never'}</p>
          <p className="text-sm text-green-700">Last Used</p>
        </div>
      </div>

      {/* Exercise Selection */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {exercises?.map?.((exercise) => (
          <button
            key={exercise?.id}
            onClick={() => {
              setSelectedExercise(exercise);
              handleStop();
            }}
            className={`text-left p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
              selectedExercise?.id === exercise?.id
                ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <h3 className={`font-bold mb-1 ${selectedExercise?.id === exercise?.id ? 'text-white' : 'text-gray-900'}`}>
              {exercise?.name}
            </h3>
            <p className={`text-sm ${selectedExercise?.id === exercise?.id ? 'text-blue-100' : 'text-gray-600'}`}>
              {exercise?.description}
            </p>
          </button>
        )) ?? null}
      </div>

      {/* Breathing Circle */}
      <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <motion.div
              animate={{
                scale: isActive && currentPattern?.phase === 'Inhale' ? [1, 1.3] : isActive && currentPattern?.phase === 'Exhale' ? [1.3, 1] : 1,
              }}
              transition={{
                duration: currentPattern?.duration ?? 1,
                ease: 'easeInOut',
              }}
              className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm"
            />
            <div className="absolute w-32 h-32 rounded-full bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
              <p className="text-2xl font-bold text-gray-900">{currentPattern?.phase ?? 'Ready'}</p>
              <p className="text-4xl font-bold text-primary">
                {currentPattern ? (currentPattern?.duration ?? 0) - timeInPhase : selectedExercise?.totalDuration ?? 0}
              </p>
            </div>
          </div>

          {/* Instruction */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-center text-gray-700 font-medium"
            >
              {currentPattern?.instruction ?? 'Press Start to begin'}
            </motion.p>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Session Time */}
          <p className="text-sm text-gray-600">
            Session: {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}
          </p>

          {/* Controls */}
          <div className="flex space-x-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300"
              >
                <Play size={20} />
                <span>Start</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={handleStop}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-300"
            >
              <RotateCcw size={20} />
              <span>Stop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Why Breathing Exercises Help</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Activates vagal tone:</span> Stimulates the vagus nerve, promoting relaxation</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Reduces cortisol:</span> Lowers stress hormone levels</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Improves HRV:</span> Enhances heart rate variability for better stress resilience</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Anchors attention:</span> Breaks rumination cycles common in depression</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

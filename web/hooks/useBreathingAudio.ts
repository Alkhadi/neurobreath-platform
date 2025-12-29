import { useRef, useCallback, useEffect, useState } from 'react';

// Breathing pattern audio files
export const BREATHING_AUDIO_FILES = {
  box: '/audio/box-breathing-instructions.mp3',
  '4-7-8': '/audio/4-7-8-instructions.mp3',
  coherent: '/audio/coherent-instructions.mp3',
  sos: '/audio/sos-instructions.mp3',
};

export type BreathingPattern = 'box' | '4-7-8' | 'coherent' | 'sos';

// Precise timing for each breathing pattern
export interface BreathingPhase {
  name: string;
  duration: number; // seconds
}

export const BREATHING_PATTERNS: Record<BreathingPattern, {
  name: string;
  phases: BreathingPhase[];
  cycleTime: number; // total seconds per cycle
  description: string;
}> = {
  box: {
    name: 'Box Breathing',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
    cycleTime: 16,
    description: 'Equal 4-4-4-4 timing for all phases. Great for focus and calm.'
  },
  '4-7-8': {
    name: '4-7-8 Breathing',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
    cycleTime: 19,
    description: 'Extended hold and exhale for deep relaxation. 4s inhale, 7s hold, 8s exhale.'
  },
  coherent: {
    name: 'Coherent 5-5',
    phases: [
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 },
    ],
    cycleTime: 10,
    description: 'Simple 5-5 pattern. Inhale and exhale equally for heart rate variability.'
  },
  sos: {
    name: 'SOS 60s Reset',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale', duration: 6 },
    ],
    cycleTime: 10,
    description: '60-second reset. 4s inhale, 6s exhale. Quick calm for transitions.'
  },
};

// Hook for playing breathing instruction audio
export function useBreathingAudio() {
  const instructionAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<BreathingPattern>('box');

  // Initialize audio element
  useEffect(() => {
    return () => {
      if (instructionAudioRef.current) {
        instructionAudioRef.current.pause();
        instructionAudioRef.current = null;
      }
    };
  }, []);

  // Play instruction audio for a specific pattern
  const playInstructions = useCallback((pattern: BreathingPattern, loop: boolean = true) => {
    // Stop any existing audio
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
    }

    // Create new audio element
    const audio = new Audio(BREATHING_AUDIO_FILES[pattern]);
    audio.loop = loop;
    audio.preload = 'auto';
    audio.volume = 0.7; // Slightly quieter for background guidance

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    instructionAudioRef.current = audio;
    setCurrentPattern(pattern);

    // Start playing
    audio.play().catch((err) => {
      console.error('Failed to play breathing instructions:', err);
      setIsPlaying(false);
    });
  }, []);

  // Stop instruction audio
  const stopInstructions = useCallback(() => {
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
      instructionAudioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Pause instruction audio (can be resumed)
  const pauseInstructions = useCallback(() => {
    if (instructionAudioRef.current) {
      instructionAudioRef.current.pause();
    }
  }, []);

  // Resume instruction audio
  const resumeInstructions = useCallback(() => {
    if (instructionAudioRef.current) {
      instructionAudioRef.current.play().catch((err) => {
        console.error('Failed to resume breathing instructions:', err);
      });
    }
  }, []);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (instructionAudioRef.current) {
      instructionAudioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Get audio element for advanced control
  const getAudioElement = useCallback(() => instructionAudioRef.current, []);

  return {
    playInstructions,
    stopInstructions,
    pauseInstructions,
    resumeInstructions,
    setVolume,
    isPlaying,
    currentPattern,
    getAudioElement,
  };
}

// Enhanced ambient sound generators with better quality
export interface AmbientSound {
  id: string;
  name: string;
  emoji: string;
  volume: number; // default volume
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'none', name: 'None', emoji: '🔇', volume: 0 },
  { id: 'cosmic', name: 'Cosmic', emoji: '🌌', volume: 0.15 },
  { id: 'rain', name: 'Gentle Rain', emoji: '🌧️', volume: 0.15 },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', volume: 0.12 },
  { id: 'birds', name: 'Nature Birds', emoji: '🐦', volume: 0.15 },
  { id: 'forest', name: 'Forest Stream', emoji: '🌲', volume: 0.18 },
  { id: 'fire', name: 'Crackling Fire', emoji: '🔥', volume: 0.14 },
  { id: 'tibetan', name: 'Tibetan Bowls', emoji: '🎵', volume: 0.16 },
  { id: 'meditation', name: 'Meditation', emoji: '🧘', volume: 0.15 },
  { id: 'spiritual', name: 'Spiritual', emoji: '✨', volume: 0.14 },
  { id: 'wind', name: 'Wind Chimes', emoji: '🎐', volume: 0.13 },
];

// Create enhanced ambient sound generators with spiritual/meditation sounds
export function createEnhancedAmbientSounds(audioContext: AudioContext) {
  
  // Helper to create noise buffer
  const createNoiseBuffer = (type: 'white' | 'pink' | 'brown'): AudioBuffer => {
    const bufferSize = audioContext.sampleRate * 2
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      
      if (type === 'white') {
        output[i] = white * 0.5
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      } else {
        output[i] = (b0 = (b0 + (0.02 * white)) / 1.02) * 3.5
      }
    }
    return buffer
  }

  const createCosmicSound = (gainNode: GainNode) => {
    const sources: AudioScheduledSourceNode[] = [];
    
    // Deep space ambient drone with multiple harmonics
    const frequencies = [60, 90, 120, 180];
    const gains = [0.15, 0.1, 0.08, 0.05];
    
    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      osc.type = i < 3 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      const oscGain = audioContext.createGain();
      oscGain.gain.value = gains[i];
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      sources.push(osc);
    });
    
    return sources;
  };

  const createRainSound = (gainNode: GainNode) => {
    // Multi-layered rain effect
    const sources: AudioScheduledSourceNode[] = [];

    // White noise for main rain
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter for rain character
    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200;
    bandpass.Q.value = 0.4;

    // Lowpass for softness
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3000;

    whiteNoise.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gainNode);
    whiteNoise.start();

    sources.push(whiteNoise);
    return sources;
  };

  const createOceanSound = (gainNode: GainNode) => {
    const sources: AudioScheduledSourceNode[] = [];

    // Low frequency wave oscillation
    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08; // Slow wave rhythm

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 400;

    const carrier = audioContext.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = 80;

    lfo.connect(lfoGain);
    lfoGain.connect(carrier.frequency);

    // Add noise for wave texture
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter for ocean character
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 600;

    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = 0.3;

    carrier.connect(gainNode);
    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(gainNode);

    lfo.start();
    carrier.start();
    noise.start();

    sources.push(lfo, carrier, noise);
    return sources;
  };

  const createForestSound = (gainNode: GainNode) => {
    const sources: OscillatorNode[] = [];

    // Enhanced bird chirps with variety
    const chirp = () => {
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      // More varied bird frequencies
      const frequencies = [600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
      osc.frequency.value = frequencies[Math.floor(Math.random() * frequencies.length)];

      const envelope = audioContext.createGain();
      envelope.gain.value = 0;
      // Natural chirp envelope
      envelope.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
      envelope.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1 + Math.random() * 0.3);

      osc.connect(envelope);
      envelope.connect(gainNode);

      osc.start();
      osc.stop(audioContext.currentTime + 0.4);

      // Random intervals for natural feel
      setTimeout(chirp, 800 + Math.random() * 3200);
    };

    // Start multiple chirp sequences
    chirp();
    setTimeout(chirp, 1500);

    return sources;
  };

  const createFireSound = (gainNode: GainNode) => {
    const sources: AudioScheduledSourceNode[] = [];

    // Crackling fire effect
    const bufferSize = audioContext.sampleRate * 0.5;
    const crackleBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = crackleBuffer.getChannelData(0);

    // Create crackling pattern
    for (let i = 0; i < bufferSize; i++) {
      const random = Math.random();
      output[i] = random > 0.95 ? (Math.random() * 2 - 1) * 0.5 : 0;
    }

    const crackle = audioContext.createBufferSource();
    crackle.buffer = crackleBuffer;
    crackle.loop = true;

    // Low frequency rumble
    const rumble = audioContext.createOscillator();
    rumble.type = 'sine';
    rumble.frequency.value = 60;

    const rumbleGain = audioContext.createGain();
    rumbleGain.gain.value = 0.3;

    // Filter for warmth
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1200;

    crackle.connect(lowpass);
    lowpass.connect(gainNode);
    rumble.connect(rumbleGain);
    rumbleGain.connect(gainNode);

    crackle.start();
    rumble.start();

    sources.push(crackle, rumble);
    return sources;
  };

  const createBowlSound = (gainNode: GainNode) => {
    const sources: OscillatorNode[] = [];

    // Enhanced singing bowl with harmonics
    const fundamentals = [220, 330, 440, 550]; // More harmonics
    fundamentals.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const oscGain = audioContext.createGain();
      oscGain.gain.value = 0.25 / (i + 1); // Diminishing harmonics

      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();

      sources.push(osc);
    });

    return sources;
  };

  const createBirdsSound = (gainNode: GainNode) => {
    const sources: AudioScheduledSourceNode[] = [];
    
    // High frequency chirps
    const frequencies = [2000, 2500, 3000];
    const gains = [0.02, 0.015, 0.01];
    
    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      osc.type = i < 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      const oscGain = audioContext.createGain();
      oscGain.gain.value = gains[i];
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      sources.push(osc);
    });
    
    // Background rustling with pink noise
    const noiseBuffer = createNoiseBuffer('pink');
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const birdFilter = audioContext.createBiquadFilter();
    birdFilter.type = 'highpass';
    birdFilter.frequency.value = 1000;
    
    const birdGain = audioContext.createGain();
    birdGain.gain.value = 0.1;
    
    noise.connect(birdFilter);
    birdFilter.connect(birdGain);
    birdGain.connect(gainNode);
    noise.start();
    
    sources.push(noise);
    return sources;
  };

  const createTibetanSound = (gainNode: GainNode) => {
    const sources: OscillatorNode[] = [];
    
    // Tibetan singing bowls - Solfeggio frequencies
    const frequencies = [174, 285, 396, 528, 639];
    const gains = [0.12, 0.1, 0.08, 0.06, 0.04];
    
    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      osc.type = i < 4 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      const oscGain = audioContext.createGain();
      oscGain.gain.value = gains[i];
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      sources.push(osc);
    });
    
    return sources;
  };

  const createMeditationSound = (gainNode: GainNode) => {
    const sources: OscillatorNode[] = [];
    
    // Deep meditation drone with binaural-like tones
    const frequencies = [100, 104, 200, 300]; // 4Hz difference for theta waves
    const gains = [0.15, 0.15, 0.08, 0.05];
    const types: OscillatorType[] = ['sine', 'sine', 'sine', 'triangle'];
    
    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      osc.type = types[i];
      osc.frequency.value = freq;
      
      const oscGain = audioContext.createGain();
      oscGain.gain.value = gains[i];
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      sources.push(osc);
    });
    
    return sources;
  };

  const createSpiritualSound = (gainNode: GainNode) => {
    const sources: AudioScheduledSourceNode[] = [];
    
    // Ethereal spiritual sounds with harmonics
    const frequencies = [256, 384, 512, 768];
    const gains = [0.1, 0.08, 0.06, 0.04];
    const types: OscillatorType[] = ['sine', 'sine', 'sine', 'triangle'];
    
    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      osc.type = types[i];
      osc.frequency.value = freq;
      
      const oscGain = audioContext.createGain();
      oscGain.gain.value = gains[i];
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      sources.push(osc);
    });
    
    // Subtle shimmer with high-pass filtered white noise
    const shimmerBuffer = createNoiseBuffer('white');
    const shimmer = audioContext.createBufferSource();
    shimmer.buffer = shimmerBuffer;
    shimmer.loop = true;
    
    const shimmerFilter = audioContext.createBiquadFilter();
    shimmerFilter.type = 'highpass';
    shimmerFilter.frequency.value = 8000;
    
    const shimmerGain = audioContext.createGain();
    shimmerGain.gain.value = 0.02;
    
    shimmer.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(gainNode);
    shimmer.start();
    
    sources.push(shimmer);
    return sources;
  };

  const createWindSound = (gainNode: GainNode) => {
    const sources: OscillatorNode[] = [];
    // Wind chimes with pentatonic scale
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C, D, E, G, A

    const chime = () => {
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = note;

      const envelope = audioContext.createGain();
      envelope.gain.value = 0;
      envelope.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);

      osc.connect(envelope);
      envelope.connect(gainNode);

      osc.start();
      osc.stop(audioContext.currentTime + 2.5);

      setTimeout(chime, 1500 + Math.random() * 4500);
    };

    chime();
    setTimeout(chime, 1000);

    return sources;
  };

  return {
    createCosmicSound,
    createRainSound,
    createOceanSound,
    createBirdsSound,
    createForestSound,
    createFireSound,
    createBowlSound,
    createTibetanSound,
    createMeditationSound,
    createSpiritualSound,
    createWindSound,
  };
}

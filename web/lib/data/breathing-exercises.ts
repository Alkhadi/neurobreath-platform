import { BreathingExercise } from '../types';

export const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    shortName: '4-4-4-4',
    description: 'Equal counts for inhale, hold, exhale, hold - creates calm and focus',
    pattern: 'Breathe in for 4, hold for 4, breathe out for 4, hold for 4',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    duration: 120,
    ageMin: 8,
    warnings: ['Stop if you feel dizzy or uncomfortable', 'Not recommended if you dislike breath holds']
  },
  {
    id: 'coherent-breathing',
    name: 'Coherent Breathing',
    shortName: '5-5',
    description: 'Smooth, equal breathing that balances the nervous system',
    pattern: 'Breathe in for 5, breathe out for 5',
    inhale: 5,
    exhale: 5,
    duration: 180,
    ageMin: 6,
    warnings: ['Keep breathing gentle and smooth', 'If too slow, try 4-4 instead']
  },
  {
    id: 'sos-calm',
    name: 'SOS 60-Second Calm',
    shortName: 'SOS',
    description: 'Quick calming breath for moments of high stress',
    pattern: 'Breathe in for 4, breathe out for 6 - emphasizes longer exhale',
    inhale: 4,
    exhale: 6,
    duration: 60,
    ageMin: 7,
    warnings: ['Focus on making exhale longer than inhale', 'Stop if uncomfortable']
  },
  {
    id: 'no-hold-breathing',
    name: 'No-Hold Breathing',
    shortName: '4-6',
    description: 'For people who find breath holds uncomfortable or triggering',
    pattern: 'Breathe in for 4, breathe out for 6 - no holds',
    inhale: 4,
    exhale: 6,
    duration: 120,
    ageMin: 6,
    warnings: ['Perfect for anyone who dislikes holding breath', 'Focus on smooth, continuous flow']
  },
  {
    id: 'extended-exhale',
    name: 'Extended Exhale',
    shortName: '4-8',
    description: 'Longer exhale activates relaxation response',
    pattern: 'Breathe in for 4, breathe out for 8',
    inhale: 4,
    exhale: 8,
    duration: 120,
    ageMin: 10,
    warnings: ['Make exhale gentle, not forced', 'If 8 is too long, try 4-6 instead']
  }
];

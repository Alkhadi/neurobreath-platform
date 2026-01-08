import { CalmingTechnique } from '../types';

export const calmingTechniques: CalmingTechnique[] = [
  {
    id: '5-4-3-2-1-grounding',
    name: '5-4-3-2-1 Grounding',
    description: 'Use your senses to anchor yourself in the present moment',
    steps: [
      'Name 5 things you can see around you',
      'Name 4 things you can touch or feel',
      'Name 3 things you can hear',
      'Name 2 things you can smell (or like the smell of)',
      'Name 1 thing you can taste (or would like to taste)'
    ],
    duration: 3,
    tags: ['anxiety', 'grounding', 'sensory'],
    ageAdaptations: {
      'early-years': 'Adult guides: "Can you see your teddy? Can you touch something soft?"',
      'primary': 'Can do with minimal prompting; make it a game',
      'secondary': 'Can do independently; useful for anxiety or sensory overwhelm',
      'adult': 'Powerful tool for anxiety, flashbacks, or dissociation'
    }
  },
  {
    id: 'sensory-reset',
    name: 'Quick Sensory Reset',
    description: 'Brief sensory activities to regulate and refocus',
    steps: [
      'Choose one: push against wall for 10 seconds, squeeze hands together, gentle jumping',
      'Or: wrap in blanket/weighted item for 2 minutes',
      'Or: listen to favorite calming music with headphones',
      'Or: hold something cold (ice pack wrapped in cloth) or warm',
      'Notice how your body feels after'
    ],
    duration: 2,
    tags: ['sensory', 'regulation', 'movement'],
    ageAdaptations: {
      'early-years': 'Adult provides sensory input: gentle squeezes, rocking, singing',
      'primary': 'Offer choice of 2-3 sensory options from a visual menu',
      'secondary': 'Can choose own sensory strategy; may prefer quiet space',
      'adult': 'Know own sensory preferences; can use at work or home'
    }
  },
  {
    id: 'movement-break',
    name: 'Movement Break',
    description: 'Quick physical activity to release tension and refocus',
    steps: [
      'Choose one: 10 jumping jacks, run on the spot for 30 seconds, 5 big stretches',
      'Or: walk around the room/building for 2 minutes',
      'Or: dance to one song',
      'Or: do wall push-ups (10 times)',
      'Return to activity when ready'
    ],
    duration: 3,
    tags: ['movement', 'regulation', 'energy'],
    ageAdaptations: {
      'early-years': 'Lots of movement built into day; follow the child lead',
      'primary': 'Scheduled movement breaks; teach to recognize when body needs to move',
      'secondary': 'Can take independent breaks; may prefer walking to high-energy movement',
      'adult': 'Workplace: short walks, stairs, stretching at desk'
    }
  },
  {
    id: 'calm-scripting',
    name: 'Calming Self-Talk Scripts',
    description: 'Helpful phrases to say to yourself when anxious or overwhelmed',
    steps: [
      'Choose a phrase that feels right: "This feeling will pass", "I am safe", "I can handle this"',
      'Or: "It is okay to take a break", "My feelings are okay", "I am doing my best"',
      'Repeat slowly 3-5 times',
      'Take slow breaths between repetitions',
      'Notice any shift in how you feel'
    ],
    duration: 2,
    tags: ['anxiety', 'self-talk', 'coping'],
    ageAdaptations: {
      'early-years': 'Adult provides reassurance: "You are safe. I am here with you."',
      'primary': 'Simple phrases: "I am okay. This will be okay." Can be on visual card.',
      'secondary': 'Can choose own phrases; may find certain words particularly helpful',
      'adult': 'Personalized affirmations; can combine with breathing or grounding'
    }
  }
];

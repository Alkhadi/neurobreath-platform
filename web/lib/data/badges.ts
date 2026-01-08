import { Badge } from '../types';

export const badges: Badge[] = [
  {
    id: 'first-calm',
    name: 'First Calm Minute',
    description: 'Completed your first breathing or calming exercise',
    icon: 'Wind',
    color: '#60B5FF',
    requirement: {
      type: 'first',
    }
  },
  {
    id: 'three-day-streak',
    name: '3-Day Streak',
    description: 'Practiced calming techniques for 3 days in a row',
    icon: 'Flame',
    color: '#FF9149',
    requirement: {
      type: 'streak',
      count: 3
    }
  },
  {
    id: 'visual-supports-starter',
    name: 'Visual Supports Starter',
    description: 'Practiced or logged a visual support strategy',
    icon: 'Eye',
    color: '#FF9898',
    requirement: {
      type: 'skills',
      count: 1
    }
  },
  {
    id: 'transition-pro',
    name: 'Transition Pro',
    description: 'Used transition strategies 5 times',
    icon: 'ArrowRightLeft',
    color: '#FF90BB',
    requirement: {
      type: 'skills',
      count: 5
    }
  },
  {
    id: 'sensory-planner',
    name: 'Sensory Planner',
    description: 'Completed sensory activities 3 times',
    icon: 'Sparkles',
    color: '#80D8C3',
    requirement: {
      type: 'skills',
      count: 3
    }
  },
  {
    id: 'communication-supporter',
    name: 'Communication Supporter',
    description: 'Practiced communication strategies',
    icon: 'MessageCircle',
    color: '#A19AD3',
    requirement: {
      type: 'skills',
      count: 1
    }
  },
  {
    id: 'inclusive-classroom',
    name: 'Inclusive Classroom Builder',
    description: 'Logged 10 skill practice sessions',
    icon: 'GraduationCap',
    color: '#72BF78',
    requirement: {
      type: 'sessions',
      count: 10
    }
  },
  {
    id: 'workplace-ally',
    name: 'Workplace Ally',
    description: 'Explored workplace adjustment strategies',
    icon: 'Briefcase',
    color: '#FF6363',
    requirement: {
      type: 'milestone'
    }
  },
  {
    id: 'plan-creator',
    name: 'Plan Creator',
    description: 'Created your first Today\'s Plan',
    icon: 'Target',
    color: '#4ECDC4',
    requirement: {
      type: 'plan',
      count: 1
    }
  },
  {
    id: 'toolkit-builder',
    name: 'Toolkit Builder',
    description: 'Created 3 different visual supports or plans',
    icon: 'Package',
    color: '#95E1D3',
    requirement: {
      type: 'tools',
      count: 3
    }
  },
  {
    id: 'seven-day-warrior',
    name: '7-Day Warrior',
    description: 'Maintained a 7-day practice streak',
    icon: 'Award',
    color: '#FFD93D',
    requirement: {
      type: 'streak',
      count: 7
    }
  },
  {
    id: 'self-advocate',
    name: 'Self-Advocate',
    description: 'Generated a workplace adjustments plan',
    icon: 'Megaphone',
    color: '#F38181',
    requirement: {
      type: 'workplace',
      count: 1
    }
  },
  {
    id: 'research-explorer',
    name: 'Research Explorer',
    description: 'Searched for evidence-based research on PubMed',
    icon: 'BookOpen',
    color: '#9B59B6',
    requirement: {
      type: 'research',
      count: 1
    }
  },
  {
    id: 'pathway-navigator',
    name: 'Pathway Navigator',
    description: 'Explored education rights and pathways (SEND/EHCP, IEP/504)',
    icon: 'Map',
    color: '#16A085',
    requirement: {
      type: 'pathways',
      count: 1
    }
  },
  {
    id: 'interactive-expert',
    name: 'Interactive Expert',
    description: 'Used 5 different interactive tools',
    icon: 'Gamepad2',
    color: '#E67E22',
    requirement: {
      type: 'tools',
      count: 5
    }
  },
  {
    id: 'ai-assistant-user',
    name: 'AI Assistant User',
    description: 'Asked the AI assistant for autism support guidance',
    icon: 'Bot',
    color: '#8E44AD',
    requirement: {
      type: 'ai-chat',
      count: 1
    }
  }
];

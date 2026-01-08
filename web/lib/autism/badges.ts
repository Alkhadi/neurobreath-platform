// Badges data for progress tracking
// Ported from ZIP implementation

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: 'streak' | 'sessions' | 'skills' | 'first' | 'milestone';
    count?: number;
  };
}

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
    description: 'Used workplace adjustment strategies',
    icon: 'Briefcase',
    color: '#FF6363',
    requirement: {
      type: 'milestone'
    }
  }
];


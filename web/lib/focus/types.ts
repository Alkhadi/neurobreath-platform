import type { Region } from '@/lib/region/region';

export interface FocusProtocol {
  id: string;
  name: string;
  duration: string;
  description: string;
  colorClass: string;
  iconColorClass: string;
}

export interface FocusGame {
  id: string;
  name: string;
  emoji: string;
  icon: 'Target' | 'Eye' | 'Zap';
  iconColor: string;
  href: string;
}

export interface FocusEvidenceLink {
  title: string;
  url: string;
  source: string;
}

export interface FocusEvidence {
  region: Region;
  links: FocusEvidenceLink[];
}

export interface FocusProgress {
  practiceCount: number;
  totalFocusMinutes: number;
  drillsCompleted: number;
  lastPracticeDate: string | null;
  weeklyActivity: Record<string, number>;
}

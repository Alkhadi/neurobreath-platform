import conditionsData from './conditions.json';

export type ConditionScope = 'condition' | 'support-area';

export interface ConditionEntry {
  conditionId: string;
  canonicalName: string;
  aliases: string[];
  category: string;
  scope: ConditionScope;
  audience: string[];
  supportNeeds: string[];
  summary: string;
  resources: string[];
  pillarPath?: string;
  starterGuides: string[];
  tools: string[];
  recommendedClusters: string[];
  recommendedFaqs: string[];
  requiredPillar?: boolean;
}

export interface ConditionsCoverageConfig {
  generatedAt: string;
  minClusterCount: number;
  conditions: ConditionEntry[];
}

export const CONDITIONS_CONFIG = conditionsData as ConditionsCoverageConfig;
export const CONDITIONS = CONDITIONS_CONFIG.conditions;

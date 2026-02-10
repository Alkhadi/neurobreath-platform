/**
 * Performance Budget Configuration
 * Single source of truth for performance thresholds and baselines
 */

export interface PerformanceBudget {
  routesToMeasure: RouteConfig[];
  lighthouseBudgets: LighthouseBudgets;
  webVitalsProxies: WebVitalsProxies;
  bundleBudgets: BundleBudgets;
  dependencyBudgets: DependencyBudgets;
  ciConfig: CIConfig;
}

export interface RouteConfig {
  url: string;
  name: string;
  type: 'home' | 'hub' | 'tool' | 'guide' | 'trust' | 'other';
  priority: 'critical' | 'high' | 'medium';
}

export interface LighthouseBudgets {
  performanceScoreMin: number;
  accessibilityScoreMin: number;
  bestPracticesScoreMin: number;
  seoScoreMin: number;
}

export interface WebVitalsProxies {
  maxTotalBlockingTimeMs: number;
  maxSpeedIndex: number;
  maxLargestContentfulPaintMs: number;
  maxCumulativeLayoutShift: number;
  maxFirstContentfulPaintMs: number;
}

export interface BundleBudgets {
  maxRouteClientJsKB: {
    home: number;
    hub: number;
    tool: number;
    guide: number;
    trust: number;
    other: number;
  };
  maxLargestChunkKB: number;
  maxTotalClientJsKB: number;
  maxDeltaPercent: number;
}

export interface DependencyBudgets {
  maxNewDependenciesCount: number;
  blocklist: string[];
  maxSingleDependencySizeKB: number;
  allowlist: Array<{
    package: string;
    justification: string;
    approvedBy: string;
    date: string;
  }>;
}

export interface CIConfig {
  failOnRegression: boolean;
  warnOnly: boolean;
}

export const PERFORMANCE_BUDGET: PerformanceBudget = {
  routesToMeasure: [
    // Critical paths
    { url: '/uk', name: 'uk-home', type: 'home', priority: 'critical' },
    { url: '/us', name: 'us-home', type: 'home', priority: 'critical' },
    
    // High priority hubs
    { url: '/uk/conditions', name: 'uk-conditions', type: 'hub', priority: 'high' },
    { url: '/us/conditions', name: 'us-conditions', type: 'hub', priority: 'high' },
    { url: '/uk/tools', name: 'uk-tools', type: 'hub', priority: 'high' },
    { url: '/us/tools', name: 'us-tools', type: 'hub', priority: 'high' },
    { url: '/uk/guides', name: 'uk-guides', type: 'hub', priority: 'high' },
    { url: '/us/guides', name: 'us-guides', type: 'hub', priority: 'high' },
    
    // Representative tool (tool pages are not region-prefixed)
    { url: '/tools/breath-tools', name: 'breath-tools', type: 'tool', priority: 'high' },
    
    // Trust centre
    { url: '/uk/trust', name: 'uk-trust', type: 'trust', priority: 'medium' },
    { url: '/us/trust', name: 'us-trust', type: 'trust', priority: 'medium' },
  ],
  
  lighthouseBudgets: {
    performanceScoreMin: 75,
    accessibilityScoreMin: 90,
    bestPracticesScoreMin: 85,
    seoScoreMin: 85,
  },
  
  webVitalsProxies: {
    maxTotalBlockingTimeMs: 300,
    maxSpeedIndex: 3000,
    maxLargestContentfulPaintMs: 2500,
    maxCumulativeLayoutShift: 0.1,
    maxFirstContentfulPaintMs: 1800,
  },
  
  bundleBudgets: {
    maxRouteClientJsKB: {
      home: 250,
      hub: 200,
      tool: 300,
      guide: 180,
      trust: 150,
      other: 200,
    },
    maxLargestChunkKB: 150,
    maxTotalClientJsKB: 500,
    maxDeltaPercent: 10, // Fail if bundle grows >10%
  },
  
  dependencyBudgets: {
    maxNewDependenciesCount: 3,
    blocklist: [
      'moment', // Use date-fns instead
      'lodash', // Tree-shake or use lodash-es
      'jquery',
      'bootstrap',
    ],
    maxSingleDependencySizeKB: 500,
    allowlist: [
      {
        package: '@radix-ui/react-dialog',
        justification: 'Accessible dialog primitives, no lighter alternative',
        approvedBy: 'tech-lead',
        date: '2026-01-15',
      },
    ],
  },
  
  ciConfig: {
    failOnRegression: true,
    warnOnly: false,
  },
};

export default PERFORMANCE_BUDGET;

/**
 * Recommendation Engine
 * 
 * Intelligent content recommendations based on user behavior and preferences.
 * Uses analytics data to suggest relevant journeys, guides, and tools.
 */

import { getAnalyticsStore } from '../analytics/engine';
import type { SavedItem } from '../user-preferences/schema';

export interface Recommendation {
  id: string;
  type: 'journey' | 'guide' | 'tool';
  title: string;
  href: string;
  reason: string;
  score: number;
  tags: string[];
}

/**
 * Get recommended journeys based on user's saved items and completed journeys
 */
export function getRecommendedJourneys(savedItems: SavedItem[], maxResults: number = 5): Recommendation[] {
  const store = getAnalyticsStore();
  const recommendations: Recommendation[] = [];

  // Get user's tag preferences from saved items
  const userTags = new Set<string>();
  savedItems.forEach(item => {
    item.tags?.forEach(tag => userTags.add(tag));
  });

  // Get completed journeys
  const completedJourneys = new Set<string>();
  store.events
    .filter(event => event.type === 'journey_completed')
    .forEach(event => {
      if ('journeyId' in event.data && typeof event.data.journeyId === 'string') {
        completedJourneys.add(event.data.journeyId);
      }
    });

  // Sample journey database (in production, this would come from content system)
  const journeys = [
    {
      id: 'calm-starter',
      title: 'Calm Starter Journey',
      href: '/journeys/calm-starter',
      tags: ['anxiety', 'stress', 'breathing', 'beginner'],
      description: 'Learn basic calming techniques',
    },
    {
      id: 'focus-builder',
      title: 'Focus Builder Journey',
      href: '/journeys/focus-builder',
      tags: ['adhd', 'focus', 'concentration', 'intermediate'],
      description: 'Improve your focus and concentration',
    },
    {
      id: 'sleep-improvement',
      title: 'Sleep Improvement Journey',
      href: '/journeys/sleep-improvement',
      tags: ['sleep', 'relaxation', 'night-routine'],
      description: 'Better sleep through breathing',
    },
    {
      id: 'autism-sensory',
      title: 'Sensory Regulation Journey',
      href: '/journeys/autism-sensory',
      tags: ['autism', 'sensory', 'regulation'],
      description: 'Manage sensory overload',
    },
    {
      id: 'mood-boost',
      title: 'Mood Boost Journey',
      href: '/journeys/mood-boost',
      tags: ['mood', 'depression', 'wellbeing'],
      description: 'Improve your daily mood',
    },
  ];

  // Score each journey
  journeys.forEach(journey => {
    // Skip if already completed
    if (completedJourneys.has(journey.id)) return;

    // Skip if already saved
    const alreadySaved = savedItems.some(item => item.id === `journey-${journey.id}`);
    if (alreadySaved) return;

    let score = 0;
    const reasons: string[] = [];

    // Score based on tag overlap
    const matchingTags = journey.tags.filter(tag => userTags.has(tag));
    if (matchingTags.length > 0) {
      score += matchingTags.length * 10;
      reasons.push(`Matches your interests in ${matchingTags.join(', ')}`);
    }

    // Bonus for beginner journeys if user is new
    if (journey.tags.includes('beginner') && savedItems.length < 3) {
      score += 5;
      reasons.push('Great for getting started');
    }

    // Bonus for intermediate if user has completed journeys
    if (journey.tags.includes('intermediate') && completedJourneys.size > 0) {
      score += 5;
      reasons.push('Next step in your journey');
    }

    if (score > 0) {
      recommendations.push({
        id: journey.id,
        type: 'journey',
        title: journey.title,
        href: journey.href,
        reason: reasons.join('. '),
        score,
        tags: journey.tags,
      });
    }
  });

  // Sort by score and return top results
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Get recommended guides based on completed journeys and user activity
 */
export function getRecommendedGuides(savedItems: SavedItem[], maxResults: number = 5): Recommendation[] {
  const store = getAnalyticsStore();
  const recommendations: Recommendation[] = [];

  // Get user's interests
  const userTags = new Set<string>();
  savedItems.forEach(item => {
    item.tags?.forEach(tag => userTags.add(tag));
  });

  // Sample guide database
  const guides = [
    {
      id: 'box-breathing',
      title: 'Box Breathing Guide',
      href: '/guides/breathing/box-breathing',
      tags: ['breathing', 'anxiety', 'stress'],
      pillar: 'breathing',
    },
    {
      id: '4-7-8-breathing',
      title: '4-7-8 Breathing Technique',
      href: '/guides/breathing/4-7-8-breathing',
      tags: ['breathing', 'sleep', 'relaxation'],
      pillar: 'breathing',
    },
    {
      id: 'focus-techniques',
      title: 'Focus Enhancement Techniques',
      href: '/guides/focus-adhd/focus-techniques',
      tags: ['focus', 'adhd', 'concentration'],
      pillar: 'focus-adhd',
    },
    {
      id: 'sensory-tools',
      title: 'Sensory Regulation Tools',
      href: '/guides/autism/sensory-tools',
      tags: ['autism', 'sensory', 'regulation'],
      pillar: 'autism',
    },
    {
      id: 'morning-routine',
      title: 'Energizing Morning Routine',
      href: '/guides/wellness/morning-routine',
      tags: ['routine', 'mood', 'energy'],
      pillar: 'wellness',
    },
  ];

  // Score guides
  guides.forEach(guide => {
    // Skip if already saved
    const alreadySaved = savedItems.some(item => item.id === `guide-${guide.pillar}-${guide.id}`);
    if (alreadySaved) return;

    let score = 0;
    const reasons: string[] = [];

    // Score based on tag overlap
    const matchingTags = guide.tags.filter(tag => userTags.has(tag));
    if (matchingTags.length > 0) {
      score += matchingTags.length * 8;
      reasons.push(`Related to ${matchingTags.join(', ')}`);
    }

    // Bonus if user has viewed similar guides
    const relatedViews = store.events.filter(
      event =>
        event.type === 'page_viewed' &&
        'page' in event.data &&
        typeof event.data.page === 'string' &&
        event.data.page.includes(guide.pillar)
    ).length;
    if (relatedViews > 0) {
      score += relatedViews * 2;
      reasons.push('Based on your browsing');
    }

    if (score > 0) {
      recommendations.push({
        id: guide.id,
        type: 'guide',
        title: guide.title,
        href: guide.href,
        reason: reasons.join('. '),
        score,
        tags: guide.tags,
      });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Get recommended tools based on user's condition focus
 */
export function getRecommendedTools(savedItems: SavedItem[], maxResults: number = 3): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Get user's condition interests
  const conditions = new Set<string>();
  savedItems.forEach(item => {
    item.tags?.forEach(tag => {
      if (['adhd', 'autism', 'anxiety', 'depression', 'mood', 'sleep'].includes(tag)) {
        conditions.add(tag);
      }
    });
  });

  // Sample tool database
  const tools = [
    {
      id: 'adhd-focus-lab',
      title: 'ADHD Focus Lab',
      href: '/tools/adhd-focus-lab',
      tags: ['adhd', 'focus'],
      condition: 'adhd',
    },
    {
      id: 'autism-tools',
      title: 'Autism Support Tools',
      href: '/tools/autism-tools',
      tags: ['autism', 'sensory'],
      condition: 'autism',
    },
    {
      id: 'anxiety-tools',
      title: 'Anxiety Relief Tools',
      href: '/tools/anxiety-tools',
      tags: ['anxiety', 'stress'],
      condition: 'anxiety',
    },
    {
      id: 'breath-ladder',
      title: 'Breath Ladder Game',
      href: '/tools/breath-ladder',
      tags: ['breathing', 'focus'],
      condition: 'general',
    },
  ];

  // Score tools
  tools.forEach(tool => {
    // Skip if already saved
    const alreadySaved = savedItems.some(item => item.id === `tool-${tool.id}`);
    if (alreadySaved) return;

    let score = 0;
    const reasons: string[] = [];

    // Match to user's conditions
    if (conditions.has(tool.condition)) {
      score += 15;
      reasons.push(`Designed for ${tool.condition}`);
    }

    // General tools get lower score but still recommended
    if (tool.condition === 'general') {
      score += 5;
      reasons.push('Helpful for everyone');
    }

    if (score > 0) {
      recommendations.push({
        id: tool.id,
        type: 'tool',
        title: tool.title,
        href: tool.href,
        reason: reasons.join('. '),
        score,
        tags: tool.tags,
      });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Get all recommendations for a user
 */
export function getAllRecommendations(savedItems: SavedItem[]): {
  journeys: Recommendation[];
  guides: Recommendation[];
  tools: Recommendation[];
} {
  return {
    journeys: getRecommendedJourneys(savedItems, 3),
    guides: getRecommendedGuides(savedItems, 3),
    tools: getRecommendedTools(savedItems, 2),
  };
}

/**
 * Get next suggested action based on user progress
 */
export function getNextSuggestedAction(savedItems: SavedItem[]): Recommendation | null {
  const store = getAnalyticsStore();

  // If no saved items, suggest starting with a journey
  if (savedItems.length === 0) {
    return {
      id: 'calm-starter',
      type: 'journey',
      title: 'Start with Calm Starter Journey',
      href: '/journeys/calm-starter',
      reason: 'Perfect for beginners',
      score: 100,
      tags: ['beginner', 'breathing'],
    };
  }

  // If saved journeys exist, suggest one
  const savedJourneys = savedItems.filter(item => item.type === 'journey');
  if (savedJourneys.length > 0) {
    const journey = savedJourneys[0];
    return {
      id: journey.id,
      type: 'journey',
      title: `Continue: ${journey.title}`,
      href: journey.href,
      reason: 'Pick up where you left off',
      score: 100,
      tags: journey.tags || [],
    };
  }

  // If journeys completed but no routine, suggest building routine
  if (store.summary.totalJourneysCompleted > 0 && store.summary.totalRoutineUpdates === 0) {
    return {
      id: 'build-routine',
      type: 'tool',
      title: 'Build Your Daily Routine',
      href: '/my-plan#routine',
      reason: 'Turn your progress into a habit',
      score: 100,
      tags: ['routine'],
    };
  }

  // Otherwise, suggest top recommendation
  const allRecs = getAllRecommendations(savedItems);
  const topRec = [
    ...allRecs.journeys,
    ...allRecs.guides,
    ...allRecs.tools,
  ].sort((a, b) => b.score - a.score)[0];

  return topRec || null;
}

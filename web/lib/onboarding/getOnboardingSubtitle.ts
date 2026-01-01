/**
 * Get Route-Aware Onboarding Subtitle
 * 
 * Returns contextual subtitle text based on current route.
 * Makes onboarding feel natural and relevant to where the user is.
 */

export function getOnboardingSubtitle(pathname: string): string {
  const p = pathname || '/'

  // Exact matches
  if (p === '/') return 'Pick a quick activity and protect your streak today.'
  if (p === '/get-started') return 'Set up a learner profile for personalised progress tracking.'
  if (p === '/dyslexia-reading-training') return 'Start dyslexia-friendly practice and track progress over time.'
  if (p === '/progress') return 'Review streaks, milestones, and next recommended practice.'
  if (p === '/rewards') return 'Collect badges and celebrate progress milestones.'

  // Prefix matches
  if (p.startsWith('/tools')) return 'Choose a tool and complete today\'s quick quest.'
  if (p.startsWith('/breathing')) return 'Use a breathing tool to improve focus and calm in minutes.'
  if (p.startsWith('/techniques')) return 'Pick a technique and follow a guided routine.'
  if (p.startsWith('/conditions')) return 'Explore practical strategies and supportive guidance for today.'

  // Content hubs
  if (p === '/blog' || p === '/ai-blog') return 'Explore evidence-led posts and ask the AI Coach.'

  // Default
  return 'Get started with personalised reading training.'
}

/**
 * Get route-aware locked subtitle (when PIN is required)
 */
export function getOnboardingLockedSubtitle(pathname: string): string {
  const p = pathname || '/'
  
  if (p === '/get-started') return 'Unlock to create another learner profile'
  if (p === '/progress' || p === '/rewards') return 'Unlock to view and manage profiles'
  
  // Default
  return 'Click to unlock and manage profiles'
}


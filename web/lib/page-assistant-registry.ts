/**
 * Page Assistant Registry
 * 
 * Single source of truth for Reading Buddy content and Guided Tour steps
 * dynamically tailored to each page/route.
 */

export interface TourStep {
  id: string
  title: string
  description: string
  targetSelector: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export interface ReadingBuddyCopy {
  heading: string
  subheading: string
  intro: string
  quickQuestions: string[]
  inputPlaceholder: string
  responses?: { [key: string]: string }
}

export interface PageAssistantConfig {
  pageKey: string
  pathPattern: string | RegExp
  readingBuddy: ReadingBuddyCopy
  tour: {
    steps: TourStep[]
  }
}

/**
 * Page Assistant Registry
 */
const PAGE_ASSISTANT_REGISTRY: PageAssistantConfig[] = [
  // Dyslexia Reading Training Page (MUST come before generic reading-hub)
  {
    pageKey: 'dyslexia-reading-training',
    pathPattern: /^\/dyslexia-reading-training(\/.*)?$/,
    readingBuddy: {
      heading: 'Reading Practice Buddy',
      subheading: 'Your dyslexia reading guide',
      intro: "Welcome to Dyslexia Reading Training! I'm here to help you build decoding skills, phonics accuracy, and reading fluency with short, structured practice. This page offers levelled passages, word lists, and phonics drills designed for dyslexia support. Start by choosing a level that feels comfortable, read for 2–5 minutes, then track your score and repeat once. If reading feels stressful, try a 60-second calm reset (breathing exercise) first, then return to the practice. What would you like to practise today: letter sounds, word lists, or a short passage?",
      quickQuestions: [
        'Which level should I start from?',
        'How do I practise phonics step-by-step?',
        'How do I improve reading speed without guessing?',
        'What should I do before reading if I feel anxious?',
        'How do I track progress and streaks for reading practice?',
        'Can you explain how the Focus Garden helps with reading?'
      ],
      inputPlaceholder: 'Ask about reading levels, phonics, fluency, or how to use the tools...',
      responses: {
        'Which level should I start from?':
          "Great question! Start with a level where you can read 80-90% of words correctly—this is your 'instructional level'. If you're not sure, try Level 1 (simple CVC words like cat, dog, run) and move up if it feels too easy. You want to be challenged but not overwhelmed. The goal is to build confidence and fluency, not to rush through levels. You can always drop back a level if you need more practice!",
        
        'How do I practise phonics step-by-step?':
          "Here's a simple routine: 1) Start with letter sounds (Phonics Sounds Lab)—practise 5-10 sounds for 2 minutes. 2) Blend sounds into words (Word Construction)—build 5-10 words. 3) Read word lists (choose a level)—read aloud slowly and accurately. 4) Read a short passage (1-2 minutes)—track your time and errors. 5) Repeat the same passage to improve fluency. This builds from sounds → words → sentences → passages. Practise daily for 10 minutes!",
        
        'How do I improve reading speed without guessing?':
          "Focus on accuracy first, then speed! Here's how: 1) Read the same passage 3 times (repeated reading builds fluency). 2) Use the Fluency Pacer tool—it highlights words at a steady pace so you don't rush. 3) Track your Words Per Minute (WPM) and errors each time. 4) Celebrate small improvements (even 5 WPM faster is progress!). 5) Don't skip unknown words—decode them slowly, then reread. Speed comes naturally with repeated accurate practice, not from guessing.",
        
        'What should I do before reading if I feel anxious?':
          "If reading feels stressful, take a 60-second calm reset first! Try Box Breathing (in for 4, hold for 4, out for 4, hold for 4—repeat 3 times) or 4-7-8 Breathing (in for 4, hold for 7, out for 8—repeat 2 times). You can also visit the Focus Garden for a quick visual calm activity. When you feel calmer, return to reading. This helps your brain focus and reduces mistakes caused by anxiety. It's okay to take breaks—learning works best when you're calm!",
        
        'How do I track progress and streaks for reading practice?':
          "Your progress is tracked automatically! Look for the Streak Toolkit near the top of the page—it shows how many days in a row you've practiced, total minutes, and badges earned. Each time you complete a reading activity, it counts toward your streak. Aim for 10 minutes a day to keep your streak going. You can also see your reading level progress, WPM improvements, and accuracy scores in the Progress section. Celebrate every milestone—7-day streaks, 30-day streaks, and level-ups!",
        
        'Can you explain how the Focus Garden helps with reading?':
          "The Focus Garden is a calming visual activity that helps you reset before reading practice. It uses gentle animations and breathing cues to help you focus and reduce anxiety. Many people find reading easier after 1-2 minutes in the Focus Garden because it calms the nervous system and clears the mind. You can use it before starting a reading session, or when you feel frustrated during practice. It's especially helpful if you experience reading-related stress or avoidance. Give it a try—it's at the top of the page!",
        
        'default':
          "That's a great question! This Dyslexia Reading Training page is designed to help you build reading skills with structured, evidence-based practice. You can practise phonics, read levelled passages, track your progress, and use calming tools when needed. Everything here is designed to support dyslexia and build confidence. If you have a specific question about any tool or technique, just ask me!"
      }
    },
    tour: {
      steps: [
        {
          id: 'hero',
          title: 'Welcome to Dyslexia Reading Training!',
          description: 'This page helps you build decoding, phonics accuracy, and reading fluency with short, structured practice. Let me show you around!',
          targetSelector: '[data-tutorial="hero"]',
          position: 'bottom'
        },
        {
          id: 'streak',
          title: 'Your Reading Streak',
          description: 'Track your daily reading practice here! Practice for at least 10 minutes each day to keep your streak going and earn badges.',
          targetSelector: '[data-tutorial="streak"]',
          position: 'bottom'
        },
        {
          id: 'timer',
          title: 'Practice Timer',
          description: 'Use this timer to track your reading sessions. Aim for 10-15 minutes of focused practice each day.',
          targetSelector: '[data-tutorial="timer"]',
          position: 'bottom'
        },
        {
          id: 'breathing',
          title: 'Calm Reset Before Reading',
          description: 'Feeling anxious about reading? Start with a 60-second breathing exercise to calm your mind and improve focus.',
          targetSelector: '[data-tutorial="breathing"]',
          position: 'bottom'
        },
        {
          id: 'phonics',
          title: 'Phonics Practice',
          description: 'Start here! Practice letter sounds and phonics patterns with audio support and visual animations.',
          targetSelector: '[data-tutorial="phonics"]',
          position: 'bottom'
        },
        {
          id: 'wordbuilder',
          title: 'Word Construction',
          description: 'Build words by blending sounds together. This helps you decode new words when reading.',
          targetSelector: '[data-tutorial="wordbuilder"]',
          position: 'bottom'
        },
        {
          id: 'fluency',
          title: 'Fluency Pacer',
          description: 'Practice reading at a steady pace. Words highlight as you read, helping you build smooth, accurate reading.',
          targetSelector: '[data-tutorial="fluency"]',
          position: 'bottom'
        },
        {
          id: 'syllables',
          title: 'Syllable Splitter',
          description: 'Break long words into smaller parts (syllables) to make them easier to read.',
          targetSelector: '[data-tutorial="syllables"]',
          position: 'bottom'
        },
        {
          id: 'complete',
          title: 'You\'re Ready to Practise!',
          description: 'Start with a calm reset, then try phonics or a levelled passage. Remember: accuracy first, then speed. Practice daily for best results!',
          targetSelector: '[data-tutorial="hero"]',
          position: 'bottom'
        }
      ]
    }
  },

  // Blog / AI Hub Page
  {
    pageKey: 'blog-ai-hub',
    pathPattern: /^\/(blog|ai-blog)(\/.*)?$/,
    readingBuddy: {
      heading: 'AI Coach Buddy',
      subheading: 'Your guide to the AI Hub',
      intro: "Hi there! I'm your AI Coach Buddy, here to help you navigate the Blog & AI Hub. This is your space to explore evidence-informed guidance, use the AI Coach for tailored plans, join the 30-Day Calm Challenge, and browse helpful posts. Everything here is designed to support your wellbeing journey with practical, science-backed strategies. What would you like to explore today?",
      quickQuestions: [
        'How do I use the AI Coach on this page?',
        'Can you summarise a routine plan for my situation?',
        'Where do I find the Calm Challenge and streaks?',
        'Which breathing technique should I start with?',
        'How do I search and filter blog posts?',
        'What are the recommended resources?'
      ],
      inputPlaceholder: 'Ask about autism/ADHD/dyslexia/sleep/stress — or ask what to do this week…',
      responses: {
        'How do I use the AI Coach on this page?': 
          "Great question! Scroll down to the 'Ask the AI Coach' card. You'll see context chips where you can select your situation (age, setting, challenge, goal) and a topic. Then click 'Get tailored plan' for a full 7-day action plan—no typing needed! You can also choose quick actions like 'Daily routines & regulation' or type your own question. The AI Coach uses NHS, NICE, and research evidence to give you practical, tailored guidance. It's free, private, and designed to help you take action this week.",
        
        'Can you summarise a routine plan for my situation?':
          "I'd love to help! To get a personalized routine plan, scroll down to the 'Ask the AI Coach' section. Select your context chips (like age, setting, challenge, and goal), pick a topic (autism, ADHD, anxiety, sleep, etc.), and click 'Get tailored plan'. The AI Coach will generate a practical 7-day plan specifically for your situation, with daily actions, scripts, and troubleshooting tips. It's evidence-based and ready to use this week!",
        
        'Where do I find the Calm Challenge and streaks?':
          "You'll find the 30-Day Calm Challenge near the top of the page! It's a free challenge where you practice calming techniques daily to build a streak. Track your progress with the streak counter, earn badges at milestones (7 days, 14 days, 30 days), and join a supportive community. Scroll up to see the Calm Challenge card—it explains how to join and what to expect. Consistency is key, and even 5 minutes a day counts!",
        
        'Which breathing technique should I start with?':
          "For beginners, I recommend Box Breathing (4-4-4-4) or 4-7-8 Breathing. Box Breathing is simple: breathe in for 4, hold for 4, out for 4, hold for 4—repeat 4 times. It's used by athletes and military for quick calm. 4-7-8 is great before bed: in for 4, hold for 7, out for 8. Both are free, take 2 minutes, and work anywhere. Scroll to the recommended resources or breathing tools section to try them out!",
        
        'How do I search and filter blog posts?':
          "Great question! Look for the search bar and filter controls near the top of the blog directory section. You can search by keyword (like 'anxiety' or 'school strategies') or filter by topic (autism, ADHD, dyslexia, mood, breathing). This helps you find exactly what you need without scrolling through everything. The posts are evidence-informed and cover practical strategies, FAQs, and real-world advice.",
        
        'What are the recommended resources?':
          "The recommended resources section shows NeuroBreath tools matched to your needs—like breathing exercises, reading training, focus tools, and learning support. Each resource has a 'Why this fits' and 'How to use this week' guide. You'll also see links to relevant NHS, NICE, and charity resources. These are all free, evidence-based, and designed to help you take action today. Scroll down to explore them!",
        
        'default':
          "That's a wonderful question! This Blog & AI Hub is designed to give you evidence-informed guidance and practical tools for wellbeing. You can use the AI Coach for tailored plans, browse helpful posts, join the Calm Challenge, or explore breathing and focus tools. Everything here is rooted in NHS, NICE, and research evidence. If you have a specific question about any feature, just ask me!"
      }
    },
    tour: {
      steps: [
        {
          id: 'blog-hero',
          title: 'Welcome to the AI Hub!',
          description: 'This is your evidence-informed blog and Q&A hub. Here you can explore posts, ask the AI Coach for tailored guidance, and discover practical tools for autism, ADHD, anxiety, sleep, and more.',
          targetSelector: '[data-tour="blog-hero"]',
          position: 'bottom'
        },
        {
          id: 'calm-challenge',
          title: '30-Day Calm Challenge',
          description: 'Join the free 30-Day Calm Challenge! Practice calming techniques daily, track your streak, and earn badges. Consistency builds resilience—even 5 minutes a day counts.',
          targetSelector: '[data-tour="calm-challenge"]',
          position: 'bottom'
        },
        {
          id: 'ai-coach',
          title: 'Ask the AI Coach',
          description: 'Get tailored 7-day plans without typing! Select your context (age, setting, challenge, goal), choose a topic, and click "Get tailored plan". The AI Coach uses NHS, NICE, and research evidence to give you practical, personalized guidance.',
          targetSelector: '[data-tour="ai-coach"]',
          position: 'bottom'
        },
        {
          id: 'blog-directory',
          title: 'Browse Blog Posts',
          description: 'Search and filter evidence-informed posts by topic (autism, ADHD, dyslexia, mood, breathing). Each post is designed to give you practical strategies and answer common questions.',
          targetSelector: '[data-tour="blog-directory"]',
          position: 'bottom'
        },
        {
          id: 'resources',
          title: 'Recommended Resources',
          description: 'Explore NeuroBreath tools and external resources matched to your needs. Each resource includes "Why this fits" and "How to use this week" guidance. All resources are free and evidence-based.',
          targetSelector: '[data-tour="resources"]',
          position: 'bottom'
        },
        {
          id: 'complete',
          title: "You're Ready!",
          description: 'Great job completing the tour! Start by using the AI Coach for a tailored plan, join the Calm Challenge, or browse posts. Remember: this is educational guidance—speak to your GP, SENCO, or clinician for personalized support.',
          targetSelector: '[data-tour="blog-hero"]',
          position: 'bottom'
        }
      ]
    }
  },

  // Reading Training Hub (Dyslexia Tools)
  {
    pageKey: 'reading-hub',
    pathPattern: /^\/(dyslexia-reading-training|tools\/phonics.*|tools\/reading.*)(\/.*)?$/,
    readingBuddy: {
      heading: 'Reading Buddy',
      subheading: 'Your friendly reading guide',
      intro: "Hi there! I'm Reading Buddy, your friendly guide for NeuroBreath. I'm so excited you're here! This page is like a super fun playground for reading! We have lots of games and activities to help you become a superstar reader. To get started, just pick any activity that looks interesting to you. Each one helps with a different part of reading, and we'll learn together! Which adventure do you want to try first?",
      quickQuestions: [
        'How do I start my first game?',
        'How do I earn rewards?',
        'What are streaks?',
        'How do I track my progress?',
        'Tell me about the Vowel Universe'
      ],
      inputPlaceholder: 'Ask me anything about reading practice...',
      responses: {
        'How do I start my first game?': 
          "Great question! Just scroll down the page and click on any activity card that catches your eye. Each card has a colorful design and tells you what it does. I recommend starting with the Phonics Song Player or Phonics Sounds Lab - they're super fun! Just click the play button and follow along. You've got this!",
        
        'How do I earn rewards?':
          "Earning rewards is so exciting! As you complete activities and practice, you'll automatically unlock reward cards. You can see your rewards by scrolling to the NeuroBreath Reward Cards section at the bottom of the page. Keep practicing every day to unlock more awesome rewards!",
        
        'What are streaks?':
          "Streaks are like your winning streak! Every day you practice, your streak grows. You can see your current streak in the Streak Toolkit card near the top of the page. It shows how many days in a row you've practiced, total minutes, and badges earned. Try to keep your streak going - it's really motivating!",
        
        'How do I track my progress?':
          "Tracking your progress is easy! Many activities save your progress automatically on your device. You'll see progress bars, stars, and badges throughout the page. The Streak Toolkit shows your overall progress, and each activity card displays how much you've completed. Everything saves automatically so you can pick up right where you left off!",
        
        'Tell me about the Vowel Universe':
          "The Vowel Universe is an amazing adventure! It's a special activity where you explore different vowel patterns like short vowels and long vowels. Each pattern has examples and practice words. It's like exploring different planets, but instead of planets, you're discovering how vowels work! Scroll down to find it and start exploring!",
        
        'default':
          "That's a wonderful question! I'm here to help you explore all the fun activities on this page. Each activity is designed to help you become a better reader in a different way. Feel free to try any activity that looks interesting, and remember - learning to read is an adventure! If you have specific questions about any activity, just ask me!"
      }
    },
    tour: {
      steps: [
        {
          id: 'hero',
          title: 'Welcome to NeuroBreath!',
          description: 'This is your reading training hub! Here you\'ll find fun games and exercises to improve your reading skills. Let me show you around!',
          targetSelector: '[data-tutorial="hero"]',
          position: 'bottom'
        },
        {
          id: 'streak',
          title: 'Your Streak Toolkit',
          description: 'This shows your practice streaks! Practice every day to build a streak. A 7-day streak earns you special rewards, and a 30-day streak unlocks amazing bonuses!',
          targetSelector: '[data-tutorial="streak"]',
          position: 'bottom'
        },
        {
          id: 'timer',
          title: 'Practice Timer',
          description: 'Use this timer to track how long you practice. Try to practice for at least 10 minutes each day to keep your streak going!',
          targetSelector: '[data-tutorial="timer"]',
          position: 'bottom'
        },
        {
          id: 'breathing',
          title: 'Breathing Exercise',
          description: 'Start here! Take a few deep breaths to calm down before learning. It helps your brain get ready for reading practice.',
          targetSelector: '[data-tutorial="breathing"]',
          position: 'bottom'
        },
        {
          id: 'phonics',
          title: 'Phonics Player',
          description: 'Listen to fun phonics songs that teach you letter sounds. Music makes learning easier and more fun!',
          targetSelector: '[data-tutorial="phonics"]',
          position: 'bottom'
        },
        {
          id: 'phonics-lab',
          title: 'Phonics Sounds Lab',
          description: 'Practice individual letter sounds with visual animations! Watch the letters slide in and hear their sounds.',
          targetSelector: '[data-tutorial="phonics-lab"]',
          position: 'bottom'
        },
        {
          id: 'wordbuilder',
          title: 'Word Builder',
          description: 'Build words by putting letters together! Start with simple words and work your way up to harder ones.',
          targetSelector: '[data-tutorial="wordbuilder"]',
          position: 'bottom'
        },
        {
          id: 'fluency',
          title: 'Fluency Pacer',
          description: 'Practice reading at different speeds. Words light up as you read along, helping you keep a steady pace.',
          targetSelector: '[data-tutorial="fluency"]',
          position: 'bottom'
        },
        {
          id: 'syllables',
          title: 'Syllable Splitter',
          description: 'Learn to break big words into smaller parts called syllables. It makes reading long words much easier!',
          targetSelector: '[data-tutorial="syllables"]',
          position: 'bottom'
        },
        {
          id: 'vowels',
          title: 'Vowel Universe',
          description: 'Explore 5 zones to master all vowel sounds! Start at Short Street with simple vowels, then journey through to advanced patterns.',
          targetSelector: '[data-tutorial="vowels"]',
          position: 'bottom'
        },
        {
          id: 'rewards',
          title: 'Reward Cards',
          description: 'As you practice, you earn points that unlock reward cards! Keep practicing to collect them all.',
          targetSelector: '[data-tutorial="rewards"]',
          position: 'bottom'
        },
        {
          id: 'complete',
          title: 'You\'re Ready!',
          description: 'Great job completing the tour! Start with a breathing exercise, then try any game you like. Remember, practice every day to build your streak and earn rewards!',
          targetSelector: '[data-tutorial="hero"]',
          position: 'bottom'
        }
      ]
    }
  },

  // Fallback for all other pages
  {
    pageKey: 'generic',
    pathPattern: /.*/,
    readingBuddy: {
      heading: 'NeuroBreath Buddy',
      subheading: 'Your page guide',
      intro: "Hi there! I'm your NeuroBreath Buddy. I can help you understand what this page offers and suggest the best next steps for your wellbeing journey. Whether you're exploring breathing tools, learning resources, or evidence-informed guidance, I'm here to guide you. What would you like to know about this page?",
      quickQuestions: [
        'What can I do on this page?',
        'How do I get started?',
        'Where can I find breathing exercises?',
        'What are the main features here?'
      ],
      inputPlaceholder: 'Ask me about this page...',
      responses: {
        'What can I do on this page?':
          "Great question! This page is part of NeuroBreath, a platform designed to support wellbeing with evidence-informed tools and guidance. Depending on which page you're on, you might find breathing exercises, reading training, focus tools, or AI-powered guidance. Explore the content on this page, and feel free to ask me specific questions!",
        
        'How do I get started?':
          "Getting started is easy! Take a look at the content on this page and choose what interests you most. If you're not sure where to begin, I can help guide you to the right tool or resource. Just let me know what you're looking for—breathing, reading, focus, or wellbeing guidance—and I'll point you in the right direction!",
        
        'Where can I find breathing exercises?':
          "You can find breathing exercises in the breathing section or tools menu. Look for options like Box Breathing, 4-7-8 Breathing, or the Breathing Orbit. These are all free, take just a few minutes, and help calm your nervous system. If you're on a different page, navigate to the breathing tools from the main menu.",
        
        'What are the main features here?':
          "NeuroBreath offers evidence-informed tools and guidance for autism, ADHD, dyslexia, anxiety, sleep, and more. Main features include: breathing exercises, reading training games, AI Coach for tailored plans, focus tools, and evidence-based blog posts. Everything is designed to be practical, accessible, and rooted in NHS, NICE, and research evidence. Explore the page to see what's available!",
        
        'default':
          "That's a great question! I'm here to help you navigate this page and find what you need. NeuroBreath offers practical, evidence-informed tools for wellbeing—from breathing exercises to reading support to AI-powered guidance. If you have a specific question about this page or what you can do here, just ask!"
      }
    },
    tour: {
      steps: []
    }
  }
]

/**
 * Get page assistant config for a given pathname
 */
export function getPageAssistantConfig(pathname: string): PageAssistantConfig {
  // Normalize pathname (remove trailing slash for consistency)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname

  // Find first matching config
  for (const config of PAGE_ASSISTANT_REGISTRY) {
    if (typeof config.pathPattern === 'string') {
      if (normalizedPath === config.pathPattern || normalizedPath.startsWith(config.pathPattern + '/')) {
        return config
      }
    } else if (config.pathPattern instanceof RegExp) {
      if (config.pathPattern.test(normalizedPath)) {
        return config
      }
    }
  }

  // Return fallback (last config is always the generic fallback)
  return PAGE_ASSISTANT_REGISTRY[PAGE_ASSISTANT_REGISTRY.length - 1]
}

/**
 * Get filtered tour steps (skip steps whose targets don't exist)
 */
export function getAvailableTourSteps(steps: TourStep[]): TourStep[] {
  if (typeof document === 'undefined') return steps
  
  return steps.filter(step => {
    const element = document.querySelector(step.targetSelector)
    return element !== null
  })
}


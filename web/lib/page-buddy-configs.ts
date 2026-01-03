// Page-specific configurations for NeuroBreath Buddy
// Mission: Empower neurodivergent people, parents, teachers & carers with evidence-informed guidance

export interface PageBuddyConfig {
  pageId: string;
  pageName: string;
  welcomeMessage: string;
  quickQuestions: string[];
  sections: {
    id: string;
    name: string;
    description: string;
    tips: string[];
  }[];
  keywords: string[];
  audiences: string[];
}

export const platformInfo = {
  mission: "NeuroBreath exists to empower neurodivergent people, parents, teachers and carers with one trusted hub.",
  objectives: [
    "Deliver accessible, motivating digital experiences",
    "Track progress safely",
    "Offer printable resources",
    "Strengthen home–school collaboration through clear, practical daily support"
  ],
  features: {
    adhd: [
      "Focus Pomodoro Timer with ADHD-friendly durations",
      "Daily Quests with XP & gamification",
      "Evidence-based Skills Library",
      "Treatment Decision Tree",
      "Myths vs Facts section",
      "Progress tracking with streaks"
    ],
    autism: [
      "Calm Toolkit with breathing exercises",
      "Skills Library with age adaptations",
      "Education Pathways (UK EHCP, US IEP/504, EU)",
      "Workplace Adjustments Generator",
      "PubMed Research Search",
      "Crisis Support Resources",
      "Printable Templates & Resources"
    ],
    shared: [
      "Evidence-informed guidance (NICE, CDC, NHS)",
      "Progress tracking & achievements",
      "Dyslexia-friendly design options",
      "Home-school collaboration tools"
    ]
  }
};

export const pageBuddyConfigs: Record<string, PageBuddyConfig> = {
  '/adhd': {
    pageId: 'adhd',
    pageName: 'ADHD Hub',
    audiences: ['neurodivergent individuals', 'parents', 'teachers', 'carers'],
    welcomeMessage: `Hey there! 👋 Welcome to the **ADHD Hub**!\n\nI'm your NeuroBreath Buddy – here to help you navigate evidence-based ADHD support tools.\n\n**What you'll find here:**\n• 🎯 Focus Timer with ADHD-friendly durations\n• 🏆 Daily Quests to build habits & earn XP\n• 📚 Skills Library with practical strategies\n• 🔬 Evidence-backed myths vs facts\n\nWhether you're neurodivergent yourself, a parent, teacher, or carer – this hub is designed for you. What would you like to explore?`,
    quickQuestions: [
      'How do I start a focus session?',
      'What are Daily Quests?',
      'Show me ADHD coping strategies',
      'How does progress tracking work?',
      'What resources can I print?'
    ],
    sections: [
      {
        id: 'hero',
        name: 'ADHD Hub Overview',
        description: 'Your dashboard showing XP, level, and quick navigation to all ADHD tools',
        tips: ['Check your current level and streak at the top', 'Use quick links to jump to specific tools', 'All progress is saved automatically']
      },
      {
        id: 'focus-timer',
        name: 'Focus Pomodoro Timer',
        description: 'ADHD-friendly timer with flexible durations (5-50 min) and dopamine-boosting break tips',
        tips: ['Start with shorter sessions (15-25 min) if focus is challenging', 'Use dopamine tips during breaks to stay motivated', 'Track focus streaks to see your progress over time']
      },
      {
        id: 'quests',
        name: 'Daily Quests',
        description: 'Gamified daily challenges that build ADHD-friendly habits with XP rewards',
        tips: ['Complete quests to earn XP and level up', 'Quests refresh daily – check back each morning', 'Build streaks for bonus motivation', 'Great for home-school routine building']
      },
      {
        id: 'skills',
        name: 'Skills Library',
        description: 'Evidence-based ADHD strategies with step-by-step instructions from NICE & CDC guidelines',
        tips: ['Filter by category (Focus, Organization, Time Management)', 'Each skill includes research citations', 'Log practice to track what works for you', 'Strategies adapt to different age groups']
      },
      {
        id: 'myths',
        name: 'Myths vs Facts',
        description: 'Common ADHD misconceptions corrected with evidence from peer-reviewed research',
        tips: ['Share these facts with others who misunderstand ADHD', 'Each fact includes official source citations', 'Great for educating teachers and family members']
      },
      {
        id: 'treatment',
        name: 'Treatment Decision Tree',
        description: 'Interactive guide to understanding ADHD treatment options based on clinical guidelines',
        tips: ['Answer questions to explore personalized guidance', 'Always consult healthcare providers for treatment decisions', 'References UK NICE and US AAP guidelines']
      }
    ],
    keywords: ['adhd', 'attention', 'focus', 'hyperactivity', 'impulsivity', 'executive function', 'dopamine', 'medication', 'therapy', 'coping', 'school', 'homework', 'routine']
  },
  '/autism': {
    pageId: 'autism',
    pageName: 'Autism Hub',
    audiences: ['autistic individuals', 'parents', 'teachers', 'carers', 'employers'],
    welcomeMessage: `Hello! 🌟 Welcome to the **Autism Hub**!\n\nI'm your NeuroBreath Buddy – here to guide you through comprehensive autism support tools.\n\n**What you'll find here:**\n• 🧘 Calm Toolkit with breathing exercises\n• 📚 Skills Library with evidence-based strategies\n• 🎓 Education Pathways (EHCP/IEP/504 guides)\n• 💼 Workplace Adjustments Generator\n• 🔬 PubMed Research Search\n• 📄 Printable Templates & Resources\n\nWhether you're autistic, a parent, teacher, carer, or employer – everything is designed with your needs in mind. How can I help you today?`,
    quickQuestions: [
      'What calming tools are available?',
      'How do I request an EHCP or IEP?',
      'Show me workplace adjustments',
      'Where can I find printable resources?',
      'How do I search research articles?'
    ],
    sections: [
      {
        id: 'progress',
        name: 'Progress Dashboard',
        description: 'Track your journey with XP, levels, streaks, and achievements – all data stays on your device',
        tips: ['Check daily progress and personal bests', 'Earn badges by completing activities', 'Progress syncs across sessions safely']
      },
      {
        id: 'skills',
        name: 'Skills Library',
        description: 'Evidence-based autism strategies with step-by-step guidance, age adaptations, and NICE/CDC citations',
        tips: ['Search or filter skills by category', 'Each skill adapts to different ages', 'Log practice to track what helps', 'Great for home-school consistency']
      },
      {
        id: 'toolkit',
        name: 'Calm Toolkit',
        description: 'Breathing exercises and calming techniques for emotional regulation with safety guidance',
        tips: ['Choose techniques based on current state', 'Use guided timers for structured sessions', 'Track mood before and after', 'Suitable for all ages with adaptations']
      },
      {
        id: 'quests',
        name: 'Daily Quests',
        description: 'Daily challenges to build helpful routines with rewards and streak tracking',
        tips: ['Complete quests for XP rewards', 'Build streaks for consistency', 'New quests appear daily', 'Supports routine-building at home and school']
      },
      {
        id: 'pathways',
        name: 'Education Pathways',
        description: 'Step-by-step guides for UK EHCP, US IEP/504, and EU support with legal references',
        tips: ['Select your country for relevant guidance', 'Track progress through each step', 'Download templates for official requests', 'Includes appeal process information']
      },
      {
        id: 'resources',
        name: 'Resources Library',
        description: 'Printable templates, request letters, and advocacy documents for parents, teachers, and employers',
        tips: ['Filter by audience (Parent/Teacher/Employer)', 'Fill in templates and download as PDF', 'Use official letter formats', 'Supports home-school collaboration']
      },
      {
        id: 'research',
        name: 'PubMed Research',
        description: 'Search 35+ million peer-reviewed articles on autism, ADHD, and neurodevelopmental conditions',
        tips: ['Use preset topics for quick searches', 'Filter by year range (2015-2024)', 'Click links to view full articles on PubMed']
      },
      {
        id: 'crisis',
        name: 'Crisis Support',
        description: 'Emergency contacts and mental health resources by country (UK/US/EU)',
        tips: ['Select your country for local resources', 'Save important numbers', 'Available 24/7 for emergencies']
      }
    ],
    keywords: ['autism', 'autistic', 'asd', 'sensory', 'stimming', 'meltdown', 'shutdown', 'masking', 'communication', 'routine', 'ehcp', 'iep', 'school', 'workplace']
  },
  '/': {
    pageId: 'home',
    pageName: 'NeuroBreath Home',
    audiences: ['everyone', 'neurodivergent individuals', 'parents', 'teachers', 'carers'],
    welcomeMessage: `Welcome to **NeuroBreath**! 🧠✨\n\nI'm your friendly guide to this neurodiversity support platform.\n\n**Our Mission:** Empower neurodivergent people, parents, teachers, and carers with one trusted hub.\n\n**We offer:**\n• 🎯 **ADHD Hub** – Focus tools, gamified quests, evidence-based strategies\n• 🌟 **Autism Hub** – Calming techniques, education pathways, printable resources\n• 📊 Safe progress tracking\n• 🏠 Home-school collaboration tools\n\nAll content is evidence-informed, drawing from NICE, CDC, NHS, and peer-reviewed research.\n\nWhich hub would you like to explore?`,
    quickQuestions: [
      'What is NeuroBreath?',
      'Take me to the ADHD Hub',
      'Take me to the Autism Hub',
      'What tools are available?',
      'How is this evidence-based?'
    ],
    sections: [
      {
        id: 'adhd-hub',
        name: 'ADHD Hub',
        description: 'Comprehensive ADHD support with focus tools, gamified quests, and evidence-based strategies',
        tips: ['Visit /adhd for focus timers, daily quests, and skill strategies', 'Great for individuals, parents, teachers, and carers']
      },
      {
        id: 'autism-hub',
        name: 'Autism Hub',
        description: 'Evidence-based autism support with calming tools, education pathways, and printable resources',
        tips: ['Visit /autism for breathing exercises, EHCP/IEP guides, and workplace adjustments', 'Supports home-school collaboration']
      }
    ],
    keywords: ['neurobreath', 'neurodiversity', 'mental health', 'support', 'tools', 'adhd', 'autism', 'parents', 'teachers', 'school']
  },
  '/blog': {
    pageId: 'blog',
    pageName: 'Blog & Resources',
    audiences: ['everyone', 'neurodivergent individuals', 'parents', 'teachers', 'carers'],
    welcomeMessage: `Welcome to the **NeuroBreath Blog**! 📚✨\n\nI'm here to help you explore our evidence-based articles, research summaries, and practical guides.\n\n**What you'll find:**\n• 📖 In-depth articles on ADHD & autism\n• 🔬 Research-backed strategies\n• 💡 Practical tips for daily life\n• 🎓 Educational resources\n\nAll content is written with neurodivergent readers in mind. What would you like to learn about?`,
    quickQuestions: [
      'Show me ADHD articles',
      'Show me autism articles',
      'What are the latest posts?',
      'Find research summaries',
      'Take me to the main hubs'
    ],
    sections: [
      {
        id: 'articles',
        name: 'Blog Articles',
        description: 'Evidence-based articles on neurodiversity, ADHD, autism, and mental health',
        tips: ['Browse by category or search for specific topics', 'All articles include source citations', 'Share helpful articles with your support network']
      }
    ],
    keywords: ['blog', 'articles', 'research', 'guides', 'tips', 'evidence', 'neurodiversity']
  },
  '/tools': {
    pageId: 'tools',
    pageName: 'Interactive Tools',
    audiences: ['everyone', 'neurodivergent individuals', 'parents', 'teachers'],
    welcomeMessage: `Welcome to **Interactive Tools**! 🛠️✨\n\nI'm here to help you discover engaging tools designed for neurodivergent minds.\n\n**Available tools:**\n• 🎮 Focus games & activities\n• 🧘 Breathing exercises\n• 🎯 ADHD focus trainers\n• 🌈 Sensory-friendly activities\n• 📊 Progress trackers\n\nAll tools are designed with accessibility and neurodiversity in mind. What would you like to try?`,
    quickQuestions: [
      'Show me focus tools',
      'What breathing exercises are available?',
      'Show me ADHD tools',
      'What are the interactive games?',
      'How do I track progress?'
    ],
    sections: [
      {
        id: 'focus-tools',
        name: 'Focus Tools',
        description: 'Interactive tools to improve concentration and attention',
        tips: ['Start with shorter sessions', 'Track your progress over time', 'Adjust difficulty as needed']
      },
      {
        id: 'breathing-tools',
        name: 'Breathing Tools',
        description: 'Guided breathing exercises for calm and emotional regulation',
        tips: ['Choose exercises based on your current state', 'Use regularly for best results', 'Safe for all ages']
      }
    ],
    keywords: ['tools', 'interactive', 'focus', 'breathing', 'games', 'activities', 'training']
  },
  '/breathing': {
    pageId: 'breathing',
    pageName: 'Breathing Exercises',
    audiences: ['everyone', 'neurodivergent individuals', 'parents', 'teachers'],
    welcomeMessage: `Welcome to **Breathing Exercises**! 🌬️✨\n\nI'm here to guide you through calming breathing techniques.\n\n**Available exercises:**\n• 📦 Box Breathing - Equal counts for calm\n• 🌊 Coherent Breathing - Balance your nervous system\n• 🚨 SOS 60-Second Calm - Quick stress relief\n• 🌟 Extended Exhale - Activate relaxation\n\nAll techniques are safe, evidence-based, and suitable for all ages. Which would you like to try?`,
    quickQuestions: [
      'Which exercise should I start with?',
      'Show me quick calming techniques',
      'What is Box Breathing?',
      'How do breathing exercises help?',
      'Are these safe for children?'
    ],
    sections: [
      {
        id: 'exercises',
        name: 'Breathing Techniques',
        description: 'Guided breathing exercises with timers and instructions',
        tips: ['Start with shorter sessions', 'Stop if you feel dizzy', 'Practice regularly for best results', 'Great for managing anxiety and stress']
      }
    ],
    keywords: ['breathing', 'calm', 'anxiety', 'stress', 'relaxation', 'regulation', 'techniques']
  },
  '/resources': {
    pageId: 'resources',
    pageName: 'Resources & Downloads',
    audiences: ['parents', 'teachers', 'carers'],
    welcomeMessage: `Welcome to **Resources & Downloads**! 📄✨\n\nI'm here to help you find printable templates, guides, and support documents.\n\n**Available resources:**\n• 📋 EHCP/IEP request templates\n• 📊 Progress tracking sheets\n• 🎯 Visual schedules\n• 💼 Workplace adjustment letters\n• 🏫 School support documents\n\nAll resources are evidence-based and ready to print. What do you need?`,
    quickQuestions: [
      'Show me EHCP templates',
      'Where are IEP resources?',
      'Find visual schedules',
      'Show me workplace templates',
      'What can I print for teachers?'
    ],
    sections: [
      {
        id: 'downloads',
        name: 'Downloadable Resources',
        description: 'Printable templates, letters, and support documents',
        tips: ['All PDFs are printer-friendly', 'Customize templates before printing', 'Share with schools and workplaces', 'Free to use for personal needs']
      }
    ],
    keywords: ['resources', 'downloads', 'templates', 'printable', 'ehcp', 'iep', 'visual', 'schedules']
  },
  '/teacher-quick-pack': {
    pageId: 'teacher-quick-pack',
    pageName: 'Teacher Quick Pack',
    audiences: ['teachers', 'school staff'],
    welcomeMessage: `Welcome, Teachers! 👩‍🏫✨\n\nI'm here to help you access quick, practical classroom tools.\n\n**Quick Pack includes:**\n• 🎯 Ready-to-use strategies\n• 📋 Classroom adaptations\n• 🧩 Sensory support ideas\n• 📊 Behavior tracking templates\n• 🏫 SEND support guides\n\nAll resources are NICE & DfE evidence-based. What do you need for your classroom?`,
    quickQuestions: [
      'Show me ADHD classroom strategies',
      'What autism supports are available?',
      'Find sensory tools',
      'Show me behavior tracking',
      'Where are SEND guides?'
    ],
    sections: [
      {
        id: 'quick-strategies',
        name: 'Quick Strategies',
        description: 'Fast, practical classroom interventions for ADHD & autism',
        tips: ['Use during lessons for immediate support', 'Adapt to your classroom needs', 'Share with teaching assistants']
      }
    ],
    keywords: ['teacher', 'classroom', 'strategies', 'send', 'support', 'adaptations', 'behavior']
  },
  '/schools': {
    pageId: 'schools',
    pageName: 'Schools & Education',
    audiences: ['teachers', 'school staff', 'parents'],
    welcomeMessage: `Welcome to **Schools & Education**! 🏫✨\n\nI'm here to help schools and families work together.\n\n**What's here:**\n• 🎓 SEND support guidance\n• 📚 Evidence-based teaching strategies\n• 🤝 Home-school collaboration tools\n• 📊 Progress monitoring systems\n• 📋 Legal rights information\n\nSupporting neurodivergent learners together. How can I help?`,
    quickQuestions: [
      'What are SEND rights?',
      'Show me teaching strategies',
      'How do I request support?',
      'Find home-school tools',
      'What is an EHCP?'
    ],
    sections: [
      {
        id: 'send-guidance',
        name: 'SEND Guidance',
        description: 'Special Educational Needs and Disability support information',
        tips: ['Know your legal rights', 'Document everything', 'Collaborate with schools', 'Use official templates']
      }
    ],
    keywords: ['schools', 'education', 'send', 'ehcp', 'iep', 'support', 'teaching', 'rights']
  },
  '/get-started': {
    pageId: 'get-started',
    pageName: 'Getting Started',
    audiences: ['everyone', 'new users'],
    welcomeMessage: `Welcome! Let's Get Started! 🚀✨\n\nI'm here to help you navigate NeuroBreath for the first time.\n\n**Quick Start Guide:**\n• 🎯 Choose your hub (ADHD or Autism)\n• 📊 Explore interactive tools\n• 📚 Browse evidence-based strategies\n• 🏆 Start tracking progress\n• 📄 Find printable resources\n\nLet's find what works for you! What brings you here today?`,
    quickQuestions: [
      'I have ADHD - where do I start?',
      'I am autistic - show me resources',
      'I am a parent - what should I use?',
      'I am a teacher - show me tools',
      'How does progress tracking work?'
    ],
    sections: [
      {
        id: 'onboarding',
        name: 'Getting Started',
        description: 'Your introduction to NeuroBreath features and tools',
        tips: ['Take your time exploring', 'All progress is saved automatically', 'Revisit this guide anytime', 'Ask me questions as you go!']
      }
    ],
    keywords: ['getting started', 'onboarding', 'welcome', 'introduction', 'guide', 'first time']
  },
  '/about': {
    pageId: 'about',
    pageName: 'About NeuroBreath',
    audiences: ['everyone'],
    welcomeMessage: `Learn About **NeuroBreath**! 💙✨\n\nI'm here to share our story and mission.\n\n**About Us:**\n• 🎯 Our mission: Empower neurodivergent communities\n• 🔬 Evidence-based approach (NICE, CDC, NHS)\n• 🤝 Built with neurodivergent input\n• 🌍 Supporting families worldwide\n• 💝 Free, accessible tools for all\n\nWant to know more about who we are and what we do?`,
    quickQuestions: [
      'What is NeuroBreath?',
      'Who created this platform?',
      'How is this evidence-based?',
      'Is this free to use?',
      'How can I support this project?'
    ],
    sections: [
      {
        id: 'mission',
        name: 'Our Mission',
        description: 'Why NeuroBreath exists and who we serve',
        tips: ['Learn about our values', 'See our evidence sources', 'Meet the team', 'Join our community']
      }
    ],
    keywords: ['about', 'mission', 'team', 'story', 'values', 'evidence', 'who we are']
  }
};

export function getPageConfig(pathname: string): PageBuddyConfig {
  // Direct match
  if (pageBuddyConfigs[pathname]) {
    return pageBuddyConfigs[pathname];
  }
  
  // Partial match (e.g., /adhd/something matches /adhd)
  for (const key of Object.keys(pageBuddyConfigs)) {
    if (pathname.startsWith(key) && key !== '/') {
      return pageBuddyConfigs[key];
    }
  }
  
  // Default to home
  return pageBuddyConfigs['/'];
}

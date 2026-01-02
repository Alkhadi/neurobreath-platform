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

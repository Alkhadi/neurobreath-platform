/**
 * SEO Metadata Configuration for All Pages
 * 
 * This file contains metadata configurations for all pages in the site.
 * Import and use these in page files to ensure consistent, comprehensive SEO.
 */

import { Metadata } from 'next';
import { generatePageMetadata, generateConditionMetadata, generateBreathingTechniqueMetadata } from './metadata';

// ============================================================================
// MAIN CONDITION HUBS
// ============================================================================

export const anxietyMetadata: Metadata = generatePageMetadata({
  title: 'Anxiety Support Hub | Evidence-Based Tools & Resources',
  description: 'Professional anxiety management tools including breathing exercises, CBT thought records, grounding techniques, mood tracking, and progressive muscle relaxation. Evidence-based strategies backed by NHS, NICE, and clinical research.',
  path: '/anxiety',
  keywords: ['anxiety management', 'anxiety tools', 'anxiety UK', 'CBT anxiety', 'grounding techniques', 'anxiety relief'],
});

export const autismMetadata: Metadata = generateConditionMetadata({
  condition: 'Autism',
  description: 'Comprehensive autism support for teachers, parents, autistic individuals, and employers. Evidence-based strategies, visual schedules, calm toolkits, sensory support, and progress tracking backed by NICE, NHS, CDC research.',
  path: '/autism',
  keywords: ['autism support', 'autism strategies', 'visual schedules', 'PECS', 'AAC', 'sensory support', 'autism UK'],
});

export const adhdMetadata: Metadata = generateConditionMetadata({
  condition: 'ADHD',
  description: 'Comprehensive ADHD support for children, teens, parents, teachers, and carers. Interactive tools including focus timers, daily quests, skills library, and evidence-based strategies backed by research.',
  path: '/adhd',
  keywords: ['ADHD support', 'ADHD tools', 'ADHD focus timer', 'ADHD strategies', 'executive function', 'ADHD management UK'],
});

export const dyslexiaMetadata: Metadata = generateConditionMetadata({
  condition: 'Dyslexia',
  description: 'Evidence-based dyslexia reading training with phonics, fluency exercises, comprehension strategies, and progress tracking. Resources for children, parents, teachers, and carers.',
  path: '/dyslexia-reading-training',
  keywords: ['dyslexia support', 'phonics training', 'reading fluency', 'dyslexia UK', 'reading intervention', 'dyslexia strategies'],
});

// ============================================================================
// AUDIENCE-SPECIFIC CONDITION PAGES
// ============================================================================

export const adhdParentMetadata: Metadata = generateConditionMetadata({
  condition: 'ADHD',
  audience: 'parent',
  description: 'Practical ADHD strategies and support for parents. Evidence-based techniques for managing behaviour, improving focus, homework support, and building positive parent-child relationships.',
  path: '/conditions/adhd-parent',
  keywords: ['ADHD parent support', 'ADHD children', 'parenting ADHD', 'ADHD behaviour strategies', 'ADHD homework help'],
});

export const adhdTeacherMetadata: Metadata = generateConditionMetadata({
  condition: 'ADHD',
  audience: 'teacher',
  description: 'Professional ADHD support for teachers. Classroom strategies, differentiation techniques, behaviour management, and evidence-based interventions for students with ADHD.',
  path: '/conditions/adhd-teacher',
  keywords: ['ADHD classroom strategies', 'teaching ADHD students', 'SEND support', 'ADHD behaviour management', 'differentiation'],
});

export const autismParentMetadata: Metadata = generateConditionMetadata({
  condition: 'Autism',
  audience: 'parent',
  description: 'Comprehensive autism support for parents and carers. Visual supports, communication strategies, sensory management, and evidence-based approaches for supporting autistic children.',
  path: '/conditions/autism-parent',
  keywords: ['autism parent support', 'autistic children', 'visual supports', 'autism communication', 'sensory strategies'],
});

export const autismTeacherMetadata: Metadata = generateConditionMetadata({
  condition: 'Autism',
  audience: 'teacher',
  description: 'Professional autism support for teachers. Classroom accommodations, visual schedules, communication strategies, and evidence-based teaching approaches for autistic learners.',
  path: '/conditions/autism-teacher',
  keywords: ['autism classroom strategies', 'teaching autistic students', 'visual schedules', 'autism SEND', 'inclusive education'],
});

// ============================================================================
// BREATHING & TECHNIQUES
// ============================================================================

export const breathingMetadata: Metadata = generatePageMetadata({
  title: 'Breathing Exercises & Techniques for Calm, Focus & Sleep',
  description: 'Evidence-based breathing exercises including box breathing, coherent breathing, 4-7-8 technique, and SOS calm. Interactive tools for stress relief, anxiety management, better sleep, and improved focus.',
  path: '/breathing',
  keywords: ['breathing exercises', 'breathing techniques', 'calm breathing', 'box breathing', 'coherent breathing', 'stress relief breathing'],
});

export const breathTechnique478Metadata: Metadata = generateBreathingTechniqueMetadata({
  techniqueName: '4-7-8',
  description: 'The 4-7-8 breathing technique promotes relaxation and better sleep by regulating your nervous system through controlled breathing patterns.',
  slug: '4-7-8',
  duration: '5 minutes',
  benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system', 'Stress relief'],
});

export const breathTechniqueBoxMetadata: Metadata = generateBreathingTechniqueMetadata({
  techniqueName: 'Box Breathing',
  description: 'Box breathing (square breathing) is used by Navy SEALs and athletes for focus, stress management, and performance under pressure.',
  slug: 'box-breathing',
  duration: '5-10 minutes',
  benefits: ['Enhances focus', 'Reduces stress', 'Improves performance', 'Emotional regulation'],
});

export const breathTechniqueCoherentMetadata: Metadata = generateBreathingTechniqueMetadata({
  techniqueName: 'Coherent Breathing',
  description: 'Coherent breathing at 5-6 breaths per minute optimises heart rate variability and promotes nervous system balance for overall wellbeing.',
  slug: 'coherent',
  duration: '5-20 minutes',
  benefits: ['Optimises HRV', 'Nervous system balance', 'Emotional resilience', 'Stress reduction'],
});

export const breathTechniqueSOSMetadata: Metadata = generateBreathingTechniqueMetadata({
  techniqueName: '60-Second SOS',
  description: 'Quick emergency calm technique for acute stress, panic, or overwhelm. Rapid nervous system regulation in just 60 seconds.',
  slug: 'sos',
  duration: '1 minute',
  benefits: ['Rapid calm', 'Panic relief', 'Emergency de-escalation', 'Immediate stress relief'],
});

// ============================================================================
// TOOLS & INTERACTIVE FEATURES
// ============================================================================

export const toolsMetadata: Metadata = generatePageMetadata({
  title: 'Interactive Neurodiversity Tools & Resources',
  description: 'Free interactive tools for ADHD, autism, anxiety, dyslexia, and mental health support. Focus timers, breathing exercises, mood trackers, visual supports, and educational games.',
  path: '/tools',
  keywords: ['neurodiversity tools', 'ADHD tools', 'autism tools', 'anxiety tools', 'interactive resources', 'mental health tools'],
});

export const coachMetadata: Metadata = generatePageMetadata({
  title: 'AI Wellbeing Coach | Personalised Mental Health Support',
  description: 'Free AI-powered wellbeing coach providing personalised support, evidence-based strategies, and tailored recommendations for anxiety, ADHD, autism, stress, and mental health.',
  path: '/coach',
  keywords: ['AI wellbeing coach', 'mental health AI', 'personalised support', 'AI therapy', 'wellbeing assistant'],
});

// ============================================================================
// INFORMATION & STATIC PAGES
// ============================================================================

export const aboutMetadata: Metadata = generatePageMetadata({
  title: 'About NeuroBreath | Evidence-Based Neurodiversity Support',
  description: 'Learn about NeuroBreath\'s mission to provide evidence-based, accessible neurodiversity support. Our approach, research foundations, and commitment to inclusive mental health resources.',
  path: '/about',
  keywords: ['about NeuroBreath', 'neurodiversity platform', 'evidence-based support', 'mental health mission'],
});

export const contactMetadata: Metadata = generatePageMetadata({
  title: 'Contact Us | Get Support & Information',
  description: 'Contact the NeuroBreath team for support, partnership enquiries, feedback, or questions about our neurodiversity tools and resources.',
  path: '/contact',
  keywords: ['contact NeuroBreath', 'support enquiries', 'partnership', 'feedback'],
});

export const schoolsMetadata: Metadata = generatePageMetadata({
  title: 'NeuroBreath for Schools | SEND Support & Wellbeing Tools',
  description: 'Comprehensive SEND support for schools. Evidence-based tools and resources for supporting neurodiverse students with ADHD, autism, dyslexia, anxiety, and mental health needs.',
  path: '/schools',
  keywords: ['schools SEND', 'neurodiversity schools', 'wellbeing tools schools', 'SEND resources', 'inclusive education'],
});

export const getStartedMetadata: Metadata = generatePageMetadata({
  title: 'Get Started | Your Neurodiversity Journey Begins Here',
  description: 'Begin your neurodiversity support journey with NeuroBreath. Discover personalised tools, resources, and strategies for ADHD, autism, anxiety, dyslexia, and mental health.',
  path: '/get-started',
  keywords: ['get started neurodiversity', 'neurodiversity onboarding', 'mental health tools', 'ADHD getting started'],
});

export const resourcesMetadata: Metadata = generatePageMetadata({
  title: 'Resources Hub | Evidence-Based Guides & Downloads',
  description: 'Comprehensive library of evidence-based guides, worksheets, visual supports, and downloadable resources for ADHD, autism, dyslexia, anxiety, and neurodiversity support.',
  path: '/resources',
  keywords: ['neurodiversity resources', 'downloadable guides', 'ADHD resources', 'autism resources', 'mental health worksheets'],
});

export const blogMetadata: Metadata = generatePageMetadata({
  title: 'Wellbeing Blog | Evidence-Based Mental Health Insights',
  description: 'Expert articles on neurodiversity, mental health, ADHD, autism, anxiety, stress management, and wellbeing. Research-backed insights and practical strategies.',
  path: '/blog',
  keywords: ['neurodiversity blog', 'mental health articles', 'ADHD blog', 'autism blog', 'wellbeing insights'],
});

// ============================================================================
// EXPORT LOOKUP
// ============================================================================

export const PAGE_METADATA_LOOKUP: Record<string, Metadata> = {
  '/': {}, // Homepage uses default from layout
  '/anxiety': anxietyMetadata,
  '/autism': autismMetadata,
  '/adhd': adhdMetadata,
  '/dyslexia-reading-training': dyslexiaMetadata,
  '/breathing': breathingMetadata,
  '/tools': toolsMetadata,
  '/coach': coachMetadata,
  '/about': aboutMetadata,
  '/contact': contactMetadata,
  '/schools': schoolsMetadata,
  '/get-started': getStartedMetadata,
  '/resources': resourcesMetadata,
  '/blog': blogMetadata,
  '/conditions/adhd-parent': adhdParentMetadata,
  '/conditions/adhd-teacher': adhdTeacherMetadata,
  '/conditions/autism-parent': autismParentMetadata,
  '/conditions/autism-teacher': autismTeacherMetadata,
  '/techniques/4-7-8': breathTechnique478Metadata,
  '/techniques/box-breathing': breathTechniqueBoxMetadata,
  '/techniques/coherent': breathTechniqueCoherentMetadata,
  '/techniques/sos': breathTechniqueSOSMetadata,
};

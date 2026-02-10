// Skills library data - Comprehensive evidence-based autism support strategies
// Ported from ZIP implementation with full PubMed references and age adaptations

import { type Skill } from '@/types/autism';

export const skills: Skill[] = [
  {
    id: 'visual-schedules',
    title: 'Visual Schedules & Timetables',
    category: 'Visual Supports',
    tags: ['visual-supports', 'routines', 'transitions', 'school', 'home'],
    whyItHelps: 'Reduces anxiety by making the day predictable; helps with transitions and understanding what comes next',
    howToSteps: [
      'Choose format: photos, symbols (Widgit/Boardmaker), or written words depending on age and reading level',
      'Start simple: "Now" and "Next" board with 2 items',
      'Place schedule in consistent location (e.g., wall by door, desk corner)',
      'Review schedule together at start of day and before transitions',
      'Check off or remove items as completed',
      'Add "finished" box to show completion'
    ],
    pitfalls: [
      'Too many items at once - start with 2-3',
      'Forgetting to review before transitions',
      'Using images that are too abstract or unclear',
      'Not involving the person in checking off items'
    ],
    adaptations: {
      'early-years': 'Use real photos of actual activities/places. Keep to 2-3 items maximum.',
      'primary': 'Symbols or simple drawings work well. Can extend to 4-6 activities.',
      'secondary': 'Written words often sufficient. Can plan whole day or week.',
      'adult': 'Digital calendars, written lists, or apps. Focus on key changes or appointments.'
    },
    evidenceLinks: [
      {
        type: 'PubMed',
        title: 'Visual Activity Schedules as evidence-based practice',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25355388/',
        citation: 'PMID: 25355388'
      },
      {
        type: 'PubMed',
        title: 'Visual supports scoping review (home/community)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38300059/',
        citation: 'PMID: 38300059'
      },
      {
        type: 'NICE',
        title: 'NICE CG170: Support and management',
        url: 'https://www.nice.org.uk/guidance/cg170'
      }
    ],
    audience: ['teacher', 'parent', 'employer']
  },
  {
    id: 'now-next-boards',
    title: 'Now & Next Boards',
    category: 'Visual Supports',
    tags: ['visual-supports', 'transitions', 'routines'],
    whyItHelps: 'Immediate visual cue reduces transition anxiety and helps focus on current task',
    howToSteps: [
      'Create board with two sections labeled "Now" and "Next"',
      'Use Velcro or magnets so items can be easily changed',
      'Place visual (photo, symbol, or word card) in each section',
      'Point to "Now" to show current activity',
      'When transitioning, move "Next" card to "Now" and add new card to "Next"',
      'Give 2-minute and 1-minute verbal warnings before transition'
    ],
    pitfalls: [
      'Not updating the board promptly',
      'Using it only for non-preferred activities',
      'Forgetting to reference it during transitions'
    ],
    adaptations: {
      'early-years': 'Large, clear photos of actual toys/activities',
      'primary': 'Symbols or simple drawings with words underneath',
      'secondary': 'Can be digital on tablet or written list',
      'adult': 'Written list or app notification works for most'
    },
    evidenceLinks: [
      {
        type: 'PubMed',
        title: 'Digital activity schedules systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39370459/',
        citation: 'PMID: 39370459'
      },
      {
        type: 'Other',
        title: 'AET Good Autism Practice resources',
        url: 'https://www.autismeducationtrust.org.uk/resources'
      }
    ],
    audience: ['teacher', 'parent']
  },
  {
    id: 'transition-warnings',
    title: 'Transition Warnings & Timers',
    category: 'Routines & Transitions',
    tags: ['transitions', 'routines', 'anxiety'],
    whyItHelps: 'Sudden changes can be distressing; warnings provide time to mentally prepare and finish current activity',
    howToSteps: [
      'Give 5-minute, 2-minute, and 1-minute warnings before transition',
      'Use visual timer (Time Timer, sand timer) alongside verbal warning',
      'Keep warnings brief and consistent: "2 minutes until lunch"',
      'Allow brief time to finish current activity or find stopping point',
      'Pair with visual schedule so person can see what is next',
      'Use transition objects (e.g., carry favorite item to next activity)'
    ],
    pitfalls: [
      'Only giving one last-second warning',
      'Using vague language ("in a minute" could mean anything)',
      'Not allowing processing time between warning and transition'
    ],
    adaptations: {
      'early-years': 'Visual timer essential; combine with song or routine ("tidy-up song")',
      'primary': 'Visual and verbal; teach to check timer independently',
      'secondary': 'Can use watch/phone timer; may need less frequent warnings',
      'adult': 'Written schedule or digital alerts; allow independence in managing own time'
    },
    evidenceLinks: [
      {
        type: 'Other',
        title: 'EEF Special Educational Needs in Mainstream Schools',
        url: 'https://d2tic4wvo1iusb.cloudfront.net/eef-guidance-reports/send/EEF_Special_Educational_Needs_in_Mainstream_Schools_Guidance_Report.pdf'
      }
    ],
    audience: ['teacher', 'parent']
  },
  {
    id: 'pecs-aac',
    title: 'Communication Supports (PECS, AAC, Makaton)',
    category: 'Communication',
    tags: ['communication', 'visual-supports', 'school', 'home'],
    whyItHelps: 'Reduces frustration when spoken words are difficult; provides alternative way to request needs and express feelings',
    howToSteps: [
      'PECS: Person exchanges picture card for item/activity they want',
      'AAC apps (Proloquo2Go, TD Snap): Touch symbols/words to generate speech',
      'Makaton: Use signs alongside spoken words',
      'Start with highly motivating items (snacks, favorite toy)',
      'Model the system yourself - show how to use it',
      'Respond immediately and enthusiastically to communication attempts',
      'Expand gradually from requesting to commenting and social phrases'
    ],
    pitfalls: [
      'Waiting for child to initiate without modeling first',
      'Only using for requests, not social communication',
      'Not having system available at all times',
      'Expecting perfect use before responding'
    ],
    adaptations: {
      'early-years': 'Start with 1-2 highly preferred items; real photos work best',
      'primary': 'Expand vocabulary; introduce categories and sentences',
      'secondary': 'Can use text-based AAC; support literacy development',
      'adult': 'High-tech AAC if needed; ensure available in all settings including work'
    },
    evidenceLinks: [
      {
        type: 'PubMed',
        title: 'PECS teacher training RCT',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36220979/',
        citation: 'PMID: 36220979'
      },
      {
        type: 'PubMed',
        title: 'PECS effects summary evidence',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31667826/',
        citation: 'PMID: 31667826'
      },
      {
        type: 'NICE',
        title: 'NICE CG170 Communication recommendations',
        url: 'https://www.nice.org.uk/guidance/cg170'
      }
    ],
    audience: ['teacher', 'parent']
  },
  {
    id: 'sensory-breaks',
    title: 'Sensory Breaks & Movement',
    category: 'Sensory Support',
    tags: ['sensory', 'regulation', 'school', 'workplace'],
    whyItHelps: 'Helps regulate arousal level, improve focus, and prevent sensory overload or under-stimulation',
    howToSteps: [
      'Schedule breaks every 45-60 minutes (or more frequently if needed)',
      'Offer choice of activities: jump on trampoline, push heavy objects, use fidget tools, listen to music with headphones',
      'Create "sensory menu" with 3-5 options person can choose from',
      'Teach to recognize when break is needed ("How is my body feeling?")',
      'Ensure break space is available and calm',
      'Keep breaks brief (5-10 minutes) to maintain schedule flow'
    ],
    pitfalls: [
      'Only offering breaks as reward or withholding as punishment',
      'Waiting until meltdown to offer break - schedule proactively',
      'Offering alerting activities when person needs calming (or vice versa)'
    ],
    adaptations: {
      'early-years': 'Build movement into routine; offer sensory play throughout day',
      'primary': 'Teach to recognize own needs; use visual "break card" to request',
      'secondary': 'More independence; may prefer quiet space over movement',
      'adult': 'Workplace adjustments: short walks, fidget tools at desk, flexible break times'
    },
    evidenceLinks: [
      {
        type: 'PubMed',
        title: 'School-based inclusion interventions review',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11408347/'
      },
      {
        type: 'GOV',
        title: 'GOV.UK PINS (Partnerships for Inclusion)',
        url: 'https://www.gov.uk/guidance/partnerships-for-inclusion-of-neurodiversity-in-schools-pins'
      }
    ],
    audience: ['teacher', 'parent', 'autistic', 'employer']
  },
  {
    id: 'anxiety-strategies',
    title: 'Anxiety Management Techniques',
    category: 'Mental Health',
    tags: ['anxiety', 'regulation', 'mental-health'],
    whyItHelps: 'Anxiety is common in autistic people; strategies provide tools to manage overwhelm and prevent meltdowns',
    howToSteps: [
      'Teach to recognize body signs of anxiety ("My heart beats fast", "My tummy feels funny")',
      'Use visual scale (thermometer, 1-5 scale) to rate anxiety level',
      'Create personalized "calm down plan": 3-5 strategies that work for this person',
      'Options: deep breathing, squeeze hands, count to 10, safe space, favorite object, fidget tool',
      'Practice strategies when calm, not just during crisis',
      'Identify triggers and make plan to avoid or prepare for them',
      'Consider adapted CBT with professional if anxiety significantly impacts daily life'
    ],
    pitfalls: [
      'Expecting strategies to work instantly - practice needed',
      'Using same strategy for every situation - different tools for different needs',
      'Telling person to "calm down" without offering tools'
    ],
    adaptations: {
      'early-years': 'Simple sensory tools; co-regulation with adult essential',
      'primary': 'Begin teaching self-recognition; practice "zones of regulation"',
      'secondary': 'Can learn cognitive strategies; may benefit from talking therapies',
      'adult': 'CBT, mindfulness, medication options available; support to advocate for needs'
    },
    evidenceLinks: [
      {
        type: 'PubMed',
        title: 'Anxiety treatments in autistic children - systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38862906/',
        citation: 'PMID: 38862906'
      },
      {
        type: 'NICE',
        title: 'NICE CG170 Anxiety interventions',
        url: 'https://www.nice.org.uk/guidance/cg170'
      },
      {
        type: 'NHS',
        title: 'NHS Inform - Managing anxiety',
        url: 'https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/autistic-spectrum-disorder-asd/'
      }
    ],
    audience: ['teacher', 'parent', 'autistic']
  },
  {
    id: 'workplace-adjustments',
    title: 'Workplace Reasonable Adjustments',
    category: 'Workplace Support',
    tags: ['workplace', 'inclusion', 'sensory', 'communication'],
    whyItHelps: 'Small changes enable autistic employees to perform to their potential; legally required under Equality Act (UK) / ADA (US)',
    howToSteps: [
      'Request Access to Work assessment (UK) or ADA accommodation (US)',
      'Common adjustments: written instructions, quiet workspace or noise-cancelling headphones, flexible hours, advance notice of meetings',
      'Regular 1:1 check-ins with clear agenda',
      'Clear job descriptions and expectations in writing',
      'Allow WFH or hybrid if suitable',
      'Adjust fluorescent lighting if it causes sensory issues',
      'Provide social scripts for common workplace scenarios',
      'Mentor or workplace buddy for first months'
    ],
    pitfalls: [
      'Assuming adjustments are "special treatment" - they level the playing field',
      'Making adjustments without consulting the employee',
      'Not reviewing adjustments regularly - needs may change'
    ],
    adaptations: {
      'early-years': 'N/A',
      'primary': 'N/A',
      'secondary': 'Work experience placements - apply same principles',
      'adult': 'Full reasonable adjustments; focus on strengths; clear communication'
    },
    evidenceLinks: [
      {
        type: 'Other',
        title: 'Autism-Europe - Rights and Employment',
        url: 'https://www.autismeurope.org/what-we-do/areas-of-action/employment/'
      },
      {
        type: 'Other',
        title: 'Autism Society - Employment',
        url: 'https://www.autism-society.org/living-with-autism/autism-through-the-lifespan/adulthood/employment/'
      }
    ],
    audience: ['employer', 'autistic']
  }
];


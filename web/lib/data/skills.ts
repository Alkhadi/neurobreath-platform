import { Skill } from '../types';

export const skills: Skill[] = [
  {
    id: 'visual-schedules',
    title: 'Visual Schedules & Timetables',
    description: 'Use pictures, symbols or written words to show what will happen and in what order',
    tags: ['visual-supports', 'routines', 'transitions', 'school', 'home'],
    whyItHelps: 'Reduces anxiety by making the day predictable; helps with transitions and understanding what comes next',
    howToDo: [
      'Choose format: photos, symbols (Widgit/Boardmaker), or written words depending on age and reading level',
      'Start simple: "Now" and "Next" board with 2 items',
      'Place schedule in consistent location (e.g., wall by door, desk corner)',
      'Review schedule together at start of day and before transitions',
      'Check off or remove items as completed',
      'Add "finished" box to show completion'
    ],
    commonPitfalls: [
      'Too many items at once - start with 2-3',
      'Forgetting to review before transitions',
      'Using images that are too abstract or unclear',
      'Not involving the person in checking off items'
    ],
    ageAdaptations: {
      'early-years': 'Use real photos of actual activities/places. Keep to 2-3 items maximum.',
      'primary': 'Symbols or simple drawings work well. Can extend to 4-6 activities.',
      'secondary': 'Written words often sufficient. Can plan whole day or week.',
      'adult': 'Digital calendars, written lists, or apps. Focus on key changes or appointments.'
    },
    evidenceLinks: [
      {
        text: 'Visual Activity Schedules as evidence-based practice',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25355388/',
        source: 'PubMed',
        pmid: '25355388'
      },
      {
        text: 'Visual supports scoping review (home/community)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38300059/',
        source: 'PubMed',
        pmid: '38300059'
      },
      {
        text: 'NICE CG170: Support and management',
        url: 'https://www.nice.org.uk/guidance/cg170',
        source: 'NICE'
      }
    ],
    audienceRelevance: ['teacher', 'parent', 'employer']
  },
  {
    id: 'now-next-boards',
    title: 'Now & Next Boards',
    description: 'Simple 2-item visual showing current activity and what comes after',
    tags: ['visual-supports', 'transitions', 'routines'],
    whyItHelps: 'Immediate visual cue reduces transition anxiety and helps focus on current task',
    howToDo: [
      'Create board with two sections labeled "Now" and "Next"',
      'Use Velcro or magnets so items can be easily changed',
      'Place visual (photo, symbol, or word card) in each section',
      'Point to "Now" to show current activity',
      'When transitioning, move "Next" card to "Now" and add new card to "Next"',
      'Give 2-minute and 1-minute verbal warnings before transition'
    ],
    commonPitfalls: [
      'Not updating the board promptly',
      'Using it only for non-preferred activities',
      'Forgetting to reference it during transitions'
    ],
    ageAdaptations: {
      'early-years': 'Large, clear photos of actual toys/activities',
      'primary': 'Symbols or simple drawings with words underneath',
      'secondary': 'Can be digital on tablet or written list',
      'adult': 'Written list or app notification works for most'
    },
    evidenceLinks: [
      {
        text: 'Digital activity schedules systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39370459/',
        source: 'PubMed',
        pmid: '39370459'
      },
      {
        text: 'AET Good Autism Practice resources',
        url: 'https://www.autismeducationtrust.org.uk/resources',
        source: 'AET'
      }
    ]
  },
  {
    id: 'transition-warnings',
    title: 'Transition Warnings & Timers',
    description: 'Give advance notice before activities change using timers and countdowns',
    tags: ['transitions', 'routines', 'anxiety'],
    whyItHelps: 'Sudden changes can be distressing; warnings provide time to mentally prepare and finish current activity',
    howToDo: [
      'Give 5-minute, 2-minute, and 1-minute warnings before transition',
      'Use visual timer (Time Timer, sand timer) alongside verbal warning',
      'Keep warnings brief and consistent: "2 minutes until lunch"',
      'Allow brief time to finish current activity or find stopping point',
      'Pair with visual schedule so person can see what is next',
      'Use transition objects (e.g., carry favorite item to next activity)'
    ],
    commonPitfalls: [
      'Only giving one last-second warning',
      'Using vague language ("in a minute" could mean anything)',
      'Not allowing processing time between warning and transition'
    ],
    ageAdaptations: {
      'early-years': 'Visual timer essential; combine with song or routine ("tidy-up song")',
      'primary': 'Visual and verbal; teach to check timer independently',
      'secondary': 'Can use watch/phone timer; may need less frequent warnings',
      'adult': 'Written schedule or digital alerts; allow independence in managing own time'
    },
    evidenceLinks: [
      {
        text: 'EEF Special Educational Needs in Mainstream Schools',
        url: 'https://d2tic4wvo1iusb.cloudfront.net/eef-guidance-reports/send/EEF_Special_Educational_Needs_in_Mainstream_Schools_Guidance_Report.pdf',
        source: 'EEF'
      }
    ]
  },
  {
    id: 'pecs-aac',
    title: 'Communication Supports (PECS, AAC, Makaton)',
    description: 'Picture Exchange, speech apps, and signing to support expressive communication',
    tags: ['communication', 'visual-supports', 'school', 'home'],
    whyItHelps: 'Reduces frustration when spoken words are difficult; provides alternative way to request needs and express feelings',
    howToDo: [
      'PECS: Person exchanges picture card for item/activity they want',
      'AAC apps (Proloquo2Go, TD Snap): Touch symbols/words to generate speech',
      'Makaton: Use signs alongside spoken words',
      'Start with highly motivating items (snacks, favorite toy)',
      'Model the system yourself - show how to use it',
      'Respond immediately and enthusiastically to communication attempts',
      'Expand gradually from requesting to commenting and social phrases'
    ],
    commonPitfalls: [
      'Waiting for child to initiate without modeling first',
      'Only using for requests, not social communication',
      'Not having system available at all times',
      'Expecting perfect use before responding'
    ],
    ageAdaptations: {
      'early-years': 'Start with 1-2 highly preferred items; real photos work best',
      'primary': 'Expand vocabulary; introduce categories and sentences',
      'secondary': 'Can use text-based AAC; support literacy development',
      'adult': 'High-tech AAC if needed; ensure available in all settings including work'
    },
    evidenceLinks: [
      {
        text: 'PECS teacher training RCT',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36220979/',
        source: 'PubMed',
        pmid: '36220979'
      },
      {
        text: 'PECS effects summary evidence',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31667826/',
        source: 'PubMed',
        pmid: '31667826'
      },
      {
        text: 'NICE CG170 Communication recommendations',
        url: 'https://www.nice.org.uk/guidance/cg170',
        source: 'NICE'
      }
    ],
    audienceRelevance: ['teacher', 'parent']
  },
  {
    id: 'sensory-breaks',
    title: 'Sensory Breaks & Movement',
    description: 'Scheduled opportunities for sensory input and physical movement',
    tags: ['sensory', 'regulation', 'school', 'workplace'],
    whyItHelps: 'Helps regulate arousal level, improve focus, and prevent sensory overload or under-stimulation',
    howToDo: [
      'Schedule breaks every 45-60 minutes (or more frequently if needed)',
      'Offer choice of activities: jump on trampoline, push heavy objects, use fidget tools, listen to music with headphones',
      'Create "sensory menu" with 3-5 options person can choose from',
      'Teach to recognize when break is needed ("How is my body feeling?")',
      'Ensure break space is available and calm',
      'Keep breaks brief (5-10 minutes) to maintain schedule flow'
    ],
    commonPitfalls: [
      'Only offering breaks as reward or withholding as punishment',
      'Waiting until meltdown to offer break - schedule proactively',
      'Offering alerting activities when person needs calming (or vice versa)'
    ],
    ageAdaptations: {
      'early-years': 'Build movement into routine; offer sensory play throughout day',
      'primary': 'Teach to recognize own needs; use visual "break card" to request',
      'secondary': 'More independence; may prefer quiet space over movement',
      'adult': 'Workplace adjustments: short walks, fidget tools at desk, flexible break times'
    },
    evidenceLinks: [
      {
        text: 'School-based inclusion interventions review',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11408347/',
        source: 'PubMed'
      },
      {
        text: 'GOV.UK PINS (Partnerships for Inclusion)',
        url: 'https://www.gov.uk/guidance/partnerships-for-inclusion-of-neurodiversity-in-schools-pins',
        source: 'GOV.UK'
      }
    ],
    audienceRelevance: ['teacher', 'parent', 'autistic', 'employer']
  },
  {
    id: 'social-stories',
    title: 'Social Stories & Scripts',
    description: 'Short personalized stories that explain social situations and appropriate responses',
    tags: ['social', 'anxiety', 'school', 'community'],
    whyItHelps: 'Prepares for new or challenging situations; teaches expected behavior; reduces anxiety about unknowns',
    howToDo: [
      'Write in first person, present or future tense',
      'Include: where, when, who will be there, what will happen, how I might feel, what I can do',
      'Use positive, descriptive language ("I can...", "I will try...")',
      'Add photos or drawings of actual places/people if possible',
      'Read together before the event',
      'Keep it short: 5-8 sentences for younger children, 1 page for older',
      'Review afterwards: "What happened? How did it go?"'
    ],
    commonPitfalls: [
      'Making story too long or complex',
      'Using negative language ("I will not...")',
      'Only reading once - repetition helps',
      'Not personalizing to the individuals actual experience'
    ],
    ageAdaptations: {
      'early-years': 'Very simple, 3-5 sentences with photos',
      'primary': 'Can include feelings and coping strategies',
      'secondary': 'May prefer written guide or bullet points over story format',
      'adult': 'Social scripts for workplace situations (meetings, interviews, social events)'
    },
    evidenceLinks: [
      {
        text: 'AET Practitioner Guidance',
        url: 'https://www.autismeducationtrust.org.uk/resources/practitioner-guidance',
        source: 'AET'
      }
    ]
  },
  {
    id: 'anxiety-strategies',
    title: 'Anxiety Management Techniques',
    description: 'Tools to recognize, reduce and cope with anxious feelings',
    tags: ['anxiety', 'regulation', 'mental-health'],
    whyItHelps: 'Anxiety is common in autistic people; strategies provide tools to manage overwhelm and prevent meltdowns',
    howToDo: [
      'Teach to recognize body signs of anxiety ("My heart beats fast", "My tummy feels funny")',
      'Use visual scale (thermometer, 1-5 scale) to rate anxiety level',
      'Create personalized "calm down plan": 3-5 strategies that work for this person',
      'Options: deep breathing, squeeze hands, count to 10, safe space, favorite object, fidget tool',
      'Practice strategies when calm, not just during crisis',
      'Identify triggers and make plan to avoid or prepare for them',
      'Consider adapted CBT with professional if anxiety significantly impacts daily life'
    ],
    commonPitfalls: [
      'Expecting strategies to work instantly - practice needed',
      'Using same strategy for every situation - different tools for different needs',
      'Telling person to "calm down" without offering tools'
    ],
    ageAdaptations: {
      'early-years': 'Simple sensory tools; co-regulation with adult essential',
      'primary': 'Begin teaching self-recognition; practice "zones of regulation"',
      'secondary': 'Can learn cognitive strategies; may benefit from talking therapies',
      'adult': 'CBT, mindfulness, medication options available; support to advocate for needs'
    },
    evidenceLinks: [
      {
        text: 'Anxiety treatments in autistic children - systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38862906/',
        source: 'PubMed',
        pmid: '38862906'
      },
      {
        text: 'NICE CG170 Anxiety interventions',
        url: 'https://www.nice.org.uk/guidance/cg170',
        source: 'NICE'
      },
      {
        text: 'NHS Inform - Managing anxiety',
        url: 'https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/autistic-spectrum-disorder-asd/',
        source: 'NHS'
      }
    ]
  },
  {
    id: 'sleep-routines',
    title: 'Sleep Routines & Bedtime Supports',
    description: 'Consistent bedtime routine with sensory and visual supports for better sleep',
    tags: ['routines', 'sleep', 'sensory', 'home'],
    whyItHelps: 'Many autistic people have sleep difficulties; predictable routine and sensory adjustments improve sleep onset and quality',
    howToDo: [
      'Set consistent bedtime and wake time, even on weekends',
      'Create visual bedtime routine: 4-6 steps (bath, pajamas, story, lights out)',
      'Start wind-down 30-60 minutes before bed: dim lights, quiet activities',
      'Address sensory needs: weighted blanket, favorite pajamas, white noise or silence, room temperature',
      'Avoid screens 1 hour before bed (blue light disrupts melatonin)',
      'Use visual clock or timer to show when it is time to stay in bed',
      'Keep bedroom for sleep only, not play'
    ],
    commonPitfalls: [
      'Varying bedtime significantly',
      'Using bedroom for time-out or punishments',
      'Starting routine too late when child already overtired',
      'Giving up on routine too quickly - can take weeks to establish'
    ],
    ageAdaptations: {
      'early-years': 'Strong routine crucial; comfort object may help',
      'primary': 'Involve child in creating routine; teach relaxation',
      'secondary': 'May resist bedtime; negotiate reasonable time; address screen use',
      'adult': 'Sleep hygiene education; consider chronotype; address anxiety'
    },
    evidenceLinks: [
      {
        text: 'NICE CG170 Sleep recommendations',
        url: 'https://www.nice.org.uk/guidance/cg170',
        source: 'NICE'
      },
      {
        text: 'NHS - Sleep problems in autism',
        url: 'https://www.nhs.uk/conditions/autism/support/',
        source: 'NHS'
      }
    ],
    audienceRelevance: ['parent', 'autistic']
  },
  {
    id: 'peer-support',
    title: 'Peer-Mediated Support & Inclusion',
    description: 'Teaching peers to support social interaction and inclusion',
    tags: ['social', 'school', 'inclusion'],
    whyItHelps: 'Peers can be powerful models and supporters; reduces isolation and builds genuine friendships',
    howToDo: [
      'Select 2-3 socially skilled, empathetic peers',
      'Brief training: explain autism strengths, explain how to help (not fix)',
      'Teach specific strategies: offering choices, using visual supports, including in games',
      'Structure initial interactions: board games, shared interests, structured activities',
      'Adult facilitates at first, then gradually steps back',
      'Recognize and praise peers for inclusive behavior',
      'Monitor to prevent "helper" dynamic - aim for genuine friendship'
    ],
    commonPitfalls: [
      'Expecting peers to be therapists or carers',
      'Not training peers adequately',
      'Forcing interactions rather than facilitating natural connection',
      'Always pairing with same peer - spread inclusion'
    ],
    ageAdaptations: {
      'early-years': 'Adult-facilitated play; model parallel play',
      'primary': 'Structured activities; teach turn-taking',
      'secondary': 'Shared interest clubs; focus on authentic relationships',
      'adult': 'Workplace buddies; social groups based on interests'
    },
    evidenceLinks: [
      {
        text: 'Peer-mediated interventions systematic review',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4881558/',
        source: 'PubMed'
      },
      {
        text: 'DfE SEND Code of Practice',
        url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25',
        source: 'GOV.UK'
      }
    ],
    audienceRelevance: ['teacher']
  },
  {
    id: 'workplace-adjustments',
    title: 'Workplace Reasonable Adjustments',
    description: 'Modifications to support autistic employees in the workplace',
    tags: ['workplace', 'inclusion', 'sensory', 'communication'],
    whyItHelps: 'Small changes enable autistic employees to perform to their potential; legally required under Equality Act (UK) / ADA (US)',
    howToDo: [
      'Request Access to Work assessment (UK) or ADA accommodation (US)',
      'Common adjustments: written instructions, quiet workspace or noise-cancelling headphones, flexible hours, advance notice of meetings',
      'Regular 1:1 check-ins with clear agenda',
      'Clear job descriptions and expectations in writing',
      'Allow WFH or hybrid if suitable',
      'Adjust fluorescent lighting if it causes sensory issues',
      'Provide social scripts for common workplace scenarios',
      'Mentor or workplace buddy for first months'
    ],
    commonPitfalls: [
      'Assuming adjustments are "special treatment" - they level the playing field',
      'Making adjustments without consulting the employee',
      'Not reviewing adjustments regularly - needs may change'
    ],
    ageAdaptations: {
      'early-years': 'N/A',
      'primary': 'N/A',
      'secondary': 'Work experience placements - apply same principles',
      'adult': 'Full reasonable adjustments; focus on strengths; clear communication'
    },
    evidenceLinks: [
      {
        text: 'Autism-Europe - Rights and Employment',
        url: 'https://www.autismeurope.org/what-we-do/areas-of-action/employment/',
        source: 'Autism-Europe'
      },
      {
        text: 'Autism Society - Employment',
        url: 'https://www.autism-society.org/living-with-autism/autism-through-the-lifespan/adulthood/employment/',
        source: 'Autism-Europe'
      }
    ],
    audienceRelevance: ['employer', 'autistic']
  }
];

// Today's Plan Wizard Data
// Evidence-based action plans for different age bands, needs, and settings

export type AgeBand = 'early-years' | 'primary' | 'secondary' | 'adult';
export type MainNeed = 'transitions' | 'sensory' | 'communication' | 'anxiety' | 'sleep' | 'school-refusal' | 'workplace-stress';
export type Setting = 'home' | 'classroom' | 'community' | 'workplace';

export interface PlanAction {
  title: string;
  description: string;
  duration: string;
  evidence?: string;
}

export interface DailyPlan {
  doNow: PlanAction[];
  buildThisWeek: PlanAction[];
  measurement: {
    title: string;
    description: string;
    howTo: string;
  };
}

export interface PlanConfig {
  ageBand: AgeBand;
  mainNeed: MainNeed;
  setting: Setting;
}

// Action templates organized by need
const actionsByNeed: Record<MainNeed, {
  doNow: Record<AgeBand, PlanAction[]>;
  buildWeek: Record<AgeBand, PlanAction[]>;
  measurement: Record<AgeBand, { title: string; description: string; howTo: string }>;
}> = {
  transitions: {
    doNow: {
      'early-years': [
        {
          title: 'Create a Now/Next visual',
          description: 'Use pictures or symbols to show what\'s happening now and what comes next. Print or draw on paper.',
          duration: '3 minutes',
          evidence: 'NICE CG170 recommends visual supports for transitions'
        },
        {
          title: 'Give a 5-minute warning',
          description: 'Use a timer with visual/sound cue. Show "5 minutes left" with fingers and timer.',
          duration: '1 minute',
          evidence: 'Evidence-based practice for reducing transition anxiety'
        },
        {
          title: 'Offer a comfort item',
          description: 'Let child choose a familiar object to carry through the transition (toy, photo, fidget).',
          duration: '30 seconds'
        }
      ],
      primary: [
        {
          title: 'Review the visual schedule',
          description: 'Check the timetable together. Tick off completed activities. Point to what\'s next.',
          duration: '2 minutes',
          evidence: 'NICE CG170 recommends visual schedules'
        },
        {
          title: 'Use a countdown timer',
          description: 'Set a visual timer for 5 minutes before transition. Use consistent signal.',
          duration: '1 minute'
        },
        {
          title: 'Practice the transition script',
          description: 'Rehearse: "First [current], then [next], then [preferred]." Repeat 2-3 times.',
          duration: '2 minutes'
        }
      ],
      secondary: [
        {
          title: 'Check the digital schedule',
          description: 'Review phone/planner for next lesson. Set a 5-minute alarm reminder.',
          duration: '2 minutes'
        },
        {
          title: 'Prepare exit strategy',
          description: 'Identify quiet route to next class. Plan 2-minute buffer time.',
          duration: '3 minutes'
        },
        {
          title: 'Use grounding technique',
          description: 'Quick 5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.',
          duration: '2 minutes'
        }
      ],
      adult: [
        {
          title: 'Review meeting agenda',
          description: 'Read agenda 10 minutes early. Note discussion topics and expected duration.',
          duration: '5 minutes'
        },
        {
          title: 'Set transition buffer',
          description: 'Block 10 minutes between tasks. Use "Do Not Disturb" mode.',
          duration: '1 minute'
        },
        {
          title: 'Use sensory reset',
          description: 'Step away for 2 minutes. Deep breath, stretch, drink water.',
          duration: '2 minutes'
        }
      ]
    },
    buildWeek: {
      'early-years': [
        {
          title: 'Build a photo schedule',
          description: 'Take photos of daily routines. Laminate and velcro onto a board. Update each morning.',
          duration: 'Daily 5 min',
          evidence: 'Visual schedules reduce anxiety (NICE CG170)'
        },
        {
          title: 'Introduce "first-then" language',
          description: 'Consistently use "First [task], then [reward/preferred]" throughout the day.',
          duration: 'Ongoing'
        },
        {
          title: 'Create a transition song',
          description: 'Sing the same short song before every transition. Keep melody simple and consistent.',
          duration: 'Daily practice'
        }
      ],
      primary: [
        {
          title: 'Design a weekly planner',
          description: 'Create visual timetable with Velcro-backed cards. Practice "checking" completed tasks.',
          duration: 'Daily 5 min'
        },
        {
          title: 'Build transition scripts',
          description: 'Write 3 key transition scripts (home→school, lesson→lesson, school→home). Laminate and practice.',
          duration: '3× this week'
        },
        {
          title: 'Establish a "transition basket"',
          description: 'Pack bag the night before. Use checklist (visual or written). Reduce morning rush.',
          duration: 'Nightly routine'
        }
      ],
      secondary: [
        {
          title: 'Set up digital reminders',
          description: 'Use phone/smartwatch for lesson changes. Test alarms and adjust volume/vibration.',
          duration: 'Daily use'
        },
        {
          title: 'Map out quiet routes',
          description: 'Identify 2-3 less crowded paths between classes. Time them during quiet periods.',
          duration: '1× this week'
        },
        {
          title: 'Practice self-advocacy',
          description: 'Role-play asking for extra time or quiet space. Script: "I need a moment to prepare."',
          duration: '2× this week'
        }
      ],
      adult: [
        {
          title: 'Audit your calendar',
          description: 'Block 15-minute buffers between meetings. Mark as "Transition time" and protect them.',
          duration: 'Weekly review'
        },
        {
          title: 'Create work mode rituals',
          description: 'Design 3-minute "start" and "end" routines (e.g., tea→calendar→focus music).',
          duration: 'Daily practice'
        },
        {
          title: 'Build a sensory kit',
          description: 'Assemble desk items: noise-cancelling headphones, fidget, preferred snack, water bottle.',
          duration: '1× setup'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Count successful transitions',
        description: 'Track how many transitions happen without distress',
        howTo: 'Tally mark for each smooth transition. Target: 6/10 → 8/10 over 2 weeks.'
      },
      primary: {
        title: 'Transition ease rating',
        description: 'Child rates ease of each transition (thumbs up/down or 1-5 scale)',
        howTo: 'Quick check after transitions. Log daily. Look for patterns.'
      },
      secondary: {
        title: 'Self-report stress scale',
        description: 'Rate transition stress 1-10 before/after using strategies',
        howTo: 'Note in planner or phone. Compare weeks. Goal: Average drops 2+ points.'
      },
      adult: {
        title: 'Task transition efficiency',
        description: 'Time how long it takes to refocus after interruptions',
        howTo: 'Log 3 transitions per day for 1 week. Measure improvement with buffer times.'
      }
    }
  },

  sensory: {
    doNow: {
      'early-years': [
        {
          title: 'Offer sensory choices',
          description: 'Present 2 options: fidget toy, weighted lap pad, or quiet corner with cushions.',
          duration: '1 minute'
        },
        {
          title: 'Dim the lights',
          description: 'Reduce overhead lighting. Use lamps or natural light where possible.',
          duration: '30 seconds'
        },
        {
          title: 'Create a calm corner',
          description: 'Designate a quiet space with soft textures, dim lighting, and minimal visual clutter.',
          duration: '5 minutes setup'
        }
      ],
      primary: [
        {
          title: 'Use sensory break card',
          description: 'Give child a card to request 5-minute sensory break without explanation.',
          duration: '1 minute',
          evidence: 'Self-regulation tool recommended by NICE'
        },
        {
          title: 'Try ear defenders/headphones',
          description: 'Offer noise-reducing headphones. No music needed—just quiet.',
          duration: '30 seconds'
        },
        {
          title: 'Movement break',
          description: 'Quick movement: 10 star jumps, wall push-ups, or walk around building.',
          duration: '3 minutes'
        }
      ],
      secondary: [
        {
          title: 'Sensory check-in',
          description: 'Ask: "Too loud? Too bright? Too crowded?" Adjust if possible.',
          duration: '1 minute'
        },
        {
          title: 'Provide fidget tool',
          description: 'Offer discrete fidget (stress ball, therapy putty, smooth stone).',
          duration: '30 seconds'
        },
        {
          title: 'Change seating',
          description: 'Move to edge of room, near door, or away from noise sources.',
          duration: '2 minutes'
        }
      ],
      adult: [
        {
          title: 'Audit your workspace',
          description: 'Note: lighting (harsh?), noise (background hum?), smells, temperature.',
          duration: '3 minutes'
        },
        {
          title: 'Implement one adjustment',
          description: 'Change one thing now: desk lamp, noise-cancelling headphones, or fan.',
          duration: '2 minutes'
        },
        {
          title: 'Schedule sensory breaks',
          description: 'Block 10-minute breaks every 90 minutes. Walk outside or to quiet room.',
          duration: '1 minute'
        }
      ]
    },
    buildWeek: {
      'early-years': [
        {
          title: 'Create a sensory box',
          description: 'Collect preferred items: soft toy, textured fabric, squeeze ball, chewy necklace.',
          duration: '1× setup'
        },
        {
          title: 'Establish sensory routine',
          description: 'Offer sensory input before known triggers (e.g., morning sensory play before circle time).',
          duration: 'Daily 10 min'
        },
        {
          title: 'Identify sensory triggers',
          description: 'Log situations that cause distress. Note: sounds, lights, textures, smells.',
          duration: 'Daily notes'
        }
      ],
      primary: [
        {
          title: 'Build a sensory profile',
          description: 'Document: What helps? What hurts? Seeking or avoiding? Share with school.',
          duration: '1× detailed'
        },
        {
          title: 'Practice sensory language',
          description: 'Teach: "It\'s too loud/bright/busy." Role-play requesting breaks.',
          duration: '3× this week'
        },
        {
          title: 'Test calming tools',
          description: 'Try 3 tools: weighted lap pad, fidget, noise-cancelling headphones. Note preferences.',
          duration: 'Daily trial'
        }
      ],
      secondary: [
        {
          title: 'Map sensory-friendly spaces',
          description: 'Identify 3 quiet spots at school: library corner, sensory room, outside bench.',
          duration: '1× this week'
        },
        {
          title: 'Develop sensory toolkit',
          description: 'Pack bag: sunglasses, earplugs/headphones, fidget, water, snack.',
          duration: 'Daily carry'
        },
        {
          title: 'Practice self-advocacy',
          description: 'Script: "I need to step out for a sensory break." Rehearse with trusted adult.',
          duration: '2× this week'
        }
      ],
      adult: [
        {
          title: 'Request workplace adjustments',
          description: 'Email manager: desk lamp, noise-cancelling equipment, flexible seating. Use our template.',
          duration: '1× formal'
        },
        {
          title: 'Design sensory-friendly workspace',
          description: 'Adjust: lighting, reduce clutter, personalize with calming items.',
          duration: 'Ongoing tweaks'
        },
        {
          title: 'Establish sensory breaks',
          description: 'Block calendar for 10-minute breaks. Walk, stretch, or quiet room.',
          duration: 'Daily routine'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Meltdown frequency',
        description: 'Count sensory-related meltdowns per week',
        howTo: 'Tally in notebook. Track triggers. Goal: Reduce by 30% over 4 weeks.'
      },
      primary: {
        title: 'Sensory break usage',
        description: 'Track how often sensory breaks are used and if they help',
        howTo: 'Log each break + outcome (better/same/worse). Adjust tools as needed.'
      },
      secondary: {
        title: 'Comfort rating',
        description: 'Rate sensory comfort in different settings (1-10 scale)',
        howTo: 'Daily quick rate: classroom, cafeteria, hallway. Identify patterns.'
      },
      adult: {
        title: 'Productivity correlation',
        description: 'Track focus quality before/after sensory adjustments',
        howTo: 'Rate daily focus (1-10). Compare weeks with/without adjustments.'
      }
    }
  },

  communication: {
    doNow: {
      'early-years': [
        {
          title: 'Offer two choices',
          description: 'Hold up 2 objects or pictures. "Do you want [A] or [B]?" Wait for response.',
          duration: '1 minute',
          evidence: 'Choice-making supports communication (NICE CG170)'
        },
        {
          title: 'Use visual supports',
          description: 'Point to pictures/symbols while speaking. "First" and "Then" cards.',
          duration: '2 minutes'
        },
        {
          title: 'Reduce language',
          description: 'Use shorter sentences. Pause between instructions. Give processing time.',
          duration: 'Ongoing'
        }
      ],
      primary: [
        {
          title: 'Introduce PECS/AAC app',
          description: 'Download free AAC app (e.g., Cboard). Practice "I want [item]" exchange.',
          duration: '5 minutes',
          evidence: 'AAC supports communication (RCSLT guidance)'
        },
        {
          title: 'Create communication board',
          description: 'Print 6-10 key words/symbols (help, break, toilet, yes, no). Laminate.',
          duration: '5 minutes'
        },
        {
          title: 'Use visual scripts',
          description: 'Write/draw what to say in common situations. Practice together.',
          duration: '3 minutes'
        }
      ],
      secondary: [
        {
          title: 'Check comprehension',
          description: 'After instructions, ask: "Can you tell me what to do first?" Clarify as needed.',
          duration: '2 minutes'
        },
        {
          title: 'Provide written backup',
          description: 'Write down key points alongside verbal explanation. Use bullet points.',
          duration: '3 minutes'
        },
        {
          title: 'Allow processing time',
          description: 'After asking a question, count to 10 silently before repeating.',
          duration: 'Ongoing'
        }
      ],
      adult: [
        {
          title: 'Request agenda in advance',
          description: 'Email organizer: "Please send agenda 24 hours before meeting."',
          duration: '2 minutes'
        },
        {
          title: 'Use written communication',
          description: 'Follow up verbal discussions with email summary. Confirm understanding.',
          duration: '5 minutes'
        },
        {
          title: 'Set communication preferences',
          description: 'Inform team: "I process information better via email than phone."',
          duration: '3 minutes'
        }
      ]
    },
    buildWeek: {
      'early-years': [
        {
          title: 'Implement consistent AAC',
          description: 'Use same communication method across all settings. Train all adults.',
          duration: 'Daily use'
        },
        {
          title: 'Build core vocabulary',
          description: 'Focus on 10 high-frequency words: more, help, stop, go, yes, no, want, need.',
          duration: 'Daily practice'
        },
        {
          title: 'Create communication book',
          description: 'Photo album with pictures of people, places, activities. Use for conversation.',
          duration: '1× setup'
        }
      ],
      primary: [
        {
          title: 'Expand AAC vocabulary',
          description: 'Add 5 new words per week. Practice in natural situations.',
          duration: 'Daily integration'
        },
        {
          title: 'Practice social scripts',
          description: 'Role-play: greetings, asking for help, joining play. Use visual prompts.',
          duration: '3× this week'
        },
        {
          title: 'Teach repair strategies',
          description: 'If not understood, teach: repeat, rephrase, use AAC, or get help.',
          duration: '2× this week'
        }
      ],
      secondary: [
        {
          title: 'Develop self-advocacy',
          description: 'Script: "I need that in writing" or "Can you repeat that?" Practice with trusted adult.',
          duration: '3× this week'
        },
        {
          title: 'Use communication supports',
          description: 'Carry notebook or use phone notes for key points in conversations.',
          duration: 'Daily use'
        },
        {
          title: 'Build social phrase bank',
          description: 'List 10 common responses: "That\'s interesting," "I need to think about that," etc.',
          duration: '1× create'
        }
      ],
      adult: [
        {
          title: 'Establish communication protocol',
          description: 'Document preferences: email > phone, agenda required, 24hr notice for changes.',
          duration: '1× formal'
        },
        {
          title: 'Practice clarification',
          description: 'Script: "Just to confirm, you\'re saying [X]?" Use after verbal instructions.',
          duration: 'Ongoing'
        },
        {
          title: 'Set communication boundaries',
          description: 'Define: preferred contact hours, response time expectations, meeting preferences.',
          duration: '1× this week'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Communication attempts',
        description: 'Count intentional communication acts per day',
        howTo: 'Tally: words, signs, AAC, gestures, pointing. Track weekly growth.'
      },
      primary: {
        title: 'AAC usage',
        description: 'Track AAC exchanges per day and communication success',
        howTo: 'Log AAC use. Note if message was understood. Adjust vocabulary as needed.'
      },
      secondary: {
        title: 'Communication confidence',
        description: 'Self-rate comfort in different communication settings (1-10)',
        howTo: 'Rate after: presentations, group work, asking questions. Track over time.'
      },
      adult: {
        title: 'Misunderstanding frequency',
        description: 'Count communication breakdowns requiring clarification',
        howTo: 'Log weekly. Measure reduction after implementing strategies.'
      }
    }
  },

  anxiety: {
    doNow: {
      'early-years': [
        {
          title: 'Name the feeling',
          description: 'Point to emotion chart: "You look worried. Is that right?" Validate feelings.',
          duration: '2 minutes'
        },
        {
          title: 'Offer co-regulation',
          description: 'Sit nearby. Breathe slowly and visibly. Speak in calm, quiet voice.',
          duration: '5 minutes'
        },
        {
          title: 'Use comfort item',
          description: 'Offer familiar object: blanket, toy, photo of parent/carer.',
          duration: '1 minute'
        }
      ],
      primary: [
        {
          title: 'Quick breathing exercise',
          description: 'Box breathing: In-2-3-4, Hold-2-3-4, Out-2-3-4, Hold-2-3-4. Repeat 3 times.',
          duration: '2 minutes',
          evidence: 'Breathing exercises reduce acute anxiety (NHS)'
        },
        {
          title: 'Check worries',
          description: '"What are you worried about?" Write or draw it. Problem-solve together.',
          duration: '5 minutes'
        },
        {
          title: 'Use grounding',
          description: '5-4-3-2-1 technique: 5 see, 4 hear, 3 touch, 2 smell, 1 taste.',
          duration: '3 minutes'
        }
      ],
      secondary: [
        {
          title: 'Rate anxiety',
          description: 'Scale 1-10. "Where are you now? Where do you need to be?"',
          duration: '1 minute'
        },
        {
          title: 'Identify trigger',
          description: 'Ask: "What started this feeling?" Note patterns for future prevention.',
          duration: '3 minutes'
        },
        {
          title: 'Use coping strategy',
          description: 'Choose from personal toolkit: breathing, movement, sensory, script.',
          duration: '5 minutes'
        }
      ],
      adult: [
        {
          title: 'Pause and breathe',
          description: 'Coherent breathing: 5 seconds in, 5 seconds out. Continue for 2 minutes.',
          duration: '2 minutes'
        },
        {
          title: 'Write it down',
          description: 'Brain dump: write every worry. Categorize: can control / can\'t control.',
          duration: '5 minutes'
        },
        {
          title: 'Change environment',
          description: 'Step away from situation. Walk outside or to quiet space for 10 minutes.',
          duration: '10 minutes'
        }
      ]
    },
    buildWeek: {
      'early-years': [
        {
          title: 'Create worry box',
          description: 'Decorate a box. Draw/write worries on paper, "post" in box. Set aside for later.',
          duration: '1× setup'
        },
        {
          title: 'Build emotion vocabulary',
          description: 'Practice naming feelings daily. Use emotion cards or apps.',
          duration: 'Daily 5 min'
        },
        {
          title: 'Establish predictable routines',
          description: 'Same sequence for wake-up, bedtime, meals. Use visual schedule.',
          duration: 'Daily structure'
        }
      ],
      primary: [
        {
          title: 'Practice worry time',
          description: 'Set 10 minutes daily to talk about worries. Outside this time, "save for worry time."',
          duration: 'Daily 10 min'
        },
        {
          title: 'Build coping toolkit',
          description: 'Create list of 5 go-to strategies. Illustrate and laminate.',
          duration: '1× this week'
        },
        {
          title: 'Teach thought challenging',
          description: 'Is worry realistic? Likely? Helpful? Practice identifying unhelpful thoughts.',
          duration: '3× this week'
        }
      ],
      secondary: [
        {
          title: 'Implement anxiety journal',
          description: 'Daily log: trigger, anxiety level (1-10), strategy used, outcome.',
          duration: 'Daily 5 min'
        },
        {
          title: 'Practice exposure',
          description: 'List fears. Start with smallest. Do 1 small step this week.',
          duration: '1× small step'
        },
        {
          title: 'Develop self-compassion',
          description: 'When anxious, practice: "This is hard, and I\'m doing my best."',
          duration: '3× this week'
        }
      ],
      adult: [
        {
          title: 'Establish daily practices',
          description: 'Morning: 5-minute meditation. Evening: worry brain dump. Track consistency.',
          duration: 'Daily routine'
        },
        {
          title: 'Identify anxiety patterns',
          description: 'Log triggers, times, situations for 1 week. Look for preventable patterns.',
          duration: 'Daily logging'
        },
        {
          title: 'Build support network',
          description: 'Identify 3 people to contact when anxious. Script what to say.',
          duration: '1× this week'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Calm-down time',
        description: 'How long it takes to return to baseline after anxiety',
        howTo: 'Time from upset to calm. Track weekly. Goal: Reduce by 5 minutes.'
      },
      primary: {
        title: 'Anxiety frequency',
        description: 'Count anxiety episodes per week',
        howTo: 'Daily tally. Note: What helped? What didn\'t? Adjust strategies.'
      },
      secondary: {
        title: 'Anxiety intensity',
        description: 'Average anxiety rating (1-10) across situations',
        howTo: 'Rate 3× daily: morning, lunch, evening. Calculate weekly average.'
      },
      adult: {
        title: 'Functional impact',
        description: 'Days per week anxiety interferes with work/life',
        howTo: 'Daily check: Did anxiety stop me from doing something? Track reduction.'
      }
    }
  },

  sleep: {
    doNow: {
      'early-years': [
        {
          title: 'Start wind-down',
          description: 'Dim lights 30 minutes before bed. Turn off screens. Use calm voice.',
          duration: '2 minutes'
        },
        {
          title: 'Offer calming activity',
          description: 'Gentle options: soft music, rocking, massage, looking at picture book.',
          duration: '10 minutes'
        },
        {
          title: 'Check comfort',
          description: 'Is room temperature OK? Pajamas comfortable? Preferred toy nearby?',
          duration: '3 minutes'
        }
      ],
      primary: [
        {
          title: 'Review bedtime routine',
          description: 'Check visual schedule: bath, pajamas, teeth, story, bed. Follow same order.',
          duration: '3 minutes'
        },
        {
          title: 'Practice breathing',
          description: 'Lying down, breathe: In-4, Out-6. Repeat 10 times together.',
          duration: '5 minutes'
        },
        {
          title: 'Address worries',
          description: 'Quick check: "Anything on your mind?" Write it down, "deal with tomorrow."',
          duration: '5 minutes'
        }
      ],
      secondary: [
        {
          title: 'Screen curfew',
          description: 'All screens off 1 hour before bed. Use blue light filter if essential.',
          duration: '1 minute'
        },
        {
          title: 'Use sleep app',
          description: 'Download sleep sounds or meditation app. Try tonight.',
          duration: '5 minutes'
        },
        {
          title: 'Check caffeine',
          description: 'No caffeine after 2pm (includes energy drinks, chocolate, tea).',
          duration: '1 minute'
        }
      ],
      adult: [
        {
          title: 'Audit sleep hygiene',
          description: 'Check: room temp, light, noise, mattress comfort, caffeine intake.',
          duration: '5 minutes'
        },
        {
          title: 'Set screen alarm',
          description: 'Phone alarm 1 hour before target sleep: "Start wind-down now."',
          duration: '2 minutes'
        },
        {
          title: 'Brain dump',
          description: 'Write down everything on your mind. Close notebook. "For tomorrow."',
          duration: '5 minutes'
        }
      ]
    },
    buildWeek: {
      'early-years': [
        {
          title: 'Establish consistent routine',
          description: 'Same bedtime (±15 min). Same sequence of activities. Use visual schedule.',
          duration: 'Nightly'
        },
        {
          title: 'Create sleep-friendly environment',
          description: 'Blackout curtains, white noise machine, comfortable temperature (16-18°C).',
          duration: '1× setup'
        },
        {
          title: 'Build positive sleep associations',
          description: 'Keep bed for sleep only. If not asleep in 20 min, move to calm activity.',
          duration: 'Daily practice'
        }
      ],
      primary: [
        {
          title: 'Design bedtime visual',
          description: 'Create checklist with pictures: 7 steps from dinner to sleep. Tick off each night.',
          duration: 'Nightly use'
        },
        {
          title: 'Practice relaxation',
          description: 'Teach progressive muscle relaxation or guided imagery. Use nightly.',
          duration: 'Nightly 10 min'
        },
        {
          title: 'Track sleep patterns',
          description: 'Note: bedtime, fall-asleep time, wake time, night wakings. Look for patterns.',
          duration: 'Daily log'
        }
      ],
      secondary: [
        {
          title: 'Optimize sleep schedule',
          description: 'Calculate needed sleep (8-10 hrs). Count back from wake time. Adjust gradually.',
          duration: '1× planning'
        },
        {
          title: 'Build wind-down routine',
          description: '1 hour before bed: dim lights, calm activities (read, stretch, music). No screens.',
          duration: 'Nightly routine'
        },
        {
          title: 'Create worry plan',
          description: 'If can\'t sleep due to thoughts, write them down. Return to bed after 15 min.',
          duration: 'As needed'
        }
      ],
      adult: [
        {
          title: 'Implement sleep hygiene',
          description: 'Consistent sleep/wake times (weekends too). Room dark, cool, quiet.',
          duration: 'Daily discipline'
        },
        {
          title: 'Develop pre-sleep ritual',
          description: '30-minute routine: herbal tea, light reading, meditation, breathing.',
          duration: 'Nightly'
        },
        {
          title: 'Address sleep barriers',
          description: 'Identify: pain, anxiety, sensory issues, racing thoughts. Address one this week.',
          duration: '1× problem-solve'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Fall-asleep time',
        description: 'Minutes from "lights out" to asleep',
        howTo: 'Estimate nightly. Track weekly average. Goal: Under 30 minutes.'
      },
      primary: {
        title: 'Sleep quality',
        description: 'Child rates how rested they feel (1-5 scale with faces)',
        howTo: 'Morning check. Log for 2 weeks. Look for improvement trends.'
      },
      secondary: {
        title: 'Sleep efficiency',
        description: 'Time asleep ÷ time in bed × 100',
        howTo: 'Track for 1 week. Goal: >85% efficiency (8.5 hrs asleep in 10 hrs in bed).'
      },
      adult: {
        title: 'Daytime functioning',
        description: 'Rate alertness and focus during day (1-10)',
        howTo: 'Daily afternoon rating. Compare to sleep quality. Adjust routine.'
      }
    }
  },

  'school-refusal': {
    doNow: {
      'early-years': [
        {
          title: 'Validate feelings',
          description: '"I can see you\'re worried about school. That\'s OK. Let\'s talk about it."',
          duration: '3 minutes'
        },
        {
          title: 'Offer transition object',
          description: 'Pack comfort item: photo of family, small toy, sensory item to carry all day.',
          duration: '2 minutes'
        },
        {
          title: 'Set small goal',
          description: 'Not full day—just to door, or just morning. "We\'ll try this much today."',
          duration: '2 minutes'
        }
      ],
      primary: [
        {
          title: 'Identify specific worry',
          description: 'Ask: "What part of school is hardest?" (transition, lesson, social, sensory)',
          duration: '5 minutes'
        },
        {
          title: 'Problem-solve one thing',
          description: 'Pick the biggest worry. Brainstorm 3 solutions. Choose 1 to try today.',
          duration: '5 minutes'
        },
        {
          title: 'Create re-entry plan',
          description: 'Start small: half day, or favorite lesson. Build up gradually.',
          duration: '5 minutes'
        }
      ],
      secondary: [
        {
          title: 'List attendance barriers',
          description: 'Write: sensory overload? Social anxiety? Academic pressure? Bullying?',
          duration: '5 minutes'
        },
        {
          title: 'Contact school',
          description: 'Email SENCO/pastoral: "[Name] struggling. Can we meet to plan support?"',
          duration: '5 minutes'
        },
        {
          title: 'Set micro-goal',
          description: 'Today\'s goal: Get dressed, or arrive at school even if not entering.',
          duration: '2 minutes'
        }
      ],
      adult: [
        {
          title: 'Acknowledge the difficulty',
          description: 'Validate: workplace stress for autistic adults is real and significant.',
          duration: '2 minutes'
        },
        {
          title: 'Identify work triggers',
          description: 'What makes work unbearable? Open plan? Meetings? Unpredictability?',
          duration: '5 minutes'
        },
        {
          title: 'Request one adjustment',
          description: 'Email manager: "I need [X] to perform at my best." Be specific.',
          duration: '10 minutes'
        }
      ]
    },
    buildWeek: {
      'early-years': [
        {
          title: 'Build school positive associations',
          description: 'Visit school outside hours. Play in playground. Read books about school.',
          duration: '2× this week'
        },
        {
          title: 'Create morning routine',
          description: 'Visual schedule for getting ready. Predictable, calm, extra time.',
          duration: 'Daily'
        },
        {
          title: 'Establish school contact',
          description: 'Identify key person at school child trusts. Daily brief check-in.',
          duration: 'Daily connection'
        }
      ],
      primary: [
        {
          title: 'Develop graded exposure plan',
          description: 'Week 1: morning only. Week 2: add lunch. Week 3: full day. Adjust as needed.',
          duration: 'Phased increase'
        },
        {
          title: 'Address underlying issues',
          description: 'Work with school: sensory audit, social support, academic modifications.',
          duration: 'Ongoing collaboration'
        },
        {
          title: 'Create safety plan',
          description: 'Identify safe person/place at school. Practice asking for help.',
          duration: 'Set up + practice'
        }
      ],
      secondary: [
        {
          title: 'Coordinate support',
          description: 'Meeting with SENCO, form tutor, and student. Document adjustments needed.',
          duration: '1× formal meeting'
        },
        {
          title: 'Implement accommodations',
          description: 'Reduced timetable, quiet space access, flexible attendance, or home-school blend.',
          duration: 'Trial this week'
        },
        {
          title: 'Build peer support',
          description: 'Identify 1-2 trusted peers. Arrange to meet before lessons or at break.',
          duration: '2× this week'
        }
      ],
      adult: [
        {
          title: 'Formal accommodation request',
          description: 'Write to HR: reasonable adjustments needed (flexible hours, WFH, sensory changes).',
          duration: '1× formal'
        },
        {
          title: 'Identify triggers + solutions',
          description: 'Log what causes work avoidance. Match each with 1 adjustment or coping strategy.',
          duration: 'Daily logging'
        },
        {
          title: 'Build support network',
          description: 'Occupational health, union rep, autism support group. Don\'t navigate alone.',
          duration: '1× setup'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Attendance percentage',
        description: 'Days attended vs. days scheduled',
        howTo: 'Track weekly. Celebrate small wins. Goal: Gradual increase.'
      },
      primary: {
        title: 'Distress at school',
        description: 'Child rates daily comfort level (1-10)',
        howTo: 'Quick rating at end of day. Track patterns. Adjust support.'
      },
      secondary: {
        title: 'Lessons attended',
        description: 'Number of lessons attended per week',
        howTo: 'Track with school. Gradual increase. Link to specific supports.'
      },
      adult: {
        title: 'Work attendance',
        description: 'Days worked vs. days scheduled',
        howTo: 'Weekly log. Note: adjustments in place? Measure improvement.'
      }
    }
  },

  'workplace-stress': {
    doNow: {
      'early-years': [],
      primary: [],
      secondary: [],
      adult: [
        {
          title: 'Take a break',
          description: 'Step away for 10 minutes. Walk outside, find quiet space, or do breathing exercise.',
          duration: '10 minutes'
        },
        {
          title: 'Identify stressor',
          description: 'What just triggered stress? Write it down. Is it sensory, social, or task-related?',
          duration: '3 minutes'
        },
        {
          title: 'Request immediate adjustment',
          description: 'If possible: move workspace, use headphones, decline non-essential meeting.',
          duration: '5 minutes'
        }
      ]
    },
    buildWeek: {
      'early-years': [],
      primary: [],
      secondary: [],
      adult: [
        {
          title: 'Audit workplace stressors',
          description: 'List: open plan noise, fluorescent lights, unpredictability, social demands.',
          duration: '1× detailed'
        },
        {
          title: 'Request formal adjustments',
          description: 'Write to manager/HR: "As an autistic employee, I require [X] under Equality Act."',
          duration: '1× formal letter'
        },
        {
          title: 'Build workplace toolkit',
          description: 'Desk kit: noise-cancelling headphones, fidget, desk lamp, snacks, water.',
          duration: '1× setup'
        }
      ]
    },
    measurement: {
      'early-years': {
        title: 'Not applicable',
        description: 'This need is for adults only',
        howTo: 'N/A'
      },
      primary: {
        title: 'Not applicable',
        description: 'This need is for adults only',
        howTo: 'N/A'
      },
      secondary: {
        title: 'Not applicable',
        description: 'This need is for adults only',
        howTo: 'N/A'
      },
      adult: {
        title: 'Stress level tracking',
        description: 'Rate daily work stress (1-10) and identify patterns',
        howTo: 'Daily end-of-day rating. Log triggers. Measure reduction after adjustments.'
      }
    }
  }
};

export function generateDailyPlan(config: PlanConfig): DailyPlan {
  const { ageBand, mainNeed, setting } = config;
  
  const needData = actionsByNeed[mainNeed];
  
  return {
    doNow: needData.doNow[ageBand],
    buildThisWeek: needData.buildWeek[ageBand],
    measurement: needData.measurement[ageBand]
  };
}

// Helper to get friendly labels
export const ageBandLabels: Record<AgeBand, string> = {
  'early-years': 'Early Years (0-5)',
  'primary': 'Primary (5-11)',
  'secondary': 'Secondary (11-18)',
  'adult': 'Adult (18+)'
};

export const mainNeedLabels: Record<MainNeed, string> = {
  'transitions': 'Transitions & Changes',
  'sensory': 'Sensory Needs',
  'communication': 'Communication',
  'anxiety': 'Anxiety & Overwhelm',
  'sleep': 'Sleep Difficulties',
  'school-refusal': 'School/Work Attendance',
  'workplace-stress': 'Workplace Stress'
};

export const settingLabels: Record<Setting, string> = {
  'home': 'Home',
  'classroom': 'School/Classroom',
  'community': 'Community',
  'workplace': 'Workplace'
};

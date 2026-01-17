import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta, type PageEditorial } from '@/lib/editorial/pageEditorial';

export type GlossaryTag = 'condition' | 'tool' | 'education' | 'school' | 'workplace' | 'parenting' | 'evidence';

export interface GlossaryCitation {
  label: string;
  url: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  localeVariants: {
    uk: { spelling: string; notes: string; examples: string[] };
    us: { spelling: string; notes: string; examples: string[] };
  };
  partOfSpeech?: string;
  plainEnglishDefinition: string;
  extendedDefinition: string;
  whyItMattersHere: string;
  commonMisunderstandings: string[];
  relatedTerms: string[];
  tags: GlossaryTag[];
  recommendedNextLinks: {
    journey: string;
    guides: string[];
    tool?: string;
  };
  citationsByRegion: {
    uk: GlossaryCitation[];
    us: GlossaryCitation[];
    global: GlossaryCitation[];
  };
  reviewedAt: string;
  reviewIntervalDays: number;
  editorial?: PageEditorial;
}

const defaultCitations = () => ({ uk: [], us: [], global: [] });

const withDefaults = (
  term: Omit<GlossaryTerm, 'citationsByRegion' | 'reviewedAt' | 'reviewIntervalDays' | 'editorial'> &
    Partial<Pick<GlossaryTerm, 'citationsByRegion' | 'reviewedAt' | 'reviewIntervalDays' | 'editorial'>>,
) => {
  const citationsByRegion = term.citationsByRegion ?? defaultCitations();
  const reviewedAt = term.reviewedAt ?? '2026-01-17';
  const reviewIntervalDays = term.reviewIntervalDays ?? 180;
  const citationsCount =
    citationsByRegion.uk.length + citationsByRegion.us.length + citationsByRegion.global.length;

  return {
    citationsByRegion,
    reviewedAt,
    reviewIntervalDays,
    editorial:
      term.editorial ??
      createEditorialMeta({
        authorId: 'nb-editorial-team',
        reviewerId: 'nb-evidence-review',
        editorialRoleNotes: 'Reviewed for clarity, safety language, and glossary consistency.',
        createdAt: reviewedAt,
        updatedAt: reviewedAt,
        reviewedAt,
        reviewIntervalDays,
        changeLog: createChangeLog([
          createChangeLogEntry(reviewedAt, 'Initial glossary definition published.', 'content'),
        ]),
        citationsSummary: createCitationsSummary(citationsCount, citationsCount ? ['A', 'B'] : ['C']),
      }),
    ...term,
  };
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  withDefaults({
    id: 'adhd',
    term: 'ADHD',
    localeVariants: {
      uk: { spelling: 'ADHD', notes: 'Short for Attention Deficit Hyperactivity Disorder.', examples: ['ADHD can affect focus and planning.'] },
      us: { spelling: 'ADHD', notes: 'Short for Attention Deficit Hyperactivity Disorder.', examples: ['ADHD can affect focus and planning.'] },
    },
    plainEnglishDefinition:
      'ADHD is a way some people experience attention, activity level, and impulse control differently. It can make starting, focusing, or finishing tasks harder in some settings.',
    extendedDefinition:
      'ADHD is a neurodevelopmental profile linked to differences in attention regulation and executive function. People may be quick thinkers or creative problem-solvers while also finding sustained focus or organisation challenging. Experiences vary across environments and across the lifespan. Support often includes routines, skill-building, and practical accommodations.',
    whyItMattersHere: 'NeuroBreath focuses on practical routines and tools that can reduce day‑to‑day friction for attention and planning.',
    commonMisunderstandings: [
      'ADHD is just a lack of effort or willpower.',
      'Everyone with ADHD is hyperactive.',
      'Only children experience ADHD.',
    ],
    relatedTerms: ['executive-function', 'attention-regulation', 'time-blindness'],
    tags: ['condition', 'education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd', 'adhd-break-planning'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'autism',
    term: 'Autism',
    localeVariants: {
      uk: { spelling: 'Autism', notes: 'Sometimes called autism spectrum condition.', examples: ['Autism can affect sensory processing and communication.'] },
      us: { spelling: 'Autism', notes: 'Sometimes called autism spectrum disorder.', examples: ['Autism can affect sensory processing and communication.'] },
    },
    plainEnglishDefinition:
      'Autism is a neurodevelopmental difference that can affect communication, sensory processing, and routines. People experience it in many different ways.',
    extendedDefinition:
      'Autism describes a wide range of strengths and support needs. Some people seek predictability, while others have strong focus on specific interests. Sensory differences and social communication differences can influence daily life. Support is individual and should respect preferences and autonomy.',
    whyItMattersHere: 'NeuroBreath provides sensory‑friendly routines and practical guides that respect autistic preferences.',
    commonMisunderstandings: ['Autism looks the same for everyone.', 'Autism is caused by parenting.', 'All autistic people lack empathy.'],
    relatedTerms: ['sensory-differences', 'stimming', 'masking'],
    tags: ['condition', 'education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset', 'autism-transition-support'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'dyslexia',
    term: 'Dyslexia',
    localeVariants: {
      uk: { spelling: 'Dyslexia', notes: 'A learning difference related to reading and language processing.', examples: ['Dyslexia can affect decoding and spelling.'] },
      us: { spelling: 'Dyslexia', notes: 'A learning difference related to reading and language processing.', examples: ['Dyslexia can affect decoding and spelling.'] },
    },
    plainEnglishDefinition:
      'Dyslexia is a learning difference that can make reading, spelling, and word recognition harder. It is not linked to intelligence.',
    extendedDefinition:
      'Dyslexia affects how people process written language and sounds in words. Many people benefit from structured, multisensory approaches and consistent practice. Reading confidence often improves with supportive routines. Dyslexia is lifelong, but strengths and strategies can grow over time.',
    whyItMattersHere: 'Our reading routines and tools aim to build confidence through manageable, repeatable steps.',
    commonMisunderstandings: ['Dyslexia means reading letters backwards.', 'Dyslexia is caused by laziness.', 'Adults cannot improve reading skills.'],
    relatedTerms: ['phonics', 'decoding', 'reading-confidence'],
    tags: ['condition', 'education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home', 'reading-confidence-in-class'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'dyspraxia-dcd',
    term: 'Dyspraxia (DCD)',
    localeVariants: {
      uk: { spelling: 'Dyspraxia (DCD)', notes: 'Also called Developmental Coordination Disorder.', examples: ['Dyspraxia can affect coordination and planning.'] },
      us: { spelling: 'Dyspraxia (DCD)', notes: 'Also called Developmental Coordination Disorder.', examples: ['Dyspraxia can affect coordination and planning.'] },
    },
    plainEnglishDefinition:
      'Dyspraxia, or DCD, can make coordination and planning movements more difficult. It can also affect organisation and writing stamina.',
    extendedDefinition:
      'Developmental Coordination Disorder is linked to motor planning differences. People may find handwriting, sports, or multi‑step tasks more effortful. Support focuses on breaking tasks down, using visual prompts, and practising skills in small steps. Strengths can include problem‑solving and creativity.',
    whyItMattersHere: 'Structured routines and clear steps can reduce effort and build confidence.',
    commonMisunderstandings: ['Dyspraxia only affects sports.', 'It is the same as dyslexia.', 'People will just grow out of it.'],
    relatedTerms: ['organisation', 'executive-function', 'visual-timetable'],
    tags: ['condition', 'education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['focus-sprints-for-adhd', 'adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'dyscalculia',
    term: 'Dyscalculia',
    localeVariants: {
      uk: { spelling: 'Dyscalculia', notes: 'A learning difference related to numbers and maths.', examples: ['Dyscalculia can affect number sense.'] },
      us: { spelling: 'Dyscalculia', notes: 'A learning difference related to numbers and math.', examples: ['Dyscalculia can affect number sense.'] },
    },
    plainEnglishDefinition:
      'Dyscalculia is a learning difference that can make number sense and maths steps harder. It can affect estimating, timing, and calculations.',
    extendedDefinition:
      'Dyscalculia impacts how people understand numbers and sequences. Some people find mental maths and multi‑step calculations especially challenging. Visual supports, clear steps, and real‑world examples can help. Progress is possible with patient, structured practice.',
    whyItMattersHere: 'NeuroBreath focuses on practical routines that reduce overwhelm and support learning confidence.',
    commonMisunderstandings: ['It is just being bad at maths.', 'Only children are affected.', 'More pressure fixes it.'],
    relatedTerms: ['working-memory', 'executive-function', 'math-support'],
    tags: ['condition', 'education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class', 'reading-routine-at-home'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'dysgraphia',
    term: 'Dysgraphia',
    localeVariants: {
      uk: { spelling: 'Dysgraphia', notes: 'A learning difference affecting writing.', examples: ['Dysgraphia can affect handwriting and spelling.'] },
      us: { spelling: 'Dysgraphia', notes: 'A learning difference affecting writing.', examples: ['Dysgraphia can affect handwriting and spelling.'] },
    },
    plainEnglishDefinition:
      'Dysgraphia is a learning difference that makes writing slower or more tiring. It can affect handwriting, spelling, and organising ideas on paper.',
    extendedDefinition:
      'Dysgraphia involves differences in fine motor control and writing organisation. People may know what they want to say but struggle to get it onto the page. Supports can include assistive technology, planning tools, and reduced copying demands. Confidence grows with patient, structured practice.',
    whyItMattersHere: 'We encourage practical supports and clear, bite‑sized steps for writing tasks.',
    commonMisunderstandings: ['Messy writing means a lack of effort.', 'Typing is cheating.', 'Dysgraphia is the same as dyslexia.'],
    relatedTerms: ['assistive-technology', 'executive-function', 'organisation'],
    tags: ['condition', 'education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'executive-function',
    term: 'Executive function',
    localeVariants: {
      uk: { spelling: 'Executive function', notes: 'Skills for planning, organising, and self‑control.', examples: ['Executive function helps you start and finish tasks.'] },
      us: { spelling: 'Executive function', notes: 'Skills for planning, organizing, and self‑control.', examples: ['Executive function helps you start and finish tasks.'] },
    },
    plainEnglishDefinition:
      'Executive function is the set of skills that help you plan, start, and finish tasks. It includes organising, switching focus, and managing impulses.',
    extendedDefinition:
      'Executive function covers task initiation, working memory, and flexible thinking. When these skills are taxed, everyday tasks can feel harder even if motivation is high. Clear steps, visual prompts, and predictable routines can make a big difference. Support is about removing friction, not forcing willpower.',
    whyItMattersHere: 'Many NeuroBreath tools are designed to reduce executive function load with small, structured steps.',
    commonMisunderstandings: ['Executive function problems mean laziness.', 'People just need more discipline.', 'These skills are fixed and cannot improve.'],
    relatedTerms: ['task-initiation', 'working-memory', 'organisation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd', 'adhd-break-planning'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'working-memory',
    term: 'Working memory',
    localeVariants: {
      uk: { spelling: 'Working memory', notes: 'Holding information in mind while using it.', examples: ['Working memory helps with multi‑step tasks.'] },
      us: { spelling: 'Working memory', notes: 'Holding information in mind while using it.', examples: ['Working memory helps with multi‑step tasks.'] },
    },
    plainEnglishDefinition:
      'Working memory is your ability to hold information in mind while you use it. It helps with instructions, problem solving, and remembering steps.',
    extendedDefinition:
      'Working memory supports tasks like mental maths, following directions, and keeping track of goals. When it is overloaded, people may lose their place or forget steps. Visual cues, checklists, and short chunks can help. Support works best when it reduces how much needs to be held in mind at once.',
    whyItMattersHere: 'Our routines often use checklists and short steps to reduce working‑memory strain.',
    commonMisunderstandings: ['Working memory is the same as long‑term memory.', 'You can fix it just by trying harder.'],
    relatedTerms: ['executive-function', 'processing-speed', 'task-initiation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning', 'focus-sprints-for-adhd'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'processing-speed',
    term: 'Processing speed',
    localeVariants: {
      uk: { spelling: 'Processing speed', notes: 'The pace at which information is understood and used.', examples: ['Processing speed can affect how quickly tasks feel.'] },
      us: { spelling: 'Processing speed', notes: 'The pace at which information is understood and used.', examples: ['Processing speed can affect how quickly tasks feel.'] },
    },
    plainEnglishDefinition:
      'Processing speed is how quickly your brain takes in and uses information. Some people need a little more time to respond or switch tasks.',
    extendedDefinition:
      'Processing speed affects how fast someone can read, make decisions, or move between steps. Slower processing does not mean lower ability; it often means tasks take longer or need extra time. Allowing time, reducing time pressure, and using clear cues can help. Supports focus on pacing, not pushing faster.',
    whyItMattersHere: 'Time‑friendly routines and clear steps reduce pressure and support confidence.',
    commonMisunderstandings: ['Slower processing means less intelligence.', 'People just need to hurry up.'],
    relatedTerms: ['working-memory', 'time-management', 'planning-fallacy'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'attention-regulation',
    term: 'Attention regulation',
    localeVariants: {
      uk: { spelling: 'Attention regulation', notes: 'The ability to direct and sustain attention.', examples: ['Attention regulation can be harder in noisy settings.'] },
      us: { spelling: 'Attention regulation', notes: 'The ability to direct and sustain attention.', examples: ['Attention regulation can be harder in noisy settings.'] },
    },
    plainEnglishDefinition:
      'Attention regulation is the ability to start, stay with, and shift attention when needed. It can vary with stress, noise, or interest.',
    extendedDefinition:
      'Attention regulation includes sustaining focus and switching between tasks. People may find it easier to focus on high‑interest tasks and harder to persist with boring ones. External structure, timers, and clear prompts can make attention more reliable. Support should be practical and kind, not punitive.',
    whyItMattersHere: 'NeuroBreath tools provide short focus routines that support attention without overload.',
    commonMisunderstandings: ['If someone is interested, they can always focus.', 'Attention challenges are just bad habits.'],
    relatedTerms: ['hyperfocus', 'focus-sprints', 'executive-function'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'executive-dysfunction',
    term: 'Executive dysfunction',
    localeVariants: {
      uk: { spelling: 'Executive dysfunction', notes: 'When planning and organisation feel especially difficult.', examples: ['Executive dysfunction can make starting tasks harder.'] },
      us: { spelling: 'Executive dysfunction', notes: 'When planning and organization feel especially difficult.', examples: ['Executive dysfunction can make starting tasks harder.'] },
    },
    plainEnglishDefinition:
      'Executive dysfunction means the skills that manage planning and task‑starting are harder to use in that moment. It is about brain load, not effort.',
    extendedDefinition:
      'Executive dysfunction describes times when executive function skills are less available. Stress, fatigue, or sensory overload can reduce capacity. People may struggle to start tasks, sequence steps, or hold multiple items in mind. Support focuses on simplifying tasks and reducing decision load.',
    whyItMattersHere: 'We design routines to reduce decision fatigue and lower the activation barrier.',
    commonMisunderstandings: ['It is the same as laziness.', 'More pressure will fix it.'],
    relatedTerms: ['executive-function', 'task-initiation', 'planning-fallacy'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'task-initiation',
    term: 'Task initiation',
    localeVariants: {
      uk: { spelling: 'Task initiation', notes: 'Starting a task or first step.', examples: ['Task initiation can be harder during stress.'] },
      us: { spelling: 'Task initiation', notes: 'Starting a task or first step.', examples: ['Task initiation can be harder during stress.'] },
    },
    plainEnglishDefinition:
      'Task initiation is the ability to start a task. Many people need a clear, small first step to begin.',
    extendedDefinition:
      'Task initiation is one of the executive function skills. When it is difficult, even simple tasks can feel stuck. A tiny, concrete first step can create momentum. Timers, body doubling, and checklists can help reduce the activation barrier.',
    whyItMattersHere: 'Our starter routines focus on small, achievable first steps.',
    commonMisunderstandings: ['If someone cares, they will start immediately.', 'Starting is always the hardest part for everyone.'],
    relatedTerms: ['executive-function', 'body-doubling', 'focus-sprints'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'time-blindness',
    term: 'Time blindness',
    localeVariants: {
      uk: { spelling: 'Time blindness', notes: 'Losing track of time or how long tasks take.', examples: ['Time blindness can affect planning.'] },
      us: { spelling: 'Time blindness', notes: 'Losing track of time or how long tasks take.', examples: ['Time blindness can affect planning.'] },
    },
    plainEnglishDefinition:
      'Time blindness is difficulty sensing how much time has passed or how long tasks will take. It can lead to rushing or running late.',
    extendedDefinition:
      'People with time blindness may underestimate task length or lose track during activities. Visual timers, reminders, and buffer time can reduce stress. It is a common experience in ADHD and other neurodivergent profiles. Support is about making time visible, not blaming the person.',
    whyItMattersHere: 'We encourage short timed sprints and visible timers to support pacing.',
    commonMisunderstandings: ['People with time blindness do not care about being late.', 'A watch alone fixes the issue.'],
    relatedTerms: ['planning-fallacy', 'focus-sprints', 'executive-function'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'hyperfocus',
    term: 'Hyperfocus',
    localeVariants: {
      uk: { spelling: 'Hyperfocus', notes: 'Intense focus on a task or interest.', examples: ['Hyperfocus can make time feel invisible.'] },
      us: { spelling: 'Hyperfocus', notes: 'Intense focus on a task or interest.', examples: ['Hyperfocus can make time feel invisible.'] },
    },
    plainEnglishDefinition:
      'Hyperfocus is intense concentration on a task or interest. It can feel absorbing and make it hard to switch tasks.',
    extendedDefinition:
      'Hyperfocus can be a strength, supporting deep work and creativity. It can also make transitions difficult, especially when tasks are interrupted. Helpful strategies include timers, planned breaks, and clear stopping points. It is not a choice or a sign of laziness when stopping is hard.',
    whyItMattersHere: 'Our routines offer structured breaks so focus can be sustained without burnout.',
    commonMisunderstandings: ['Hyperfocus means someone can focus on anything.', 'It is always a problem.'],
    relatedTerms: ['attention-regulation', 'break-planning', 'time-blindness'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'rejection-sensitivity',
    term: 'Rejection sensitivity',
    localeVariants: {
      uk: { spelling: 'Rejection sensitivity', notes: 'Strong emotional response to perceived rejection.', examples: ['Rejection sensitivity can make feedback feel intense.'] },
      us: { spelling: 'Rejection sensitivity', notes: 'Strong emotional response to perceived rejection.', examples: ['Rejection sensitivity can make feedback feel intense.'] },
    },
    plainEnglishDefinition:
      'Rejection sensitivity is a strong emotional reaction to real or perceived criticism. It can make feedback feel very intense.',
    extendedDefinition:
      'People with rejection sensitivity may notice social cues quickly and feel hurt when feedback is unclear. It can show up as anxiety, withdrawal, or over‑preparing. Clear communication, reassurance, and predictable expectations can help. This is about emotional processing, not being overly sensitive on purpose.',
    whyItMattersHere: 'Our guidance encourages supportive language and clear expectations.',
    commonMisunderstandings: ['It is just being dramatic.', 'You can just ignore it.'],
    relatedTerms: ['emotional-regulation', 'masking', 'self-advocacy'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-emotional-regulation',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'emotional-regulation',
    term: 'Emotional regulation',
    localeVariants: {
      uk: { spelling: 'Emotional regulation', notes: 'Managing emotions in a steady way.', examples: ['Emotional regulation helps with transitions.'] },
      us: { spelling: 'Emotional regulation', notes: 'Managing emotions in a steady way.', examples: ['Emotional regulation helps with transitions.'] },
    },
    plainEnglishDefinition:
      'Emotional regulation is the ability to notice feelings and manage them in a helpful way. It helps people recover after stress or overwhelm.',
    extendedDefinition:
      'Emotional regulation includes noticing body signals, using calming strategies, and asking for support. It can be harder during fatigue or sensory overload. Skills can be built through routines, co‑regulation, and safe environments. The goal is not to suppress feelings but to recover and feel steady.',
    whyItMattersHere: 'Many NeuroBreath tools are focused on calm and grounding routines.',
    commonMisunderstandings: ['Regulation means never feeling upset.', 'It is only a children’s issue.'],
    relatedTerms: ['self-regulation', 'co-regulation', 'grounding'],
    tags: ['education', 'parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes', 'body-scan-for-stress'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'self-regulation',
    term: 'Self‑regulation',
    localeVariants: {
      uk: { spelling: 'Self‑regulation', notes: 'Using your own strategies to stay steady.', examples: ['Self‑regulation can include breathing or movement.'] },
      us: { spelling: 'Self‑regulation', notes: 'Using your own strategies to stay steady.', examples: ['Self‑regulation can include breathing or movement.'] },
    },
    plainEnglishDefinition:
      'Self‑regulation means using your own strategies to stay calm and focused. It can include breathing, movement, or quiet time.',
    extendedDefinition:
      'Self‑regulation involves noticing signals from the body and choosing strategies to feel steadier. It can be harder when tired, hungry, or overloaded. People often use tools like breathing, sensory supports, and structured breaks. It is a skill that grows with practice and support.',
    whyItMattersHere: 'Our tools provide short routines that build self‑regulation skills.',
    commonMisunderstandings: ['Self‑regulation should be instant.', 'It means handling everything alone.'],
    relatedTerms: ['co-regulation', 'grounding', 'breath-counting'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['body-scan-for-stress'],
      tool: 'coherent-breathing',
    },
  }),
  withDefaults({
    id: 'co-regulation',
    term: 'Co‑regulation',
    localeVariants: {
      uk: { spelling: 'Co‑regulation', notes: 'Support from another person to help feel steady.', examples: ['Co‑regulation can be a calm voice or presence.'] },
      us: { spelling: 'Co‑regulation', notes: 'Support from another person to help feel steady.', examples: ['Co‑regulation can be a calm voice or presence.'] },
    },
    plainEnglishDefinition:
      'Co‑regulation is when another person helps you feel calm and steady. It can be a calm voice, presence, or shared routine.',
    extendedDefinition:
      'Co‑regulation is common for children and adults during stress. It involves supportive cues, predictable routines, and calm environments. Over time, co‑regulation can build self‑regulation skills. It is not dependency; it is a healthy support strategy.',
    whyItMattersHere: 'Our guides include language for parents, teachers, and supporters.',
    commonMisunderstandings: ['Co‑regulation means someone cannot regulate themselves.', 'It is only for young children.'],
    relatedTerms: ['self-regulation', 'emotional-regulation', 'grounding'],
    tags: ['parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['autism-sensory-reset'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'masking',
    term: 'Masking',
    localeVariants: {
      uk: { spelling: 'Masking', notes: 'Hiding or camouflaging traits to fit in.', examples: ['Masking can be tiring over time.'] },
      us: { spelling: 'Masking', notes: 'Hiding or camouflaging traits to fit in.', examples: ['Masking can be tiring over time.'] },
    },
    plainEnglishDefinition:
      'Masking is when someone hides or changes behaviours to fit in. It can be exhausting and affect wellbeing.',
    extendedDefinition:
      'Masking can include copying social behaviours, suppressing stims, or forcing eye contact. It may help people avoid judgement but can increase stress and fatigue. Safe spaces and supportive relationships can reduce the need to mask. Respecting preferences and autonomy is important.',
    whyItMattersHere: 'We aim for affirming language that does not demand masking.',
    commonMisunderstandings: ['Masking means someone is not really autistic.', 'Everyone masks in the same way.'],
    relatedTerms: ['autism', 'stimming', 'burnout'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'stimming',
    term: 'Stimming',
    localeVariants: {
      uk: { spelling: 'Stimming', notes: 'Self‑stimulating movement or sound.', examples: ['Stimming can help with regulation.'] },
      us: { spelling: 'Stimming', notes: 'Self‑stimulating movement or sound.', examples: ['Stimming can help with regulation.'] },
    },
    plainEnglishDefinition:
      'Stimming is a self‑stimulating movement or sound that helps someone regulate. It can include rocking, fidgeting, or humming.',
    extendedDefinition:
      'Stimming can support focus, reduce anxiety, or manage sensory input. It is often a healthy, self‑regulating behaviour. The goal is to support safe stimming rather than suppress it. Context matters; safety and comfort should guide any adjustments.',
    whyItMattersHere: 'We include sensory‑friendly strategies that respect regulation needs.',
    commonMisunderstandings: ['Stimming is always a problem.', 'Stimming should be stopped.'],
    relatedTerms: ['sensory-differences', 'co-regulation', 'fidget-tools'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'sensory-overload',
    term: 'Sensory overload',
    localeVariants: {
      uk: { spelling: 'Sensory overload', notes: 'Feeling overwhelmed by sensory input.', examples: ['Sensory overload can feel sudden or intense.'] },
      us: { spelling: 'Sensory overload', notes: 'Feeling overwhelmed by sensory input.', examples: ['Sensory overload can feel sudden or intense.'] },
    },
    plainEnglishDefinition:
      'Sensory overload happens when sights, sounds, or sensations feel too intense. It can lead to shutdowns or meltdowns.',
    extendedDefinition:
      'When sensory input exceeds what someone can comfortably process, the body can go into stress mode. People may need quieter spaces, reduced stimulation, or grounding routines. Overload is not a behaviour choice; it is a nervous system response. Predictability and sensory tools can help.',
    whyItMattersHere: 'We provide grounding routines and sensory‑friendly guides for overload moments.',
    commonMisunderstandings: ['Overload is attention‑seeking.', 'People should just tolerate it.'],
    relatedTerms: ['sensory-differences', 'meltdown', 'shutdown'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset', 'breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'sensory-seeking',
    term: 'Sensory seeking',
    localeVariants: {
      uk: { spelling: 'Sensory seeking', notes: 'Seeking extra sensory input.', examples: ['Sensory seeking can include movement or touch.'] },
      us: { spelling: 'Sensory seeking', notes: 'Seeking extra sensory input.', examples: ['Sensory seeking can include movement or touch.'] },
    },
    plainEnglishDefinition:
      'Sensory seeking means looking for extra sensory input, like movement or pressure. It can help someone feel regulated.',
    extendedDefinition:
      'People may seek movement, deep pressure, or strong sensory input to feel focused or calm. Providing safe options, like fidgets or movement breaks, can help. Sensory seeking is not misbehaviour; it is often a regulation need. Support focuses on safe, acceptable outlets.',
    whyItMattersHere: 'We include strategies for safe sensory outlets and structured breaks.',
    commonMisunderstandings: ['Sensory seeking is just restlessness.', 'It should be stopped immediately.'],
    relatedTerms: ['sensory-differences', 'fidget-tools', 'break-planning'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'sensory-avoiding',
    term: 'Sensory avoiding',
    localeVariants: {
      uk: { spelling: 'Sensory avoiding', notes: 'Avoiding overwhelming sensory input.', examples: ['Sensory avoiding can include headphones or quiet spaces.'] },
      us: { spelling: 'Sensory avoiding', notes: 'Avoiding overwhelming sensory input.', examples: ['Sensory avoiding can include headphones or quiet spaces.'] },
    },
    plainEnglishDefinition:
      'Sensory avoiding means trying to reduce or escape strong sensory input. People may seek quiet or predictable spaces.',
    extendedDefinition:
      'Some people are more sensitive to noise, light, or touch and avoid these triggers. Avoiding is not a refusal; it is a protective response. Supports can include sensory breaks, noise‑reducing tools, and predictable environments. Respecting preferences improves safety and comfort.',
    whyItMattersHere: 'Our guidance encourages creating calmer environments and offering choices.',
    commonMisunderstandings: ['Sensory avoiding is rudeness.', 'People can just get used to it.'],
    relatedTerms: ['sensory-differences', 'grounding', 'sensory-kit'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'sensory-differences',
    term: 'Sensory differences',
    localeVariants: {
      uk: { spelling: 'Sensory differences', notes: 'Differences in how sensory input is processed.', examples: ['Sensory differences can be about sound, light, or touch.'] },
      us: { spelling: 'Sensory differences', notes: 'Differences in how sensory input is processed.', examples: ['Sensory differences can be about sound, light, or touch.'] },
    },
    plainEnglishDefinition:
      'Sensory differences mean people experience sights, sounds, or touch differently. Some inputs can feel stronger, weaker, or unpredictable.',
    extendedDefinition:
      'Sensory processing can vary between people and within the same person across the day. Sensory differences can affect focus, comfort, and emotions. Supports include predictable routines, sensory tools, and choice. Understanding sensory profiles helps reduce stress and improve participation.',
    whyItMattersHere: 'We design calm, choice‑based routines that respect sensory needs.',
    commonMisunderstandings: ['Everyone experiences sensory input the same way.', 'Sensory needs are just preferences.'],
    relatedTerms: ['sensory-overload', 'sensory-seeking', 'sensory-avoiding'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'meltdown',
    term: 'Meltdown',
    localeVariants: {
      uk: { spelling: 'Meltdown', notes: 'An intense response to overwhelm.', examples: ['A meltdown can happen after sensory overload.'] },
      us: { spelling: 'Meltdown', notes: 'An intense response to overwhelm.', examples: ['A meltdown can happen after sensory overload.'] },
    },
    plainEnglishDefinition:
      'A meltdown is an intense response to overwhelm. It can look like crying, shouting, or shutting down and is not deliberate behaviour.',
    extendedDefinition:
      'Meltdowns can happen when stress or sensory input exceeds someone’s capacity. They are a nervous system response, not a choice. Support focuses on safety, reducing input, and offering calm co‑regulation. After a meltdown, recovery time and gentle support are important.',
    whyItMattersHere: 'We provide compassionate guidance that avoids blame and prioritises safety.',
    commonMisunderstandings: ['Meltdowns are tantrums.', 'Discipline will stop meltdowns.'],
    relatedTerms: ['sensory-overload', 'shutdown', 'co-regulation'],
    tags: ['education', 'parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'shutdown',
    term: 'Shutdown',
    localeVariants: {
      uk: { spelling: 'Shutdown', notes: 'A withdrawn response to overwhelm.', examples: ['Shutdowns can involve silence or stillness.'] },
      us: { spelling: 'Shutdown', notes: 'A withdrawn response to overwhelm.', examples: ['Shutdowns can involve silence or stillness.'] },
    },
    plainEnglishDefinition:
      'A shutdown is a withdrawn response to overwhelm. Someone may become very quiet, still, or unable to communicate.',
    extendedDefinition:
      'Shutdowns can be a protective response when the nervous system is overloaded. People may need a quieter space, time, and reduced demands. Support should be calm and non‑pressuring. Recovery can take time and should be respected.',
    whyItMattersHere: 'Our guidance focuses on safety and calm recovery strategies.',
    commonMisunderstandings: ['Shutdowns are intentional avoidance.', 'Talking more will fix it.'],
    relatedTerms: ['sensory-overload', 'meltdown', 'grounding'],
    tags: ['education', 'parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'overwhelm',
    term: 'Overwhelm',
    localeVariants: {
      uk: { spelling: 'Overwhelm', notes: 'Feeling overloaded or unable to cope with demands.', examples: ['Overwhelm can happen when tasks pile up.'] },
      us: { spelling: 'Overwhelm', notes: 'Feeling overloaded or unable to cope with demands.', examples: ['Overwhelm can happen when tasks pile up.'] },
    },
    plainEnglishDefinition:
      'Overwhelm is a feeling of being overloaded by tasks, emotions, or sensory input. It can make thinking and decision‑making harder.',
    extendedDefinition:
      'Overwhelm is often a sign that demands exceed current capacity. It can show up as shutdown, irritability, or avoidance. Reducing inputs, simplifying steps, and adding recovery breaks can help. Support is about pacing and clarity, not pressure.',
    whyItMattersHere: 'Our routines reduce task load and offer quick resets for overwhelm.',
    commonMisunderstandings: ['Overwhelm is just stress.', 'People should push through it.'],
    relatedTerms: ['stress', 'sensory-overload', 'executive-dysfunction'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'burnout',
    term: 'Burnout',
    localeVariants: {
      uk: { spelling: 'Burnout', notes: 'Exhaustion after prolonged stress.', examples: ['Burnout can affect motivation and energy.'] },
      us: { spelling: 'Burnout', notes: 'Exhaustion after prolonged stress.', examples: ['Burnout can affect motivation and energy.'] },
    },
    plainEnglishDefinition:
      'Burnout is deep exhaustion after long‑term stress. It can reduce energy, focus, and enjoyment.',
    extendedDefinition:
      'Burnout often involves physical fatigue, emotional exhaustion, and reduced motivation. It can happen when demands stay high without enough recovery. Rest, boundaries, and gentle routines can help rebuild capacity. It is not a personal failure.',
    whyItMattersHere: 'We emphasise pacing, recovery, and small sustainable routines.',
    commonMisunderstandings: ['Burnout is just a bad day.', 'People can simply take a weekend off to fix it.'],
    relatedTerms: ['stress', 'sleep-hygiene', 'overwhelm'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['wind-down-routine'],
      tool: 'sleep-tools',
    },
  }),
  withDefaults({
    id: 'stress',
    term: 'Stress',
    localeVariants: {
      uk: { spelling: 'Stress', notes: 'The body’s response to pressure or demand.', examples: ['Stress can build when schedules are busy.'] },
      us: { spelling: 'Stress', notes: 'The body’s response to pressure or demand.', examples: ['Stress can build when schedules are busy.'] },
    },
    plainEnglishDefinition:
      'Stress is the body’s response to pressure or demand. A little can help focus, but too much can feel overwhelming.',
    extendedDefinition:
      'Stress can affect sleep, focus, and emotions. When it becomes chronic, it can reduce capacity and increase overwhelm. Short calming routines, predictable schedules, and supportive environments can help. It is a normal response, but it deserves care and attention.',
    whyItMattersHere: 'We provide fast, practical resets and steady routines for stress support.',
    commonMisunderstandings: ['Stress is always bad.', 'People should just ignore stress signals.'],
    relatedTerms: ['anxiety', 'grounding', 'coherent-breathing'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes', 'body-scan-for-stress'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'anxiety',
    term: 'Anxiety',
    localeVariants: {
      uk: { spelling: 'Anxiety', notes: 'Feeling worried or on edge.', examples: ['Anxiety can show up as racing thoughts.'] },
      us: { spelling: 'Anxiety', notes: 'Feeling worried or on edge.', examples: ['Anxiety can show up as racing thoughts.'] },
    },
    plainEnglishDefinition:
      'Anxiety is a feeling of worry or unease. It can show up in the body as tension, fast breathing, or restlessness.',
    extendedDefinition:
      'Anxiety is a common response to uncertainty or pressure. It can affect concentration and sleep. Grounding routines, breathing exercises, and supportive environments can reduce the intensity. If anxiety feels overwhelming, seek professional support in your area.',
    whyItMattersHere: 'NeuroBreath offers calming tools and gentle routines for anxiety support.',
    commonMisunderstandings: ['Anxiety is just overthinking.', 'People should snap out of it.'],
    relatedTerms: ['stress', 'grounding', 'coherent-breathing'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'anxiety-tools',
    },
  }),
  withDefaults({
    id: 'grounding',
    term: 'Grounding',
    localeVariants: {
      uk: { spelling: 'Grounding', notes: 'Techniques that bring attention back to the present.', examples: ['Grounding can use the senses.'] },
      us: { spelling: 'Grounding', notes: 'Techniques that bring attention back to the present.', examples: ['Grounding can use the senses.'] },
    },
    plainEnglishDefinition:
      'Grounding techniques help bring attention back to the present moment. They often use breathing or the five senses.',
    extendedDefinition:
      'Grounding can reduce anxiety and help during overwhelm. Examples include naming things you can see, feel, or hear, or focusing on slow breathing. Grounding is practical and can be used anywhere. It is a supportive skill, not a cure‑all.',
    whyItMattersHere: 'Many of our tools use grounding to support calm and focus.',
    commonMisunderstandings: ['Grounding only works for panic.', 'You must be perfectly calm to use it.'],
    relatedTerms: ['breath-counting', 'box-breathing', 'coherent-breathing'],
    tags: ['tool', 'education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'mindfulness',
    term: 'Mindfulness',
    localeVariants: {
      uk: { spelling: 'Mindfulness', notes: 'Noticing the present moment with kindness.', examples: ['Mindfulness can be short and practical.'] },
      us: { spelling: 'Mindfulness', notes: 'Noticing the present moment with kindness.', examples: ['Mindfulness can be short and practical.'] },
    },
    plainEnglishDefinition:
      'Mindfulness means paying attention to the present moment with kindness. It can be as simple as noticing your breath.',
    extendedDefinition:
      'Mindfulness is a practice of noticing thoughts, sensations, and emotions without judgement. It can help people feel steadier and more focused. Short practices are often more sustainable than long sessions. Mindfulness should feel supportive, not pressuring.',
    whyItMattersHere: 'We use short, practical mindfulness routines that fit real‑world schedules.',
    commonMisunderstandings: ['Mindfulness means emptying your mind.', 'You must sit still for a long time.'],
    relatedTerms: ['grounding', 'breath-counting', 'coherent-breathing'],
    tags: ['education', 'tool'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['body-scan-for-stress'],
      tool: 'coherent-breathing',
    },
  }),
  withDefaults({
    id: 'box-breathing',
    term: 'Box breathing',
    localeVariants: {
      uk: { spelling: 'Box breathing', notes: 'A counted breathing pattern.', examples: ['Box breathing uses equal counts.'] },
      us: { spelling: 'Box breathing', notes: 'A counted breathing pattern.', examples: ['Box breathing uses equal counts.'] },
    },
    plainEnglishDefinition:
      'Box breathing is a breathing pattern with equal counts for inhale, hold, exhale, and hold. It can help steady focus.',
    extendedDefinition:
      'This technique uses a simple four‑part count, often 4‑4‑4‑4. It can reduce stress and bring attention back to the body. Adjust the counts if needed to stay comfortable. It is a practical tool, not medical treatment.',
    whyItMattersHere: 'We include box breathing in several quick reset routines.',
    commonMisunderstandings: ['You must hold your breath for long counts.', 'It works the same for everyone.'],
    relatedTerms: ['coherent-breathing', 'breath-counting', 'grounding'],
    tags: ['tool'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'box-breathing',
    },
  }),
  withDefaults({
    id: 'coherent-breathing',
    term: 'Coherent breathing',
    localeVariants: {
      uk: { spelling: 'Coherent breathing', notes: 'Slow, steady breathing at a gentle pace.', examples: ['Coherent breathing uses a steady rhythm.'] },
      us: { spelling: 'Coherent breathing', notes: 'Slow, steady breathing at a gentle pace.', examples: ['Coherent breathing uses a steady rhythm.'] },
    },
    plainEnglishDefinition:
      'Coherent breathing is slow, steady breathing at a comfortable pace. It can help calm the body and mind.',
    extendedDefinition:
      'Coherent breathing often uses a simple rhythm such as 5‑second inhale and 5‑second exhale. The goal is steady, relaxed breathing rather than perfection. It can support calm and attention during stress. Always adjust the pace to feel comfortable.',
    whyItMattersHere: 'This is a core calming technique used in several tools.',
    commonMisunderstandings: ['Coherent breathing requires long breath holds.', 'It is only for serious stress.'],
    relatedTerms: ['box-breathing', 'extended-exhale', 'grounding'],
    tags: ['tool'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['body-scan-for-stress'],
      tool: 'coherent-breathing',
    },
  }),
  withDefaults({
    id: 'extended-exhale',
    term: 'Extended exhale',
    localeVariants: {
      uk: { spelling: 'Extended exhale', notes: 'Breathing out slightly longer than breathing in.', examples: ['Extended exhale can feel calming.'] },
      us: { spelling: 'Extended exhale', notes: 'Breathing out slightly longer than breathing in.', examples: ['Extended exhale can feel calming.'] },
    },
    plainEnglishDefinition:
      'Extended exhale means breathing out a little longer than you breathe in. It can help the body feel calmer.',
    extendedDefinition:
      'When the exhale is longer than the inhale, the body can shift into a calmer state. This is a gentle, accessible technique. It should feel comfortable, not strained. It is often used in short reset routines.',
    whyItMattersHere: 'Our quick calm routines often use extended exhales.',
    commonMisunderstandings: ['Long exhales should feel uncomfortable.', 'You must count perfectly.'],
    relatedTerms: ['coherent-breathing', 'box-breathing', 'breath-counting'],
    tags: ['tool'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'breath-counting',
    term: 'Breath counting',
    localeVariants: {
      uk: { spelling: 'Breath counting', notes: 'Counting breaths to keep attention steady.', examples: ['Breath counting can support focus.'] },
      us: { spelling: 'Breath counting', notes: 'Counting breaths to keep attention steady.', examples: ['Breath counting can support focus.'] },
    },
    plainEnglishDefinition:
      'Breath counting is a simple way to keep attention on breathing. It can support focus and calm.',
    extendedDefinition:
      'Counting breaths gives the mind a simple task, which can reduce racing thoughts. It is often used for short focus or calm resets. If counting feels stressful, switch to noticing the breath instead. The goal is steadiness, not perfection.',
    whyItMattersHere: 'Breath counting appears in several quick reset routines.',
    commonMisunderstandings: ['You must count perfectly.', 'Counting is the only way to breathe mindfully.'],
    relatedTerms: ['grounding', 'box-breathing', 'coherent-breathing'],
    tags: ['tool'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'sleep-hygiene',
    term: 'Sleep hygiene',
    localeVariants: {
      uk: { spelling: 'Sleep hygiene', notes: 'Habits that support better sleep.', examples: ['Sleep hygiene includes a steady bedtime.'] },
      us: { spelling: 'Sleep hygiene', notes: 'Habits that support better sleep.', examples: ['Sleep hygiene includes a steady bedtime.'] },
    },
    plainEnglishDefinition:
      'Sleep hygiene refers to habits that support better sleep. It includes routines, light, and winding down.',
    extendedDefinition:
      'Sleep hygiene focuses on consistent habits such as a regular bedtime, lower light in the evening, and limiting stimulating activities. Small changes can improve sleep quality over time. It is not about perfection; it is about consistency. When sleep is difficult, gentle routines can help.',
    whyItMattersHere: 'We provide practical wind‑down routines and sleep tools.',
    commonMisunderstandings: ['Sleep hygiene is only for people with sleep problems.', 'One perfect night fixes everything.'],
    relatedTerms: ['sleep-routine', 'extended-exhale', 'stress'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sleep',
      guides: ['wind-down-routine'],
      tool: 'sleep-tools',
    },
  }),
  withDefaults({
    id: 'sleep-routine',
    term: 'Sleep routine',
    localeVariants: {
      uk: { spelling: 'Sleep routine', notes: 'A consistent pattern before bed.', examples: ['A sleep routine can include breathing or stretching.'] },
      us: { spelling: 'Sleep routine', notes: 'A consistent pattern before bed.', examples: ['A sleep routine can include breathing or stretching.'] },
    },
    plainEnglishDefinition:
      'A sleep routine is a consistent set of steps before bed. It helps signal that sleep is coming.',
    extendedDefinition:
      'A predictable routine can help the brain and body shift into rest mode. It can include dimming lights, slow breathing, and preparing for the next day. The routine should be simple enough to repeat regularly. Consistency matters more than length.',
    whyItMattersHere: 'We offer short routines to help people wind down gently.',
    commonMisunderstandings: ['A routine must be long to work.', 'Skipping one night ruins progress.'],
    relatedTerms: ['sleep-hygiene', 'extended-exhale', 'stress'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sleep',
      guides: ['wind-down-routine'],
      tool: 'sleep-tools',
    },
  }),
  withDefaults({
    id: 'routines',
    term: 'Routines',
    localeVariants: {
      uk: { spelling: 'Routines', notes: 'Repeated steps that reduce decision load.', examples: ['Routines can make mornings easier.'] },
      us: { spelling: 'Routines', notes: 'Repeated steps that reduce decision load.', examples: ['Routines can make mornings easier.'] },
    },
    plainEnglishDefinition:
      'Routines are repeated steps that make tasks easier to start and finish. They reduce decision fatigue.',
    extendedDefinition:
      'Predictable routines can reduce stress and improve follow‑through. They work well when steps are clear and flexible. Routines can be short and simple; they do not need to be rigid. The goal is to make life easier, not to be perfect.',
    whyItMattersHere: 'Many NeuroBreath tools are built around simple, repeatable routines.',
    commonMisunderstandings: ['Routines remove creativity.', 'Routines must be strict to work.'],
    relatedTerms: ['transitions', 'organisation', 'sleep-routine'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['wind-down-routine'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'transitions',
    term: 'Transitions',
    localeVariants: {
      uk: { spelling: 'Transitions', notes: 'Switching between activities or environments.', examples: ['Transitions can be easier with warning cues.'] },
      us: { spelling: 'Transitions', notes: 'Switching between activities or environments.', examples: ['Transitions can be easier with warning cues.'] },
    },
    plainEnglishDefinition:
      'Transitions are switches between activities or environments. They can be challenging when they are sudden or unclear.',
    extendedDefinition:
      'Transitions can be smoother with warnings, visual cues, and clear next steps. Some people benefit from extra time or a calming reset. Planning transitions reduces stress and improves cooperation. Support should be predictable and kind.',
    whyItMattersHere: 'We offer routines and guides for smoother transitions.',
    commonMisunderstandings: ['People resist transitions on purpose.', 'Transitions should be fast for everyone.'],
    relatedTerms: ['routines', 'visual-timetable', 'autism'],
    tags: ['education', 'parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-transition-support'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'visual-timetable',
    term: 'Visual timetable',
    localeVariants: {
      uk: { spelling: 'Visual timetable', notes: 'A visual schedule of steps or activities.', examples: ['Visual timetables help with predictability.'] },
      us: { spelling: 'Visual schedule', notes: 'A visual schedule of steps or activities.', examples: ['Visual schedules help with predictability.'] },
    },
    plainEnglishDefinition:
      'A visual timetable (or visual schedule) shows steps or activities using pictures or short text. It helps people know what happens next.',
    extendedDefinition:
      'Visual timetables reduce uncertainty and support transitions. They can be simple cards, whiteboards, or app‑based lists. The key is clarity and consistency. They work well for children and adults who benefit from visual cues.',
    whyItMattersHere: 'Our guides often recommend visual cues to support routines.',
    commonMisunderstandings: ['Visual schedules are only for children.', 'They must be detailed to work.'],
    relatedTerms: ['transitions', 'routines', 'organisation'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['autism-transition-support'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'social-stories',
    term: 'Social stories',
    localeVariants: {
      uk: { spelling: 'Social stories', notes: 'Short narratives explaining social situations.', examples: ['Social stories can prepare for new events.'] },
      us: { spelling: 'Social stories', notes: 'Short narratives explaining social situations.', examples: ['Social stories can prepare for new events.'] },
    },
    plainEnglishDefinition:
      'Social stories are short narratives that explain social situations or expectations. They help people prepare for changes or new events.',
    extendedDefinition:
      'Social stories can reduce anxiety by clarifying what might happen and what choices are available. They work best when personalised and positive. They are a support tool, not a script to enforce behaviour. Keeping them simple and respectful is important.',
    whyItMattersHere: 'We recommend practical, respectful supports for predictability.',
    commonMisunderstandings: ['Social stories force compliance.', 'They are only for very young children.'],
    relatedTerms: ['transitions', 'visual-timetable', 'co-regulation'],
    tags: ['education', 'parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-transition-support'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'focus-sprints',
    term: 'Focus sprints',
    localeVariants: {
      uk: { spelling: 'Focus sprints', notes: 'Short timed focus blocks with breaks.', examples: ['Focus sprints make tasks feel smaller.'] },
      us: { spelling: 'Focus sprints', notes: 'Short timed focus blocks with breaks.', examples: ['Focus sprints make tasks feel smaller.'] },
    },
    plainEnglishDefinition:
      'Focus sprints are short, timed work blocks with planned breaks. They make tasks feel manageable and reduce overwhelm.',
    extendedDefinition:
      'Focus sprints can range from 10–20 minutes, followed by short breaks. They are helpful for attention regulation and motivation. Adjust timing based on energy and context. The goal is sustainable progress, not long stretches of strain.',
    whyItMattersHere: 'Our focus guides and tools are built around sprint‑style routines.',
    commonMisunderstandings: ['Longer focus always means better focus.', 'Breaks are a waste of time.'],
    relatedTerms: ['break-planning', 'task-initiation', 'attention-regulation'],
    tags: ['education', 'workplace', 'school'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'break-planning',
    term: 'Break planning',
    localeVariants: {
      uk: { spelling: 'Break planning', notes: 'Preparing short breaks to reset focus.', examples: ['Break planning supports attention.'] },
      us: { spelling: 'Break planning', notes: 'Preparing short breaks to reset focus.', examples: ['Break planning supports attention.'] },
    },
    plainEnglishDefinition:
      'Break planning is choosing short, helpful breaks before you need them. It makes returning to tasks easier.',
    extendedDefinition:
      'Planned breaks reduce decision fatigue and help the brain recover. Breaks can include movement, hydration, or a short breathing reset. The key is to keep breaks short and purposeful. This supports attention and prevents burnout.',
    whyItMattersHere: 'We offer quick break menus and focus reset tools.',
    commonMisunderstandings: ['Breaks mean you are not working hard enough.', 'Any break will always help.'],
    relatedTerms: ['focus-sprints', 'time-management', 'overwhelm'],
    tags: ['education', 'workplace', 'school'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'executive-planning',
    term: 'Executive planning',
    localeVariants: {
      uk: { spelling: 'Executive planning', notes: 'Breaking goals into steps and timelines.', examples: ['Executive planning helps with big projects.'] },
      us: { spelling: 'Executive planning', notes: 'Breaking goals into steps and timelines.', examples: ['Executive planning helps with big projects.'] },
    },
    plainEnglishDefinition:
      'Executive planning is breaking goals into steps and deciding the order. It helps make large tasks feel manageable.',
    extendedDefinition:
      'Planning involves setting priorities, estimating time, and deciding what comes first. When executive function is taxed, planning can feel overwhelming. Tools like checklists, visual timelines, and reminders can help. The aim is clarity, not perfection.',
    whyItMattersHere: 'Our routines emphasize clear steps and small milestones.',
    commonMisunderstandings: ['Planning is the same as procrastination.', 'Good planners never change their plan.'],
    relatedTerms: ['organisation', 'planning-fallacy', 'time-management'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'organisation',
    term: 'Organisation',
    localeVariants: {
      uk: { spelling: 'Organisation', notes: 'Keeping tasks, spaces, or ideas ordered.', examples: ['Organisation can be easier with simple systems.'] },
      us: { spelling: 'Organization', notes: 'Keeping tasks, spaces, or ideas ordered.', examples: ['Organization can be easier with simple systems.'] },
    },
    plainEnglishDefinition:
      'Organisation is keeping tasks, spaces, or ideas ordered. Simple systems can make this much easier.',
    extendedDefinition:
      'Organisation includes planning, sorting, and maintaining routines. Some people benefit from visual cues, labelled zones, or checklists. Systems should be easy to maintain and adapt. The goal is to reduce stress and improve follow‑through.',
    whyItMattersHere: 'We recommend practical, low‑effort systems that reduce clutter and decision load.',
    commonMisunderstandings: ['Organisation is a personality trait you either have or don’t.', 'Perfect organisation is required.'],
    relatedTerms: ['executive-function', 'routines', 'visual-timetable'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'time-management',
    term: 'Time management',
    localeVariants: {
      uk: { spelling: 'Time management', notes: 'Planning how time is used.', examples: ['Time management can include timers and buffers.'] },
      us: { spelling: 'Time management', notes: 'Planning how time is used.', examples: ['Time management can include timers and buffers.'] },
    },
    plainEnglishDefinition:
      'Time management is planning how you use time so tasks feel manageable. Timers and buffers can help.',
    extendedDefinition:
      'Good time management includes planning, prioritising, and adjusting expectations. Many people benefit from visible timers and breaks. Overly rigid schedules can backfire, so flexibility matters. The aim is to reduce stress and create consistency.',
    whyItMattersHere: 'We encourage short time blocks and gentle pacing strategies.',
    commonMisunderstandings: ['Time management is only about productivity.', 'You should follow schedules perfectly.'],
    relatedTerms: ['time-blindness', 'planning-fallacy', 'focus-sprints'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'planning-fallacy',
    term: 'Planning fallacy',
    localeVariants: {
      uk: { spelling: 'Planning fallacy', notes: 'Underestimating how long tasks take.', examples: ['Planning fallacy can lead to rushed work.'] },
      us: { spelling: 'Planning fallacy', notes: 'Underestimating how long tasks take.', examples: ['Planning fallacy can lead to rushed work.'] },
    },
    plainEnglishDefinition:
      'The planning fallacy is underestimating how long tasks will take. It can lead to rushed or late work.',
    extendedDefinition:
      'People often plan based on best‑case scenarios and forget about delays. Adding buffers and breaking tasks into small steps helps. This is common for everyone, especially when attention or stress is involved. Compassionate planning reduces frustration.',
    whyItMattersHere: 'We recommend short tasks and buffers to reduce pressure.',
    commonMisunderstandings: ['Only disorganised people experience this.', 'You can fix it by working faster.'],
    relatedTerms: ['time-management', 'time-blindness', 'organisation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'body-doubling',
    term: 'Body doubling',
    localeVariants: {
      uk: { spelling: 'Body doubling', notes: 'Doing tasks alongside another person.', examples: ['Body doubling can help start tasks.'] },
      us: { spelling: 'Body doubling', notes: 'Doing tasks alongside another person.', examples: ['Body doubling can help start tasks.'] },
    },
    plainEnglishDefinition:
      'Body doubling is doing a task alongside another person. The shared presence can make starting and staying on task easier.',
    extendedDefinition:
      'Body doubling can be in person or virtual, and the other person does not need to help directly. It can reduce isolation and create a gentle structure. Many people use it for studying, admin, or chores. It is a practical support, not a sign of weakness.',
    whyItMattersHere: 'We support strategies that reduce activation barriers and boost follow‑through.',
    commonMisunderstandings: ['Body doubling is cheating.', 'It only works for extroverted people.'],
    relatedTerms: ['task-initiation', 'focus-sprints', 'co-regulation'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'assistive-technology',
    term: 'Assistive technology',
    localeVariants: {
      uk: { spelling: 'Assistive technology', notes: 'Tools that support access and learning.', examples: ['Text‑to‑speech is assistive technology.'] },
      us: { spelling: 'Assistive technology', notes: 'Tools that support access and learning.', examples: ['Text‑to‑speech is assistive technology.'] },
    },
    plainEnglishDefinition:
      'Assistive technology is any tool that helps people access learning or tasks. Examples include text‑to‑speech or speech‑to‑text.',
    extendedDefinition:
      'Assistive technology can reduce barriers for reading, writing, and organisation. It can be simple (like coloured overlays) or digital (like audio books). The goal is access and independence, not shortcuts. Choosing tools should be person‑centred and practical.',
    whyItMattersHere: 'We link to tools and routines that complement assistive tech.',
    commonMisunderstandings: ['Assistive tech is only for severe needs.', 'Using tools is unfair.'],
    relatedTerms: ['dysgraphia', 'reading-confidence', 'reasonable-adjustments'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'multisensory-learning',
    term: 'Multisensory learning',
    localeVariants: {
      uk: { spelling: 'Multisensory learning', notes: 'Learning that uses more than one sense.', examples: ['Multisensory learning can include movement and sound.'] },
      us: { spelling: 'Multisensory learning', notes: 'Learning that uses more than one sense.', examples: ['Multisensory learning can include movement and sound.'] },
    },
    plainEnglishDefinition:
      'Multisensory learning uses more than one sense at a time, such as seeing, hearing, and moving. It can improve memory and engagement.',
    extendedDefinition:
      'Using multiple senses helps the brain encode information in different ways. It is often helpful for reading and spelling practice. Examples include saying sounds aloud while tracing letters or using movement cues. The best approach is simple, consistent, and person‑friendly.',
    whyItMattersHere: 'We recommend short multisensory practices for reading confidence.',
    commonMisunderstandings: ['Multisensory learning requires special equipment.', 'It is only for young children.'],
    relatedTerms: ['phonics', 'decoding', 'reading-confidence'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'phonics',
    term: 'Phonics',
    localeVariants: {
      uk: { spelling: 'Phonics', notes: 'Connecting sounds to letters.', examples: ['Phonics supports decoding words.'] },
      us: { spelling: 'Phonics', notes: 'Connecting sounds to letters.', examples: ['Phonics supports decoding words.'] },
    },
    plainEnglishDefinition:
      'Phonics is the link between sounds and letters. It helps people decode and read words more confidently.',
    extendedDefinition:
      'Phonics teaching focuses on sound‑letter relationships and blending sounds into words. It supports reading accuracy and spelling. Practice works best when it is short, consistent, and encouraging. Phonics is a core part of many dyslexia‑friendly approaches.',
    whyItMattersHere: 'We include phonics‑friendly routines to build reading confidence.',
    commonMisunderstandings: ['Phonics is only for very young children.', 'Once learned, phonics is never needed again.'],
    relatedTerms: ['decoding', 'phonemic-awareness', 'reading-confidence'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'phonemic-awareness',
    term: 'Phonemic awareness',
    localeVariants: {
      uk: { spelling: 'Phonemic awareness', notes: 'Hearing and working with sounds in words.', examples: ['Phonemic awareness supports reading.'] },
      us: { spelling: 'Phonemic awareness', notes: 'Hearing and working with sounds in words.', examples: ['Phonemic awareness supports reading.'] },
    },
    plainEnglishDefinition:
      'Phonemic awareness is the ability to hear and work with sounds in words. It helps with reading and spelling.',
    extendedDefinition:
      'This skill includes identifying sounds, blending sounds, and changing sounds in words. It is foundational for decoding. Activities can be short and playful, like sound matching or clapping syllables. Consistent practice builds confidence.',
    whyItMattersHere: 'Our reading routines start with simple sound awareness steps.',
    commonMisunderstandings: ['Phonemic awareness is the same as phonics.', 'It is only for early years learners.'],
    relatedTerms: ['phonics', 'decoding', 'reading-confidence'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'decoding',
    term: 'Decoding',
    localeVariants: {
      uk: { spelling: 'Decoding', notes: 'Turning written letters into sounds.', examples: ['Decoding helps with unfamiliar words.'] },
      us: { spelling: 'Decoding', notes: 'Turning written letters into sounds.', examples: ['Decoding helps with unfamiliar words.'] },
    },
    plainEnglishDefinition:
      'Decoding is turning written letters into sounds to read a word. It is a key part of early reading.',
    extendedDefinition:
      'Decoding involves blending sounds and recognising patterns. It can be slower for some learners, especially with dyslexia. Structured practice with supportive feedback helps. The goal is accuracy first, then speed over time.',
    whyItMattersHere: 'We link to reading routines that build decoding confidence.',
    commonMisunderstandings: ['Decoding equals reading comprehension.', 'Fast decoding is the only goal.'],
    relatedTerms: ['phonics', 'fluency', 'reading-confidence'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'fluency',
    term: 'Fluency',
    localeVariants: {
      uk: { spelling: 'Fluency', notes: 'Reading with accuracy and appropriate pace.', examples: ['Fluency improves with practice.'] },
      us: { spelling: 'Fluency', notes: 'Reading with accuracy and appropriate pace.', examples: ['Fluency improves with practice.'] },
    },
    plainEnglishDefinition:
      'Reading fluency means reading with accuracy and a comfortable pace. It makes reading feel smoother.',
    extendedDefinition:
      'Fluency develops after decoding becomes more automatic. Repeated reading and supportive feedback help. It is normal for fluency to vary by day or topic. Confidence grows when practice is kind and consistent.',
    whyItMattersHere: 'Our guides encourage short, encouraging reading routines.',
    commonMisunderstandings: ['Fluency is only about speed.', 'Fluency should be the first goal.'],
    relatedTerms: ['decoding', 'comprehension', 'reading-confidence'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'comprehension',
    term: 'Comprehension',
    localeVariants: {
      uk: { spelling: 'Comprehension', notes: 'Understanding what you read.', examples: ['Comprehension improves with discussion.'] },
      us: { spelling: 'Comprehension', notes: 'Understanding what you read.', examples: ['Comprehension improves with discussion.'] },
    },
    plainEnglishDefinition:
      'Comprehension means understanding what you read. It includes remembering details and making sense of the story or text.',
    extendedDefinition:
      'Comprehension can be supported by discussing the text, asking questions, and summarising key points. It often improves when decoding becomes easier. Visual aids and background knowledge also help. The aim is understanding, not speed.',
    whyItMattersHere: 'We promote reading routines that balance decoding and understanding.',
    commonMisunderstandings: ['Comprehension will improve automatically with faster reading.', 'Only long texts help comprehension.'],
    relatedTerms: ['fluency', 'reading-confidence', 'working-memory'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'reading-confidence',
    term: 'Reading confidence',
    localeVariants: {
      uk: { spelling: 'Reading confidence', notes: 'Feeling safe and capable when reading.', examples: ['Reading confidence grows with encouragement.'] },
      us: { spelling: 'Reading confidence', notes: 'Feeling safe and capable when reading.', examples: ['Reading confidence grows with encouragement.'] },
    },
    plainEnglishDefinition:
      'Reading confidence is feeling safe and capable when reading. It grows with encouragement and manageable practice.',
    extendedDefinition:
      'Confidence can be affected by past experiences, pressure, and classroom expectations. Small successes, supportive feedback, and choice of reading materials help. Avoiding shame and comparison is key. Progress is most sustainable when practice feels safe.',
    whyItMattersHere: 'Our guides focus on gentle, confidence‑building routines.',
    commonMisunderstandings: ['Confidence comes from pushing harder.', 'Confidence means never making mistakes.'],
    relatedTerms: ['fluency', 'comprehension', 'phonics'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class', 'reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'writing-support',
    term: 'Writing support',
    localeVariants: {
      uk: { spelling: 'Writing support', notes: 'Strategies that make writing easier.', examples: ['Writing support can include speech‑to‑text.'] },
      us: { spelling: 'Writing support', notes: 'Strategies that make writing easier.', examples: ['Writing support can include speech‑to‑text.'] },
    },
    plainEnglishDefinition:
      'Writing support includes strategies and tools that make writing easier. It can reduce fatigue and improve clarity.',
    extendedDefinition:
      'Supports may include planning templates, sentence starters, or assistive technology. Reducing copying demands can help. Writing support should focus on ideas and communication, not just handwriting. Small changes can make a big difference.',
    whyItMattersHere: 'We encourage practical supports that reduce writing strain.',
    commonMisunderstandings: ['Using tools is unfair.', 'Handwriting speed is the only measure of writing skill.'],
    relatedTerms: ['dysgraphia', 'assistive-technology', 'organisation'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'math-support',
    term: 'Math support',
    localeVariants: {
      uk: { spelling: 'Maths support', notes: 'Strategies that make maths clearer.', examples: ['Maths support can include visual steps.'] },
      us: { spelling: 'Math support', notes: 'Strategies that make math clearer.', examples: ['Math support can include visual steps.'] },
    },
    plainEnglishDefinition:
      'Math support includes strategies that make maths clearer and more manageable. Visual steps and real‑world examples can help.',
    extendedDefinition:
      'Support for maths often focuses on building number sense and reducing cognitive load. Step‑by‑step methods and consistent practice help. Visual aids and practical examples can make concepts stick. Progress is about confidence as well as accuracy.',
    whyItMattersHere: 'Our resources focus on reducing overwhelm and building confidence.',
    commonMisunderstandings: ['Maths ability is fixed.', 'Only fast answers count.'],
    relatedTerms: ['dyscalculia', 'working-memory', 'executive-function'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'reasonable-adjustments',
    term: 'Reasonable adjustments',
    localeVariants: {
      uk: { spelling: 'Reasonable adjustments', notes: 'UK term for workplace or school adjustments.', examples: ['Reasonable adjustments can include flexible deadlines.'] },
      us: { spelling: 'Reasonable accommodations', notes: 'US term for workplace or school accommodations.', examples: ['Reasonable accommodations can include flexible deadlines.'] },
    },
    plainEnglishDefinition:
      'Reasonable adjustments (UK) or accommodations (US) are changes that make learning or work more accessible. They reduce barriers without changing goals.',
    extendedDefinition:
      'Adjustments can include extra time, quiet spaces, or assistive tools. They are meant to remove unnecessary barriers so people can participate fully. The specifics depend on context and individual needs. Asking for adjustments is a right, not a favour.',
    whyItMattersHere: 'We provide guidance on practical, respectful support options.',
    commonMisunderstandings: ['Adjustments are special treatment.', 'Only formal diagnoses qualify for adjustments.'],
    relatedTerms: ['iep', 'plan-504', 'senco'],
    tags: ['workplace', 'school', 'education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'send',
    term: 'SEND',
    localeVariants: {
      uk: { spelling: 'SEND', notes: 'Special Educational Needs and Disabilities (UK).', examples: ['SEND support may involve school plans.'] },
      us: { spelling: 'Special education', notes: 'US term for special education services.', examples: ['Special education plans can include IEPs.'] },
    },
    plainEnglishDefinition:
      'SEND is the UK term for special educational needs and disabilities. It covers support for learners who need extra help at school.',
    extendedDefinition:
      'SEND support can include targeted teaching, adjustments, and specialist input. It is coordinated through school processes and local services. Families can ask schools about available support. Understanding the pathway helps families plan and advocate effectively.',
    whyItMattersHere: 'We link to practical guides and trust information for families and teachers.',
    commonMisunderstandings: ['SEND support is only for severe needs.', 'Support is automatic without requests.'],
    relatedTerms: ['senco', 'iep', 'plan-504'],
    tags: ['school', 'education', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'senco',
    term: 'SENCO',
    localeVariants: {
      uk: { spelling: 'SENCO', notes: 'Special Educational Needs Coordinator (UK).', examples: ['A SENCO supports access to school adjustments.'] },
      us: { spelling: 'Special education coordinator', notes: 'Comparable role in US school systems.', examples: ['A special education coordinator supports accommodations.'] },
    },
    plainEnglishDefinition:
      'A SENCO is a UK school role that coordinates special educational needs support. They help plan and review adjustments.',
    extendedDefinition:
      'SENCOs work with teachers, families, and external services to support learners. They help coordinate assessments and support plans. Communication with a SENCO can clarify what support is available. The role may have different titles outside the UK.',
    whyItMattersHere: 'We include guidance on school support pathways and conversations.',
    commonMisunderstandings: ['The SENCO is the only person who can help.', 'You must wait for a formal diagnosis to speak with the SENCO.'],
    relatedTerms: ['send', 'reasonable-adjustments', 'iep'],
    tags: ['school', 'education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'iep',
    term: 'IEP',
    localeVariants: {
      uk: { spelling: 'Individual education plan', notes: 'Comparable to UK support plans.', examples: ['IEPs outline goals and supports.'] },
      us: { spelling: 'IEP', notes: 'Individualized Education Program (US).', examples: ['IEPs list accommodations and goals.'] },
    },
    plainEnglishDefinition:
      'An IEP is a plan that outlines supports and goals for a learner who needs extra help. It is used in US schools.',
    extendedDefinition:
      'IEPs describe learning goals, accommodations, and services. They are created with families and reviewed regularly. The plan is meant to support access to learning, not label a student. UK schools use different systems, but the idea of a support plan is similar.',
    whyItMattersHere: 'We offer guidance on understanding support pathways and accommodations.',
    commonMisunderstandings: ['IEPs are only for severe needs.', 'An IEP guarantees perfect outcomes.'],
    relatedTerms: ['plan-504', 'reasonable-adjustments', 'send'],
    tags: ['school', 'education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'plan-504',
    term: '504 plan',
    localeVariants: {
      uk: { spelling: 'School support plan', notes: 'Comparable to UK school adjustment plans.', examples: ['Support plans outline adjustments.'] },
      us: { spelling: '504 plan', notes: 'US plan for accommodations in schools.', examples: ['504 plans list classroom accommodations.'] },
    },
    plainEnglishDefinition:
      'A 504 plan is a US school plan that lists accommodations for a student. It helps remove barriers to learning.',
    extendedDefinition:
      '504 plans are used to outline practical adjustments such as extra time, seating changes, or assistive tools. They do not change learning goals but make access fairer. UK schools use different systems, but the goal of accessibility is similar. Collaboration with school staff helps keep plans practical.',
    whyItMattersHere: 'We provide support language for asking about accommodations and adjustments.',
    commonMisunderstandings: ['504 plans are the same as IEPs.', 'A plan removes the need for support at home.'],
    relatedTerms: ['iep', 'reasonable-adjustments', 'send'],
    tags: ['school', 'education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'evidence-based',
    term: 'Evidence‑based',
    localeVariants: {
      uk: { spelling: 'Evidence‑based', notes: 'Guided by research and good practice.', examples: ['Evidence‑based tools are supported by studies.'] },
      us: { spelling: 'Evidence‑based', notes: 'Guided by research and good practice.', examples: ['Evidence‑based tools are supported by studies.'] },
    },
    plainEnglishDefinition:
      'Evidence‑based means a practice is supported by research and good quality evidence. It does not mean it works the same for everyone.',
    extendedDefinition:
      'Evidence‑based practices are informed by studies, expert consensus, and real‑world outcomes. Evidence can change as new research emerges. It is important to balance evidence with personal needs and context. NeuroBreath shares sources so users can understand the basis for guidance.',
    whyItMattersHere: 'Trust and transparency are central to NeuroBreath’s approach.',
    commonMisunderstandings: ['Evidence‑based means guaranteed results.', 'Only one study is enough.'],
    relatedTerms: ['peer-review', 'nice', 'cdc'],
    tags: ['evidence'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
    citationsByRegion: {
      uk: [{ label: 'NHS Evidence Services', url: 'https://www.nhs.uk/' }],
      us: [{ label: 'NIH: Evidence-based medicine', url: 'https://www.nih.gov/' }],
      global: [{ label: 'Cochrane Evidence', url: 'https://www.cochrane.org/' }],
    },
  }),
  withDefaults({
    id: 'peer-review',
    term: 'Peer review',
    localeVariants: {
      uk: { spelling: 'Peer review', notes: 'Research checked by other experts.', examples: ['Peer review improves research quality.'] },
      us: { spelling: 'Peer review', notes: 'Research checked by other experts.', examples: ['Peer review improves research quality.'] },
    },
    plainEnglishDefinition:
      'Peer review is when research is checked by other experts before publication. It helps catch errors and improve quality.',
    extendedDefinition:
      'Peer review is a standard quality check in academic publishing. It is not perfect, but it adds scrutiny to research methods and conclusions. Good evidence usually comes from multiple studies, not one paper. NeuroBreath references sources so you can read more.',
    whyItMattersHere: 'We use peer‑reviewed sources to support educational content.',
    commonMisunderstandings: ['Peer review guarantees results.', 'All peer‑reviewed studies are equally strong.'],
    relatedTerms: ['evidence-based', 'nice', 'cdc'],
    tags: ['evidence'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
    citationsByRegion: {
      uk: [{ label: 'UK Research Integrity Office', url: 'https://ukrio.org/' }],
      us: [{ label: 'NIH Research Integrity', url: 'https://www.nih.gov/' }],
      global: [{ label: 'COPE', url: 'https://publicationethics.org/' }],
    },
  }),
  withDefaults({
    id: 'nice',
    term: 'NICE',
    localeVariants: {
      uk: { spelling: 'NICE', notes: 'UK National Institute for Health and Care Excellence.', examples: ['NICE provides evidence guidance.'] },
      us: { spelling: 'NICE (UK)', notes: 'UK evidence guideline body.', examples: ['NICE guidance may be referenced in UK contexts.'] },
    },
    plainEnglishDefinition:
      'NICE is a UK body that provides evidence‑based guidance for health and care. It helps set standards for good practice.',
    extendedDefinition:
      'NICE publishes guidance based on research and expert consensus. It is used across the UK to inform best practice. NeuroBreath cites NICE in trust and evidence contexts, not as medical advice. Always consult local professionals for personalised care.',
    whyItMattersHere: 'We reference NICE in trust and evidence contexts to support credibility.',
    commonMisunderstandings: ['NICE guidance replaces professional advice.', 'NICE is the same as the NHS.'],
    relatedTerms: ['nhs', 'evidence-based', 'peer-review'],
    tags: ['evidence'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
    citationsByRegion: {
      uk: [{ label: 'NICE', url: 'https://www.nice.org.uk/' }],
      us: [],
      global: [],
    },
  }),
  withDefaults({
    id: 'nhs',
    term: 'NHS',
    localeVariants: {
      uk: { spelling: 'NHS', notes: 'UK National Health Service.', examples: ['NHS services include GP practices.'] },
      us: { spelling: 'UK NHS', notes: 'UK National Health Service.', examples: ['NHS resources are UK‑specific.'] },
    },
    plainEnglishDefinition:
      'The NHS is the UK’s National Health Service. It provides public healthcare and information resources.',
    extendedDefinition:
      'NHS resources can help people understand health and wellbeing topics. NeuroBreath uses NHS sources for evidence and trust contexts. This is not medical advice, and local services vary. In emergencies, follow local emergency guidance.',
    whyItMattersHere: 'We provide transparent evidence sources for UK users.',
    commonMisunderstandings: ['NHS resources replace professional advice.', 'NHS services are the same in every area.'],
    relatedTerms: ['nice', 'evidence-based', 'safeguarding'],
    tags: ['evidence'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
    citationsByRegion: {
      uk: [{ label: 'NHS', url: 'https://www.nhs.uk/' }],
      us: [],
      global: [],
    },
  }),
  withDefaults({
    id: 'cdc',
    term: 'CDC',
    localeVariants: {
      uk: { spelling: 'CDC (US)', notes: 'US Centers for Disease Control and Prevention.', examples: ['CDC resources are US‑specific.'] },
      us: { spelling: 'CDC', notes: 'US Centers for Disease Control and Prevention.', examples: ['CDC publishes public health guidance.'] },
    },
    plainEnglishDefinition:
      'The CDC is a US public health agency that publishes guidance and research summaries.',
    extendedDefinition:
      'CDC resources cover public health topics and are used for evidence context in the US. NeuroBreath cites CDC sources to support trust and transparency. This information is educational and not personal medical advice. Always follow local professional guidance for care.',
    whyItMattersHere: 'We reference CDC sources for US‑specific trust context.',
    commonMisunderstandings: ['CDC guidance replaces medical advice.', 'CDC information applies equally worldwide.'],
    relatedTerms: ['nih', 'evidence-based', 'peer-review'],
    tags: ['evidence'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
    citationsByRegion: {
      uk: [],
      us: [{ label: 'CDC', url: 'https://www.cdc.gov/' }],
      global: [],
    },
  }),
  withDefaults({
    id: 'nih',
    term: 'NIH',
    localeVariants: {
      uk: { spelling: 'NIH (US)', notes: 'US National Institutes of Health.', examples: ['NIH funds medical research.'] },
      us: { spelling: 'NIH', notes: 'US National Institutes of Health.', examples: ['NIH funds health research.'] },
    },
    plainEnglishDefinition:
      'The NIH is a US agency that funds medical and health research. It provides research summaries and resources.',
    extendedDefinition:
      'NIH resources are used to understand evidence and research updates. NeuroBreath uses NIH references for US evidence context. This does not replace professional advice. For personal care, consult local providers.',
    whyItMattersHere: 'We cite NIH sources when relevant to evidence‑based guidance.',
    commonMisunderstandings: ['NIH advice is personalised.', 'NIH only covers US information.'],
    relatedTerms: ['cdc', 'evidence-based', 'peer-review'],
    tags: ['evidence'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
    citationsByRegion: {
      uk: [],
      us: [{ label: 'NIH', url: 'https://www.nih.gov/' }],
      global: [],
    },
  }),
  withDefaults({
    id: 'safeguarding',
    term: 'Safeguarding',
    localeVariants: {
      uk: { spelling: 'Safeguarding', notes: 'Keeping people safe from harm.', examples: ['Safeguarding includes clear reporting routes.'] },
      us: { spelling: 'Safety planning', notes: 'Keeping people safe from harm.', examples: ['Safety planning includes clear support steps.'] },
    },
    plainEnglishDefinition:
      'Safeguarding means keeping people safe from harm and knowing how to get help when needed. It is about safety and support.',
    extendedDefinition:
      'Safeguarding includes clear reporting routes, respectful communication, and timely support. It is relevant in schools, workplaces, and online spaces. NeuroBreath provides safety guidance and emergency references only in trust contexts. For emergencies, follow local services immediately.',
    whyItMattersHere: 'We prioritise trust, safety, and clear guidance on when to seek help.',
    commonMisunderstandings: ['Safeguarding is only a school issue.', 'Safeguarding means policing behaviour.'],
    relatedTerms: ['disclosure', 'evidence-based', 'self-advocacy'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'disclosure',
    term: 'Disclosure',
    localeVariants: {
      uk: { spelling: 'Disclosure', notes: 'Sharing information about support needs.', examples: ['Disclosure can happen at school or work.'] },
      us: { spelling: 'Disclosure', notes: 'Sharing information about support needs.', examples: ['Disclosure can happen at school or work.'] },
    },
    plainEnglishDefinition:
      'Disclosure is sharing information about support needs with someone else. It can help access accommodations or understanding.',
    extendedDefinition:
      'Disclosure is a personal choice and should feel safe. Some people choose to share information with employers or schools to access support. It can be partial, gradual, or full. NeuroBreath provides educational guidance and encourages supportive, respectful communication.',
    whyItMattersHere: 'We point to trust resources that explain support pathways and privacy.',
    commonMisunderstandings: ['Disclosure is always required.', 'Once you disclose, you cannot change your mind.'],
    relatedTerms: ['reasonable-adjustments', 'self-advocacy', 'workplace-support'],
    tags: ['workplace', 'education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'self-advocacy',
    term: 'Self‑advocacy',
    localeVariants: {
      uk: { spelling: 'Self‑advocacy', notes: 'Speaking up for your needs.', examples: ['Self‑advocacy can include asking for adjustments.'] },
      us: { spelling: 'Self‑advocacy', notes: 'Speaking up for your needs.', examples: ['Self‑advocacy can include asking for accommodations.'] },
    },
    plainEnglishDefinition:
      'Self‑advocacy means speaking up for your needs and preferences. It can help people access the right support.',
    extendedDefinition:
      'Self‑advocacy can include asking for accommodations, sharing what helps, and setting boundaries. It is a skill that grows over time. Supportive environments make self‑advocacy easier. Communication can be written, verbal, or supported by a trusted person.',
    whyItMattersHere: 'We encourage clear, respectful language for asking for support.',
    commonMisunderstandings: ['Self‑advocacy is confrontational.', 'You must be confident to advocate.'],
    relatedTerms: ['reasonable-adjustments', 'disclosure', 'organisation'],
    tags: ['workplace', 'education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'co-occurring',
    term: 'Co‑occurring',
    localeVariants: {
      uk: { spelling: 'Co‑occurring', notes: 'When more than one condition or profile is present.', examples: ['Co‑occurring ADHD and anxiety is common.'] },
      us: { spelling: 'Co‑occurring', notes: 'When more than one condition or profile is present.', examples: ['Co‑occurring ADHD and anxiety is common.'] },
    },
    plainEnglishDefinition:
      'Co‑occurring means more than one condition or profile is present at the same time. It can change support needs.',
    extendedDefinition:
      'Co‑occurring profiles can include ADHD and anxiety, autism and dyslexia, or other combinations. Support should consider how needs overlap rather than treating each in isolation. This is educational guidance, not diagnostic advice. Personalised support is important.',
    whyItMattersHere: 'Our recommendations allow multiple support needs without forcing a single label.',
    commonMisunderstandings: ['Co‑occurring means one diagnosis is wrong.', 'Support must only focus on one condition.'],
    relatedTerms: ['adhd', 'autism', 'anxiety'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'sensory-kit',
    term: 'Sensory kit',
    localeVariants: {
      uk: { spelling: 'Sensory kit', notes: 'A set of items for sensory support.', examples: ['A sensory kit may include headphones.'] },
      us: { spelling: 'Sensory kit', notes: 'A set of items for sensory support.', examples: ['A sensory kit may include headphones.'] },
    },
    plainEnglishDefinition:
      'A sensory kit is a small set of items that help with sensory regulation. It might include headphones, fidgets, or a water bottle.',
    extendedDefinition:
      'Sensory kits provide quick access to tools that help people feel steady. The items should be personal and portable. Using a kit can prevent overload and support focus. It is a practical, everyday strategy.',
    whyItMattersHere: 'We encourage simple, low‑cost sensory supports that are easy to use.',
    commonMisunderstandings: ['Sensory kits are only for children.', 'You need expensive items.'],
    relatedTerms: ['sensory-differences', 'fidget-tools', 'grounding'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'fidget-tools',
    term: 'Fidget tools',
    localeVariants: {
      uk: { spelling: 'Fidget tools', notes: 'Small objects for movement or sensory input.', examples: ['Fidget tools can support focus.'] },
      us: { spelling: 'Fidget tools', notes: 'Small objects for movement or sensory input.', examples: ['Fidget tools can support focus.'] },
    },
    plainEnglishDefinition:
      'Fidget tools are small objects used for movement or sensory input. They can help some people focus or stay calm.',
    extendedDefinition:
      'Fidget tools include stress balls, textured items, or silent fidgets. They can provide sensory input without disrupting others. The best tools are quiet, safe, and agreed in context. They are a support, not a distraction for everyone.',
    whyItMattersHere: 'We suggest practical sensory supports that respect environment needs.',
    commonMisunderstandings: ['Fidget tools always distract.', 'Only children use fidgets.'],
    relatedTerms: ['sensory-seeking', 'sensory-kit', 'stimming'],
    tags: ['education', 'school', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'occupational-therapy',
    term: 'Occupational therapy',
    localeVariants: {
      uk: { spelling: 'Occupational therapy', notes: 'Support to build daily living and participation skills.', examples: ['OT can support sensory strategies.'] },
      us: { spelling: 'Occupational therapy', notes: 'Support to build daily living and participation skills.', examples: ['OT can support sensory strategies.'] },
    },
    plainEnglishDefinition:
      'Occupational therapy supports everyday skills for home, school, or work. It can include routines, sensory strategies, and practical tools.',
    extendedDefinition:
      'Occupational therapists help people participate in daily activities with greater comfort and independence. Support may include adapting tasks, environments, or tools. NeuroBreath provides educational routines that can complement professional guidance. This is not a replacement for therapy.',
    whyItMattersHere: 'We signpost supportive routines and trust information alongside educational tools.',
    commonMisunderstandings: ['Occupational therapy is only about jobs.', 'OT is only for children.'],
    relatedTerms: ['sensory-differences', 'executive-function', 'routines'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['autism-sensory-reset'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'speech-language-therapy',
    term: 'Speech and language therapy',
    localeVariants: {
      uk: { spelling: 'Speech and language therapy', notes: 'Support for communication and language.', examples: ['SLT can support communication strategies.'] },
      us: { spelling: 'Speech‑language therapy', notes: 'Support for communication and language.', examples: ['SLT can support communication strategies.'] },
    },
    plainEnglishDefinition:
      'Speech and language therapy supports communication, language, and social interaction skills. It can help with understanding and expressing ideas.',
    extendedDefinition:
      'Speech‑language therapists work on language understanding, speech clarity, and communication strategies. Support is personalised and can include practical exercises or visual supports. NeuroBreath provides educational resources, not therapy. Seek local professional guidance for personalised care.',
    whyItMattersHere: 'We provide supportive resources that complement communication strategies.',
    commonMisunderstandings: ['Speech therapy is only for speech sounds.', 'Adults cannot benefit from communication support.'],
    relatedTerms: ['social-stories', 'communication', 'self-advocacy'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'communication',
    term: 'Communication',
    localeVariants: {
      uk: { spelling: 'Communication', notes: 'Sharing thoughts, needs, or feelings.', examples: ['Communication can be verbal or non‑verbal.'] },
      us: { spelling: 'Communication', notes: 'Sharing thoughts, needs, or feelings.', examples: ['Communication can be verbal or non‑verbal.'] },
    },
    plainEnglishDefinition:
      'Communication is how people share thoughts, needs, and feelings. It can be spoken, written, or non‑verbal.',
    extendedDefinition:
      'Communication preferences vary widely. Some people use speech, others use writing, visuals, or assistive tools. Respecting preferred communication improves trust and reduces stress. NeuroBreath encourages inclusive communication strategies.',
    whyItMattersHere: 'Clear, supportive communication is part of our trust and safety approach.',
    commonMisunderstandings: ['Only spoken words count as communication.', 'If someone is quiet, they have nothing to say.'],
    relatedTerms: ['self-advocacy', 'speech-language-therapy', 'social-stories'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'attention-switching',
    term: 'Attention switching',
    localeVariants: {
      uk: { spelling: 'Attention switching', notes: 'Moving focus from one task to another.', examples: ['Attention switching can be tiring.'] },
      us: { spelling: 'Attention switching', notes: 'Moving focus from one task to another.', examples: ['Attention switching can be tiring.'] },
    },
    plainEnglishDefinition:
      'Attention switching is moving focus from one task to another. It can feel harder when you are tired or stressed.',
    extendedDefinition:
      'Switching attention uses executive function and can be draining when tasks are complex. Clear cues and small transition steps can help. Sudden switches often increase stress. Planning transitions supports smoother attention shifts.',
    whyItMattersHere: 'We support predictable transitions and short reset routines.',
    commonMisunderstandings: ['Switching focus should always be instant.', 'Struggling to switch means someone is stubborn.'],
    relatedTerms: ['transitions', 'executive-function', 'attention-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'working-memory-strategies',
    term: 'Working memory strategies',
    localeVariants: {
      uk: { spelling: 'Working memory strategies', notes: 'Tools to reduce memory load.', examples: ['Checklists and visuals support working memory.'] },
      us: { spelling: 'Working memory strategies', notes: 'Tools to reduce memory load.', examples: ['Checklists and visuals support working memory.'] },
    },
    plainEnglishDefinition:
      'Working memory strategies reduce how much you need to hold in mind. They include checklists, timers, and visual cues.',
    extendedDefinition:
      'Strategies can include breaking tasks into steps, using notes, and setting reminders. Visual cues externalise information so it does not need to be remembered. The best strategies are simple and consistent. These tools are supportive, not a sign of weakness.',
    whyItMattersHere: 'Our routines rely on short steps and reminders to reduce memory load.',
    commonMisunderstandings: ['People should remember everything without help.', 'Using strategies means you are not capable.'],
    relatedTerms: ['working-memory', 'organisation', 'executive-function'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'reading-support',
    term: 'Reading support',
    localeVariants: {
      uk: { spelling: 'Reading support', notes: 'Strategies that make reading easier.', examples: ['Reading support can include short sessions.'] },
      us: { spelling: 'Reading support', notes: 'Strategies that make reading easier.', examples: ['Reading support can include short sessions.'] },
    },
    plainEnglishDefinition:
      'Reading support includes strategies that make reading easier and more comfortable. Short sessions and encouragement help.',
    extendedDefinition:
      'Support can include phonics practice, multisensory activities, and accessible materials. The focus is on confidence, not speed. Simple, consistent routines are often most effective. Reading support should feel safe and encouraging.',
    whyItMattersHere: 'NeuroBreath provides reading routines and tools for confidence building.',
    commonMisunderstandings: ['Reading support is only for young children.', 'Support ends once someone can read a little.'],
    relatedTerms: ['reading-confidence', 'phonics', 'multisensory-learning'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'workplace-support',
    term: 'Workplace support',
    localeVariants: {
      uk: { spelling: 'Workplace support', notes: 'Adjustments or routines for work settings.', examples: ['Workplace support can include flexible breaks.'] },
      us: { spelling: 'Workplace support', notes: 'Accommodations or routines for work settings.', examples: ['Workplace support can include flexible breaks.'] },
    },
    plainEnglishDefinition:
      'Workplace support includes adjustments or routines that make work more accessible. It can improve focus and reduce stress.',
    extendedDefinition:
      'Support may include flexible scheduling, clear priorities, or sensory‑friendly spaces. It is about removing barriers, not lowering expectations. Good communication and clear agreements help. NeuroBreath offers educational guidance and tools to support workplace routines.',
    whyItMattersHere: 'We provide practical strategies for focus and stress in work contexts.',
    commonMisunderstandings: ['Workplace support is unfair to others.', 'Support means doing less work.'],
    relatedTerms: ['reasonable-adjustments', 'disclosure', 'organisation'],
    tags: ['workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'school-support',
    term: 'School support',
    localeVariants: {
      uk: { spelling: 'School support', notes: 'Support and adjustments in schools.', examples: ['School support can include quiet spaces.'] },
      us: { spelling: 'School support', notes: 'Support and accommodations in schools.', examples: ['School support can include quiet spaces.'] },
    },
    plainEnglishDefinition:
      'School support includes adjustments that help students access learning. It can include extra time, quiet spaces, or assistive tools.',
    extendedDefinition:
      'Support can be informal or part of a plan such as an IEP or 504 plan. Collaboration between families and schools improves outcomes. Support should be personalised and reviewed regularly. The aim is access, not lowering expectations.',
    whyItMattersHere: 'We provide guidance on classroom strategies and supportive routines.',
    commonMisunderstandings: ['Support is only for academic work.', 'Support plans remove the need for practice.'],
    relatedTerms: ['iep', 'plan-504', 'senco'],
    tags: ['school', 'education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'parenting-support',
    term: 'Parenting support',
    localeVariants: {
      uk: { spelling: 'Parenting support', notes: 'Guidance for parents and carers.', examples: ['Parenting support can include routines and language tips.'] },
      us: { spelling: 'Parenting support', notes: 'Guidance for parents and caregivers.', examples: ['Parenting support can include routines and language tips.'] },
    },
    plainEnglishDefinition:
      'Parenting support includes routines and strategies that help families feel steadier. It can include calm language and predictable steps.',
    extendedDefinition:
      'Support for parents and carers focuses on reducing stress at home and building confidence. Small, realistic routines are easier to maintain. Clear communication and calm co‑regulation help everyone. NeuroBreath provides educational guidance, not medical advice.',
    whyItMattersHere: 'We offer practical routines and supportive language for families.',
    commonMisunderstandings: ['Parenting support means blame.', 'There is one right way to parent.'],
    relatedTerms: ['co-regulation', 'routines', 'transitions'],
    tags: ['parenting'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['autism-sensory-reset'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'organization-strategies',
    term: 'Organisation strategies',
    localeVariants: {
      uk: { spelling: 'Organisation strategies', notes: 'Practical ways to stay organised.', examples: ['Organisation strategies include checklists.'] },
      us: { spelling: 'Organization strategies', notes: 'Practical ways to stay organized.', examples: ['Organization strategies include checklists.'] },
    },
    plainEnglishDefinition:
      'Organisation strategies are practical ways to keep tasks and information in order. Examples include checklists and labelled spaces.',
    extendedDefinition:
      'Strategies work best when they are simple and repeatable. External cues reduce memory load. It is better to use a few consistent systems than many complex ones. Adjust strategies to fit real‑life needs and energy levels.',
    whyItMattersHere: 'We recommend low‑effort systems that reduce cognitive load.',
    commonMisunderstandings: ['Organisation must be perfect.', 'Complex systems are always better.'],
    relatedTerms: ['organisation', 'working-memory-strategies', 'visual-timetable'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'time-buffer',
    term: 'Time buffer',
    localeVariants: {
      uk: { spelling: 'Time buffer', notes: 'Extra time added to reduce pressure.', examples: ['Time buffers prevent rushing.'] },
      us: { spelling: 'Time buffer', notes: 'Extra time added to reduce pressure.', examples: ['Time buffers prevent rushing.'] },
    },
    plainEnglishDefinition:
      'A time buffer is extra time added to reduce pressure. It helps when tasks take longer than expected.',
    extendedDefinition:
      'Time buffers protect against delays and reduce stress. They are especially helpful when tasks have unpredictable steps. Adding buffer time is a simple planning strategy that supports reliability. It is a kindness to future you.',
    whyItMattersHere: 'We recommend buffers as part of realistic planning and pacing.',
    commonMisunderstandings: ['Buffers are wasted time.', 'Only disorganised people need buffers.'],
    relatedTerms: ['planning-fallacy', 'time-management', 'time-blindness'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'sensory-overwhelm',
    term: 'Sensory overwhelm',
    localeVariants: {
      uk: { spelling: 'Sensory overwhelm', notes: 'Another way to describe sensory overload.', examples: ['Sensory overwhelm can lead to shutdowns.'] },
      us: { spelling: 'Sensory overwhelm', notes: 'Another way to describe sensory overload.', examples: ['Sensory overwhelm can lead to shutdowns.'] },
    },
    plainEnglishDefinition:
      'Sensory overwhelm is another way to describe sensory overload. It is when inputs feel too intense or too many.',
    extendedDefinition:
      'Overwhelm can happen from bright lights, loud noise, or too many demands at once. People may need a quieter space or grounding routine. It is a nervous system response, not a choice. Compassionate support helps people recover.',
    whyItMattersHere: 'We offer calming tools that help reduce sensory load.',
    commonMisunderstandings: ['Sensory overwhelm is drama.', 'People should ignore sensory input.'],
    relatedTerms: ['sensory-overload', 'grounding', 'meltdown'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'attention-fatigue',
    term: 'Attention fatigue',
    localeVariants: {
      uk: { spelling: 'Attention fatigue', notes: 'Tiredness from sustained focus.', examples: ['Attention fatigue can increase mistakes.'] },
      us: { spelling: 'Attention fatigue', notes: 'Tiredness from sustained focus.', examples: ['Attention fatigue can increase mistakes.'] },
    },
    plainEnglishDefinition:
      'Attention fatigue is tiredness from sustained focus. It can make tasks feel harder and reduce accuracy.',
    extendedDefinition:
      'Long periods of concentration can drain attention resources. Short breaks, movement, and breathing resets help attention recover. Planning focus sprints is more sustainable than long stretches. Support should match energy and context.',
    whyItMattersHere: 'We encourage short focus blocks and rest breaks.',
    commonMisunderstandings: ['Attention fatigue means you are not motivated.', 'Only long focus is productive.'],
    relatedTerms: ['focus-sprints', 'break-planning', 'burnout'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'sleep-pressure',
    term: 'Sleep pressure',
    localeVariants: {
      uk: { spelling: 'Sleep pressure', notes: 'The natural build‑up of tiredness.', examples: ['Sleep pressure builds through the day.'] },
      us: { spelling: 'Sleep pressure', notes: 'The natural build‑up of tiredness.', examples: ['Sleep pressure builds through the day.'] },
    },
    plainEnglishDefinition:
      'Sleep pressure is the natural build‑up of tiredness across the day. It helps the body feel ready for sleep at night.',
    extendedDefinition:
      'Sleep pressure increases the longer you are awake. Naps and late caffeine can reduce sleep pressure, making sleep harder. Simple routines that respect sleep pressure can improve rest. Small changes are often more sustainable than strict rules.',
    whyItMattersHere: 'We provide gentle sleep routines that support natural sleep pressure.',
    commonMisunderstandings: ['If you are tired, sleep will always be easy.', 'Staying up late always helps you sleep better.'],
    relatedTerms: ['sleep-hygiene', 'sleep-routine', 'stress'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sleep',
      guides: ['wind-down-routine'],
      tool: 'sleep-tools',
    },
  }),
  withDefaults({
    id: 'focus-cue',
    term: 'Focus cue',
    localeVariants: {
      uk: { spelling: 'Focus cue', notes: 'A signal that helps you start focusing.', examples: ['A focus cue can be a timer or phrase.'] },
      us: { spelling: 'Focus cue', notes: 'A signal that helps you start focusing.', examples: ['A focus cue can be a timer or phrase.'] },
    },
    plainEnglishDefinition:
      'A focus cue is a signal that helps you start focusing. It could be a timer, music, or a short breathing reset.',
    extendedDefinition:
      'Focus cues help transition into work mode. They can be visual, auditory, or physical. Consistent cues build a routine and reduce the effort of starting. The best cues are simple and repeatable.',
    whyItMattersHere: 'Our tools often include start cues to reduce task initiation effort.',
    commonMisunderstandings: ['Focus cues are gimmicks.', 'You need many cues to focus well.'],
    relatedTerms: ['task-initiation', 'focus-sprints', 'attention-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'sensory-break',
    term: 'Sensory break',
    localeVariants: {
      uk: { spelling: 'Sensory break', notes: 'A short pause to reduce sensory load.', examples: ['Sensory breaks can include quiet time.'] },
      us: { spelling: 'Sensory break', notes: 'A short pause to reduce sensory load.', examples: ['Sensory breaks can include quiet time.'] },
    },
    plainEnglishDefinition:
      'A sensory break is a short pause to reduce sensory load. It might involve quiet space, movement, or breathing.',
    extendedDefinition:
      'Sensory breaks help people recover from overstimulation. They are most effective when planned and available as needed. Breaks can be short and still be helpful. They support regulation and reduce escalation.',
    whyItMattersHere: 'We include sensory break suggestions in our guides.',
    commonMisunderstandings: ['Breaks are rewards that must be earned.', 'Breaks should only be used after problems happen.'],
    relatedTerms: ['sensory-overload', 'sensory-kit', 'break-planning'],
    tags: ['education', 'school', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'focus-reset',
    term: 'Focus reset',
    localeVariants: {
      uk: { spelling: 'Focus reset', notes: 'A quick routine to refocus.', examples: ['Focus resets can include breathing.'] },
      us: { spelling: 'Focus reset', notes: 'A quick routine to refocus.', examples: ['Focus resets can include breathing.'] },
    },
    plainEnglishDefinition:
      'A focus reset is a short routine that helps you refocus. It can include breathing, stretching, or a quick walk.',
    extendedDefinition:
      'Focus resets are useful between tasks or after distraction. They help the brain switch back into work mode. Short resets are easier to maintain than long breaks. The goal is a small shift, not a full stop.',
    whyItMattersHere: 'Many tools provide quick resets that fit in busy days.',
    commonMisunderstandings: ['Resets are the same as long breaks.', 'Resets are only for people with ADHD.'],
    relatedTerms: ['focus-sprints', 'break-planning', 'grounding'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'emotional-check-in',
    term: 'Emotional check‑in',
    localeVariants: {
      uk: { spelling: 'Emotional check‑in', notes: 'A quick way to notice feelings.', examples: ['Emotional check‑ins can reduce overwhelm.'] },
      us: { spelling: 'Emotional check‑in', notes: 'A quick way to notice feelings.', examples: ['Emotional check‑ins can reduce overwhelm.'] },
    },
    plainEnglishDefinition:
      'An emotional check‑in is a quick way to notice how you are feeling. It can help you choose a helpful next step.',
    extendedDefinition:
      'Check‑ins might include naming feelings, rating stress, or noticing body cues. They can reduce overwhelm by making feelings clearer. Short check‑ins are often more sustainable. This is a supportive tool, not a diagnostic step.',
    whyItMattersHere: 'We promote gentle check‑ins as part of regulation routines.',
    commonMisunderstandings: ['Check‑ins are only for therapy.', 'You must describe feelings perfectly.'],
    relatedTerms: ['emotional-regulation', 'self-regulation', 'grounding'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'learning-cluster',
    term: 'Learning cluster',
    localeVariants: {
      uk: { spelling: 'Learning cluster', notes: 'A group of related learning topics.', examples: ['Learning clusters group related guides.'] },
      us: { spelling: 'Learning cluster', notes: 'A group of related learning topics.', examples: ['Learning clusters group related guides.'] },
    },
    plainEnglishDefinition:
      'A learning cluster is a group of related topics or guides. It helps people explore a theme step by step.',
    extendedDefinition:
      'Clusters organise content into smaller pieces so it is easier to navigate. They often include guides, tools, and FAQs. Using clusters can reduce decision fatigue. NeuroBreath uses clusters to keep learning pathways clear.',
    whyItMattersHere: 'Our recommendations point to clusters so you can explore gently.',
    commonMisunderstandings: ['Clusters are long courses.', 'You must complete every item.'],
    relatedTerms: ['routines', 'organisation', 'learning-confidence'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'executive-skills',
    term: 'Executive skills',
    localeVariants: {
      uk: { spelling: 'Executive skills', notes: 'Skills for planning, organising, and self‑control.', examples: ['Executive skills include prioritising and task‑starting.'] },
      us: { spelling: 'Executive skills', notes: 'Skills for planning, organizing, and self‑control.', examples: ['Executive skills include prioritizing and task‑starting.'] },
    },
    plainEnglishDefinition:
      'Executive skills are the practical skills that help you plan, start, and finish tasks. They include prioritising and staying organised.',
    extendedDefinition:
      'Executive skills support goal‑directed behaviour, time management, and attention control. They can be strengthened with routines and external supports. Stress and fatigue often reduce these skills temporarily. Support should reduce load and increase clarity.',
    whyItMattersHere: 'NeuroBreath uses structured routines to support executive skills.',
    commonMisunderstandings: ['Executive skills are just motivation.', 'These skills are fixed and cannot change.'],
    relatedTerms: ['executive-function', 'task-initiation', 'organisation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'visual-supports',
    term: 'Visual supports',
    localeVariants: {
      uk: { spelling: 'Visual supports', notes: 'Visual cues that aid understanding.', examples: ['Visual supports can include icons or schedules.'] },
      us: { spelling: 'Visual supports', notes: 'Visual cues that aid understanding.', examples: ['Visual supports can include icons or schedules.'] },
    },
    plainEnglishDefinition:
      'Visual supports are cues like icons, charts, or schedules that help understanding. They reduce the need to remember instructions.',
    extendedDefinition:
      'Visual supports can clarify expectations and improve follow‑through. They are helpful in classrooms, homes, and workplaces. Supports work best when they are simple and consistent. They can be customised to personal preferences.',
    whyItMattersHere: 'We highlight visual strategies for clear, low‑stress support.',
    commonMisunderstandings: ['Visual supports are only for children.', 'More visuals always mean better support.'],
    relatedTerms: ['visual-timetable', 'organisation', 'working-memory-strategies'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['autism-transition-support'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'calm-routine',
    term: 'Calm routine',
    localeVariants: {
      uk: { spelling: 'Calm routine', notes: 'A short routine to reduce stress.', examples: ['Calm routines can include breathing.'] },
      us: { spelling: 'Calm routine', notes: 'A short routine to reduce stress.', examples: ['Calm routines can include breathing.'] },
    },
    plainEnglishDefinition:
      'A calm routine is a short set of steps that helps you feel steadier. It can include breathing, stretching, or quiet time.',
    extendedDefinition:
      'Calm routines are most useful when they are short and repeatable. They can be used before stressful moments or as part of daily routines. The steps should be simple and low‑effort. The goal is stability, not perfection.',
    whyItMattersHere: 'Our tools provide quick calm routines you can repeat daily.',
    commonMisunderstandings: ['Calm routines should fix stress instantly.', 'Only long routines help.'],
    relatedTerms: ['grounding', 'coherent-breathing', 'stress'],
    tags: ['education', 'tool'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'learning-confidence',
    term: 'Learning confidence',
    localeVariants: {
      uk: { spelling: 'Learning confidence', notes: 'Feeling capable and safe while learning.', examples: ['Learning confidence grows with encouragement.'] },
      us: { spelling: 'Learning confidence', notes: 'Feeling capable and safe while learning.', examples: ['Learning confidence grows with encouragement.'] },
    },
    plainEnglishDefinition:
      'Learning confidence is feeling capable and safe while learning. It grows through encouragement and achievable steps.',
    extendedDefinition:
      'Confidence is shaped by past experiences and current support. Small wins, clear feedback, and kind environments build confidence. Avoiding shame and comparison is key. Progress is most sustainable when practice feels safe.',
    whyItMattersHere: 'Our guides emphasise confidence‑building routines over pressure.',
    commonMisunderstandings: ['Confidence comes from pressure.', 'Confidence means never struggling.'],
    relatedTerms: ['reading-confidence', 'self-advocacy', 'organisation'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'sensory-regulation',
    term: 'Sensory regulation',
    localeVariants: {
      uk: { spelling: 'Sensory regulation', notes: 'Managing sensory input to feel steady.', examples: ['Sensory regulation can include movement or quiet space.'] },
      us: { spelling: 'Sensory regulation', notes: 'Managing sensory input to feel steady.', examples: ['Sensory regulation can include movement or quiet space.'] },
    },
    plainEnglishDefinition:
      'Sensory regulation is managing sensory input to feel steady and focused. It can include movement, quiet spaces, or sensory tools.',
    extendedDefinition:
      'Regulation strategies can reduce overload and support attention. People often use sensory breaks, fidgets, or calming environments. The right strategy depends on the person and context. Respectful choice is essential.',
    whyItMattersHere: 'We include sensory‑friendly strategies across guides and tools.',
    commonMisunderstandings: ['Sensory regulation is a luxury.', 'Everyone uses the same strategy.'],
    relatedTerms: ['sensory-differences', 'sensory-kit', 'grounding'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'sensory-friendly',
    term: 'Sensory‑friendly',
    localeVariants: {
      uk: { spelling: 'Sensory‑friendly', notes: 'Designed to reduce sensory overload.', examples: ['Sensory‑friendly spaces reduce noise and glare.'] },
      us: { spelling: 'Sensory‑friendly', notes: 'Designed to reduce sensory overload.', examples: ['Sensory‑friendly spaces reduce noise and glare.'] },
    },
    plainEnglishDefinition:
      'Sensory‑friendly means designed to reduce sensory overload. It often includes lower noise, softer lighting, and clear structure.',
    extendedDefinition:
      'Sensory‑friendly environments help people stay regulated and comfortable. Small changes such as dimmed lighting or reduced noise can help a lot. Clear signage and predictable routines also support regulation. These changes benefit many people, not just neurodivergent individuals.',
    whyItMattersHere: 'We aim for calming, low‑overload experiences in the app.',
    commonMisunderstandings: ['Sensory‑friendly means silence.', 'Only autistic people need sensory‑friendly spaces.'],
    relatedTerms: ['sensory-differences', 'sensory-overload', 'sensory-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'focus-support',
    term: 'Focus support',
    localeVariants: {
      uk: { spelling: 'Focus support', notes: 'Strategies that help attention and task start.', examples: ['Focus support can include short sprints.'] },
      us: { spelling: 'Focus support', notes: 'Strategies that help attention and task start.', examples: ['Focus support can include short sprints.'] },
    },
    plainEnglishDefinition:
      'Focus support includes strategies that help you start and stay with tasks. Timers, cues, and breaks are common tools.',
    extendedDefinition:
      'Support can include shorter task blocks, visual timers, and clear priorities. The goal is steady progress, not long stretches of strain. Focus support is about removing barriers and building routines. It should be personalised and flexible.',
    whyItMattersHere: 'NeuroBreath provides focus tools and guides built on practical routines.',
    commonMisunderstandings: ['Focus support is only for ADHD.', 'You should focus perfectly once you have tools.'],
    relatedTerms: ['focus-sprints', 'task-initiation', 'attention-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'emotional-support',
    term: 'Emotional support',
    localeVariants: {
      uk: { spelling: 'Emotional support', notes: 'Support that helps people feel safe and understood.', examples: ['Emotional support can include calm language.'] },
      us: { spelling: 'Emotional support', notes: 'Support that helps people feel safe and understood.', examples: ['Emotional support can include calm language.'] },
    },
    plainEnglishDefinition:
      'Emotional support helps people feel safe, understood, and steadier. It can include calm language, check‑ins, or reassurance.',
    extendedDefinition:
      'Supportive responses help reduce stress and build trust. Emotional support is not about fixing feelings but about making space for them. It works best when consistent and respectful. Practical routines can be paired with emotional support to improve outcomes.',
    whyItMattersHere: 'We encourage supportive, non‑judgemental guidance throughout the platform.',
    commonMisunderstandings: ['Emotional support is the same as problem solving.', 'Providing support means agreeing with everything.'],
    relatedTerms: ['emotional-regulation', 'co-regulation', 'self-advocacy'],
    tags: ['education', 'parenting', 'school'],
    recommendedNextLinks: {
      journey: 'starter-emotional-regulation',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'sensory-processing',
    term: 'Sensory processing',
    localeVariants: {
      uk: { spelling: 'Sensory processing', notes: 'How the brain interprets sensory input.', examples: ['Sensory processing can vary day to day.'] },
      us: { spelling: 'Sensory processing', notes: 'How the brain interprets sensory input.', examples: ['Sensory processing can vary day to day.'] },
    },
    plainEnglishDefinition:
      'Sensory processing is how the brain takes in and interprets sensory input. It affects comfort, focus, and energy.',
    extendedDefinition:
      'People can be more sensitive or less sensitive to sounds, light, touch, or movement. Sensory processing can shift with stress or fatigue. Understanding sensory patterns helps people choose supportive routines. It is not a preference or a choice.',
    whyItMattersHere: 'We design tools that reduce overload and support sensory regulation.',
    commonMisunderstandings: ['Sensory processing issues are just picky behaviour.', 'Everyone senses the world in the same way.'],
    relatedTerms: ['sensory-differences', 'sensory-overload', 'sensory-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'proprioception',
    term: 'Proprioception',
    localeVariants: {
      uk: { spelling: 'Proprioception', notes: 'Sense of body position and movement.', examples: ['Proprioception helps you know where your body is.'] },
      us: { spelling: 'Proprioception', notes: 'Sense of body position and movement.', examples: ['Proprioception helps you know where your body is.'] },
    },
    plainEnglishDefinition:
      'Proprioception is your sense of where your body is in space. It helps with balance, movement, and coordination.',
    extendedDefinition:
      'Proprioceptive input comes from muscles and joints. Some people seek deep pressure or movement to feel more regulated. Activities like stretching or pushing can be calming for some. The goal is safe, supportive movement.',
    whyItMattersHere: 'We include movement breaks and grounding routines that support body awareness.',
    commonMisunderstandings: ['Proprioception only matters in sports.', 'Movement needs mean someone is restless on purpose.'],
    relatedTerms: ['sensory-seeking', 'movement-breaks', 'sensory-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'vestibular-input',
    term: 'Vestibular input',
    localeVariants: {
      uk: { spelling: 'Vestibular input', notes: 'Movement and balance signals.', examples: ['Vestibular input includes rocking or swinging.'] },
      us: { spelling: 'Vestibular input', notes: 'Movement and balance signals.', examples: ['Vestibular input includes rocking or swinging.'] },
    },
    plainEnglishDefinition:
      'Vestibular input is the sense of movement and balance. It comes from the inner ear and affects how steady we feel.',
    extendedDefinition:
      'Movement like rocking, spinning, or walking provides vestibular input. Some people seek it to feel regulated, while others are sensitive to it. Safe, controlled movement can help with focus and calm. Always match movement to comfort and safety.',
    whyItMattersHere: 'We suggest gentle movement breaks as part of regulation routines.',
    commonMisunderstandings: ['Movement needs are just hyperactivity.', 'More movement is always better.'],
    relatedTerms: ['sensory-seeking', 'movement-breaks', 'sensory-regulation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'interoception',
    term: 'Interoception',
    localeVariants: {
      uk: { spelling: 'Interoception', notes: 'Awareness of internal body signals.', examples: ['Interoception includes noticing hunger or stress.'] },
      us: { spelling: 'Interoception', notes: 'Awareness of internal body signals.', examples: ['Interoception includes noticing hunger or stress.'] },
    },
    plainEnglishDefinition:
      'Interoception is awareness of internal body signals such as hunger, thirst, or stress. It helps you notice how you feel inside.',
    extendedDefinition:
      'Some people find it hard to notice internal signals, which can affect regulation and wellbeing. Simple check‑ins can help build awareness. The goal is to notice signals earlier and respond with gentle support. Interoception varies across people and contexts.',
    whyItMattersHere: 'We encourage short emotional and body check‑ins in routines.',
    commonMisunderstandings: ['People always know when they are hungry or stressed.', 'Interoception cannot change.'],
    relatedTerms: ['emotional-check-in', 'self-regulation', 'grounding'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'auditory-sensitivity',
    term: 'Auditory sensitivity',
    localeVariants: {
      uk: { spelling: 'Auditory sensitivity', notes: 'Sensitivity to sound.', examples: ['Auditory sensitivity can make noise painful.'] },
      us: { spelling: 'Auditory sensitivity', notes: 'Sensitivity to sound.', examples: ['Auditory sensitivity can make noise painful.'] },
    },
    plainEnglishDefinition:
      'Auditory sensitivity is a strong reaction to sound. Loud or unpredictable noise can feel intense or stressful.',
    extendedDefinition:
      'People with auditory sensitivity may feel overwhelmed in noisy spaces. Headphones, quiet zones, and predictable routines can help. Sensitivity can vary by day and stress level. Support should focus on comfort and choice.',
    whyItMattersHere: 'We suggest sensory tools and calming routines for noisy environments.',
    commonMisunderstandings: ['Auditory sensitivity is being difficult.', 'People can just tune out noise.'],
    relatedTerms: ['sensory-overload', 'sensory-avoiding', 'sensory-kit'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['breathing-for-sensory-overload'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'visual-sensitivity',
    term: 'Visual sensitivity',
    localeVariants: {
      uk: { spelling: 'Visual sensitivity', notes: 'Sensitivity to light or visual clutter.', examples: ['Visual sensitivity can be triggered by glare.'] },
      us: { spelling: 'Visual sensitivity', notes: 'Sensitivity to light or visual clutter.', examples: ['Visual sensitivity can be triggered by glare.'] },
    },
    plainEnglishDefinition:
      'Visual sensitivity is a strong reaction to light, glare, or visual clutter. Bright or busy spaces can feel overwhelming.',
    extendedDefinition:
      'Reducing glare, using softer lighting, and simplifying visual environments can help. Visual sensitivity can affect reading and focus. It is not a preference; it is a sensory response. Support should focus on comfort and access.',
    whyItMattersHere: 'We recommend calm, low‑clutter environments for focus and regulation.',
    commonMisunderstandings: ['Visual sensitivity means someone dislikes light.', 'People can just ignore visual overload.'],
    relatedTerms: ['sensory-overload', 'sensory-avoiding', 'visual-supports'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'tactile-sensitivity',
    term: 'Tactile sensitivity',
    localeVariants: {
      uk: { spelling: 'Tactile sensitivity', notes: 'Sensitivity to touch or textures.', examples: ['Tactile sensitivity can affect clothing choices.'] },
      us: { spelling: 'Tactile sensitivity', notes: 'Sensitivity to touch or textures.', examples: ['Tactile sensitivity can affect clothing choices.'] },
    },
    plainEnglishDefinition:
      'Tactile sensitivity is a strong reaction to touch or textures. Certain fabrics or contact can feel uncomfortable.',
    extendedDefinition:
      'People with tactile sensitivity may avoid certain textures or prefer predictable touch. Adjusting clothing, seating, or materials can help. Sensitivity can change with stress or fatigue. Support should focus on comfort and consent.',
    whyItMattersHere: 'We encourage sensory‑friendly choices and environments.',
    commonMisunderstandings: ['Tactile sensitivity is being picky.', 'Exposure always fixes it.'],
    relatedTerms: ['sensory-avoiding', 'sensory-differences', 'sensory-kit'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'executive-function-coaching',
    term: 'Executive function coaching',
    localeVariants: {
      uk: { spelling: 'Executive function coaching', notes: 'Support for planning and organisation skills.', examples: ['Coaching can include routines and accountability.'] },
      us: { spelling: 'Executive function coaching', notes: 'Support for planning and organization skills.', examples: ['Coaching can include routines and accountability.'] },
    },
    plainEnglishDefinition:
      'Executive function coaching is support for planning, organisation, and follow‑through skills. It focuses on practical strategies.',
    extendedDefinition:
      'Coaching may include goal setting, task breakdowns, and accountability. It is educational and skill‑focused rather than clinical. Strategies should be personalised and realistic. NeuroBreath provides self‑guided routines that can complement coaching.',
    whyItMattersHere: 'Our routines provide structure that supports executive skills.',
    commonMisunderstandings: ['Coaching replaces therapy.', 'Coaching is only for high achievers.'],
    relatedTerms: ['executive-function', 'organisation', 'task-initiation'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'study-skills',
    term: 'Study skills',
    localeVariants: {
      uk: { spelling: 'Study skills', notes: 'Strategies for effective study.', examples: ['Study skills include planning and review.'] },
      us: { spelling: 'Study skills', notes: 'Strategies for effective study.', examples: ['Study skills include planning and review.'] },
    },
    plainEnglishDefinition:
      'Study skills are strategies that make studying more effective and less stressful. They include planning, reviewing, and taking breaks.',
    extendedDefinition:
      'Good study skills use clear goals, manageable steps, and regular review. Short sessions with breaks help focus. Visual summaries and active recall can improve memory. The best approach is consistent and realistic, not perfectionist.',
    whyItMattersHere: 'Our focus routines support steady, low‑stress study habits.',
    commonMisunderstandings: ['Long study sessions are always better.', 'Study skills are one‑size‑fits‑all.'],
    relatedTerms: ['focus-sprints', 'time-management', 'working-memory'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'note-taking',
    term: 'Note‑taking',
    localeVariants: {
      uk: { spelling: 'Note‑taking', notes: 'Recording key information in a usable way.', examples: ['Note‑taking can use bullets or mind maps.'] },
      us: { spelling: 'Note‑taking', notes: 'Recording key information in a usable way.', examples: ['Note‑taking can use bullets or mind maps.'] },
    },
    plainEnglishDefinition:
      'Note‑taking is recording key information in a usable way. It can be text, bullets, or visual summaries.',
    extendedDefinition:
      'Effective notes are short, clear, and easy to revisit. Using headings, spacing, and symbols can help. Some people prefer audio notes or visual maps. The best method is the one you can stick with.',
    whyItMattersHere: 'We encourage simple, low‑load ways to capture information.',
    commonMisunderstandings: ['Notes must be complete sentences.', 'More notes are always better.'],
    relatedTerms: ['working-memory-strategies', 'organisation', 'study-skills'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'checklists',
    term: 'Checklists',
    localeVariants: {
      uk: { spelling: 'Checklists', notes: 'Step‑by‑step lists for tasks.', examples: ['Checklists reduce memory load.'] },
      us: { spelling: 'Checklists', notes: 'Step‑by‑step lists for tasks.', examples: ['Checklists reduce memory load.'] },
    },
    plainEnglishDefinition:
      'Checklists are step‑by‑step lists for tasks. They help you track progress and reduce memory load.',
    extendedDefinition:
      'Checklists turn complex tasks into smaller steps. They are useful for routines, schoolwork, and daily life. Keep them short and practical. The goal is support, not perfection.',
    whyItMattersHere: 'Our routines often use simple checklists to make tasks manageable.',
    commonMisunderstandings: ['Checklists are only for complex projects.', 'Using a checklist means you are forgetful.'],
    relatedTerms: ['organisation', 'working-memory-strategies', 'executive-function'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'visual-reminders',
    term: 'Visual reminders',
    localeVariants: {
      uk: { spelling: 'Visual reminders', notes: 'Visible cues that prompt action.', examples: ['Visual reminders can be sticky notes or icons.'] },
      us: { spelling: 'Visual reminders', notes: 'Visible cues that prompt action.', examples: ['Visual reminders can be sticky notes or icons.'] },
    },
    plainEnglishDefinition:
      'Visual reminders are visible cues that prompt action. They make tasks easier to remember.',
    extendedDefinition:
      'Reminders can be simple notes, icons, or checklists placed where they are needed. They reduce reliance on memory. Good reminders are clear and minimal. Too many reminders can be overwhelming, so keep them focused.',
    whyItMattersHere: 'We encourage simple visual cues to support focus and routines.',
    commonMisunderstandings: ['Visual reminders are clutter.', 'Reminders should be everywhere.'],
    relatedTerms: ['visual-supports', 'checklists', 'organisation'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'task-switching',
    term: 'Task switching',
    localeVariants: {
      uk: { spelling: 'Task switching', notes: 'Moving between tasks or priorities.', examples: ['Task switching can reduce focus.'] },
      us: { spelling: 'Task switching', notes: 'Moving between tasks or priorities.', examples: ['Task switching can reduce focus.'] },
    },
    plainEnglishDefinition:
      'Task switching is moving between tasks or priorities. Frequent switching can reduce focus and increase fatigue.',
    extendedDefinition:
      'Switching tasks uses mental energy and can reduce performance. Batching similar tasks and using focus sprints can help. Clear priorities reduce unnecessary switches. The goal is smoother transitions and less mental drain.',
    whyItMattersHere: 'We recommend short focus blocks and clear priorities to reduce switching costs.',
    commonMisunderstandings: ['Multitasking is more efficient.', 'Switching tasks has no cost.'],
    relatedTerms: ['attention-switching', 'focus-sprints', 'time-management'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['focus-sprints-for-adhd'],
      tool: 'focus-training',
    },
  }),
  withDefaults({
    id: 'priority-setting',
    term: 'Priority setting',
    localeVariants: {
      uk: { spelling: 'Priority setting', notes: 'Deciding what matters most first.', examples: ['Priority setting reduces overwhelm.'] },
      us: { spelling: 'Priority setting', notes: 'Deciding what matters most first.', examples: ['Priority setting reduces overwhelm.'] },
    },
    plainEnglishDefinition:
      'Priority setting is deciding what matters most first. It helps reduce overwhelm and decision fatigue.',
    extendedDefinition:
      'Choosing priorities helps avoid juggling too many tasks at once. Simple rules such as “top three tasks” can help. Priorities should be realistic and flexible. The goal is clarity, not pressure.',
    whyItMattersHere: 'We promote simple prioritisation to support focus and calm.',
    commonMisunderstandings: ['Priorities never change.', 'More priorities means better planning.'],
    relatedTerms: ['organisation', 'time-management', 'executive-planning'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'decision-fatigue',
    term: 'Decision fatigue',
    localeVariants: {
      uk: { spelling: 'Decision fatigue', notes: 'Tiredness from making many choices.', examples: ['Decision fatigue can make small tasks feel hard.'] },
      us: { spelling: 'Decision fatigue', notes: 'Tiredness from making many choices.', examples: ['Decision fatigue can make small tasks feel hard.'] },
    },
    plainEnglishDefinition:
      'Decision fatigue is feeling tired from making many choices. It can make even small decisions feel hard.',
    extendedDefinition:
      'When you make many decisions, your mental energy reduces. Simplifying choices and using routines can help. This is common in busy or stressful times. Reducing decision load improves follow‑through.',
    whyItMattersHere: 'We design routines that reduce the number of decisions needed.',
    commonMisunderstandings: ['Decision fatigue is an excuse.', 'Making more decisions makes you better at it.'],
    relatedTerms: ['routines', 'organisation', 'overwhelm'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'coping-strategies',
    term: 'Coping strategies',
    localeVariants: {
      uk: { spelling: 'Coping strategies', notes: 'Helpful actions for managing stress.', examples: ['Coping strategies can include breathing or breaks.'] },
      us: { spelling: 'Coping strategies', notes: 'Helpful actions for managing stress.', examples: ['Coping strategies can include breathing or breaks.'] },
    },
    plainEnglishDefinition:
      'Coping strategies are helpful actions for managing stress or overwhelm. They can be quick and practical.',
    extendedDefinition:
      'Strategies include breathing, grounding, movement, and seeking support. The best strategies are personal and repeatable. Coping strategies should be supportive, not punitive. Combining strategies often works better than relying on one.',
    whyItMattersHere: 'Our tools provide simple, repeatable coping routines.',
    commonMisunderstandings: ['One strategy works for everyone.', 'Coping strategies should remove all stress.'],
    relatedTerms: ['grounding', 'emotional-regulation', 'calm-routine'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'de-escalation',
    term: 'De‑escalation',
    localeVariants: {
      uk: { spelling: 'De‑escalation', notes: 'Reducing intensity during stress or conflict.', examples: ['De‑escalation uses calm language and space.'] },
      us: { spelling: 'De‑escalation', notes: 'Reducing intensity during stress or conflict.', examples: ['De‑escalation uses calm language and space.'] },
    },
    plainEnglishDefinition:
      'De‑escalation is reducing intensity during stress or conflict. It often involves calm language and giving space.',
    extendedDefinition:
      'De‑escalation focuses on safety, calm tone, and reducing demands. It is especially important during overwhelm or meltdowns. Clear, simple language helps. The goal is to help the nervous system settle, not to win an argument.',
    whyItMattersHere: 'We prioritise calm, safety‑focused guidance in our trust content.',
    commonMisunderstandings: ['De‑escalation means giving in.', 'Talking more always helps.'],
    relatedTerms: ['meltdown', 'shutdown', 'co-regulation'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['autism-sensory-reset'],
      tool: 'quick-calm',
    },
  }),
  withDefaults({
    id: 'calm-corner',
    term: 'Calm corner',
    localeVariants: {
      uk: { spelling: 'Calm corner', notes: 'A quiet space for regulation.', examples: ['Calm corners can include soft lighting.'] },
      us: { spelling: 'Calm corner', notes: 'A quiet space for regulation.', examples: ['Calm corners can include soft lighting.'] },
    },
    plainEnglishDefinition:
      'A calm corner is a quiet space for regulation. It helps people reset during stress or overload.',
    extendedDefinition:
      'Calm corners can include soft seating, dim lighting, and sensory tools. They are most effective when they are optional and welcoming. The aim is to support regulation, not to isolate. Clear expectations make the space feel safe.',
    whyItMattersHere: 'We recommend calm spaces as part of sensory‑friendly routines.',
    commonMisunderstandings: ['Calm corners are time‑out spaces.', 'Only children use calm corners.'],
    relatedTerms: ['sensory-regulation', 'sensory-kit', 'co-regulation'],
    tags: ['education', 'school', 'parenting'],
    recommendedNextLinks: {
      journey: 'starter-sensory',
      guides: ['autism-sensory-reset'],
      tool: 'sensory-calm',
    },
  }),
  withDefaults({
    id: 'movement-breaks',
    term: 'Movement breaks',
    localeVariants: {
      uk: { spelling: 'Movement breaks', notes: 'Short movement to reset energy.', examples: ['Movement breaks can include stretching.'] },
      us: { spelling: 'Movement breaks', notes: 'Short movement to reset energy.', examples: ['Movement breaks can include stretching.'] },
    },
    plainEnglishDefinition:
      'Movement breaks are short bursts of movement that reset energy and attention. They can be as simple as stretching.',
    extendedDefinition:
      'Movement breaks help regulate the nervous system and improve focus. They can be planned between tasks or used when attention dips. Short breaks are often enough. The best break is the one you will actually take.',
    whyItMattersHere: 'We recommend movement breaks as part of focus routines.',
    commonMisunderstandings: ['Breaks waste time.', 'Movement breaks must be long to help.'],
    relatedTerms: ['break-planning', 'sensory-seeking', 'focus-reset'],
    tags: ['education', 'school', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'screen-breaks',
    term: 'Screen breaks',
    localeVariants: {
      uk: { spelling: 'Screen breaks', notes: 'Short breaks away from screens.', examples: ['Screen breaks reduce eye strain.'] },
      us: { spelling: 'Screen breaks', notes: 'Short breaks away from screens.', examples: ['Screen breaks reduce eye strain.'] },
    },
    plainEnglishDefinition:
      'Screen breaks are short pauses away from screens. They reduce eye strain and help reset attention.',
    extendedDefinition:
      'Regular screen breaks support focus and comfort, especially during long study or work sessions. Looking away, stretching, or a brief walk can help. These breaks are small but effective. They support long‑term sustainability.',
    whyItMattersHere: 'We promote short breaks to support steady attention and comfort.',
    commonMisunderstandings: ['Screen breaks are only for eye health.', 'You should avoid screens completely.'],
    relatedTerms: ['movement-breaks', 'focus-reset', 'attention-fatigue'],
    tags: ['education', 'workplace'],
    recommendedNextLinks: {
      journey: 'starter-focus',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'hydration-breaks',
    term: 'Hydration breaks',
    localeVariants: {
      uk: { spelling: 'Hydration breaks', notes: 'Short pauses to drink water.', examples: ['Hydration breaks can support energy.'] },
      us: { spelling: 'Hydration breaks', notes: 'Short pauses to drink water.', examples: ['Hydration breaks can support energy.'] },
    },
    plainEnglishDefinition:
      'Hydration breaks are short pauses to drink water. They help maintain energy and focus.',
    extendedDefinition:
      'Staying hydrated supports attention and mood. Short breaks make hydration more consistent without disrupting tasks. Pairing breaks with reminders can help. The goal is steady, sustainable habits.',
    whyItMattersHere: 'We encourage practical, health‑supporting routines as part of daily plans.',
    commonMisunderstandings: ['Hydration breaks are unnecessary.', 'You must drink large amounts at once.'],
    relatedTerms: ['movement-breaks', 'focus-reset', 'routines'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['adhd-break-planning'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'learning-differences',
    term: 'Learning differences',
    localeVariants: {
      uk: { spelling: 'Learning differences', notes: 'Different ways people learn and process information.', examples: ['Learning differences include dyslexia or dyscalculia.'] },
      us: { spelling: 'Learning differences', notes: 'Different ways people learn and process information.', examples: ['Learning differences include dyslexia or dyscalculia.'] },
    },
    plainEnglishDefinition:
      'Learning differences are different ways of learning and processing information. They are not about intelligence.',
    extendedDefinition:
      'Learning differences include dyslexia, dyscalculia, and other profiles. People often have strengths alongside challenges. Support should be personalised, respectful, and practical. Understanding differences reduces shame and improves access.',
    whyItMattersHere: 'Our content uses affirming language and practical support strategies.',
    commonMisunderstandings: ['Learning differences mean low ability.', 'Support should be the same for everyone.'],
    relatedTerms: ['dyslexia', 'dyscalculia', 'dysgraphia'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'neurodiversity',
    term: 'Neurodiversity',
    localeVariants: {
      uk: { spelling: 'Neurodiversity', notes: 'The natural variety of human brains.', examples: ['Neurodiversity includes many profiles.'] },
      us: { spelling: 'Neurodiversity', notes: 'The natural variety of human brains.', examples: ['Neurodiversity includes many profiles.'] },
    },
    plainEnglishDefinition:
      'Neurodiversity means there is natural variation in how brains work. Different ways of thinking are part of human diversity.',
    extendedDefinition:
      'The neurodiversity concept emphasises strengths and differences rather than deficits. It includes conditions like ADHD and autism as part of human variation. It supports respectful, inclusive language. NeuroBreath follows neurodiversity‑affirming principles.',
    whyItMattersHere: 'Our tone and resources are grounded in respectful, affirming language.',
    commonMisunderstandings: ['Neurodiversity means no support is needed.', 'It only applies to certain conditions.'],
    relatedTerms: ['neurodivergent', 'neurotypical', 'strengths-based'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'neurodivergent',
    term: 'Neurodivergent',
    localeVariants: {
      uk: { spelling: 'Neurodivergent', notes: 'Having a brain that works differently from typical expectations.', examples: ['Neurodivergent people may need different supports.'] },
      us: { spelling: 'Neurodivergent', notes: 'Having a brain that works differently from typical expectations.', examples: ['Neurodivergent people may need different supports.'] },
    },
    plainEnglishDefinition:
      'Neurodivergent describes people whose brains work differently from typical expectations. It includes profiles like ADHD or autism.',
    extendedDefinition:
      'The term is used to highlight differences without pathologising. It can include many conditions and experiences. Not everyone uses the label, and that choice should be respected. NeuroBreath supports diverse preferences and needs.',
    whyItMattersHere: 'We use respectful language that centres lived experience and choice.',
    commonMisunderstandings: ['Neurodivergent means the same for everyone.', 'The term replaces all clinical language.'],
    relatedTerms: ['neurodiversity', 'neurotypical', 'self-advocacy'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'neurotypical',
    term: 'Neurotypical',
    localeVariants: {
      uk: { spelling: 'Neurotypical', notes: 'Brains that match typical expectations.', examples: ['Neurotypical is a descriptive term, not a value judgement.'] },
      us: { spelling: 'Neurotypical', notes: 'Brains that match typical expectations.', examples: ['Neurotypical is a descriptive term, not a value judgement.'] },
    },
    plainEnglishDefinition:
      'Neurotypical describes people whose brains match typical expectations. It is a descriptive term, not a value judgement.',
    extendedDefinition:
      'The term highlights that typical expectations are not universal. It supports conversations about access and inclusion. Being neurotypical does not mean someone has no challenges. It is one part of the broader neurodiversity framework.',
    whyItMattersHere: 'We use inclusive language that recognises a range of experiences.',
    commonMisunderstandings: ['Neurotypical means superior.', 'Neurotypical people have no stress.'],
    relatedTerms: ['neurodiversity', 'neurodivergent', 'inclusive-language'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'self-esteem',
    term: 'Self‑esteem',
    localeVariants: {
      uk: { spelling: 'Self‑esteem', notes: 'How you feel about yourself.', examples: ['Self‑esteem can be affected by feedback.'] },
      us: { spelling: 'Self‑esteem', notes: 'How you feel about yourself.', examples: ['Self‑esteem can be affected by feedback.'] },
    },
    plainEnglishDefinition:
      'Self‑esteem is how you feel about yourself. Supportive feedback and small wins can help build it.',
    extendedDefinition:
      'Self‑esteem grows through positive experiences, supportive relationships, and realistic goals. Shame and repeated failure can damage it. Clear support and encouragement make a difference. NeuroBreath emphasises strengths‑based guidance and achievable steps.',
    whyItMattersHere: 'We promote kind, confidence‑building routines and language.',
    commonMisunderstandings: ['Self‑esteem comes only from praise.', 'Low self‑esteem means someone is weak.'],
    relatedTerms: ['learning-confidence', 'self-advocacy', 'emotional-support'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-confidence-in-class'],
      tool: 'focus-tiles',
    },
  }),
  withDefaults({
    id: 'strengths-based',
    term: 'Strengths‑based',
    localeVariants: {
      uk: { spelling: 'Strengths‑based', notes: 'Focusing on strengths and capabilities.', examples: ['Strengths‑based support highlights what works.'] },
      us: { spelling: 'Strengths‑based', notes: 'Focusing on strengths and capabilities.', examples: ['Strengths‑based support highlights what works.'] },
    },
    plainEnglishDefinition:
      'Strengths‑based means focusing on strengths and capabilities, not only challenges. It helps build confidence and motivation.',
    extendedDefinition:
      'A strengths‑based approach recognises what people do well and uses those strengths to support growth. It avoids deficit‑only language. This approach improves engagement and wellbeing. NeuroBreath uses strengths‑based framing throughout the platform.',
    whyItMattersHere: 'Our guidance highlights practical strengths and positive routines.',
    commonMisunderstandings: ['Strengths‑based means ignoring challenges.', 'It is only motivational language.'],
    relatedTerms: ['neurodiversity', 'self-esteem', 'inclusive-language'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'inclusive-language',
    term: 'Inclusive language',
    localeVariants: {
      uk: { spelling: 'Inclusive language', notes: 'Language that respects different experiences.', examples: ['Inclusive language avoids assumptions.'] },
      us: { spelling: 'Inclusive language', notes: 'Language that respects different experiences.', examples: ['Inclusive language avoids assumptions.'] },
    },
    plainEnglishDefinition:
      'Inclusive language respects different experiences and avoids assumptions. It helps people feel safe and seen.',
    extendedDefinition:
      'Inclusive language avoids stereotypes and uses terms people prefer. It can include identity‑first or person‑first language depending on preference. Asking and respecting choices is key. NeuroBreath aims for supportive, non‑stigmatising language.',
    whyItMattersHere: 'Our tone prioritises respect, safety, and trust.',
    commonMisunderstandings: ['Inclusive language is about being overly cautious.', 'There is only one correct way to speak.'],
    relatedTerms: ['strengths-based', 'neurodiversity', 'self-advocacy'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-calm',
      guides: ['quick-calm-in-5-minutes'],
      tool: 'stress-tools',
    },
  }),
  withDefaults({
    id: 'assistive-reading',
    term: 'Assistive reading',
    localeVariants: {
      uk: { spelling: 'Assistive reading', notes: 'Supportive tools for reading.', examples: ['Assistive reading can include audio support.'] },
      us: { spelling: 'Assistive reading', notes: 'Supportive tools for reading.', examples: ['Assistive reading can include audio support.'] },
    },
    plainEnglishDefinition:
      'Assistive reading uses tools to make reading easier, such as audio or text‑to‑speech. It improves access without changing goals.',
    extendedDefinition:
      'Tools can include audiobooks, overlays, or text‑to‑speech apps. These supports reduce fatigue and increase comprehension. Using tools is a valid strategy, not a shortcut. The goal is access and confidence.',
    whyItMattersHere: 'We recommend practical supports that remove unnecessary barriers.',
    commonMisunderstandings: ['Assistive reading is cheating.', 'Only severe needs qualify for tools.'],
    relatedTerms: ['assistive-technology', 'reading-confidence', 'dyslexia'],
    tags: ['education', 'school'],
    recommendedNextLinks: {
      journey: 'starter-learning',
      guides: ['reading-routine-at-home'],
      tool: 'reading-training',
    },
  }),
  withDefaults({
    id: 'structured-routine',
    term: 'Structured routine',
    localeVariants: {
      uk: { spelling: 'Structured routine', notes: 'A routine with clear steps and timing.', examples: ['Structured routines reduce decision fatigue.'] },
      us: { spelling: 'Structured routine', notes: 'A routine with clear steps and timing.', examples: ['Structured routines reduce decision fatigue.'] },
    },
    plainEnglishDefinition:
      'A structured routine is a routine with clear steps and timing. It reduces decision fatigue and supports follow‑through.',
    extendedDefinition:
      'Structured routines work best when steps are short and realistic. They can include checklists, timers, or prompts. Flexibility matters; routines should adapt to real life. The goal is clarity and ease.',
    whyItMattersHere: 'Our tools provide structured routines for calm, focus, and sleep.',
    commonMisunderstandings: ['Structured routines are rigid.', 'They only work for children.'],
    relatedTerms: ['routines', 'organisation', 'checklists'],
    tags: ['education'],
    recommendedNextLinks: {
      journey: 'starter-organisation',
      guides: ['wind-down-routine'],
      tool: 'focus-tiles',
    },
  }),
];

export const GLOSSARY_TERM_MAP = new Map(GLOSSARY_TERMS.map(term => [term.id, term]));

export const POPULAR_TERM_IDS = [
  'adhd',
  'autism',
  'dyslexia',
  'executive-function',
  'sensory-overload',
  'time-blindness',
  'coherent-breathing',
  'reasonable-adjustments',
  'send',
  'iep',
];

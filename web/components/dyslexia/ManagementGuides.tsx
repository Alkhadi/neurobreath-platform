'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, GraduationCap, Heart, CheckCircle, Lightbulb,
  Baby, User, UserCheck, Briefcase, type LucideIcon,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type AgeGroup = 'children' | 'teenager' | 'adult' | 'senior';
type Role = 'self' | 'parent' | 'teacher' | 'carer' | 'employer';

interface GuideSection {
  title: string;
  tips: string[];
}

interface RoleGuide {
  title: string;
  icon: LucideIcon;
  color: string;
  intro: string;
  sections: GuideSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Age group config
// ─────────────────────────────────────────────────────────────────────────────
const ageGroupConfig: Record<AgeGroup, { label: string; range: string; icon: LucideIcon; roles: Role[] }> = {
  children:  { label: 'Children',   range: 'Ages 3–11',  icon: Baby,      roles: ['parent', 'teacher', 'self'] },
  teenager:  { label: 'Teenagers',  range: 'Ages 12–17', icon: User,      roles: ['self', 'parent', 'teacher'] },
  adult:     { label: 'Adults',     range: 'Ages 18–64', icon: UserCheck, roles: ['self', 'employer', 'carer'] },
  senior:    { label: 'Seniors',    range: 'Ages 65+',   icon: Heart,     roles: ['self', 'carer'] },
};

const roleLabels: Record<Role, { label: string; icon: LucideIcon }> = {
  self:     { label: 'Self / Individual', icon: User },
  parent:   { label: 'For Parents',       icon: Users },
  teacher:  { label: 'For Teachers',      icon: GraduationCap },
  carer:    { label: 'For Carers',        icon: Heart },
  employer: { label: 'For Employers',     icon: Briefcase },
};

// ─────────────────────────────────────────────────────────────────────────────
// Guide content
// ─────────────────────────────────────────────────────────────────────────────
const guides: Record<AgeGroup, Partial<Record<Role, RoleGuide>>> = {

  // ── CHILDREN ──────────────────────────────────────────────────────────────
  children: {
    parent: {
      title: 'Guide for Parents of Children with Dyslexia',
      icon: Users, color: 'blue',
      intro: 'Children with dyslexia thrive with consistent, structured support at home. Your involvement is the single most powerful factor in your child\'s progress.',
      sections: [
        {
          title: 'Daily Reading & Practice Routines',
          tips: [
            'Read together for 10–15 minutes every day — this is the single most impactful thing you can do',
            'Let your child choose the books — interest fuels engagement. Comics, non-fiction, and graphic novels all count',
            'Use audiobooks alongside print — follow the words on the page while listening to the narration',
            'After reading, ask: "What happened? What\'s your favourite part? What do you think happens next?"',
            'Play rhyming games, tongue twisters, and "I Spy" with letter sounds during car journeys or mealtimes',
            'Revisit the same book 3–4 times — familiarity builds fluency and confidence',
            'Short sessions (10–15 min) every day beat one long session per week',
          ],
        },
        {
          title: 'Homework & Spelling Support',
          tips: [
            'Read assignment instructions aloud together before your child begins',
            'Allow extra time — dyslexic learners need 1.5–2× longer for reading and writing tasks',
            'Let your child dictate answers while you scribe — separates the thinking from the writing',
            'Use Look–Say–Cover–Write–Check for 5 spelling words per week (not 20)',
            'Rainbow writing: trace the word in three colours over the tricky part to cement visual memory',
            'Provide a word bank for any written tasks — reduces cognitive load',
            'Break written tasks into steps: brainstorm → plan → write → edit (never simultaneously)',
            'Avoid correcting every spelling error — focus on content and ideas first',
          ],
        },
        {
          title: 'Building Confidence & Emotional Wellbeing',
          tips: [
            'Dyslexia is not a reflection of intelligence — remind your child of this regularly and genuinely',
            'Share stories of dyslexic achievers: Richard Branson, Whoopi Goldberg, Orlando Bloom, Keira Knightley',
            'Focus conversations on strengths: creativity, storytelling, spatial thinking, empathy',
            'Validate frustration: "I understand this is hard. You are not lazy. Your brain works differently."',
            'Never compare to siblings, classmates, or "what other children can do"',
            'Find one activity where your child excels and prioritise it — sport, art, music, cooking, building',
            'Monitor for anxiety or school refusal — early emotional support prevents long-term difficulties',
            'Seek school counselling if self-esteem becomes severely affected',
          ],
        },
        {
          title: 'Advocacy, School & SEND Support',
          tips: [
            'Request a formal assessment from the SENCo (Special Educational Needs Coordinator) in writing',
            'Ask what support your child is receiving — interventions, reading recovery, specialist teaching',
            'Learn about EHCPs (Education, Health and Care Plans) in England — your child may qualify',
            'Request reasonable adjustments: extra time, coloured paper, assistive technology, reader/scribe',
            'Attend all SEND review meetings and ask for a written record of decisions',
            'Keep a folder of all written communications with the school',
            'The British Dyslexia Association (BDA) helpline can advise you on your rights: 0333 405 4555',
            'Consider a private Educational Psychologist assessment if school assessment is delayed',
          ],
        },
        {
          title: 'Assistive Technology at Home',
          tips: [
            'Text-to-Speech: NaturalReader (free, browser) or Read&Write for Google Chrome',
            'Voice dictation: Enable the microphone on the keyboard — free on iOS, Android, Windows and Mac',
            'Audiobooks: Storynory (free, children\'s stories), Libby (free via library card), Learning Ally',
            'Spelling: Grammarly (free) catches spelling errors in any online text',
            'Anki (free app): spaced repetition flashcards for weekly spelling words',
            'Coloured backgrounds: change browser and document backgrounds to cream or yellow — reduces visual stress for ~20% of dyslexic learners',
            'Use a large, clear font (Arial, Verdana, OpenDyslexic) at size 14+ for all reading at home',
          ],
        },
      ],
    },

    teacher: {
      title: 'Guide for Primary School Teachers',
      icon: GraduationCap, color: 'purple',
      intro: 'Dyslexia affects 1 in 10 pupils. Structured, multisensory teaching benefits every learner in your class, not just those with identified dyslexia.',
      sections: [
        {
          title: 'Classroom Accommodations',
          tips: [
            'Provide printed handouts — never require dyslexic pupils to copy from the board',
            'Use large, clear fonts (min size 14, Arial or Comic Sans) on all worksheets',
            'Print on cream or pastel paper — reduces visual stress that affects ~20% of dyslexic learners',
            'Allow text-to-speech software (NaturalReader, Read&Write) for all written tasks',
            'Give extra time: at least 25% for in-class reading/writing tasks',
            'Seat the pupil near the front, away from visual distractions',
            'Reduce the amount of text per page — white space helps processing',
            'Allow keyboard/tablet for written work where possible',
          ],
        },
        {
          title: 'Structured Literacy Teaching',
          tips: [
            'Teach phonics explicitly and systematically — every child benefits, dyslexic children depend on it',
            'Use multisensory methods: say, see, write, trace — all simultaneously (Orton-Gillingham approach)',
            'Pre-teach vocabulary before reading tasks — unfamiliar words become decoding barriers',
            'Break instructions into numbered steps — never give more than 2–3 steps at a time verbally',
            'Use graphic organizers for writing tasks (mind maps, story frames, PEEL templates)',
            'Provide word banks, vocabulary mats, and spelling aids for all writing tasks',
            'Review and revisit previously taught phonics patterns weekly — spaced repetition',
            'Use choral reading and echo reading to build fluency without putting one child on the spot',
          ],
        },
        {
          title: 'Assessment & Feedback',
          tips: [
            'Assess for content knowledge, not spelling accuracy — mark spelling separately if at all',
            'Offer oral assessment as an alternative to written tests',
            'Allow multiple-choice formats alongside written answer questions',
            'Provide questions in advance for tests where possible',
            'Give specific, positive feedback: "Your story idea was creative and I loved the detail"',
            'Never ask a dyslexic pupil to read aloud unexpectedly — it causes humiliation and anxiety',
            'Ask privately if they\'d like to read aloud, and give preparation time if so',
            'Focus marking on 1–2 targets at a time — not a sea of red pen',
          ],
        },
        {
          title: 'Building Confidence in Class',
          tips: [
            'Find and publicly celebrate each dyslexic pupil\'s strengths — storytelling, art, sport, problem-solving',
            'Educate the class about different ways of learning — a "brain differences" lesson reduces stigma',
            'Seat dyslexic learners with supportive peers, not away from the class',
            'Avoid reading round the class (everyone reading one sentence in turn) — this is particularly stressful',
            'Create low-stakes oral discussion opportunities — dyslexic learners often excel verbally',
            'Use think-pair-share before written tasks — discussing ideas first improves written output',
            'Communicate regularly with parents about what is working and any concerns',
          ],
        },
        {
          title: 'Early Identification',
          tips: [
            'Red flags by age 5–6: difficulty learning letter sounds, poor rhyme awareness, slow letter naming',
            'Red flags by age 7–8: reading significantly below peers, letter reversals persisting, poor sight word retention',
            'Use validated screening tools: LUCID Rapid, GL Assessment, or the BDA\'s online screener',
            'Refer to the SENCo for further assessment if two or more red flags are present',
            'Early intervention (before age 7) produces the greatest gains — act quickly',
            'Keep observation records: specific difficulties, strategies tried, and responses observed',
          ],
        },
      ],
    },

    self: {
      title: 'For You (The Child)',
      icon: User, color: 'emerald',
      intro: 'Your brain works differently — and that is actually pretty amazing. Here are some tricks that make reading and writing easier and more fun.',
      sections: [
        {
          title: 'Reading Made Easier',
          tips: [
            'Use your finger or a ruler under each line — it stops the words from jumping around',
            'Try coloured reading rulers or ask for cream coloured paper — some brains find this much easier',
            'Audiobooks are reading! Listen AND follow the words in the book — double the power',
            'Read books you LOVE — comics, football facts, dinosaurs, whatever excites you',
            'If a word is hard, break it into bits: "fan-tas-tic" = 3 sounds you already know',
            'Storynory.com has amazing free audio stories you can listen to any time',
          ],
        },
        {
          title: 'Spelling & Writing Tips',
          tips: [
            'Look at the word, say it, cover it, write it from memory, check it — this really works!',
            'Think of a funny story to remember tricky words: "because = big elephants can always understand small elephants"',
            'Say your ideas OUT LOUD first — then write them down. Your voice knows more than your spelling',
            'Don\'t stop to fix spelling while you\'re writing your ideas — write everything first, then check',
            'You can use the microphone on a tablet or phone to say words and it will type them for you',
          ],
        },
        {
          title: 'You Are Brilliant At…',
          tips: [
            'Big-picture thinking — you often see how things connect in ways others miss',
            'Storytelling and imagination — many brilliant authors, filmmakers and artists have dyslexia',
            'Problem-solving — your brain finds creative solutions because it approaches things differently',
            'Building and making things — spatial thinking is a dyslexic superpower',
            'Empathy — many dyslexic people are brilliant at understanding how others feel',
            'Richard Branson, Keira Knightley, Orlando Bloom, Henry Winkler and Albert Einstein all had dyslexia',
          ],
        },
      ],
    },
  },

  // ── TEENAGERS ─────────────────────────────────────────────────────────────
  teenager: {
    self: {
      title: 'Managing Dyslexia as a Teenager',
      icon: User, color: 'blue',
      intro: 'School gets harder as you get older — but the strategies get better too. These tools will help you work smarter, not harder, and advocate for what you need.',
      sections: [
        {
          title: 'Study Strategies That Work',
          tips: [
            'Pomodoro technique: 25 minutes focused study → 5-minute break. Repeat 4 times, then a longer break',
            'Mind-map before writing anything — visual planning is faster and more natural for dyslexic thinkers',
            'Use the PEEL structure for essays: Point → Evidence → Explain → Link. One paragraph at a time',
            'SQ3R reading method: Survey (skim headings) → Question → Read → Recite → Review',
            'Anki or Quizlet flashcards for vocabulary and key facts — spaced repetition beats cramming',
            'Record lessons (with permission) and listen back at 1.5× speed instead of re-reading notes',
            'Use colour-coded notes: different subjects/topics in different colours — reduces retrieval time',
            'Study in 25-minute blocks — your working memory works better in short bursts',
          ],
        },
        {
          title: 'Technology That Changes Everything',
          tips: [
            'Natural Reader or Speechify: paste any text — textbook, PDF, website — and hear it read aloud',
            'Microsoft Immersive Reader: built into Word, Teams, OneNote. Reads documents aloud and spaces words',
            'Google Docs voice typing: Tools → Voice Typing → speak your essay and it types it for you',
            'Grammarly: catches spelling and grammar errors in real time across all websites and apps (free)',
            'Anki app (free): best flashcard app in the world — spaced repetition science built in',
            'Otter.ai: records voice memos and gives you a typed transcript automatically',
            'Dragon Dictate (school may provide): highest accuracy dictation for long essays and assignments',
          ],
        },
        {
          title: 'Exam Preparation & Access Arrangements',
          tips: [
            'Ask your SENCo about access arrangements — you may be entitled to: extra time (25%), reader, scribe, computer',
            'Apply early — access arrangement applications need to be submitted well before exams',
            'Practice under exam conditions with your accommodations so they feel natural on the day',
            'Highlight key words in every exam question before you start writing',
            'Answer the question you know best first — builds confidence and momentum',
            'Brain dump: write all the key facts/dates/terms on your rough paper before you begin',
            'For multi-part questions: answer each part separately — show the examiner you understand each point',
            'Spelling is NOT marked in most GCSE content marks — focus on demonstrating knowledge',
          ],
        },
        {
          title: 'Self-Advocacy at School',
          tips: [
            'You have a right to support — you do not need to manage alone',
            'Talk to your SENCo or form tutor: "I have dyslexia and I find [specific task] very difficult. Can we discuss strategies?"',
            'If a teacher asks you to read aloud unexpectedly, it is OK to say: "I\'d prefer not to, but I\'m happy to answer questions"',
            'Keep a record of which accommodations work for you — this helps when changing schools or applying to college',
            'UCAS and universities have disability offices — they will support you into higher education',
            'Your dyslexia does not define your intelligence — the IDA confirms there is no link between dyslexia and IQ',
          ],
        },
        {
          title: 'Managing Confidence & Stress',
          tips: [
            'It is completely normal to feel frustrated — dyslexia makes tasks genuinely harder for you than for most peers',
            'Your brain is not broken — it is differently wired. Many of the world\'s most successful people are dyslexic',
            'Listen to the "Made By Dyslexia" podcast — hearing from successful dyslexic adults is genuinely motivating',
            'Focus on subjects and activities where you shine — build that part of your identity',
            'Talk to a trusted adult (parent, tutor, counsellor) if anxiety about school becomes overwhelming',
            'Regular physical exercise is one of the most evidence-based interventions for focus and mood',
          ],
        },
      ],
    },

    parent: {
      title: 'Supporting Your Teenager with Dyslexia',
      icon: Users, color: 'emerald',
      intro: 'The teenage years bring new pressures: GCSEs, social dynamics, growing independence. Your role shifts from hands-on helper to coach and advocate.',
      sections: [
        {
          title: 'Supporting Independent Study',
          tips: [
            'Help set up technology tools once — Natural Reader, Immersive Reader, Anki — then step back',
            'Offer to read through essays after they\'re drafted, not while writing (avoids dependency)',
            'Discuss what study strategies are working at school — some will fail, and that\'s fine',
            'Create a quiet, organised study space with minimal distractions',
            'Support Pomodoro sessions: 25 minutes on, 5 off — time them if helpful',
            'Do not do homework for your child — discuss ideas aloud together instead',
          ],
        },
        {
          title: 'Exam & Access Arrangements',
          tips: [
            'Contact the SENCo at the start of Year 10 (or equivalent) to ensure access arrangements are in place',
            'Access arrangements require evidence of need — ensure assessments are up to date',
            'Attend parents\' evenings specifically to discuss dyslexia support for each subject',
            'Ask whether teachers are aware of your child\'s dyslexia — not all will be',
            'Revision: help create a revision timetable; break each subject into topic cards (not re-reading notes)',
            'Exam day: ensure they have eaten, slept well, and know exactly what accommodations are in place',
          ],
        },
        {
          title: 'Emotional Support',
          tips: [
            'Listen more than you advise — teenagers with dyslexia often feel deeply ashamed of their difficulties',
            'Avoid "you\'re so clever, you just need to try harder" — this is damaging and inaccurate',
            'Validate specifically: "I know that took you twice as long as it should have. That\'s dyslexia, not you"',
            'Share success stories of dyslexic young people — Richard Branson left school at 16, no qualifications',
            'Monitor for depression and anxiety — higher rates in dyslexic teens; seek professional support early',
            'Ensure they have friendships and activities outside school where they feel competent',
          ],
        },
        {
          title: 'Transition & Future Planning',
          tips: [
            'Help your teenager research A-level or vocational options that suit their learning profile',
            'Universities have disability offices — contact them before applying for UCAS (not after acceptance)',
            'UCAS personal statement: dyslexia demonstrates resilience, problem-solving, and self-awareness. These are strengths',
            'Disabled Students\' Allowance (UK): covers specialist equipment, support workers, dyslexia coaching',
            'Workplace: the Equality Act 2010 requires employers to make reasonable adjustments for dyslexia',
          ],
        },
      ],
    },

    teacher: {
      title: 'Guide for Secondary School Teachers',
      icon: GraduationCap, color: 'purple',
      intro: 'In secondary school, the volume of reading and writing increases dramatically. Small adjustments to your teaching and assessment practice make a significant difference to dyslexic students.',
      sections: [
        {
          title: 'Subject-Specific Accommodations',
          tips: [
            'Always provide printed notes/slides — never require copying from a board or PowerPoint in a timed lesson',
            'Provide a vocabulary glossary for every topic unit — pre-taught, not discovered mid-reading',
            'Give written instructions as well as verbal ones — working memory difficulties mean verbal instructions are often lost',
            'Allow typed work for all tasks where possible',
            'Reduce text density on worksheets — triple spacing, clear headings, white space between sections',
            'Offer audio versions of set texts (Librivox for classics, Learning Ally for set texts)',
            'For long homework tasks, build in checkpoints — a planning stage, a drafting stage, an editing stage',
          ],
        },
        {
          title: 'Assessment That Measures Knowledge',
          tips: [
            'Separate content marks from SPaG (spelling, punctuation, grammar) — never penalise knowledge for spelling',
            'Offer oral assessment as an alternative, especially for EAL students with dyslexia',
            'Multiple-choice, short-answer, and annotated diagram formats reduce the decoding burden',
            'Provide a bank of key terms for any exam-style question',
            'Allow extended time for in-class assessments (25%+)',
            'For essays: accept a detailed plan as part of the assessed work — shows understanding even if the prose is difficult',
          ],
        },
        {
          title: 'Classroom Environment',
          tips: [
            'Use dyslexia-friendly fonts (Arial, Verdana, Comic Sans at 14pt) on all materials',
            'Print on cream or yellow paper — request this from your department at the start of each year',
            'Seat students with dyslexia near the front and away from visual distractions',
            'When calling on students to answer verbally, give think time: "I\'ll come back to you in 30 seconds"',
            'Never ask a student to read aloud without warning and preparation time',
            'Use Microsoft Immersive Reader in Teams/OneNote — it reads lessons aloud and is built into Office 365',
          ],
        },
        {
          title: 'Communication With Student & Parents',
          tips: [
            'Know which students in your class have dyslexia — check with the SENCO at the start of each year',
            'Check in privately: "I know reading dense texts can be challenging. Here\'s how I can help in my lesson"',
            'Share what is working with the SENCo and form tutor — consistency across subjects is crucial',
            'Contact parents proactively at the first sign of academic difficulty — do not wait for grades to slip',
          ],
        },
      ],
    },
  },

  // ── ADULTS ────────────────────────────────────────────────────────────────
  adult: {
    self: {
      title: 'Self-Management Guide for Adults with Dyslexia',
      icon: User, color: 'blue',
      intro: 'Dyslexia in adults is massively underdiagnosed. Whether you were identified at school or have only recently recognised it, evidence-based strategies and technology can transform your daily life.',
      sections: [
        {
          title: 'Reading & Information Processing',
          tips: [
            'Speechify or Natural Reader: converts any text on your screen — emails, PDFs, articles — into clear audio',
            'Read&Write (Texthelp): browser extension that reads webpages and documents aloud. Free personal version',
            'Microsoft Immersive Reader: built into Office 365, OneNote, Teams. Reads and spaces text for free',
            'Pre-read before meetings: skim agendas, headings and the first sentence of each section',
            'SQ3R method for important documents: Survey → Question → Read → Recite → Review',
            'Print in Arial/Verdana size 14+ on cream paper — visually reduces processing demand',
            'Audiobooks (Audible, Libby/free via library) for books you need to engage with for work or pleasure',
          ],
        },
        {
          title: 'Writing & Communication at Work',
          tips: [
            'Voice dictation first, edit second — Google Docs voice typing or Dragon Dictate for all draft writing',
            'Dictate emails at full speaking speed — then read back once and edit. Never type-and-correct simultaneously',
            'Grammarly: install free version on all devices — catches spelling and grammar errors in real time',
            'Use email templates for frequently sent messages — reduces the writing load by 60–70%',
            'Write bullet points first, then convert to prose — prevents blank-page anxiety',
            'Request written agendas and meeting notes from colleagues — this is a reasonable and professional ask',
            'Otter.ai: records meetings and conversations, then generates a typed transcript automatically',
          ],
        },
        {
          title: 'Organisation & Time Management',
          tips: [
            'Weekly planning: every Sunday, list all tasks, estimate time (double first instinct), schedule into calendar slots',
            'Colour-code your calendar: blue = meetings, green = deep work, orange = admin, red = deadlines',
            'Break every multi-step task into numbered steps on paper before beginning',
            'Pomodoro sessions: 25 minutes on one task, 5-minute break — use Forest app or a simple phone timer',
            'Voice reminders: use Siri, Google Assistant or Alexa for verbal task reminders throughout the day',
            'Photo-capture documents, receipts, and whiteboards with your phone — removes transcription time',
            'Keep one trusted paper notebook for hand-written capture — not multiple scraps of paper',
          ],
        },
        {
          title: 'Workplace Self-Advocacy',
          tips: [
            'Disclosure is a personal choice — you are NOT legally required to disclose dyslexia to an employer',
            'The Equality Act 2010 (UK) requires employers to make "reasonable adjustments" once dyslexia is disclosed',
            'Reasonable adjustments that are commonly granted: extra time for written tasks, assistive software, written instructions, flexible deadlines',
            'Request a referral to Occupational Health — they can formally recommend adjustments to management',
            'Access to Work (UK government scheme): funds assistive technology, support workers, and dyslexia coaching in the workplace',
            'Frame requests positively: "I produce my best work when I have written instructions/extra time to draft"',
            'Join the BDA\'s Adult Dyslexia Group for peer support and advice on workplace rights',
          ],
        },
        {
          title: 'Confidence & Identity',
          tips: [
            'Listen to "Made By Dyslexia" podcast — interviews with CEOs, artists, and entrepreneurs who are dyslexic',
            'Dyslexic thinking is valued in creative industries, entrepreneurship, architecture, engineering, and the arts',
            'Keep a weekly Strengths Journal: 3 things that went well + 1 dyslexic strength you used (storytelling, pattern-recognition, creativity)',
            'Seek out a dyslexia coach or specialist tutor for adults — structured support produces measurable gains at any age',
            'Research confirms adults make significant progress with structured practice — it is never too late',
            'You are not lazy, careless or unintelligent. Dyslexia is a neurological difference, not a character flaw',
          ],
        },
        {
          title: 'Daily Listening Practice',
          tips: [
            'Replace reading news with listening: BBC Sounds, podcasts, NPR — 20 minutes daily builds vocabulary',
            'Audiobooks at 1.25× speed: listen to books at your intellectual level, not your decoding level',
            'Recommended podcasts: "Made By Dyslexia", "Dyslexia Quest", "Understood — Thinking Differently"',
            'Libby app (free via library card): borrow audiobooks and e-books for nothing',
            'Daily freewriting: 5 minutes, 3 sentences, no editing — builds writing automaticity and confidence',
            'Morning routine: dictate a voice note about your day\'s top 3 priorities — externalises working memory',
          ],
        },
      ],
    },

    employer: {
      title: 'Guide for Employers & Line Managers',
      icon: Briefcase, color: 'indigo',
      intro: 'Dyslexic employees bring exceptional strengths in creative thinking, problem-solving, and verbal communication. Supporting them well retains talented people and fulfils your legal obligations.',
      sections: [
        {
          title: 'Legal Obligations (UK)',
          tips: [
            'The Equality Act 2010 classifies severe dyslexia as a disability — employers must make reasonable adjustments',
            'Adjustments are required once the employer is aware of the disability — ignorance is not a legal defence',
            'Reasonable adjustments: assistive software, extra time for written tasks, written instructions, flexible deadlines, ergonomic workspace',
            'Failure to make reasonable adjustments is unlawful disability discrimination',
            'Access to Work (UK): government scheme that funds workplace adjustments, including assistive technology and coaching, at no cost to the employer',
            'Keep all adjustment agreements in writing — protects both employer and employee',
          ],
        },
        {
          title: 'Practical Workplace Adjustments',
          tips: [
            'Provide assistive software: Dragon Dictate, Read&Write, or Grammarly — contact Access to Work for funding',
            'Give all instructions in writing, not just verbally — working memory differences mean verbal-only instructions are frequently lost',
            'Allow extra time for written reports, emails, and presentations — extend deadlines proportionately',
            'Offer alternatives to written assessments during recruitment — presentations, practical tasks, or verbal interviews',
            'Never put an employee on the spot to read aloud in meetings — ask in advance',
            'Provide meeting agendas in advance — preparation time removes processing pressure',
            'Consider flexible working where focus tasks can be completed at quieter times',
          ],
        },
        {
          title: 'Recruitment',
          tips: [
            'Ask all candidates: "Is there anything we can do to make this process more accessible for you?"',
            'Offer alternative assessment formats: work samples, task-based assessments, verbal discussion',
            'Allow spelling errors in written applications — they do not predict job performance',
            'Shortlist on evidence of skill and experience — written communication is one dimension, not the only one',
            'Be explicit in job adverts: "We welcome applications from candidates with dyslexia and learning differences"',
            'Train hiring managers on unconscious bias against written-communication imperfections',
          ],
        },
        {
          title: 'Supporting Strengths',
          tips: [
            'Dyslexic employees often excel in: creative problem-solving, big-picture thinking, verbal presentations, people management',
            'Assign roles that leverage verbal communication, spatial reasoning, and creative thinking',
            'Pair dyslexic employees with strong administrative support for documentation-heavy tasks where feasible',
            'Dyslexia is heavily represented in senior leadership, entrepreneurship, and creative industries — your dyslexic employees may be your future leaders',
            'Ask the employee what works: "What does your ideal working environment look like?" — autonomy is motivating',
          ],
        },
      ],
    },

    carer: {
      title: 'Guide for Carers of Adults with Dyslexia',
      icon: Heart, color: 'rose',
      intro: 'Caring for an adult with dyslexia means understanding how it affects daily tasks — paperwork, communication, technology — and offering practical, empowering support.',
      sections: [
        {
          title: 'Understanding Adult Dyslexia',
          tips: [
            'Adult dyslexia often co-exists with anxiety, low self-esteem, and avoidance of written tasks — these are secondary effects, not separate issues',
            'Daily living challenges: reading letters and bills, filling in forms, reading medication labels, navigating public transport information',
            'Strengths: many adults with dyslexia are highly capable verbally, spatially, and creatively — focus on these',
            'Never assume they "should" be able to do a reading or writing task — dyslexia does not disappear with age',
            'Ask: "Would you like me to read this to you?" rather than reading aloud without asking',
          ],
        },
        {
          title: 'Practical Daily Support',
          tips: [
            'Assist with important paperwork: benefits forms, medical letters, tenancy agreements — read and explain each section',
            'Voice reminders (Alexa, Google Home) reduce reliance on written notes for appointments and medication',
            'Set up Speechify or Natural Reader on their device — paste any text for instant audio',
            'Label items with pictures as well as words where helpful',
            'Use a consistent visual weekly planner on the wall — reduces reliance on written memory aids',
            'Accompany to appointments where reading forms or written instructions is required, if they wish',
          ],
        },
        {
          title: 'Communication',
          tips: [
            'Give one instruction at a time — not a list of three or four in sequence',
            'Confirm understanding without being condescending: "Let me just make sure I\'ve explained that clearly"',
            'Offer to write down key information as a reference — rather than assuming it\'s been retained',
            'Do not finish their sentences or rush them in conversations',
            'Discuss important decisions verbally first, then follow up with simple written notes for reference',
          ],
        },
        {
          title: 'Maintaining Independence & Dignity',
          tips: [
            'Support them to access technology independently — teach, don\'t do for them',
            'Encourage use of Access to Work if in employment — they are entitled to significant funded support',
            'The Adult Dyslexia Organisation provides resources, helplines, and referrals: www.adult-dyslexia.org',
            'Support them in disclosing to employers or services where this would unlock adjustments',
            'Celebrate successes specifically and genuinely — "You handled that phone call really well"',
          ],
        },
      ],
    },
  },

  // ── SENIORS ───────────────────────────────────────────────────────────────
  senior: {
    self: {
      title: 'Managing Dyslexia as a Senior',
      icon: User, color: 'blue',
      intro: 'Research confirms that structured practice produces real gains at any age. Listening, speaking, and creative thinking — likely among your greatest strengths — remain powerful tools for learning and connection.',
      sections: [
        {
          title: 'Daily Reading Without Stress',
          tips: [
            'RNIB Talking Books: free UK audiobook postal and download service for anyone with a print disability — call 0303 123 9999 to register',
            'Librivox.org: completely free classic audiobooks — Dickens, Austen, Agatha Christie — no subscription needed',
            'Libby app (free): borrow audiobooks from your local library using your library card — thousands of titles',
            'BBC Sounds: listen to any BBC Radio programme on demand — news, documentaries, drama, completely free',
            'Speechify app: point your phone camera at a newspaper or printed letter and hear it read aloud immediately',
            'Large-print books are available free from most public libraries — ask at the counter',
            'Change your device text size: Settings → Display → Font size (increase to Large or Extra Large)',
          ],
        },
        {
          title: 'Technology Made Simple',
          tips: [
            'Voice assistants: "Alexa, read me the news" / "Hey Google, set a reminder for my appointment" — reduce reliance on written notes',
            'Phone voice dictation: tap the microphone icon on your keyboard to speak messages, emails, and notes',
            'NaturalReader (free, naturalreaders.com): paste any text from a website or email and press play',
            'Grammarly: free spell-check extension that quietly fixes typos in all emails and messages',
            'Zoom in on any document: pinch to zoom on a phone/tablet, or Ctrl + on a computer keyboard',
            'Smart speaker (Amazon Echo / Google Nest): set up once, then control entirely by voice — reading, reminders, music, calls',
          ],
        },
        {
          title: 'Keeping the Mind Active',
          tips: [
            'BBC Radio 4 "In Our Time" (bbc.co.uk/sounds): 45-minute deep dives into history, science, art and philosophy — entirely free',
            'Wordle (once daily, online): enjoyable 5-minute word pattern game — free at nytimes.com/games/wordle',
            'Guardian Quick Crossword (free online): 15–20 minutes of gentle cognitive stimulation',
            'Scrabble, Boggle, Bananagrams with friends or family — word play is genuinely stimulating',
            'Learn one new word per week — write it on the wall calendar and use it 3 times',
            'Discuss what you read or hear with a friend — verbal discussion is both social and cognitive',
          ],
        },
        {
          title: 'Your Life Story',
          tips: [
            'Record your memories and stories using your phone\'s voice recorder — these are irreplaceable',
            'Otter.ai (free plan): record your voice and get a typed transcript automatically — no typing needed',
            'Your life experience is rich — consider dictating a memoir for your family, one story per week',
            'Life story work has proven mental health benefits — reminiscence reduces depression and increases connection',
            'A library or community centre may run a reminiscence group — these welcome both speakers and listeners',
            'BBC Capture Wales initiative: inspiration and guidance for recording your own life story',
          ],
        },
        {
          title: 'Managing Paperwork & Correspondence',
          tips: [
            'Ask your GP surgery, bank and utility providers for large-print or audio versions of letters — you are entitled to request this',
            'Speechify app: photograph any letter with your phone camera and hear it read aloud in seconds',
            'Family or carers: ask for help with complex forms — DWP, NHS, pension — without shame',
            'Citizens Advice: free support with understanding letters, forms and your rights — www.citizensadvice.org.uk',
            'Age UK helpline: 0800 678 1602 — free advice on daily living, benefits and local support',
          ],
        },
      ],
    },

    carer: {
      title: 'Guide for Carers of Seniors with Dyslexia',
      icon: Heart, color: 'rose',
      intro: 'Many older adults with dyslexia were never diagnosed at school. They may have developed sophisticated coping strategies — or they may be struggling quietly. Compassionate, practical support makes a profound difference.',
      sections: [
        {
          title: 'Understanding Their Experience',
          tips: [
            'Many seniors with dyslexia grew up in an era when it was called "stupidity" or "laziness" — decades of shame can follow',
            'They may have highly developed verbal intelligence and life skills, but still struggle intensely with reading and writing',
            'Never express surprise that they struggle to read — it minimises a real difficulty',
            'Ask: "Would you like me to read this to you?" always as an offer, not an assumption',
            'Watch for avoidance of written tasks — this is coping, not laziness',
          ],
        },
        {
          title: 'Practical Daily Assistance',
          tips: [
            'Read important letters aloud and explain each section in plain language',
            'Set up voice assistants (Amazon Alexa, Google Nest) — controlled entirely by speech, no reading required',
            'Register them for RNIB Talking Books (free UK service) — call 0303 123 9999',
            'Install Speechify on their tablet or phone — then demonstrate photographing printed text to hear it read',
            'Set up large-print on all their devices once — they can then use independently',
            'Create a visual wall planner for the week with pictures or colours for different appointment types',
          ],
        },
        {
          title: 'Communication',
          tips: [
            'Give information verbally, one point at a time — not a written list',
            'Summarise key information in a brief, simple written note for them to keep for reference',
            'Do not rush them when they\'re reading, writing or processing written information',
            'Repeat key points naturally: "Just to confirm, your appointment is Tuesday at 2pm"',
            'Encourage them to use voice notes on their phone to record things they want to remember',
          ],
        },
        {
          title: 'Social Connection & Wellbeing',
          tips: [
            'Book clubs that focus on audiobooks and discussion (not reading aloud) are deeply inclusive',
            'BBC Radio programmes create shared topics for conversation — ask them about what they\'ve been listening to',
            'Encourage intergenerational activities where verbal wisdom is valued over written skills',
            'Isolation and low self-worth are higher in older dyslexic adults — regular social contact is protective',
            'Age UK and local councils often run life-story and reminiscence groups — these are excellent fits',
          ],
        },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function ManagementGuides() {
  const [activeAge, setActiveAge] = useState<AgeGroup>('children');
  const [activeRole, setActiveRole] = useState<Role>('parent');

  const ageConfig = ageGroupConfig[activeAge];
  const availableRoles = ageConfig.roles;
  const currentRole = availableRoles.includes(activeRole) ? activeRole : availableRoles[0];
  const currentGuide = guides[activeAge]?.[currentRole];

  const handleAgeChange = (age: AgeGroup) => {
    setActiveAge(age);
    const firstRole = ageGroupConfig[age].roles[0];
    setActiveRole(firstRole);
  };

  const IconComponent = currentGuide?.icon ?? User;
  const color = currentGuide?.color ?? 'blue';

  return (
    <section id="guides" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Management Guides</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Practical, evidence-based strategies for every age group and every role — individual, parent, teacher, carer, and employer.
                Select your age group and role below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Age Group Selector */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Select age group:</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ageGroupConfig) as [AgeGroup, typeof ageGroupConfig[AgeGroup]][]).map(([age, cfg]) => {
            const AgeIcon = cfg.icon;
            return (
              <button
                key={age}
                onClick={() => handleAgeChange(age)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all
                  ${activeAge === age
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-blue-300'
                  }`}
              >
                <AgeIcon className="w-4 h-4 flex-shrink-0" />
                <span>{cfg.label}</span>
                <span className={`hidden sm:inline text-xs ${activeAge === age ? 'text-blue-200' : 'text-muted-foreground'}`}>{cfg.range}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Selector */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Select role:</p>
        <div className="flex flex-wrap gap-2">
          {availableRoles.map(role => {
            const roleCfg = roleLabels[role];
            const RoleIcon = roleCfg.icon;
            return (
              <Button
                key={role}
                variant={currentRole === role ? 'default' : 'outline'}
                onClick={() => setActiveRole(role)}
                className="flex items-center gap-1.5"
                size="sm"
              >
                <RoleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                {roleCfg.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Guide Content */}
      {currentGuide ? (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Guide header */}
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/50 flex-shrink-0`}>
                <IconComponent className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{currentGuide.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{currentGuide.intro}</p>
              </div>
            </div>

            {currentGuide.sections.map((section, index) => (
              <div key={index} className="space-y-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full bg-${color}-100 dark:bg-${color}-900/50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-${color}-600 dark:text-${color}-400`}>
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{section.title}</h4>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 text-${color}-500 dark:text-${color}-400 flex-shrink-0 mt-0.5`} />
                      <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p className="text-sm">Select an age group and role to view the guide.</p>
          </CardContent>
        </Card>
      )}

      {/* Key reminders */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <h3 className="text-base font-bold text-foreground">Universal Principles</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold flex-shrink-0">•</span>
              <span><strong>Consistency over intensity:</strong> 10–15 minutes daily beats one long session per week — at every age.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold flex-shrink-0">•</span>
              <span><strong>Listening is reading:</strong> Audiobooks and podcasts build vocabulary and comprehension at intellectual level — not decoding level.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold flex-shrink-0">•</span>
              <span><strong>Technology removes barriers:</strong> TTS, dictation, and AI spelling tools level the playing field. Use them without apology.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold flex-shrink-0">•</span>
              <span><strong>Progress at any age:</strong> Research confirms that structured literacy intervention produces real gains in adults and seniors, not just children.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold flex-shrink-0">•</span>
              <span><strong>These guides complement professional support</strong> — not replace it. Contact the BDA helpline (0333 405 4555) for specialist referrals.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

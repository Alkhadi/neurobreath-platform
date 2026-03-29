'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  loadAssessmentResult,
  loadTrainingProgress,
  saveTrainingProgress,
  clearAssessmentResult,
  type AgeGroup,
  type ScoreLevel,
  type DyslexiaAssessmentResult,
  type TrainingProgress,
} from '@/lib/dyslexia/assessment-store';
import {
  BookOpen,
  Brain,
  Clock,
  Star,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Flame,
  ChevronRight,
  Lightbulb,
  Volume2,
  Pencil,
  Shuffle,
  Trophy,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface DailyTask {
  id: string;
  time: string;
  title: string;
  duration: string;
  description: string;
  category: string;
  toolLink?: string;
  toolLabel?: string;
  icon: 'book' | 'brain' | 'pencil' | 'audio' | 'puzzle' | 'star';
}

interface WeeklySession {
  day: string;
  focus: string;
  color: string;
  tasks: { title: string; duration: string; toolLink?: string }[];
}

interface ExerciseCard {
  id: string;
  title: string;
  duration: string;
  frequency: string;
  why: string;
  how: string[];
  toolLink?: string;
  toolLabel?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data: tailored plans per age group (enriched by category scores at runtime)
// ─────────────────────────────────────────────────────────────────────────────

const ageLabels: Record<AgeGroup, string> = {
  preschool: 'Preschool (3–5 years)',
  primary: 'Primary School (5–11 years)',
  secondary: 'Secondary School (11–18 years)',
  adult: 'Adult (18–64 years)',
  senior: 'Senior (65+ years)',
};

const scoreBadge: Record<ScoreLevel, { label: string; color: string }> = {
  low: { label: 'Low Indicators', color: 'emerald' },
  moderate: { label: 'Moderate Indicators', color: 'amber' },
  high: { label: 'Significant Indicators', color: 'red' },
};

const categoryLabels: Record<string, string> = {
  reading: 'Reading', phonics: 'Phonics', phonological: 'Phonological Awareness',
  spelling: 'Spelling', comprehension: 'Comprehension', visual: 'Visual Processing',
  processing: 'Processing Speed', memory: 'Working Memory', writing: 'Written Expression',
  executive: 'Executive Function', language: 'Language', learning: 'New Learning',
  emotional: 'Confidence & Wellbeing', spatial: 'Spatial Awareness',
  speech: 'Speech & Language', literacy: 'Early Literacy',
};

// Exercises mapped by category — the training page picks the most relevant ones
const exerciseLibrary: Record<string, ExerciseCard[]> = {
  reading: [
    {
      id: 'repeated-reading', title: 'Repeated Reading', duration: '10 min', frequency: 'Daily',
      why: 'Reading the same passage 3× builds fluency and automaticity. A 2017 meta-analysis of 34 studies rated this "highly effective" for reading disabilities.',
      how: ['Choose a short passage (50–150 words) at a comfortable level', 'Read it aloud 3 times in a row', 'Time yourself on each read — you should improve each round', 'Use the Fluency Pacer tool below for guided pacing'],
      toolLink: '/dyslexia-reading-training#fluency', toolLabel: 'Fluency Pacer Tool',
      priority: 'high', category: 'reading',
    },
    {
      id: 'paired-reading', title: 'Echo Reading', duration: '10 min', frequency: 'Daily',
      why: 'Modelled reading with immediate echo reduces decoding anxiety and builds prosody (expression and rhythm).',
      how: ['An adult reads a sentence aloud with expression', 'The learner immediately echoes it back', 'Alternate paragraphs as confidence builds', 'Use audiobooks to read along — ideal if reading alone'],
      priority: 'medium', category: 'reading',
    },
  ],
  phonics: [
    {
      id: 'phonics-flashcards', title: 'Phonics Flashcard Drill', duration: '10 min', frequency: 'Daily',
      why: 'Explicit, systematic phonics instruction is the most evidence-based intervention for dyslexia (IDA, 2023). Daily exposure builds automaticity.',
      how: ['Review 5–7 grapheme-phoneme pairs', 'For each card: say the sound, write the letter, find a word containing it', 'Use the Phonics Player for audio-guided practice', 'Rotate cards — mastered sounds need weekly review only'],
      toolLink: '/dyslexia-reading-training#phonics', toolLabel: 'Phonics Player Tool',
      priority: 'high', category: 'phonics',
    },
    {
      id: 'blending', title: 'Sound Blending Practice', duration: '5 min', frequency: 'Daily',
      why: 'Blending phonemes into words is a core decoding skill. Weakness here is the primary barrier to word reading in dyslexia.',
      how: ['Say individual sounds: /c/ /a/ /t/', 'Have the learner blend them into a word', 'Start with 3-phoneme words, build to 6+', 'Use the Blending & Segmenting Lab for interactive practice'],
      toolLink: '/dyslexia-reading-training#blending', toolLabel: 'Blending Lab',
      priority: 'high', category: 'phonics',
    },
  ],
  phonological: [
    {
      id: 'rhyme-practice', title: 'Rhyme & Alliteration Games', duration: '5 min', frequency: 'Daily',
      why: 'Phonological awareness — the ability to hear and manipulate sounds — is the single strongest predictor of reading success.',
      how: ['Say a word and ask for a rhyme (cat → bat, hat, sat)', 'Play "I spy something beginning with /s/"', 'Clap syllables in words (hap-pi-ness = 3)', 'Use the Phoneme Segmentation game for guided practice'],
      toolLink: '/dyslexia-reading-training#phonics', toolLabel: 'Phoneme Tools',
      priority: 'high', category: 'phonological',
    },
    {
      id: 'syllable-splitting', title: 'Syllable Splitting', duration: '5 min', frequency: 'Daily',
      why: 'Breaking words into syllables is a key decoding strategy for longer words. Hugely reduces anxiety about unfamiliar multi-syllable words.',
      how: ['Take a longer word (e.g., "impossible")', 'Count syllables by placing hand under chin and feeling jaw drops', 'Write the word with syllable dividers: im-pos-si-ble', 'Use the Syllable Splitter tool'],
      toolLink: '/dyslexia-reading-training#syllables', toolLabel: 'Syllable Splitter',
      priority: 'medium', category: 'phonological',
    },
  ],
  spelling: [
    {
      id: 'look-say-cover', title: 'Look–Say–Cover–Write–Check', duration: '10 min', frequency: 'Daily',
      why: 'The most consistently effective spelling technique for dyslexic learners (BDA, 2022). Engages visual memory, auditory memory, and motor memory simultaneously.',
      how: ['Look at the word carefully — note tricky parts', 'Say the word aloud', 'Cover it completely', 'Write it from memory', 'Check — celebrate success, repeat if wrong'],
      priority: 'high', category: 'spelling',
    },
    {
      id: 'morphology-spelling', title: 'Root Word & Morphology Training', duration: '10 min', frequency: '3×/week',
      why: 'Understanding prefixes, suffixes, and roots reduces the spelling load by 40–60% — once you know "un-" always means "not", you can spell and read hundreds of words.',
      how: ['Learn one root per week (e.g., "port" = carry)', 'Find words using that root (transport, import, export)', 'Learn common prefixes: un-, re-, pre-, dis-', 'Learn common suffixes: -tion, -ing, -ed, -ly'],
      toolLink: '/dyslexia-reading-training#morphology', toolLabel: 'Morphology Master',
      priority: 'medium', category: 'spelling',
    },
  ],
  comprehension: [
    {
      id: 'sq3r', title: 'SQ3R Active Reading', duration: '15 min', frequency: '3×/week',
      why: 'SQ3R (Survey, Question, Read, Recite, Review) transforms passive reading into active engagement — proven to dramatically improve retention and comprehension.',
      how: ['Survey: skim headings and images first', 'Question: turn each heading into a question', 'Read: read to answer your questions', 'Recite: close the text and recall key points', 'Review: check your recall against the text'],
      priority: 'high', category: 'comprehension',
    },
    {
      id: 'audiobooks', title: 'Audiobook + Vocabulary Building', duration: '20 min', frequency: 'Daily',
      why: 'Audiobooks allow dyslexic learners to engage with books at their intellectual level, not their decoding level. Yale Center for Dyslexia recommends this as essential.',
      how: ['Choose a book you genuinely want to read', 'Listen while following along in print if possible', 'Pause and note any new vocabulary', 'Discuss the content with someone (or write 3 bullet points)'],
      priority: 'medium', category: 'comprehension',
    },
  ],
  writing: [
    {
      id: 'structured-writing', title: 'Structured Writing Practice', duration: '10 min', frequency: 'Daily',
      why: 'Short, structured daily writing builds automaticity without overwhelm. Explicit frameworks (PEEL, TEEL) dramatically improve writing quality for dyslexic learners.',
      how: ['Choose a topic or prompt', 'Plan in a mind map (2 minutes)', 'Write using PEEL: Point, Evidence, Explain, Link', 'Do NOT stop to edit while writing — get thoughts out first', 'Edit in a separate pass'],
      priority: 'high', category: 'writing',
    },
    {
      id: 'voice-to-text', title: 'Voice-to-Text Drafting', duration: '10 min', frequency: 'Daily',
      why: 'Separating the thinking/speaking from the writing/spelling removes the cognitive bottleneck. Learners produce 2–3× more content and better ideas.',
      how: ['Use your phone or computer\'s voice dictation', 'Speak your ideas freely — full sentences', 'Then read back and edit the transcription', 'Gradually reduce reliance as writing confidence grows'],
      priority: 'medium', category: 'writing',
    },
  ],
  memory: [
    {
      id: 'spaced-repetition', title: 'Spaced Repetition Flashcards', duration: '10 min', frequency: 'Daily',
      why: 'Spaced repetition is scientifically the most efficient memory technique — information is reviewed just before it would be forgotten, maximising retention.',
      how: ['Use Anki (free) or Quizlet for digital flashcards', 'Create cards for key spelling, vocabulary, facts', 'Review cards daily — the app schedules optimal intervals', 'Start with 10 cards max, add 3 new cards per week'],
      priority: 'high', category: 'memory',
    },
    {
      id: 'chunking', title: 'Chunking Strategy', duration: '5 min', frequency: 'Daily',
      why: 'Breaking information into small chunks reduces working memory load — the primary cognitive challenge in dyslexia.',
      how: ['Break any multi-step task into numbered steps', 'Write steps on a card or sticky note', 'Complete one step at a time', 'Cross off each completed step (satisfying!)'],
      priority: 'medium', category: 'memory',
    },
  ],
  executive: [
    {
      id: 'weekly-planner', title: 'Weekly Planning Session', duration: '20 min', frequency: 'Weekly (Sunday)',
      why: 'Executive function difficulties are present in ~50% of dyslexic individuals. A structured weekly review dramatically reduces overwhelm and missed deadlines.',
      how: ['Every Sunday evening, open your planner', 'List all tasks for the coming week', 'Estimate time for each task (double your first estimate)', 'Schedule tasks into specific time slots', 'Colour-code by type or urgency'],
      priority: 'high', category: 'executive',
    },
    {
      id: 'pomodoro', title: 'Pomodoro Focus Sessions', duration: '25 min + 5 min break', frequency: 'Daily',
      why: 'Short focused work bursts (25 min) with breaks are optimal for working memory and attention. Particularly effective for dyslexic learners who fatigue more quickly from reading/writing tasks.',
      how: ['Set a timer for 25 minutes', 'Work on one task only — no switching', 'When timer rings, take a 5-minute break (move, drink water)', 'After 4 pomodoros, take a longer 20-minute break'],
      priority: 'high', category: 'executive',
    },
  ],
  emotional: [
    {
      id: 'strength-journaling', title: 'Strengths Journal', duration: '5 min', frequency: 'Daily',
      why: 'Dyslexia is consistently associated with low self-esteem due to school struggles. Daily strength journaling builds the positive self-concept essential for persistence and learning.',
      how: ['Each evening, write 3 things that went well today', 'Include one thing you\'re proud of (however small)', 'Note one dyslexia strength you used (creativity, problem-solving)', 'Re-read previous entries when feeling discouraged'],
      priority: 'high', category: 'emotional',
    },
  ],
  visual: [
    {
      id: 'coloured-overlays', title: 'Coloured Overlay / Background Practice', duration: 'Ongoing', frequency: 'Daily',
      why: 'Approximately 20% of dyslexic individuals also have visual stress (Meares-Irlen). Coloured overlays or screen backgrounds can reduce distortion and double the comfortable reading time.',
      how: ['Try different coloured overlays while reading', 'On devices, change the background to cream/yellow', 'Use a ruler or finger to track lines', 'The Reading Customiser tool lets you adjust colours digitally'],
      toolLink: '/dyslexia-reading-training', toolLabel: 'Reading Customiser',
      priority: 'medium', category: 'visual',
    },
  ],
  processing: [
    {
      id: 'preview-technique', title: 'Text Preview Technique', duration: '5 min', frequency: 'Before each reading session',
      why: 'Pre-reading reduces processing load by priming the brain. Knowing what you\'re about to read makes decoding 30–40% easier for dyslexic learners.',
      how: ['Before reading, skim the headings', 'Look at images and captions', 'Read the first and last sentence of each paragraph', 'Now read the full text — it\'ll feel much more familiar'],
      priority: 'medium', category: 'processing',
    },
  ],
};

// Age-specific daily routine templates
const dailyRoutineByAge: Record<AgeGroup, DailyTask[]> = {
  preschool: [
    { id: 'pr-1', time: 'Morning', title: 'Rhyme & Sound Play', duration: '10 min', description: 'Sing nursery rhymes, spot rhyming words in songs, and play "I Spy" with beginning sounds.', category: 'phonological', icon: 'audio' },
    { id: 'pr-2', time: 'Mid-morning', title: 'Letter Sound Exploration', duration: '5 min', description: 'Trace letters in sand, playdough, or finger paint. Say the sound as you write.', category: 'phonics', icon: 'pencil' },
    { id: 'pr-3', time: 'Afternoon', title: 'Shared Reading', duration: '15 min', description: 'Read a picture book together. Run your finger under words. Ask "What do you think happens next?"', category: 'reading', icon: 'book', toolLink: '/dyslexia-reading-training', toolLabel: 'Reading Tools' },
    { id: 'pr-4', time: 'Evening', title: 'Oral Storytelling', duration: '10 min', description: 'Tell a story together about the day, or use story dice. Builds narrative language and memory.', category: 'comprehension', icon: 'star' },
  ],
  primary: [
    { id: 'pm-1', time: 'Before School', title: 'Phonics Flashcards', duration: '10 min', description: 'Review 5 grapheme-phoneme pairs. Say, write, and read a word containing each.', category: 'phonics', icon: 'brain', toolLink: '/dyslexia-reading-training', toolLabel: 'Phonics Player' },
    { id: 'pm-2', time: 'After School', title: 'Decodable Book Reading', duration: '15 min', description: 'Read a book matched to your phonics stage. Read it once for accuracy, once for fluency.', category: 'reading', icon: 'book', toolLink: '/dyslexia-reading-training', toolLabel: 'Fluency Pacer' },
    { id: 'pm-3', time: 'Evening', title: 'Spelling Practice (LSCCWC)', duration: '10 min', description: 'Look–Say–Cover–Write–Check. Work on this week\'s 5 spelling words.', category: 'spelling', icon: 'pencil' },
    { id: 'pm-4', time: 'Bedtime', title: 'Audiobook or Read-Aloud', duration: '15 min', description: 'Listen to a chapter of a book above your reading level. Builds vocabulary and love of stories.', category: 'comprehension', icon: 'audio' },
  ],
  secondary: [
    { id: 'sc-1', time: 'Morning', title: 'Vocabulary Review', duration: '5 min', description: 'Review 5–7 subject-specific words using spaced repetition cards. Use Anki or Quizlet.', category: 'memory', icon: 'brain' },
    { id: 'sc-2', time: 'After School', title: 'Subject Reading (TTS)', duration: '20 min', description: 'Use text-to-speech to cover subject reading. Highlight key points as you listen.', category: 'reading', icon: 'audio', toolLink: '/dyslexia-reading-training', toolLabel: 'Reading Tools' },
    { id: 'sc-3', time: 'Evening', title: 'Structured Writing', duration: '15 min', description: 'Draft one PEEL paragraph. Plan in a mind map, then write, then edit separately.', category: 'writing', icon: 'pencil' },
    { id: 'sc-4', time: 'Evening', title: 'Study Timer Sessions', duration: '25+5 min', description: 'Pomodoro: 25 minutes focused, 5 minutes break. No phone during focus time.', category: 'executive', icon: 'puzzle', toolLink: '/dyslexia-reading-training', toolLabel: 'Practice Timer' },
  ],
  adult: [
    { id: 'ad-1', time: 'Morning', title: 'Freewriting Journal', duration: '5 min', description: 'Write 3 sentences — no editing, no judging. Builds writing automaticity and confidence.', category: 'writing', icon: 'pencil' },
    { id: 'ad-2', time: 'Work', title: 'Voice-to-Text for Emails', duration: 'Ongoing', description: 'Dictate all draft emails and notes. Edit the transcription rather than typing from scratch.', category: 'writing', icon: 'audio' },
    { id: 'ad-3', time: 'Lunch', title: 'Audiobook / Podcast', duration: '20 min', description: 'Listen to something professionally or personally interesting. Vocabulary grows through listening.', category: 'comprehension', icon: 'audio' },
    { id: 'ad-4', time: 'Evening', title: 'Strengths Journal', duration: '5 min', description: 'Write 3 things that went well today. One dyslexic strength you used. Builds self-concept.', category: 'emotional', icon: 'star' },
  ],
  senior: [
    { id: 'sr-1', time: 'Morning', title: 'Radio / Podcast Listening', duration: '30 min', description: 'Listen to news, history, or any topic of interest. Spoken word is your strength — use it.', category: 'comprehension', icon: 'audio' },
    { id: 'sr-2', time: 'Mid-morning', title: 'Word Game', duration: '15 min', description: 'Crossword, word search, or Scrabble. Enjoyable cognitive stimulation with language.', category: 'memory', icon: 'puzzle' },
    { id: 'sr-3', time: 'Afternoon', title: 'Audiobook', duration: '30 min', description: 'Use RNIB Talking Books (free) or Audible. Read books you\'ve always wanted to read.', category: 'reading', icon: 'book' },
    { id: 'sr-4', time: 'Evening', title: 'Reminiscence Recording', duration: '15 min', description: 'Dictate or record a memory or story. Creates a precious life record and exercises language.', category: 'writing', icon: 'star' },
  ],
};

const weeklyPlanByAge: Record<AgeGroup, WeeklySession[]> = {
  preschool: [
    { day: 'Mon', focus: 'Phonological Awareness', color: 'pink', tasks: [{ title: 'Rhyming game (5 min)', duration: '5 min' }, { title: 'Clap syllables in names', duration: '5 min' }, { title: 'Shared picture book', duration: '10 min' }] },
    { day: 'Wed', focus: 'Letter & Sound Play', color: 'blue', tasks: [{ title: 'Sandpaper letter tracing', duration: '5 min' }, { title: 'Alphabet song with cards', duration: '5 min' }, { title: 'Sound treasure hunt', duration: '10 min' }] },
    { day: 'Fri', focus: 'Oral Language', color: 'purple', tasks: [{ title: 'Story sequencing cards', duration: '10 min' }, { title: 'Retell a favourite story', duration: '10 min' }, { title: 'Describe pictures together', duration: '5 min' }] },
  ],
  primary: [
    { day: 'Mon', focus: 'Phonics & Decoding', color: 'blue', tasks: [{ title: 'Phonics flashcard drill', duration: '10 min', toolLink: '/dyslexia-reading-training' }, { title: 'Sound out 3 new words', duration: '5 min' }, { title: 'Letter formation practice', duration: '5 min' }] },
    { day: 'Tue', focus: 'Reading Fluency', color: 'green', tasks: [{ title: 'Repeated reading ×3 (same passage)', duration: '10 min', toolLink: '/dyslexia-reading-training' }, { title: 'Read to a pet or toy', duration: '5 min' }] },
    { day: 'Wed', focus: 'Spelling', color: 'amber', tasks: [{ title: 'LSCCWC ×5 words', duration: '10 min' }, { title: 'Rainbow writing', duration: '5 min' }, { title: 'Find patterns in words', duration: '5 min' }] },
    { day: 'Thu', focus: 'Comprehension', color: 'purple', tasks: [{ title: 'Read & answer who/what/where/why', duration: '10 min' }, { title: 'Draw the story scene', duration: '10 min' }] },
    { day: 'Fri', focus: 'Fun & Creative', color: 'pink', tasks: [{ title: 'Creative writing (3 sentences)', duration: '10 min' }, { title: 'Word game (Scrabble Jr.)', duration: '15 min' }, { title: 'Celebrate the week\'s achievements', duration: '5 min' }] },
  ],
  secondary: [
    { day: 'Mon', focus: 'Spelling & Vocabulary', color: 'blue', tasks: [{ title: 'Spaced repetition review (10 words)', duration: '10 min' }, { title: 'Root word exploration', duration: '10 min', toolLink: '/dyslexia-reading-training' }, { title: 'Personal spelling dictionary update', duration: '5 min' }] },
    { day: 'Tue', focus: 'Essay & Writing Skills', color: 'purple', tasks: [{ title: 'Mind-map essay plan', duration: '10 min' }, { title: 'Write 1 PEEL paragraph', duration: '15 min' }] },
    { day: 'Wed', focus: 'Reading Comprehension', color: 'emerald', tasks: [{ title: 'Annotate a short passage', duration: '15 min' }, { title: 'Summarise in 3 bullets', duration: '5 min' }] },
    { day: 'Thu', focus: 'Organisation & Exam Prep', color: 'amber', tasks: [{ title: 'Weekly planner review', duration: '10 min' }, { title: 'Flashcard content review', duration: '15 min' }] },
    { day: 'Fri', focus: 'Fluency & Confidence', color: 'pink', tasks: [{ title: 'Timed reading practice', duration: '10 min', toolLink: '/dyslexia-reading-training' }, { title: 'Read aloud passage recording', duration: '10 min' }] },
  ],
  adult: [
    { day: 'Mon', focus: 'Communication', color: 'blue', tasks: [{ title: 'Draft & review 1 professional email', duration: '15 min' }, { title: 'Vocabulary list update', duration: '5 min' }] },
    { day: 'Tue', focus: 'Reading Practice', color: 'emerald', tasks: [{ title: 'Read 1 article (TTS if needed)', duration: '15 min' }, { title: 'Summarise in 5 bullet points', duration: '5 min' }] },
    { day: 'Wed', focus: 'Organisation', color: 'amber', tasks: [{ title: 'Colour-coded task list review', duration: '10 min' }, { title: 'Set up voice reminders', duration: '5 min' }] },
    { day: 'Thu', focus: 'Writing Skills', color: 'purple', tasks: [{ title: 'Short piece of writing (any topic)', duration: '15 min' }, { title: 'Edit using Read&Write or Grammarly', duration: '10 min' }] },
    { day: 'Fri', focus: 'Professional Development', color: 'pink', tasks: [{ title: 'Listen to work-related podcast', duration: '20 min' }, { title: 'Document one achievement this week', duration: '5 min' }] },
  ],
  senior: [
    { day: 'Mon', focus: 'Cognitive Stimulation', color: 'blue', tasks: [{ title: 'Word puzzle or crossword', duration: '15 min' }, { title: 'Learn 1 new word', duration: '5 min' }] },
    { day: 'Wed', focus: 'Communication', color: 'purple', tasks: [{ title: 'Write or dictate a letter/message', duration: '15 min' }, { title: 'Discuss a story or article with someone', duration: '10 min' }] },
    { day: 'Fri', focus: 'Technology & Independence', color: 'emerald', tasks: [{ title: 'Practice one TTS feature on device', duration: '10 min' }, { title: 'Record a voice memo about your week', duration: '10 min' }] },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: pick exercises based on the user's highest-scoring categories
// ─────────────────────────────────────────────────────────────────────────────
function getPersonalisedExercises(
  categoryBreakdown: { category: string; pct: number }[],
  scoreLevel: ScoreLevel,
  ageGroup: AgeGroup,
): ExerciseCard[] {
  // Always include high-priority exercises for top 3 weak categories
  const priorityCategories = categoryBreakdown.slice(0, 4).map(c => c.category);

  // For low scorers, include general top exercises; for high scorers, be comprehensive
  const maxExercises = scoreLevel === 'low' ? 4 : scoreLevel === 'moderate' ? 6 : 8;

  const selected: ExerciseCard[] = [];
  const seen = new Set<string>();

  for (const cat of priorityCategories) {
    const catExercises = exerciseLibrary[cat] ?? [];
    for (const ex of catExercises) {
      if (!seen.has(ex.id) && selected.length < maxExercises) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
  }

  // Pad with age-relevant defaults if still short
  const defaults: Record<AgeGroup, string[]> = {
    preschool: ['rhyme-practice', 'syllable-splitting'],
    primary: ['phonics-flashcards', 'repeated-reading', 'look-say-cover'],
    secondary: ['weekly-planner', 'sq3r', 'pomodoro'],
    adult: ['strength-journaling', 'weekly-planner', 'voice-to-text'],
    senior: ['audiobooks', 'spaced-repetition'],
  };

  for (const defaultId of (defaults[ageGroup] ?? [])) {
    if (selected.length >= maxExercises) break;
    for (const exercises of Object.values(exerciseLibrary)) {
      const match = exercises.find(e => e.id === defaultId);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        selected.push(match);
        break;
      }
    }
  }

  return selected;
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon helper
// ─────────────────────────────────────────────────────────────────────────────
function TaskIcon({ type }: { type: DailyTask['icon'] }) {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'book': return <BookOpen className={cls} />;
    case 'brain': return <Brain className={cls} />;
    case 'pencil': return <Pencil className={cls} />;
    case 'audio': return <Volume2 className={cls} />;
    case 'puzzle': return <Shuffle className={cls} />;
    case 'star': return <Star className={cls} />;
  }
}

const iconBgByType: Record<DailyTask['icon'], string> = {
  book: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  brain: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  pencil: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  audio: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  puzzle: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
  star: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400',
};

const dayColors: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function DyslexiaTrainingPage() {
  const [result, setResult] = useState<DyslexiaAssessmentResult | null>(null);
  const [progress, setProgress] = useState<TrainingProgress>({ completedTasks: [], lastUpdatedDate: '', streakDays: 0, totalTasksCompleted: 0 });
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'routine' | 'exercises' | 'weekly' | 'progress'>('routine');

  useEffect(() => {
    setMounted(true);
    setResult(loadAssessmentResult());
    setProgress(loadTrainingProgress());
  }, []);

  const toggleTask = (taskId: string) => {
    setProgress(prev => {
      const already = prev.completedTasks.includes(taskId);
      const completedTasks = already
        ? prev.completedTasks.filter(t => t !== taskId)
        : [...prev.completedTasks, taskId];
      const totalTasksCompleted = already
        ? Math.max(0, prev.totalTasksCompleted - 1)
        : prev.totalTasksCompleted + 1;
      const today = new Date().toISOString().split('T')[0];
      const updated = { ...prev, completedTasks, totalTasksCompleted, lastUpdatedDate: today };
      saveTrainingProgress(updated);
      return updated;
    });
  };

  const handleRetakeAssessment = () => {
    clearAssessmentResult();
    setResult(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your plan…</div>
      </div>
    );
  }

  const containerCls = 'mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]';

  // ── No Assessment Result ─────────────────────────────────────────────────
  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden py-16 sm:py-20"
          style={{ backgroundImage: 'url("/images/home/home-section-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/25" aria-hidden="true" />
          <div className={`relative z-10 ${containerCls}`}>
            <div className="max-w-2xl space-y-6">
              <Link href="/conditions/dyslexia" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dyslexia Hub
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Dyslexia Training Plan</h1>
              <p className="text-lg text-white/85">
                No assessment results found. Complete the free screening assessment first — it takes around 3 minutes and creates your personalised training plan.
              </p>
              <Link href="/conditions/dyslexia#assessment">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90 font-semibold gap-2">
                  Take the Screening Assessment
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Personalised Data ────────────────────────────────────────────────────
  const { ageGroup, scoreLevel, categoryBreakdown, completedAt, totalQuestions } = result;
  const dailyTasks = dailyRoutineByAge[ageGroup] ?? [];
  const weeklyPlan = weeklyPlanByAge[ageGroup] ?? [];
  const exercises = getPersonalisedExercises(categoryBreakdown, scoreLevel, ageGroup);
  const todayCompleted = progress.completedTasks.filter(id => dailyTasks.some(t => t.id === id)).length;
  const todayPct = dailyTasks.length > 0 ? Math.round((todayCompleted / dailyTasks.length) * 100) : 0;
  const badge = scoreBadge[scoreLevel];
  const completedDate = new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const tabs: { id: typeof activeTab; label: string; icon: ReactNode }[] = [
    { id: 'routine', label: 'Daily Routine', icon: <Clock className="w-4 h-4" /> },
    { id: 'exercises', label: 'My Exercises', icon: <Target className="w-4 h-4" /> },
    { id: 'weekly', label: 'Weekly Plan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero Band ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-12 sm:py-16"
        style={{ backgroundImage: 'url("/images/home/home-section-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/20" aria-hidden="true" />
        <div className={`relative z-10 ${containerCls} space-y-5`}>
          <Link href="/conditions/dyslexia" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dyslexia Hub
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-white text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                Personalised Training Plan
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">My Dyslexia Programme</h1>
              <p className="text-white/80 text-sm">{ageLabels[ageGroup]} · Assessment completed {completedDate} · {totalQuestions} questions</p>
            </div>

            {/* Streak */}
            <div className="flex-shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <Flame className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{progress.streakDays}</p>
                <p className="text-xs text-white/70">day streak</p>
              </div>
            </div>
          </div>

          {/* Score badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
              ${scoreLevel === 'low' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : scoreLevel === 'moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {badge.label}
            </span>
            {categoryBreakdown.slice(0, 3).map(c => (
              <span key={c.category} className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/20">
                {categoryLabels[c.category] ?? c.category}: {c.pct}%
              </span>
            ))}
          </div>

          {/* Today progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-md">
            <div className="flex justify-between text-sm text-white mb-2">
              <span className="font-medium">Today&apos;s Progress</span>
              <span>{todayCompleted}/{dailyTasks.length} tasks</span>
            </div>
            <Progress value={todayPct} className="h-2 bg-white/20" />
            <p className="text-xs text-white/60 mt-1">{todayPct}% of today&apos;s routine complete</p>
          </div>
        </div>
      </section>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className={`${containerCls}`}>
          <nav className="flex gap-1 overflow-x-auto py-1" aria-label="Training sections">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Daily Routine Tab ──────────────────────────────────────────────── */}
      {activeTab === 'routine' && (
        <section className="bg-blue-50/70 dark:bg-blue-950/10 py-10 sm:py-14">
          <div className={`${containerCls} space-y-6`}>
            <div className="pb-2 border-b border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Today&apos;s Routine
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tick each task as you complete it. Consistent daily practice is the single most important factor in progress.
              </p>
            </div>

            {/* Evidence note */}
            <Card className="border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900/60">
              <CardContent className="p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Research says:</strong> Short daily sessions (10–20 minutes) are significantly more effective than occasional long ones.
                  Consistency over intensity is the key principle in structured literacy intervention (IDA, 2023).
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {dailyTasks.map(task => {
                const done = progress.completedTasks.includes(task.id);
                return (
                  <Card key={task.id} className={`transition-all ${done ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTask(task.id)}
                          aria-label={done ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                          className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'}`}
                        >
                          {done
                            ? <CheckCircle2 className="w-5 h-5 text-white" />
                            : <Circle className="w-4 h-4 text-transparent" />
                          }
                        </button>

                        <div className="flex-shrink-0 p-2 rounded-lg mt-0.5" style={{ margin: 0 }}>
                          <div className={`p-1.5 rounded-lg ${iconBgByType[task.icon]}`}>
                            <TaskIcon type={task.icon} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{task.time}</span>
                              <h3 className={`text-sm font-semibold ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h3>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{task.duration}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                          {task.toolLink && (
                            <Link href={task.toolLink} className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1">
                              {task.toolLabel ?? 'Open Tool'}
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {todayCompleted === dailyTasks.length && dailyTasks.length > 0 && (
              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-5 flex items-center gap-4">
                  <Trophy className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground">All done for today!</h3>
                    <p className="text-sm text-muted-foreground">Excellent work. Come back tomorrow to keep your streak going. Consistency is everything.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* ── Exercises Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'exercises' && (
        <section className="bg-white dark:bg-gray-950 py-10 sm:py-14">
          <div className={`${containerCls} space-y-6`}>
            <div className="pb-2 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Your Priority Exercises
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Selected based on your assessment profile. These target your highest-scoring difficulty areas.
              </p>
            </div>

            {/* Top areas */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Your Assessment Profile — Areas to Focus On</h3>
                <div className="space-y-2">
                  {categoryBreakdown.slice(0, 5).map(({ category, pct }) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{categoryLabels[category] ?? category}</span>
                        <span className={`font-medium ${pct >= 66 ? 'text-red-600 dark:text-red-400' : pct >= 33 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className={`h-1.5 rounded-full ${pct >= 66 ? 'bg-red-500' : pct >= 33 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {exercises.map(ex => (
                <Card key={ex.id} className="flex flex-col">
                  <CardContent className="p-5 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                          ${ex.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : ex.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                          {ex.priority === 'high' ? 'Priority' : ex.priority === 'medium' ? 'Recommended' : 'Supportive'}
                        </span>
                        <h3 className="text-base font-semibold text-foreground mt-1">{ex.title}</h3>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-medium text-muted-foreground">{ex.duration}</p>
                        <p className="text-xs text-muted-foreground">{ex.frequency}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        <strong className="text-foreground not-italic">Why this helps:</strong> {ex.why}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-foreground">How to do it:</p>
                      <ol className="space-y-1">
                        {ex.how.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 text-xs flex items-center justify-center font-bold text-foreground mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {ex.toolLink && (
                      <Link href={ex.toolLink}>
                        <Button size="sm" variant="outline" className="w-full gap-1.5 mt-1">
                          {ex.toolLabel ?? 'Open Practice Tool'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Link to full training page */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <h3 className="font-bold text-white">Full Practice Toolkit</h3>
                  <p className="text-sm text-white/80">Access phonics, fluency, vocabulary, and morphology tools in the complete training suite.</p>
                </div>
                <Link href="/dyslexia-reading-training">
                  <Button className="bg-white text-blue-700 hover:bg-white/90 font-semibold gap-2 flex-shrink-0">
                    Open Training Suite
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ── Weekly Plan Tab ────────────────────────────────────────────────── */}
      {activeTab === 'weekly' && (
        <section className="bg-indigo-50 dark:bg-indigo-950/15 py-10 sm:py-14">
          <div className={`${containerCls} space-y-6`}>
            <div className="pb-2 border-b border-indigo-200 dark:border-indigo-800">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Weekly Training Plan
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A structured week ensures all key skill areas are practised. Use this as your guide, adjusting to your schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyPlan.map((session, i) => (
                <Card key={i} className="flex flex-col">
                  <CardContent className="p-5 flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">{session.day}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${dayColors[session.color] ?? ''}`}>
                        {session.focus}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {session.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-tight">{task.title}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">{task.duration}</p>
                              {task.toolLink && (
                                <Link href={task.toolLink} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5">
                                  Tool <ChevronRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tips */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Planning Tips
                </h3>
                <ul className="space-y-2">
                  {[
                    'Schedule practice at the same time each day — routine reduces resistance',
                    'Short sessions (10–20 min) every day beat long sessions twice a week',
                    'Prepare materials the evening before so there are no barriers to starting',
                    'Track completion — even a simple tick chart builds motivation',
                    'If you miss a day, simply resume the next day — no guilt, just restart',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ── Progress Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'progress' && (
        <section className="bg-slate-100 dark:bg-slate-900/40 py-10 sm:py-14">
          <div className={`${containerCls} space-y-6`}>
            <div className="pb-2 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                My Progress
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Track your consistency and celebrate every step forward.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Day Streak', value: progress.streakDays, icon: <Flame className="w-6 h-6 text-orange-500" />, sub: 'consecutive days' },
                { label: 'Tasks Completed', value: progress.totalTasksCompleted, icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, sub: 'total all time' },
                { label: 'Today\'s Tasks', value: `${todayCompleted}/${dailyTasks.length}`, icon: <Clock className="w-6 h-6 text-blue-500" />, sub: `${todayPct}% complete` },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-2 text-center">
                    <div className="flex justify-center">{stat.icon}</div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs font-medium text-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today progress bar */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground">Today&apos;s Routine</h3>
                <Progress value={todayPct} className="h-3" />
                <p className="text-sm text-muted-foreground">{todayCompleted} of {dailyTasks.length} daily tasks complete</p>
              </CardContent>
            </Card>

            {/* Milestone messages */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Milestones
                </h3>
                <div className="space-y-2">
                  {[
                    { target: 1, label: 'First day complete', achieved: progress.streakDays >= 1 },
                    { target: 7, label: '7-day streak — one full week!', achieved: progress.streakDays >= 7 },
                    { target: 21, label: '21-day streak — habit forming!', achieved: progress.streakDays >= 21 },
                    { target: 30, label: '30-day streak — incredible commitment', achieved: progress.streakDays >= 30 },
                    { target: 10, label: '10 tasks completed', achieved: progress.totalTasksCompleted >= 10 },
                    { target: 50, label: '50 tasks completed', achieved: progress.totalTasksCompleted >= 50 },
                  ].map((m, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${m.achieved ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-900/30'}`}>
                      {m.achieved
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      }
                      <p className={`text-sm ${m.achieved ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{m.label}</p>
                      {m.achieved && <Trophy className="w-4 h-4 text-yellow-500 ml-auto flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Encouraging quote */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-5">
                <blockquote className="text-sm italic text-muted-foreground">
                  &ldquo;Dyslexia is not a problem with intelligence — it is a different way of thinking. Many of the world&apos;s greatest innovators, entrepreneurs, and artists have dyslexia. With the right support and strategies, there are no limits.&rdquo;
                </blockquote>
                <p className="text-xs text-muted-foreground mt-2">— British Dyslexia Association</p>
              </CardContent>
            </Card>

            {/* Retake assessment */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleRetakeAssessment} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retake Assessment
              </Button>
              <Link href="/conditions/dyslexia">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dyslexia Hub
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Closing Disclaimer ──────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className={`${containerCls}`}>
          <p className="text-xs text-muted-foreground italic leading-relaxed max-w-3xl">
            <strong>Educational Resource Disclaimer:</strong> This training plan is for educational and informational purposes only. It is not a substitute for professional medical advice, formal diagnosis, or specialist teaching. Content is informed by evidence-based research from the International Dyslexia Association, British Dyslexia Association, and Yale Center for Dyslexia. If assessments suggest significant difficulties, please seek a formal assessment from an Educational Psychologist or Specialist Teacher Assessor (APC/AMBDA qualified).
          </p>
        </div>
      </section>

    </div>
  );
}

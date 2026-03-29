'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { saveAssessmentResult } from '@/lib/dyslexia/assessment-store';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Star,
  Target,
  Calendar,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';

type AgeGroup = 'preschool' | 'primary' | 'secondary' | 'adult' | 'senior';
type Answer = 'never' | 'sometimes' | 'often' | 'always';

interface Question {
  id: string;
  text: string;
  category: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Evidence-based question banks — IDA / BDA / DAST-2 / Adult Dyslexia Checklist
// ────────────────────────────────────────────────────────────────────────────
const questions: Record<AgeGroup, Question[]> = {
  preschool: [
    { id: 'p1', text: 'Has delayed speech development or frequently mispronounces words', category: 'speech' },
    { id: 'p2', text: 'Struggles to learn nursery rhymes or recognise rhyming words', category: 'phonological' },
    { id: 'p3', text: 'Has difficulty learning the names of letters or their sounds', category: 'literacy' },
    { id: 'p4', text: 'Struggles with sequencing (e.g., days of the week, counting to 10)', category: 'memory' },
    { id: 'p5', text: 'Finds it hard to follow multi-step instructions', category: 'processing' },
    { id: 'p6', text: 'Has trouble remembering names of familiar objects or people', category: 'memory' },
    { id: 'p7', text: 'Shows little interest in books, letters, or stories', category: 'literacy' },
    { id: 'p8', text: 'Struggles to copy simple patterns or shapes', category: 'visual' },
    { id: 'p9', text: 'Mixes up words that sound similar (e.g., "pasghetti" for spaghetti)', category: 'phonological' },
    { id: 'p10', text: 'Has difficulty clapping along to a simple beat or rhythm', category: 'phonological' },
  ],
  primary: [
    { id: 's1', text: 'Reads significantly below their expected grade level', category: 'reading' },
    { id: 's2', text: 'Has difficulty sounding out unfamiliar words', category: 'phonics' },
    { id: 's3', text: 'Confuses visually similar letters (e.g., b/d, p/q, m/n)', category: 'visual' },
    { id: 's4', text: 'Spells the same word differently within the same piece of work', category: 'spelling' },
    { id: 's5', text: 'Struggles to remember what was just read', category: 'comprehension' },
    { id: 's6', text: 'Avoids reading aloud and becomes anxious when asked to do so', category: 'reading' },
    { id: 's7', text: 'Takes far longer than peers to complete homework involving reading or writing', category: 'processing' },
    { id: 's8', text: 'Has difficulty learning times tables or sequences', category: 'memory' },
    { id: 's9', text: 'Struggles to organise thoughts clearly when writing', category: 'writing' },
    { id: 's10', text: 'Finds it hard to copy accurately from the board or a book', category: 'visual' },
  ],
  secondary: [
    { id: 't1', text: 'Reads slowly and finds sustained reading physically or mentally tiring', category: 'reading' },
    { id: 't2', text: 'Frequently misspells common words despite repeated correction', category: 'spelling' },
    { id: 't3', text: 'Strongly prefers to listen to information rather than read it', category: 'reading' },
    { id: 't4', text: 'Has difficulty summarising or recalling what was read', category: 'comprehension' },
    { id: 't5', text: 'Struggles with essay planning, structure, and organising ideas', category: 'writing' },
    { id: 't6', text: 'Has poor time management and difficulty meeting deadlines', category: 'executive' },
    { id: 't7', text: 'Finds learning foreign languages particularly challenging', category: 'language' },
    { id: 't8', text: 'Has difficulty following complex verbal or written instructions', category: 'processing' },
    { id: 't9', text: 'Confuses similar-sounding words (e.g., affect/effect, there/their)', category: 'phonological' },
    { id: 't10', text: 'Takes considerably longer than peers to complete written work under timed conditions', category: 'processing' },
  ],
  adult: [
    { id: 'a1', text: 'Avoids tasks that involve reading and writing whenever possible', category: 'reading' },
    { id: 'a2', text: 'Reads slowly and needs to re-read text multiple times to understand it', category: 'reading' },
    { id: 'a3', text: 'Has difficulty with spelling, even common everyday words', category: 'spelling' },
    { id: 'a4', text: 'Struggles to take effective notes during meetings or lectures', category: 'writing' },
    { id: 'a5', text: 'Has poor time management despite genuine efforts to organise', category: 'executive' },
    { id: 'a6', text: 'Finds it hard to learn new procedures, systems, or processes at work', category: 'learning' },
    { id: 'a7', text: 'Experiences anxiety about reading aloud, presenting, or filling in forms', category: 'emotional' },
    { id: 'a8', text: 'Has difficulty following written instructions or manuals', category: 'comprehension' },
    { id: 'a9', text: 'Confuses left and right or has persistent directional difficulties', category: 'spatial' },
    { id: 'a10', text: 'Relies heavily on spell-check, autocorrect, and voice-to-text tools', category: 'spelling' },
  ],
  senior: [
    { id: 'sr1', text: 'Avoids reading newspapers, books, or written communication', category: 'reading' },
    { id: 'sr2', text: 'Finds reading tiring and needs to re-read passages several times', category: 'reading' },
    { id: 'sr3', text: 'Has lifelong difficulty with spelling, even familiar words', category: 'spelling' },
    { id: 'sr4', text: 'Struggles to write letters, emails, or forms without assistance', category: 'writing' },
    { id: 'sr5', text: 'Has difficulty following written directions or instruction leaflets', category: 'comprehension' },
    { id: 'sr6', text: 'Has always found it harder than peers to remember sequences (phone numbers, addresses)', category: 'memory' },
    { id: 'sr7', text: 'Felt less confident than peers throughout schooling due to reading or writing difficulties', category: 'emotional' },
    { id: 'sr8', text: 'Relies on others to read or fill in forms, prescriptions, or official letters', category: 'reading' },
    { id: 'sr9', text: 'Has difficulty learning new technology or digital interfaces involving reading', category: 'learning' },
    { id: 'sr10', text: 'Prefers spoken information (radio, audio, conversation) over written text', category: 'reading' },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Tailored Roadmap Data — evidence-based per age group
// ────────────────────────────────────────────────────────────────────────────
interface RoadmapItem {
  title: string;
  duration: string;
  description: string;
}

interface AgeRoadmap {
  dailyRoutine: { time: string; activity: string; duration: string }[];
  weeklyPlan: { day: string; focus: string; activities: string[] }[];
  keyStrategies: string[];
  exercises: RoadmapItem[];
  professionalNext: string[];
  strengths: string[];
}

const ageRoadmaps: Record<AgeGroup, AgeRoadmap> = {
  preschool: {
    dailyRoutine: [
      { time: 'Morning', activity: 'Rhyme & Rhythm Games', duration: '10 min' },
      { time: 'Mid-morning', activity: 'Letter Sound Exploration (sandpaper letters)', duration: '5 min' },
      { time: 'Afternoon', activity: 'Shared Picture Book Reading', duration: '15 min' },
      { time: 'Evening', activity: 'Oral Storytelling / Sequencing Games', duration: '10 min' },
    ],
    weeklyPlan: [
      { day: 'Monday', focus: 'Phonological Awareness', activities: ['Clapping syllables in names', 'Rhyme spotting in songs', 'Beginning sound identification'] },
      { day: 'Wednesday', focus: 'Letter & Sound Play', activities: ['Sandpaper or playdough letter tracing', 'Alphabet song with visual cards', 'Sound treasure hunt'] },
      { day: 'Friday', focus: 'Oral Language & Storytelling', activities: ['Story sequencing with picture cards', 'Retelling favourite stories', 'Describing pictures in detail'] },
    ],
    keyStrategies: [
      'Use multisensory approaches: trace letters in sand, shaving foam, or playdough',
      'Sing rhymes and songs daily — phonological awareness is the #1 predictor of reading success',
      'Read aloud together every day; run your finger under words as you read',
      'Limit screen time and increase spoken conversation to build vocabulary',
      'Make learning playful — games are the most effective teaching medium at this age',
    ],
    exercises: [
      { title: 'Rhyme Time', duration: '5 min/day', description: 'Say a word and ask the child to suggest rhyming words. Start simple: cat, bat, hat. Clap and celebrate every attempt.' },
      { title: 'Sound Sorting', duration: '5 min/day', description: 'Sort objects or pictures by their starting sound (all things starting with "S" in one pile). Builds phonemic awareness.' },
      { title: 'Syllable Clapping', duration: '5 min/day', description: 'Clap out syllables in names of family members, food, animals. "Choc-o-late" — 3 claps!' },
      { title: 'Letter Tracing', duration: '5 min/day', description: 'Use tactile materials: trace letters in a tray of sand, rice, or playdough. Engages multiple senses simultaneously.' },
    ],
    professionalNext: [
      'Speak to your health visitor or GP about a Speech & Language Therapy referral',
      'Alert your child\'s nursery keyworker so early support can begin',
      'Contact the British Dyslexia Association Helpline: 0333 405 4555',
      'Request an early educational psychology assessment through your local authority',
    ],
    strengths: ['Strong creativity and imagination', 'Often excellent at oral storytelling', 'Frequently shows strong spatial and visual thinking', 'Natural problem-solvers and lateral thinkers'],
  },
  primary: {
    dailyRoutine: [
      { time: 'Morning (before school)', activity: 'Phonics Practice (5 sounds)', duration: '10 min' },
      { time: 'After school', activity: 'Shared Reading (decodable books)', duration: '15 min' },
      { time: 'Evening', activity: 'Spelling Practice (look-say-cover-write-check)', duration: '10 min' },
      { time: 'Bedtime', activity: 'Audiobook or Parent Read-Aloud', duration: '20 min' },
    ],
    weeklyPlan: [
      { day: 'Monday', focus: 'Phonics & Decoding', activities: ['Phonics flashcards (5 sounds)', 'Sounding out 3-5 new words', 'Letter formation practice'] },
      { day: 'Tuesday', focus: 'Reading Fluency', activities: ['Re-read a familiar book for fluency', 'Read-aloud to a stuffed toy or pet', 'Time yourself reading a short passage'] },
      { day: 'Wednesday', focus: 'Spelling', activities: ['Look-Say-Cover-Write-Check x5 words', 'Rainbow writing (trace in multiple colours)', 'Spelling pattern identification'] },
      { day: 'Thursday', focus: 'Comprehension', activities: ['Read a short passage, answer who/what/where/why', 'Draw what happened in the story', 'Retell the story in your own words'] },
      { day: 'Friday', focus: 'Creative Writing & Fun', activities: ['Write 3 sentences about your favourite thing', 'Story dice game', 'Celebrate the week\'s achievements'] },
    ],
    keyStrategies: [
      'Use structured literacy (Orton-Gillingham method) — systematic, explicit, multisensory',
      'Decodable readers matched to phonics stage build confidence and skill simultaneously',
      'Audiobooks allow intellectual engagement at their true level — not their decoding level',
      'Assistive technology: text-to-speech, dyslexia-friendly fonts (OpenDyslexic), coloured overlays',
      'Communicate with the school SENCO to ensure classroom accommodations are in place',
    ],
    exercises: [
      { title: 'Phonics Ladder', duration: '10 min/day', description: 'Work through 5 phoneme-grapheme correspondences. Use flashcards — say the sound, write the letter, read a word containing it.' },
      { title: 'Repeated Reading', duration: '10 min/day', description: 'Read the same short passage 3 times. Track WPM (words per minute). Children gain fluency and confidence seeing their own improvement.' },
      { title: 'Word Family Sorting', duration: '10 min', description: 'Sort word cards into families (-at, -an, -in). Builds orthographic pattern recognition essential for automatic word reading.' },
      { title: 'Syllable Splitting', duration: '5 min/day', description: 'Divide longer words into syllables using coloured pens or beats. "Hap-pi-ness" — 3 parts. Makes long words manageable.' },
    ],
    professionalNext: [
      'Request a formal assessment from your school\'s SENCO immediately',
      'Ask about an Educational Psychologist referral through school or LA',
      'Contact Dyslexia Action for specialist tuition: dyslexiaaction.org.uk',
      'Apply for extra time in assessments via Access Arrangements (school to arrange)',
    ],
    strengths: ['Often creatively gifted — art, music, storytelling', 'Strong 3D thinking and spatial skills', 'Exceptional memory for things they are interested in', 'Highly empathetic and emotionally intelligent'],
  },
  secondary: {
    dailyRoutine: [
      { time: 'Morning', activity: 'Review key vocabulary (3-5 subject terms)', duration: '5 min' },
      { time: 'After school', activity: 'Subject reading using text-to-speech or audiobook', duration: '20 min' },
      { time: 'Evening', activity: 'Note-making with mind maps or graphic organisers', duration: '15 min' },
      { time: 'Before bed', activity: 'Read-aloud or audiobook fiction (builds vocabulary)', duration: '15 min' },
    ],
    weeklyPlan: [
      { day: 'Monday', focus: 'Spelling & Vocabulary', activities: ['10 subject-specific spellings using multisensory methods', 'Root word / morphology exploration', 'Personal spelling dictionary update'] },
      { day: 'Tuesday', focus: 'Essay Skills', activities: ['Mind-map essay plan', 'Practice topic sentence writing', 'Review use of connectives and structure'] },
      { day: 'Wednesday', focus: 'Reading Comprehension', activities: ['Annotate a short passage (highlight, underline, comment)', 'Summarise in 3 bullet points', 'Predict what happens next exercise'] },
      { day: 'Thursday', focus: 'Organisation & Study Skills', activities: ['Weekly planner review and update', 'Break large tasks into small steps', 'Time-log to identify where time is spent'] },
      { day: 'Friday', focus: 'Exam Preparation', activities: ['Timed writing practice (with support)', 'Flashcard review of key content', 'Celebrate progress with a preferred activity'] },
    ],
    keyStrategies: [
      'Use text-to-speech software for all subject reading (NaturalReader, Read&Write)',
      'Voice-to-text dictation for drafting essays — separate thinking from writing mechanics',
      'Mind maps and visual organisers outperform linear notes for dyslexic learners',
      'Request Access Arrangements: extra time (25%), use of a word processor, reader/scribe',
      'Study in short focused bursts (25 min) with 5-minute breaks — Pomodoro Technique',
    ],
    exercises: [
      { title: 'Rapid Vocabulary Drill', duration: '5 min/day', description: 'Review 5-10 subject-specific words using spaced repetition. Apps: Anki, Quizlet. Colour-code by subject.' },
      { title: 'Structured Essay Planning', duration: '15 min', description: 'PEEL method: Point, Evidence, Explain, Link. Practice writing one strong paragraph daily before attempting full essays.' },
      { title: 'Active Reading Protocol', duration: '20 min', description: 'SQ3R method: Survey, Question, Read, Recite, Review. Transforms passive reading into active engagement — dramatically improves retention.' },
      { title: 'Timed Writing Sprints', duration: '10 min', description: 'Write continuously for 10 minutes on any topic without stopping to edit. Builds writing fluency and reduces anxiety about starting.' },
    ],
    professionalNext: [
      'Request a full Educational Psychology report through school for formal diagnosis and Access Arrangements',
      'Contact Exam board directly if extra time is needed for GCSEs/A-levels',
      'Explore specialist dyslexia tuition through PATOSS (patoss.org.uk)',
      'Enquire about DSA (Disabled Students\' Allowance) for university-bound students',
    ],
    strengths: ['Often exceptionally gifted in creative subjects', 'Strong big-picture thinking and systems understanding', 'Natural entrepreneurs and innovators', 'Highly motivated when interested in a topic'],
  },
  adult: {
    dailyRoutine: [
      { time: 'Morning', activity: 'Structured journal (3 sentences, no judgement)', duration: '5 min' },
      { time: 'Work day', activity: 'Use voice-to-text for emails and notes', duration: 'Ongoing' },
      { time: 'Lunch', activity: 'Audiobook or podcast related to work/interests', duration: '20 min' },
      { time: 'Evening', activity: 'Pleasure reading (dyslexia-friendly format)', duration: '15 min' },
    ],
    weeklyPlan: [
      { day: 'Monday', focus: 'Communication Skills', activities: ['Draft and review one professional email', 'Practice clear verbal communication points', 'Update personal vocabulary list'] },
      { day: 'Tuesday', focus: 'Reading & Comprehension', activities: ['Read one article using TTS if needed', 'Summarise key points in 5 bullets', 'Discuss content with a colleague or friend'] },
      { day: 'Wednesday', focus: 'Organisation Systems', activities: ['Review weekly planner and task list', 'Colour-code tasks by priority', 'Set up voice reminders for key tasks'] },
      { day: 'Thursday', focus: 'Writing Skills', activities: ['Write a short piece of your choosing', 'Review and edit (use Read&Write or Grammarly)', 'Practice the structure: intro, point, evidence, conclusion'] },
      { day: 'Friday', focus: 'Professional Development', activities: ['Explore a work topic via audiobook/podcast', 'Document one achievement from the week', 'Plan the following week in advance'] },
    ],
    keyStrategies: [
      'Disclose dyslexia to HR/line manager — Equality Act 2010 mandates reasonable adjustments',
      'Use Read&Write Gold, Grammarly, Dragon NaturallySpeaking for workplace support',
      'Use colour-coded calendars, Trello boards, and voice memos for organisation',
      'Join the British Dyslexia Association Adult Network for peer support',
      'Access DSA (Disabled Students\' Allowance) if in higher education',
    ],
    exercises: [
      { title: 'Morning Journal', duration: '5 min/day', description: 'Write 3 sentences each morning — no editing, no judgement. Builds writing automaticity and confidence. Spelling doesn\'t matter here.' },
      { title: 'Active Listening Notes', duration: '15 min', description: 'During meetings or lectures, use bullet points only. Draw arrows showing relationships. Review and expand notes immediately after.' },
      { title: 'Weekly Review & Planning', duration: '20 min', description: 'Every Sunday: review the previous week, note successes, identify challenges, plan the next week in detail. Use colour coding.' },
      { title: 'Vocabulary Building', duration: '5 min/day', description: 'Learn 2 new words daily using Anki or Quizlet. Include word, pronunciation, definition, example sentence. Review in context.' },
    ],
    professionalNext: [
      'Request a formal diagnostic assessment via Access To Work (gov.uk/access-to-work)',
      'Contact Dyslexia Action for a specialist adult assessment',
      'Request a workplace needs assessment for reasonable adjustments',
      'Explore coaching through the British Dyslexia Association',
    ],
    strengths: ['Exceptional creative and lateral thinking', 'Strong verbal communication and storytelling', 'Natural empathy and intuitive people skills', 'Entrepreneurial mindset — many successful business leaders have dyslexia'],
  },
  senior: {
    dailyRoutine: [
      { time: 'Morning', activity: 'Listen to a radio programme or podcast on an interest', duration: '30 min' },
      { time: 'Mid-morning', activity: 'Crossword, word puzzle, or memory game', duration: '15 min' },
      { time: 'Afternoon', activity: 'Audiobook or TV documentary', duration: '30 min' },
      { time: 'Evening', activity: 'Oral reminiscence — share a memory with family or record it', duration: '15 min' },
    ],
    weeklyPlan: [
      { day: 'Monday', focus: 'Cognitive Stimulation', activities: ['Word puzzle or crossword', 'Learn 1 new word and use it in conversation', 'Read a headline aloud and discuss it'] },
      { day: 'Wednesday', focus: 'Communication & Connection', activities: ['Write or dictate a letter or message to someone', 'Listen to or read a short story', 'Join a library talking book club if available'] },
      { day: 'Friday', focus: 'Technology & Independence', activities: ['Practice using TTS features on phone/tablet', 'Ask Alexa/Siri to read something aloud', 'Record a voice memo about your week'] },
    ],
    keyStrategies: [
      'Use TTS apps on tablet or phone — most devices have built-in accessibility settings',
      'Large-print books and audiobooks are available free through RNIB and public libraries',
      'Kindle and e-readers allow font size adjustment — life-changing for many seniors',
      'Voice assistants (Alexa, Siri, Google) can read emails, texts, and webpages aloud',
      'Remember: dyslexia is lifelong but manageable — you have developed strategies over decades',
    ],
    exercises: [
      { title: 'Audiobook Journey', duration: 'Daily', description: 'Subscribe to Audible or use the free RNIB Talking Books service. Choose books you\'ve always wanted to read. Enjoyment is the goal.' },
      { title: 'Reminiscence Writing', duration: '10 min', description: 'Dictate or record memories, stories, and experiences. Many apps transcribe voice to text. Creating a life-story book is deeply rewarding.' },
      { title: 'Word Game', duration: '15 min', description: 'Crosswords, Scrabble, and word searches provide cognitive stimulation while building confidence with language in a low-pressure context.' },
      { title: 'Technology Confidence', duration: '10 min', description: 'Practice one assistive technology feature per week — text enlargement, TTS, voice control. Each new skill gained increases independence.' },
    ],
    professionalNext: [
      'Contact your GP to discuss formal assessment and access to support services',
      'Age UK provides free advice and advocacy: ageuk.org.uk / 0800 678 1602',
      'RNIB offers free audiobooks and reading support: rnib.org.uk',
      'Many councils offer adult literacy support and assistive technology training',
    ],
    strengths: ['Rich life experience and wisdom that reading difficulties do not diminish', 'Highly developed oral communication and storytelling skills', 'Strong emotional intelligence from navigating challenges throughout life', 'Exceptional resilience built over decades'],
  },
};

const scoreInterpretation = {
  low: {
    title: 'Low Likelihood of Dyslexia',
    description: 'Based on your responses, signs commonly associated with dyslexia are minimal. If you have ongoing concerns, a brief conversation with a relevant professional is always worthwhile.',
    color: 'emerald',
    icon: CheckCircle2,
    badge: 'Low Indicators',
  },
  moderate: {
    title: 'Moderate Dyslexia Indicators',
    description: 'Your responses suggest some characteristics consistent with dyslexia. A professional assessment is recommended to clarify the picture and access appropriate support.',
    color: 'amber',
    icon: AlertTriangle,
    badge: 'Moderate Indicators',
  },
  high: {
    title: 'Significant Dyslexia Indicators',
    description: 'Multiple responses align strongly with dyslexia profiles. We strongly recommend seeking a formal assessment from a qualified professional. Early and targeted support makes a substantial difference.',
    color: 'red',
    icon: AlertTriangle,
    badge: 'Significant Indicators',
  },
};

const ageGroupLabels: Record<AgeGroup, string> = {
  preschool: 'Preschool (3–5 years)',
  primary: 'Primary School (5–11 years)',
  secondary: 'Secondary School (11–18 years)',
  adult: 'Adult (18–64 years)',
  senior: 'Senior (65+ years)',
};

const trainingPageLink = '/conditions/dyslexia/training';

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────
export function AssessmentTools() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [pendingAnswer, setPendingAnswer] = useState<Answer | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentQuestions = selectedAge ? questions[selectedAge] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const progress = selectedAge
    ? ((currentQuestionIndex / currentQuestions.length) * 100)
    : 0;

  const handleSelectAnswer = (answer: Answer) => {
    setPendingAnswer(answer);
  };

  const handleNext = () => {
    if (!currentQuestion || !pendingAnswer) return;

    const newAnswers = { ...answers, [currentQuestion.id]: pendingAnswer };
    setAnswers(newAnswers);
    setPendingAnswer(null);

    if (isLastQuestion) {
      // Compute score + breakdown and persist before showing results
      const scoreValues: Record<Answer, number> = { never: 0, sometimes: 1, often: 2, always: 3 };
      const total = Object.values(newAnswers).reduce((s, a) => s + scoreValues[a], 0);
      const maxScore = currentQuestions.length * 3;
      const pct = (total / maxScore) * 100;
      const level: 'low' | 'moderate' | 'high' = pct < 33 ? 'low' : pct < 66 ? 'moderate' : 'high';

      // Category breakdown
      const catScores: Record<string, { total: number; count: number }> = {};
      currentQuestions.forEach(q => {
        const a = newAnswers[q.id];
        if (a !== undefined) {
          if (!catScores[q.category]) catScores[q.category] = { total: 0, count: 0 };
          catScores[q.category].total += scoreValues[a];
          catScores[q.category].count += 1;
        }
      });
      const breakdown = Object.entries(catScores)
        .map(([cat, d]) => ({ category: cat, pct: Math.round((d.total / (d.count * 3)) * 100) }))
        .sort((a, b) => b.pct - a.pct);

      if (selectedAge) {
        saveAssessmentResult({
          ageGroup: selectedAge,
          scoreLevel: level,
          answers: newAnswers,
          categoryBreakdown: breakdown,
          completedAt: new Date().toISOString(),
          totalQuestions: currentQuestions.length,
        });
      }

      setShowResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    const prevIndex = currentQuestionIndex - 1;
    const prevQuestion = currentQuestions[prevIndex];
    // Restore previously saved answer as the pending answer so user can change it
    setPendingAnswer(answers[prevQuestion.id] ?? null);
    setCurrentQuestionIndex(prevIndex);
  };

  const resetAssessment = () => {
    setSelectedAge(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setPendingAnswer(null);
    setShowResults(false);
  };

  const calculateScore = (): 'low' | 'moderate' | 'high' => {
    const scores: Record<Answer, number> = { never: 0, sometimes: 1, often: 2, always: 3 };
    const total = Object.values(answers).reduce((sum, a) => sum + scores[a], 0);
    const maxScore = currentQuestions.length * 3;
    const pct = (total / maxScore) * 100;
    if (pct < 33) return 'low';
    if (pct < 66) return 'moderate';
    return 'high';
  };

  const getCategoryBreakdown = () => {
    const scores: Record<Answer, number> = { never: 0, sometimes: 1, often: 2, always: 3 };
    const categoryScores: Record<string, { total: number; count: number }> = {};
    currentQuestions.forEach(q => {
      const ans = answers[q.id];
      if (ans !== undefined) {
        if (!categoryScores[q.category]) categoryScores[q.category] = { total: 0, count: 0 };
        categoryScores[q.category].total += scores[ans];
        categoryScores[q.category].count += 1;
      }
    });
    return Object.entries(categoryScores)
      .map(([cat, data]) => ({ category: cat, pct: Math.round((data.total / (data.count * 3)) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  };

  const categoryLabels: Record<string, string> = {
    reading: 'Reading', phonics: 'Phonics', phonological: 'Phonological Awareness',
    spelling: 'Spelling', comprehension: 'Comprehension', visual: 'Visual Processing',
    processing: 'Processing Speed', memory: 'Working Memory', writing: 'Written Expression',
    executive: 'Executive Function', language: 'Language', learning: 'New Learning',
    emotional: 'Emotional / Confidence', spatial: 'Spatial Awareness', speech: 'Speech & Language',
    literacy: 'Early Literacy',
  };

  const answerOptions: { value: Answer; label: string; description: string }[] = [
    { value: 'never', label: 'Never', description: 'Does not apply or very rarely observed' },
    { value: 'sometimes', label: 'Sometimes', description: 'Occasionally observed, not consistent' },
    { value: 'often', label: 'Often', description: 'Frequently observed, fairly consistent' },
    { value: 'always', label: 'Always', description: 'Consistently observed in most situations' },
  ];

  // ── State: Age Selection ────────────────────────────────────────────────
  if (!selectedAge) {
    return (
      <section id="assessment" className="space-y-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Dyslexia Screening Assessment</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A validated, evidence-based screening questionnaire to identify characteristics associated with dyslexia.{' '}
                  <strong>This is not a diagnosis</strong> — only a qualified professional can formally diagnose dyslexia.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Evidence-based', 'All ages', '10 questions', '~3 minutes', 'Private & secure'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Select Age Group</h3>
              <p className="text-sm text-muted-foreground">
                Choose the age group that best describes the person being assessed. Questions are tailored to developmental stage and context.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { key: 'preschool', label: 'Preschool', sub: '3–5 years', color: 'pink', desc: 'Early signs in pre-readers; speech and phonological awareness focus' },
                  { key: 'primary', label: 'Primary School', sub: '5–11 years', color: 'blue', desc: 'Reading, phonics, spelling, and classroom learning indicators' },
                  { key: 'secondary', label: 'Secondary School', sub: '11–18 years', color: 'emerald', desc: 'Academic skills, exam pressure, and executive function indicators' },
                  { key: 'adult', label: 'Adult', sub: '18–64 years', color: 'amber', desc: 'Workplace, daily life, and self-assessment screening' },
                  { key: 'senior', label: 'Senior', sub: '65+ years', color: 'purple', desc: 'Lifelong patterns and late-life support indicators' },
                ] as { key: AgeGroup; label: string; sub: string; color: string; desc: string }[]
              ).map(({ key, label, sub, color, desc }) => (
                <button
                  key={key}
                  onClick={() => setSelectedAge(key)}
                  className={`p-5 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-${color}-400 dark:hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-950/20 transition-all text-left group`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold text-foreground group-hover:text-foreground">{label}</h4>
                      <ChevronRight className={`w-4 h-4 text-${color}-400 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <p className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>{sub}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Important Disclaimer:</strong> This screening tool is for informational and educational purposes only. It cannot diagnose dyslexia.
                Only a qualified professional (Educational Psychologist, Specialist Teacher Assessor, or equivalent) can provide a formal diagnosis.
                Screening results should prompt — not replace — professional assessment.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // ── State: Results ──────────────────────────────────────────────────────
  if (showResults) {
    const scoreLevel = calculateScore();
    const result = scoreInterpretation[scoreLevel];
    const IconComponent = result.icon;
    const roadmap = selectedAge ? ageRoadmaps[selectedAge] : null;
    const breakdown = getCategoryBreakdown();
    const ageLabel = ageGroupLabels[selectedAge];

    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
      amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
      red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    };

    return (
      <section id="assessment" className="space-y-4">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-2xl font-bold text-foreground">Your Personalised Assessment Report</h2>
                <p className="text-sm text-muted-foreground">{ageLabel} · {currentQuestions.length} questions completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Result */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className={`p-5 rounded-xl border-2 ${colorMap[result.color]}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-white/60 dark:bg-black/20">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">{result.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/20 border">{result.badge}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{result.description}</p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            {breakdown.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  Profile Breakdown by Area
                </h4>
                <div className="space-y-2">
                  {breakdown.slice(0, 6).map(({ category, pct }) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{categoryLabels[category] ?? category}</span>
                        <span className={`font-medium ${pct >= 66 ? 'text-red-600 dark:text-red-400' : pct >= 33 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={`h-1.5 rounded-full ${pct >= 66 ? 'bg-red-500' : pct >= 33 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tailored Roadmap */}
        {roadmap && (
          <>
            {/* Daily Routine */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Recommended Daily Routine
                </h4>
                <div className="space-y-2">
                  {roadmap.dailyRoutine.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                      <div className="flex-shrink-0 text-xs font-semibold text-blue-700 dark:text-blue-400 w-24 pt-0.5">{item.time}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.activity}</p>
                        <p className="text-xs text-muted-foreground">{item.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Plan */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Weekly Practice Plan
                </h4>
                <div className="space-y-3">
                  {roadmap.weeklyPlan.map((day, i) => (
                    <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">{day.day}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{day.focus}</span>
                      </div>
                      <ul className="space-y-1">
                        {day.activities.map((act, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Strategies */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Evidence-Based Strategies for You
                </h4>
                <ul className="space-y-2">
                  {roadmap.keyStrategies.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Core Exercises &amp; Practices
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roadmap.exercises.map((ex, i) => (
                    <div key={i} className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-foreground">{ex.title}</h5>
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{ex.duration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ex.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Known Strengths */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Recognised Dyslexic Strengths
                </h4>
                <p className="text-xs text-muted-foreground">Research consistently shows that dyslexic individuals frequently demonstrate exceptional abilities in these areas:</p>
                <div className="flex flex-wrap gap-2">
                  {roadmap.strengths.map((s, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300">{s}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Professional Next Steps */}
            {(scoreLevel === 'moderate' || scoreLevel === 'high') && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-rose-500" />
                    Professional Support — Next Steps
                  </h4>
                  <ul className="space-y-2">
                    {roadmap.professionalNext.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* CTA to Training */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-white/80 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-white">Start Your Personalised Training Programme</h4>
                <p className="text-sm text-white/80">
                  Your assessment has been saved. Access your personalised daily routine, targeted exercises, and evidence-based practice tools — all tailored to your profile.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href={trainingPageLink}>
                <Button className="bg-white text-blue-700 hover:bg-white/90 font-semibold gap-2 w-full sm:w-auto">
                  Open My Training Plan
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dyslexia-reading-training">
                <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                  Practice Tools
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={resetAssessment} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Take Another Assessment
          </Button>
        </div>

        <div className="text-xs text-muted-foreground italic p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border">
          <strong>Disclaimer:</strong> This screening tool provides indicative information only and cannot diagnose dyslexia. A formal diagnosis requires assessment by a qualified professional — Educational Psychologist, Specialist Teacher Assessor (APC/AMBDA qualified), or equivalent clinician. Content is informed by the International Dyslexia Association, British Dyslexia Association, and peer-reviewed research.
        </div>
      </section>
    );
  }

  // ── State: Active Questionnaire ─────────────────────────────────────────
  const alreadySaved = currentQuestion ? answers[currentQuestion.id] : undefined;
  const activeAnswer = pendingAnswer ?? alreadySaved ?? null;

  return (
    <section id="assessment" className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Dyslexia Screening Assessment</h2>
              <p className="text-sm text-muted-foreground">
                {ageGroupLabels[selectedAge]} &middot; Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Progress */}
          <div className="space-y-1.5">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}% Complete</p>
          </div>

          <div className="space-y-5">
            {/* Question */}
            <div className="space-y-2.5">
              <h3 className="text-base font-semibold text-foreground">How often does the following occur?</h3>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                <p className="text-base font-medium text-foreground leading-relaxed">
                  {currentQuestion?.text}
                </p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Frequency options">
              {answerOptions.map(({ value, label, description }) => {
                const isSelected = activeAnswer === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectAnswer(value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900/30'
                      }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                      }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="gap-1"
              >
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={resetAssessment}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={activeAnswer === null}
                  className="gap-2 min-w-[120px]"
                >
                  {isLastQuestion ? 'View Results' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!activeAnswer && (
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                Please select an option above to continue
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

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
interface ExternalResource {
  label: string;
  url: string;
  type: 'podcast' | 'audiobook' | 'app' | 'guide';
  description?: string;
}

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
  externalResources?: ExternalResource[];
  examples?: string[];
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
  ageExamples?: Partial<Record<AgeGroup, string[]>>;
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
      ageExamples: {
        preschool: [
          'Use a favourite picture book (e.g., "The Gruffalo") — read one page 3 times with a grown-up',
          'Ask a parent to point to each word as you read — builds word-by-word tracking',
          'Record yourself on a tablet and listen back — children love hearing their own improvement',
          'Read to a soft toy — no pressure, just practice in a safe, fun way',
        ],
        primary: [
          'Pick a decodable reader or a chapter from "Diary of a Wimpy Kid" at a comfortable level',
          'Read the same paragraph morning, at lunch, and before bed — note how much smoother round 3 feels',
          'Mark your best time with a star — celebrate every improvement, however small',
          'Ask a sibling or parent to be your audience on the 3rd read — performing it adds expression naturally',
        ],
        secondary: [
          'Use your current English set text — practice a key paragraph 3 times until it flows',
          'Track words-per-minute (WPM): aim to increase by at least 5 per round — keep a weekly log',
          'Use the Fluency Pacer tool or a free metronome app to set a steady reading beat',
          'Record yourself into a phone voice memo — hearing real improvement is the best motivation',
        ],
        adult: [
          'Use a work email, article or report you actually need to read — repeated reading = useful practice',
          'First read: meaning. Second read: pace. Third read: natural expression — three passes, three different goals',
          'Use Natural Reader (free) as a benchmark: compare your spoken pace to the TTS model',
          'Track your WPM once a week — expect 15–30% gains within a month of daily 10-minute practice',
        ],
        senior: [
          'Use a favourite passage — a poem, newspaper column, or well-loved book chapter',
          'Read at a comfortable pace — fluency, not speed, is the goal for enjoyment and confidence',
          'Read aloud to a family member, friend, or reading group partner on the third pass',
          'Large-print editions reduce visual fatigue — same fluency gains, less eye strain',
        ],
      },
    },
    {
      id: 'paired-reading', title: 'Echo Reading', duration: '10 min', frequency: 'Daily',
      why: 'Modelled reading with immediate echo reduces decoding anxiety and builds prosody (expression and rhythm).',
      how: ['An adult reads a sentence aloud with expression', 'The learner immediately echoes it back', 'Alternate paragraphs as confidence builds', 'Use audiobooks to read along — ideal if reading alone'],
      priority: 'medium', category: 'reading',
      ageExamples: {
        preschool: [
          'Parent reads "Brown Bear, Brown Bear" one line at a time — child echoes with the same fun voice',
          'Use a talking toy or an audiobook as the "model reader" if reading alone',
          'Make it dramatic — silly voices, whispers, roars — engagement beats perfection every time',
          'Celebrate every attempt: confidence at this age is the foundation of every reading skill that follows',
        ],
        primary: [
          'Parent reads a sentence from the class reader — child echoes and then asks "what happens next?"',
          'Alternate: adult reads paragraph 1, child echoes; child reads paragraph 2 independently',
          'Use Audible Kids or BorrowBox as the "model reader" — listen then echo a sentence at a time',
          'Record the session and play it back — pupils often surprise themselves with how well they sound',
        ],
        secondary: [
          'Use a chapter-by-chapter audiobook (Audible, Libby) as the model — listen a sentence, echo it back',
          'Echo at sentence level first, then build to full paragraphs as confidence grows',
          'For exam revision texts, echoing key sentences also improves memory of the content',
          'After 4 weeks, try reading the same passage without the model — measure your solo fluency gain',
        ],
        adult: [
          'Listen to a podcast or documentary audio; pause and echo each sentence back clearly',
          'Use Speechify to read work documents aloud, then echo and re-read challenging sections',
          'Focus on prosody — mimic the presenter\'s pacing, emphasis, and pauses',
          'This technique also accelerates language learning — the same process works for a second language',
        ],
        senior: [
          'Listen to an audiobook at 0.9× speed, echo each sentence before pressing play again',
          'BBC Radio 4 Book of the Week is an ideal reading-aloud model — free, high-quality narration',
          'In a reading group: one member reads aloud, others follow in the text and echo together',
          'Focus on enjoyment and expression — the technique works even when used lightly and informally',
        ],
      },
    },
  ],
  phonics: [
    {
      id: 'phonics-flashcards', title: 'Phonics Flashcard Drill', duration: '10 min', frequency: 'Daily',
      why: 'Explicit, systematic phonics instruction is the most evidence-based intervention for dyslexia (IDA, 2023). Daily exposure builds automaticity.',
      how: ['Review 5–7 grapheme-phoneme pairs', 'For each card: say the sound, write the letter, find a word containing it', 'Use the Phonics Player for audio-guided practice', 'Rotate cards — mastered sounds need weekly review only'],
      toolLink: '/dyslexia-reading-training#phonics', toolLabel: 'Phonics Player Tool',
      priority: 'high', category: 'phonics',
      ageExamples: {
        preschool: [
          'Use letter-sound cards with pictures: A → Apple, B → Bus — keep cards colourful and large',
          'Play "What sound?" — show the card, child gives the sound, then parent makes it dramatic or silly',
          'Start with just 3–5 cards per session — keep each session under 5 minutes and fun',
          'Reward every 5 correct sounds with a sticker, stamp, or high-five',
        ],
        primary: [
          'Focus on Phase 3–5 sounds: ch, sh, th, ph, igh, oa, oi, ue — follow the school\'s phonics programme',
          'Time the drill — aim to answer 5 cards correctly in under 60 seconds (builds automaticity)',
          'Alternate sides: parent shows card, child gives the sound AND a word that contains it',
          'Use the Phonics Player tool for audio guidance — especially useful for children learning independently',
        ],
        secondary: [
          'Use phonics to decode unfamiliar subject vocabulary — biology, chemistry, history terms',
          'Target complex grapheme patterns: -ough, -tion, -sion, silent letters (knife, write, gnome)',
          'Apply phonics rules to new words in context — your textbook is your phonics practice arena',
          'A 5-minute daily drill prevents decoding bottleneck during exam reading under time pressure',
        ],
        adult: [
          'Focus on complex patterns that still cause hesitation: -ough, -aught, -tion vs -sion, -ph vs -f',
          'Read unfamiliar proper nouns and place names aloud — apply phonics rules to decode them',
          'Use Forvo.com (free) to check your decoded pronunciations against native-speaker audio',
          'Just 3 minutes daily compounds quickly — within 6 weeks most unfamiliar words become decodable',
        ],
        senior: [
          'Build a personal "tricky words" list — words you frequently mispronounce or avoid in reading',
          'Oxford Online Dictionary shows phonetic spelling beside every entry — use it to self-correct',
          'BBC Skillswise literacy resources are free, adult-appropriate, and include audio-guided phonics',
          'Focus on the sounds that appear most in your regular reading material (newspapers, books)',
        ],
      },
    },
    {
      id: 'blending', title: 'Sound Blending Practice', duration: '5 min', frequency: 'Daily',
      why: 'Blending phonemes into words is a core decoding skill. Weakness here is the primary barrier to word reading in dyslexia.',
      how: ['Say individual sounds: /c/ /a/ /t/', 'Have the learner blend them into a word', 'Start with 3-phoneme words, build to 6+', 'Use the Blending & Segmenting Lab for interactive practice'],
      toolLink: '/dyslexia-reading-training#blending', toolLabel: 'Blending Lab',
      priority: 'high', category: 'phonics',
      ageExamples: {
        preschool: [
          '"Silly robot talk": /c/-/a/-/t/ → "What does the robot say?" → cat! Children love this game',
          'Start with 2-phoneme blends: /in/, /at/, /it/ before moving on to 3-phoneme words',
          'Use real objects: show a toy cat while blending /c/-/a/-/t/ — connects the sound to the real thing',
          'Keep sessions to 3–4 minutes maximum — short and enthusiastic beats long and tiring',
        ],
        primary: [
          'Build up to 5-phoneme blends: /s/-/t/-/r/-/ee/-/t/ → street — aim to add one phoneme each month',
          'Use magnetic letters or letter tiles: physically push the letters together as you say each blend',
          'Challenge: blend nonsense words (frolt, blip, strug) — if you can blend invented words, real words are easy',
          'Use the Blending Lab for interactive practice with immediate audio feedback',
        ],
        secondary: [
          'Apply blending to decode multi-syllable words: isolate each syllable, blend within it, then blend syllables',
          'Target subject-specific vocabulary: ph-ot-o-syn-th-e-sis, ac-cel-er-a-tion, par-lia-ment',
          'Use the Blending Lab for 5-minute structured practice before homework reading sessions',
          'Blending automaticity removes the decoding bottleneck that slows reading speed in exams',
        ],
        adult: [
          'Apply blending to decode foreign words, technical terms, and proper nouns in documents',
          'Under 5 minutes daily is all that\'s needed — the goal is automatic blending, not lengthy practice',
          'Forvo.com and Merriam-Webster online include phonetic transcriptions — practise blending from them',
          'Blending fluency carries over to foreign language pronunciation — useful beyond English reading',
        ],
        senior: [
          'Reactivate blending skills starting with simple 3-letter words, then build to multi-syllable words',
          'BBC Bitesize adult literacy track includes audio-guided blending exercises — free and clearly structured',
          'Link blending practice to words you encounter in daily reading — newspapers, letters, labels',
          'Even partial blending skills significantly reduce reading anxiety and increase reading independence',
        ],
      },
    },
  ],
  phonological: [
    {
      id: 'rhyme-practice', title: 'Rhyme & Alliteration Games', duration: '5 min', frequency: 'Daily',
      why: 'Phonological awareness — the ability to hear and manipulate sounds — is the single strongest predictor of reading success.',
      how: ['Say a word and ask for a rhyme (cat → bat, hat, sat)', 'Play "I spy something beginning with /s/"', 'Clap syllables in words (hap-pi-ness = 3)', 'Use the Phoneme Segmentation game for guided practice'],
      toolLink: '/dyslexia-reading-training#phonics', toolLabel: 'Phoneme Tools',
      priority: 'high', category: 'phonological',
      ageExamples: {
        preschool: [
          '"Can you find something that rhymes with cat?" — play while walking around the house',
          'Nursery rhymes: Humpty Dumpty, Jack and Jill — knowing these strongly predicts later reading success',
          'Clap the beats in everyone\'s name at the dinner table: Ol-i-ver = 3, Ben = 1, Gran-ny = 2',
          '"I spy with my little eye… something beginning with /b/" — played anywhere, anytime',
        ],
        primary: [
          'Play Rhyme Bingo: write a word on each square, caller says a rhyme, players cross off the match',
          'Alliteration sentences: "Six slippery snakes slithered south" — count the /s/ sounds together',
          'Read or listen to Dr Seuss — the rhyme and rhythm is phonological awareness training in disguise',
          'Use the Phoneme Segmentation game for structured daily practice — 3 minutes before reading time',
        ],
        secondary: [
          'Analyse rap lyrics or song lyrics for rhyme patterns — phonological analysis with cultural relevance',
          'Write a 4-line rhyming verse about your revision topic — rhyme aids memory significantly',
          'Wordle, NYT Connections, and Scrabble-style games all activate phonological and lexical awareness',
          'Spot rhyme schemes in poetry you study (ABAB, AABB, ABBA) — links phonology to English literature',
        ],
        adult: [
          'Listen to spoken word poetry (Benjamin Zephaniah, Kate Tempest) — rhyme awareness as entertainment',
          'Crosswords and word games (Wordle, Codenames) subtly activate phonological pattern recognition',
          'Advertising slogans and jingles use rhyme deliberately — noticing why they work builds awareness',
          'Reading poetry aloud — even briefly — reactivates phonological processing in the adult brain',
        ],
        senior: [
          'Read poetry aloud — Betjeman, Hardy, Larkin use regular rhyme schemes that support sound-pattern training',
          'Crossword puzzles and word searches activate rhyme and sound awareness without feeling like "practice"',
          'Hymn singing and folk songs embed strong rhyme and meter — musical memory preserves phonological patterns',
          'Read nursery rhymes with grandchildren — it benefits both the adult reader and the child listener',
        ],
      },
    },
    {
      id: 'syllable-splitting', title: 'Syllable Splitting', duration: '5 min', frequency: 'Daily',
      why: 'Breaking words into syllables is a key decoding strategy for longer words. Hugely reduces anxiety about unfamiliar multi-syllable words.',
      how: ['Take a longer word (e.g., "impossible")', 'Count syllables by placing hand under chin and feeling jaw drops', 'Write the word with syllable dividers: im-pos-si-ble', 'Use the Syllable Splitter tool'],
      toolLink: '/dyslexia-reading-training#syllables', toolLabel: 'Syllable Splitter',
      priority: 'medium', category: 'phonological',
      ageExamples: {
        preschool: [
          'Clap syllables in everyone\'s name at the dinner table: Ma-ma = 2, grand-ma = 2, A-li-cia = 4',
          'Body percussion: stamp for 1-syllable words, clap for 2, click for 3 — make it a movement game',
          'Count the "beats" in favourite characters\' names: Pep-pa = 2, Po-kém-on = 3, Di-no-saur = 3',
          'At this stage, just hearing and feeling syllables is the goal — no writing required',
        ],
        primary: [
          'Syllable sort game: picture cards sorted into 1, 2, 3, and 4-syllable piles',
          'Write the syllable dividers inside a word: un-der-stand, ex-plan-a-tion, hap-pi-ness',
          'Challenge: count the syllables in "antidisestablishmentarianism" together — the answer is 12!',
          'Use the Syllable Splitter tool for immediate feedback on tricky words',
        ],
        secondary: [
          'Use syllable splitting on every unfamiliar word in class texts — write it out with dividers first',
          'Greek/Latin syllable patterns appear in subject vocabulary: bi-ol-o-gy, e-con-o-mics, his-to-ry',
          'Break apart exam question vocabulary: sig-nif-i-cance, im-pli-ca-tion, e-val-u-ate',
          'Once you can split a word into syllables, you can almost always decode and spell it correctly',
        ],
        adult: [
          'Tackle long words in professional documents by syllabifying first: ac-com-mo-da-tion, re-mu-ner-a-tion',
          'Syllable awareness improves presentation confidence — no more mispronouncing "particularly" or "specifically"',
          'Medical and legal vocabulary is almost entirely decodable once you recognise the syllable patterns',
          'Practice with field-specific vocabulary from your work — 5 words a week × 50 weeks = 250 new words decoded',
        ],
        senior: [
          'Reconnect with syllable patterns in poetry and hymns — musical memory preserves syllabic rhythm',
          'Use syllable splitting to decode unfamiliar medical terms: car-di-ol-o-gy, hy-per-ten-sion, di-a-be-tes',
          'Reading prescriptions, health letters, or news articles: split the hardest word in each paragraph',
          'This one skill reduces reading anxiety dramatically — knowing you can decode any word is empowering',
        ],
      },
    },
  ],
  spelling: [
    {
      id: 'look-say-cover', title: 'Look–Say–Cover–Write–Check', duration: '10 min', frequency: 'Daily',
      why: 'The most consistently effective spelling technique for dyslexic learners (BDA, 2022). Engages visual memory, auditory memory, and motor memory simultaneously.',
      how: ['Look at the word carefully — note tricky parts', 'Say the word aloud', 'Cover it completely', 'Write it from memory', 'Check — celebrate success, repeat if wrong'],
      priority: 'high', category: 'spelling',
      ageExamples: {
        preschool: [
          'Choose CVC words only: cat, dog, red, big, sun — just 3–5 words per session',
          'Use magnetic letters to "build" the word instead of writing — hands-on and engaging',
          'Draw a picture of each word to reinforce the meaning alongside the spelling (cat → draw a cat)',
          'Celebrate every correct attempt with a sticker, stamp, or high-five — success builds confidence',
        ],
        primary: [
          'Start with your school\'s common exception word list (Year 1, 2, 3, or 4 as appropriate)',
          'Use coloured gel pens — write the tricky part of the word in a different colour',
          'After 5 correct writes in a row, that word is "banked" — move it to an "I know this!" pile',
          '5 words per session, maximum 10 minutes — quality and consistency beat marathon sessions',
        ],
        secondary: [
          'Focus on subject-specific vocabulary: photosynthesis, Parliament, coefficient, onomatopoeia',
          'Before covering, identify the morpheme structure: photo-synth-esis — this creates a memory hook',
          'Use a mini whiteboard — easy to erase and retry without wasting paper or feeling permanent',
          'Link each word to a vivid memory image: "photosynthesis" → photo of a plant sunbathing with headphones',
        ],
        adult: [
          'Apply to professional vocabulary, emails, names, addresses, or foreign language words you use regularly',
          'Use a sticky note — write the word, flip it, write from memory on the back',
          'Pair with Read&Write or NaturalReader to hear the word pronounced before you cover it',
          'Track your personal "most commonly misspelled words" list — 20 targeted words beats 200 random ones',
        ],
        senior: [
          'Focus on words you frequently look up or feel uncertain about — create a personalised "My Words" list',
          'Write large — pen and paper on lined A4, not a screen — motor memory encodes better this way',
          'Group words by shared pattern: -ough words one week (though, through, tough, cough, bough)',
          'Share your list with a trusted friend or family member — explaining the tricky part deepens your own memory',
        ],
      },
    },
    {
      id: 'morphology-spelling', title: 'Root Word & Morphology Training', duration: '10 min', frequency: '3×/week',
      why: 'Understanding prefixes, suffixes, and roots reduces the spelling load by 40–60% — once you know "un-" always means "not", you can spell and read hundreds of words.',
      how: ['Learn one root per week (e.g., "port" = carry)', 'Find words using that root (transport, import, export)', 'Learn common prefixes: un-, re-, pre-, dis-', 'Learn common suffixes: -tion, -ing, -ed, -ly'],
      toolLink: '/dyslexia-reading-training#morphology', toolLabel: 'Morphology Master',
      priority: 'medium', category: 'spelling',
      ageExamples: {
        preschool: [
          'Morphology is not yet appropriate — focus on phonics and CVC words first',
          'Parents: notice and name word patterns in picture books ("look — both jumping and running end in -ing!")',
        ],
        primary: [
          'Learn one simple suffix per week: -ing, -ed, -er, -est, -ness, -ful, -less, -ment',
          'Play "Make a word": add -ing to verbs (run→running, jump→jumping, bake→baking)',
          'Colour code: write the root word in blue pen and the suffix in red — visually separates the building blocks',
          'Make a word family poster: happy → happiness, happily, happiest, unhappy — stick it on the bedroom wall',
        ],
        secondary: [
          'Learn one Latin or Greek root per week: port (carry), rupt (break), vis (see), scribe (write), aud (hear)',
          'Build word families: transport, import, export, reporter, deport, portable — all from one root',
          'For GCSEs, focus on subject-specific roots: bio (life), geo (earth), hydro (water), therm (heat)',
          'Use the Morphology Master tool to drill root word families in the week before exams',
        ],
        adult: [
          'Use morphology to decode professional jargon: sub- (under), super- (above), inter- (between), macro- (large)',
          'For legal, medical, or technical documents: learn the 10 most common field-specific Latin roots',
          'Build a "root word notebook" — add 2 new roots per week with their word families',
          'Spelling errors in professional writing drop sharply once you understand the structure of long words',
        ],
        senior: [
          'Latin and Greek roots — many seniors studied these at school and can reactivate strong prior knowledge',
          'Focus on roots that appear in your daily reading: -ology (study of), -ist (one who), -tion (action/result)',
          'Connect roots to words you already know well: "aqua" (water) → aquarium, aquatic, aqueduct',
          'Flashcard: root on the front, family words on the back — 2 new roots per month is steady, sustainable progress',
        ],
      },
    },
  ],
  comprehension: [
    {
      id: 'sq3r', title: 'SQ3R Active Reading', duration: '15 min', frequency: '3×/week',
      why: 'SQ3R (Survey, Question, Read, Recite, Review) transforms passive reading into active engagement — proven to dramatically improve retention and comprehension.',
      how: [
        'Survey: skim headings, subheadings, images and captions (2 min)',
        'Question: turn each heading into a question — "What causes climate change?" (1 min)',
        'Read: read to find the answer to each of your questions (8 min)',
        'Recite: close the text, say the key points aloud or write 3 bullet points',
        'Review: re-open the text and check your recall — correct any gaps',
      ],
      toolLink: '/dyslexia-reading-training', toolLabel: 'Full Training Toolkit',
      priority: 'high', category: 'comprehension',
      ageExamples: {
        primary: [
          '"Look Before You Read": scan pictures and headings first, then predict: "I think this will be about…"',
          'After reading: close the book and say out loud everything you can remember — how much can you recall?',
          'Use three sticky flag colours: Q = a question it raised, A = where you found the answer, S = something surprising',
          'Works brilliantly with non-fiction class books, science topics, and topic-based reading tasks',
        ],
        secondary: [
          'Apply to every non-fiction chapter: textbooks, news articles, revision guides, past paper sources',
          '5-minute Survey before every essay topic — scan the whole chapter to build a mental map before reading word-by-word',
          'Recite step: voice-memo or bullet-point 3 key things before re-opening the text',
          'Regular Review spaced over days prevents last-minute revision cramming — the knowledge is already there',
        ],
        adult: [
          'Use for all professional reading: reports, training materials, long emails, policy documents',
          'Survey = skim headers, sub-headers and the first sentence of each paragraph (takes under 2 minutes)',
          'Adapt for digital: document open in one browser tab, notes open in another — Question and Recite in writing',
          'The Review step is critical for knowledge work — re-check key points 24 hours later for long-term retention',
        ],
        senior: [
          'Adapt for pleasure reading: before starting a new chapter, flip through and scan headings or section breaks (Survey)',
          '"What do I already know about this topic?" — write or say it before reading (activates prior knowledge)',
          'Less formal version: read actively with a pen in hand — underline one key sentence per page (your Recite)',
          'Brilliant for learning from biography, history, or nature books — turns reading into a conversation with the author',
        ],
      },
    },
    {
      id: 'audiobooks', title: 'Audiobook + Vocabulary Building', duration: '20 min', frequency: 'Daily',
      why: 'Audiobooks allow dyslexic learners to engage with books at their intellectual level, not their decoding level. Yale Center for Dyslexia recommends this as essential.',
      how: [
        'Choose a book you genuinely want to read — genre doesn\'t matter',
        'Listen while following along in the print version if available',
        'Set speed to 1.1–1.25× — slightly faster keeps attention sharper',
        'Pause when you hear an unfamiliar word — look it up or voice-note it',
        'After each session, discuss with someone or write 3 bullet-point summaries',
      ],
      priority: 'medium', category: 'comprehension',
      ageExamples: {
        preschool: [
          'Libby (free with library card) and BorrowBox have thousands of audiobooks for young children',
          'Audible Kids, Spotify Kids — many classic picture books read aloud by authors or celebrities',
          'Listen at bedtime: 20 minutes of audiobook alongside or instead of a physical book',
          'Pause and ask: "what happened?" or "what do you think comes next?" — comprehension grows through talking',
        ],
        primary: [
          'Listen while following the print book — best of both worlds for building decoding alongside comprehension',
          'Audible, BorrowBox (free), Libby — match to your school\'s class reader if possible',
          'Note one new word per session: what does it mean? Use it in a sentence the next day',
          'Engage at your intellectual level: The Hobbit, Percy Jackson, Roald Dahl — not limited to your reading level',
        ],
        secondary: [
          'Every GCSE set text is available as an audiobook — Audible, Spotify, YouTube (classic novels)',
          'Listen to the audiobook first, then read the SparkNotes summary, then re-read key passages in print',
          'Build vocabulary from the text: note 5 new words per book, add them to your Anki flashcard deck',
          'Discuss the book or join a reading group — talking about a book deepens comprehension by around 40%',
        ],
        adult: [
          'Audible, Spotify Audiobooks, Scribd — commit to one service and one book per month minimum',
          'Use 1.1–1.5× speed to match or slightly exceed your natural listening pace — trains faster processing',
          'Listen during commutes, walks, cooking — reclaim dead time for vocabulary and knowledge building',
          'Voice-note a new word whenever you hear it; review your "new words" list every Sunday',
        ],
        senior: [
          'RNIB Talking Books (free for registered users), Calibre Audio Library, BorrowBox via local library',
          'Local library talking book service — free, well-curated, available in person or by post',
          'Memoirs, biography, travel writing, and natural history — genres rich in vocabulary and vivid storytelling',
          'Pause after each chapter: say aloud what happened and what you learnt — verbal recall strengthens retention',
        ],
      },
    },
  ],
  writing: [
    {
      id: 'structured-writing', title: 'Structured Writing Practice', duration: '10 min', frequency: 'Daily',
      why: 'Short, structured daily writing builds automaticity without overwhelm. Explicit frameworks (PEEL, TEEL) dramatically improve writing quality for dyslexic learners.',
      how: ['Choose a topic or prompt', 'Plan in a mind map (2 minutes)', 'Write using PEEL: Point, Evidence, Explain, Link', 'Do NOT stop to edit while writing — get thoughts out first', 'Edit in a separate pass'],
      priority: 'high', category: 'writing',
      ageExamples: {
        preschool: [
          'Tell a story aloud while a parent writes it down — then read it back together',
          'Draw a picture first, then dictate 1–2 sentences about what is happening',
          'Practice letter formation in sand, finger paint, or on a whiteboard — motor skills build writing readiness',
          '"I did…, I saw…, I felt…" — three spoken sentences about the day is the most powerful early start',
        ],
        primary: [
          'Simple 3-part frame: Beginning (who, where), Middle (what happened), End (how did it feel)',
          'Prompt ideas: "My best day ever", "If I had a superpower", "The day the animals escaped the zoo"',
          'Write in pencil on wide-lined paper — crossing out is fine, erasing is fine, messy drafts are normal',
          'After writing, read it aloud to a parent — hearing the words helps the writer self-edit naturally',
        ],
        secondary: [
          'Use PEEL (Point, Evidence, Explain, Link) for every paragraph — English, History, Geography, Science',
          'Time blocks: 2 minutes mind map → 8 minutes writing → 2 minutes read-back review',
          'Remove the perfectionism block: write the entire first draft before editing a single word',
          'Voice-dictate into a notes app for the first draft, paste into your document, then edit — removes the spelling barrier',
        ],
        adult: [
          'Email drafting: voice dictate first, then edit the transcription — faster and significantly fewer typos',
          'Use PEEL or the Pyramid Principle for all professional documents and reports',
          'Grammarly or LanguageTool as your editing pass — this is editing support, not a shortcut',
          'Daily 5-minute journal prompt: "The most important thing I did today was…" — low-stakes writing builds fluency',
        ],
        senior: [
          'Write letters to family, friends, or pen pals — meaningful purpose makes daily practice sustainable',
          'Large-print notebooks or tablet with voice-to-text for longer pieces',
          'Start small: one paragraph per day about something you\'ve read, watched, or experienced',
          'Dictate to a trusted family member if hand-writing is difficult — the composing process is what builds the skill',
        ],
      },
    },
    {
      id: 'voice-to-text', title: 'Voice-to-Text Drafting', duration: '10 min', frequency: 'Daily',
      why: 'Separating the thinking/speaking from the writing/spelling removes the cognitive bottleneck. Learners produce 2–3× more content and better ideas.',
      how: ['Use your phone or computer\'s voice dictation', 'Speak your ideas freely — full sentences', 'Then read back and edit the transcription', 'Gradually reduce reliance as writing confidence grows'],
      priority: 'medium', category: 'writing',
      ageExamples: {
        preschool: [
          'Not quite ready for this stage — use a grown-up scribe: child dictates, parent writes',
          'Voice memos are great for parents: record what your child narrates and transcribe it together',
          'The oral storytelling habit now makes voice-to-text effortless in a few years\' time',
        ],
        primary: [
          'Use the built-in microphone on an iPad, laptop, or Chromebook (tap the 🎤 key on keyboard)',
          'Dictate 3 sentences about your day, weekend, or any topic you love',
          'Listen back to what you dictated — does it make sense? Change just one thing.',
          'Save favourite dictated stories to read back later — creates a proud sense of authorship',
        ],
        secondary: [
          'Google Docs Voice Typing (Tools → Voice Typing) for essays, assignments, and revision notes',
          'Talk through your ideas for 3 minutes before typing — verbal brainstorm then written structure',
          'Use voice notes to record initial ideas; use the transcript as your essay plan',
          'Write by speaking, check by listening (text-to-speech) — two channels, zero spelling bottleneck',
        ],
        adult: [
          'Apple Dictation, Google Docs voice typing, or Whisper AI for all first drafts — emails, reports, messages',
          'Speak in complete sentences as if explaining to a colleague face-to-face — this produces better writing',
          '"Talk → type → edit" workflow: speak draft → read back → light edit → Grammarly final pass',
          'For complex documents: use Otter.ai to transcribe a verbal brainstorm, then organise and refine the transcript',
        ],
        senior: [
          'Voice dictation is built into every modern smartphone and tablet — no extra app needed',
          'Dictate shopping lists, notes, letters, and diary entries — removes the physical writing demand entirely',
          'Siri, Google Assistant, and Alexa can transcribe and send messages, emails, or texts on your behalf',
          'Speak naturally and at your own pace — modern voice recognition handles most accents and speech patterns well',
        ],
      },
    },
  ],
  memory: [
    {
      id: 'spaced-repetition', title: 'Spaced Repetition Flashcards', duration: '10 min', frequency: 'Daily',
      why: 'Spaced repetition is scientifically the most efficient memory technique — information is reviewed just before it would be forgotten, maximising retention.',
      how: ['Use Anki (free) or Quizlet for digital flashcards', 'Create cards for key spelling, vocabulary, facts', 'Review cards daily — the app schedules optimal intervals', 'Start with 10 cards max, add 3 new cards per week'],
      priority: 'high', category: 'memory',
      ageExamples: {
        preschool: [
          'Use physical picture cards — show, name, hide, recall. 3–5 cards maximum per session',
          'Lotto, snap, and matching card games are the preschool version of spaced repetition — just as effective',
          'Pair cards to objects: show the "cat" card next to a toy cat — context strengthens memory',
        ],
        primary: [
          'Quizlet (free) has ready-made spelling lists for every National Curriculum year group',
          'Start with 10 words, add 2 new cards per week — never overwhelm the system',
          'Use "Learn" mode in Quizlet, not just flashcard mode — it actively spaces and adapts to your performance',
          'Create cards for: spelling, maths facts, history dates, science vocabulary definitions',
        ],
        secondary: [
          'Anki (free) is the gold standard app — used by medical students worldwide, proven to maximise long-term retention',
          'Create a card for every new term in every subject — one card takes 30 seconds to make in class',
          'Review your Anki deck during commute, at lunch, before class — micro-sessions add up to massive knowledge gains',
          'Cap at 15–20 new cards per day — Anki automatically schedules exactly what needs reviewing each day',
        ],
        adult: [
          'Anki for professional vocabulary, languages, technical terminology, or any professional qualification',
          'Readwise (paid) automatically creates flashcards from your Kindle and Instapaper highlights',
          'Daily Anki review takes just 5–10 minutes once established — but protects months of learning from forgetting',
          'Combine with audiobooks: when you hear a word you want to retain, add it to Anki immediately via the mobile app',
        ],
        senior: [
          'Physical flashcard packs work perfectly — no app required, no learning curve, equally effective',
          'Keep a small, high-value set: 20–30 words, reviewed in rotation over a month',
          'Word-image peg system: create a vivid mental image for each word — visual memory stays strong long-term',
          'Crosswords, word searches, pub quizzes, and Scrabble are all informal, enjoyable spaced repetition',
        ],
      },
    },
    {
      id: 'chunking', title: 'Chunking Strategy', duration: '5 min', frequency: 'Daily',
      why: 'Breaking information into small chunks reduces working memory load — the primary cognitive challenge in dyslexia.',
      how: ['Break any multi-step task into numbered steps', 'Write steps on a card or sticky note', 'Complete one step at a time', 'Cross off each completed step (satisfying!)'],
      priority: 'medium', category: 'memory',
      ageExamples: {
        preschool: [
          'Visual schedule: three picture cards on the wall — (1) shoes and coat, (2) bag, (3) stand by the door',
          'Maximum 2 instructions at a time: "Put on your coat, then come here" — more than 2 is too many',
          'Routines are chunks: bath → pyjamas → story → sleep. Predictable order reduces overwhelm for young children',
        ],
        primary: [
          'Homework checklist: every task broken into its sub-tasks — visible on a sticky note or whiteboard',
          'Colour-code by subject: one sticky note colour per subject, one task per note',
          '"Rule of 3": before bed, what are the 3 most important things needed for tomorrow?',
          'Crossing off a completed task on a physical list is genuinely satisfying — use that to build the habit',
        ],
        secondary: [
          'Every exam or essay question broken into sub-tasks before writing a single word: plan → draft → review',
          'Revision in 25-minute chunks with 5-minute breaks — never sit for 90 minutes without a break',
          'Mind map → numbered bullet points → write one bullet point at a time',
          'Chunking ends paralysis: "I don\'t know where to start" becomes "step 1 is to write the introduction sentence"',
        ],
        adult: [
          'GTD (Getting Things Done): capture every task, clarify the single next action, schedule it',
          'Notion, Trello, or a simple paper notebook — break every project into weekly and daily actions',
          'Every email and project gets a "Next Action" assigned — one specific, doable thing',
          '"Eat the frog": do the highest-priority chunk first thing, before email or any reactive work',
        ],
        senior: [
          'Weekly to-do list broken into daily mini-lists — maximum 3 priority items per day, no more',
          'Post-it notes on a visible board: move each note from "To Do" to "Done" — physical movement is satisfying',
          'Ask a trusted friend or family member to check in once a week on your task list',
          'Focus on just the next small step, not the whole task — this is what reliably gets things done',
        ],
      },
    },
  ],
  executive: [
    {
      id: 'weekly-planner', title: 'Weekly Planning Session', duration: '20 min', frequency: 'Weekly (Sunday)',
      why: 'Executive function difficulties are present in ~50% of dyslexic individuals. A structured weekly review dramatically reduces overwhelm and missed deadlines.',
      how: ['Every Sunday evening, open your planner', 'List all tasks for the coming week', 'Estimate time for each task (double your first estimate)', 'Schedule tasks into specific time slots', 'Colour-code by type or urgency'],
      priority: 'high', category: 'executive',
      ageExamples: {
        primary: [
          'Sunday evening: fill in the weekly homework planner — this one habit is worth more than any app',
          '"What\'s coming this week?" — 5-minute conversation with a parent builds the planning habit early',
          'Visual timetable on the bedroom wall: what happens each day of the week, drawn with pictures or colour',
          'Tick off each day as it passes — children love seeing the week progress',
        ],
        secondary: [
          'Sunday planning is your secret academic weapon — most high-achieving dyslexic students do this',
          'List every assignment, test, and commitment for the week, then schedule specific time blocks for each',
          'Estimate generously: a 1-hour task typically takes 2–3 hours with reading and re-reading — plan for it',
          'Friday review: what did you complete? What moved? No self-criticism — treat it as data, not judgment',
        ],
        adult: [
          'Sunday review is the keystone habit for dyslexic adults managing a demanding workplace',
          'Calendar blocking: assign specific tasks to specific time slots — unscheduled tasks reliably don\'t get done',
          'Protect "deep work" blocks: 90-minute reading or writing sessions in the morning, meeting-free if possible',
          'Use Notion, Trello, or a physical week planner — the tool matters far less than the weekly habit',
        ],
        senior: [
          'Weekly review: what health, social, and personal appointments are coming up this week?',
          'Large-print weekly planner on the wall or fridge is more reliable than a phone app for many seniors',
          'Share the week\'s plan with a family member — an accountability partner significantly improves follow-through',
          'Include enjoyable activities alongside obligations in the plan — balance reduces overwhelm and improves mood',
        ],
      },
    },
    {
      id: 'pomodoro', title: 'Pomodoro Focus Sessions', duration: '25 min + 5 min break', frequency: 'Daily',
      why: 'Short focused work bursts (25 min) with breaks are optimal for working memory and attention. Particularly effective for dyslexic learners who fatigue more quickly from reading/writing tasks.',
      how: ['Set a timer for 25 minutes', 'Work on one task only — no switching', 'When timer rings, take a 5-minute break (move, drink water)', 'After 4 pomodoros, take a longer 20-minute break'],
      priority: 'high', category: 'executive',
      ageExamples: {
        preschool: [
          'Young children naturally work in 5–10 minute bursts — follow natural task completion rather than a timer',
          'Sand timers are a developmentally appropriate version: "you have this much time for tidying up"',
        ],
        primary: [
          'Use a visual sand timer or kitchen timer: 10–15 minutes of work, then 5 minutes of chosen activity',
          'After 3 sessions, a longer "silly break" — jump around, drink water, tell a joke',
          'The timer is not a punishment — it protects playtime ("once the timer is done, you\'ve earned your break")',
          'Works brilliantly for reading practice, spellings, and any sitting-down homework task',
        ],
        secondary: [
          'Classic 25-minute Pomodoro with 5-minute break — use a free timer app or a dedicated YouTube Pomodoro timer',
          'Rules: phone face-down, one task only, no switching, notifications silenced during the Pomodoro',
          '4 Pomodoros = 2 focused hours with built-in breaks — more effective than 3 hours of distracted "studying"',
          'Stack them purposefully: 25 min reading → 25 min note-making → 25 min practice questions → 25 min self-testing',
        ],
        adult: [
          'The Pomodoro technique breaks the procrastination cycle — "just 25 minutes" is always psychologically manageable',
          'Forest app (free on iOS/Android) — you grow a virtual tree during focus time, killing the app kills the tree',
          'Schedule 4 Pomodoros per morning for deep work: reading, writing, and complex analysis',
          'During breaks: stand up, stretch, drink water, look out a window — not screens, which restart mental fatigue',
        ],
        senior: [
          'Use 20-minute focus sessions rather than 25 if concentration fatigue is a factor — equally effective',
          'A kitchen timer or watch alarm is as effective as any app — simplicity is a feature',
          'After each session, write down what you completed — the written record is rewarding to look back on',
          'Breaks are not optional — they are how the brain consolidates and stores what it just learned',
        ],
      },
    },
  ],
  emotional: [
    {
      id: 'strength-journaling', title: 'Strengths Journal', duration: '5 min', frequency: 'Daily',
      why: 'Dyslexia is consistently associated with low self-esteem due to school struggles. Daily strength journaling builds the positive self-concept essential for persistence and learning.',
      how: ['Each evening, write 3 things that went well today', 'Include one thing you\'re proud of (however small)', 'Note one dyslexia strength you used (creativity, problem-solving)', 'Re-read previous entries when feeling discouraged'],
      priority: 'high', category: 'emotional',
      ageExamples: {
        preschool: [
          '"Tell me one amazing thing you did today" — parent says it every evening, builds language and self-concept',
          '"You read 5 words today — that\'s 5 more than yesterday!" — make progress explicit and specific',
          'Draw a "happy picture" of one good thing from the day — drawing is expression before writing',
          'Bedtime ritual: "what made you smile today?" — simple, warm, and powerfully consistent',
        ],
        primary: [
          '"Draw and describe" version: draw one thing you did well today, write one sentence about it',
          'Use a special journal — something a bit exciting, not just a school exercise book',
          '3 questions every evening: What did I try today? What went well? What am I good at?',
          'Read previous entries together once a month — children are often surprised and proud of their own progress',
        ],
        secondary: [
          'Evening journal prompt: 3 things that went well + one dyslexic strength you used (creativity, spatial thinking, storytelling)',
          '"Not yet" mindset journal: replace "I can\'t do this" with "I can\'t do this yet — here\'s what I\'m going to try"',
          'Make a "Strengths Wall" in your room with physical evidence of what you\'re good at — revisit it on difficult days',
          'Listen to "Made By Dyslexia" podcast episodes featuring successful dyslexic people — identity matters enormously',
        ],
        adult: [
          'Keep a digital or physical strengths log — 3 bullet points before bed, takes under 3 minutes',
          'Weekly pattern review: what strengths show up repeatedly? This data informs better career and life choices',
          'Made By Dyslexia, Dyslexia Quest podcast, and similar — hearing others\' stories builds a positive dyslexic identity',
          'Share your dyslexic strengths openly with your employer — creative, spatial and big-picture thinking are workplace assets',
        ],
        senior: [
          'Review life achievements — seniors with dyslexia have often developed remarkable resilience, creativity, and oral skill',
          '"Letter to my younger self" exercise: what would you tell yourself about living with dyslexia? Profoundly therapeutic.',
          'Share your experience and strategies with a grandchild — becoming their role model is a powerful act of identity reclamation',
          'Join a local or online dyslexia community for adults — shared lived experience and community is deeply sustaining',
        ],
      },
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
    {
      id: 'pr-1', time: 'Morning', title: 'Rhyme & Sound Play', duration: '10 min',
      description: 'Sing nursery rhymes, spot rhyming words in songs, and play "I Spy" with beginning sounds.',
      category: 'phonological', icon: 'audio',
      examples: [
        '"I Spy something beginning with /s/" — sun, sock, snake',
        'Clap the syllables in your child\'s name (e.g. "Em-ma" = 2 claps)',
        'Spot rhymes in "The Cat in the Hat": cat / hat / sat / mat',
        'Sing "Down by the Bay" — pause before each rhyming word for the child to complete',
      ],
      externalResources: [
        { label: 'Storynory — Free Audio Stories', url: 'https://www.storynory.com', type: 'audiobook', description: 'Hundreds of free children\'s audio stories' },
        { label: 'BBC CBeebies Audio & Stories', url: 'https://www.bbc.co.uk/cbeebies/stories', type: 'audiobook', description: 'Free audio stories from BBC CBeebies' },
        { label: 'Listening Books (UK)', url: 'https://www.listening-books.org.uk', type: 'app', description: 'Affordable audiobook library for those with a print disability' },
      ],
    },
    {
      id: 'pr-2', time: 'Mid-morning', title: 'Letter Sound Exploration', duration: '5 min',
      description: 'Trace letters in sand, playdough, or finger paint. Say the sound as you write.',
      category: 'phonics', icon: 'pencil',
      examples: [
        'Draw letter "s" in a tray of sand and hiss like a snake',
        'Roll playdough into a letter shape, then name 2 words starting with that sound',
        'Trace letters on each other\'s backs — can you guess the letter?',
        'Magnetic fridge letters: say the sound, find the letter',
      ],
    },
    {
      id: 'pr-3', time: 'Afternoon', title: 'Shared Reading', duration: '15 min',
      description: 'Read a picture book together. Run your finger under words. Ask "What do you think happens next?"',
      category: 'reading', icon: 'book',
      toolLink: '/dyslexia-reading-training', toolLabel: 'Reading Tools',
      examples: [
        'Point to each word while reading "Dear Zoo" — child echoes the animal names',
        'Pause before turning the page: "What do you think happens next?"',
        '"Where is the word \'big\'? Can you point to it?"',
        'Revisit the same book 3 days running — familiarity builds confidence',
      ],
      externalResources: [
        { label: 'Storynory — Free Children\'s Audiobooks', url: 'https://www.storynory.com', type: 'audiobook', description: 'Classic and original fairy tales, myths & stories' },
        { label: 'BBC CBeebies Stories', url: 'https://www.bbc.co.uk/cbeebies/stories', type: 'audiobook', description: 'Short illustrated audio stories for young children' },
      ],
    },
    {
      id: 'pr-4', time: 'Evening', title: 'Oral Storytelling', duration: '10 min',
      description: 'Tell a story together about the day, or use story dice. Builds narrative language and memory.',
      category: 'comprehension', icon: 'star',
      examples: [
        '"Once upon a time, a little girl called [child\'s name] went to the park…" — child adds next sentence',
        'Roll a story dice (images): character → setting → problem → solution',
        '"Tell me 3 things that happened at nursery today — what was first?"',
        'Draw a comic strip of the story together: 4 boxes, 4 events',
      ],
    },
  ],
  primary: [
    {
      id: 'pm-1', time: 'Before School', title: 'Phonics Flashcards', duration: '10 min',
      description: 'Review 5 grapheme-phoneme pairs. Say, write, and read a word containing each.',
      category: 'phonics', icon: 'brain',
      toolLink: '/dyslexia-reading-training', toolLabel: 'Phonics Player',
      examples: [
        'Card: "oa" → say /oa/, write "boat", use in sentence: "The boat floats"',
        'Card: "ch" → say /ch/, write "chair", use in sentence: "I sit on a chair"',
        'Mastered card? Put in "easy" pile — revisit weekly',
        'New card? Repeat it at the start AND end of the session',
      ],
      externalResources: [
        { label: 'BBC Sounds — Phonics Stories', url: 'https://www.bbc.co.uk/sounds', type: 'audiobook', description: 'Audio stories and phonics programmes from BBC' },
        { label: 'Listening Books', url: 'https://www.listening-books.org.uk', type: 'app', description: 'Print-disability audiobook library for children' },
      ],
    },
    {
      id: 'pm-2', time: 'After School', title: 'Decodable Book Reading', duration: '15 min',
      description: 'Read a book matched to your phonics stage. Read it once for accuracy, once for fluency.',
      category: 'reading', icon: 'book',
      toolLink: '/dyslexia-reading-training', toolLabel: 'Fluency Pacer',
      examples: [
        'Round 1: Read slowly, sounding out every unfamiliar word',
        'Round 2: Read again — smoother this time, with expression',
        'Challenge: Can you read it faster than yesterday?',
        'Stuck on a word? Break it into syllables: "fan-tas-tic"',
      ],
      externalResources: [
        { label: 'Learning Ally — Audiobook Library', url: 'https://learningally.org', type: 'audiobook', description: 'Human-narrated audiobooks for students with reading differences' },
        { label: 'Bookshare (Free for UK/US students)', url: 'https://www.bookshare.org', type: 'app', description: 'World\'s largest accessible ebook library' },
        { label: 'Audible Kids', url: 'https://www.audible.co.uk', type: 'audiobook', description: 'Audiobooks for children of all ages' },
      ],
    },
    {
      id: 'pm-3', time: 'Evening', title: 'Spelling Practice (LSCCWC)', duration: '10 min',
      description: 'Look–Say–Cover–Write–Check. Work on this week\'s 5 spelling words.',
      category: 'spelling', icon: 'pencil',
      examples: [
        '"because": stare at it, say "be-cause", cover, write, uncover and check',
        'Got it wrong? Identify the exact letter(s) that tripped you up',
        'Rainbow writing: write the word in 3 colours over the tricky part',
        'Use the word in a funny sentence to lock it in memory: "Because unicorns eat pizza…"',
      ],
    },
    {
      id: 'pm-4', time: 'Bedtime', title: 'Audiobook or Read-Aloud', duration: '15 min',
      description: 'Listen to a chapter of a book above your reading level. Builds vocabulary and love of stories.',
      category: 'comprehension', icon: 'audio',
      examples: [
        'Follow along in the print book while the audio plays — dual input doubles retention',
        'After listening: "What was your favourite part? Why?"',
        'New word heard? Pause and look it up together',
        'Choose books you love — Harry Potter, Narnia, Roald Dahl all work brilliantly',
      ],
      externalResources: [
        { label: 'Storynory — Free Audiobooks', url: 'https://www.storynory.com', type: 'audiobook', description: 'Classic fairy tales, myths and original stories' },
        { label: 'Story Pirates Podcast', url: 'https://www.storypirates.com/podcast', type: 'podcast', description: 'Children\'s stories brought to life with music and comedy' },
        { label: 'Learning Ally', url: 'https://learningally.org', type: 'audiobook', description: 'Human-narrated audiobooks for learners with print disabilities' },
        { label: 'BBC Sounds Kids', url: 'https://www.bbc.co.uk/sounds', type: 'audiobook', description: 'Bedtime stories and children\'s radio programmes' },
        { label: 'Listening Books (UK)', url: 'https://www.listening-books.org.uk', type: 'app', description: 'Audiobook subscription for those with a print disability' },
      ],
    },
  ],
  secondary: [
    {
      id: 'sc-1', time: 'Morning', title: 'Vocabulary Review', duration: '5 min',
      description: 'Review 5–7 subject-specific words using spaced repetition cards. Use Anki or Quizlet.',
      category: 'memory', icon: 'brain',
      examples: [
        'Biology: "mitosis" → write the definition from memory, check, repeat if wrong',
        'History: "appeasement" → say it aloud, draw a quick picture clue',
        'Add 3 new words this week from your current subject unit',
        'Anki app: green = easy (delay 4 days), red = hard (retry tomorrow)',
      ],
      externalResources: [
        { label: 'Anki — Free Spaced Repetition App', url: 'https://apps.ankiweb.net', type: 'app', description: 'The world\'s best free flashcard app — proven memory science' },
        { label: 'Quizlet', url: 'https://quizlet.com', type: 'app', description: 'Create and share digital flashcards with audio pronunciation' },
      ],
    },
    {
      id: 'sc-2', time: 'After School', title: 'Subject Reading (TTS)', duration: '20 min',
      description: 'Use text-to-speech to cover subject reading. Highlight key points as you listen.',
      category: 'reading', icon: 'audio',
      toolLink: '/dyslexia-reading-training', toolLabel: 'Reading Tools',
      examples: [
        'Paste text into Natural Reader or use Read&Write browser extension',
        'Play at 1.1× speed — just fast enough to stay focused',
        'Highlight in yellow = key fact; pink = something to revisit',
        'After reading: write a 3-bullet summary without looking back',
      ],
      externalResources: [
        { label: 'Natural Reader (TTS)', url: 'https://www.naturalreaders.com', type: 'app', description: 'Free text-to-speech with natural voices — paste any text' },
        { label: 'Read&Write for Google Chrome', url: 'https://www.texthelp.com/products/read-and-write-for-google/', type: 'app', description: 'Literacy support toolbar — reads webpages and PDFs aloud' },
        { label: 'BBC Sounds — Documentaries', url: 'https://www.bbc.co.uk/sounds', type: 'podcast', description: 'Subject-relevant audio documentaries and programmes' },
        { label: 'Bookshare (Free for students)', url: 'https://www.bookshare.org', type: 'audiobook', description: 'Free accessible textbooks and novels' },
      ],
    },
    {
      id: 'sc-3', time: 'Evening', title: 'Structured Writing', duration: '15 min',
      description: 'Draft one PEEL paragraph. Plan in a mind map, then write, then edit separately.',
      category: 'writing', icon: 'pencil',
      examples: [
        'P (Point): "The Industrial Revolution improved living standards..."',
        'E (Evidence): "Factory output increased 300% between 1760 and 1840..."',
        'E (Explain): "This meant that goods became affordable for ordinary families..."',
        'L (Link): "Therefore, the quality of life for many improved significantly..."',
      ],
    },
    {
      id: 'sc-4', time: 'Evening', title: 'Study Timer Sessions', duration: '25+5 min',
      description: 'Pomodoro: 25 minutes focused, 5 minutes break. No phone during focus time.',
      category: 'executive', icon: 'puzzle',
      toolLink: '/dyslexia-reading-training', toolLabel: 'Practice Timer',
      examples: [
        'Session 1: Review flashcards (25 min) → walk around / stretch (5 min)',
        'Session 2: Write one PEEL paragraph (25 min) → snack break (5 min)',
        'After 4 sessions: 20-minute proper break — screen off',
        'Use Forest app or simple phone timer — no willpower required',
      ],
      externalResources: [
        { label: 'Understood Podcast — Thinking Differently', url: 'https://www.understood.org/articles/the-thinking-differently-podcast', type: 'podcast', description: 'Practical guidance for teens with learning differences' },
        { label: 'Dyslexia Quest Podcast', url: 'https://podcasts.apple.com/gb/podcast/dyslexia-quest/id1484681267', type: 'podcast', description: 'Stories and strategies from dyslexic students and professionals' },
      ],
    },
  ],
  adult: [
    {
      id: 'ad-1', time: 'Morning', title: 'Freewriting Journal', duration: '5 min',
      description: 'Write 3 sentences — no editing, no judging. Builds writing automaticity and confidence.',
      category: 'writing', icon: 'pencil',
      examples: [
        '"Today I am thinking about..." — just keep the pen moving for 5 minutes',
        '"Something I noticed yesterday was..." — no grammar rules, just flow',
        '"One thing I\'m looking forward to this week is..." — positive framing helps',
        '"A moment that surprised me recently was..." — builds narrative language',
        'Rule: pen never stops. Write "I don\'t know what to write" if stuck — keep going',
      ],
    },
    {
      id: 'ad-2', time: 'Work', title: 'Voice-to-Text for Emails', duration: 'Ongoing',
      description: 'Dictate all draft emails and notes. Edit the transcription rather than typing from scratch.',
      category: 'writing', icon: 'audio',
      examples: [
        'Google Docs: Tools → Voice Typing → speak your full email draft',
        'Microsoft Word: Dictate button (top bar) → speak naturally',
        'iPhone/Android: tap mic on keyboard → dictate → tap mic again to stop',
        'Speak punctuation: "Dear Sarah comma, I hope you are well full stop"',
        'Draft first, edit second — never type and edit simultaneously',
      ],
      externalResources: [
        { label: 'Google Docs Voice Typing (Free)', url: 'https://docs.google.com', type: 'app', description: 'Tools → Voice Typing in Google Docs. Free, accurate, built-in' },
        { label: 'Dragon Dictate (Professional)', url: 'https://www.nuance.com/dragon.html', type: 'app', description: 'Industry-leading dictation software — highly accurate' },
        { label: 'Otter.ai — Voice Notes & Transcription', url: 'https://otter.ai', type: 'app', description: 'Record meetings and notes, get instant transcripts' },
        { label: 'Read&Write (Texthelp)', url: 'https://www.texthelp.com/products/read-and-write/', type: 'app', description: 'Reads documents aloud and supports writing in any application' },
      ],
    },
    {
      id: 'ad-3', time: 'Lunch', title: 'Audiobook / Podcast', duration: '20 min',
      description: 'Listen to something professionally or personally interesting. Vocabulary grows through listening.',
      category: 'comprehension', icon: 'audio',
      examples: [
        'While eating: listen to a chapter of your current audiobook on 1.25× speed',
        'Commuting: switch podcasts monthly to broaden vocabulary across topics',
        'Note one new word per session in a voice memo or notes app',
        'Dyslexia podcast Fridays: one episode about living/thriving with dyslexia',
        'Discuss what you heard with a colleague or friend — explanation deepens retention',
      ],
      externalResources: [
        { label: 'Made By Dyslexia Podcast', url: 'https://madebydyslexia.org/podcast/', type: 'podcast', description: 'Kate Griggs interviews dyslexic thinkers, leaders and innovators' },
        { label: 'Dyslexia Quest Podcast', url: 'https://podcasts.apple.com/gb/podcast/dyslexia-quest/id1484681267', type: 'podcast', description: 'Practical strategies and lived experience from the dyslexic community' },
        { label: 'Understood — Thinking Differently', url: 'https://www.understood.org/articles/the-thinking-differently-podcast', type: 'podcast', description: 'Explores learning and thinking differences with expert guests' },
        { label: 'Dyslexia: Out Loud (BDA)', url: 'https://www.bdadyslexia.org.uk', type: 'podcast', description: 'British Dyslexia Association — interviews and guidance for adults' },
        { label: 'Audible (Audiobooks)', url: 'https://www.audible.co.uk', type: 'audiobook', description: 'World\'s largest audiobook library — listen to any book' },
        { label: 'Learning Ally', url: 'https://learningally.org', type: 'audiobook', description: 'Human-narrated audiobooks for adults with print disabilities' },
        { label: 'Libby / OverDrive (Free)', url: 'https://libbyapp.com', type: 'audiobook', description: 'Free audiobooks from your local library — no cost at all' },
        { label: 'Speechify', url: 'https://speechify.com', type: 'app', description: 'Converts any text — PDFs, emails, web pages — into audio' },
      ],
    },
    {
      id: 'ad-4', time: 'Evening', title: 'Strengths Journal', duration: '5 min',
      description: 'Write 3 things that went well today. One dyslexic strength you used. Builds self-concept.',
      category: 'emotional', icon: 'star',
      examples: [
        '"I handled the client call well — I connected through storytelling (dyslexic strength)"',
        '"I solved the workflow problem in a way no one else thought of — big-picture thinking"',
        '"I stayed calm when the report had errors — I problem-solved rather than panicked"',
        '"I explained the concept simply to a colleague — I think in pictures, not jargon"',
        '"Today I used: creativity / empathy / lateral thinking / spatial awareness"',
      ],
    },
  ],
  senior: [
    {
      id: 'sr-1', time: 'Morning', title: 'Radio / Podcast Listening', duration: '30 min',
      description: 'Listen to news, history, or any topic of interest. Spoken word is your strength — use it.',
      category: 'comprehension', icon: 'audio',
      examples: [
        'BBC Radio 4 "In Our Time" — deep dives into history, science, philosophy',
        'BBC Radio 4 "Desert Island Discs" — stories of fascinating lives',
        '"Great Lives" podcast — biographical stories of remarkable people',
        'After listening: write one sentence about the most interesting thing you heard',
        'Discuss with a friend or family member over the phone — social + cognitive benefit',
      ],
      externalResources: [
        { label: 'BBC Sounds — Radio & Podcasts', url: 'https://www.bbc.co.uk/sounds', type: 'podcast', description: 'Full BBC Radio archive — thousands of programmes on demand' },
        { label: 'BBC Radio 4 Podcasts', url: 'https://www.bbc.co.uk/radio4', type: 'podcast', description: 'In Our Time, Desert Island Discs, The Archers — all free' },
        { label: 'Audible', url: 'https://www.audible.co.uk', type: 'audiobook', description: 'World\'s largest audiobook library' },
        { label: 'RNIB Talking Books (Free)', url: 'https://www.rnib.org.uk/reading-services/talking-books/', type: 'audiobook', description: 'Free talking book service for those with a print disability' },
      ],
    },
    {
      id: 'sr-2', time: 'Mid-morning', title: 'Word Game', duration: '15 min',
      description: 'Crossword, word search, or Scrabble. Enjoyable cognitive stimulation with language.',
      category: 'memory', icon: 'puzzle',
      examples: [
        'Guardian Quick Crossword (15–20 min) — free online, gentle difficulty',
        'Wordle (daily, 5 minutes) — pattern recognition, great for word awareness',
        'Scrabble with a family member — no rush, no competition pressure',
        'Word search: choose themes you enjoy (history, nature, travel)',
        'If crossword clues feel hard, use the check button freely — the point is engagement',
      ],
    },
    {
      id: 'sr-3', time: 'Afternoon', title: 'Audiobook', duration: '30 min',
      description: 'Use RNIB Talking Books (free) or Audible. Read books you\'ve always wanted to read.',
      category: 'reading', icon: 'book',
      examples: [
        'Pick any book you\'ve always been curious about — no judgment about "level"',
        'RNIB Talking Books: free membership for those with sight loss or print disability',
        'Librivox: thousands of classic books read aloud, completely free',
        'Follow along in a large-print edition if available — audio + print is powerful',
        'After 30 minutes, write one sentence: "Today I learned that..."',
      ],
      externalResources: [
        { label: 'RNIB Talking Books (Free UK)', url: 'https://www.rnib.org.uk/reading-services/talking-books/', type: 'audiobook', description: 'Free postal and download audiobook service for print disability' },
        { label: 'Librivox — Free Classic Audiobooks', url: 'https://librivox.org', type: 'audiobook', description: 'Thousands of public domain books read by volunteers — completely free' },
        { label: 'Libby / OverDrive (Free via Library)', url: 'https://libbyapp.com', type: 'audiobook', description: 'Borrow audiobooks free with a library card' },
        { label: 'Audible', url: 'https://www.audible.co.uk', type: 'audiobook', description: 'Premium audiobook library — wide selection, excellent narration' },
        { label: 'Speechify', url: 'https://speechify.com', type: 'app', description: 'Converts letters, newspapers, and printed text into audio' },
      ],
    },
    {
      id: 'sr-4', time: 'Evening', title: 'Reminiscence Recording', duration: '15 min',
      description: 'Dictate or record a memory or story. Creates a precious life record and exercises language.',
      category: 'writing', icon: 'star',
      examples: [
        '"Tell me about a job you had as a young person — what was a typical day like?"',
        '"Describe a place from your childhood in as much detail as you can remember"',
        '"What was a decision that changed the course of your life?"',
        'Use your phone\'s voice recorder or Otter.ai to capture it automatically as text',
        'These recordings become a family memoir — enormously valuable',
      ],
      externalResources: [
        { label: 'Otter.ai — Voice to Text', url: 'https://otter.ai', type: 'app', description: 'Record your voice and get an automatic transcript — free plan available' },
        { label: 'BBC Capture Wales — Life Stories', url: 'https://www.bbc.co.uk/wales/capturewales/', type: 'guide', description: 'Inspiration for telling your life story through audio and digital' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Curated podcast & audio resources by age group (for the Resources section)
// ─────────────────────────────────────────────────────────────────────────────
interface PodcastResource {
  title: string;
  host?: string;
  description: string;
  url: string;
  type: 'podcast' | 'audiobook-service' | 'app' | 'radio';
  free: boolean;
  ageNote?: string;
}

const podcastsByAgeGroup: Record<AgeGroup, PodcastResource[]> = {
  preschool: [
    { title: 'Storynory', description: 'Hundreds of free audio fairy tales, myths, and original children\'s stories — ideal for pre-readers.', url: 'https://www.storynory.com', type: 'audiobook-service', free: true, ageNote: 'Ages 3–8' },
    { title: 'Story Pirates Podcast', host: 'Story Pirates', description: 'Children\'s stories brought to life with music, comedy and voice acting. Makes listening joyful.', url: 'https://www.storypirates.com/podcast', type: 'podcast', free: true, ageNote: 'Ages 4–8' },
    { title: 'BBC CBeebies Stories', host: 'BBC', description: 'Short illustrated audio stories from the BBC. Familiar voices, trusted content.', url: 'https://www.bbc.co.uk/cbeebies/stories', type: 'radio', free: true, ageNote: 'Ages 3–6' },
    { title: 'Listening Books', description: 'UK audiobook library service for children with a print disability. Subscription-based, affordable.', url: 'https://www.listening-books.org.uk', type: 'audiobook-service', free: false, ageNote: 'Ages 4+' },
  ],
  primary: [
    { title: 'Storynory', description: 'Classic fairy tales and original audio stories — brilliant for building listening vocabulary.', url: 'https://www.storynory.com', type: 'audiobook-service', free: true, ageNote: 'Ages 5–10' },
    { title: 'Story Pirates Podcast', host: 'Story Pirates', description: 'Kids submit story ideas — Story Pirates perform them. Enormously engaging and funny.', url: 'https://www.storypirates.com/podcast', type: 'podcast', free: true, ageNote: 'Ages 5–10' },
    { title: 'Learning Ally', description: 'Human-narrated audiobooks aligned to school curricula. Especially designed for students with dyslexia.', url: 'https://learningally.org', type: 'audiobook-service', free: false, ageNote: 'Ages 5–18' },
    { title: 'Bookshare', description: 'World\'s largest accessible ebook library. Free for qualifying students (US). Low-cost UK options.', url: 'https://www.bookshare.org', type: 'audiobook-service', free: true, ageNote: 'Ages 5–18' },
    { title: 'Libby (OverDrive)', description: 'Borrow audiobooks free with a library card. Thousands of children\'s titles.', url: 'https://libbyapp.com', type: 'app', free: true, ageNote: 'All ages' },
    { title: 'BBC Sounds', host: 'BBC', description: 'Children\'s radio programmes, bedtime stories, and Bitesize audio content.', url: 'https://www.bbc.co.uk/sounds', type: 'radio', free: true, ageNote: 'Ages 5–11' },
  ],
  secondary: [
    { title: 'Understood — Thinking Differently', host: 'Understood.org', description: 'Explores learning and thinking differences. Practical, non-judgmental, aimed at teens and their families.', url: 'https://www.understood.org/articles/the-thinking-differently-podcast', type: 'podcast', free: true, ageNote: 'Ages 13–18' },
    { title: 'Dyslexia Quest Podcast', host: 'Alison Patrick', description: 'Strategies, stories, and reassurance for dyslexic learners at school and beyond.', url: 'https://podcasts.apple.com/gb/podcast/dyslexia-quest/id1484681267', type: 'podcast', free: true, ageNote: 'Ages 12+' },
    { title: 'Learning Ally', description: 'Human-narrated textbooks and novels — essential for keeping up with curriculum reading.', url: 'https://learningally.org', type: 'audiobook-service', free: false, ageNote: 'Ages 5–18' },
    { title: 'Bookshare', description: 'Free accessible textbooks, fiction and non-fiction for qualifying students.', url: 'https://www.bookshare.org', type: 'audiobook-service', free: true, ageNote: 'Students' },
    { title: 'BBC Sounds', host: 'BBC', description: 'BBC Radio 4 documentaries, Bitesize revision audio, and subject-relevant programmes.', url: 'https://www.bbc.co.uk/sounds', type: 'radio', free: true, ageNote: 'Ages 13+' },
    { title: 'Natural Reader', description: 'Paste any text — essays, web pages, PDFs — and have it read aloud with natural voices.', url: 'https://www.naturalreaders.com', type: 'app', free: true, ageNote: 'Ages 11+' },
    { title: 'Libby (OverDrive)', description: 'Free audiobooks from your local library. No cost with a library card.', url: 'https://libbyapp.com', type: 'app', free: true, ageNote: 'All ages' },
  ],
  adult: [
    { title: 'Made By Dyslexia Podcast', host: 'Kate Griggs', description: 'Interviews with dyslexic thinkers, innovators, and leaders. Reframes dyslexia as a strength. Essential listening.', url: 'https://madebydyslexia.org/podcast/', type: 'podcast', free: true, ageNote: 'Adults' },
    { title: 'Dyslexia Quest Podcast', host: 'Alison Patrick', description: 'Practical strategies, evidence-based tips, and lived experience from the dyslexic community.', url: 'https://podcasts.apple.com/gb/podcast/dyslexia-quest/id1484681267', type: 'podcast', free: true, ageNote: 'Adults' },
    { title: 'Understood — Thinking Differently', host: 'Understood.org', description: 'Thoughtful exploration of learning differences, workplace strategies, and self-advocacy.', url: 'https://www.understood.org/articles/the-thinking-differently-podcast', type: 'podcast', free: true, ageNote: 'Adults' },
    { title: 'The British Dyslexia Association Podcast', host: 'BDA', description: 'Expert interviews on dyslexia in education, employment, and daily life from the UK\'s leading charity.', url: 'https://www.bdadyslexia.org.uk', type: 'podcast', free: true, ageNote: 'Adults' },
    { title: 'Audible', description: 'World\'s largest audiobook library. Listen to any book — fiction, non-fiction, professional development.', url: 'https://www.audible.co.uk', type: 'audiobook-service', free: false, ageNote: 'Adults' },
    { title: 'Libby (OverDrive)', description: 'Free audiobooks from your public library. Hundreds of thousands of titles at no cost.', url: 'https://libbyapp.com', type: 'app', free: true, ageNote: 'All ages' },
    { title: 'Speechify', description: 'Converts any text — emails, PDFs, documents, web pages — into spoken audio. Game-changing for daily reading.', url: 'https://speechify.com', type: 'app', free: false, ageNote: 'Adults' },
    { title: 'Learning Ally', description: 'Human-narrated audiobooks for adults in higher education or professional development.', url: 'https://learningally.org', type: 'audiobook-service', free: false, ageNote: 'Higher ed & adults' },
    { title: 'BBC Sounds', host: 'BBC', description: 'In Our Time, Desert Island Discs, Analysis — thousands of hours of enriching spoken word content.', url: 'https://www.bbc.co.uk/sounds', type: 'radio', free: true, ageNote: 'Adults' },
  ],
  senior: [
    { title: 'RNIB Talking Books', description: 'Free UK postal and download audiobook service for people with a print disability. Huge library of titles.', url: 'https://www.rnib.org.uk/reading-services/talking-books/', type: 'audiobook-service', free: true, ageNote: 'All ages with print disability' },
    { title: 'Librivox', description: 'Completely free classic audiobooks — Jane Austen, Dickens, Conan Doyle — all read by volunteers. No subscription.', url: 'https://librivox.org', type: 'audiobook-service', free: true, ageNote: 'All ages' },
    { title: 'Libby (OverDrive)', description: 'Borrow audiobooks free from your local library. No cost, large selection, works on any device.', url: 'https://libbyapp.com', type: 'app', free: true, ageNote: 'All ages' },
    { title: 'BBC Sounds — Radio On Demand', host: 'BBC', description: 'Revisit any BBC Radio programme — In Our Time, Desert Island Discs, The Archers, 30 days back.', url: 'https://www.bbc.co.uk/sounds', type: 'radio', free: true, ageNote: 'All ages' },
    { title: 'BBC Radio 4', host: 'BBC', description: '"In Our Time", "Great Lives", "Desert Island Discs" — enriching spoken word radio, free forever.', url: 'https://www.bbc.co.uk/radio4', type: 'radio', free: true, ageNote: 'Adults' },
    { title: 'Audible', description: 'Premium audiobook service with thousands of titles. First book free on trial.', url: 'https://www.audible.co.uk', type: 'audiobook-service', free: false, ageNote: 'Adults' },
    { title: 'Speechify', description: 'Converts printed letters, newspapers, and documents into audio using your device\'s camera.', url: 'https://speechify.com', type: 'app', free: false, ageNote: 'Adults' },
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

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{task.time}</span>
                              <h3 className={`text-sm font-semibold ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h3>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{task.duration}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>

                          {/* Practical examples */}
                          {task.examples && task.examples.length > 0 && (
                            <details className="group">
                              <summary className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline list-none flex items-center gap-1 mt-1">
                                <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" />
                                See examples
                              </summary>
                              <ul className="mt-2 space-y-1 pl-1">
                                {task.examples.map((ex, ei) => (
                                  <li key={ei} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                    <span className="flex-shrink-0 mt-0.5 text-amber-500">›</span>
                                    {ex}
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}

                          {/* Internal tool link */}
                          {task.toolLink && (
                            <Link href={task.toolLink} className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                              {task.toolLabel ?? 'Open Tool'}
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}

                          {/* External podcast / app / audiobook links */}
                          {task.externalResources && task.externalResources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {task.externalResources.map((res, ri) => (
                                <a
                                  key={ri}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors
                                    ${res.type === 'podcast'
                                      ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40'
                                      : res.type === 'audiobook'
                                        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                                        : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40'
                                    }`}
                                >
                                  {res.type === 'podcast' ? '🎙' : res.type === 'audiobook' ? '🎧' : '📱'}
                                  {res.label}
                                </a>
                              ))}
                            </div>
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

            {/* ── Recommended Listening & Resources ──────────────────────── */}
            {podcastsByAgeGroup[ageGroup] && podcastsByAgeGroup[ageGroup].length > 0 && (
              <div className="space-y-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-purple-500" />
                    Recommended Listening &amp; Resources
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Curated podcasts, audiobooks and apps tailored for {ageLabels[ageGroup]}. Listening is a dyslexic superpower — use it daily.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {podcastsByAgeGroup[ageGroup].map((pod, pi) => (
                    <a
                      key={pi}
                      href={pod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1.5 p-3 rounded-xl border border-border bg-background hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {pod.type === 'podcast' ? '🎙️' : pod.type === 'audiobook-service' ? '🎧' : pod.type === 'radio' ? '📻' : '📱'}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors leading-tight">{pod.title}</p>
                            {pod.host && <p className="text-xs text-muted-foreground">{pod.host}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${pod.free ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'}`}>
                            {pod.free ? 'Free' : 'Paid'}
                          </span>
                          {pod.ageNote && <span className="text-xs text-muted-foreground">{pod.ageNote}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{pod.description}</p>
                      <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                        Open →
                      </span>
                    </a>
                  ))}
                </div>

                <Card className="bg-purple-50/50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Why listening matters:</strong> The Yale Center for Dyslexia confirms that audiobooks and podcasts build vocabulary at your intellectual level — not your decoding level.
                      Many people with dyslexia have above-average verbal intelligence. Listening is not a workaround — it is the correct tool.
                    </p>
                  </CardContent>
                </Card>
              </div>
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

                    {ex.ageExamples?.[ageGroup] && (ex.ageExamples[ageGroup]?.length ?? 0) > 0 && (
                      <details className="group">
                        <summary className="text-xs text-amber-600 dark:text-amber-400 cursor-pointer hover:underline list-none flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90 flex-shrink-0" />
                          Examples for {ageLabels[ageGroup].split(' ')[0]}
                        </summary>
                        <ul className="mt-2 space-y-1.5 border-l-2 border-amber-200 dark:border-amber-800 pl-3">
                          {ex.ageExamples[ageGroup]!.map((example, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <span className="flex-shrink-0 mt-0.5 text-amber-500 font-bold">›</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}

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

'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  loadTrainingResult,
  markLessonComplete,
} from '@/lib/dyslexia/reading-training-store'
import { NB_LEVELS, LEARNER_GROUPS } from '@/lib/placement-levels'
import type { SavedTrainingResult } from '@/lib/dyslexia/reading-training-store'
import type { LearnerGroup, NBLevel } from '@/lib/placement-levels'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Volume2,
  BookOpen,
  Lightbulb,
  RotateCcw,
  Trophy,
  Play,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Lesson content data — evidence-based, tailored by level + learner group
// ─────────────────────────────────────────────────────────────────────────────

interface LessonStep {
  type: 'instruction' | 'exercise' | 'practice' | 'check'
  title: string
  body: string
  prompt?: string
  options?: string[]
  correctIndex?: number
  tip?: string
}

interface LessonContent {
  title: string
  objective: string
  whyItMatters: string
  steps: LessonStep[]
  completionMessage: string
  nextSuggestion: string
}

// Generates lesson content based on slug + learner context
function getLessonContent(
  slug: string,
  level: NBLevel,
  group: LearnerGroup,
): LessonContent {
  const groupConfig = LEARNER_GROUPS[group]

  // Tone adaptors
  const tone = {
    children: { intro: 'Let\'s explore!', praise: 'Amazing job!', you: 'you', effort: 'Keep it fun' },
    youth: { intro: 'Let\'s get started.', praise: 'Great work!', you: 'you', effort: 'Stay consistent' },
    adolescence: { intro: 'Ready to level up your reading?', praise: 'Well done.', you: 'you', effort: 'Small steps, big gains' },
    adult: { intro: 'Let\'s build your skills.', praise: 'Excellent work.', you: 'you', effort: 'Consistency is key' },
    senior: { intro: 'Take it at your own pace.', praise: 'Wonderful work.', you: 'you', effort: 'Every session counts' },
  }[group] ?? { intro: 'Let\'s begin.', praise: 'Well done.', you: 'you', effort: 'Keep going' }

  // Full lesson content — all 40 slugs across NB-L0 to NB-L8
  const LESSON_MAP: Partial<Record<string, LessonContent>> = {

    // ── NB-L0: Foundations ────────────────────────────────────────────────────
    'letter-sounds-intro': {
      title: 'Letter Sounds Introduction',
      objective: 'Learn the sounds that individual letters make',
      whyItMatters: 'Matching letters to sounds (phonics) is the foundation of reading. Research shows this is the single most important skill for beginning readers.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Sounds and Letters`,
          body: `Every letter has a sound. When ${tone.you} know the sounds, ${tone.you} can read any word.
Today we focus on 5 core sounds: A (apple), B (ball), C (cat), D (dog), E (egg).`,
          tip: 'Say each sound out loud — hearing yourself helps your brain remember.',
        },
        {
          type: 'exercise',
          title: 'Sound Practice',
          body: 'Look at each letter and say its sound out loud before reading on.',
          prompt: 'What sound does the letter B make?',
          options: ['/b/ as in ball', '/d/ as in dog', '/p/ as in pen'],
          correctIndex: 0,
          tip: `${tone.praise} The letter B says /b/, like the beginning of "ball".`,
        },
        {
          type: 'exercise',
          title: 'Letter Matching',
          body: 'Which letter makes the /k/ sound at the start of "cat"?',
          prompt: 'Which letter begins the word "cat"?',
          options: ['G', 'C', 'K'],
          correctIndex: 1,
          tip: 'C and K both make the /k/ sound. In short words, C usually comes first.',
        },
        {
          type: 'practice',
          title: 'Say It Out Loud',
          body: `Practise saying these letter sounds aloud, 3 times each:\n\nA — /a/ (apple)\nB — /b/ (ball)\nC — /k/ (cat)\nD — /d/ (dog)\nE — /e/ (egg)\n\nPoint to each letter as ${tone.you} say it.`,
          tip: 'Tracing the letter in the air while saying the sound uses more of your brain.',
        },
        {
          type: 'check',
          title: `${tone.praise} Session Complete`,
          body: 'You practised 5 letter sounds today. Repeat this session tomorrow to lock them in.',
        },
      ],
      completionMessage: `${tone.praise} You completed the Letter Sounds lesson.`,
      nextSuggestion: 'rhyme-time',
    },

    'cvc-words-1': {
      title: 'CVC Words: Short A',
      objective: 'Blend consonant-vowel-consonant words using the short A sound',
      whyItMatters: 'CVC words (like cat, bat, hat) are the building blocks of reading. Mastering short vowels unlocks thousands of simple words.',
      steps: [
        {
          type: 'instruction',
          title: 'What is a CVC Word?',
          body: `A CVC word has 3 parts: a Consonant, a Vowel, a Consonant.\nExample: C-A-T = /k/ /a/ /t/ → "cat"\n\n${tone.intro} Short A sounds like the "a" in "apple" or "ant".`,
          tip: 'Put your hand under your chin — your jaw drops on short A.',
        },
        {
          type: 'exercise',
          title: 'Blend This Word',
          body: 'Say each sound, then blend them together.',
          prompt: 'What word does /h/ /a/ /t/ make?',
          options: ['hot', 'hat', 'hit'],
          correctIndex: 1,
          tip: '/h/ + /a/ + /t/ = "hat". You said each sound and then pushed them together.',
        },
        {
          type: 'exercise',
          title: 'Find the Short A Word',
          body: 'Which of these has the short A sound?',
          prompt: 'Which word has the same vowel sound as "cat"?',
          options: ['bit', 'bat', 'but'],
          correctIndex: 1,
          tip: '"Bat" — /b/ /a/ /t/. The middle sound is the short A, like "cat".',
        },
        {
          type: 'practice',
          title: 'Read These Words Aloud',
          body: `Read each word clearly, one at a time:\n\ncat   bat   hat   mat   sat   rat\n\nFor each word:\n1. Say each sound: /k/ /a/ /t/\n2. Blend together: "cat"\n3. Say it naturally in a sentence: "The cat sat on the mat."`,
          tip: 'Silly sentences help you remember. Make up your own!',
        },
        {
          type: 'check',
          title: 'Excellent Work!',
          body: 'You can now blend short-A CVC words. Practise these words again tomorrow.',
        },
      ],
      completionMessage: `${tone.praise} CVC Short A lesson complete.`,
      nextSuggestion: 'cvc-words-2',
    },

    'repeated-reading': {
      title: 'Repeated Reading for Fluency',
      objective: 'Improve reading speed and smoothness through repeated practice',
      whyItMatters: 'A 2017 meta-analysis of 34 studies found repeated reading is "highly effective" for reading fluency in people with reading difficulties. Reading the same text 3 times dramatically improves speed and expression.',
      steps: [
        {
          type: 'instruction',
          title: 'What is Repeated Reading?',
          body: `Repeated reading means reading the same short passage 3 times in a row.\n\nEach time ${tone.you} read, ${tone.you} will:\n• Read faster (because the words are familiar)\n• Read more smoothly\n• Understand more\n\n${tone.intro} Let's try.`,
          tip: 'Set a timer for 1 minute and count how many words you read. Try to beat your score each round.',
        },
        {
          type: 'practice',
          title: 'Read 1 — First Read (Accuracy)',
          body: `Read this passage aloud, carefully:\n\n"Sam had a red cap. He put it on his cat. The cat ran away with the cap on her head. Sam ran after the cat. He got his cap back. Sam and the cat sat on the mat."\n\nFocus: accuracy. Say each word correctly.`,
          tip: 'Don\'t worry about speed on the first read. Get the words right.',
        },
        {
          type: 'practice',
          title: 'Read 2 — Second Read (Fluency)',
          body: `Read the same passage again:\n\n"Sam had a red cap. He put it on his cat. The cat ran away with the cap on her head. Sam ran after the cat. He got his cap back. Sam and the cat sat on the mat."\n\nFocus: read more smoothly this time.`,
          tip: 'Notice how much easier it feels the second time. Your brain already knows these words.',
        },
        {
          type: 'practice',
          title: 'Read 3 — Third Read (Expression)',
          body: `One more time — this time with feeling:\n\n"Sam had a red cap. He put it on his cat. The cat ran away with the cap on her head. Sam ran after the cat. He got his cap back. Sam and the cat sat on the mat."\n\nFocus: read with expression, like you're telling a story.`,
          tip: 'Expression = slowing down for important words, pausing at commas, rising voice for questions.',
        },
        {
          type: 'check',
          title: `${tone.praise} Fluency Session Done`,
          body: 'You read the same passage three times. Each read was smoother than the last. This is exactly how fluency grows.',
        },
      ],
      completionMessage: `${tone.praise} Fluency practice complete. Repeated reading works — keep it up.`,
      nextSuggestion: 'prosody-practice',
    },

    'academic-vocabulary': {
      title: 'Academic Word Study',
      objective: 'Learn and use high-frequency academic vocabulary',
      whyItMatters: 'Academic vocabulary — words like "analyse", "contrast", "significant" — appears across all subjects. Research shows targeted vocabulary instruction produces the largest gains in reading comprehension for older learners.',
      steps: [
        {
          type: 'instruction',
          title: 'What is Academic Vocabulary?',
          body: `Academic words are not everyday words, but they appear in almost every subject you read.\n\nToday's words:\n• analyse — examine something in detail\n• significant — important, meaningful\n• contrast — show the differences between two things\n• evidence — facts that support a claim\n\n${tone.intro} Let's use them.`,
          tip: 'Write each word, say it aloud, and use it in a sentence you create yourself.',
        },
        {
          type: 'exercise',
          title: 'Word in Context',
          body: '"Scientists found significant evidence that reading practice improves brain activity."',
          prompt: 'What does "significant" mean in this sentence?',
          options: ['unimportant and minor', 'meaningful and notable', 'old and outdated'],
          correctIndex: 1,
          tip: '"Significant" = important. If evidence is significant, it really matters to the argument.',
        },
        {
          type: 'exercise',
          title: 'Choose the Academic Word',
          body: 'Complete the sentence: "The essay asked students to _____ two different approaches to the problem."',
          prompt: 'Which word fits best?',
          options: ['ignore', 'contrast', 'repeat'],
          correctIndex: 1,
          tip: '"Contrast" = show the differences. You contrast two things to highlight what makes them different.',
        },
        {
          type: 'practice',
          title: 'Build Your Word Bank',
          body: `For each word, write:\n1. The word and its meaning\n2. A sentence using the word\n3. A memory trick\n\nWords: analyse, significant, contrast, evidence\n\nExample for "evidence":\nMeaning: facts that support a claim\nSentence: "My evidence shows that practice improves reading."\nMemory trick: evidence → e-VID-ence → video → things you can see.`,
          tip: 'Spaced repetition apps like Anki help you review these words at optimal intervals.',
        },
        {
          type: 'check',
          title: `${tone.praise} Vocabulary Session Complete`,
          body: 'You learned 4 academic words. Review them again in 3 days to move them to long-term memory.',
        },
      ],
      completionMessage: `${tone.praise} Academic Vocabulary lesson complete.`,
      nextSuggestion: 'summarizing',
    },

    'making-inferences': {
      title: 'Reading Between the Lines',
      objective: 'Make inferences from text to deepen comprehension',
      whyItMatters: 'Over 50% of comprehension questions require inference — going beyond what is stated. Teaching inference strategies produces the largest gains in comprehension scores.',
      steps: [
        {
          type: 'instruction',
          title: 'What is an Inference?',
          body: `An inference is a conclusion ${tone.you} draw from clues in the text.\n\nThe text doesn't say it directly — ${tone.you} figure it out.\n\nFormula:\nInference = Text Clue + Your Knowledge\n\nExample:\nText: "Maria put on her coat and grabbed her umbrella."\nInference: It was probably raining or going to rain.\nThe text doesn't say "rain" — ${tone.you} inferred it.`,
          tip: 'Ask yourself: "What do I know that helps me understand this?"',
        },
        {
          type: 'exercise',
          title: 'Make an Inference',
          body: '"James walked into the room and everyone stopped talking. He looked at the floor."\n\nWhat can we infer?',
          prompt: 'What does James probably feel?',
          options: ['excited and confident', 'embarrassed or uncomfortable', 'happy and proud'],
          correctIndex: 1,
          tip: 'Walking in to silence + looking at the floor = social discomfort. Text clues + human experience = inference.',
        },
        {
          type: 'exercise',
          title: 'Author\'s Purpose Inference',
          body: '"The charity raises £2 million each year, yet thousands still go without support."',
          prompt: 'What is the author implying about the situation?',
          options: ['The charity is doing enough', 'More funding or action is still needed', 'The numbers are made up'],
          correctIndex: 1,
          tip: '"Yet" signals a contrast. The author implies the money isn\'t enough to solve the problem.',
        },
        {
          type: 'practice',
          title: 'Inference Practice Strategy',
          body: `Use the T-I-P strategy:\n• T — Text clue (quote directly from text)\n• I — Inference (what you conclude)\n• P — Personal knowledge (what you know that helped)\n\nPractice with this sentence:\n"Despite three failed attempts, she returned to the training ground every morning."\n\nWrite your T, I, and P.`,
          tip: 'This strategy works for exam answers too — quote the text, state the inference, explain your reasoning.',
        },
        {
          type: 'check',
          title: `${tone.praise} Inference Lesson Complete`,
          body: 'Inference is a skill that improves with practice. Try the T-I-P strategy every time you read something new.',
        },
      ],
      completionMessage: `${tone.praise} Inference lesson complete. Keep asking "what can I work out from this?"`,
      nextSuggestion: 'text-structure',
    },

    // ── NB-L0 remaining ───────────────────────────────────────────────────────
    'letter-matching-game': {
      title: 'Letter Matching Game',
      objective: 'Recognise and match uppercase and lowercase letters instantly',
      whyItMatters: 'Letter recognition is the entry point to reading. Studies show that children who rapidly name letters learn to read faster. Pairing uppercase and lowercase forms builds a complete mental model of each letter.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Two Shapes, One Letter`,
          body: `Every letter has two forms: UPPERCASE (capital) and lowercase (small).\n\nA → a    B → b    C → c    D → d    E → e\nF → f    G → g    H → h    I → i    J → j\nK → k    L → l    M → m    N → n    O → o\nP → p    Q → q    R → r    S → s    T → t\n\n${tone.you} use both forms every time ${tone.you} read.`,
          tip: 'Look for letters on signs, cereal boxes, and everywhere around you. Real-world spotting speeds up recognition.',
        },
        {
          type: 'exercise',
          title: 'Match the Letter',
          body: 'Uppercase G and lowercase g are the same letter.',
          prompt: 'Which lowercase letter matches uppercase G?',
          options: ['q', 'g', 'p'],
          correctIndex: 1,
          tip: `${tone.praise} G → g. The lowercase g has a curved tail. Look for that shape.`,
        },
        {
          type: 'exercise',
          title: 'Tricky Pairs',
          body: 'Some letters look very similar — b, d, p, q. Take your time.',
          prompt: 'Which uppercase letter matches lowercase b?',
          options: ['D', 'P', 'B'],
          correctIndex: 2,
          tip: 'B → b. Uppercase B has two bumps on the right side. Lowercase b has one bump, also on the right.',
        },
        {
          type: 'practice',
          title: 'Letter Hunt',
          body: `Say each pair aloud, then add a word:\n\nA-a → apple    B-b → ball    C-c → cat\nD-d → dog      E-e → egg     F-f → fish\nG-g → goat     H-h → hat     I-i → insect\nJ-j → jump     K-k → kite    L-l → lamp\n\nFor each pair: letter name → sound → example word.`,
          tip: `${tone.effort}: repeat this once a day for a week. Speed comes from repetition.`,
        },
        {
          type: 'check',
          title: `${tone.praise} Letter Matching Complete`,
          body: 'Uppercase to lowercase — matched. Practise spotting letter pairs in everything you read today.',
        },
      ],
      completionMessage: `${tone.praise} Letter Matching lesson complete.`,
      nextSuggestion: 'phonemic-awareness-1',
    },

    'phonemic-awareness-1': {
      title: 'Hearing Sounds in Words',
      objective: 'Identify, segment, and blend individual phonemes in spoken words',
      whyItMatters: 'Phonemic awareness — the ability to hear and manipulate sounds — is the strongest single predictor of reading success. The National Reading Panel found it is more predictive than IQ or vocabulary.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} What is a Phoneme?`,
          body: `A phoneme is the smallest unit of SOUND in a word.\n\n"cat" → 3 phonemes: /k/ /a/ /t/\n"ship" → 3 phonemes: /sh/ /i/ /p/\n"blend" → 5 phonemes: /b/ /l/ /e/ /n/ /d/\n\nKey: phonemes are SOUNDS, not letters. "sh" is two letters but ONE sound.`,
          tip: 'Hold up one finger for each sound as you say a word. This is called finger-counting phonemes.',
        },
        {
          type: 'exercise',
          title: 'Count the Sounds',
          body: 'Count the phonemes — the individual sounds — not the letters.',
          prompt: 'How many sounds are in the word "fish"?',
          options: ['4 sounds: f-i-s-h', '3 sounds: /f/ /i/ /sh/', '2 sounds: fi-sh'],
          correctIndex: 1,
          tip: '"fish" = /f/ /i/ /sh/ — 3 sounds. The letters "sh" together make ONE sound.',
        },
        {
          type: 'exercise',
          title: 'Blend the Sounds',
          body: 'Push these sounds together to make a word.',
          prompt: 'What word do the sounds /d/ /o/ /g/ make?',
          options: ['dig', 'dog', 'dot'],
          correctIndex: 1,
          tip: '/d/ + /o/ + /g/ = "dog". Blend them quickly, like glue pulling them together.',
        },
        {
          type: 'practice',
          title: 'Segment and Blend',
          body: `Tap out each sound on your fingers, then blend back:\n\nsun   → /s/ /u/ /n/   → "sun"\nchip  → /ch/ /i/ /p/  → "chip"\nflat  → /f/ /l/ /a/ /t/ → "flat"\nnight → /n/ /igh/ /t/ → "night"\n\nFor each word: say it whole → tap the sounds → blend it back.`,
          tip: 'Segmenting and blending is the engine of reading. Do this every day.',
        },
        {
          type: 'check',
          title: `${tone.praise} Phonemic Awareness Complete`,
          body: 'You can now hear, count, and blend individual sounds. This skill directly drives reading accuracy.',
        },
      ],
      completionMessage: `${tone.praise} Phonemic Awareness lesson complete.`,
      nextSuggestion: 'rhyme-time',
    },

    'rhyme-time': {
      title: 'Rhyme Time',
      objective: 'Recognise and produce rhyming words to build phonological awareness',
      whyItMatters: 'Rhyme recognition trains the brain to notice sound patterns — essential preparation for phonics. Research links early rhyme awareness to reading success across all age groups.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} What Makes Words Rhyme?`,
          body: `Rhyming words share the SAME ending sound.\n\ncat — hat — mat — rat  (all end in /at/)\nfun — sun — run — bun  (all end in /un/)\nnight — light — right    (all end in /ight/)\n\nThe beginning can be different — only the ending sound matters.`,
          tip: 'Clap on the ending sound to hear the rhyme pattern clearly.',
        },
        {
          type: 'exercise',
          title: 'Find the Rhyme',
          body: 'Which word rhymes with "cake"?',
          prompt: 'Which word ends with the same sound as "cake"?',
          options: ['cat', 'lake', 'cup'],
          correctIndex: 1,
          tip: `${tone.praise} "lake" rhymes with "cake" — both end in the /ake/ sound.`,
        },
        {
          type: 'exercise',
          title: 'Odd One Out',
          body: 'Three of these rhyme — one does not.',
          prompt: 'Which word does NOT rhyme: sing, ring, king, run?',
          options: ['sing', 'run', 'ring'],
          correctIndex: 1,
          tip: '"run" is the odd one out. Sing, ring, king all end in /ing/. Run ends in /un/.',
        },
        {
          type: 'practice',
          title: 'Rhyme Chains',
          body: `Build a rhyme chain — add as many rhymes as you can:\n\n"bed" → red, fed, led, said, head, bread...\n"play" → day, say, way, stay, grey, weigh...\n"blue" → true, flew, drew, shoe, through...\n\nSay each chain aloud. Silly rhymes count!`,
          tip: 'The longer your rhyme chain, the stronger your phonological awareness.',
        },
        {
          type: 'check',
          title: `${tone.praise} Rhyme Time Done`,
          body: 'Recognising rhymes shows you can hear sound patterns — the first step to reading by pattern.',
        },
      ],
      completionMessage: `${tone.praise} Rhyme Time complete. Keep noticing rhymes in songs and poetry.`,
      nextSuggestion: 'print-concepts',
    },

    'print-concepts': {
      title: 'How Books Work',
      objective: 'Understand print directionality, word spacing, and basic punctuation',
      whyItMatters: 'Print concept knowledge — left-to-right direction, spaces between words, punctuation — is foundational literacy. Research shows early print awareness strongly predicts reading achievement.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} The Rules of the Page`,
          body: `In English, we always read:\n• Left → Right across the page\n• Top → Bottom down the page\n• Return to the LEFT at the end of each line\n\nSpaces between words show where one word ends and the next begins.`,
          tip: 'Run your finger under each line as you read — this trains your eyes and brain to work together.',
        },
        {
          type: 'exercise',
          title: 'Counting Words',
          body: 'Spaces separate words. Count them to count words.',
          prompt: 'How many words are in: "The big dog ran fast"?',
          options: ['3 words', '5 words', '6 words'],
          correctIndex: 1,
          tip: `${tone.praise} 5 words: "The" / "big" / "dog" / "ran" / "fast". Count spaces, then add 1.`,
        },
        {
          type: 'exercise',
          title: 'Punctuation Clues',
          body: 'Punctuation tells us how to read. Full stops (.) mean pause. Question marks (?) mean a question.',
          prompt: 'What does a question mark (?) tell a reader?',
          options: ['Pause and stop reading', 'The sentence is a question — raise your voice at the end', 'Read faster'],
          correctIndex: 1,
          tip: 'Question marks make your voice go UP at the end. Full stops make it go DOWN.',
        },
        {
          type: 'practice',
          title: 'Explore a Real Page',
          body: `Pick up any book, magazine, or package. Find:\n\n✓ Where the first word is (top-left)\n✓ Spaces between every word\n✓ A full stop at the end of a sentence\n✓ A capital letter starting a sentence\n✓ A question mark or exclamation mark\n\nPoint to each one as ${tone.you} find it.`,
          tip: 'Print is everywhere — bus tickets, menus, labels. Each one uses the same rules.',
        },
        {
          type: 'check',
          title: `${tone.praise} Print Concepts Complete`,
          body: 'Direction, spaces, punctuation — the three rules of the page. You know how reading is organised.',
        },
      ],
      completionMessage: `${tone.praise} Print Concepts lesson complete.`,
      nextSuggestion: 'cvc-words-1',
    },

    // ── NB-L1: CVC Decoding ───────────────────────────────────────────────────
    'cvc-words-2': {
      title: 'CVC Words: Short I',
      objective: 'Decode CVC words using the short I vowel sound',
      whyItMatters: 'Short vowels are the backbone of beginning reading. Mastering each one systematically — as in Orton-Gillingham and Wilson Reading — gives learners a reliable toolkit for decoding hundreds of words.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Short I — The "itch" Sound`,
          body: `Short I sounds like the "i" in "itch" or "insect".\n\nShort I CVC words:\nbit — fit — hit — kit — sit — wit\nbin — fin — pin — tin — win\nbig — dig — fig — pig — wig\n\nTo feel the sound: put your hand on your throat and say "it". Your voice vibrates straight away.`,
          tip: 'Your chin drops slightly when you say short I. Try "itch" and notice the feeling.',
        },
        {
          type: 'exercise',
          title: 'Blend Short I',
          body: 'Blend these sounds into a word.',
          prompt: 'What word do /p/ /i/ /n/ make?',
          options: ['pan', 'pin', 'pen'],
          correctIndex: 1,
          tip: '/p/ + /i/ + /n/ = "pin". The middle sound is short I, like "itch".',
        },
        {
          type: 'exercise',
          title: 'Short I or Not?',
          body: 'Listen for the vowel in the middle of each word.',
          prompt: 'Which word has the short I sound?',
          options: ['bat', 'bit', 'but'],
          correctIndex: 1,
          tip: '"bit" — /b/ /i/ /t/. The short I, like "itch". "bat" = short A. "but" = short U.',
        },
        {
          type: 'practice',
          title: 'Read and Sort',
          body: `Read each word. Sort it: short A (/a/) or short I (/i/):\n\ncat   bit   hit   hat   sit   sat   pit   pat   fig   bag\n\nShort A words: ___________________\nShort I words: ___________________\n\nThen use each short I word in a sentence.`,
          tip: 'Sorting by vowel sound trains your ear and eye together.',
        },
        {
          type: 'check',
          title: `${tone.praise} Short I Complete`,
          body: 'You now know two short vowels — A and I. Each one unlocks a family of words.',
        },
      ],
      completionMessage: `${tone.praise} CVC Short I lesson complete.`,
      nextSuggestion: 'cvc-blending',
    },

    'cvc-blending': {
      title: 'Blending CVC Words',
      objective: 'Fluently blend CVC words with all five short vowels',
      whyItMatters: 'Blending is the mechanical act of reading. Research shows that children who cannot blend sounds struggle significantly with decoding. This skill directly drives word reading accuracy and speed.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} All Five Short Vowels`,
          body: `The five short vowels:\nA — /a/ — apple   (cat, bat, map)\nE — /e/ — egg      (bed, men, set)\nI — /i/ — itch     (bit, pin, fig)\nO — /o/ — octopus  (hop, cot, log)\nU — /u/ — umbrella (cup, run, bug)\n\nBlending rule: say each sound quickly and run them together like pulling a zip.`,
          tip: 'Memorise AEIOU with their short sounds. This is one of the most useful things in reading.',
        },
        {
          type: 'exercise',
          title: 'Blend It',
          body: 'Blend these sounds into a word.',
          prompt: 'What word do /h/ /o/ /t/ make?',
          options: ['hat', 'hit', 'hot'],
          correctIndex: 2,
          tip: '/h/ + /o/ + /t/ = "hot". Short O, like "octopus".',
        },
        {
          type: 'exercise',
          title: 'Find the Short Vowel',
          body: 'The vowel in the middle tells you how to say the word.',
          prompt: 'Which word has the short U sound (like "umbrella")?',
          options: ['hop', 'hip', 'hug'],
          correctIndex: 2,
          tip: '"hug" — /h/ /u/ /g/. Short U sounds like the groan "uh".',
        },
        {
          type: 'practice',
          title: 'Rapid Blending Drill',
          body: `Read each word as fast as you can. Say it twice:\n\nRound 1: cat   bed   pin   hot   cup\nRound 2: bat   red   sit   dog   run\nRound 3: map   ten   big   fog   bun\n\nTarget: all 15 words in under 30 seconds.`,
          tip: 'Slow is smooth, smooth is fast. Speed comes from repetition, not rushing.',
        },
        {
          type: 'check',
          title: `${tone.praise} Blending Complete`,
          body: 'You blended CVC words with all five short vowels. You are reading.',
        },
      ],
      completionMessage: `${tone.praise} CVC Blending complete.`,
      nextSuggestion: 'sight-words-1',
    },

    'sight-words-1': {
      title: 'Sight Words: Set 1',
      objective: 'Read the 12 most common high-frequency words automatically by sight',
      whyItMatters: 'The 100 most common words make up 50% of all text. Many cannot be decoded phonetically. Research shows automatic recognition of these words frees cognitive resources for comprehension.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Words You See Everywhere`,
          body: `These 12 words appear in almost every sentence ever written:\n\nthe   a   I   is   it   in\nmy   and   at   he   she   we\n\nGoal: recognise them INSTANTLY — without sounding out.`,
          tip: 'Make flashcards. Flip through them once a day. Speed is what matters, not study time.',
        },
        {
          type: 'exercise',
          title: 'Instant Recognition',
          body: '"She is my friend." Which word is most often learned as a whole-word picture?',
          prompt: 'Which word here is typically a sight word?',
          options: ['friend', 'she', 'my'],
          correctIndex: 1,
          tip: '"she" — the sh digraph and final e make it tricky to decode. Easiest to learn as a whole picture.',
        },
        {
          type: 'exercise',
          title: 'Fill the Gap',
          body: 'Choose the correct sight word.',
          prompt: '"_____ cat sat on the mat." — Which word fits?',
          options: ['My', 'In', 'He'],
          correctIndex: 0,
          tip: '"My cat sat on the mat." My = possessive. You use it thousands of times while reading.',
        },
        {
          type: 'practice',
          title: 'Sight Word Reading',
          body: `Read each sentence aloud. Spot every sight word:\n\n1. "She and I are at the shop."\n2. "He is in my class."\n3. "It is a big cat."\n4. "We sat at the mat."\n5. "My dog and her dog are the same."\n\nCount sight words per sentence.`,
          tip: 'Zero hesitation on sight words is the goal. Pause only on words you are decoding for the first time.',
        },
        {
          type: 'check',
          title: `${tone.praise} Sight Words Set 1 Done`,
          body: '12 sight words recognised. These will appear on every page you ever read.',
        },
      ],
      completionMessage: `${tone.praise} Sight Words Set 1 complete.`,
      nextSuggestion: 'decodable-sentences-1',
    },

    'decodable-sentences-1': {
      title: 'Reading Simple Sentences',
      objective: 'Read short decodable sentences combining CVC words and sight words',
      whyItMatters: 'Reading connected text — even a simple sentence — is qualitatively different from reading single words. Research shows that decodable sentence practice builds fluency faster than word lists alone.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Sentences Tell a Complete Idea`,
          body: `A sentence:\n• Starts with a CAPITAL letter\n• Ends with a full stop (.) or question mark (?)\n• Has a subject (who/what) AND a verb (action)\n\n"The cat sat on the mat." → subject: cat, verb: sat\n\nAs ${tone.you} read, preview the full sentence before speaking — your eyes lead your voice.`,
          tip: 'Look at the whole sentence before reading it aloud. This trains efficient eye movement.',
        },
        {
          type: 'exercise',
          title: 'Read and Understand',
          body: 'Read this: "The big dog ran to the man."',
          prompt: 'Who ran to the man?',
          options: ['A cat', 'The big dog', 'The man ran somewhere else'],
          correctIndex: 1,
          tip: `${tone.praise} The dog ran to the man. You read AND understood — that is reading comprehension.`,
        },
        {
          type: 'exercise',
          title: 'Sentence or Fragment?',
          body: 'A complete sentence needs a subject AND a verb.',
          prompt: 'Which of these is a complete sentence?',
          options: ['The red bag.', 'She ran fast.', 'A big dog in the'],
          correctIndex: 1,
          tip: '"She ran fast." has subject (she) + verb (ran). The others are incomplete fragments.',
        },
        {
          type: 'practice',
          title: 'Read Aloud — 5 Sentences',
          body: `Read each sentence clearly at a natural pace:\n\n1. "The cat sat on my mat."\n2. "It is a big red bin."\n3. "She ran in the sun."\n4. "He and I sat at the desk."\n5. "My dog bit the tin lid."\n\nRead each one twice: first carefully, then smoothly.`,
          tip: 'If you get stuck, sound out letter-by-letter, then blend. No guessing.',
        },
        {
          type: 'check',
          title: `${tone.praise} Reading Sentences Complete`,
          body: 'You read decodable sentences — each one a complete, meaningful thought.',
        },
      ],
      completionMessage: `${tone.praise} Decodable Sentences lesson complete.`,
      nextSuggestion: 'blends-initial',
    },

    // ── NB-L2: Consonant Blends ───────────────────────────────────────────────
    'blends-initial': {
      title: 'Initial Blends: bl, cr, st, pr, fl',
      objective: 'Decode words that begin with two-consonant blends',
      whyItMatters: 'Around 30% of English words start with a consonant cluster. Mastering initial blends unlocks thousands of new words for beginning readers.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Two Sounds at the Start`,
          body: `A consonant blend has two consonants at the start — you hear BOTH sounds:\n\nbl → black, blue, blank, blend\ncr → crab, crop, crack, crisp\nst → stop, step, stick, sting\npr → print, press, proud, pram\nfl → flat, flock, fling, flood\n\nKey: say BOTH sounds quickly, then add the vowel.`,
          tip: 'Hold your hand in front of your mouth. Say "fl" — you feel two quick air puffs.',
        },
        {
          type: 'exercise',
          title: 'Identify the Blend',
          body: 'Which blend starts the word "step"?',
          prompt: 'The word "step" begins with:',
          options: ['sp-', 'st-', 'sk-'],
          correctIndex: 1,
          tip: '/s/ + /t/ = "st". The word is /st/ /e/ /p/ = "step".',
        },
        {
          type: 'exercise',
          title: 'Decode a Blend Word',
          body: 'Blend all sounds together.',
          prompt: 'What word do /cr/ /a/ /b/ make?',
          options: ['cab', 'crab', 'grab'],
          correctIndex: 1,
          tip: '/cr/ + /a/ + /b/ = "crab". You hear both /k/ and /r/ at the start.',
        },
        {
          type: 'practice',
          title: 'Blend Word Reading',
          body: `Read each word aloud — say both sounds in the blend:\n\nblend  crack  stop  press  flag\nblind  crest  stack  print  flew\nbless  crept  stink  pram   flap\n\nNow use 3 of these words in your own sentences.`,
          tip: 'If the blend trips you up, say each sound separately first, then run them together.',
        },
        {
          type: 'check',
          title: `${tone.praise} Initial Blends Complete`,
          body: 'bl, cr, st, pr, fl — five blends that open up a huge section of the English word bank.',
        },
      ],
      completionMessage: `${tone.praise} Initial Blends lesson complete.`,
      nextSuggestion: 'blends-final',
    },

    'blends-final': {
      title: 'Final Blends: nd, mp, sk, st, lt',
      objective: 'Decode words that end with two-consonant blends',
      whyItMatters: 'Final blends are often harder to hear than initial blends because they come right before silence. Explicit instruction improves both reading accuracy and spelling.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Two Sounds at the End`,
          body: `Final blends appear at the END of words. Say both consonant sounds:\n\n-nd: hand, bend, find, bond, fund\n-mp: camp, lamp, jump, dump, stomp\n-sk: desk, task, mask, risk, dusk\n-st: best, fist, cost, dust, mast\n-lt: melt, felt, belt, jolt, salt\n\nBoth consonants make their own sound — neither is silent.`,
          tip: 'Tap two fingers together when you say the final blend — one tap per sound.',
        },
        {
          type: 'exercise',
          title: 'Final Blend Listening',
          body: 'Listen to the end of the word "lamp".',
          prompt: 'What final blend does "lamp" end with?',
          options: ['-nd', '-mp', '-lt'],
          correctIndex: 1,
          tip: '"lamp" ends in /m/ /p/ = -mp. You hear both sounds clearly at the end.',
        },
        {
          type: 'exercise',
          title: 'Decode It',
          body: 'Blend all sounds to read the complete word.',
          prompt: 'What word do /d/ /e/ /sk/ make?',
          options: ['disk', 'deck', 'desk'],
          correctIndex: 2,
          tip: '/d/ + /e/ + /sk/ = "desk". The final -sk: you say /s/ then /k/ in quick succession.',
        },
        {
          type: 'practice',
          title: 'Final Blend Sorting',
          body: `Sort these words by their final blend:\n\nbend  lamp  disk  best  melt  hand  stomp  task  fist  salt\n\n-nd | -mp | -sk | -st | -lt\n____|_____|_____|_____|____\n\nRead all 10 words aloud twice.`,
          tip: 'Sorting reinforces pattern recognition. Your brain starts to see word families automatically.',
        },
        {
          type: 'check',
          title: `${tone.praise} Final Blends Complete`,
          body: 'nd, mp, sk, st, lt — five final blend patterns in your toolkit.',
        },
      ],
      completionMessage: `${tone.praise} Final Blends lesson complete.`,
      nextSuggestion: 'digraphs-1',
    },

    'digraphs-1': {
      title: 'Digraphs: sh, ch, th',
      objective: 'Decode words containing sh, ch, and th digraphs',
      whyItMatters: 'Digraphs — two letters making one sound — appear in hundreds of everyday words. The "th" digraph alone appears in the most common words in English: the, this, that, they, them, with.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Two Letters, One Sound`,
          body: `A digraph is two letters that fuse into ONE new sound:\n\nsh → /sh/ — ship, shop, fish, rush, wish\nch → /ch/ — chin, chop, much, rich, lunch\nth → /th/ — this, that, them, with, then (voiced)\n        → think, thick, three, both, math (unvoiced)\n\nFeel the difference for "th":\n• "this" — place your tongue on your teeth and hum → vibrates (voiced)\n• "think" — same position but no hum → no vibration (unvoiced)`,
          tip: 'Put two fingers on your throat. Say "this" then "think". Feel voiced vs unvoiced.',
        },
        {
          type: 'exercise',
          title: 'Spot the Digraph',
          body: 'Find the digraph in "chop".',
          prompt: 'What digraph starts "chop"?',
          options: ['sh', 'ch', 'th'],
          correctIndex: 1,
          tip: '"chop" begins with ch → /ch/. The c and h together make one new sound.',
        },
        {
          type: 'exercise',
          title: 'Decode with Digraphs',
          body: 'Use your digraph knowledge to decode this word.',
          prompt: 'What word do /th/ /i/ /n/ /k/ make?',
          options: ['sink', 'think', 'drink'],
          correctIndex: 1,
          tip: '/th/ + /i/ + /n/ + /k/ = "think". The unvoiced th — no throat vibration.',
        },
        {
          type: 'practice',
          title: 'Digraph Sort',
          body: `Read each word. Write it in the correct column:\n\nship  chin  this  wish  much  them  shut  chess  three  fish  chick  with\n\nsh words: ___________\nch words: ___________\nth words: ___________`,
          tip: 'When you see sh, ch, or th — treat those two letters as ONE unit. Never say them separately.',
        },
        {
          type: 'check',
          title: `${tone.praise} Digraphs Complete`,
          body: 'sh, ch, th — three powerful digraphs that unlock thousands of English words.',
        },
      ],
      completionMessage: `${tone.praise} Digraphs lesson complete.`,
      nextSuggestion: 'sight-words-2',
    },

    'sight-words-2': {
      title: 'Sight Words: Set 2',
      objective: 'Recognise a second set of high-frequency words automatically',
      whyItMatters: 'The first 300 high-frequency words account for 65% of all written text. Building this sight word bank removes decoding bottlenecks and releases resources for comprehension.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} More Essential Words`,
          body: `These 10 words appear in almost every paragraph:\n\nthey   was   from   have   said\ndo     all   her    him    with\n\nMany are phonetically irregular:\n• "was" → sounds like /wuz/, not /was/\n• "said" → sounds like /sed/, not /sayd/\n\nLearn them as whole-word pictures — the spelling and the sound together.`,
          tip: 'Write each word in large letters. Trace it three times. Say it aloud. This engages visual + motor memory.',
        },
        {
          type: 'exercise',
          title: 'Irregular Pronunciation',
          body: '"said" looks like it should rhyme with "maid" but it doesn\'t.',
          prompt: 'How is "said" actually pronounced?',
          options: ['/sayd/ (like "maid")', '/sed/ (like "head")', '/sahd/'],
          correctIndex: 1,
          tip: '"Said" = /sed/. An irregular sight word. Memorise it as a picture-sound pair.',
        },
        {
          type: 'exercise',
          title: 'Sentence Completion',
          body: 'Choose the correct sight word.',
          prompt: '"She _____ she was going to the park." — Which word fits?',
          options: ['from', 'said', 'with'],
          correctIndex: 1,
          tip: '"She said she was going to the park." "said" = past tense of "say".',
        },
        {
          type: 'practice',
          title: 'Sight Word Sentences',
          body: `Read aloud. Find all sight words (from both sets):\n\n1. "They said it was from her."\n2. "Do all of them have it?"\n3. "She was with him from the start."\n4. "He said they do it all the time."\n5. "Have they said what was wrong?"\n\nCount sight words per sentence.`,
          tip: 'Aim for instant recognition — no sounding out. Sight words should feel automatic.',
        },
        {
          type: 'check',
          title: `${tone.praise} Sight Words Set 2 Done`,
          body: 'You now know 22 of the most common words in all English text. Keep building this bank.',
        },
      ],
      completionMessage: `${tone.praise} Sight Words Set 2 complete.`,
      nextSuggestion: 'sentence-fluency-1',
    },

    'sentence-fluency-1': {
      title: 'Sentence Fluency Practice',
      objective: 'Read sentences smoothly, accurately, and with appropriate pacing and expression',
      whyItMatters: 'Fluency bridges decoding and comprehension. The National Reading Panel identified it as one of five essential reading skills. When readers can process sentences without halting, their minds are free to focus on meaning.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Three Parts of Fluency`,
          body: `Fluency = Accuracy + Rate + Expression\n\n• Accuracy — reading words correctly\n• Rate — reading at a natural speaking pace\n• Expression — pausing at commas, rising for questions, stressing key words\n\nFluent reading sounds like natural speech.`,
          tip: 'Record yourself and play it back. Does it sound like you\'re talking? If not, try again.',
        },
        {
          type: 'exercise',
          title: 'Punctuation Guides Expression',
          body: '"The dog ran. Did the cat follow? Yes, they both ran fast!"',
          prompt: 'Which sentence should be read with a rising voice at the end?',
          options: ['The dog ran.', 'Did the cat follow?', 'They both ran fast!'],
          correctIndex: 1,
          tip: `${tone.praise} Questions rise at the end. Statements fall. Exclamations have energy. Punctuation is your musical score.`,
        },
        {
          type: 'practice',
          title: 'Read-Aloud with Pacing',
          body: `Read this passage ALOUD, twice:\n\n"The man had a plan. He went to the shop and got milk, eggs, and bread. On his way back, he met his friend Beth. They had a chat on the bench. Then he went home, made lunch, and sat in the sun."\n\nFirst read: focus on accuracy.\nSecond read: tell the story to someone.`,
          tip: 'Slow down at commas. Pause fully at full stops. These marks are reading instructions.',
        },
        {
          type: 'practice',
          title: 'Phrase Reading',
          body: `Good readers read in phrases, not word-by-word. Read each chunk as ONE unit:\n\n"the big dog" / "ran to the park" / "and barked"\n"she was happy" / "because of the rain" / "that fell"\n"he said nothing" / "for a long time" / "after that"\n\nGroup the words together without pausing between them.`,
          tip: 'Phrase reading is a sign of developing fluency. It comes naturally with practice.',
        },
        {
          type: 'check',
          title: `${tone.praise} Sentence Fluency Complete`,
          body: 'Accuracy, rate, expression — three fluency elements practised. Fluency improves every time you read aloud.',
        },
      ],
      completionMessage: `${tone.praise} Sentence Fluency lesson complete.`,
      nextSuggestion: 'vowel-teams-1',
    },

    // ── NB-L3: Vowel Teams ────────────────────────────────────────────────────
    'vowel-teams-1': {
      title: 'Vowel Teams: ea, ee',
      objective: 'Decode words using the ea and ee vowel digraphs',
      whyItMatters: 'Vowel teams account for a large proportion of English words. Understanding that two vowels together often produce the long sound of the first vowel is a reliable decoding strategy.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Two Vowels, One Long Sound`,
          body: `When two vowels appear together, they usually say the long sound of the first vowel.\n\nee → long E /ee/\nfeel  see  tree  keep  sleep  three  green  heel\n\nea → usually long E /ee/ too\neat  each  team  clean  dream  read  beach  leaf\n\n(ea sometimes says short E: head, bread, dead — but long E is most common.)`,
          tip: '"When two vowels go walking, the first one does the talking." This works perfectly for ee and usually for ea.',
        },
        {
          type: 'exercise',
          title: 'Decode the Vowel Team',
          body: 'What sound do the letters "ee" make?',
          prompt: 'Which word has the long E sound made by "ee"?',
          options: ['bed', 'tree', 'ten'],
          correctIndex: 1,
          tip: `${tone.praise} "tree" — the "ee" says long E. You hear the vowel name /ee/.`,
        },
        {
          type: 'exercise',
          title: 'ea or ee?',
          body: 'Both make the long E sound — the spelling differs.',
          prompt: 'Which vowel team is in the word "dream"?',
          options: ['ee', 'ea', 'Neither'],
          correctIndex: 1,
          tip: '"dream" uses ea. "dream", "cream", "steam" — all ea. "green", "tree", "fee" — all ee.',
        },
        {
          type: 'practice',
          title: 'Vowel Team Sort',
          body: `Sort into columns:\n\ndream  tree  beach  sleep  leaf  feet  clean  seed  read  feel\n\nea words (long E): _____________\nee words (long E): _____________\n\nRead all 10 aloud. Notice: they all sound like /ee/ — the spelling is what differs.`,
          tip: 'Correct spelling comes from reading these words many times in context.',
        },
        {
          type: 'check',
          title: `${tone.praise} ea and ee Complete`,
          body: 'Two vowel teams decoded — both making the long E sound. A very common sound in English.',
        },
      ],
      completionMessage: `${tone.praise} Vowel Teams ea/ee lesson complete.`,
      nextSuggestion: 'vowel-teams-2',
    },

    'vowel-teams-2': {
      title: 'Vowel Teams: ai, oa',
      objective: 'Decode words using the ai and oa vowel teams',
      whyItMatters: 'ai and oa represent long A and long O sounds and appear in hundreds of common words. Systematic vowel team instruction is a core component of the Science of Reading framework.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Long A and Long O Teams`,
          body: `ai → long A /ay/ (say the letter name "A")\nrain  train  maid  tail  sail  wait  chain  paint  snail\n\noa → long O /oh/\nboat  coat  road  load  toad  foam  toast  groan  goat\n\nRule: the first vowel says its name, the second is silent.\n"ai" → A speaks, I is silent.\n"oa" → O speaks, A is silent.`,
          tip: '"When two vowels go walking, the first one does the talking." ai, oa both follow this rule.',
        },
        {
          type: 'exercise',
          title: 'ai Word Reading',
          body: 'The "ai" team says long A.',
          prompt: 'What does "rain" rhyme with?',
          options: ['ran', 'train', 'rain (itself)'],
          correctIndex: 1,
          tip: '"rain" rhymes with "train", "chain", "pain" — all end in the -ain pattern.',
        },
        {
          type: 'exercise',
          title: 'oa Word Reading',
          body: 'Decode this word using the oa vowel team.',
          prompt: 'What does the word "t-oa-st" say?',
          options: ['tost', 'toast', 'cost'],
          correctIndex: 1,
          tip: 'oa = long O. t + (long O) + st = "toast".',
        },
        {
          type: 'practice',
          title: 'Pattern Reading and Word Families',
          body: `Read each word aloud:\n\nrain  coat  wait  road  sail  toast  tail  groan  maid  foam\n\nThen build word families by changing the first letter:\nai family: rain → _____, _____, _____\noa family: coat → _____, _____, _____`,
          tip: 'Learn one word in a family, know dozens. Word patterns are reading superpowers.',
        },
        {
          type: 'check',
          title: `${tone.praise} ai and oa Complete`,
          body: 'Long A with ai. Long O with oa. Two more vowel teams in your reading toolkit.',
        },
      ],
      completionMessage: `${tone.praise} Vowel Teams ai/oa lesson complete.`,
      nextSuggestion: 'silent-e',
    },

    'silent-e': {
      title: 'Silent-E Magic',
      objective: 'Decode vowel-consonant-e words where the final e makes the vowel long',
      whyItMatters: 'The CVCe pattern generates hundreds of common words. It is a core component of every major structured literacy programme including Orton-Gillingham and the Science of Reading.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} The E That Changes Everything`,
          body: `When a word ends in vowel-consonant-E, the final E is silent but makes the middle vowel say its long sound (its letter name).\n\nShort → Long:\ncap → cape    kit → kite    hop → hope    cub → cube\nhat → hate    pin → pine    not → note    cut → cute\n\nThe E is silent but powerful — it reaches back and changes the middle vowel.`,
          tip: '"Silent E is a magic E — it reaches back and changes the vowel." Make this your mantra.',
        },
        {
          type: 'exercise',
          title: 'Add the Magic E',
          body: 'Adding a silent E to "pin" changes it.',
          prompt: 'What does "pin" become when you add a silent E?',
          options: ['pine', 'pane', 'mine'],
          correctIndex: 0,
          tip: 'pin + e = pine. Short I becomes long I. /p/ /ī/ /n/. The I now says its name.',
        },
        {
          type: 'exercise',
          title: 'Silent E Decoding',
          body: 'Decode this CVCe word step by step.',
          prompt: 'What is the word "h-o-m-e"?',
          options: ['hum', 'him', 'home'],
          correctIndex: 2,
          tip: 'h + (long O) + m + silent e = "home". O says its name because of the silent E.',
        },
        {
          type: 'practice',
          title: 'Short vs Long Pairs',
          body: `Read each pair and hear how E changes the vowel:\n\ncap / cape    kit / kite    hop / hope    cub / cube\nrat / rate    dim / dime    rod / rode    tub / tube\n\nFor each pair: say the short word, say the long word, say: "The E makes the vowel say its name."`,
          tip: 'This pattern is also called VCe (Vowel-Consonant-e) in phonics programmes.',
        },
        {
          type: 'check',
          title: `${tone.praise} Silent E Complete`,
          body: 'Magic E mastered. cap/cape, kit/kite, hop/hope — one pattern, hundreds of words.',
        },
      ],
      completionMessage: `${tone.praise} Silent-E lesson complete.`,
      nextSuggestion: 'r-controlled',
    },

    'r-controlled': {
      title: 'R-Controlled Vowels',
      objective: 'Decode words where a vowel is modified by a following R',
      whyItMatters: 'Words like "car", "her", "bird", "for", "fur" are among the most common in English. R-controlled vowels cannot be decoded by standard short or long vowel rules — explicit instruction is required.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} The Bossy R`,
          body: `When a vowel is followed by R, the R changes its sound:\n\nar → /ar/ — car, jar, farm, park, start\ner → /er/ — her, fern, nerve, stern\nir → /er/ — sir, bird, third, skirt\nor → /or/ — for, corn, sport, horn\nur → /er/ — fur, turn, burn, purple\n\nImportant: er, ir, and ur all make the SAME /er/ sound.`,
          tip: 'ar sounds like you\'re saying "R". or sounds like "oar". er/ir/ur all sound like "her".',
        },
        {
          type: 'exercise',
          title: 'Bossy R Sound',
          body: 'The R changes the vowel in "corn".',
          prompt: 'Which sound does "or" make in the word "corn"?',
          options: ['/o/ as in hot', '/or/ as in "or"', '/ur/ as in "her"'],
          correctIndex: 1,
          tip: '"corn" — the "or" makes the /or/ sound. It rhymes with "born", "horn", "torn".',
        },
        {
          type: 'exercise',
          title: 'Same Sound, Different Spelling',
          body: '"her", "bird", and "fur" all use the same vowel sound.',
          prompt: 'Which word has the same vowel sound as "her"?',
          options: ['car', 'bird', 'corn'],
          correctIndex: 1,
          tip: '"bird" has -ir- which says /er/, same as "her" (-er) and "fur" (-ur). Three spellings, one sound.',
        },
        {
          type: 'practice',
          title: 'R-Controlled Sort',
          body: `Sort these words into the correct column:\n\ncar  her  bird  for  fur  farm  verb  skirt  corn  burn\n\n-ar  |  -er  |  -ir  |  -or  |  -ur\n_____|______|______|______|_____\n\nRead all 10 words aloud twice.`,
          tip: 'When in doubt, say it aloud. /ar/, /er/, /or/ — your ear will guide you.',
        },
        {
          type: 'check',
          title: `${tone.praise} R-Controlled Vowels Complete`,
          body: 'Bossy R mastered. ar, er, ir, or, ur — five patterns. Three share the same /er/ sound.',
        },
      ],
      completionMessage: `${tone.praise} R-Controlled Vowels lesson complete.`,
      nextSuggestion: 'paragraph-reading-1',
    },

    'paragraph-reading-1': {
      title: 'Reading Short Paragraphs',
      objective: 'Read and understand short multi-sentence paragraphs',
      whyItMatters: 'Moving from sentences to paragraphs is a key developmental milestone. Research shows connected text practice builds both fluency and comprehension simultaneously.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} What is a Paragraph?`,
          body: `A paragraph is a group of sentences about ONE main idea.\n\nStructure:\n• Topic sentence — introduces the main idea (usually first)\n• Supporting sentences — give details and examples\n• Closing sentence — summarises or concludes\n\nAs ${tone.you} read, ask: "What is this paragraph about?"`,
          tip: 'If you feel lost, re-read the first sentence. It almost always tells you the main topic.',
        },
        {
          type: 'exercise',
          title: 'Find the Main Idea',
          body: '"Dogs are loyal animals. They stay close to their owners and often sense when people are sad. Many people keep dogs as companions for this reason."\n\nWhat is the main idea?',
          prompt: 'What is this paragraph mainly about?',
          options: ['Why dogs are sad', 'Dogs are loyal companions', 'How to keep a dog'],
          correctIndex: 1,
          tip: `${tone.praise} The main idea is in the first sentence: "Dogs are loyal animals." The rest gives supporting details.`,
        },
        {
          type: 'practice',
          title: 'Read Aloud — Full Paragraph',
          body: `Read this paragraph aloud at a natural pace:\n\n"The sun rises in the east each morning. As it climbs higher, it warms the land and sea. Plants use its light to grow, and animals wake to start their day. Without the sun, life on Earth could not exist. It is the most important star in our sky."\n\nAfter reading: say in one sentence what the paragraph is about.`,
          tip: 'Read to the end of each sentence before pausing. Meaning comes in complete thoughts.',
        },
        {
          type: 'exercise',
          title: 'Detail Retrieval',
          body: '"The sun rises in the east each morning... Plants use its light to grow, and animals wake to start their day."',
          prompt: 'What do plants use sunlight for, according to the paragraph?',
          options: ['To sleep', 'To grow', 'To move'],
          correctIndex: 1,
          tip: '"Plants use its light to grow" — a directly stated detail. Always check the text.',
        },
        {
          type: 'check',
          title: `${tone.praise} Paragraph Reading Complete`,
          body: 'You read a full paragraph and found the main idea and details. This is reading comprehension.',
        },
      ],
      completionMessage: `${tone.praise} Short Paragraph Reading lesson complete.`,
      nextSuggestion: 'syllable-division',
    },

    // ── NB-L4: Multisyllable ──────────────────────────────────────────────────
    'syllable-division': {
      title: 'Breaking Words into Syllables',
      objective: 'Apply syllable division rules to decode multisyllable words',
      whyItMatters: 'Most English words have more than one syllable. Teaching syllable division significantly improves the ability to read and spell longer words — a critical academic reading skill.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} One Vowel Sound = One Syllable`,
          body: `Every syllable has exactly ONE vowel sound.\n\nClap as you say the word to count syllables:\ncat = 1 clap = 1 syllable\nrab-bit = 2 claps = 2 syllables\nfan-tas-tic = 3 claps = 3 syllables\n\nKey division rules:\n• VCCV pattern: split between the two consonants → rab-bit, sis-ter\n• VCV pattern: usually split before the consonant → na-tion, pu-pil`,
          tip: 'Put your hand under your chin. It drops once per syllable. Try "banana" — three drops.',
        },
        {
          type: 'exercise',
          title: 'Count the Syllables',
          body: 'Clap or tap as you say the word.',
          prompt: 'How many syllables does "fantastic" have?',
          options: ['2 syllables', '3 syllables', '4 syllables'],
          correctIndex: 1,
          tip: 'fan-TAS-tic = 3 syllables. Three vowel sounds, three chin drops.',
        },
        {
          type: 'exercise',
          title: 'VCCV Division',
          body: 'Two consonants between vowels — split between them.',
          prompt: 'How do you divide "rabbit" into syllables?',
          options: ['r-abbit', 'rab-bit', 'ra-bbit'],
          correctIndex: 1,
          tip: '"rabbit" → rab-bit. Split between the double B. Each part has one vowel sound.',
        },
        {
          type: 'practice',
          title: 'Syllable Division Practice',
          body: `Divide each word, then read it aloud:\n\npillow → ___-___\ncarpet → ___-___\npicnic → ___-___\nfabric → ___-___\nvisit  → ___-___\nsilent → ___-___\n\nHint: all follow the VCCV pattern — split between the two middle consonants.`,
          tip: 'Decode long words: split into syllables → decode each part → blend back together.',
        },
        {
          type: 'check',
          title: `${tone.praise} Syllable Division Complete`,
          body: 'You can divide words into syllables. The longer the word, the more useful this skill becomes.',
        },
      ],
      completionMessage: `${tone.praise} Syllable Division lesson complete.`,
      nextSuggestion: 'prefixes-1',
    },

    'prefixes-1': {
      title: 'Common Prefixes: un- and re-',
      objective: 'Use un- and re- prefixes to decode and understand longer words',
      whyItMatters: 'Morpheme-based instruction is one of the most efficient reading interventions for older struggling readers. Knowing that "un-" means "not" and "re-" means "again" instantly unlocks the meaning of hundreds of words.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Word Parts That Change Meaning`,
          body: `A prefix is added to the BEGINNING of a base word and changes its meaning.\n\nun- means NOT or OPPOSITE:\nunhappy = not happy\nundo = opposite of do\nunlucky = not lucky\n\nre- means AGAIN or BACK:\nredo = do again\nreturn = go back\nreplay = play again\nrewrite = write again`,
          tip: 'Cover the prefix and read the base word first. Then add the prefix meaning. Two steps to instant decoding.',
        },
        {
          type: 'exercise',
          title: 'Prefix Meaning',
          body: 'Use the prefix to figure out the word\'s meaning.',
          prompt: 'What does "unhelpful" mean?',
          options: ['Very helpful', 'Not helpful', 'Helpful again'],
          correctIndex: 1,
          tip: 'un- = NOT. helpful = giving help. unhelpful = NOT giving help.',
        },
        {
          type: 'exercise',
          title: 'Which Prefix?',
          body: 'Choose the correct prefix.',
          prompt: '"He had to ___build the collapsed wall." — Which prefix fits?',
          options: ['un-', 're-', 'dis-'],
          correctIndex: 1,
          tip: '"rebuild" — re- means again. He had to build it AGAIN. "unbuild" is not a word.',
        },
        {
          type: 'practice',
          title: 'Build and Decode',
          body: `Add un- or re- to each base word. Read the result aloud and use it in a sentence:\n\nhappy → ___happy\ndo    → ___do\nfair  → ___fair\nplay  → ___play\nwrap  → ___wrap\nbuild → ___build\nlock  → ___lock\nclear → ___clear`,
          tip: 'When you see a long unfamiliar word, look for a prefix at the start first — it\'s often the key.',
        },
        {
          type: 'check',
          title: `${tone.praise} Prefixes un- and re- Complete`,
          body: 'un- and re- are two of the most common prefixes in English. Recognising them speeds up reading instantly.',
        },
      ],
      completionMessage: `${tone.praise} Prefixes lesson complete.`,
      nextSuggestion: 'suffixes-1',
    },

    'suffixes-1': {
      title: 'Common Suffixes: -ing, -ed, -er',
      objective: 'Decode and understand words with the suffixes -ing, -ed, and -er',
      whyItMatters: '-ing, -ed, and -er are the three most common suffixes in English. Automatic recognition of them helps readers decode inflected words without hesitation — a key fluency skill.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Word Parts at the End`,
          body: `A suffix is added to the END of a base word.\n\n-ing: ongoing action\njump → jumping    run → running    smile → smiling\n\n-ed: completed past action\njump → jumped    walk → walked    smile → smiled\n\n-er: the one who does it, OR a comparison\nteach → teacher    run → runner\ntall → taller    fast → faster`,
          tip: 'Spot the suffix, cover it, read the base word, add the suffix meaning back. Three steps.',
        },
        {
          type: 'exercise',
          title: 'Suffix Function: -ed',
          body: '"She walked to school." What does -ed tell us?',
          prompt: 'What does -ed tell the reader?',
          options: ['She walks now', 'She walked in the past', 'She will walk soon'],
          correctIndex: 1,
          tip: '-ed = past tense. The action is already done. "Walked" happened before now.',
        },
        {
          type: 'exercise',
          title: 'Doubling Rule for -ing',
          body: 'When a short vowel word ends in one consonant, double it before adding -ing or -ed.',
          prompt: 'What is the correct spelling of "run" + -ing?',
          options: ['runing', 'running', 'runeing'],
          correctIndex: 1,
          tip: 'run → running. Short vowel (u) + single consonant (n) → double the n before -ing.',
        },
        {
          type: 'practice',
          title: 'Suffix Practice',
          body: `Add the correct suffix to each base word:\n\n(Add -ing): jump, help, smile, sit, hop\n(Add -ed):  walk, laugh, talk, stop, wave\n(Add -er):  teach, sing, build, lead, swim\n\nSay each new word in a sentence.\nBonus: find the words that use the doubling rule.`,
          tip: 'These three suffixes appear on every page. Recognising them instantly speeds up reading.',
        },
        {
          type: 'check',
          title: `${tone.praise} Suffixes Complete`,
          body: '-ing, -ed, -er mastered. Spot these instantly and your reading fluency increases significantly.',
        },
      ],
      completionMessage: `${tone.praise} Suffixes lesson complete.`,
      nextSuggestion: 'compound-words',
    },

    'compound-words': {
      title: 'Compound Words',
      objective: 'Decode and understand compound words by identifying their component parts',
      whyItMatters: 'Compound words make up a significant portion of English vocabulary. Decomposing them into components improves both decoding speed and vocabulary understanding.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Two Words in One`,
          body: `A compound word is two complete words joined together:\n\nsun + shine = sunshine\nfoot + ball = football\nnote + book = notebook\nbee + hive = beehive\nrain + bow = rainbow\n\nTo decode a compound word:\n1. Find the two smaller words inside it\n2. Read each separately\n3. Blend them together`,
          tip: 'Look for "the word within the word". Once spotted, compound words decode easily.',
        },
        {
          type: 'exercise',
          title: 'Spot the Compound',
          body: 'Break "playground" into its two parts.',
          prompt: 'What two words make "playground"?',
          options: ['play + ground', 'plai + ground', 'play + grind'],
          correctIndex: 0,
          tip: '"playground" = play + ground. A ground where you play. Compound words often make logical sense.',
        },
        {
          type: 'exercise',
          title: 'Build a Compound',
          body: 'Join two words to make a compound.',
          prompt: 'What compound word comes from "fire" + "works"?',
          options: ['firework', 'fireworks', 'Both are correct compound words'],
          correctIndex: 2,
          tip: '"firework" (singular) and "fireworks" (plural) are both valid.',
        },
        {
          type: 'practice',
          title: 'Compound Word Builder',
          body: `Match each word in Column A with a word in Column B:\n\nA: sun, book, hand, door, over, skate, snow, tooth\nB: board, flake, shelf, step, coat, shake, shine, brush\n\nRead each compound word aloud.\nBonus: use 3 of them in sentences.`,
          tip: 'When you see an unfamiliar long word, check if it\'s a compound. It often is.',
        },
        {
          type: 'check',
          title: `${tone.praise} Compound Words Complete`,
          body: 'sunshine, football, notebook, rainbow — compound words are everywhere once you know what to look for.',
        },
      ],
      completionMessage: `${tone.praise} Compound Words lesson complete.`,
      nextSuggestion: 'paragraph-fluency',
    },

    'paragraph-fluency': {
      title: 'Paragraph Fluency Practice',
      objective: 'Read multi-sentence paragraphs with accuracy, rate, and expression',
      whyItMatters: 'Paragraph-level fluency practice with repeated reading produces consistent gains in speed and comprehension. Research shows oral reading fluency at paragraph level is a stronger predictor of comprehension than word-level fluency alone.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Reading in Meaningful Chunks`,
          body: `Paragraph fluency means:\n• Reading in phrases, not word-by-word\n• Using punctuation to guide pauses and expression\n• Understanding AS you read, not just after\n• Reading at a natural speaking rate\n\nGoal: ${tone.you} should sound like someone telling a story — not reading a list.`,
          tip: 'If reading slowly, look ahead while saying the current word. Your eyes should lead your voice.',
        },
        {
          type: 'practice',
          title: 'First Read — Accuracy',
          body: `Read aloud, focusing on accuracy:\n\n"Every summer, families travel to the seaside for their holidays. The beaches are packed with people building sandcastles, swimming in the waves, and eating ice cream. Children love splashing in the shallow water while their parents read and relax. By evening, the beach is quieter, and the sunset turns the sky orange and pink."\n\nNote any words you struggled with.`,
          tip: 'Stumbling is normal on a first read. Note difficult words and try them again.',
        },
        {
          type: 'practice',
          title: 'Second Read — Fluency',
          body: `Read the same paragraph again, aiming for smoothness:\n\n"Every summer, families travel to the seaside for their holidays. The beaches are packed with people building sandcastles, swimming in the waves, and eating ice cream. Children love splashing in the shallow water while their parents read and relax. By evening, the beach is quieter, and the sunset turns the sky orange and pink."\n\nWere you reading in chunks or word-by-word?`,
          tip: 'Read "building sandcastles" as one chunk. "swimming in the waves" as another. Phrase by phrase.',
        },
        {
          type: 'exercise',
          title: 'Comprehension Check',
          body: '"Children love splashing in the shallow water while their parents read and relax."',
          prompt: 'What do children love to do at the seaside?',
          options: ['Build roads', 'Splash in the shallow water', 'Read books'],
          correctIndex: 1,
          tip: `${tone.praise} Directly stated in the text. Always check the text before answering.`,
        },
        {
          type: 'check',
          title: `${tone.praise} Paragraph Fluency Complete`,
          body: 'Two reads, smoother each time. This is exactly how fluency develops.',
        },
      ],
      completionMessage: `${tone.praise} Paragraph Fluency lesson complete.`,
      nextSuggestion: 'morphology-roots',
    },

    // ── NB-L5: Morphology & Fluency ───────────────────────────────────────────
    'morphology-roots': {
      title: 'Word Roots',
      objective: 'Use Latin and Greek word roots to decode and understand unfamiliar words',
      whyItMatters: 'Over 60% of English words contain Latin or Greek roots. Morphological awareness is one of the most efficient vocabulary-building strategies, particularly for academic reading.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Words Have a Family History`,
          body: `Many English words are built from Latin and Greek roots:\n\ndict (Latin: say/tell)\ndictate, dictionary, predict, contradict, verdict\n\nport (Latin: carry)\nportable, transport, export, import, report\n\nrupt (Latin: break)\ndisrupt, interrupt, erupt, corrupt, abrupt\n\nIf ${tone.you} know the root, ${tone.you} can decode dozens of unfamiliar words instantly.`,
          tip: 'Write the root in the centre of a page. Branch out every related word you know.',
        },
        {
          type: 'exercise',
          title: 'Root to Meaning',
          body: 'Use the root meaning to understand the word.',
          prompt: 'If "port" means carry, what does "portable" most likely mean?',
          options: ['Cannot be moved', 'Can be carried', 'Related to a harbour'],
          correctIndex: 1,
          tip: '"portable" = port (carry) + -able (can be). Something portable CAN be carried.',
        },
        {
          type: 'exercise',
          title: 'Root Family',
          body: 'All these words contain "dict" (say).',
          prompt: 'What does "predict" mean? (pre- = before, dict = say)',
          options: ['Say something again', 'Say what will happen before it does', 'Say something loudly'],
          correctIndex: 1,
          tip: 'pre- (before) + dict (say) = predict. To say what will happen BEFORE it happens.',
        },
        {
          type: 'practice',
          title: 'Root Web',
          body: `List as many words as you can for each root:\n\nscript/scrib (write): _________________________\n(examples: describe, prescription, inscription)\n\nvis/vid (see): _________________________\n(examples: visible, video, vision, evidence)\n\naud (hear): _________________________\n(examples: audience, audio, audible)`,
          tip: 'The more words you find in a root family, the deeper your vocabulary grows.',
        },
        {
          type: 'check',
          title: `${tone.praise} Word Roots Complete`,
          body: 'dict, port, rupt — and dozens more. Root knowledge is the most powerful vocabulary tool available.',
        },
      ],
      completionMessage: `${tone.praise} Word Roots lesson complete.`,
      nextSuggestion: 'irregular-words',
    },

    'irregular-words': {
      title: 'Tricky Irregular Words',
      objective: 'Read high-frequency words that do not follow standard phonics rules',
      whyItMatters: 'English has many irregular words that cannot be decoded phonetically — "though", "through", "caught". These are extremely common in everyday and academic text and must be memorised through repeated exposure.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Words That Break the Rules`,
          body: `Some very common English words are phonetically irregular:\n\nthough  → /thoh/    (not /thow/)\nthrough → /throo/   (not /thro-oo/)\ncaught  → /kawt/    (not /cawt/)\nlaughed → /laaft/   (not /lawft/)\nhave    → /hav/     (not /hayv/)\nwould   → /wood/    (not /wowld/)\nisland  → /eye-land/ (the S is completely silent!)\n\nThese must be memorised as whole-word patterns.`,
          tip: 'For each tricky word: Look → Say → Cover → Write → Check. Repeat 3 times.',
        },
        {
          type: 'exercise',
          title: 'Silent Letter',
          body: 'The word "island" has a silent S.',
          prompt: 'How do you pronounce "island"?',
          options: ['/iz-land/', '/eye-land/', '/is-land/'],
          correctIndex: 1,
          tip: '"island" = /eye-land/. The "s" is completely silent — a historical spelling quirk.',
        },
        {
          type: 'exercise',
          title: 'Choose Correctly',
          body: '"She _____ the question even though it was hard."',
          prompt: 'Which spelling is correct?',
          options: ['awnsered', 'answered', 'ansered'],
          correctIndex: 1,
          tip: '"answered" — the W is silent in speech (/an-serd/) but appears in the spelling. A historical holdover.',
        },
        {
          type: 'practice',
          title: 'Tricky Word Sentences',
          body: `Read each sentence aloud — the irregular word is bold:\n\n1. "I thought she was going though."\n2. "They laughed when he caught the ball."\n3. "She would have finished if she could."\n4. "The island was beautiful though remote."\n5. "He went straight through the door."\n\nFor each bold word: write it, say it, use it in your own sentence.`,
          tip: 'Context locks in memory. Always read irregular words in sentences, not just in isolation.',
        },
        {
          type: 'check',
          title: `${tone.praise} Irregular Words Complete`,
          body: 'These words break the rules — but you know them now. The more you read, the more automatic they become.',
        },
      ],
      completionMessage: `${tone.praise} Irregular Words lesson complete.`,
      nextSuggestion: 'repeated-reading',
    },

    'prosody-practice': {
      title: 'Reading with Expression',
      objective: 'Read text with appropriate prosody: phrasing, emphasis, pacing, and intonation',
      whyItMatters: 'Prosody — the musical quality of reading — is the aspect of fluency most linked to comprehension. Research shows that readers with poor prosody understand less, even when they decode accurately.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Reading Sounds Like Speaking`,
          body: `Prosody has four elements:\n1. Phrasing — grouping words into natural chunks\n2. Emphasis — stressing important words\n3. Pace — speeding up for action, slowing for emotion\n4. Intonation — rising for questions, falling for statements\n\n"Did she leave?" (voice rises)\n"She left." (voice falls)\n"He was VERY angry." (stress on VERY)`,
          tip: 'Read as if telling a story to a friend. Would you say it the same way you\'re reading it?',
        },
        {
          type: 'exercise',
          title: 'Punctuation and Intonation',
          body: 'Different punctuation requires different intonation.',
          prompt: 'Which sentence should have a flat, falling intonation at the end?',
          options: ['Did she come back?', 'She came back.', 'She came back!'],
          correctIndex: 1,
          tip: '"She came back." is a statement — voice falls. Questions rise. Exclamations have energy.',
        },
        {
          type: 'practice',
          title: 'Read with Feeling',
          body: `Read this passage aloud. Let the punctuation guide your expression:\n\n"Jack stared at the empty chair. Where had she gone? He had only left for a moment — a single minute. He called her name. Silence. Then a creak from the attic. He stood very still and waited."\n\nRead it twice: once flat, once with full expression. Notice the difference.`,
          tip: 'The flat read sounds like a robot. The expressive read creates atmosphere. Aim for the second.',
        },
        {
          type: 'practice',
          title: 'Emphasise the Right Word',
          body: `The same sentence means different things depending on stress:\n\n"SHE didn't take it." (not someone else)\n"She DIDN'T take it." (denial)\n"She didn't TAKE it." (different action)\n"She didn't take IT." (something else was taken)\n\nRead each version aloud. Hear how meaning shifts with emphasis.`,
          tip: 'Word stress is a powerful tool for meaning-making. Authors intend particular emphases.',
        },
        {
          type: 'check',
          title: `${tone.praise} Prosody Practice Complete`,
          body: 'Expression, phrasing, emphasis, intonation — four elements practised. Expressive reading marks a fluent, comprehending reader.',
        },
      ],
      completionMessage: `${tone.praise} Prosody lesson complete.`,
      nextSuggestion: 'comprehension-basics',
    },

    'comprehension-basics': {
      title: 'Understanding What You Read',
      objective: 'Apply three core comprehension strategies: main idea, supporting details, and sequence',
      whyItMatters: 'Research identifies explicit comprehension strategy instruction as one of the most effective reading interventions, producing significant gains in understanding across all age groups.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Three Essential Tools`,
          body: `Three core comprehension strategies:\n\n1. Main Idea — the central point\n"What is this mostly about?"\n\n2. Supporting Details — evidence for the main idea\n"What facts does the author give?"\n\n3. Sequence — the order events happen\n"What happened first? Then? Finally?"\n\nUse these three questions every time ${tone.you} read.`,
          tip: 'After each paragraph, pause and answer: "What was that about?" in one sentence.',
        },
        {
          type: 'exercise',
          title: 'Main Idea',
          body: '"Exercise is essential for physical health. It strengthens the heart, builds muscle, and helps maintain a healthy weight. Even a 30-minute walk each day produces significant benefits."',
          prompt: 'What is the main idea?',
          options: ['Walking takes 30 minutes', 'Exercise is important for health', 'Muscles need exercise to grow'],
          correctIndex: 1,
          tip: 'The first sentence states the main idea directly. Other sentences support it with details.',
        },
        {
          type: 'exercise',
          title: 'Supporting Detail',
          body: '"Exercise is essential for physical health. It strengthens the heart, builds muscle, and helps maintain a healthy weight."',
          prompt: 'Which is NOT listed as a benefit of exercise in the text?',
          options: ['Strengthens the heart', 'Improves memory', 'Builds muscle'],
          correctIndex: 1,
          tip: '"Improves memory" is not in the text. Always check whether the detail is actually stated before choosing.',
        },
        {
          type: 'practice',
          title: 'Apply All Three Strategies',
          body: `Read this and answer the three questions:\n\n"First, water is heated until it boils. Next, steam rises and cools to form clouds. Then clouds release water as rain. Finally, rain flows into rivers and oceans, where the cycle begins again."\n\n1. Main Idea: What is this about?\n2. Detail: What forms clouds?\n3. Sequence: What happens FIRST?`,
          tip: 'Sequence signal words: first, next, then, finally. These words are your roadmap.',
        },
        {
          type: 'check',
          title: `${tone.praise} Comprehension Basics Complete`,
          body: 'Main idea, supporting details, sequence — apply these to every text you read.',
        },
      ],
      completionMessage: `${tone.praise} Comprehension Basics lesson complete.`,
      nextSuggestion: 'complex-sentences',
    },

    // ── NB-L6: Complex Text ───────────────────────────────────────────────────
    'complex-sentences': {
      title: 'Complex Sentence Structures',
      objective: 'Parse and understand complex sentences with subordinate clauses and conjunctions',
      whyItMatters: 'Academic and professional texts are dominated by complex sentences. Research shows that readers who cannot parse complex syntax struggle with comprehension at secondary and higher levels, regardless of vocabulary or decoding ability.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Beyond Simple Sentences`,
          body: `A complex sentence has:\n• A main clause (a complete thought)\n• A subordinate clause (depends on the main clause)\n\nSubordinating conjunctions signal the relationship:\nbecause, although, while, since, unless, when, if, after, before\n\nExample:\n"Although it was raining, she went for a run."\nMain clause: "she went for a run"\nSubordinate: "Although it was raining" (gives context)`,
          tip: 'Find the main clause first — the sentence still makes sense without the subordinate clause.',
        },
        {
          type: 'exercise',
          title: 'Identify the Main Clause',
          body: '"Because the traffic was heavy, he arrived an hour late."',
          prompt: 'Which part is the main clause?',
          options: ['Because the traffic was heavy', 'he arrived an hour late', 'Both are equal main clauses'],
          correctIndex: 1,
          tip: '"he arrived an hour late" stands alone as a complete thought. The "because" clause adds the cause.',
        },
        {
          type: 'exercise',
          title: 'Conjunction Meaning',
          body: 'Subordinating conjunctions signal the relationship between clauses.',
          prompt: '"She succeeded _____ she worked extremely hard." — Which conjunction shows cause?',
          options: ['although', 'unless', 'because'],
          correctIndex: 2,
          tip: '"because" introduces a cause. "although" signals contrast. "unless" signals a condition.',
        },
        {
          type: 'practice',
          title: 'Parse and Paraphrase',
          body: `For each sentence: identify the main clause, subordinate clause, and relationship:\n\n1. "Although she was tired, she finished the report."\n2. "He won the prize because he had prepared thoroughly."\n3. "Unless you register by Friday, you will lose your place."\n4. "While some prefer city life, others thrive in the countryside."\n5. "She had already left before he arrived."`,
          tip: 'In academic reading, complex sentences carry the most important ideas. Parse them carefully.',
        },
        {
          type: 'check',
          title: `${tone.praise} Complex Sentences Complete`,
          body: 'Main clause, subordinate clause, conjunctions — you can now navigate complex academic sentences with confidence.',
        },
      ],
      completionMessage: `${tone.praise} Complex Sentences lesson complete.`,
      nextSuggestion: 'context-clues',
    },

    'context-clues': {
      title: 'Vocabulary from Context',
      objective: 'Use context clues to determine the meaning of unfamiliar words',
      whyItMatters: 'Adults encounter 5–15 unfamiliar words per 1,000 words read. Context-clue strategies are one of the most reliable methods for vocabulary growth during independent reading.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} The Text Gives You Clues`,
          body: `Four types of context clue:\n\n1. Definition: "Photosynthesis, the process by which plants make food using sunlight..."\n2. Synonym: "She was loquacious — in fact, she never stopped talking."\n3. Antonym: "Unlike his gregarious brother, he was quite solitary."\n4. General context: "The storm was so ferocious that trees were uprooted."\n\nStrategy: re-read the sentence, look before and after the word, predict meaning.`,
          tip: 'T-I-P: Text clue → Infer meaning → Plug in your guess to test it.',
        },
        {
          type: 'exercise',
          title: 'Definition Clue',
          body: '"The doctor recommended a diuretic — a substance that increases urine output — to reduce the swelling."',
          prompt: 'What does "diuretic" mean based on the text?',
          options: ['A type of pain relief', 'A substance that increases urine output', 'A type of swelling'],
          correctIndex: 1,
          tip: 'The definition is given directly after the word. This is the most explicit context clue type.',
        },
        {
          type: 'exercise',
          title: 'Antonym Clue',
          body: '"Her sister was always ebullient, but today she seemed unusually subdued."',
          prompt: 'What does "ebullient" probably mean?',
          options: ['Quiet and withdrawn', 'Lively and enthusiastic', 'Tired and unwell'],
          correctIndex: 1,
          tip: '"But today she seemed unusually subdued" — the contrast. If subdued = quiet, ebullient = opposite = lively.',
        },
        {
          type: 'practice',
          title: 'Context Clue Practice',
          body: `Underline the context clue and write the likely meaning of each bold word:\n\n1. "The tenacious climber refused to give up, even after three failed attempts."\n2. "He lived a frugal life — never wasting money, always saving."\n3. "The cacophony of sirens, horns, and shouting made conversation impossible."\n4. "Unlike the verbose chairman, the new speaker made her point in two sentences."`,
          tip: 'Always test your guess: replace the bold word with your definition. Does the sentence still make sense?',
        },
        {
          type: 'check',
          title: `${tone.praise} Context Clues Complete`,
          body: 'Definition, synonym, antonym, general context — four tools for cracking unfamiliar vocabulary in any text.',
        },
      ],
      completionMessage: `${tone.praise} Context Clues lesson complete.`,
      nextSuggestion: 'making-inferences',
    },

    'text-structure': {
      title: 'Understanding Text Structure',
      objective: 'Identify and use the five main non-fiction text structures',
      whyItMatters: 'Research shows that readers who recognise text structure recall significantly more information. This skill is especially important for academic and informational reading.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} How Non-Fiction is Organised`,
          body: `Non-fiction texts use five main structures:\n\n1. Description — describes features of a topic\n2. Sequence — events in order or step-by-step\n3. Compare/Contrast — similarities and differences\n4. Cause/Effect — reasons and results\n5. Problem/Solution — a problem and how to resolve it\n\nSignal words:\n• Sequence: first, then, next, finally\n• Cause/Effect: because, therefore, as a result\n• Compare/Contrast: however, whereas, similarly, in contrast`,
          tip: 'Scan for signal words before reading in depth — they reveal the blueprint of the text.',
        },
        {
          type: 'exercise',
          title: 'Identify the Structure',
          body: '"Air pollution has increased dramatically in cities. As a result, hospital admissions for respiratory conditions have risen by 30% in the last decade."',
          prompt: 'What text structure is used?',
          options: ['Description', 'Cause and Effect', 'Compare and Contrast'],
          correctIndex: 1,
          tip: '"As a result" is a cause-and-effect signal. Pollution (cause) → hospital admissions (effect).',
        },
        {
          type: 'exercise',
          title: 'Signal Word Hunt',
          body: '"Electric cars produce no direct emissions. In contrast, petrol cars release CO₂. However, both require energy production."',
          prompt: 'Which text structure does "in contrast" signal?',
          options: ['Sequence', 'Compare and Contrast', 'Problem and Solution'],
          correctIndex: 1,
          tip: '"In contrast" and "however" are compare/contrast signal words.',
        },
        {
          type: 'practice',
          title: 'Structure Analysis',
          body: `Identify: structure, signal words, and how ideas are linked:\n\n"Deforestation has dramatically reduced the Amazon rainforest. Because fewer trees absorb CO₂, global temperatures are rising. This leads to more extreme weather. As a result, many species face extinction."\n\n1. What structure is used?\n2. List all signal words.\n3. Draw a cause-effect chain.`,
          tip: 'Knowing the structure lets you predict what information comes next — a huge comprehension advantage.',
        },
        {
          type: 'check',
          title: `${tone.praise} Text Structure Complete`,
          body: 'Description, Sequence, Compare/Contrast, Cause/Effect, Problem/Solution — you can recognise how any text is built.',
        },
      ],
      completionMessage: `${tone.praise} Text Structure lesson complete.`,
      nextSuggestion: 'expository-reading',
    },

    'expository-reading': {
      title: 'Reading Informational Text',
      objective: 'Read, understand, and evaluate non-fiction expository texts',
      whyItMatters: 'Over 80% of reading in academic and professional life is non-fiction. Explicit instruction in expository reading strategies produces significant comprehension gains.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Reading to Learn`,
          body: `Expository text explains, informs, or persuades.\n\nBefore reading:\n• Preview headings and bold words\n• Ask: "What do I already know about this topic?"\n\nDuring reading:\n• Pause after each paragraph and summarise in one sentence\n• Look for signal words\n\nAfter reading:\n• Recall the main points without looking\n• Connect to what you already know`,
          tip: 'SQ3R: Survey, Question, Read, Recite, Review — backed by decades of research.',
        },
        {
          type: 'practice',
          title: 'Active Reading',
          body: `Read this passage actively:\n\n"Antibiotics are medicines that kill or slow the growth of bacteria. First developed in the 1940s, they revolutionised medicine by making previously fatal infections treatable. However, overuse has led to antibiotic resistance — bacteria that no longer respond to treatment. The World Health Organisation identifies this as one of the greatest threats to global health today."\n\nAfter reading:\n1. Summarise in one sentence.\n2. Identify the text structure.\n3. Find one cause-effect relationship.`,
          tip: 'Summarising immediately after reading is the single most effective comprehension strategy.',
        },
        {
          type: 'exercise',
          title: 'Author\'s Purpose',
          body: 'The antibiotic passage shares information AND highlights a danger.',
          prompt: 'What is the author\'s primary purpose?',
          options: ['Tell the history of medicine', 'Inform and warn about antibiotic resistance', 'Persuade people to stop using antibiotics'],
          correctIndex: 1,
          tip: 'Inform + warn = shares facts AND highlights a serious concern. Typical of health journalism.',
        },
        {
          type: 'practice',
          title: 'Note-Taking Practice',
          body: `Complete these notes from the antibiotic passage:\n\nTopic: ___________________________\nMain Idea: ________________________\nKey Fact 1: _______________________\nKey Fact 2: _______________________\nKey Fact 3: _______________________\nAuthor's perspective: ______________\nMy question: _____________________`,
          tip: 'Even brief notes while reading significantly improve retention.',
        },
        {
          type: 'check',
          title: `${tone.praise} Expository Reading Complete`,
          body: 'Preview, question, summarise, connect. These habits transform passive readers into active learners.',
        },
      ],
      completionMessage: `${tone.praise} Expository Reading lesson complete.`,
      nextSuggestion: 'academic-vocabulary',
    },

    // ── NB-L7: Academic Language ──────────────────────────────────────────────
    'summarizing': {
      title: 'Summarising Main Ideas',
      objective: 'Write concise, accurate summaries that capture main ideas without copying',
      whyItMatters: 'Research by Duke and Pearson found summarising to be one of the seven most effective comprehension strategies. It requires analysis, judgement, and the ability to distinguish essential from non-essential information.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} What a Summary Is (and Isn't)`,
          body: `A summary:\n✓ Captures the main idea\n✓ Includes the most important details\n✓ Is shorter than the original (25–30% of length)\n✓ Is in YOUR words — not copied\n\nA summary is NOT:\n✗ A copy of the original\n✗ Your personal opinion\n✗ A list of every detail\n\nFormula: WHO/WHAT + DID/IS + THE MOST IMPORTANT POINT`,
          tip: 'Read the full text, then summarise from memory. This forces you to process meaning rather than copy.',
        },
        {
          type: 'exercise',
          title: 'Cut the Unnecessary',
          body: '"Today, many scientists believe that regular exercise, particularly aerobic activity such as running, cycling, or swimming, performed at moderate intensity for at least 30 minutes, 5 days per week, produces measurable benefits to cardiovascular health, as evidenced by multiple large-scale longitudinal studies."',
          prompt: 'Which is the best summary?',
          options: [
            'Scientists say that running, cycling, and swimming are the best exercises.',
            'Regular aerobic exercise for 30+ minutes, 5 days a week, improves heart health according to research.',
            'People should exercise 5 days a week.',
          ],
          correctIndex: 1,
          tip: 'Option 2 captures: who (scientists), what (aerobic exercise), key details (30 min, 5 days), main point (heart health), evidence (research).',
        },
        {
          type: 'practice',
          title: 'Write a Summary',
          body: `Read and write a 2-sentence summary:\n\n"The printing press, invented by Gutenberg around 1440, transformed European society. Before it, books were hand-copied, making them rare and expensive. The press allowed identical books to be produced cheaply, making literacy more accessible. This contributed to the Reformation, the Scientific Revolution, and the spread of Enlightenment ideas."\n\nYour summary: ___________________________________`,
          tip: 'Sentence 1: What was the printing press? Sentence 2: What was its most important impact?',
        },
        {
          type: 'exercise',
          title: 'Evaluate a Summary',
          body: 'Which summary of the printing press passage is most accurate?',
          prompt: 'Select the best summary:',
          options: [
            'Gutenberg made books in 1440 and people became literate.',
            'The printing press made books cheaper, increased literacy, and contributed to major historical movements.',
            'The printing press caused the Reformation.',
          ],
          correctIndex: 1,
          tip: 'Option 2 covers: the key mechanism (cheaper books), the main effect (literacy), and the broader impact (historical movements). Balanced and complete.',
        },
        {
          type: 'check',
          title: `${tone.praise} Summarising Complete`,
          body: 'Summarising is a high-level skill. Use it every time you finish a text, article, or chapter.',
        },
      ],
      completionMessage: `${tone.praise} Summarising lesson complete.`,
      nextSuggestion: 'critical-reading',
    },

    'critical-reading': {
      title: 'Critical Reading Skills',
      objective: 'Evaluate author purpose, identify bias, and distinguish fact from opinion',
      whyItMatters: 'Critical reading — the ability to evaluate and question what you read — is one of the most valued skills in education and work. Research in media literacy shows untrained readers often accept written text uncritically.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Reading with a Critical Eye`,
          body: `Critical reading asks four questions:\n\n1. WHO wrote this? What is their expertise or agenda?\n2. WHY was it written? To inform, persuade, or sell?\n3. WHAT evidence is given? Facts, statistics, or opinions?\n4. IS the argument balanced? Does it acknowledge other views?\n\nFact: verifiable — "The Earth orbits the Sun."\nOpinion: a belief or judgement — "Space exploration is a waste of money."`,
          tip: 'Always ask "who benefits?" when reading anything with a clear argument or recommendation.',
        },
        {
          type: 'exercise',
          title: 'Fact or Opinion?',
          body: '"Research shows 1 in 10 people has dyslexia. Dyslexics are some of the most creative people in the world."',
          prompt: 'Which sentence is a fact and which is an opinion?',
          options: [
            'Both are facts — both can be proven',
            '"1 in 10 has dyslexia" is fact; "most creative" is opinion',
            'Both are opinions — research can be biased',
          ],
          correctIndex: 1,
          tip: 'Statistics from research are facts (verifiable). "Most creative" is a value judgement — an opinion, however positive.',
        },
        {
          type: 'exercise',
          title: 'Identifying Bias',
          body: '"Our city\'s recycling scheme has been a triumphant success, celebrated by residents and experts alike." (Source: City Council press release)',
          prompt: 'Why should this claim be evaluated critically?',
          options: [
            'It uses positive language from a source with an interest in presenting success',
            'Recycling is never successful',
            'Press releases are always wrong',
          ],
          correctIndex: 0,
          tip: 'The City Council has an interest in positive coverage. "Triumphant success" is evaluative language. Look for independent sources.',
        },
        {
          type: 'practice',
          title: 'Critical Analysis',
          body: `Read and analyse this extract:\n\n"Studies suggest social media has a devastating impact on teenage mental health. Every minute young people spend online increases anxiety and reduces self-esteem. Parents must immediately limit screen time."\n\n1. What claim is made?\n2. Is "every minute" realistic or exaggerated?\n3. What evidence is missing?\n4. What does "must immediately" suggest about tone?\n5. How would you find a more balanced view?`,
          tip: 'Language like "devastating", "every minute", "must immediately" signals a persuasive, not neutral, text.',
        },
        {
          type: 'check',
          title: `${tone.praise} Critical Reading Complete`,
          body: 'WHO, WHY, WHAT, IS IT BALANCED — four questions that make you a critical, empowered reader.',
        },
      ],
      completionMessage: `${tone.praise} Critical Reading lesson complete.`,
      nextSuggestion: 'extended-passages',
    },

    'extended-passages': {
      title: 'Extended Passage Practice',
      objective: 'Read and comprehend multi-paragraph texts with sustained attention and strategic monitoring',
      whyItMatters: 'Extended reading is essential for academic and professional success. Research shows practice with longer texts improves working memory capacity for reading and builds the stamina required for examinations and workplace reading.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Building Reading Stamina`,
          body: `Extended reading requires:\n• Sustained focus (10–20+ minutes)\n• Active monitoring — "Do I understand this paragraph?"\n• Connecting ideas across paragraphs\n• Tracking the author's argument as it develops\n\nStrategy — paragraph by paragraph:\n→ Read one paragraph\n→ Summarise in one sentence\n→ Note any questions\n→ Link to the previous paragraph`,
          tip: 'Set a timer. Commit to 10 minutes of uninterrupted reading. Build up to 20, then 30.',
        },
        {
          type: 'practice',
          title: 'Extended Read with Active Pauses',
          body: `Read paragraph by paragraph. After each, write one summarising sentence:\n\n"Para 1: Climate change refers to long-term shifts in global temperatures and weather patterns. Since the mid-20th century, human activities have been the main driver.\n\nPara 2: Burning fossil fuels releases large amounts of CO₂, which traps heat in the atmosphere — the greenhouse effect — causing temperatures to rise.\n\nPara 3: Consequences include rising sea levels, more frequent extreme weather, and threats to biodiversity. The IPCC warns temperatures could rise 1.5°C above pre-industrial levels within decades."`,
          tip: 'Don\'t read all at once. Pause and summarise after each paragraph. This is strategic reading.',
        },
        {
          type: 'exercise',
          title: 'Cross-Paragraph Comprehension',
          body: 'Using all three climate change paragraphs:',
          prompt: 'What is the relationship between fossil fuels (Para 2) and the consequences (Para 3)?',
          options: [
            'Fossil fuels are a consequence of climate change',
            'Burning fossil fuels causes the greenhouse effect, which leads to the consequences',
            'The IPCC burns fossil fuels',
          ],
          correctIndex: 1,
          tip: 'Paragraphs link in a chain: human activity → greenhouse effect → consequences. Extended reading tracks these chains.',
        },
        {
          type: 'practice',
          title: 'Synthesis Summary',
          body: `Using all three paragraphs, write:\n\n1. A one-paragraph summary (4–5 sentences)\n2. Three key terms and their meanings\n3. One question the passage leaves unanswered\n4. Your view: is the passage balanced or does it have a perspective?`,
          tip: 'Extended comprehension = summarise + evaluate + question. Go beyond retelling.',
        },
        {
          type: 'check',
          title: `${tone.praise} Extended Passage Complete`,
          body: 'Sustained reading, paragraph-by-paragraph summarising, cross-paragraph comprehension — your reading stamina is building.',
        },
      ],
      completionMessage: `${tone.praise} Extended Passage lesson complete.`,
      nextSuggestion: 'synthesis-practice',
    },

    'synthesis-practice': {
      title: 'Connecting Ideas Across Texts',
      objective: 'Compare, contrast, and synthesise information from multiple sources',
      whyItMatters: 'Synthesis — combining ideas from multiple texts into a coherent understanding — is a hallmark of advanced reading and a core skill in academic writing and professional research.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Beyond One Text`,
          body: `Synthesis means:\n• Reading two or more texts on the same topic\n• Finding where they AGREE (corroborate)\n• Finding where they DISAGREE (contradict)\n• Reaching YOUR OWN conclusion based on evidence\n\nSynthesis formula:\nText A says ____ + Text B says ____ = My conclusion: ____\n\nThis is the foundation of research, argument, and critical analysis.`,
          tip: 'Use a two-column table: Text A | Text B | Both | Neither.',
        },
        {
          type: 'exercise',
          title: 'Find the Agreement',
          body: `Text A: "Exercise reduces anxiety by releasing endorphins and providing distraction from stressors."\nText B: "Physical activity is associated with lower rates of anxiety and depression, through neurochemical and behavioural mechanisms."`,
          prompt: 'What do both texts agree on?',
          options: [
            'Exercise causes depression',
            'Exercise helps reduce anxiety',
            'Endorphins are the only mechanism',
          ],
          correctIndex: 1,
          tip: 'Both agree: exercise reduces anxiety. Different detail (endorphins vs neurochemical) — same core point.',
        },
        {
          type: 'practice',
          title: 'Synthesis Writing',
          body: `Read the two extracts and write a 3-sentence synthesis:\n\nText A: "Remote working has improved work-life balance for many employees, allowing flexible schedules and removing commute time."\nText B: "Studies suggest remote working can increase feelings of isolation, reduce collaboration, and blur the boundary between work and home life."\n\nYour synthesis should:\n1. Acknowledge what Text A argues\n2. Acknowledge the counterpoint from Text B\n3. Reach a balanced conclusion`,
          tip: 'Synthesis starters: "While Text A argues... Text B highlights... Taken together, the evidence suggests..."',
        },
        {
          type: 'exercise',
          title: 'Evaluate the Evidence',
          body: 'Which type of evidence is stronger for a scientific claim?',
          prompt: 'Which source provides stronger evidence for a health claim?',
          options: [
            'A personal blog post from someone who recovered',
            'A peer-reviewed study of 10,000 participants',
            'A news article summarising expert opinions',
          ],
          correctIndex: 1,
          tip: 'Peer-reviewed research with large samples = strongest. Personal accounts = valid but anecdotal.',
        },
        {
          type: 'check',
          title: `${tone.praise} Synthesis Complete`,
          body: 'Reading across texts, finding agreement and disagreement, reaching your own conclusion — this is the highest level of reading.',
        },
      ],
      completionMessage: `${tone.praise} Synthesis lesson complete.`,
      nextSuggestion: 'advanced-strategies',
    },

    // ── NB-L8: Advanced ───────────────────────────────────────────────────────
    'advanced-strategies': {
      title: 'Advanced Comprehension Strategies',
      objective: 'Apply SQ3R, annotation, and self-questioning strategies to complex texts',
      whyItMatters: 'Research shows that strategic readers — those who deploy multiple comprehension strategies flexibly — significantly outperform non-strategic readers on all comprehension measures.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Reading Strategically`,
          body: `Expert readers use a full toolkit:\n\nSQ3R:\n• Survey — preview headings and bold terms\n• Question — turn headings into questions\n• Read — actively, looking for answers\n• Recite — close the text and recall\n• Review — check notes, fill gaps\n\nAnnotation:\n• Underline key points\n• Circle unfamiliar words\n• Write questions in margins\n• Star important ideas`,
          tip: 'Annotating forces active engagement. Even a simple underline means your brain processed that sentence.',
        },
        {
          type: 'practice',
          title: 'SQ3R in Practice',
          body: `Apply SQ3R to this passage:\n\n"Neuroplasticity refers to the brain's ability to reorganise itself by forming new neural connections throughout life. Research shows that reading itself drives neuroplastic change — regular reading strengthens pathways associated with language, attention, and empathy. Adults who read regularly show slower cognitive decline in old age."\n\nS — Survey: topic?\nQ — Question: what do I want to know?\nR — Read: find answers\nR — Recite: 3 main points (without looking)\nR — Review: what questions remain?`,
          tip: 'SQ3R slows you down initially but increases retention dramatically. Quality over quantity.',
        },
        {
          type: 'exercise',
          title: 'Self-Questioning',
          body: 'Self-questioning during reading is one of the most researched comprehension strategies.',
          prompt: 'Which question is most useful to ask DURING reading?',
          options: [
            '"Is this book well-written?"',
            '"Does this make sense? How does it connect to what I just read?"',
            '"How long is this passage?"',
          ],
          correctIndex: 1,
          tip: 'Monitoring comprehension in real time catches misunderstanding early. If you can\'t answer "what did I just read?" — re-read.',
        },
        {
          type: 'practice',
          title: 'Annotation Practice',
          body: `Annotate this paragraph (on paper or in your own copy):\n\n"Confirmation bias is the tendency to search for, interpret, and recall information that confirms pre-existing beliefs. It leads people to overweight supportive evidence and dismiss contradictory evidence. This bias operates largely unconsciously and affects both experts and non-experts, making it one of the most pervasive cognitive biases in human reasoning."\n\nMark: main idea, 2 key terms, 1 question, 1 reaction.`,
          tip: 'Annotation is a conversation with the author. Ask, challenge, connect — don\'t just read passively.',
        },
        {
          type: 'check',
          title: `${tone.praise} Advanced Strategies Complete`,
          body: 'SQ3R, annotation, self-questioning — a full toolkit for expert reading. Use these strategies with every important text.',
        },
      ],
      completionMessage: `${tone.praise} Advanced Strategies lesson complete.`,
      nextSuggestion: 'efficient-reading',
    },

    'efficient-reading': {
      title: 'Efficient Silent Reading',
      objective: 'Develop skimming, scanning, and chunking strategies for efficient reading',
      whyItMatters: 'Skilled readers rarely read every word in a linear way. They skim, scan, and select. Teaching these strategies significantly improves reading speed without comprehension loss — essential for academic and professional demands.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Strategic Reading Speed`,
          body: `Three efficient reading modes:\n\nSkimming — quickly getting the gist\n• Read headings and first/last sentences of paragraphs\n• Do NOT read every word\n• Goal: "What is this about?"\n\nScanning — locating specific information\n• Move eyes quickly looking for a keyword\n• Stop when you find it\n• Goal: "Find the date" or "Find the number"\n\nChunking — reading groups of words\n• Train eyes to take in 3–5 words per fixation`,
          tip: 'Skimming is NOT inferior reading — it is a deliberate, strategic choice about how to spend your reading time.',
        },
        {
          type: 'exercise',
          title: 'Skim vs Scan',
          body: 'You need to find a phone number in a long article about a company.',
          prompt: 'Which reading strategy would you use?',
          options: ['Skimming — get the gist', 'Scanning — locate a specific detail', 'Deep reading — every word'],
          correctIndex: 1,
          tip: 'Scanning = looking for a specific item. Run your eyes until you spot the phone number format.',
        },
        {
          type: 'practice',
          title: 'Skimming Practice',
          body: `Set a timer for 90 seconds. Skim this text — read ONLY the first sentence of each paragraph:\n\n"Para 1: Climate science has advanced rapidly in 30 years. [Details...]\nPara 2: Consequences of temperature rise are already visible. [Details...]\nPara 3: Policy responses vary significantly between nations. [Details...]\nPara 4: Individual behaviour change is one component. [Details...]"\n\nAfter 90 seconds: what is the text about? What are the four main topics?`,
          tip: 'You can skim a 10-page report in 5 minutes and decide whether to read it in depth. That is power.',
        },
        {
          type: 'practice',
          title: 'Chunking Exercise',
          body: `Train your eyes to read larger chunks — read each line as ONE unit:\n\n"the cat sat / on the mat"\n"she walked quickly / to the station"\n"research shows that / regular practice / improves performance"\n"he had never / in his life / felt so free"\n\nGradually increase the chunk size you can process in one eye movement.`,
          tip: 'Subvocalising every word slows reading. Chunking reduces it. With practice, you read groups of meaning.',
        },
        {
          type: 'check',
          title: `${tone.praise} Efficient Reading Complete`,
          body: 'Skimming, scanning, chunking — three strategies that make you a flexible, efficient reader.',
        },
      ],
      completionMessage: `${tone.praise} Efficient Reading lesson complete.`,
      nextSuggestion: 'cross-text-analysis',
    },

    'cross-text-analysis': {
      title: 'Cross-Text Comparison',
      objective: 'Analyse how different authors present the same topic across multiple texts',
      whyItMatters: 'Cross-text analysis is central to academic study, journalism, law, and research. Reading multiple texts on the same topic produces significantly deeper understanding than reading a single source.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Same Topic, Different Perspectives`,
          body: `When comparing texts, analyse:\n\n1. CONTENT — what is included or excluded?\n2. PERSPECTIVE — what is the author's viewpoint?\n3. TONE — formal, informal, emotive, objective?\n4. EVIDENCE — what types of evidence are used?\n5. PURPOSE — inform, persuade, challenge?\n\nKey question: why do two authors cover the same topic differently?`,
          tip: 'Use a comparison table: Topic | Text A | Text B | Similarities | Differences.',
        },
        {
          type: 'exercise',
          title: 'Comparing Perspectives',
          body: `Text A (Charity Report): "Food banks have seen a 30% increase in demand. This demonstrates the failure of current welfare policy to protect the most vulnerable."\n\nText B (Government Statement): "Food bank usage reflects complex factors including public awareness and the excellent work of the voluntary sector."`,
          prompt: 'Which best describes the difference between the two texts?',
          options: [
            'Text A blames policy failure; Text B emphasises charity work and avoids blame',
            'Both equally blame the government',
            'Text B is entirely factual while Text A is entirely opinion',
          ],
          correctIndex: 0,
          tip: 'Same fact (increased usage) — completely different interpretation. Perspective shapes how facts are presented.',
        },
        {
          type: 'practice',
          title: 'Analytical Comparison',
          body: `Compare the two food bank texts and answer:\n\n1. What does Text A explicitly blame?\n2. What does Text B emphasise instead?\n3. What fact do both reference?\n4. Which text uses more emotive language? Give one example.\n5. Which source would you trust more for unbiased data — and why?\n\nWrite 5–6 sentences comparing the two texts.`,
          tip: 'Start with agreements, then analyse differences, then evaluate which is more credible.',
        },
        {
          type: 'exercise',
          title: 'Evaluating Reliability',
          body: 'Text A: charity advocacy report. Text B: government press release.',
          prompt: 'Which source is most likely to present unbiased data?',
          options: [
            'The charity — charities always tell the truth',
            'The government — official sources are neutral',
            'Neither — both have interests; an independent academic study would be most reliable',
          ],
          correctIndex: 2,
          tip: 'Both have agendas. Charities highlight need; governments show policy success. Independent research is more reliable.',
        },
        {
          type: 'check',
          title: `${tone.praise} Cross-Text Comparison Complete`,
          body: 'Content, perspective, tone, evidence, purpose — five dimensions of cross-text analysis for any contested topic.',
        },
      ],
      completionMessage: `${tone.praise} Cross-Text Comparison lesson complete.`,
      nextSuggestion: 'metacognition',
    },

    'metacognition': {
      title: 'Thinking About Your Reading',
      objective: 'Monitor, regulate, and improve comprehension using metacognitive strategies',
      whyItMatters: 'Metacognition is identified by major research reviews (including Hattie\'s Visible Learning) as having one of the largest positive effects on academic achievement. In reading, it means knowing when you understand and when you don\'t.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Reading About Your Own Reading`,
          body: `Metacognitive readers:\n✓ Monitor: "Do I understand this?"\n✓ Identify: "Where did I lose the thread?"\n✓ Repair: "What should I do about it?"\n\nFix-up strategies when comprehension breaks down:\n• Re-read from the last clear sentence\n• Slow down\n• Check unfamiliar words using context\n• Read ahead for clarification\n• Visualise what is described\n• Ask: "What is the author trying to say?"`,
          tip: 'The moment you realise you\'ve read a paragraph but can\'t remember it — stop. That awareness IS metacognition. Now deploy a fix-up strategy.',
        },
        {
          type: 'exercise',
          title: 'Comprehension Monitoring',
          body: 'You are reading and notice that a paragraph didn\'t make sense. On re-reading, you find one unfamiliar word.',
          prompt: 'What is the most effective immediate fix-up strategy?',
          options: [
            'Skip the word and keep reading',
            'Use context clues to guess the meaning, then re-read the paragraph',
            'Stop reading and look up every word you don\'t know',
          ],
          correctIndex: 1,
          tip: 'Context clues first — often sufficient. If the word is central to meaning, then look it up. Skipping key vocabulary causes cascading comprehension failures.',
        },
        {
          type: 'practice',
          title: 'Metacognitive Reading Log',
          body: `Read any text for 10 minutes. Keep a log as you read:\n\nPara: ___ | Understood? Y/N | If N, what was the problem? | Strategy used:\n____________________________________________________________\n\nAfter 10 minutes:\n• How many comprehension breakdowns did you notice?\n• Which fix-up strategy worked best?`,
          tip: 'Noticing breakdowns is a sign of reading maturity. Poor readers often don\'t notice. Good readers catch and fix.',
        },
        {
          type: 'practice',
          title: 'Visualisation Strategy',
          body: `Read slowly and build a mental image:\n\n"The synapse is a microscopic gap between two neurons. When a signal arrives, it triggers release of neurotransmitters — chemical messengers — from vesicles in the pre-synaptic terminal. These cross the gap and bind to receptors on the post-synaptic neuron, either exciting or inhibiting the next signal."\n\nDraw a simple diagram of what you visualised.\nThen re-read: does your diagram match the text?`,
          tip: 'Drawing forces you to make explicit what you understood. Mismatches reveal misunderstanding — metacognition in action.',
        },
        {
          type: 'check',
          title: `${tone.praise} Metacognition Complete`,
          body: 'Monitor, identify, repair. You now read with self-awareness — the hallmark of an expert, strategic reader.',
        },
      ],
      completionMessage: `${tone.praise} Metacognition lesson complete.`,
      nextSuggestion: 'challenging-texts',
    },

    'challenging-texts': {
      title: 'Challenging Text Practice',
      objective: 'Apply all reading strategies to dense, complex academic or literary texts',
      whyItMatters: 'Expert reading is the ability to persist with and make sense of genuinely difficult text. Research shows regular practice with challenging material produces the greatest skill gains in both fluency and comprehension.',
      steps: [
        {
          type: 'instruction',
          title: `${tone.intro} Embracing Difficulty`,
          body: `Expert readers embrace challenging texts because they know:\n• Difficulty means growth\n• Confusion is temporary with the right strategies\n• Dense text requires slow, deliberate reading\n\nFull toolkit for challenging text:\n1. Preview structure and headings\n2. Activate prior knowledge\n3. Read one paragraph at a time\n4. Annotate actively\n5. Summarise each section\n6. Use context clues for vocabulary\n7. Monitor comprehension throughout\n8. Re-read when lost`,
          tip: '"Desirable difficulty" is a real cognitive science concept — harder processing produces stronger, more durable memory.',
        },
        {
          type: 'practice',
          title: 'Tackle a Difficult Passage',
          body: `Read this dense academic text. Apply your full toolkit:\n\n"Epigenetics refers to heritable changes in gene expression that do not involve alterations to the underlying DNA sequence. These changes — including DNA methylation and histone modification — can be influenced by environmental factors such as diet, stress, and exposure to toxins. Crucially, some epigenetic modifications can be transmitted across generations, suggesting that the experiences of parents may affect the gene expression of their offspring, complicating traditional models of genetic inheritance."\n\n1. Topic?\n2. Define "epigenetics" in your own words.\n3. What can cause epigenetic changes?\n4. Why is this finding surprising?`,
          tip: 'Don\'t expect to understand everything on first read. Once for gist, once for detail.',
        },
        {
          type: 'exercise',
          title: 'Checking Understanding',
          body: 'Based on the epigenetics passage:',
          prompt: 'Which statement is supported by the passage?',
          options: [
            'DNA sequence changes when environment changes',
            'Parents\' experiences may affect their children\'s gene expression',
            'Epigenetics only applies to stress responses',
          ],
          correctIndex: 1,
          tip: '"Some epigenetic modifications can be transmitted across generations, suggesting experiences of parents may affect offspring." — directly stated.',
        },
        {
          type: 'practice',
          title: 'Full-Strategy Session',
          body: `Apply ALL strategies to the epigenetics passage:\n\n1. Annotate: underline main ideas, circle technical terms, write one question in the margin\n2. Vocabulary: use context to define "heritable" and "modifications"\n3. Summary: write 2 sentences summarising the passage\n4. Critical: what questions does this raise that the text doesn\'t answer?\n5. Connect: how does this relate to what you already know about genetics?`,
          tip: 'Connecting new information to existing knowledge is the deepest form of processing. It dramatically improves retention.',
        },
        {
          type: 'check',
          title: `${tone.praise} Challenging Text Complete`,
          body: 'You tackled a genuinely difficult academic text using a full strategic toolkit. This is expert-level reading. Keep seeking challenging material — that\'s how skills grow.',
        },
      ],
      completionMessage: `${tone.praise} Challenging Texts lesson complete. You have completed the full NB-L8 level — an advanced, strategic reader.`,
      nextSuggestion: '',
    },
  }

  // Default fallback for any slug not explicitly defined
  const defaultContent: LessonContent = {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    objective: `Build ${slug.replace(/-/g, ' ')} skills at the ${NB_LEVELS[level].label} level`,
    whyItMatters: `This lesson addresses a key skill area at your reading level (${level}). Regular practice of targeted skills produces consistent improvement.`,
    steps: [
      {
        type: 'instruction',
        title: `${tone.intro} ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
        body: `This session focuses on ${NB_LEVELS[level].skillFocus.join(', ')}.\n\n${groupConfig.contentTone.includes('playful') ? 'Let\'s make it fun!' : 'Let\'s work through this together, step by step.'}`,
        tip: `${tone.effort}: short, consistent sessions are more effective than occasional long ones.`,
      },
      {
        type: 'practice',
        title: 'Guided Practice',
        body: `Practice the skills from ${NB_LEVELS[level].label} level.\n\nSkill areas:\n${NB_LEVELS[level].skillFocus.map(s => `• ${s}`).join('\n')}\n\nWork through each skill area using the tools available on the main training page.`,
        tip: 'Use the Full Training Toolkit for interactive exercises on each skill.',
      },
      {
        type: 'check',
        title: `${tone.praise} Well Done`,
        body: 'You completed this practice session. Come back tomorrow to continue building your skills.',
      },
    ],
    completionMessage: `${tone.praise} Practice session complete.`,
    nextSuggestion: '',
  }

  return LESSON_MAP[slug] ?? defaultContent
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive exercise step component
// ─────────────────────────────────────────────────────────────────────────────
function ExerciseStep({
  step,
  onCorrect,
}: {
  step: LessonStep
  onCorrect: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleCheck = () => {
    setRevealed(true)
    onCorrect()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{step.body}</p>
      {step.prompt && (
        <p className="text-sm font-semibold text-foreground">{step.prompt}</p>
      )}
      {step.options && (
        <div className="flex flex-col gap-2">
          {step.options.map((opt, i) => {
            const isSelected = selected === i
            const showResult = revealed
            const isRight = i === step.correctIndex
            return (
              <button
                key={i}
                onClick={() => { if (!revealed) setSelected(i) }}
                disabled={revealed}
                className={[
                  'block w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all',
                  !revealed && isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : '',
                  !revealed && !isSelected ? 'border-border hover:border-blue-300' : '',
                  showResult && isRight ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200 font-medium' : '',
                  showResult && isSelected && !isRight ? 'border-red-400 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300' : '',
                ].filter(Boolean).join(' ')}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {step.options && !revealed && (
        <Button
          onClick={handleCheck}
          disabled={selected === null}
          className="w-full"
        >
          Check Answer
        </Button>
      )}

      {revealed && step.tip && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-200">{step.tip}</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [saved, setSaved] = useState<SavedTrainingResult | null>(null)
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepDone, setStepDone] = useState<Set<number>>(new Set())
  const [lessonComplete, setLessonComplete] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSaved(loadTrainingResult())
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading lesson…</p>
      </div>
    )
  }

  const level = saved?.placement.level ?? 'NB-L1'
  const group: LearnerGroup = (saved?.placement.learnerGroup as LearnerGroup) ?? 'adult'
  const levelConfig = NB_LEVELS[level as NBLevel]
  const lesson = getLessonContent(slug, level as NBLevel, group)
  const totalSteps = lesson.steps.length
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100)

  const markCurrentDone = () => {
    setStepDone(prev => new Set(prev).add(currentStep))
  }

  const handleNext = () => {
    markCurrentDone()
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1)
    } else {
      markLessonComplete(slug)
      setLessonComplete(true)
    }
  }

  const containerCls = 'max-w-2xl mx-auto px-4'
  const step = lesson.steps[currentStep]

  // ── Lesson complete view ─────────────────────────────────────────────────
  if (lessonComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className={`${containerCls} py-10 space-y-6`}>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Lesson Complete!</h1>
            <p className="text-muted-foreground">{lesson.completionMessage}</p>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">All {totalSteps} steps completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-4">
              <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground">Level: <span className={`font-semibold ${levelConfig.color}`}>{levelConfig.label}</span></p>
                <p className="text-xs text-muted-foreground">{level}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/dyslexia-reading-training/plan">
              <Button className="w-full gap-2">
                <ChevronRight className="w-4 h-4" />
                Back to My Training Plan
              </Button>
            </Link>
            {lesson.nextSuggestion && (
              <Link href={`/dyslexia-reading-training/plan/lesson/${lesson.nextSuggestion}`}>
                <Button variant="outline" className="w-full gap-2">
                  <Play className="w-4 h-4" />
                  Next Lesson
                </Button>
              </Link>
            )}
            <Link href="/dyslexia-reading-training">
              <Button variant="ghost" className="w-full gap-2">
                <BookOpen className="w-4 h-4" />
                Open Full Practice Toolkit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Active lesson view ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className={`${containerCls} py-3 flex items-center gap-3`}>
          <Link
            href="/dyslexia-reading-training/plan"
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Back to plan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">Step {currentStep + 1} of {totalSteps}</p>
          </div>
          <Badge variant="outline" className={`flex-shrink-0 text-xs ${levelConfig.color}`}>
            {level}
          </Badge>
        </div>
      </header>

      <main className={`${containerCls} py-6 space-y-6`}>

        {/* Lesson meta */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">{lesson.title}</p>
          <h1 className="text-xl font-bold text-foreground">{step.title}</h1>
        </div>

        {/* Why it matters — shown only on first step */}
        {currentStep === 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Why this matters</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{lesson.whyItMatters}</p>
            </div>
          </div>
        )}

        {/* Step content */}
        <div className="space-y-4">
          {step.type === 'exercise' ? (
            <ExerciseStep
              key={currentStep}
              step={step}
              onCorrect={markCurrentDone}
            />
          ) : (
            <>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{step.body}</p>
              {step.tip && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">{step.tip}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Audio placeholder */}
        {(step.type === 'instruction' || step.type === 'practice') && (
          <button
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(step.body)
                utterance.rate = 0.85
                window.speechSynthesis.speak(utterance)
              }
            }}
          >
            <Volume2 className="w-4 h-4" />
            Read aloud (Text-to-Speech)
          </button>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-border">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(s => s - 1)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          {step.type !== 'exercise' && (
            <Button onClick={handleNext} className="flex-1 gap-2">
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Lesson
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
          {step.type === 'exercise' && stepDone.has(currentStep) && (
            <Button onClick={handleNext} className="flex-1 gap-2">
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Lesson
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Restart */}
        <button
          onClick={() => { setCurrentStep(0); setStepDone(new Set()) }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <RotateCcw className="w-3 h-3" />
          Restart lesson
        </button>

      </main>
    </div>
  )
}

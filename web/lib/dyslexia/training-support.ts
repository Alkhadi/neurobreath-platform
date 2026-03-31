import type { AgeGroup } from '@/lib/dyslexia/assessment-store';

export interface SupportLink {
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

export interface TaskSupport {
  examples: string[];
  links: SupportLink[];
}

export interface CategorySupport {
  title: string;
  description: string;
  quickWins: string[];
  example: string;
  links: SupportLink[];
}

export interface PracticeExample {
  title: string;
  timing: string;
  summary: string;
  steps: string[];
  example: string;
  links: SupportLink[];
}

export interface AudioResourceGroup {
  heading: string;
  summary: string;
  resources: SupportLink[];
  starterPlan: string[];
}

export const dyslexiaAgeLabels: Record<AgeGroup, string> = {
  preschool: 'Preschool (3-5 years)',
  primary: 'Primary School (5-11 years)',
  secondary: 'Secondary School (11-18 years)',
  adult: 'Adult (18-64 years)',
  senior: 'Senior (65+ years)',
};

export const dyslexiaCategoryLabels: Record<string, string> = {
  reading: 'Reading',
  phonics: 'Phonics',
  phonological: 'Phonological Awareness',
  spelling: 'Spelling',
  comprehension: 'Comprehension',
  visual: 'Visual Processing',
  processing: 'Processing Speed',
  memory: 'Working Memory',
  writing: 'Written Expression',
  executive: 'Executive Function',
  language: 'Language',
  learning: 'New Learning',
  emotional: 'Confidence & Wellbeing',
  spatial: 'Spatial Awareness',
  speech: 'Speech & Language',
  literacy: 'Early Literacy',
};

export const trainingResourceLinks = {
  audioLibrary: {
    label: 'Audio & Podcast Library',
    href: '/conditions/dyslexia/training/audio-library',
    description: 'Trusted audiobook, podcast, and spoken-audio links by age.',
  },
  practiceLibrary: {
    label: 'Practice Library',
    href: '/conditions/dyslexia/training/practice-library',
    description: 'Age-based routine examples and category-specific support ideas.',
  },
  trainingSuite: {
    label: 'Reading Training Suite',
    href: '/dyslexia-reading-training',
    description: 'Interactive phonics, fluency, vocabulary, and timer tools.',
  },
  phonics: {
    label: 'Phonics Player',
    href: '/dyslexia-reading-training#phonics',
    description: 'Letter-sound practice and guided phonics review.',
  },
  blending: {
    label: 'Blending Lab',
    href: '/dyslexia-reading-training#blending',
    description: 'Interactive sound blending and segmentation practice.',
  },
  syllables: {
    label: 'Syllable Splitter',
    href: '/dyslexia-reading-training#syllables',
    description: 'Break longer words into manageable syllable chunks.',
  },
  morphology: {
    label: 'Morphology Master',
    href: '/dyslexia-reading-training#morphology',
    description: 'Prefix, suffix, and root-word practice.',
  },
  fluency: {
    label: 'Fluency Pacer',
    href: '/dyslexia-reading-training#fluency',
    description: 'Timed repeated-reading support for fluency building.',
  },
  timer: {
    label: 'Practice Timer',
    href: '/dyslexia-reading-training#practice-timer',
    description: 'Use a short-focus timer for reading, writing, and planning tasks.',
  },
  storynory: {
    label: 'Storynory',
    href: 'https://www.storynory.com/',
    description: 'Free audio stories for younger listeners.',
    external: true,
  },
  bbcSounds: {
    label: 'BBC Sounds',
    href: 'https://www.bbc.co.uk/sounds/podcasts?sort=latest',
    description: 'Podcasts, radio, and spoken-word listening across topics.',
    external: true,
  },
  librivox: {
    label: 'LibriVox',
    href: 'https://librivox.org/',
    description: 'Free public-domain audiobooks for independent listening.',
    external: true,
  },
  rnib: {
    label: 'RNIB Talking Books',
    href: 'https://www.rnib.org.uk/talking-books-service',
    description: 'Accessible audiobook support and talking books.',
    external: true,
  },
  ted: {
    label: 'TED Talks Daily',
    href: 'https://www.ted.com/podcasts/ted-talks-daily',
    description: 'Short spoken explainers for adults and older teens.',
    external: true,
  },
  bookshare: {
    label: 'Bookshare',
    href: 'https://www.bookshare.org/',
    description: 'Accessible books with text-to-speech support.',
    external: true,
  },
  learningAlly: {
    label: 'Learning Ally',
    href: 'https://www.learningally.org/',
    description: 'Human-read audiobooks for learners with dyslexia.',
    external: true,
  },
  libby: {
    label: 'Libby',
    href: 'https://libby.app/',
    description: 'Borrow audiobooks and ebooks free with a library card.',
    external: true,
  },
} satisfies Record<string, SupportLink>;

export const essentialAudioPlatforms: SupportLink[] = [
  trainingResourceLinks.storynory,
  trainingResourceLinks.bbcSounds,
  trainingResourceLinks.rnib,
  trainingResourceLinks.librivox,
  trainingResourceLinks.bookshare,
  trainingResourceLinks.learningAlly,
  trainingResourceLinks.libby,
  trainingResourceLinks.ted,
];

export const taskSupportById: Record<string, TaskSupport> = {
  'pr-1': {
    examples: [
      'Sing a familiar rhyme and pause before the rhyming word so the child can fill it in.',
      'Play "I spy something that starts with /b/" while getting dressed or driving.',
    ],
    links: [trainingResourceLinks.blending, trainingResourceLinks.audioLibrary, trainingResourceLinks.storynory],
  },
  'pr-2': {
    examples: [
      'Trace one letter in sand or shaving foam and say the sound three times.',
      'Build one letter from playdough and name a word that starts with that sound.',
    ],
    links: [trainingResourceLinks.phonics, trainingResourceLinks.practiceLibrary],
  },
  'pr-3': {
    examples: [
      'Point under each word in a picture book and ask "Who was in the story?" afterwards.',
      'Read one page together, then ask what happened first and what happened next.',
    ],
    links: [trainingResourceLinks.trainingSuite, trainingResourceLinks.practiceLibrary],
  },
  'pr-4': {
    examples: [
      'Retell the day using "first, next, last" and encourage a full spoken sentence.',
      'Pick three toys and make up a mini story that includes a beginning, middle, and end.',
    ],
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.practiceLibrary],
  },
  'pm-1': {
    examples: [
      'Review five sounds such as sh, ch, th, ai, and oa using say-write-read.',
      'Match each sound card to one real word before school starts.',
    ],
    links: [trainingResourceLinks.phonics, trainingResourceLinks.practiceLibrary],
  },
  'pm-2': {
    examples: [
      'Read a 100-word decodable passage once for accuracy, then twice for smoother reading.',
      'Echo read one sentence at a time with an adult or a recorded model.',
    ],
    links: [trainingResourceLinks.fluency, trainingResourceLinks.audioLibrary],
  },
  'pm-3': {
    examples: [
      'Practice five spellings with Look-Say-Cover-Write-Check and highlight the tricky part.',
      'Say the word aloud before covering it so the sound pattern is reinforced.',
    ],
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.morphology],
  },
  'pm-4': {
    examples: [
      'Listen to one chapter and tell back three things that happened.',
      'Follow the printed text with a finger or ruler while the audio plays.',
    ],
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.storynory, trainingResourceLinks.librivox],
  },
  'sc-1': {
    examples: [
      'Review five subject words before school and use each in one spoken sentence.',
      'Split revision into two-minute bursts by subject so the list stays manageable.',
    ],
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.morphology],
  },
  'sc-2': {
    examples: [
      'Use text-to-speech for one article and highlight only three key lines while listening.',
      'Pause at the end of each section and summarise it in a single sentence.',
    ],
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.trainingSuite],
  },
  'sc-3': {
    examples: [
      'Plan a PEEL paragraph in a four-box note before writing a full response.',
      'Draft first and only edit once the timer has ended.',
    ],
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.timer],
  },
  'sc-4': {
    examples: [
      'Run one 25/5 session for homework and write the single target before you start.',
      'Use the break to stretch or drink water instead of opening another app.',
    ],
    links: [trainingResourceLinks.timer, trainingResourceLinks.practiceLibrary],
  },
  'ad-1': {
    examples: [
      'Use a simple prompt such as "Today I want to make progress on..." and write three lines only.',
      'Ignore spelling, punctuation, and neatness during the five-minute draft.',
    ],
    links: [trainingResourceLinks.practiceLibrary],
  },
  'ad-2': {
    examples: [
      'Dictate a rough email in one go, then edit for clarity and structure afterwards.',
      'Speak meeting notes into bullet points before polishing them into a final version.',
    ],
    links: [trainingResourceLinks.practiceLibrary],
  },
  'ad-3': {
    examples: [
      'Listen to one short work or interest podcast and record two new words or ideas.',
      'Pause once halfway through and say a one-sentence summary aloud or into your phone.',
    ],
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.bbcSounds, trainingResourceLinks.ted],
  },
  'ad-4': {
    examples: [
      'Write three wins from today and one dyslexic strength you used.',
      'Finish the sentence: "Today my dyslexia helped me because..."',
    ],
    links: [trainingResourceLinks.practiceLibrary],
  },
  'sr-1': {
    examples: [
      'Choose a familiar presenter or topic and listen with no pressure to take notes.',
      'After listening, tell someone one new thing you heard or enjoyed.',
    ],
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.bbcSounds],
  },
  'sr-2': {
    examples: [
      'Do one crossword or word-search block using large print or tablet zoom if needed.',
      'Read tricky answers aloud slowly to connect sound, meaning, and spelling.',
    ],
    links: [trainingResourceLinks.practiceLibrary],
  },
  'sr-3': {
    examples: [
      'Listen to one chapter from a book you always wanted to read but found tiring in print.',
      'Adjust playback speed only if it makes listening more comfortable.',
    ],
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.rnib, trainingResourceLinks.librivox],
  },
  'sr-4': {
    examples: [
      'Record a two-minute story from childhood, work life, or family history.',
      'Use voice dictation if you want a written version without hand-writing it first.',
    ],
    links: [trainingResourceLinks.practiceLibrary],
  },
};

export const categorySupportById: Record<string, CategorySupport> = {
  reading: {
    title: 'Reading load support',
    description: 'Reduce decoding pressure while still practicing fluency and understanding every day.',
    quickWins: [
      'Use a short passage at a comfortable level and read it three times.',
      'Pair print with audio for the first read, then try one independent re-read.',
      'Track only one or two tricky words instead of correcting everything.',
    ],
    example: 'Try: listen to a short paragraph once, read it aloud once, then tell back the main idea in your own words.',
    links: [trainingResourceLinks.fluency, trainingResourceLinks.audioLibrary, trainingResourceLinks.practiceLibrary],
  },
  phonics: {
    title: 'Phonics rebuild',
    description: 'Go back to explicit sound-letter mapping and keep the practice multisensory.',
    quickWins: [
      'Review five grapheme-phoneme pairs only.',
      'Say the sound, write the letter, then read one matching word.',
      'Revisit mastered sounds weekly so they stay automatic.',
    ],
    example: 'Try: sh -> say /sh/, write sh, then read ship, shop, and fish.',
    links: [trainingResourceLinks.phonics, trainingResourceLinks.blending, trainingResourceLinks.practiceLibrary],
  },
  phonological: {
    title: 'Sound awareness practice',
    description: 'Build the ability to hear, split, blend, and manipulate sounds before expecting smooth reading.',
    quickWins: [
      'Play rhyme and alliteration games for five minutes.',
      'Clap syllables in long words before reading them.',
      'Blend sounds orally before showing the printed word.',
    ],
    example: 'Try: say /c/ /a/ /t/ aloud, blend it together, then find cat in print.',
    links: [trainingResourceLinks.blending, trainingResourceLinks.practiceLibrary],
  },
  spelling: {
    title: 'Spelling without overload',
    description: 'Use small word sets and consistent routines so spelling becomes more automatic over time.',
    quickWins: [
      'Practice no more than five words in one sitting.',
      'Highlight the tricky chunk before covering the word.',
      'Group words by pattern, root, prefix, or suffix.',
    ],
    example: 'Try: look at because, say it, cover it, write it, then check only the tricky part first.',
    links: [trainingResourceLinks.morphology, trainingResourceLinks.practiceLibrary],
  },
  comprehension: {
    title: 'Meaning-making support',
    description: 'Comprehension improves when reading is slowed down and meaning is checked in the moment.',
    quickWins: [
      'Preview headings and images before reading.',
      'Pause after each chunk to summarise in one sentence.',
      'Use audiobooks or TTS for access, then talk or jot key points afterwards.',
    ],
    example: 'Try: before reading, ask "What do I think this is about?" and check the answer after the first paragraph.',
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.practiceLibrary, trainingResourceLinks.trainingSuite],
  },
  visual: {
    title: 'Visual comfort adjustments',
    description: 'Reduce visual stress so the person can stay with the text for longer and with less fatigue.',
    quickWins: [
      'Try cream or pale yellow backgrounds instead of bright white.',
      'Use a ruler, finger, or reading window to hold the line.',
      'Increase spacing or font size on screen when possible.',
    ],
    example: 'Try: read the same page with and without a tinted background and compare comfort, not speed.',
    links: [trainingResourceLinks.trainingSuite, trainingResourceLinks.practiceLibrary],
  },
  processing: {
    title: 'Processing pace support',
    description: 'Prime the brain before reading and break tasks into smaller chunks.',
    quickWins: [
      'Skim headings before starting the full text.',
      'Read or listen to one short chunk at a time.',
      'Repeat the key instruction aloud before acting on it.',
    ],
    example: 'Try: read the first sentence, pause, say what it means, then continue.',
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.audioLibrary],
  },
  memory: {
    title: 'Working memory relief',
    description: 'Take pressure off memory by making the steps visible and repeatable.',
    quickWins: [
      'Limit new items to three at a time.',
      'Use flashcards or a daily review loop for spelling and vocabulary.',
      'Say steps aloud while doing them.',
    ],
    example: 'Try: write a three-step checklist before starting a reading or writing task.',
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.timer],
  },
  writing: {
    title: 'Writing with less friction',
    description: 'Separate idea generation from spelling and editing so writing feels possible again.',
    quickWins: [
      'Plan quickly, draft freely, edit later.',
      'Use voice-to-text for first drafts when ideas move faster than typing.',
      'Set a short timer and stop only when it ends.',
    ],
    example: 'Try: speak your paragraph into the device first, then edit only for clarity on the second pass.',
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.timer],
  },
  executive: {
    title: 'Routine and planning support',
    description: 'Regular timing and clear next steps reduce start-up resistance and missed tasks.',
    quickWins: [
      'Practice at the same time each day whenever possible.',
      'Write the one task you are starting before the timer begins.',
      'Prepare books, headphones, or prompts the night before.',
    ],
    example: 'Try: one 25-minute focus block with a single visible checklist and no app switching.',
    links: [trainingResourceLinks.timer, trainingResourceLinks.practiceLibrary],
  },
  language: {
    title: 'Language load support',
    description: 'Pre-teach meaning and sentence use so unfamiliar words stop blocking understanding.',
    quickWins: [
      'Teach the word, meaning, and one example sentence together.',
      'Compare new words with simpler synonyms.',
      'Revisit the same word in speech before expecting it in writing.',
    ],
    example: 'Try: learn one subject word, say what it means, and use it in one spoken example before reading it in context.',
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.audioLibrary],
  },
  learning: {
    title: 'New-learning support',
    description: 'New systems and procedures land better when the steps are modeled and recorded.',
    quickWins: [
      'Teach one new procedure at a time.',
      'Create a written or voice-note version of the steps.',
      'Review the same process again the next day.',
    ],
    example: 'Try: after someone explains a new process, record your own step-by-step version on your phone.',
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.audioLibrary],
  },
  emotional: {
    title: 'Confidence and wellbeing support',
    description: 'Low-pressure success experiences are part of literacy support, not an optional extra.',
    quickWins: [
      'Choose interest-led material instead of "worthy" material.',
      'Keep one visible record of wins and strengths.',
      'Avoid surprise read-aloud or public correction where possible.',
    ],
    example: 'Try: end the day with one success, one strength, and one thing to repeat tomorrow.',
    links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.audioLibrary],
  },
  spatial: {
    title: 'Directional and layout support',
    description: 'Use external cues for orientation instead of relying on memory in the moment.',
    quickWins: [
      'Color-code left and right or key sections of a page.',
      'Use arrows, boxes, and visual markers on notes.',
      'Talk through directions aloud before acting on them.',
    ],
    example: 'Try: add a colored dot to the left side of a notebook or planner as a reliable cue.',
    links: [trainingResourceLinks.practiceLibrary],
  },
  speech: {
    title: 'Speech and oral language support',
    description: 'Strong spoken-language routines create the foundation for later reading and spelling growth.',
    quickWins: [
      'Use nursery rhymes, chants, and rhythm every day.',
      'Repeat tricky words slowly and clearly.',
      'Retell simple stories in order.',
    ],
    example: 'Try: clap the beats in a word, say it slowly, then say it again at normal speed.',
    links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.practiceLibrary],
  },
  literacy: {
    title: 'Early literacy support',
    description: 'Make print visible, playful, and linked to speech all through the day.',
    quickWins: [
      'Point to names, labels, and signs in the environment.',
      'Match a letter to its sound during play.',
      'Read aloud daily with a finger under the words.',
    ],
    example: 'Try: choose one letter of the day and notice it on labels, toys, and books.',
    links: [trainingResourceLinks.phonics, trainingResourceLinks.practiceLibrary],
  },
};

export const ageRelevantCategories: Record<AgeGroup, string[]> = {
  preschool: ['speech', 'phonological', 'literacy', 'memory', 'processing', 'visual'],
  primary: ['reading', 'phonics', 'spelling', 'comprehension', 'writing', 'memory', 'processing', 'visual'],
  secondary: ['reading', 'spelling', 'comprehension', 'writing', 'executive', 'processing', 'phonological', 'language'],
  adult: ['reading', 'spelling', 'writing', 'executive', 'learning', 'comprehension', 'emotional', 'spatial'],
  senior: ['reading', 'spelling', 'writing', 'comprehension', 'memory', 'learning', 'emotional'],
};

export const practiceExamplesByAge: Record<AgeGroup, PracticeExample[]> = {
  preschool: [
    {
      title: 'Breakfast rhyme warm-up',
      timing: 'Morning',
      summary: 'A playful five-minute sound game before the day gets busy.',
      steps: [
        'Choose one simple word such as cat.',
        'Take turns saying rhyming words, real or silly.',
        'End by clapping the beats in one longer word.',
      ],
      example: 'Prompt: "Cat... what rhymes with cat?"',
      links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.storynory],
    },
    {
      title: 'Letter-in-sand practice',
      timing: 'Mid-morning',
      summary: 'Use touch and movement to build one letter-sound connection at a time.',
      steps: [
        'Pick one letter only.',
        'Trace it in sand, foam, or rice while saying the sound.',
        'Name one object that begins with that sound.',
      ],
      example: 'Prompt: "This is m. It says /m/. What starts with /m/?"',
      links: [trainingResourceLinks.phonics, trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'Point-and-predict picture book',
      timing: 'Afternoon',
      summary: 'Keep shared reading active without making the child decode every word.',
      steps: [
        'Point under the words while reading aloud.',
        'Pause once to ask what might happen next.',
        'Ask one simple recall question at the end.',
      ],
      example: 'Prompt: "What do you think the character will do next?"',
      links: [trainingResourceLinks.trainingSuite, trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'Bedtime story retell',
      timing: 'Evening',
      summary: 'Retelling builds sequencing, memory, and expressive language.',
      steps: [
        'Ask for the beginning, middle, and end.',
        'Accept gestures, drawings, or short phrases if full sentences feel hard.',
        'Celebrate effort, not accuracy.',
      ],
      example: 'Prompt: "First... next... last..."',
      links: [trainingResourceLinks.practiceLibrary],
    },
  ],
  primary: [
    {
      title: 'Before-school sound review',
      timing: 'Morning',
      summary: 'A short structured phonics check-in is enough to keep momentum.',
      steps: [
        'Review five sounds only.',
        'Say, write, and read one word for each sound.',
        'Stop while the child still feels successful.',
      ],
      example: 'Prompt: "ai says /ai/ - can you read rain?"',
      links: [trainingResourceLinks.phonics, trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'After-school decodable re-read',
      timing: 'Afternoon',
      summary: 'Familiar text lets accuracy turn into fluency.',
      steps: [
        'Choose a short matched passage.',
        'Read once for accuracy and twice for smoother reading.',
        'Circle one word that still feels sticky.',
      ],
      example: 'Prompt: "Which word still needs one more go?"',
      links: [trainingResourceLinks.fluency, trainingResourceLinks.audioLibrary],
    },
    {
      title: 'Colour-coded spelling routine',
      timing: 'Evening',
      summary: 'Keep spelling multisensory and predictable.',
      steps: [
        'Look at the word and highlight the tricky part.',
        'Say it aloud, cover it, then write it from memory.',
        'Check and praise what was right first.',
      ],
      example: 'Prompt: "The tricky bit in because is..."',
      links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.morphology],
    },
    {
      title: 'Bedtime audiobook follow-along',
      timing: 'Bedtime',
      summary: 'Listening with the printed text supports vocabulary without heavy decoding load.',
      steps: [
        'Choose a story the child actually likes.',
        'Follow the words with a finger or ruler if that helps.',
        'End with one favourite moment from the chapter.',
      ],
      example: 'Prompt: "Tell me your favourite part in one sentence."',
      links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.storynory, trainingResourceLinks.libby],
    },
  ],
  secondary: [
    {
      title: 'Five-word subject starter',
      timing: 'Morning',
      summary: 'Short vocabulary review reduces the reading load later in the day.',
      steps: [
        'Choose five subject words for one lesson.',
        'Say the word, meaning, and one spoken example.',
        'Mark the hardest word for another review tonight.',
      ],
      example: 'Prompt: "Define it in your own words, not the textbook words."',
      links: [trainingResourceLinks.morphology, trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'TTS plus three highlights',
      timing: 'After school',
      summary: 'Use audio access, but still stay active while reading.',
      steps: [
        'Run TTS or audiobook for the reading block.',
        'Highlight only three key lines or ideas.',
        'Summarise them in three bullets afterwards.',
      ],
      example: 'Prompt: "What are the three ideas I would revise later?"',
      links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.trainingSuite],
    },
    {
      title: 'PEEL paragraph sprint',
      timing: 'Evening',
      summary: 'Daily paragraph practice is more realistic than waiting for a full essay.',
      steps: [
        'Write Point, Evidence, Explain, Link as four prompts.',
        'Draft one paragraph only.',
        'Edit after the timer ends.',
      ],
      example: 'Prompt: "Point: My argument is..."',
      links: [trainingResourceLinks.practiceLibrary, trainingResourceLinks.timer],
    },
    {
      title: '25/5 revision block',
      timing: 'Evening',
      summary: 'One focused block with a visible target reduces overwhelm.',
      steps: [
        'Write the one task for the session.',
        'Work for 25 minutes with no switching.',
        'Take a real five-minute break before deciding on another block.',
      ],
      example: 'Prompt: "For the next 25 minutes I am only doing..."',
      links: [trainingResourceLinks.timer, trainingResourceLinks.practiceLibrary],
    },
  ],
  adult: [
    {
      title: 'Three-sentence start',
      timing: 'Morning',
      summary: 'A low-stakes writing start builds fluency without triggering perfectionism.',
      steps: [
        'Pick one prompt or one real thought from the day.',
        'Write three sentences without editing.',
        'Circle one idea worth returning to later.',
      ],
      example: 'Prompt: "Today I want to make progress on..."',
      links: [trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'Voice draft then tidy',
      timing: 'Work day',
      summary: 'Dictation removes the bottleneck between ideas and written output.',
      steps: [
        'Speak the whole message first.',
        'Break the transcription into bullets or short paragraphs.',
        'Edit for clarity before grammar and spelling.',
      ],
      example: 'Prompt: "Here is the main point of my email..."',
      links: [trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'Interest-led lunch listening',
      timing: 'Lunch',
      summary: 'Listening to good spoken content grows vocabulary and professional confidence.',
      steps: [
        'Choose one short podcast or audiobook chapter.',
        'Pause once to capture a note or voice memo.',
        'Save two useful words or ideas.',
      ],
      example: 'Prompt: "One useful idea from this listen was..."',
      links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.bbcSounds, trainingResourceLinks.ted],
    },
    {
      title: 'Strength-based close-down',
      timing: 'Evening',
      summary: 'Confidence grows when the day ends with evidence of progress rather than criticism.',
      steps: [
        'Write three things that went well.',
        'Name one dyslexic strength you used.',
        'Pick one routine step to repeat tomorrow.',
      ],
      example: 'Prompt: "A strength I used today was..."',
      links: [trainingResourceLinks.practiceLibrary],
    },
  ],
  senior: [
    {
      title: 'Spoken-word warm-up',
      timing: 'Morning',
      summary: 'Start with listening, where many people with lifelong dyslexia feel strongest.',
      steps: [
        'Choose a familiar topic or presenter.',
        'Listen for one clear takeaway.',
        'Say that takeaway aloud afterwards.',
      ],
      example: 'Prompt: "The most interesting thing I heard today was..."',
      links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.bbcSounds],
    },
    {
      title: 'Comfortable print puzzle block',
      timing: 'Mid-morning',
      summary: 'Low-pressure word play can keep language active without feeling like school again.',
      steps: [
        'Use large print, zoom, or a tablet if that feels easier.',
        'Do one short puzzle only.',
        'Read answers aloud when finished.',
      ],
      example: 'Prompt: "Which clue felt easiest once I slowed down?"',
      links: [trainingResourceLinks.practiceLibrary],
    },
    {
      title: 'Audiobook comfort session',
      timing: 'Afternoon',
      summary: 'Audiobooks reopen books that may have felt closed off for years.',
      steps: [
        'Pick a book for enjoyment, not improvement.',
        'Listen in a comfortable chair with good volume and lighting.',
        'Stop while still enjoying it so it feels easy to return tomorrow.',
      ],
      example: 'Prompt: "What part do I want to come back to tomorrow?"',
      links: [trainingResourceLinks.audioLibrary, trainingResourceLinks.rnib, trainingResourceLinks.librivox],
    },
    {
      title: 'Voice memoir moment',
      timing: 'Evening',
      summary: 'Oral storytelling preserves memory while reducing writing strain.',
      steps: [
        'Record a short memory or message.',
        'Keep it to one scene or one story.',
        'Save it or transcribe it later only if you want to.',
      ],
      example: 'Prompt: "A story I want to keep is..."',
      links: [trainingResourceLinks.practiceLibrary],
    },
  ],
};

export const audioResourcesByAge: Record<AgeGroup, AudioResourceGroup> = {
  preschool: {
    heading: 'Early listening for rhythm, rhyme, and story language',
    summary: 'Keep audio playful, short, and repeatable. Re-listening is a strength, not a problem.',
    resources: [
      trainingResourceLinks.storynory,
      trainingResourceLinks.bbcSounds,
      trainingResourceLinks.libby,
      trainingResourceLinks.rnib,
    ],
    starterPlan: [
      'Choose one short rhyme or story and repeat it across the week.',
      'Pause before a rhyme ending so the child can join in.',
      'Link one favourite story to a printed picture book when possible.',
    ],
  },
  primary: {
    heading: 'Listening that builds vocabulary without overload',
    summary: 'Use enjoyable fiction plus one small amount of follow-along print to support confidence.',
    resources: [
      trainingResourceLinks.storynory,
      trainingResourceLinks.bbcSounds,
      trainingResourceLinks.libby,
      trainingResourceLinks.rnib,
    ],
    starterPlan: [
      'Pick one child-chosen fiction audio and one school-linked listen each week.',
      'Follow along in print for only a small section, not the whole chapter.',
      'End every session with one oral retell or one favourite word.',
    ],
  },
  secondary: {
    heading: 'Audio access for school reading and independent interest',
    summary: 'Split listening between curriculum support and high-interest spoken content.',
    resources: [
      trainingResourceLinks.bbcSounds,
      trainingResourceLinks.ted,
      trainingResourceLinks.bookshare,
      trainingResourceLinks.learningAlly,
    ],
    starterPlan: [
      'Use TTS or audiobook support for one subject text every day.',
      'Choose one curiosity-led podcast for enjoyment and vocabulary growth.',
      'Capture three bullets after listening instead of full notes.',
    ],
  },
  adult: {
    heading: 'Interest-led audio for learning, work, and confidence',
    summary: 'Choose spoken content that is genuinely useful or enjoyable so the habit sticks.',
    resources: [
      trainingResourceLinks.ted,
      trainingResourceLinks.bbcSounds,
      trainingResourceLinks.libby,
      trainingResourceLinks.rnib,
    ],
    starterPlan: [
      'Pick one professional podcast and one pleasure listen for the week.',
      'Pause once to save two ideas, words, or follow-up actions.',
      'Use audio at lunch or on a commute to make the routine realistic.',
    ],
  },
  senior: {
    heading: 'Comfortable spoken-word access for lifelong reading support',
    summary: 'Prioritise ease, clarity, and enjoyment. Comfort helps the routine last.',
    resources: [
      trainingResourceLinks.rnib,
      trainingResourceLinks.bbcSounds,
      trainingResourceLinks.librivox,
      trainingResourceLinks.libby,
    ],
    starterPlan: [
      'Choose one familiar topic or narrator first.',
      'Listen in short sessions and stop before fatigue sets in.',
      'Share one takeaway or story afterwards to reinforce memory.',
    ],
  },
};

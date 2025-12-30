// dlx-phonics-curriculum-phase-2-3-5.js
// Shared phonics curriculum for NeuroBreath dyslexia hub
// Supports: Vowel Quest + Fluency Pacer
// Phases: Phase 2, Phase 3, Phase 5
// Now includes ttsClipId for audio integration.

(function () {
  window.NB_CURRICULUM = window.NB_CURRICULUM || {};
  const NB = window.NB_CURRICULUM;

  // ----------------------------------------------------
  // 1. VOWEL QUEST – PHONICS SOUND → SPELLING OPTIONS
  // ----------------------------------------------------

  NB.vowelQuest = {
    levels: [
      // -----------------------
      // PHASE 2 – SHORT VOWELS
      // -----------------------
      {
        id: "vq-p2-1",
        phase: "Phase 2",
        levelNumber: 1,
        label: "Phase 2 – Short a /e",
        description: "Short /a/ and /e/ in simple CVC words. Learner taps the spelling that matches the sound.",
        items: [
          {
            id: "vq-p2-1-1",
            phoneme: "/a/",
            displayPrompt: "Sound: /a/ (short a)",
            ttsPrompt: "Listen. Sound: a, short a.",
            ttsClipId: "vq-p2-1-1",
            options: ["a", "e", "i"],
            correctIndex: 0
          },
          {
            id: "vq-p2-1-2",
            phoneme: "/e/",
            displayPrompt: "Sound: /e/ (short e)",
            ttsPrompt: "Listen. Sound: e, short e.",
            ttsClipId: "vq-p2-1-2",
            options: ["a", "e", "o"],
            correctIndex: 1
          },
          {
            id: "vq-p2-1-3",
            phoneme: "/a/",
            displayPrompt: "Sound: /a/ (short a)",
            ttsPrompt: "Sound: a, short a.",
            ttsClipId: "vq-p2-1-3",
            options: ["a", "u", "o"],
            correctIndex: 0
          }
        ]
      },
      {
        id: "vq-p2-2",
        phase: "Phase 2",
        levelNumber: 2,
        label: "Phase 2 – Short i /o /u",
        description: "Short /i/, /o/ and /u/ vowel sounds.",
        items: [
          {
            id: "vq-p2-2-1",
            phoneme: "/i/",
            displayPrompt: "Sound: /i/ (short i)",
            ttsPrompt: "Listen. Sound: i, short i.",
            ttsClipId: "vq-p2-2-1",
            options: ["i", "e", "a"],
            correctIndex: 0
          },
          {
            id: "vq-p2-2-2",
            phoneme: "/o/",
            displayPrompt: "Sound: /o/ (short o)",
            ttsPrompt: "Listen. Sound: o, short o.",
            ttsClipId: "vq-p2-2-2",
            options: ["o", "u", "a"],
            correctIndex: 0
          },
          {
            id: "vq-p2-2-3",
            phoneme: "/u/",
            displayPrompt: "Sound: /u/ (short u)",
            ttsPrompt: "Listen. Sound: u, short u.",
            ttsClipId: "vq-p2-2-3",
            options: ["u", "o", "e"],
            correctIndex: 0
          }
        ]
      },

      // -----------------------
      // PHASE 3 – VOWEL TEAMS
      // -----------------------
      {
        id: "vq-p3-1",
        phase: "Phase 3",
        levelNumber: 3,
        label: "Phase 3 – Long ee / ai",
        description: "Phase 3 vowel teams for long /ē/ and long /ā/ spellings.",
        items: [
          {
            id: "vq-p3-1-1",
            phoneme: "/ē/",
            displayPrompt: "Sound: /ē/ (long e)",
            ttsPrompt: "Listen. Sound: ee, long e.",
            ttsClipId: "vq-p3-1-1",
            options: ["ee", "ea", "e"],
            correctIndex: 0
          },
          {
            id: "vq-p3-1-2",
            phoneme: "/ē/",
            displayPrompt: "Sound: /ē/ (long e)",
            ttsPrompt: "Listen. Sound: ee, long e.",
            ttsClipId: "vq-p3-1-2",
            options: ["ee", "ai", "oi"],
            correctIndex: 0
          },
          {
            id: "vq-p3-1-3",
            phoneme: "/ai/",
            displayPrompt: "Sound: /ai/ (long a)",
            ttsPrompt: "Listen. Sound: ai, long a.",
            ttsClipId: "vq-p3-1-3",
            options: ["ai", "ee", "oa"],
            correctIndex: 0
          }
        ]
      },
      {
        id: "vq-p3-2",
        phase: "Phase 3",
        levelNumber: 4,
        label: "Phase 3 – igh / oa / oo",
        description: "igh, oa and oo spellings with clear sound prompts.",
        items: [
          {
            id: "vq-p3-2-1",
            phoneme: "/ī/",
            displayPrompt: "Sound: /ī/ (long i)",
            ttsPrompt: "Listen. Sound: igh, long i.",
            ttsClipId: "vq-p3-2-1",
            options: ["igh", "ai", "oi"],
            correctIndex: 0
          },
          {
            id: "vq-p3-2-2",
            phoneme: "/ō/",
            displayPrompt: "Sound: /ō/ (long o)",
            ttsPrompt: "Listen. Sound: oa, long o.",
            ttsClipId: "vq-p3-2-2",
            options: ["oa", "ee", "oo"],
            correctIndex: 0
          },
          {
            id: "vq-p3-2-3",
            phoneme: "/oo/",
            displayPrompt: "Sound: /oo/ (long oo, as in moon)",
            ttsPrompt: "Listen. Sound: oo, as in moon.",
            ttsClipId: "vq-p3-2-3",
            options: ["oo", "ow", "ou"],
            correctIndex: 0
          }
        ]
      },

      // -----------------------
      // PHASE 5 – ALT SPELLINGS
      // -----------------------
      {
        id: "vq-p5-1",
        phase: "Phase 5",
        levelNumber: 5,
        label: "Phase 5 – Long a spellings",
        description: "Phase 5 alternative spellings for long /ā/: ay, ai, a-e.",
        items: [
          {
            id: "vq-p5-1-1",
            phoneme: "/ā/",
            displayPrompt: "Sound: /ā/ (long a)",
            ttsPrompt: "Long a: choose the best spelling.",
            ttsClipId: "vq-p5-1-1",
            options: ["ai", "ay", "a-e"],
            correctIndex: 1
          },
          {
            id: "vq-p5-1-2",
            phoneme: "/ā/",
            displayPrompt: "Sound: /ā/ (long a)",
            ttsPrompt: "Long a: choose the best spelling for the middle of a word.",
            ttsClipId: "vq-p5-1-2",
            options: ["ai", "ay", "a-e"],
            correctIndex: 0
          },
          {
            id: "vq-p5-1-3",
            phoneme: "/ā/",
            displayPrompt: "Sound: /ā/ (long a)",
            ttsPrompt: "Long a: choose the magic-e spelling.",
            ttsClipId: "vq-p5-1-3",
            options: ["ai", "ay", "a-e"],
            correctIndex: 2
          }
        ]
      },
      {
        id: "vq-p5-2",
        phase: "Phase 5",
        levelNumber: 6,
        label: "Phase 5 – Long e / ō / oi",
        description: "Alternative spellings for long /ē/, /ō/ and /oi/.",
        items: [
          {
            id: "vq-p5-2-1",
            phoneme: "/ē/",
            displayPrompt: "Sound: /ē/ (long e)",
            ttsPrompt: "Long e: choose the best spelling.",
            ttsClipId: "vq-p5-2-1",
            options: ["ee", "ea", "e-e"],
            correctIndex: 1
          },
          {
            id: "vq-p5-2-2",
            phoneme: "/ō/",
            displayPrompt: "Sound: /ō/ (long o)",
            ttsPrompt: "Long o: choose the best spelling.",
            ttsClipId: "vq-p5-2-2",
            options: ["oa", "ow", "o-e"],
            correctIndex: 2
          },
          {
            id: "vq-p5-2-3",
            phoneme: "/oi/",
            displayPrompt: "Sound: /oi/",
            ttsPrompt: "Sound: oi. Choose the best spelling.",
            ttsClipId: "vq-p5-2-3",
            options: ["oi", "oy", "ou"],
            correctIndex: 0
          }
        ]
      }
    ]
  };

  // ----------------------------------------------------
  // 2. FLUENCY PACER – PHASED SENTENCE LISTS
  // ----------------------------------------------------

  NB.fluencyPacer = {
    sets: [
      // -----------------------
      // PHASE 2 – CVC / SIMPLE
      // -----------------------
      {
        id: "fp-p2-1",
        phase: "Phase 2",
        levelNumber: 1,
        label: "Phase 2 – Short vowels, Set 1",
        wpmTarget: 60,
        description: "Very short, fully decodable CVC sentences with Phase 2 graphemes only.",
        sentences: [
          { text: "Sam sat on the mat.", ttsClipId: "fp-p2-1-1" },
          { text: "The cat is on the bed.", ttsClipId: "fp-p2-1-2" },
          { text: "Tom had a red cap.", ttsClipId: "fp-p2-1-3" },
          { text: "Dad sat in the big van.", ttsClipId: "fp-p2-1-4" },
          { text: "The kid hid in the hut.", ttsClipId: "fp-p2-1-5" }
        ]
      },
      {
        id: "fp-p2-2",
        phase: "Phase 2",
        levelNumber: 2,
        label: "Phase 2 – Short vowels, Set 2",
        wpmTarget: 65,
        description: "Phase 2 review sentences, still short and controlled.",
        sentences: [
          { text: "Meg met Tim at the bus.", ttsClipId: "fp-p2-2-1" },
          { text: "The dog got the big bag.", ttsClipId: "fp-p2-2-2" },
          { text: "Mum put the jam in a pot.", ttsClipId: "fp-p2-2-3" },
          { text: "The sun was hot on the hill.", ttsClipId: "fp-p2-2-4" },
          { text: "Ben can hop and jog in the mud.", ttsClipId: "fp-p2-2-5" }
        ]
      },

      // -----------------------
      // PHASE 3 – DIGRAPHS
      // -----------------------
      {
        id: "fp-p3-1",
        phase: "Phase 3",
        levelNumber: 3,
        label: "Phase 3 – Digraphs, Set 1",
        wpmTarget: 70,
        description: "Sentences with sh, ch, th, ng and simple Phase 3 vowels.",
        sentences: [
          { text: "The ship went past the rock.", ttsClipId: "fp-p3-1-1" },
          { text: "Josh had a chip and fish for tea.", ttsClipId: "fp-p3-1-2" },
          { text: "The thin moth sat on the mesh.", ttsClipId: "fp-p3-1-3" },
          { text: "A strong king sat on a long bench.", ttsClipId: "fp-p3-1-4" },
          { text: "The ring was in the soft sand.", ttsClipId: "fp-p3-1-5" }
        ]
      },
      {
        id: "fp-p3-2",
        phase: "Phase 3",
        levelNumber: 4,
        label: "Phase 3 – Vowel teams, Set 2",
        wpmTarget: 75,
        description: "Sentences using ai, ee, igh, oa, oo and ar, or, ur.",
        sentences: [
          { text: "The goat slept on a high rock.", ttsClipId: "fp-p3-2-1" },
          { text: "Rain fell on the green field.", ttsClipId: "fp-p3-2-2" },
          { text: "The moon shone over the dark farm.", ttsClipId: "fp-p3-2-3" },
          { text: "Shawn took a sharp fork and cut the meat.", ttsClipId: "fp-p3-2-4" },
          { text: "The bird sat on a short perch near the barn.", ttsClipId: "fp-p3-2-5" }
        ]
      },

      // -----------------------
      // PHASE 5 – ALT SPELLINGS
      // -----------------------
      {
        id: "fp-p5-1",
        phase: "Phase 5",
        levelNumber: 5,
        label: "Phase 5 – Mixed spellings, Set 1",
        wpmTarget: 80,
        description: "Phase 5 sentences with alternative spellings for known sounds.",
        sentences: [
          { text: "Jake rode his bike along the wide lane.", ttsClipId: "fp-p5-1-1" },
          { text: "The boy waved as the train came past.", ttsClipId: "fp-p5-1-2" },
          { text: "Grace made a cake and put it on a plate.", ttsClipId: "fp-p5-1-3" },
          { text: "The blue kite flew over the bright town.", ttsClipId: "fp-p5-1-4" },
          { text: "The girl wrote a note and left it by the phone.", ttsClipId: "fp-p5-1-5" }
        ]
      },
      {
        id: "fp-p5-2",
        phase: "Phase 5",
        levelNumber: 6,
        label: "Phase 5 – Mixed spellings, Set 2",
        wpmTarget: 90,
        description: "Slightly longer sentences, still decodable, with ou, ow, oi, oy and more.",
        sentences: [
          { text: "The loud sound from the crowd made the cow run out of the field.", ttsClipId: "fp-p5-2-1" },
          { text: "Roy found a coin on the ground as he walked home from school.", ttsClipId: "fp-p5-2-2" },
          { text: "The bright light from the house shone across the road.", ttsClipId: "fp-p5-2-3" },
          { text: "The cloud grew dark as the storm moved over the town.", ttsClipId: "fp-p5-2-4" },
          { text: "Joy wrote about her trip and showed the notes to her friend.", ttsClipId: "fp-p5-2-5" }
        ]
      }
    ]
  };
})();

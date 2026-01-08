// Global curriculum object for Stage 3 drills
window.NB_CURRICULUM = window.NB_CURRICULUM || {};

// ----------------------------
// VOWEL QUEST – SOUND PROMPTS
// ----------------------------

// Levels follow the Stage 3 card text hierarchy:
// 1–3: Short vowels in CVC / VC words with picture-style clues.
// 4–7: Long vowels, magic-e and common teams (ai, ee, oa, ie, ue).
// 8–10: Mixed review with diphthongs, r-controlled patterns and flexible patterns.
window.NB_CURRICULUM.vowelQuest = {
  levels: [
    {
      id: "vq1",
      levelNumber: 1,
      label: "Short vowels 1: /a/ /e/",
      description:
        "CVC words with short /a/ and /e/. Picture-style prompts if available.",
      items: [
        {
          id: "vq1-1",
          phoneme: "/a/",
          displayPrompt: "Sound: /a/",
          ttsPrompt: "Listen to the sound: a, short a.",
          options: ["cat", "cet", "cit"],
          correctIndex: 0,
          pictureHint: "/assets/images/vq/cat.png",
        },
        {
          id: "vq1-2",
          phoneme: "/e/",
          displayPrompt: "Sound: /e/",
          ttsPrompt: "Listen to the sound: e, short e.",
          options: ["hed", "hid", "had"],
          correctIndex: 0,
          pictureHint: "/assets/images/vq/bed.png",
        },
        {
          id: "vq1-3",
          phoneme: "/a/",
          displayPrompt: "Sound: /a/",
          ttsPrompt: "Listen to the sound: a, short a.",
          options: ["jam", "jem", "jim"],
          correctIndex: 0,
          pictureHint: "/assets/images/vq/jam.png",
        },
      ],
    },
    {
      id: "vq2",
      levelNumber: 2,
      label: "Short vowels 2: /i/ /o/ /u/",
      description: "CVC words with short /i/, /o/ and /u/.",
      items: [
        {
          id: "vq2-1",
          phoneme: "/i/",
          displayPrompt: "Sound: /i/",
          ttsPrompt: "Listen to the sound: i, short i.",
          options: ["sit", "set", "sat"],
          correctIndex: 0,
        },
        {
          id: "vq2-2",
          phoneme: "/o/",
          displayPrompt: "Sound: /o/",
          ttsPrompt: "Listen to the sound: o, short o.",
          options: ["cot", "cut", "cat"],
          correctIndex: 0,
        },
        {
          id: "vq2-3",
          phoneme: "/u/",
          displayPrompt: "Sound: /u/",
          ttsPrompt: "Listen to the sound: u, short u.",
          options: ["sun", "san", "sin"],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "vq4",
      levelNumber: 4,
      label: "Long vowels 1: a-e, ai, ay",
      description: "Magic-e and vowel teams for long /ā/.",
      items: [
        {
          id: "vq4-1",
          phoneme: "/ai/",
          displayPrompt: "Long a: /ā/",
          ttsPrompt: "Listen to the sound: long a.",
          options: ["rain", "ren", "rin"],
          correctIndex: 0,
        },
        {
          id: "vq4-2",
          phoneme: "/ai/",
          displayPrompt: "Long a: /ā/",
          ttsPrompt: "Listen to the sound: long a.",
          options: ["gate", "gat", "get"],
          correctIndex: 0,
        },
        {
          id: "vq4-3",
          phoneme: "/ai/",
          displayPrompt: "Long a: /ā/",
          ttsPrompt: "Listen to the sound: long a.",
          options: ["day", "dey", "dai"],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "vq5",
      levelNumber: 5,
      label: "Long vowels 2: ee, ea, oa, ie, ue",
      description: "Common vowel teams for long /ē/, /ō/ and /ū/.",
      items: [
        {
          id: "vq5-1",
          phoneme: "/ē/",
          displayPrompt: "Long e: /ē/",
          ttsPrompt: "Listen to the sound: long e.",
          options: ["feet", "fet", "fit"],
          correctIndex: 0,
        },
        {
          id: "vq5-2",
          phoneme: "/ō/",
          displayPrompt: "Long o: /ō/",
          ttsPrompt: "Listen to the sound: long o.",
          options: ["boat", "bot", "but"],
          correctIndex: 0,
        },
        {
          id: "vq5-3",
          phoneme: "/ū/",
          displayPrompt: "Long u: /ū/",
          ttsPrompt: "Listen to the sound: long u.",
          options: ["blue", "blu", "ble"],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "vq8",
      levelNumber: 8,
      label: "Mixed review: r-controlled",
      description: "er, ir, ur and ar, or – flexible patterns.",
      items: [
        {
          id: "vq8-1",
          phoneme: "/ər/",
          displayPrompt: "R-controlled: /ər/",
          ttsPrompt: "Listen to the sound: er, ir, ur.",
          options: ["her", "har", "hor"],
          correctIndex: 0,
        },
        {
          id: "vq8-2",
          phoneme: "/ar/",
          displayPrompt: "R-controlled: /ar/",
          ttsPrompt: "Listen to the sound: ar.",
          options: ["car", "cor", "cur"],
          correctIndex: 0,
        },
        {
          id: "vq8-3",
          phoneme: "/or/",
          displayPrompt: "R-controlled: /or/",
          ttsPrompt: "Listen to the sound: or.",
          options: ["fork", "fark", "ferk"],
          correctIndex: 0,
        },
      ],
    },
  ],
};

// ----------------------------------
// FLUENCY PACER – SENTENCE LISTS
// ----------------------------------
window.NB_CURRICULUM.fluencyPacer = {
  sets: [
    {
      id: "fp1",
      levelNumber: 1,
      label: "Set 1 – Short CVC sentences",
      wpmTarget: 60,
      description: "Very short, decodable sentences for early practice.",
      sentences: [
        "Sam sat on the mat.",
        "The dog had a red tag.",
        "Mum got the big pan.",
        "Tom hid in the shed.",
        "The sun is on the hut.",
      ],
    },
    {
      id: "fp2",
      levelNumber: 2,
      label: "Set 2 – Short vowel review",
      wpmTarget: 70,
      description: "Still short, slightly more complex phrases.",
      sentences: [
        "Jess went to the red shop.",
        "The frog sat on a rock.",
        "Dad put the milk in the fridge.",
        "The cat slept on the soft rug.",
        "Ben can fix the flat tyre.",
      ],
    },
    {
      id: "fp3",
      levelNumber: 3,
      label: "Set 3 – Long vowels and teams",
      wpmTarget: 80,
      description: "Simple sentences with long vowel spellings.",
      sentences: [
        "Kate ate a cake on the plate.",
        "The sheep sleep in the green field.",
        "Joe rode his bike up the road.",
        "The blue kite flew above the trees.",
        "Sue used glue to fix the vase.",
      ],
    },
    {
      id: "fp4",
      levelNumber: 4,
      label: "Set 4 – Mixed patterns and digraphs",
      wpmTarget: 90,
      description: "A mix of digraphs, blends and r-controlled vowels.",
      sentences: [
        "The shark swam past the small boat.",
        "The bird perched on the short branch.",
        "Mark wore a scarf in the cold wind.",
        "The child brushed her teeth at night.",
        "Storm clouds formed over the dark hill.",
      ],
    },
  ],
};

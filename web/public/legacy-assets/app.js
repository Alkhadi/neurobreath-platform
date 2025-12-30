// =============================================
// NeuroBreath – Autism Condition Hub & Focus Garden
// React Single-Page Application
// =============================================

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// =============================================
// CONSTANTS & CONFIGURATION
// =============================================

const STORAGE_KEY = 'neurobreath_data';

const CONDITIONS = {
    autism: { label: 'Autism', icon: '🧩', category: 'neurodevelopmental' },
    adhd: { label: 'ADHD', icon: '⚡', category: 'neurodevelopmental' },
    dyslexia: { label: 'Dyslexia', icon: '📚', category: 'neurodevelopmental' },
    anxiety: { label: 'Anxiety', icon: '🦋', category: 'mental-health' },
    depression: { label: 'Depression', icon: '🌱', category: 'mental-health' },
    stress: { label: 'Stress', icon: '🧘', category: 'mental-health' },
    sleep: { label: 'Sleep Issues', icon: '🌙', category: 'mental-health' },
    everyone: { label: 'General / Everyone', icon: '🌟', category: 'general' }
};

const AGE_GROUPS = {
    child: { label: 'Child', value: 'child', minAge: 0, maxAge: 12 },
    young: { label: 'Young Person', value: 'young', minAge: 13, maxAge: 18 },
    adult: { label: 'Adult', value: 'adult', minAge: 19, maxAge: 999 }
};

const AUDIENCE_MODES = {
    // Autism modes
    'autism-child': { label: 'Autistic child', value: 'autism-child', condition: 'autism', ageGroup: 'child' },
    'autism-young': { label: 'Autistic young person', value: 'autism-young', condition: 'autism', ageGroup: 'young' },
    'autism-adult': { label: 'Autistic adult', value: 'autism-adult', condition: 'autism', ageGroup: 'adult' },
    // ADHD modes
    'adhd-child': { label: 'ADHD child', value: 'adhd-child', condition: 'adhd', ageGroup: 'child' },
    'adhd-young': { label: 'ADHD young person', value: 'adhd-young', condition: 'adhd', ageGroup: 'young' },
    'adhd-adult': { label: 'ADHD adult', value: 'adhd-adult', condition: 'adhd', ageGroup: 'adult' },
    // Dyslexia modes
    'dyslexia-child': { label: 'Dyslexic child', value: 'dyslexia-child', condition: 'dyslexia', ageGroup: 'child' },
    'dyslexia-young': { label: 'Dyslexic young person', value: 'dyslexia-young', condition: 'dyslexia', ageGroup: 'young' },
    'dyslexia-adult': { label: 'Dyslexic adult', value: 'dyslexia-adult', condition: 'dyslexia', ageGroup: 'adult' },
    // Mental health modes
    'anxiety': { label: 'Anxiety', value: 'anxiety', condition: 'anxiety', ageGroup: 'adult' },
    'depression': { label: 'Depression', value: 'depression', condition: 'depression', ageGroup: 'adult' },
    'stress': { label: 'Stress', value: 'stress', condition: 'stress', ageGroup: 'adult' },
    'sleep': { label: 'Sleep Issues', value: 'sleep', condition: 'sleep', ageGroup: 'adult' },
    // General
    'everyone': { label: 'General / Everyone', value: 'everyone', condition: 'everyone', ageGroup: 'adult' }
};

// Helper to get config for a mode
function getModeConfig(mode) {
    const baseConfigs = {
        // Autism - Child (gentle approach)
        'autism-child': {
        tiers: ['gentle', 'spark'],
        tierLabels: { gentle: 'Gentle', spark: 'Spark' },
        startingSeeds: { gentle: 3, spark: 0 },
        plantsPerTier: 3,
        maxPlots: 3,
        progression: { gentle: { gentle: 1, sparkEvery: 3 }, spark: { xpOnly: true } }
    },
        // Autism - Young Person
        'autism-young': {
        tiers: ['everyday', 'special', 'signature'],
        tierLabels: { everyday: 'Everyday', special: 'Special', signature: 'Signature' },
        startingSeeds: { everyday: 4, special: 0, signature: 0 },
        plantsPerTier: 4,
        maxPlots: 4,
            progression: { everyday: { everyday: 0.75, special: 0.25 }, special: { signature: 0.15, everyday: 0.35, special: 0.50 } }
    },
        // Autism - Adult
        'autism-adult': {
        tiers: ['everyday', 'special', 'signature'],
        tierLabels: { everyday: 'Everyday', special: 'Special', signature: 'Signature' },
        startingSeeds: { everyday: 5, special: 0, signature: 0 },
        plantsPerTier: 5,
        maxPlots: 5,
            progression: { everyday: { everyday: 0.70, special: 0.30 }, special: { signature: 0.20, everyday: 0.40, special: 0.40 }, signature: { everyday: 0.5 } }
        },
        // ADHD - Child
        'adhd-child': {
            tiers: ['focus', 'sprint'],
            tierLabels: { focus: 'Focus', sprint: 'Sprint' },
            startingSeeds: { focus: 4, sprint: 0 },
            plantsPerTier: 4,
            maxPlots: 4,
            progression: { focus: { focus: 0.80, sprint: 0.20 }, sprint: { xpOnly: true } }
        },
        // ADHD - Young Person
        'adhd-young': {
            tiers: ['focus', 'sprint', 'master'],
            tierLabels: { focus: 'Focus', sprint: 'Sprint', master: 'Master' },
            startingSeeds: { focus: 5, sprint: 0, master: 0 },
            plantsPerTier: 5,
            maxPlots: 5,
            progression: { focus: { focus: 0.70, sprint: 0.30 }, sprint: { master: 0.20, focus: 0.40, sprint: 0.40 }, master: { focus: 0.5 } }
        },
        // ADHD - Adult
        'adhd-adult': {
            tiers: ['focus', 'sprint', 'master'],
            tierLabels: { focus: 'Focus', sprint: 'Sprint', master: 'Master' },
            startingSeeds: { focus: 6, sprint: 0, master: 0 },
            plantsPerTier: 6,
            maxPlots: 5,
            progression: { focus: { focus: 0.65, sprint: 0.35 }, sprint: { master: 0.25, focus: 0.35, sprint: 0.40 }, master: { focus: 0.5 } }
        },
        // Dyslexia - Child
        'dyslexia-child': {
            tiers: ['practice', 'build'],
            tierLabels: { practice: 'Practice', build: 'Build' },
            startingSeeds: { practice: 4, build: 0 },
            plantsPerTier: 4,
            maxPlots: 4,
            progression: { practice: { practice: 0.85, build: 0.15 }, build: { xpOnly: true } }
        },
        // Dyslexia - Young Person
        'dyslexia-young': {
            tiers: ['practice', 'build', 'expert'],
            tierLabels: { practice: 'Practice', build: 'Build', expert: 'Expert' },
            startingSeeds: { practice: 5, build: 0, expert: 0 },
            plantsPerTier: 5,
            maxPlots: 5,
            progression: { practice: { practice: 0.75, build: 0.25 }, build: { expert: 0.15, practice: 0.40, build: 0.45 }, expert: { practice: 0.5 } }
        },
        // Dyslexia - Adult
        'dyslexia-adult': {
            tiers: ['practice', 'build', 'expert'],
            tierLabels: { practice: 'Practice', build: 'Build', expert: 'Expert' },
            startingSeeds: { practice: 6, build: 0, expert: 0 },
            plantsPerTier: 6,
            maxPlots: 5,
            progression: { practice: { practice: 0.70, build: 0.30 }, build: { expert: 0.20, practice: 0.35, build: 0.45 }, expert: { practice: 0.5 } }
        },
        // Anxiety
        'anxiety': {
            tiers: ['calm', 'brave', 'master'],
            tierLabels: { calm: 'Calm', brave: 'Brave', master: 'Master' },
            startingSeeds: { calm: 5, brave: 0, master: 0 },
            plantsPerTier: 5,
            maxPlots: 5,
            progression: { calm: { calm: 0.75, brave: 0.25 }, brave: { master: 0.20, calm: 0.30, brave: 0.50 }, master: { calm: 0.5 } }
        },
        // Depression
        'depression': {
            tiers: ['nurture', 'grow', 'thrive'],
            tierLabels: { nurture: 'Nurture', grow: 'Grow', thrive: 'Thrive' },
            startingSeeds: { nurture: 5, grow: 0, thrive: 0 },
            plantsPerTier: 5,
            maxPlots: 5,
            progression: { nurture: { nurture: 0.80, grow: 0.20 }, grow: { thrive: 0.15, nurture: 0.40, grow: 0.45 }, thrive: { nurture: 0.5 } }
        },
        // Stress
        'stress': {
            tiers: ['reset', 'balance', 'flow'],
            tierLabels: { reset: 'Reset', balance: 'Balance', flow: 'Flow' },
            startingSeeds: { reset: 5, balance: 0, flow: 0 },
            plantsPerTier: 5,
            maxPlots: 5,
            progression: { reset: { reset: 0.75, balance: 0.25 }, balance: { flow: 0.20, reset: 0.35, balance: 0.45 }, flow: { reset: 0.5 } }
        },
        // Sleep
        'sleep': {
            tiers: ['wind-down', 'rest', 'deep'],
            tierLabels: { 'wind-down': 'Wind-Down', rest: 'Rest', deep: 'Deep' },
            startingSeeds: { 'wind-down': 5, rest: 0, deep: 0 },
            plantsPerTier: 5,
            maxPlots: 5,
            progression: { 'wind-down': { 'wind-down': 0.75, rest: 0.25 }, rest: { deep: 0.20, 'wind-down': 0.35, rest: 0.45 }, deep: { 'wind-down': 0.5 } }
        },
        // General/Everyone
        'everyone': {
        tiers: ['everyday', 'special', 'signature'],
        tierLabels: { everyday: 'Everyday', special: 'Special', signature: 'Signature' },
        startingSeeds: { everyday: 6, special: 0, signature: 0 },
        plantsPerTier: 6,
        maxPlots: 5,
            progression: { everyday: { everyday: 0.60, special: 0.40 }, special: { signature: 0.20, everyday: 0.30, special: 0.50 } }
        }
    };
    
    // Legacy mode support
    if (mode === 'child') return baseConfigs['autism-child'];
    if (mode === 'young') return baseConfigs['autism-young'];
    if (mode === 'adult') return baseConfigs['autism-adult'];
    
    return baseConfigs[mode] || baseConfigs['everyone'];
}

const MODE_CONFIG = new Proxy({}, {
    get: function(target, prop) {
        return getModeConfig(prop);
    }
});

// Condition-specific layer configurations
const CONDITION_LAYERS = {
    autism: {
    structure: { name: 'Structure', icon: '📋', color: '#9DB4A0' },
    communication: { name: 'Communication', icon: '💬', color: '#A8C5D8' },
    zones: { name: 'Zones', icon: '🌈', color: '#B8A9C9' },
    selfMgmt: { name: 'Self-Management', icon: '🧭', color: '#8B7355' },
    anxiety: { name: 'Anxiety & Coaching', icon: '🦋', color: '#D4A59A' }
    },
    adhd: {
        focus: { name: 'Focus', icon: '⚡', color: '#FFB84D' },
        organization: { name: 'Organization', icon: '🗂️', color: '#9DB4A0' },
        energy: { name: 'Energy Management', icon: '🔋', color: '#A8C5D8' },
        impulsivity: { name: 'Impulse Control', icon: '✋', color: '#B8A9C9' }
    },
    dyslexia: {
        reading: { name: 'Reading', icon: '📖', color: '#9DB4A0' },
        writing: { name: 'Writing', icon: '✍️', color: '#A8C5D8' },
        confidence: { name: 'Confidence', icon: '🌟', color: '#B8A9C9' }
    },
    anxiety: {
        calm: { name: 'Calm', icon: '🌬️', color: '#9DB4A0' },
        brave: { name: 'Brave Steps', icon: '🦁', color: '#A8C5D8' },
        coping: { name: 'Coping', icon: '🛡️', color: '#B8A9C9' }
    },
    depression: {
        nurture: { name: 'Nurture', icon: '🌱', color: '#9DB4A0' },
        activity: { name: 'Activity', icon: '🎨', color: '#A8C5D8' },
        thoughts: { name: 'Thoughts', icon: '💭', color: '#B8A9C9' }
    },
    stress: {
        reset: { name: 'Reset', icon: '🔄', color: '#9DB4A0' },
        balance: { name: 'Balance', icon: '⚖️', color: '#A8C5D8' },
        recovery: { name: 'Recovery', icon: '🌿', color: '#B8A9C9' }
    },
    sleep: {
        'wind-down': { name: 'Wind-Down', icon: '🌙', color: '#9DB4A0' },
        rest: { name: 'Rest', icon: '😴', color: '#A8C5D8' },
        quality: { name: 'Quality', icon: '⭐', color: '#B8A9C9' }
    },
    everyone: {
        structure: { name: 'Structure', icon: '📋', color: '#9DB4A0' },
        communication: { name: 'Communication', icon: '💬', color: '#A8C5D8' },
        zones: { name: 'Zones', icon: '🌈', color: '#B8A9C9' },
        selfMgmt: { name: 'Self-Management', icon: '🧭', color: '#8B7355' },
        anxiety: { name: 'Anxiety & Coaching', icon: '🦋', color: '#D4A59A' }
    }
};

function getLayerConfig(condition) {
    return CONDITION_LAYERS[condition] || CONDITION_LAYERS.everyone;
}

// Legacy support
const LAYER_CONFIG = CONDITION_LAYERS.autism;

const ZONES = {
    blue: { name: 'Blue Zone', description: 'Low energy, tired, sad', color: '#7BA3C9' },
    green: { name: 'Green Zone', description: 'Calm, focused, ready to learn', color: '#7FB285' },
    yellow: { name: 'Yellow Zone', description: 'Excited, anxious, frustrated', color: '#E5C76B' },
    red: { name: 'Red Zone', description: 'Very upset, out of control', color: '#D4847C' }
};

// Condition-specific plant templates
const CONDITION_TEMPLATES = {
    autism: {
    structure: [
        { id: 'morning-routine', title: 'Morning Routine', description: 'Complete your morning steps', tier: 'everyday', icon: '🌅' },
        { id: 'visual-schedule', title: 'Visual Schedule', description: 'Follow your visual schedule today', tier: 'everyday', icon: '📅' },
        { id: 'transition-timer', title: 'Transition Timer', description: 'Use a timer for activity changes', tier: 'everyday', icon: '⏰' },
        { id: 'task-breakdown', title: 'Task Breakdown', description: 'Break a big task into small steps', tier: 'special', icon: '🧩' },
        { id: 'routine-chain', title: 'Routine Chain', description: 'Complete a full routine chain', tier: 'special', icon: '🔗' },
        { id: 'weekly-planner', title: 'Weekly Planner', description: 'Plan and follow your whole week', tier: 'signature', icon: '📘' }
    ],
    communication: [
        { id: 'request-help', title: 'Ask for Help', description: 'Use words or symbols to ask for help', tier: 'everyday', icon: '🙋' },
        { id: 'greet-someone', title: 'Greeting Practice', description: 'Say hello to someone new', tier: 'everyday', icon: '👋' },
        { id: 'express-feeling', title: 'Express a Feeling', description: 'Tell someone how you feel', tier: 'everyday', icon: '💗' },
        { id: 'conversation-turn', title: 'Conversation Turns', description: 'Take turns in a conversation', tier: 'special', icon: '🔄' },
        { id: 'social-story', title: 'Social Story', description: 'Read and practice a social story', tier: 'special', icon: '📖' },
        { id: 'complex-request', title: 'Complex Request', description: 'Make a detailed request with reasons', tier: 'signature', icon: '💎' }
    ],
    zones: [
        { id: 'zone-check', title: 'Zone Check-In', description: 'Identify your current zone', tier: 'everyday', icon: '🎯' },
        { id: 'calm-tool', title: 'Use a Calm Tool', description: 'Use a tool to get to green zone', tier: 'everyday', icon: '🧘' },
        { id: 'energy-boost', title: 'Energy Boost', description: 'Use a tool to increase energy', tier: 'everyday', icon: '⚡' },
        { id: 'zone-tracking', title: 'Zone Tracking', description: 'Track your zones for a whole day', tier: 'special', icon: '📊' },
        { id: 'zone-prevention', title: 'Zone Prevention', description: 'Notice warning signs before leaving green', tier: 'special', icon: '🚦' },
        { id: 'zone-mastery', title: 'Zone Mastery', description: 'Stay in green zone during a challenge', tier: 'signature', icon: '🏆' }
    ],
    selfMgmt: [
        { id: 'set-goal', title: 'Set a Small Goal', description: 'Set and complete a small goal', tier: 'everyday', icon: '🎯' },
        { id: 'problem-solve', title: 'Problem Solving', description: 'Use steps to solve a problem', tier: 'everyday', icon: '🔧' },
        { id: 'take-break', title: 'Planned Break', description: 'Take a break when you need it', tier: 'everyday', icon: '☕' },
        { id: 'stress-log', title: 'Stress Log', description: 'Notice and record stress triggers', tier: 'special', icon: '📝' },
        { id: 'coping-plan', title: 'Coping Plan', description: 'Create and use a coping plan', tier: 'special', icon: '🗺️' },
        { id: 'independent-day', title: 'Independent Day', description: 'Manage your whole day independently', tier: 'signature', icon: '🌟' }
    ],
    anxiety: [
        { id: 'brave-step', title: 'Brave Step', description: 'Take one small brave step', tier: 'everyday', icon: '👣' },
        { id: 'worry-time', title: 'Worry Time', description: 'Use scheduled worry time', tier: 'everyday', icon: '⏳' },
        { id: 'calm-breathing', title: 'Calm Breathing', description: 'Practice calming breaths', tier: 'everyday', icon: '🌬️' },
        { id: 'exposure-task', title: 'Exposure Practice', description: 'Face a fear with support', tier: 'special', icon: '🦁' },
        { id: 'anxiety-detective', title: 'Anxiety Detective', description: 'Find and challenge anxious thoughts', tier: 'special', icon: '🔍' },
        { id: 'fear-ladder', title: 'Fear Ladder Complete', description: 'Complete all steps of a fear ladder', tier: 'signature', icon: '🏅' }
    ]
    },
    adhd: {
        focus: [
            { id: 'focus-sprint', title: 'Focus Sprint', description: '2-minute focused work session', tier: 'focus', icon: '⚡' },
            { id: 'task-switch', title: 'Task Switching', description: 'Practice switching between tasks smoothly', tier: 'focus', icon: '🔄' },
            { id: 'time-block', title: 'Time Blocking', description: 'Use time blocks for your work', tier: 'focus', icon: '⏱️' },
            { id: 'deep-work', title: 'Deep Work Session', description: 'Complete 25-minute focused session', tier: 'sprint', icon: '🎯' },
            { id: 'distraction-log', title: 'Distraction Log', description: 'Track and manage distractions', tier: 'sprint', icon: '📝' },
            { id: 'flow-state', title: 'Flow State', description: 'Achieve flow state in your work', tier: 'master', icon: '🌊' }
        ],
        organization: [
            { id: 'quick-clean', title: 'Quick Clean', description: 'Organize one small space', tier: 'focus', icon: '🧹' },
            { id: 'list-make', title: 'Make a List', description: 'Create a to-do list for today', tier: 'focus', icon: '📋' },
            { id: 'priority-set', title: 'Set Priorities', description: 'Identify your top 3 priorities', tier: 'focus', icon: '⭐' },
            { id: 'system-create', title: 'Create System', description: 'Set up an organization system', tier: 'sprint', icon: '🗂️' },
            { id: 'habit-track', title: 'Habit Tracker', description: 'Track a daily habit for a week', tier: 'sprint', icon: '📊' },
            { id: 'life-organize', title: 'Life Organization', description: 'Organize a major life area', tier: 'master', icon: '🏠' }
        ],
        energy: [
            { id: 'movement-break', title: 'Movement Break', description: 'Take a 5-minute movement break', tier: 'focus', icon: '🏃' },
            { id: 'energy-snack', title: 'Energy Snack', description: 'Have a healthy energy snack', tier: 'focus', icon: '🍎' },
            { id: 'breathing-reset', title: 'Breathing Reset', description: 'Do a breathing exercise', tier: 'focus', icon: '🌬️' },
            { id: 'exercise-session', title: 'Exercise Session', description: 'Complete 15-minute exercise', tier: 'sprint', icon: '💪' },
            { id: 'sleep-routine', title: 'Sleep Routine', description: 'Follow your sleep routine', tier: 'sprint', icon: '😴' },
            { id: 'wellness-plan', title: 'Wellness Plan', description: 'Create a weekly wellness plan', tier: 'master', icon: '🌟' }
        ],
        impulsivity: [
            { id: 'pause-before', title: 'Pause Before Acting', description: 'Count to 5 before deciding', tier: 'focus', icon: '✋' },
            { id: 'think-through', title: 'Think Through', description: 'Think through consequences', tier: 'focus', icon: '🤔' },
            { id: 'wait-moment', title: 'Wait a Moment', description: 'Wait 10 seconds before responding', tier: 'focus', icon: '⏸️' },
            { id: 'impulse-log', title: 'Impulse Log', description: 'Log and reflect on impulses', tier: 'sprint', icon: '📝' },
            { id: 'strategy-use', title: 'Use Strategy', description: 'Use an impulse control strategy', tier: 'sprint', icon: '🛡️' },
            { id: 'master-control', title: 'Master Control', description: 'Master impulse control in challenges', tier: 'master', icon: '👑' }
        ]
    },
    dyslexia: {
        reading: [
            { id: 'read-5min', title: 'Read 5 Minutes', description: 'Read for 5 focused minutes', tier: 'practice', icon: '📖' },
            { id: 'sound-out', title: 'Sound Out Words', description: 'Practice sounding out new words', tier: 'practice', icon: '🔤' },
            { id: 'comprehension-check', title: 'Comprehension Check', description: 'Check understanding after reading', tier: 'practice', icon: '✅' },
            { id: 'reading-strategy', title: 'Use Reading Strategy', description: 'Apply a reading strategy', tier: 'build', icon: '📚' },
            { id: 'vocab-build', title: 'Build Vocabulary', description: 'Learn 3 new words today', tier: 'build', icon: '📝' },
            { id: 'reading-mastery', title: 'Reading Mastery', description: 'Read a full chapter confidently', tier: 'expert', icon: '🏆' }
        ],
        writing: [
            { id: 'write-sentence', title: 'Write a Sentence', description: 'Write one complete sentence', tier: 'practice', icon: '✍️' },
            { id: 'spell-check', title: 'Spell Check', description: 'Check spelling in your writing', tier: 'practice', icon: '🔍' },
            { id: 'organize-thoughts', title: 'Organize Thoughts', description: 'Organize thoughts before writing', tier: 'practice', icon: '💭' },
            { id: 'write-paragraph', title: 'Write Paragraph', description: 'Write a complete paragraph', tier: 'build', icon: '📄' },
            { id: 'edit-work', title: 'Edit Your Work', description: 'Edit and improve your writing', tier: 'build', icon: '✏️' },
            { id: 'writing-project', title: 'Writing Project', description: 'Complete a full writing project', tier: 'expert', icon: '📚' }
        ],
        confidence: [
            { id: 'try-new', title: 'Try Something New', description: 'Try a new reading or writing task', tier: 'practice', icon: '🌟' },
            { id: 'celebrate-win', title: 'Celebrate Win', description: 'Celebrate a small success', tier: 'practice', icon: '🎉' },
            { id: 'ask-help', title: 'Ask for Help', description: 'Ask for help when needed', tier: 'practice', icon: '🙋' },
            { id: 'share-work', title: 'Share Your Work', description: 'Share something you created', tier: 'build', icon: '📤' },
            { id: 'teach-other', title: 'Teach Someone', description: 'Teach someone what you learned', tier: 'build', icon: '👨‍🏫' },
            { id: 'confidence-master', title: 'Confidence Master', description: 'Show confidence in your abilities', tier: 'expert', icon: '👑' }
        ]
    },
    anxiety: {
        calm: [
            { id: 'breathing-exercise', title: 'Breathing Exercise', description: 'Practice calming breathing', tier: 'calm', icon: '🌬️' },
            { id: 'grounding-5-4-3', title: '5-4-3 Grounding', description: 'Use 5-4-3-2-1 grounding technique', tier: 'calm', icon: '🌍' },
            { id: 'safe-space', title: 'Safe Space', description: 'Visualize your safe space', tier: 'calm', icon: '🏡' },
            { id: 'progressive-relax', title: 'Progressive Relaxation', description: 'Practice muscle relaxation', tier: 'brave', icon: '🧘' },
            { id: 'mindfulness-5min', title: '5-Minute Mindfulness', description: 'Practice mindfulness for 5 minutes', tier: 'brave', icon: '🧠' },
            { id: 'calm-mastery', title: 'Calm Mastery', description: 'Maintain calm during challenge', tier: 'master', icon: '✨' }
        ],
        brave: [
            { id: 'small-step', title: 'Take Small Step', description: 'Take one small brave step', tier: 'calm', icon: '👣' },
            { id: 'worry-time', title: 'Worry Time', description: 'Use scheduled worry time', tier: 'calm', icon: '⏳' },
            { id: 'challenge-thought', title: 'Challenge Thought', description: 'Challenge an anxious thought', tier: 'calm', icon: '💭' },
            { id: 'face-fear', title: 'Face a Fear', description: 'Face a fear with support', tier: 'brave', icon: '🦁' },
            { id: 'exposure-practice', title: 'Exposure Practice', description: 'Practice exposure technique', tier: 'brave', icon: '🎯' },
            { id: 'fear-ladder', title: 'Complete Fear Ladder', description: 'Complete all steps of fear ladder', tier: 'master', icon: '🏅' }
        ],
        coping: [
            { id: 'coping-strategy', title: 'Use Coping Strategy', description: 'Use a learned coping strategy', tier: 'calm', icon: '🛡️' },
            { id: 'self-talk', title: 'Positive Self-Talk', description: 'Use positive self-talk', tier: 'calm', icon: '💬' },
            { id: 'support-reach', title: 'Reach for Support', description: 'Reach out to support person', tier: 'calm', icon: '🤝' },
            { id: 'coping-plan', title: 'Coping Plan', description: 'Create and use a coping plan', tier: 'brave', icon: '🗺️' },
            { id: 'anxiety-log', title: 'Anxiety Log', description: 'Log anxiety triggers and responses', tier: 'brave', icon: '📝' },
            { id: 'coping-master', title: 'Coping Master', description: 'Master multiple coping strategies', tier: 'master', icon: '👑' }
        ]
    },
    depression: {
        nurture: [
            { id: 'self-care-basic', title: 'Basic Self-Care', description: 'Complete basic self-care task', tier: 'nurture', icon: '🛁' },
            { id: 'gentle-movement', title: 'Gentle Movement', description: 'Do 5 minutes of gentle movement', tier: 'nurture', icon: '🚶' },
            { id: 'healthy-meal', title: 'Healthy Meal', description: 'Eat one healthy meal', tier: 'nurture', icon: '🍎' },
            { id: 'sleep-routine', title: 'Sleep Routine', description: 'Follow your sleep routine', tier: 'grow', icon: '😴' },
            { id: 'social-connection', title: 'Social Connection', description: 'Connect with someone', tier: 'grow', icon: '👥' },
            { id: 'wellness-day', title: 'Wellness Day', description: 'Complete a full wellness day', tier: 'thrive', icon: '🌟' }
        ],
        activity: [
            { id: 'small-activity', title: 'Small Activity', description: 'Do one small enjoyable activity', tier: 'nurture', icon: '🎨' },
            { id: 'outdoor-time', title: 'Outdoor Time', description: 'Spend 10 minutes outdoors', tier: 'nurture', icon: '🌳' },
            { id: 'hobby-time', title: 'Hobby Time', description: 'Spend time on a hobby', tier: 'nurture', icon: '🎯' },
            { id: 'activity-schedule', title: 'Activity Schedule', description: 'Follow an activity schedule', tier: 'grow', icon: '📅' },
            { id: 'new-experience', title: 'New Experience', description: 'Try a new positive experience', tier: 'grow', icon: '✨' },
            { id: 'meaningful-activity', title: 'Meaningful Activity', description: 'Engage in meaningful activity', tier: 'thrive', icon: '💫' }
        ],
        thoughts: [
            { id: 'gratitude-3', title: '3 Gratitudes', description: 'List 3 things you are grateful for', tier: 'nurture', icon: '🙏' },
            { id: 'positive-moment', title: 'Positive Moment', description: 'Notice one positive moment', tier: 'nurture', icon: '☀️' },
            { id: 'kind-self', title: 'Be Kind to Self', description: 'Practice self-compassion', tier: 'nurture', icon: '💗' },
            { id: 'thought-challenge', title: 'Challenge Negative Thought', description: 'Challenge a negative thought', tier: 'grow', icon: '💭' },
            { id: 'reframe-situation', title: 'Reframe Situation', description: 'Reframe a situation positively', tier: 'grow', icon: '🔄' },
            { id: 'thought-mastery', title: 'Thought Mastery', description: 'Master positive thinking patterns', tier: 'thrive', icon: '🧠' }
        ]
    },
    stress: {
        reset: [
            { id: 'quick-reset', title: 'Quick Reset', description: 'Do a 60-second reset', tier: 'reset', icon: '🔄' },
            { id: 'breathing-break', title: 'Breathing Break', description: 'Take a breathing break', tier: 'reset', icon: '🌬️' },
            { id: 'stretch-moment', title: 'Stretch Moment', description: 'Do a quick stretch', tier: 'reset', icon: '🤸' },
            { id: 'stress-check', title: 'Stress Check', description: 'Check your stress level', tier: 'balance', icon: '📊' },
            { id: 'relaxation-10min', title: '10-Min Relaxation', description: 'Practice relaxation for 10 minutes', tier: 'balance', icon: '🧘' },
            { id: 'reset-mastery', title: 'Reset Mastery', description: 'Master stress reset techniques', tier: 'flow', icon: '✨' }
        ],
        balance: [
            { id: 'work-life-balance', title: 'Work-Life Balance', description: 'Maintain work-life balance today', tier: 'reset', icon: '⚖️' },
            { id: 'boundary-set', title: 'Set Boundary', description: 'Set a healthy boundary', tier: 'reset', icon: '🚧' },
            { id: 'say-no', title: 'Say No', description: 'Say no to something unnecessary', tier: 'reset', icon: '✋' },
            { id: 'time-management', title: 'Time Management', description: 'Use time management strategy', tier: 'balance', icon: '⏰' },
            { id: 'priority-focus', title: 'Focus on Priorities', description: 'Focus on your priorities', tier: 'balance', icon: '🎯' },
            { id: 'life-balance', title: 'Life Balance', description: 'Achieve overall life balance', tier: 'flow', icon: '🌊' }
        ],
        recovery: [
            { id: 'rest-day', title: 'Rest Day', description: 'Take a proper rest day', tier: 'reset', icon: '😴' },
            { id: 'recovery-activity', title: 'Recovery Activity', description: 'Do a recovery activity', tier: 'reset', icon: '🌿' },
            { id: 'stress-log', title: 'Stress Log', description: 'Log stress triggers and responses', tier: 'balance', icon: '📝' },
            { id: 'stress-plan', title: 'Stress Management Plan', description: 'Create stress management plan', tier: 'balance', icon: '🗺️' },
            { id: 'burnout-prevent', title: 'Prevent Burnout', description: 'Take steps to prevent burnout', tier: 'flow', icon: '🛡️' },
            { id: 'resilience-build', title: 'Build Resilience', description: 'Build long-term resilience', tier: 'flow', icon: '💪' }
        ]
    },
    sleep: {
        'wind-down': [
            { id: 'bedtime-routine', title: 'Bedtime Routine', description: 'Follow your bedtime routine', tier: 'wind-down', icon: '🌙' },
            { id: 'screen-off', title: 'Screen Off', description: 'Turn off screens 1 hour before bed', tier: 'wind-down', icon: '📱' },
            { id: 'relaxing-activity', title: 'Relaxing Activity', description: 'Do a relaxing pre-sleep activity', tier: 'wind-down', icon: '📖' },
            { id: 'breathing-sleep', title: 'Sleep Breathing', description: 'Practice 4-7-8 breathing', tier: 'rest', icon: '🌬️' },
            { id: 'sleep-environment', title: 'Sleep Environment', description: 'Optimize your sleep environment', tier: 'rest', icon: '🛏️' },
            { id: 'wind-down-master', title: 'Wind-Down Master', description: 'Master your wind-down routine', tier: 'deep', icon: '✨' }
        ],
        rest: [
            { id: 'consistent-bedtime', title: 'Consistent Bedtime', description: 'Go to bed at consistent time', tier: 'wind-down', icon: '⏰' },
            { id: 'wake-time', title: 'Wake Time', description: 'Wake at consistent time', tier: 'wind-down', icon: '☀️' },
            { id: 'nap-manage', title: 'Manage Naps', description: 'Manage naps appropriately', tier: 'wind-down', icon: '😴' },
            { id: 'sleep-schedule', title: 'Sleep Schedule', description: 'Follow sleep schedule for week', tier: 'rest', icon: '📅' },
            { id: 'sleep-hygiene', title: 'Sleep Hygiene', description: 'Practice good sleep hygiene', tier: 'rest', icon: '🛁' },
            { id: 'sleep-mastery', title: 'Sleep Mastery', description: 'Master consistent sleep patterns', tier: 'deep', icon: '👑' }
        ],
        quality: [
            { id: 'sleep-track', title: 'Track Sleep', description: 'Track your sleep quality', tier: 'wind-down', icon: '📊' },
            { id: 'relaxation-before-bed', title: 'Pre-Sleep Relaxation', description: 'Practice relaxation before bed', tier: 'wind-down', icon: '🧘' },
            { id: 'worry-journal', title: 'Worry Journal', description: 'Write worries before bed', tier: 'wind-down', icon: '📝' },
            { id: 'sleep-ritual', title: 'Sleep Ritual', description: 'Create and follow sleep ritual', tier: 'rest', icon: '🕯️' },
            { id: 'deep-relaxation', title: 'Deep Relaxation', description: 'Practice deep relaxation for sleep', tier: 'rest', icon: '🌊' },
            { id: 'quality-mastery', title: 'Quality Mastery', description: 'Achieve consistent quality sleep', tier: 'deep', icon: '⭐' }
        ]
    },
    everyone: {
        structure: [
            { id: 'morning-routine', title: 'Morning Routine', description: 'Complete your morning steps', tier: 'everyday', icon: '🌅' },
            { id: 'visual-schedule', title: 'Visual Schedule', description: 'Follow your visual schedule today', tier: 'everyday', icon: '📅' },
            { id: 'transition-timer', title: 'Transition Timer', description: 'Use a timer for activity changes', tier: 'everyday', icon: '⏰' },
            { id: 'task-breakdown', title: 'Task Breakdown', description: 'Break a big task into small steps', tier: 'special', icon: '🧩' },
            { id: 'routine-chain', title: 'Routine Chain', description: 'Complete a full routine chain', tier: 'special', icon: '🔗' },
            { id: 'weekly-planner', title: 'Weekly Planner', description: 'Plan and follow your whole week', tier: 'signature', icon: '📘' }
        ],
        communication: [
            { id: 'request-help', title: 'Ask for Help', description: 'Use words or symbols to ask for help', tier: 'everyday', icon: '🙋' },
            { id: 'greet-someone', title: 'Greeting Practice', description: 'Say hello to someone new', tier: 'everyday', icon: '👋' },
            { id: 'express-feeling', title: 'Express a Feeling', description: 'Tell someone how you feel', tier: 'everyday', icon: '💗' },
            { id: 'conversation-turn', title: 'Conversation Turns', description: 'Take turns in a conversation', tier: 'special', icon: '🔄' },
            { id: 'social-story', title: 'Social Story', description: 'Read and practice a social story', tier: 'special', icon: '📖' },
            { id: 'complex-request', title: 'Complex Request', description: 'Make a detailed request with reasons', tier: 'signature', icon: '💎' }
        ],
        zones: [
            { id: 'zone-check', title: 'Zone Check-In', description: 'Identify your current zone', tier: 'everyday', icon: '🎯' },
            { id: 'calm-tool', title: 'Use a Calm Tool', description: 'Use a tool to get to green zone', tier: 'everyday', icon: '🧘' },
            { id: 'energy-boost', title: 'Energy Boost', description: 'Use a tool to increase energy', tier: 'everyday', icon: '⚡' },
            { id: 'zone-tracking', title: 'Zone Tracking', description: 'Track your zones for a whole day', tier: 'special', icon: '📊' },
            { id: 'zone-prevention', title: 'Zone Prevention', description: 'Notice warning signs before leaving green', tier: 'special', icon: '🚦' },
            { id: 'zone-mastery', title: 'Zone Mastery', description: 'Stay in green zone during a challenge', tier: 'signature', icon: '🏆' }
        ],
        selfMgmt: [
            { id: 'set-goal', title: 'Set a Small Goal', description: 'Set and complete a small goal', tier: 'everyday', icon: '🎯' },
            { id: 'problem-solve', title: 'Problem Solving', description: 'Use steps to solve a problem', tier: 'everyday', icon: '🔧' },
            { id: 'take-break', title: 'Planned Break', description: 'Take a break when you need it', tier: 'everyday', icon: '☕' },
            { id: 'stress-log', title: 'Stress Log', description: 'Notice and record stress triggers', tier: 'special', icon: '📝' },
            { id: 'coping-plan', title: 'Coping Plan', description: 'Create and use a coping plan', tier: 'special', icon: '🗺️' },
            { id: 'independent-day', title: 'Independent Day', description: 'Manage your whole day independently', tier: 'signature', icon: '🌟' }
        ],
        anxiety: [
            { id: 'brave-step', title: 'Brave Step', description: 'Take one small brave step', tier: 'everyday', icon: '👣' },
            { id: 'worry-time', title: 'Worry Time', description: 'Use scheduled worry time', tier: 'everyday', icon: '⏳' },
            { id: 'calm-breathing', title: 'Calm Breathing', description: 'Practice calming breaths', tier: 'everyday', icon: '🌬️' },
            { id: 'exposure-task', title: 'Exposure Practice', description: 'Face a fear with support', tier: 'special', icon: '🦁' },
            { id: 'anxiety-detective', title: 'Anxiety Detective', description: 'Find and challenge anxious thoughts', tier: 'special', icon: '🔍' },
            { id: 'fear-ladder', title: 'Fear Ladder Complete', description: 'Complete all steps of a fear ladder', tier: 'signature', icon: '🏅' }
        ]
    }
};

// Get templates for a condition
function getConditionTemplates(condition, layerContext) {
    const conditionTemplates = CONDITION_TEMPLATES[condition] || CONDITION_TEMPLATES.everyone;
    if (layerContext === 'mixed') {
        return Object.entries(conditionTemplates).flatMap(([layer, templates]) => 
            templates.map(t => ({ ...t, layer }))
        );
    }
    return (conditionTemplates[layerContext] || []).map(t => ({ ...t, layer: layerContext }));
}

// Legacy support
const PLANT_TEMPLATES = CONDITION_TEMPLATES.autism;

const REWARDS = [
    { id: 'routine-explorer', name: 'Routine Explorer', layer: 'structure', icon: '🗺️', requirement: 5 },
    { id: 'communication-builder', name: 'Communication Builder', layer: 'communication', icon: '🏗️', requirement: 5 },
    { id: 'calm-detective', name: 'Calm Detective', layer: 'zones', icon: '🔍', requirement: 5 },
    { id: 'planner-practice', name: 'Planner in Practice', layer: 'selfMgmt', icon: '📋', requirement: 5 },
    { id: 'brave-stepper', name: 'Brave Stepper', layer: 'anxiety', icon: '🦋', requirement: 5 },
    { id: 'garden-grower', name: 'Garden Grower', layer: 'mixed', icon: '🌱', requirement: 10 },
    { id: 'harvest-hero', name: 'Harvest Hero', layer: 'mixed', icon: '🌻', requirement: 25 },
    { id: 'master-gardener', name: 'Master Gardener', layer: 'mixed', icon: '👑', requirement: 50 }
];

const TRAINING_TIERS = {
    starter: {
        name: 'Starter Training',
        icon: '🌱',
        tasks: [
            { id: 'plant-first', text: 'Plant your first seed', check: (s) => s.totalPlanted >= 1 },
            { id: 'water-first', text: 'Water a plant', check: (s) => s.totalWatered >= 1 },
            { id: 'harvest-first', text: 'Harvest your first plant', check: (s) => s.totalHarvested >= 1 }
        ]
    },
    focused: {
        name: 'Layer-Focused Training',
        icon: '🎯',
        tasks: [
            { id: 'structure-3', text: 'Complete 3 Structure tasks', check: (s) => (s.layerMastery?.structure || 0) >= 3 },
            { id: 'communication-3', text: 'Complete 3 Communication tasks', check: (s) => (s.layerMastery?.communication || 0) >= 3 },
            { id: 'zones-3', text: 'Complete 3 Zones tasks', check: (s) => (s.layerMastery?.zones || 0) >= 3 }
        ]
    },
    integrated: {
        name: 'Integrated Training',
        icon: '🌟',
        tasks: [
            { id: 'multi-layer', text: 'Complete tasks from 2+ layers in one day', check: (s) => s.multiLayerDays >= 1 },
            { id: 'week-streak', text: 'Garden activity 5 days in a week', check: (s) => s.weekStreak >= 5 },
            { id: 'all-layers', text: 'Complete at least 1 task from each layer', check: (s) => {
                const layers = ['structure', 'communication', 'zones', 'selfMgmt', 'anxiety'];
                return layers.every(l => (s.layerMastery?.[l] || 0) >= 1);
            }}
        ]
    }
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
}

function saveToStorage(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function getInitialState() {
    const saved = loadFromStorage();
    if (saved) return saved;
    return {
        profiles: [], learnersByProfile: {}, gardenByLearner: {}, collectionByLearner: {},
        levelsByLearner: {}, trainingByLearner: {}, settingsByLearner: {},
        currentProfileId: null, currentLearnerId: null
    };
}

function getRandomSeedReward(tier, mode) {
    const config = MODE_CONFIG[mode];
    const prog = config.progression[tier];
    if (!prog || prog.xpOnly) return null;
    if (mode === 'child' && tier === 'gentle') return { tier: 'gentle', count: 1 };
    const rand = Math.random();
    let cum = 0;
    for (const [seedTier, prob] of Object.entries(prog)) {
        if (seedTier === 'xpOnly' || seedTier === 'sparkEvery') continue;
        cum += prob;
        if (rand < cum) return { tier: seedTier, count: 1 };
    }
    return null;
}

// =============================================
// CONTEXT
// =============================================

const AppContext = createContext(null);
function useApp() { return useContext(AppContext); }

// =============================================
// MAIN APP COMPONENT
// =============================================

function App() {
    const [state, setState] = useState(getInitialState);
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    
    useEffect(() => { saveToStorage(state); }, [state]);
    
    const currentProfile = state.profiles.find(p => p.profileId === state.currentProfileId);
    const currentLearners = state.learnersByProfile[state.currentProfileId] || [];
    const currentLearner = currentLearners.find(l => l.learnerId === state.currentLearnerId);
    const learnerSettings = currentLearner ? state.settingsByLearner[currentLearner.learnerId] || {} : {};
    const lowStimMode = learnerSettings.lowStimulation || false;
    
    const updateLearnerData = useCallback((learnerId, key, data) => {
        setState(prev => ({ ...prev, [key]: { ...prev[key], [learnerId]: data } }));
    }, []);
    
    const createProfile = useCallback((name, type) => {
        const profileId = generateId();
        setState(prev => ({
            ...prev,
            profiles: [...prev.profiles, { profileId, name, type }],
            learnersByProfile: { ...prev.learnersByProfile, [profileId]: [] },
            currentProfileId: profileId
        }));
        return profileId;
    }, []);
    
    const selectProfile = useCallback((profileId) => {
        setState(prev => {
            const learners = prev.learnersByProfile[profileId] || [];
            return { ...prev, currentProfileId: profileId, currentLearnerId: learners.length > 0 ? learners[0].learnerId : null };
        });
    }, []);
    
    const createLearner = useCallback((profileId, name, audienceMode, condition = null) => {
        const learnerId = generateId();
        const config = MODE_CONFIG[audienceMode];
        const modeInfo = AUDIENCE_MODES[audienceMode] || {};
        const learnerCondition = condition || modeInfo.condition || 'everyone';
        setState(prev => ({
            ...prev,
            learnersByProfile: { ...prev.learnersByProfile, [profileId]: [...(prev.learnersByProfile[profileId] || []), { learnerId, name, audienceMode, condition: learnerCondition }] },
            gardenByLearner: { ...prev.gardenByLearner, [learnerId]: { plants: [], seedBank: { ...config.startingSeeds } } },
            collectionByLearner: { ...prev.collectionByLearner, [learnerId]: {} },
            levelsByLearner: { ...prev.levelsByLearner, [learnerId]: { level: 1, xp: 0, layerMastery: {} } },
            trainingByLearner: { ...prev.trainingByLearner, [learnerId]: { completedTasks: [], stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0, multiLayerDays: 0, weekStreak: 0 } } },
            settingsByLearner: { ...prev.settingsByLearner, [learnerId]: { lowStimulation: false } },
            currentLearnerId: learnerId
        }));
        return learnerId;
    }, []);
    
    const selectLearner = useCallback((learnerId) => {
        setState(prev => ({ ...prev, currentLearnerId: learnerId }));
    }, []);
    
    const plantSeed = useCallback((learnerId, template, customTitle = null) => {
        const garden = state.gardenByLearner[learnerId];
        const learner = currentLearners.find(l => l.learnerId === learnerId);
        if (!garden || !learner) return false;
        const config = MODE_CONFIG[learner.audienceMode];
        const activePlants = garden.plants.filter(p => p.status === 'active');
        if (activePlants.length >= config.maxPlots) return false;
        const tier = template.tier;
        const tierKey = config.tiers.includes(tier) ? tier : 
            (tier === 'everyday' && config.tiers.includes('gentle')) ? 'gentle' :
            (tier === 'special' && config.tiers.includes('spark')) ? 'spark' : tier;
        if ((garden.seedBank[tierKey] || 0) < 1) return false;
        const plant = {
            id: generateId(), learnerId, title: customTitle || template.title, description: template.description,
            mode: learner.audienceMode, layerTags: [template.layer || 'mixed'], context: template.layer || 'mixed',
            tier: tierKey, growthStage: 0, status: 'active', createdAt: Date.now(), updatedAt: Date.now(),
            timesWatered: 0, origin: template.id || 'custom', icon: template.icon || '🌱'
        };
        const newSeedBank = { ...garden.seedBank, [tierKey]: garden.seedBank[tierKey] - 1 };
        updateLearnerData(learnerId, 'gardenByLearner', { ...garden, plants: [...garden.plants, plant], seedBank: newSeedBank });
        const training = state.trainingByLearner[learnerId] || { completedTasks: [], stats: {} };
        updateLearnerData(learnerId, 'trainingByLearner', { ...training, stats: { ...training.stats, totalPlanted: (training.stats.totalPlanted || 0) + 1 } });
        return true;
    }, [state, currentLearners, updateLearnerData]);
    
    const waterPlant = useCallback((learnerId, plantId) => {
        const garden = state.gardenByLearner[learnerId];
        if (!garden) return false;
        const plantIndex = garden.plants.findIndex(p => p.id === plantId);
        if (plantIndex === -1) return false;
        const plant = garden.plants[plantIndex];
        if (plant.status !== 'active' || plant.growthStage >= 3) return false;
        const updatedPlant = { ...plant, growthStage: plant.growthStage + 1, timesWatered: plant.timesWatered + 1, updatedAt: Date.now() };
        const newPlants = [...garden.plants]; newPlants[plantIndex] = updatedPlant;
        updateLearnerData(learnerId, 'gardenByLearner', { ...garden, plants: newPlants });
        const training = state.trainingByLearner[learnerId] || { completedTasks: [], stats: {} };
        updateLearnerData(learnerId, 'trainingByLearner', { ...training, stats: { ...training.stats, totalWatered: (training.stats.totalWatered || 0) + 1 } });
        return true;
    }, [state, updateLearnerData]);
    
    const harvestPlant = useCallback((learnerId, plantId) => {
        const garden = state.gardenByLearner[learnerId];
        const learner = currentLearners.find(l => l.learnerId === learnerId);
        if (!garden || !learner) return null;
        const plantIndex = garden.plants.findIndex(p => p.id === plantId);
        if (plantIndex === -1) return null;
        const plant = garden.plants[plantIndex];
        if (plant.status !== 'active') return null;
        const updatedPlant = { ...plant, status: 'harvested', updatedAt: Date.now() };
        const newPlants = [...garden.plants]; newPlants[plantIndex] = updatedPlant;
        const reward = getRandomSeedReward(plant.tier, learner.audienceMode);
        const newSeedBank = { ...garden.seedBank };
        if (reward) newSeedBank[reward.tier] = (newSeedBank[reward.tier] || 0) + reward.count;
        updateLearnerData(learnerId, 'gardenByLearner', { ...garden, plants: newPlants, seedBank: newSeedBank });
        const collection = state.collectionByLearner[learnerId] || {};
        updateLearnerData(learnerId, 'collectionByLearner', { ...collection, [plant.origin]: (collection[plant.origin] || 0) + 1 });
        const levels = state.levelsByLearner[learnerId] || { level: 1, xp: 0, layerMastery: {} };
        const xpGain = plant.tier === 'signature' || plant.tier === 'spark' ? 30 : plant.tier === 'special' ? 20 : 10;
        const newXp = levels.xp + xpGain;
        const layerMastery = { ...levels.layerMastery };
        plant.layerTags.forEach(layer => { layerMastery[layer] = (layerMastery[layer] || 0) + 1; });
        updateLearnerData(learnerId, 'levelsByLearner', { level: Math.floor(newXp / 100) + 1, xp: newXp, layerMastery });
        const training = state.trainingByLearner[learnerId] || { completedTasks: [], stats: {} };
        updateLearnerData(learnerId, 'trainingByLearner', { ...training, stats: { ...training.stats, totalHarvested: (training.stats.totalHarvested || 0) + 1, layerMastery } });
        return { reward, xpGain };
    }, [state, currentLearners, updateLearnerData]);
    
    const weedPlant = useCallback((learnerId, plantId) => {
        const garden = state.gardenByLearner[learnerId];
        if (!garden) return false;
        const plantIndex = garden.plants.findIndex(p => p.id === plantId);
        if (plantIndex === -1) return false;
        const plant = garden.plants[plantIndex];
        if (plant.status !== 'active') return false;
        const newPlants = [...garden.plants]; newPlants[plantIndex] = { ...plant, status: 'weeded', updatedAt: Date.now() };
        updateLearnerData(learnerId, 'gardenByLearner', { ...garden, plants: newPlants });
        return true;
    }, [state, updateLearnerData]);
    
    const toggleLowStim = useCallback((learnerId) => {
        const settings = state.settingsByLearner[learnerId] || {};
        updateLearnerData(learnerId, 'settingsByLearner', { ...settings, lowStimulation: !settings.lowStimulation });
    }, [state, updateLearnerData]);
    
    const openModal = useCallback((modalType, data = null) => { setActiveModal(modalType); setModalData(data); }, []);
    const closeModal = useCallback(() => { setActiveModal(null); setModalData(null); }, []);
    
    const resetAllData = useCallback(() => {
        if (window.confirm('Are you sure you want to reset all data? This will delete all profiles, learners, gardens, and progress. This action cannot be undone.')) {
            try {
                localStorage.removeItem(STORAGE_KEY);
                const initialState = {
                    profiles: [], learnersByProfile: {}, gardenByLearner: {}, collectionByLearner: {},
                    levelsByLearner: {}, trainingByLearner: {}, settingsByLearner: {},
                    currentProfileId: null, currentLearnerId: null
                };
                setState(initialState);
                window.alert('All data has been reset. You can now start fresh!');
            } catch (e) {
                console.error('Error resetting data:', e);
                window.alert('There was an error resetting the data. Please try again.');
            }
        }
    }, []);
    
    const contextValue = {
        state, currentProfile, currentLearners, currentLearner, learnerSettings, lowStimMode,
        createProfile, selectProfile, createLearner, selectLearner,
        plantSeed, waterPlant, harvestPlant, weedPlant, toggleLowStim,
        openModal, closeModal, activeModal, modalData, resetAllData
    };
    
    return (
        <AppContext.Provider value={contextValue}>
            <div className={`app-container ${lowStimMode ? 'low-stim-mode' : ''} mode-${currentLearner?.audienceMode || 'everyone'}`}>
                <ProfileManager />
                <TutorialHelper />
                <main className="main-content">
                    <StickyNav />
                    <ConditionHub />
                </main>
                {activeModal && <ModalContainer />}
            </div>
        </AppContext.Provider>
    );
}

// =============================================
// HEADER & NAVIGATION
// =============================================

// SiteHeader removed - using HTML header instead
// Profile manager functionality moved to React component that attaches to HTML header
function ProfileManager() {
    const { state, currentProfile, currentLearners, currentLearner, selectProfile, selectLearner, learnerSettings, toggleLowStim, openModal, resetAllData } = useApp();
    
    useEffect(() => {
        const profileManagerContainer = document.getElementById('profile-manager-container');
        if (!profileManagerContainer) return;
        
        // Clear and rebuild the profile manager UI
        profileManagerContainer.innerHTML = '';
        
        if (state.profiles.length > 0) {
            // Profile select
            const profileSelect = document.createElement('select');
            profileSelect.className = 'profile-select';
            profileSelect.value = state.currentProfileId || '';
            profileSelect.setAttribute('aria-label', 'Select profile');
            profileSelect.innerHTML = '<option value="">Select Profile</option>' + 
                state.profiles.map(p => `<option value="${p.profileId}">${p.name}</option>`).join('');
            profileSelect.addEventListener('change', (e) => selectProfile(e.target.value));
            profileManagerContainer.appendChild(profileSelect);
            
            // Learner select
            if (currentProfile && currentLearners.length > 0) {
                const learnerSelect = document.createElement('select');
                learnerSelect.className = 'learner-select';
                learnerSelect.value = state.currentLearnerId || '';
                learnerSelect.setAttribute('aria-label', 'Select learner');
                learnerSelect.innerHTML = '<option value="">Select Learner</option>' + 
                    currentLearners.map(l => `<option value="${l.learnerId}">${l.name}</option>`).join('');
                learnerSelect.addEventListener('change', (e) => selectLearner(e.target.value));
                profileManagerContainer.appendChild(learnerSelect);
            }
            
            // Add Learner button
            const addLearnerBtn = document.createElement('button');
            addLearnerBtn.className = 'btn btn-secondary btn-small';
            addLearnerBtn.textContent = '+ Learner';
            addLearnerBtn.setAttribute('aria-label', 'Add learner');
            addLearnerBtn.addEventListener('click', () => openModal('addLearner'));
            profileManagerContainer.appendChild(addLearnerBtn);
            
            // Reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'btn btn-secondary btn-small btn-reset';
            resetBtn.textContent = '🔄 Reset';
            resetBtn.setAttribute('aria-label', 'Reset all data');
            resetBtn.title = 'Reset all profiles and data';
            resetBtn.addEventListener('click', resetAllData);
            profileManagerContainer.appendChild(resetBtn);
        }
        
        // Low-stim toggle
        if (currentLearner) {
            const lowStimContainer = document.createElement('div');
            lowStimContainer.className = 'low-stim-toggle';
            lowStimContainer.innerHTML = `
                            <span>Low-stim</span>
                <button class="toggle-switch ${learnerSettings.lowStimulation ? 'active' : ''}" 
                        role="switch" 
                        aria-checked="${learnerSettings.lowStimulation}" 
                        aria-label="Toggle low-stimulation mode"></button>
            `;
            const toggleBtn = lowStimContainer.querySelector('.toggle-switch');
            toggleBtn.addEventListener('click', () => toggleLowStim(currentLearner.learnerId));
            profileManagerContainer.appendChild(lowStimContainer);
        }
        
        // Set up Get Started button
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.style.display = state.profiles.length === 0 ? 'block' : 'none';
            // Remove existing listeners and add new one
            const newBtn = getStartedBtn.cloneNode(true);
            getStartedBtn.parentNode.replaceChild(newBtn, getStartedBtn);
            newBtn.addEventListener('click', () => openModal('createProfile'));
        }
    }, [state.profiles, state.currentProfileId, state.currentLearnerId, currentProfile, currentLearners, currentLearner, learnerSettings, selectProfile, selectLearner, toggleLowStim, openModal, resetAllData]);
    
    return null;
}

function StickyNav() {
    const { currentLearner } = useApp();
    const condition = currentLearner?.condition || 'autism';
    const layerConfig = getLayerConfig(condition);
    const sections = [
        { id: 'hub', label: 'Hub' },
        ...Object.entries(layerConfig).map(([key, config]) => ({ id: key, label: config.name }))
    ];
    return (
        <nav className="sticky-nav" aria-label="Section navigation">
            <ul className="nav-tabs" role="tablist">
                {sections.map(section => <li key={section.id} className="nav-tab"><a href={`#${section.id}`}>{section.label}</a></li>)}
            </ul>
        </nav>
    );
}

// =============================================
// MAIN HUB & SECTIONS
// =============================================

function ConditionHub() {
    const { currentLearner } = useApp();
    const condition = currentLearner?.condition || 'autism';
    const layerConfig = getLayerConfig(condition);
    const layers = Object.keys(layerConfig);
    
    return (
        <div className="condition-hub">
            <HubHero />
            {layers.map(layerKey => (
                <ConditionSection key={layerKey} layerKey={layerKey} layerConfig={layerConfig[layerKey]} />
            ))}
        </div>
    );
}

// Legacy name for backward compatibility
function AutismConditionHub() {
    return <ConditionHub />;
}

function HubHero() {
    const { currentLearner } = useApp();
    return (
        <section id="hub" className="hub-hero">
            <div className="hero-content">
                <h1 className="hero-title">Your Focus Garden</h1>
                <p className="hero-subtitle">Grow calm, build skills, and celebrate every small win. Plant seeds of focus and watch your abilities bloom.</p>
                {currentLearner ? (
                    <div className="hero-garden"><FocusGardenPanel learner={currentLearner} layerContext="mixed" /></div>
                ) : (
                    <div className="hero-garden">
                        <div className="garden-empty-state">
                            <div className="garden-empty-state-content">
                                <div className="garden-empty-state-icon" aria-hidden="true">🌱</div>
                                <div className="garden-empty-state-text">
                                    <h3>Welcome to NeuroBreath</h3>
                                    <p>Create a profile and add a learner to start growing your Focus Garden.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function ConditionSection({ layerKey, layerConfig }) {
    const { currentLearner } = useApp();
    const condition = currentLearner?.condition || 'autism';
    const descriptions = {
        autism: {
            structure: 'Build routines, schedules, and predictable patterns that create a calm foundation.',
            communication: 'Practice expressing needs, sharing feelings, and connecting with others.',
            zones: 'Understand your energy levels and learn tools to get to your best zone.',
            selfMgmt: 'Develop planning skills, coping strategies, and independence.',
            anxiety: 'Take brave steps, face fears gently, and build confidence one small win at a time.'
        },
        adhd: {
            focus: 'Build sustained attention and focus skills through structured practice.',
            organization: 'Develop organization systems and strategies for daily life.',
            energy: 'Manage energy levels and maintain optimal performance throughout the day.',
            impulsivity: 'Practice impulse control and thoughtful decision-making.'
        },
        dyslexia: {
            reading: 'Build reading skills and confidence through structured practice.',
            writing: 'Develop writing skills and express ideas clearly.',
            confidence: 'Build confidence and celebrate progress in learning.'
        },
        anxiety: {
            calm: 'Practice calming techniques and stress reduction strategies.',
            brave: 'Take brave steps and face fears with gradual exposure.',
            coping: 'Develop and use effective coping strategies for anxiety.'
        },
        depression: {
            nurture: 'Practice self-care and nurturing activities.',
            activity: 'Engage in positive activities and build momentum.',
            thoughts: 'Challenge negative thoughts and build positive thinking patterns.'
        },
        stress: {
            reset: 'Use quick reset techniques to manage stress in the moment.',
            balance: 'Maintain work-life balance and set healthy boundaries.',
            recovery: 'Practice recovery strategies and prevent burnout.'
        },
        sleep: {
            'wind-down': 'Establish effective wind-down routines for better sleep.',
            rest: 'Develop consistent sleep schedules and rest patterns.',
            quality: 'Improve sleep quality through proven techniques.'
        },
        everyone: {
            structure: 'Build routines, schedules, and predictable patterns.',
            communication: 'Practice expressing needs and connecting with others.',
            zones: 'Understand energy levels and learn regulation tools.',
            selfMgmt: 'Develop planning skills and coping strategies.',
            anxiety: 'Take brave steps and build confidence.'
        }
    };
    
    const description = descriptions[condition]?.[layerKey] || layerConfig.name;
    const sectionId = layerKey === 'wind-down' ? 'wind-down' : layerKey;
    
    return (
        <section id={sectionId} className="section">
            <div className="section-inner">
                <div className="section-header">
                    <div className={`section-icon ${layerKey}`} style={{ background: layerConfig.color + '30' }}>{layerConfig.icon}</div>
                    <h2 className="section-title">{layerConfig.name}</h2>
                    <p className="section-description">{description}</p>
                </div>
                {currentLearner && <FocusGardenPanel learner={currentLearner} layerContext={layerKey} />}
            </div>
        </section>
    );
}

// Legacy sections for backward compatibility
function StructureSection() {
    return <ConditionSection layerKey="structure" layerConfig={getLayerConfig('autism').structure} />;
}

function CommunicationSection() {
    return <ConditionSection layerKey="communication" layerConfig={getLayerConfig('autism').communication} />;
}

function ZonesSection() {
    const { currentLearner } = useApp();
    const [selectedZone, setSelectedZone] = useState('green');
    return (
        <section id="zones" className="section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-icon zones">🌈</div>
                    <h2 className="section-title">Zones of Regulation</h2>
                    <p className="section-description">Understand your energy levels and learn tools to get to your best zone.</p>
                </div>
                <div className="zone-selector" role="radiogroup" aria-label="Select zone">
                    {Object.entries(ZONES).map(([key, zone]) => (
                        <button key={key} className={`zone-btn ${key} ${selectedZone === key ? 'active' : ''}`} onClick={() => setSelectedZone(key)} role="radio" aria-checked={selectedZone === key}>{zone.name}</button>
                    ))}
                </div>
                {currentLearner && <FocusGardenPanel learner={currentLearner} layerContext="zones" zoneContext={selectedZone} />}
            </div>
        </section>
    );
}

function SelfManagementSection() {
    return <ConditionSection layerKey="selfMgmt" layerConfig={getLayerConfig('autism').selfMgmt} />;
}

function AnxietyCoachingSection() {
    return <ConditionSection layerKey="anxiety" layerConfig={getLayerConfig('autism').anxiety} />;
}

// =============================================
// FOCUS GARDEN PANEL
// =============================================

function FocusGardenPanel({ learner, layerContext, zoneContext }) {
    const { state, openModal } = useApp();
    const [tempMode, setTempMode] = useState(null);
    const mode = tempMode || learner.audienceMode;
    const garden = state.gardenByLearner[learner.learnerId] || { plants: [], seedBank: {} };
    const levels = state.levelsByLearner[learner.learnerId] || { level: 1, xp: 0, layerMastery: {} };
    const config = MODE_CONFIG[mode];
    const activePlants = garden.plants.filter(p => p.status === 'active');
    const xpProgress = levels.xp % 100;
    
    return (
        <div className="focus-garden-panel">
            <div className="garden-header">
                <div className="mode-dropdown">
                    <label htmlFor={`mode-${layerContext}`}>Who is this for today?</label>
                    <select id={`mode-${layerContext}`} value={mode} onChange={(e) => setTempMode(e.target.value)}>
                        {Object.values(AUDIENCE_MODES).map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
                <div className="garden-stats">
                    <div className="stat-item"><div className="stat-value">{activePlants.length}/{config.maxPlots}</div><div className="stat-label">Plots</div></div>
                    {config.tiers.map(tier => <div key={tier} className="stat-item"><div className="stat-value">{garden.seedBank[tier] || 0}</div><div className="stat-label">{config.tierLabels[tier]} Seeds</div></div>)}
                </div>
            </div>
            <div className="level-progress">
                <div className="level-header"><span className="level-title">🌻 Garden Level {levels.level}</span><span className="text-muted">{xpProgress}/100 XP</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${xpProgress}%` }} /></div>
            </div>
            <div className="mastery-summary">
                {Object.entries(getLayerConfig(learner.condition || 'autism')).map(([key, cfg]) => <div key={key} className={`mastery-badge ${key}`}><div className="mastery-badge-icon">{cfg.icon}</div><span>{levels.layerMastery[key] || 0}</span></div>)}
            </div>
            <GardenCanvas plants={activePlants} maxPlots={config.maxPlots} mode={mode} learnerId={learner.learnerId} />
            <div className="garden-actions">
                <button className="btn btn-primary" onClick={() => openModal('seedBank', { learnerId: learner.learnerId, mode, layerContext, zoneContext })} disabled={activePlants.length >= config.maxPlots}>🌱 Plant Seed</button>
                <button className="btn btn-secondary" onClick={() => openModal('collection', { learnerId: learner.learnerId, mode })}>🌸 Collection</button>
                <button className="btn btn-secondary" onClick={() => openModal('training', { learnerId: learner.learnerId })}>📚 Training</button>
                <button className="btn btn-secondary" onClick={() => openModal('rewards', { learnerId: learner.learnerId })}>🏆 Rewards</button>
            </div>
        </div>
    );
}

// =============================================
// GARDEN CANVAS
// =============================================

function GardenCanvas({ plants, maxPlots, mode, learnerId }) {
    const canvasRef = useRef(null);
    const { openModal, lowStimMode } = useApp();
    const animationRef = useRef(null);
    
    const drawGarden = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        const width = rect.width, height = rect.height;
        
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#D4E5EE'); gradient.addColorStop(0.5, '#C4D4C5'); gradient.addColorStop(1, '#C4B5A5');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
        
        // Ground
        ctx.fillStyle = '#8B7355';
        ctx.beginPath(); ctx.moveTo(0, height * 0.7); ctx.quadraticCurveTo(width * 0.5, height * 0.65, width, height * 0.7);
        ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath(); ctx.fill();
        
        // Grass
        ctx.fillStyle = '#6B8B6E';
        ctx.beginPath(); ctx.moveTo(0, height * 0.68); ctx.quadraticCurveTo(width * 0.3, height * 0.65, width * 0.5, height * 0.67);
        ctx.quadraticCurveTo(width * 0.7, height * 0.69, width, height * 0.66); ctx.lineTo(width, height * 0.72);
        ctx.quadraticCurveTo(width * 0.5, height * 0.75, 0, height * 0.72); ctx.closePath(); ctx.fill();
        
        // Plots - Realistic tilled soil beds
        const plotWidth = Math.min(120, (width - 40) / maxPlots);
        const plotSpacing = (width - (plotWidth * maxPlots)) / (maxPlots + 1);
        const plotY = height * 0.5;
        
        for (let i = 0; i < maxPlots; i++) {
            const plotX = plotSpacing + (plotSpacing + plotWidth) * i;
            const plotCenterX = plotX + plotWidth/2;
            const plotCenterY = plotY + 40;
            
            // Plot shadow for depth
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(plotCenterX + 2, plotCenterY + 2, plotWidth/2 - 3, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Main plot - dark tilled soil
            const plotGradient = ctx.createRadialGradient(plotCenterX, plotCenterY, 0, plotCenterX, plotCenterY, plotWidth/2);
            plotGradient.addColorStop(0, '#5D4037');
            plotGradient.addColorStop(0.5, '#4E342E');
            plotGradient.addColorStop(1, '#3E2723');
            ctx.fillStyle = plotGradient;
            ctx.beginPath();
            ctx.ellipse(plotCenterX, plotCenterY, plotWidth/2 - 5, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Tilled soil texture - rows
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 1;
            for (let row = 0; row < 8; row++) {
                const y = plotCenterY - 18 + (row * 4.5);
                ctx.beginPath();
                ctx.ellipse(plotCenterX, y, plotWidth/2 - 8, 1, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Soil clumps for realism (using seeded random for consistency)
            ctx.fillStyle = '#4E342E';
            const seed = i * 1234; // Seed based on plot index
            for (let j = 0; j < 6; j++) {
                // Simple seeded random
                const rand1 = ((seed + j * 567) % 1000) / 1000;
                const rand2 = ((seed + j * 789) % 1000) / 1000;
                const rand3 = ((seed + j * 345) % 1000) / 1000;
                const clumpX = plotCenterX - plotWidth/3 + rand1 * (plotWidth * 2/3);
                const clumpY = plotCenterY - 15 + rand2 * 30;
                ctx.beginPath();
                ctx.arc(clumpX, clumpY, 2 + rand3 * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Raised bed edge highlight
            ctx.strokeStyle = '#6D4C41';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(plotCenterX, plotCenterY - 18, plotWidth/2 - 5, 18, 0, 0, Math.PI);
            ctx.stroke();
        }
        
        // Plants
        const time = Date.now() / 1000;
        plants.forEach((plant, index) => {
            if (index >= maxPlots) return;
            const plotX = plotSpacing + (plotSpacing + plotWidth) * index;
            const centerX = plotX + plotWidth / 2;
            const baseY = plotY + 25;
            const sway = lowStimMode ? 0 : Math.sin(time * 2 + index) * 3;
            drawPlant(ctx, centerX, baseY, plant, sway);
        });
        
        if (!lowStimMode) animationRef.current = requestAnimationFrame(drawGarden);
    }, [plants, maxPlots, lowStimMode]);
    
    useEffect(() => {
        drawGarden();
        const handleResize = () => drawGarden();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [drawGarden]);
    
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || plants.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const plotWidth = Math.min(120, (width - 40) / maxPlots);
        const plotSpacing = (width - (plotWidth * maxPlots)) / (maxPlots + 1);
        plants.forEach((plant, index) => {
            if (index >= maxPlots) return;
            const plotX = plotSpacing + (plotSpacing + plotWidth) * index;
            if (x >= plotX && x <= plotX + plotWidth) openModal('plantActions', { plant, learnerId });
        });
    };
    
    return (
        <div className="garden-canvas-container">
            <canvas ref={canvasRef} className="garden-canvas" onClick={handleCanvasClick} style={{ cursor: plants.length > 0 ? 'pointer' : 'default' }} />
            {plants.length === 0 && <div className="garden-empty-state"><div className="garden-empty-state-icon">🌱</div><p>Your garden is waiting! Plant a seed to begin.</p></div>}
        </div>
    );
}

function drawPlant(ctx, x, y, plant, sway) {
    const stage = plant.growthStage;
    const tierColors = { everyday: '#9DB4A0', special: '#B8A9C9', signature: '#D4A59A', gentle: '#A8C5D8', spark: '#B8A9C9' };
    const color = tierColors[plant.tier] || '#9DB4A0';
    const height = 20 + stage * 25;
    
    ctx.save();
    ctx.translate(x + sway, y);
    
    // Stem
    ctx.strokeStyle = '#6B8B6E'; ctx.lineWidth = 3 + stage; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sway * 0.5, -height/2, 0, -height); ctx.stroke();
    
    // Leaves (stage 1+)
    if (stage >= 1) {
        ctx.fillStyle = '#7FB285';
        [-1, 1].forEach((dir, i) => { ctx.beginPath(); ctx.ellipse(dir * 12, -height * 0.4 - i * 5, 15, 8, dir * 0.5, 0, Math.PI * 2); ctx.fill(); });
    }
    
    // Flower (stage 2+)
    if (stage >= 2) {
        const flowerSize = 12 + stage * 4;
        ctx.fillStyle = color;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            const angle = (i / 6) * Math.PI * 2;
            ctx.ellipse(Math.cos(angle) * flowerSize * 0.6, -height - 5 + Math.sin(angle) * flowerSize * 0.6, flowerSize * 0.5, flowerSize * 0.3, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#E5C76B'; ctx.beginPath(); ctx.arc(0, -height - 5, flowerSize * 0.3, 0, Math.PI * 2); ctx.fill();
    }
    
    // Glow (stage 3)
    if (stage >= 3) {
        ctx.shadowColor = color; ctx.shadowBlur = 15;
        ctx.fillStyle = color + '40'; ctx.beginPath(); ctx.arc(0, -height - 5, 25, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    // Icon
    ctx.font = `${16 + stage * 4}px sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(plant.icon, 0, -height - (stage >= 2 ? 25 : 5));
    ctx.restore();
}

// =============================================
// MODALS
// =============================================

function ModalContainer() {
    const { activeModal, closeModal, modalData } = useApp();
    const handleOverlayClick = (e) => { if (e.target === e.currentTarget) closeModal(); };
    const renderModal = () => {
        switch (activeModal) {
            case 'createProfile': return <CreateProfileModal />;
            case 'addLearner': return <AddLearnerModal />;
            case 'seedBank': return <SeedBankModal data={modalData} />;
            case 'collection': return <PlantCollectionModal data={modalData} />;
            case 'training': return <TrainingModal data={modalData} />;
            case 'rewards': return <RewardsModal data={modalData} />;
            case 'plantActions': return <PlantActionsModal data={modalData} />;
            case 'tutorial': return <TutorialModal data={modalData} />;
            default: return null;
        }
    };
    return <div className="modal-overlay" onClick={handleOverlayClick}>{renderModal()}</div>;
}

function CreateProfileModal() {
    const { createProfile, createLearner, closeModal } = useApp();
    const [step, setStep] = useState(1);
    const [profileName, setProfileName] = useState('');
    const [profileType, setProfileType] = useState('individual');
    const [learnerName, setLearnerName] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('autism');
    const [ageGroup, setAgeGroup] = useState('child');
    const [profileId, setProfileId] = useState(null);
    
    const handleCreateProfile = (e) => { e.preventDefault(); if (!profileName.trim()) return; const id = createProfile(profileName.trim(), profileType); setProfileId(id); setStep(2); };
    
    const getAvailableModes = () => {
        if (selectedCondition === 'everyone') {
            return [{ value: 'everyone', label: 'General / Everyone' }];
        }
        if (selectedCondition === 'anxiety' || selectedCondition === 'depression' || selectedCondition === 'stress' || selectedCondition === 'sleep') {
            return [{ value: selectedCondition, label: CONDITIONS[selectedCondition].label }];
        }
        return Object.values(AUDIENCE_MODES).filter(m => m.condition === selectedCondition && m.ageGroup === ageGroup);
    };
    
    const handleCreateLearner = (e) => {
        e.preventDefault();
        if (!learnerName.trim() || !profileId) return;
        const availableModes = getAvailableModes();
        const audienceMode = availableModes.length > 0 ? availableModes[0].value : 'everyone';
        createLearner(profileId, learnerName.trim(), audienceMode, selectedCondition);
        closeModal();
    };
    
    return (
        <div className="modal" role="dialog" aria-labelledby="create-profile-title">
            <div className="modal-header">
                <h2 id="create-profile-title" className="modal-title">{step === 1 ? 'Create Your Profile' : 'Add First Learner'}</h2>
                <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
                {step === 1 ? (
                    <form onSubmit={handleCreateProfile}>
                        <div className="form-group"><label className="form-label" htmlFor="profile-name">Profile Name</label><input id="profile-name" type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g., Smith Family" required /></div>
                        <div className="form-group"><label className="form-label" htmlFor="profile-type">Profile Type</label><select id="profile-type" className="form-select" value={profileType} onChange={(e) => setProfileType(e.target.value)}><option value="individual">Individual</option><option value="family">Family</option><option value="group">Group / Classroom</option></select></div>
                        <button type="submit" className="btn btn-primary">Continue</button>
                    </form>
                ) : (
                    <form onSubmit={handleCreateLearner}>
                        <div className="form-group"><label className="form-label" htmlFor="learner-name">Learner Name</label><input id="learner-name" type="text" className="form-input" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="e.g., Alex" required /></div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="condition-select">Condition / Focus Area</label>
                            <select id="condition-select" className="form-select" value={selectedCondition} onChange={(e) => { setSelectedCondition(e.target.value); if (e.target.value === 'everyone' || ['anxiety', 'depression', 'stress', 'sleep'].includes(e.target.value)) setAgeGroup('adult'); }}>
                                <optgroup label="Neurodevelopmental">
                                    {Object.entries(CONDITIONS).filter(([k, v]) => v.category === 'neurodevelopmental').map(([key, cond]) => <option key={key} value={key}>{cond.icon} {cond.label}</option>)}
                                </optgroup>
                                <optgroup label="Mental Health">
                                    {Object.entries(CONDITIONS).filter(([k, v]) => v.category === 'mental-health').map(([key, cond]) => <option key={key} value={key}>{cond.icon} {cond.label}</option>)}
                                </optgroup>
                                <optgroup label="General">
                                    {Object.entries(CONDITIONS).filter(([k, v]) => v.category === 'general').map(([key, cond]) => <option key={key} value={key}>{cond.icon} {cond.label}</option>)}
                                </optgroup>
                            </select>
                        </div>
                        {['autism', 'adhd', 'dyslexia'].includes(selectedCondition) && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="age-group">Age Group</label>
                                <select id="age-group" className="form-select" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                                    {Object.values(AGE_GROUPS).map(age => <option key={age.value} value={age.value}>{age.label}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Focus Training Type</label>
                            <div className="condition-preview" style={{ padding: 'var(--space-sm)', background: 'var(--color-cream)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-xs)' }}>
                                <strong>{CONDITIONS[selectedCondition]?.icon} {CONDITIONS[selectedCondition]?.label}</strong>
                                {['autism', 'adhd', 'dyslexia'].includes(selectedCondition) && <span> • {AGE_GROUPS[ageGroup]?.label}</span>}
                                <p style={{ margin: 'var(--space-xs) 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    Tailored focus training for {CONDITIONS[selectedCondition]?.label.toLowerCase()}
                                </p>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Start Growing</button>
                    </form>
                )}
            </div>
        </div>
    );
}

function AddLearnerModal() {
    const { state, createLearner, closeModal } = useApp();
    const [learnerName, setLearnerName] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('autism');
    const [ageGroup, setAgeGroup] = useState('child');
    
    const getAvailableModes = () => {
        if (selectedCondition === 'everyone') {
            return [{ value: 'everyone', label: 'General / Everyone' }];
        }
        if (selectedCondition === 'anxiety' || selectedCondition === 'depression' || selectedCondition === 'stress' || selectedCondition === 'sleep') {
            return [{ value: selectedCondition, label: CONDITIONS[selectedCondition].label }];
        }
        return Object.values(AUDIENCE_MODES).filter(m => m.condition === selectedCondition && m.ageGroup === ageGroup);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!learnerName.trim() || !state.currentProfileId) return;
        const availableModes = getAvailableModes();
        const audienceMode = availableModes.length > 0 ? availableModes[0].value : 'everyone';
        createLearner(state.currentProfileId, learnerName.trim(), audienceMode, selectedCondition);
        closeModal();
    };
    
    return (
        <div className="modal" role="dialog" aria-labelledby="add-learner-title">
            <div className="modal-header"><h2 id="add-learner-title" className="modal-title">Add New Learner</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label className="form-label" htmlFor="new-learner-name">Learner Name</label><input id="new-learner-name" type="text" className="form-input" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="e.g., Jordan" required /></div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="new-condition-select">Condition / Focus Area</label>
                        <select id="new-condition-select" className="form-select" value={selectedCondition} onChange={(e) => { setSelectedCondition(e.target.value); if (e.target.value === 'everyone' || ['anxiety', 'depression', 'stress', 'sleep'].includes(e.target.value)) setAgeGroup('adult'); }}>
                            <optgroup label="Neurodevelopmental">
                                {Object.entries(CONDITIONS).filter(([k, v]) => v.category === 'neurodevelopmental').map(([key, cond]) => <option key={key} value={key}>{cond.icon} {cond.label}</option>)}
                            </optgroup>
                            <optgroup label="Mental Health">
                                {Object.entries(CONDITIONS).filter(([k, v]) => v.category === 'mental-health').map(([key, cond]) => <option key={key} value={key}>{cond.icon} {cond.label}</option>)}
                            </optgroup>
                            <optgroup label="General">
                                {Object.entries(CONDITIONS).filter(([k, v]) => v.category === 'general').map(([key, cond]) => <option key={key} value={key}>{cond.icon} {cond.label}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    {['autism', 'adhd', 'dyslexia'].includes(selectedCondition) && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="new-age-group">Age Group</label>
                            <select id="new-age-group" className="form-select" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                                {Object.values(AGE_GROUPS).map(age => <option key={age.value} value={age.value}>{age.label}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Focus Training Type</label>
                        <div className="condition-preview" style={{ padding: 'var(--space-sm)', background: 'var(--color-cream)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-xs)' }}>
                            <strong>{CONDITIONS[selectedCondition]?.icon} {CONDITIONS[selectedCondition]?.label}</strong>
                            {['autism', 'adhd', 'dyslexia'].includes(selectedCondition) && <span> • {AGE_GROUPS[ageGroup]?.label}</span>}
                            <p style={{ margin: 'var(--space-xs) 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                Tailored focus training for {CONDITIONS[selectedCondition]?.label.toLowerCase()}
                            </p>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Learner</button>
                </form>
            </div>
        </div>
    );
}

function SeedBankModal({ data }) {
    const { state, plantSeed, closeModal } = useApp();
    const { learnerId, mode, layerContext } = data;
    const [customMode, setCustomMode] = useState(false);
    const [customTitle, setCustomTitle] = useState('');
    const [customTier, setCustomTier] = useState('everyday');
    const config = MODE_CONFIG[mode];
    const garden = state.gardenByLearner[learnerId] || { plants: [], seedBank: {} };
    const learner = state.learnersByProfile[state.currentProfileId]?.find(l => l.learnerId === learnerId);
    const condition = learner?.condition || (mode?.startsWith('autism') ? 'autism' : mode?.startsWith('adhd') ? 'adhd' : mode?.startsWith('dyslexia') ? 'dyslexia' : mode || 'everyone');
    
    const getTemplates = () => {
        return getConditionTemplates(condition, layerContext);
    };
    const templates = getTemplates();
    
    const handlePlant = (template) => { const success = plantSeed(learnerId, template); if (success) closeModal(); };
    const handleCustomPlant = (e) => {
        e.preventDefault(); if (!customTitle.trim()) return;
        const tierKey = config.tiers.includes(customTier) ? customTier : (customTier === 'everyday' && config.tiers.includes('gentle')) ? 'gentle' : (customTier === 'special' && config.tiers.includes('spark')) ? 'spark' : customTier;
        const customTemplate = { id: 'custom-' + Date.now(), title: customTitle.trim(), description: 'Custom task', tier: tierKey, layer: layerContext, icon: '🌿' };
        const success = plantSeed(learnerId, customTemplate, customTitle.trim()); if (success) closeModal();
    };
    
    const getTierLabel = (tier) => { if (mode === 'child') { if (tier === 'everyday') return 'Gentle'; if (tier === 'special') return 'Spark'; if (tier === 'signature') return null; } return config.tierLabels[tier] || tier; };
    const getSeedCount = (tier) => { const tierKey = config.tiers.includes(tier) ? tier : (tier === 'everyday' && config.tiers.includes('gentle')) ? 'gentle' : (tier === 'special' && config.tiers.includes('spark')) ? 'spark' : tier; return garden.seedBank[tierKey] || 0; };
    
    return (
        <div className="modal" role="dialog" aria-labelledby="seed-bank-title">
            <div className="modal-header"><h2 id="seed-bank-title" className="modal-title">🌱 Seed Bank</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                <div className="mb-lg">
                    <button className={`btn ${!customMode ? 'btn-primary' : 'btn-secondary'} btn-small`} onClick={() => setCustomMode(false)}>Templates</button>
                    <button className={`btn ${customMode ? 'btn-primary' : 'btn-secondary'} btn-small`} onClick={() => setCustomMode(true)} style={{ marginLeft: '0.5rem' }}>Custom Task</button>
                </div>
                {!customMode ? (
                    <div className="seed-bank-grid">
                        {templates.map(template => {
                            const tierLabel = getTierLabel(template.tier); if (!tierLabel) return null;
                            const seedCount = getSeedCount(template.tier); const canPlant = seedCount > 0;
                            return (
                                <button key={template.id} className={`seed-card ${!canPlant ? 'disabled' : ''}`} onClick={() => canPlant && handlePlant(template)} disabled={!canPlant}>
                                    <div className="seed-visual-wrapper">
                                        <svg className="realistic-seed" viewBox="0 0 100 100" width="70" height="70">
                                            <defs>
                                                <radialGradient id={`seedGradient-${template.id}`} cx="35%" cy="30%">
                                                    <stop offset="0%" stopColor="#E8D5B7" />
                                                    <stop offset="30%" stopColor="#D4A574" />
                                                    <stop offset="60%" stopColor="#A67C52" />
                                                    <stop offset="100%" stopColor="#8B5A3C" />
                                                </radialGradient>
                                                <filter id={`seedShadow-${template.id}`}>
                                                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                                                    <feOffset dx="2" dy="2" result="offsetblur"/>
                                                    <feComponentTransfer>
                                                        <feFuncA type="linear" slope="0.3"/>
                                                    </feComponentTransfer>
                                                    <feMerge>
                                                        <feMergeNode/>
                                                        <feMergeNode in="SourceGraphic"/>
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <ellipse cx="50" cy="50" rx="32" ry="26" fill={`url(#seedGradient-${template.id})`} filter={`url(#seedShadow-${template.id})`} />
                                            <ellipse cx="42" cy="45" rx="14" ry="11" fill="#E8D5B7" opacity="0.7" />
                                            <ellipse cx="45" cy="48" rx="8" ry="6" fill="#F5E6D3" opacity="0.8" />
                                        </svg>
                                    </div>
                                    <span className={`seed-card-tier ${template.tier}`}>{tierLabel}</span>
                                    <div className="seed-card-title">{template.icon} {template.title}</div>
                                    <div className="seed-card-desc">{template.description}</div>
                                    <div className="seed-count">🌱 {seedCount} seeds</div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <form onSubmit={handleCustomPlant}>
                        <div className="form-group"><label className="form-label" htmlFor="custom-task-title">Task Name</label><input id="custom-task-title" type="text" className="form-input" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} placeholder="e.g., Practice deep breaths before lunch" required /></div>
                        <div className="form-group"><label className="form-label" htmlFor="custom-task-tier">Tier</label><select id="custom-task-tier" className="form-select" value={customTier} onChange={(e) => setCustomTier(e.target.value)}>{config.tiers.map(tier => <option key={tier} value={tier}>{config.tierLabels[tier]} ({garden.seedBank[tier] || 0} seeds)</option>)}</select></div>
                        <button type="submit" className="btn btn-primary" disabled={getSeedCount(customTier) < 1}>Plant Custom Seed</button>
                    </form>
                )}
            </div>
        </div>
    );
}

function PlantCollectionModal({ data }) {
    const { state, closeModal } = useApp();
    const { learnerId, mode } = data;
    const collection = state.collectionByLearner[learnerId] || {};
    const config = MODE_CONFIG[mode];
    const allPlants = Object.entries(PLANT_TEMPLATES).flatMap(([layer, templates]) => templates.map(t => ({ ...t, layer })));
    const plantsByTier = {};
    config.tiers.forEach(tier => {
        plantsByTier[tier] = allPlants.filter(p => { if (mode === 'child') { if (tier === 'gentle') return p.tier === 'everyday'; if (tier === 'spark') return p.tier === 'special'; } return p.tier === tier; });
    });
    
    return (
        <div className="modal" role="dialog" aria-labelledby="collection-title">
            <div className="modal-header"><h2 id="collection-title" className="modal-title">🌸 Plant Collection</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                {config.tiers.map(tier => {
                    const tierLabel = config.tierLabels[tier]; const plants = plantsByTier[tier] || [];
                    return (
                        <div key={tier} className="mb-lg">
                            <h3 className="mb-md">{tierLabel} Plants</h3>
                            <div className="collection-grid">
                                {plants.map(plant => {
                                    const count = collection[plant.id] || 0; const discovered = count > 0;
                                    return (
                                        <div key={plant.id} className={`collection-item ${!discovered ? 'undiscovered' : ''}`} title={discovered ? plant.description : 'Not yet discovered'}>
                                            <div className="collection-plant-icon">{plant.icon}</div>
                                            <div className="collection-item-name">{discovered ? plant.title : '???'}</div>
                                            <div className="collection-item-count">{discovered ? `Grown ${count}×` : 'Locked'}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TrainingModal({ data }) {
    const { state, closeModal } = useApp();
    const { learnerId } = data;
    const training = state.trainingByLearner[learnerId] || { completedTasks: [], stats: {} };
    const levels = state.levelsByLearner[learnerId] || { level: 1, xp: 0, layerMastery: {} };
    const stats = { ...training.stats, layerMastery: levels.layerMastery };
    
    return (
        <div className="modal" role="dialog" aria-labelledby="training-title">
            <div className="modal-header"><h2 id="training-title" className="modal-title">📚 Training Progress</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                {Object.entries(TRAINING_TIERS).map(([tierKey, tier]) => (
                    <div key={tierKey} className="training-tier">
                        <div className="training-tier-header"><div className={`training-tier-badge ${tierKey}`}>{tier.icon}</div><div><h3>{tier.name}</h3></div></div>
                        <ul className="training-checklist">
                            {tier.tasks.map(task => { const completed = task.check(stats); return (
                                <li key={task.id} className="training-checklist-item">
                                    <div className={`training-checkbox ${completed ? 'completed' : ''}`}>{completed && '✓'}</div>
                                    <span style={{ opacity: completed ? 0.6 : 1 }}>{task.text}</span>
                                </li>
                            ); })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RewardsModal({ data }) {
    const { state, closeModal } = useApp();
    const { learnerId } = data;
    const levels = state.levelsByLearner[learnerId] || { level: 1, xp: 0, layerMastery: {} };
    const training = state.trainingByLearner[learnerId] || { stats: {} };
    const totalHarvested = training.stats?.totalHarvested || 0;
    const checkRewardUnlocked = (reward) => { if (reward.layer === 'mixed') return totalHarvested >= reward.requirement; return (levels.layerMastery[reward.layer] || 0) >= reward.requirement; };
    
    return (
        <div className="modal" role="dialog" aria-labelledby="rewards-title">
            <div className="modal-header"><h2 id="rewards-title" className="modal-title">🏆 Rewards & Badges</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                <div className="rewards-grid">
                    {REWARDS.map(reward => {
                        const unlocked = checkRewardUnlocked(reward);
                        return (
                            <div key={reward.id} className={`reward-item ${unlocked ? 'unlocked' : 'locked'}`}>
                                <div className="reward-icon">{reward.icon}</div>
                                <div className="reward-name">{reward.name}</div>
                                <div className="reward-desc">{unlocked ? 'Unlocked!' : `Complete ${reward.requirement} tasks`}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function PlantActionsModal({ data }) {
    const { waterPlant, harvestPlant, weedPlant, closeModal } = useApp();
    const { plant, learnerId } = data;
    const growthLabels = ['Seedling', 'Sprouting', 'Budding', 'Blooming'];
    
    const handleWater = () => { waterPlant(learnerId, plant.id); closeModal(); };
    const handleHarvest = () => { harvestPlant(learnerId, plant.id); closeModal(); };
    const handleWeed = () => { if (confirm('Are you sure you want to remove this task? This cannot be undone.')) { weedPlant(learnerId, plant.id); closeModal(); } };
    
    return (
        <div className="modal" role="dialog" aria-labelledby="plant-actions-title">
            <div className="modal-header"><h2 id="plant-actions-title" className="modal-title">{plant.icon} {plant.title}</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                <p className="text-muted mb-md">{plant.description}</p>
                <div className="mb-lg">
                    <div className="level-header"><span className="level-title">Growth: {growthLabels[plant.growthStage]}</span><span className="text-muted">Stage {plant.growthStage + 1}/4</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${((plant.growthStage + 1) / 4) * 100}%` }} /></div>
                </div>
                <div className="garden-actions">
                    {plant.growthStage < 3 && <button className="btn btn-primary" onClick={handleWater}>💧 Water (Grow)</button>}
                    <button className="btn btn-primary" onClick={handleHarvest} style={{ background: '#D4A59A' }}>🌻 Harvest (Complete)</button>
                    <button className="btn btn-secondary" onClick={handleWeed}>🗑️ Weed (Remove)</button>
                </div>
                <p className="text-muted mt-md" style={{ fontSize: '0.875rem' }}>Water your plant when you make progress on the task. Harvest when complete to earn rewards!</p>
            </div>
        </div>
    );
}

// =============================================
// FOOTER
// =============================================

function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <p className="footer-text">🌱 NeuroBreath – Focus Garden • A calming space to grow skills and celebrate progress</p>
                <nav className="footer-nav" style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="index.html" style={{ color: 'inherit', textDecoration: 'underline' }}>Home</a>
                    <a href="autism.html" style={{ color: 'inherit', textDecoration: 'underline' }}>Autism Support</a>
                    <a href="resources.html" style={{ color: 'inherit', textDecoration: 'underline' }}>Resources</a>
                </nav>
            </div>
        </footer>
    );
}

// =============================================
// TUTORIAL SYSTEM
// =============================================

function TutorialHelper() {
    const { state, openModal } = useApp();
    const [showHelpButton, setShowHelpButton] = useState(true);
    const hasSeenTutorial = localStorage.getItem('neurobreath_tutorial_seen') === 'true';
    
    useEffect(() => {
        if (!hasSeenTutorial && state.profiles.length > 0 && state.currentLearnerId) {
            setTimeout(() => {
                openModal('tutorial', { step: 0 });
            }, 1000);
        }
    }, [hasSeenTutorial, state.profiles.length, state.currentLearnerId, openModal]);
    
    if (!showHelpButton) return null;
    
    return (
        <button 
            className="tutorial-help-btn" 
            onClick={() => openModal('tutorial', { step: 0 })}
            aria-label="Show tutorial"
            title="How to use Focus Garden"
        >
            <span className="tutorial-help-icon">❓</span>
            <span className="tutorial-help-text">Help</span>
        </button>
    );
}

function TutorialModal({ data }) {
    const { closeModal } = useApp();
    const [currentStep, setCurrentStep] = useState(data?.step || 0);
    const [animationKey, setAnimationKey] = useState(0);
    
    const tutorialSteps = [
        {
            title: 'Welcome to Focus Garden! 🌱',
            content: 'Focus Garden helps you grow focus skills through gentle, plant-based tasks. Let\'s learn how to use it!',
            illustration: 'welcome',
            action: 'next'
        },
        {
            title: '1. Create Your Profile',
            content: 'Start by creating a profile. This can be for yourself, your family, or a group. Click "Get Started" in the header to begin.',
            illustration: 'profile',
            action: 'next',
            highlight: '#get-started-btn'
        },
        {
            title: '2. Add a Learner',
            content: 'After creating a profile, add a learner. Choose the condition and age group that best fits. Each learner gets their own garden!',
            illustration: 'learner',
            action: 'next'
        },
        {
            title: '3. Explore Sections',
            content: 'Scroll through different sections like Structure, Communication, Zones, and more. Each section has focus training tasks tailored to your needs.',
            illustration: 'sections',
            action: 'next',
            highlight: '.sticky-nav'
        },
        {
            title: '4. Plant a Seed',
            content: 'Click "Plant Seed" to open the Seed Bank. Choose a task that matches your tier (Gentle, Spark, Everyday, Special, etc.). Each task is a seed you can grow!',
            illustration: 'plant-seed',
            action: 'next',
            highlight: '.garden-actions .btn-primary'
        },
        {
            title: '5. Watch Your Garden Grow',
            content: 'Your seeds appear in the garden canvas. Click on a plant to water it (complete the task). Plants grow through stages: Seed → Sprout → Bud → Bloom!',
            illustration: 'garden-grow',
            action: 'next',
            highlight: '.garden-canvas'
        },
        {
            title: '6. Water Your Plants',
            content: 'Click on a plant in your garden to open actions. Water it to help it grow to the next stage. Complete tasks to progress!',
            illustration: 'water-plant',
            action: 'next'
        },
        {
            title: '7. Harvest & Collect',
            content: 'When a plant reaches full bloom (stage 3), harvest it! You\'ll earn XP, level up, and collect seeds for new plants. Check your collection to see all your achievements!',
            illustration: 'harvest',
            action: 'next'
        },
        {
            title: '8. Track Progress',
            content: 'View your training progress, rewards, and level mastery. Each section tracks your growth. Celebrate your wins!',
            illustration: 'progress',
            action: 'next'
        },
        {
            title: '9. Levels & Tiers',
            content: 'Start with basic tier seeds (Gentle/Everyday). As you complete tasks, you unlock higher tiers (Spark/Special/Signature). Higher tiers give more XP!',
            illustration: 'tiers',
            action: 'next'
        },
        {
            title: '10. You\'re Ready!',
            content: 'You now know how to use Focus Garden! Remember: take it slow, celebrate small wins, and enjoy watching your garden grow. Happy growing! 🌱',
            illustration: 'complete',
            action: 'finish'
        }
    ];
    
    const currentStepData = tutorialSteps[currentStep];
    const isLast = currentStep === tutorialSteps.length - 1;
    
    const handleNext = () => {
        if (isLast) {
            localStorage.setItem('neurobreath_tutorial_seen', 'true');
            closeModal();
        } else {
            setCurrentStep(currentStep + 1);
            setAnimationKey(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setAnimationKey(prev => prev + 1);
        }
    };
    
    const handleSkip = () => {
        localStorage.setItem('neurobreath_tutorial_seen', 'true');
        closeModal();
    };
    
    useEffect(() => {
        if (currentStepData.highlight) {
            const element = document.querySelector(currentStepData.highlight);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('tutorial-highlight');
                return () => element.classList.remove('tutorial-highlight');
            }
        }
    }, [currentStep, currentStepData.highlight]);
    
    return (
        <div className="modal tutorial-modal" role="dialog" aria-labelledby="tutorial-title">
            <div className="modal-header">
                <h2 id="tutorial-title" className="modal-title">📚 How to Use Focus Garden</h2>
                <button className="modal-close" onClick={handleSkip} aria-label="Close tutorial">×</button>
            </div>
            <div className="modal-body tutorial-body">
                <div className="tutorial-illustration" key={animationKey}>
                    <TutorialIllustration type={currentStepData.illustration} />
                </div>
                <div className="tutorial-content">
                    <h3 className="tutorial-step-title">{currentStepData.title}</h3>
                    <p className="tutorial-step-text">{currentStepData.content}</p>
                </div>
                <div className="tutorial-progress">
                    <div className="tutorial-progress-bar">
                        <div 
                            className="tutorial-progress-fill" 
                            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                        />
                    </div>
                    <span className="tutorial-progress-text">
                        Step {currentStep + 1} of {tutorialSteps.length}
                    </span>
                </div>
                <div className="tutorial-actions">
                    <button 
                        className="btn btn-secondary tutorial-skip" 
                        onClick={handleSkip}
                    >
                        Skip Tutorial
                    </button>
                    <div className="tutorial-nav">
                        <button 
                            className="btn btn-secondary" 
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                        >
                            ← Previous
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleNext}
                        >
                            {isLast ? 'Finish' : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TutorialIllustration({ type }) {
    const [animationPhase, setAnimationPhase] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationPhase(prev => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    
    const renderIllustration = () => {
        switch (type) {
            case 'welcome':
                return (
                    <div className="tutorial-ill-welcome">
                        <div className="tutorial-plant-animated">
                            <div className="tutorial-seed">🌱</div>
                            <div className="tutorial-sprout">🌿</div>
                            <div className="tutorial-bloom">🌸</div>
                        </div>
                        <div className="tutorial-garden-bg">🌳🌲🌴</div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="tutorial-ill-profile">
                        <div className="tutorial-card">
                            <div className="tutorial-card-header">👤 Profile</div>
                            <div className="tutorial-card-content">
                                <div className="tutorial-input">Name: [Your Name]</div>
                                <div className="tutorial-select">Type: Individual</div>
                            </div>
                        </div>
                        <div className="tutorial-arrow">↓</div>
                        <div className="tutorial-success">✓ Created!</div>
                    </div>
                );
            case 'learner':
                return (
                    <div className="tutorial-ill-learner">
                        <div className="tutorial-card">
                            <div className="tutorial-card-header">👨‍🎓 Add Learner</div>
                            <div className="tutorial-card-content">
                                <div className="tutorial-input">Name: Alex</div>
                                <div className="tutorial-select">Condition: 🧩 Autism</div>
                                <div className="tutorial-select">Age: Child</div>
                            </div>
                        </div>
                    </div>
                );
            case 'sections':
                return (
                    <div className="tutorial-ill-sections">
                        <div className="tutorial-nav-items">
                            <div className="tutorial-nav-item active">📋 Structure</div>
                            <div className="tutorial-nav-item">💬 Communication</div>
                            <div className="tutorial-nav-item">🌈 Zones</div>
                            <div className="tutorial-nav-item">🧭 Self-Management</div>
                            <div className="tutorial-nav-item">🦋 Anxiety</div>
                        </div>
                    </div>
                );
            case 'plant-seed':
                return (
                    <div className="tutorial-ill-plant-seed">
                        <div className="tutorial-seed-bank">
                            <div className="tutorial-seed-card">
                                <div className="tutorial-seed-visual">🌱</div>
                                <div className="tutorial-seed-title">Morning Routine</div>
                                <div className="tutorial-seed-tier">Gentle</div>
                            </div>
                        </div>
                        <div className="tutorial-arrow">↓ Click to Plant</div>
                        <div className="tutorial-garden-mini">
                            <div className="tutorial-plot">🌱</div>
                        </div>
                    </div>
                );
            case 'garden-grow':
                return (
                    <div className="tutorial-ill-garden-grow">
                        <div className="tutorial-garden-stages">
                            <div className="tutorial-stage">
                                <div className="tutorial-plant-stage">🌱</div>
                                <div className="tutorial-stage-label">Seed</div>
                            </div>
                            <div className="tutorial-arrow-h">→</div>
                            <div className="tutorial-stage">
                                <div className="tutorial-plant-stage">🌿</div>
                                <div className="tutorial-stage-label">Sprout</div>
                            </div>
                            <div className="tutorial-arrow-h">→</div>
                            <div className="tutorial-stage">
                                <div className="tutorial-plant-stage">🌷</div>
                                <div className="tutorial-stage-label">Bud</div>
                            </div>
                            <div className="tutorial-arrow-h">→</div>
                            <div className="tutorial-stage">
                                <div className="tutorial-plant-stage">🌸</div>
                                <div className="tutorial-stage-label">Bloom</div>
                            </div>
                        </div>
                    </div>
                );
            case 'water-plant':
                return (
                    <div className="tutorial-ill-water-plant">
                        <div className="tutorial-plant-interactive">
                            <div className="tutorial-plant">🌿</div>
                            <div className="tutorial-water-drop">💧</div>
                        </div>
                        <div className="tutorial-arrow">↓ Click to Water</div>
                        <div className="tutorial-plant-grown">🌷</div>
                    </div>
                );
            case 'harvest':
                return (
                    <div className="tutorial-ill-harvest">
                        <div className="tutorial-harvest-plant">🌸</div>
                        <div className="tutorial-arrow">↓ Harvest</div>
                        <div className="tutorial-rewards">
                            <div className="tutorial-reward">⭐ XP +10</div>
                            <div className="tutorial-reward">🌱 Seed +1</div>
                            <div className="tutorial-reward">📊 Level Up!</div>
                        </div>
                    </div>
                );
            case 'progress':
                return (
                    <div className="tutorial-ill-progress">
                        <div className="tutorial-progress-card">
                            <div className="tutorial-progress-header">📊 Progress</div>
                            <div className="tutorial-progress-stats">
                                <div className="tutorial-stat">Level: 3</div>
                                <div className="tutorial-stat">XP: 150/200</div>
                                <div className="tutorial-stat">Plants: 12</div>
                            </div>
                            <div className="tutorial-progress-bar-mini">
                                <div className="tutorial-progress-fill-mini" style={{ width: '75%' }} />
                            </div>
                        </div>
                    </div>
                );
            case 'tiers':
                return (
                    <div className="tutorial-ill-tiers">
                        <div className="tutorial-tier-row">
                            <div className="tutorial-tier-card gentle">🌱 Gentle</div>
                            <div className="tutorial-arrow-h">→</div>
                            <div className="tutorial-tier-card spark">✨ Spark</div>
                            <div className="tutorial-arrow-h">→</div>
                            <div className="tutorial-tier-card special">💎 Special</div>
                        </div>
                        <div className="tutorial-tier-explanation">
                            Start with Gentle, unlock Spark, then Special!
                        </div>
                    </div>
                );
            case 'complete':
                return (
                    <div className="tutorial-ill-complete">
                        <div className="tutorial-celebration">🎉</div>
                        <div className="tutorial-garden-complete">
                            <div className="tutorial-plant">🌱</div>
                            <div className="tutorial-plant">🌿</div>
                            <div className="tutorial-plant">🌷</div>
                            <div className="tutorial-plant">🌸</div>
                        </div>
                        <div className="tutorial-success-message">You're all set!</div>
                    </div>
                );
            default:
                return <div className="tutorial-ill-default">🌱</div>;
        }
    };
    
    return (
        <div className={`tutorial-illustration-container tutorial-ill-${type}`}>
            {renderIllustration()}
        </div>
    );
}

// =============================================
// RENDER APP
// =============================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

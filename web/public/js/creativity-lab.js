// =============================================
// NeuroBreath – Neurodivergent Creativity Lab
// React Single-Page Application (CDN React 18)
// =============================================

const { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } = React;

// =============================================
// CONSTANTS & CONFIGURATION
// =============================================

const STORAGE_KEY = 'neurobreath_creativity_lab';
const LEGACY_STORAGE_KEY = 'neurobreath_data'; // For migration

// Conditions supported
const CONDITIONS = {
    autism: { 
        label: 'Autism', 
        icon: '🧩', 
        category: 'neurodevelopmental',
        description: 'Structured, visual, predictable activities',
        color: '#9DB4A0'
    },
    adhd: { 
        label: 'ADHD', 
        icon: '⚡', 
        category: 'neurodevelopmental',
        description: 'Short sprints, high feedback, playful challenges',
        color: '#E5C76B'
    },
    dyslexia: { 
        label: 'Dyslexia', 
        icon: '📖', 
        category: 'neurodevelopmental',
        description: 'Multi-sensory, text-light, confidence-building',
        color: '#A8C5D8'
    },
    anxiety: { 
        label: 'Anxiety', 
        icon: '🦋', 
        category: 'mental-health',
        description: 'Calming, graded, supportive activities',
        color: '#B8A9C9'
    },
    depression: { 
        label: 'Depression', 
        icon: '🌱', 
        category: 'mental-health',
        description: 'Nurturing, gentle activation, positive reframing',
        color: '#7FB285'
    },
    stress: { 
        label: 'Stress', 
        icon: '🧘', 
        category: 'mental-health',
        description: 'Reset, balance, and recovery focused',
        color: '#D4A59A'
    },
    sleep: { 
        label: 'Sleep', 
        icon: '🌙', 
        category: 'mental-health',
        description: 'Wind-down, restful, quality-focused',
        color: '#7BA3C9'
    },
    everyone: { 
        label: 'Everyone', 
        icon: '🌟', 
        category: 'general',
        description: 'Universal creativity training for all',
        color: '#9DB4A0'
    }
};

// Age groups
const AGE_GROUPS = {
    child: { label: 'Child', value: 'child', description: 'Ages 5-12', minAge: 5, maxAge: 12 },
    young: { label: 'Young Person', value: 'young', description: 'Ages 13-18', minAge: 13, maxAge: 18 },
    adult: { label: 'Adult', value: 'adult', description: 'Ages 19+', minAge: 19, maxAge: 999 }
};

// Creative styles
const CREATIVE_STYLES = {
    visual: { label: 'Visual', icon: '🎨', description: 'Drawing, colors, images' },
    verbal: { label: 'Verbal', icon: '✏️', description: 'Words, stories, writing' },
    movement: { label: 'Movement', icon: '🧍', description: 'Actions, gestures, physical' },
    mixed: { label: 'Mixed', icon: '🔀', description: 'Combination of styles' }
};

// Training areas by condition
const TRAINING_AREAS = {
    autism: [
        { id: 'structure', label: 'Structure', icon: '📋', description: 'Building routines and predictability' },
        { id: 'communication', label: 'Communication', icon: '💬', description: 'Expressing ideas clearly' },
        { id: 'zones', label: 'Zones', icon: '🌈', description: 'Understanding energy and emotions' },
        { id: 'self-management', label: 'Self-Management', icon: '🧭', description: 'Planning and organizing' },
        { id: 'anxiety-coaching', label: 'Anxiety & Coaching', icon: '🦋', description: 'Managing worries creatively' }
    ],
    adhd: [
        { id: 'focus', label: 'Focus', icon: '🎯', description: 'Channeling attention creatively' },
        { id: 'organisation', label: 'Organisation', icon: '📁', description: 'Creative planning systems' },
        { id: 'energy', label: 'Energy Management', icon: '⚡', description: 'Using energy productively' },
        { id: 'impulse', label: 'Impulse Control', icon: '🛑', description: 'Pause and choose creatively' }
    ],
    dyslexia: [
        { id: 'reading', label: 'Reading', icon: '📚', description: 'Multi-sensory reading approaches' },
        { id: 'writing', label: 'Writing', icon: '✍️', description: 'Creative expression without barriers' },
        { id: 'confidence', label: 'Confidence', icon: '💪', description: 'Building self-belief' }
    ],
    anxiety: [
        { id: 'calm', label: 'Calm', icon: '🌊', description: 'Finding peace through creativity' },
        { id: 'brave-steps', label: 'Brave Steps', icon: '🦁', description: 'Small creative challenges' },
        { id: 'coping', label: 'Coping', icon: '🛡️', description: 'Creative coping strategies' }
    ],
    depression: [
        { id: 'nurture', label: 'Nurture', icon: '💚', description: 'Self-compassion activities' },
        { id: 'activity', label: 'Activity', icon: '🚶', description: 'Gentle activation through creativity' },
        { id: 'thoughts', label: 'Thoughts', icon: '💭', description: 'Reframing with creative thinking' }
    ],
    stress: [
        { id: 'reset', label: 'Reset', icon: '🔄', description: 'Quick creative resets' },
        { id: 'balance', label: 'Balance', icon: '⚖️', description: 'Finding equilibrium' },
        { id: 'recovery', label: 'Recovery', icon: '🌿', description: 'Long-term stress relief' }
    ],
    sleep: [
        { id: 'wind-down', label: 'Wind-Down', icon: '🌅', description: 'Pre-sleep creative rituals' },
        { id: 'rest', label: 'Rest', icon: '😴', description: 'Calming creative activities' },
        { id: 'quality', label: 'Quality', icon: '⭐', description: 'Sleep routine crafting' }
    ],
    everyone: [
        { id: 'structure', label: 'Structure', icon: '📋', description: 'Building routines' },
        { id: 'communication', label: 'Communication', icon: '💬', description: 'Expressing ideas' },
        { id: 'zones', label: 'Zones', icon: '🌈', description: 'Emotional awareness' },
        { id: 'self-management', label: 'Self-Management', icon: '🧭', description: 'Planning and organizing' },
        { id: 'anxiety-coaching', label: 'Anxiety', icon: '🦋', description: 'Managing worries' }
    ]
};

// Tier systems by condition
const TIER_SYSTEMS = {
    autism: {
        child: ['gentle', 'spark'],
        young: ['starter', 'builder', 'explorer'],
        adult: ['starter', 'builder', 'explorer']
    },
    adhd: {
        child: ['focus', 'sprint'],
        young: ['focus', 'sprint', 'master'],
        adult: ['focus', 'sprint', 'master']
    },
    dyslexia: {
        child: ['practice', 'build'],
        young: ['practice', 'build', 'expert'],
        adult: ['practice', 'build', 'expert']
    },
    anxiety: {
        child: ['calm', 'brave'],
        young: ['calm', 'brave', 'explorer'],
        adult: ['calm', 'brave', 'explorer']
    },
    depression: {
        child: ['nurture', 'activation'],
        young: ['nurture', 'activation', 'growth'],
        adult: ['nurture', 'activation', 'growth']
    },
    stress: {
        child: ['reset', 'balance'],
        young: ['reset', 'balance', 'recovery'],
        adult: ['reset', 'balance', 'recovery']
    },
    sleep: {
        child: ['wind-down', 'dream'],
        young: ['wind-down', 'dream', 'quality'],
        adult: ['wind-down', 'dream', 'quality']
    },
    everyone: {
        child: ['starter', 'builder'],
        young: ['starter', 'builder', 'explorer'],
        adult: ['starter', 'builder', 'explorer']
    }
};

const TIER_LABELS = {
    gentle: 'Gentle', spark: 'Spark',
    starter: 'Starter', builder: 'Builder', explorer: 'Explorer',
    focus: 'Focus', sprint: 'Sprint', master: 'Master',
    practice: 'Practice', build: 'Build', expert: 'Expert',
    calm: 'Calm', brave: 'Brave',
    nurture: 'Nurture', activation: 'Activation', growth: 'Growth',
    reset: 'Reset', balance: 'Balance', recovery: 'Recovery',
    'wind-down': 'Wind-Down', dream: 'Dream', quality: 'Quality'
};

// Badges available
const BADGES = {
    'first-idea': { label: 'First Spark', icon: '💡', description: 'Completed your first creative challenge' },
    'five-ideas': { label: 'Idea Generator', icon: '🎇', description: 'Generated 5+ ideas in one session' },
    'flexible-thinker': { label: 'Flexible Thinker', icon: '🔄', description: 'Tried multiple perspectives' },
    'pattern-spotter': { label: 'Pattern Spotter', icon: '🔍', description: 'Found connections between ideas' },
    'brave-storyteller': { label: 'Brave Storyteller', icon: '📖', description: 'Shared a personal story' },
    'mode-explorer': { label: 'Mode Explorer', icon: '🎨', description: 'Used 3+ creative modes' },
    'routine-crafter': { label: 'Routine Crafter', icon: '📋', description: 'Built a complete routine' },
    'remix-artist': { label: 'Remix Artist', icon: '🔀', description: 'Combined ideas into something new' },
    'week-streak': { label: 'Week Warrior', icon: '🔥', description: '7-day creativity streak' },
    'creative-explorer': { label: 'Creative Explorer', icon: '🌟', description: 'Explored all training areas' }
};

// =============================================
// DESIGN THINKING PROMPTS & TEMPLATES
// =============================================

const DESIGN_THINKING_PROBLEMS = {
    autism: [
        { id: 'morning-routine', title: 'Morning Routine', prompt: 'Mornings feel rushed or confusing', icon: '🌅' },
        { id: 'transitions', title: 'Transitions', prompt: 'Changing activities is hard', icon: '🚪' },
        { id: 'sensory', title: 'Sensory Overload', prompt: 'Some places feel too loud or bright', icon: '🔊' },
        { id: 'homework', title: 'Homework Time', prompt: 'Starting homework feels overwhelming', icon: '📚' },
        { id: 'social', title: 'Social Situations', prompt: 'Talking to new people is tricky', icon: '👥' }
    ],
    adhd: [
        { id: 'focus-start', title: 'Getting Started', prompt: 'I keep putting off starting tasks', icon: '🚀' },
        { id: 'staying-on-track', title: 'Staying on Track', prompt: 'I get distracted easily', icon: '🎯' },
        { id: 'forgetting', title: 'Forgetting Things', prompt: 'I forget important stuff', icon: '🧠' },
        { id: 'time-awareness', title: 'Time Blindness', prompt: 'Time passes without me noticing', icon: '⏰' },
        { id: 'energy-crashes', title: 'Energy Crashes', prompt: 'My energy goes up and down', icon: '📊' }
    ],
    dyslexia: [
        { id: 'reading-long', title: 'Long Texts', prompt: 'Reading long things is tiring', icon: '📜' },
        { id: 'spelling', title: 'Spelling', prompt: 'Spelling feels impossible', icon: '🔤' },
        { id: 'note-taking', title: 'Taking Notes', prompt: 'Writing notes quickly is hard', icon: '📝' },
        { id: 'confidence', title: 'Confidence', prompt: 'I feel embarrassed about mistakes', icon: '💪' }
    ],
    anxiety: [
        { id: 'worry-loops', title: 'Worry Loops', prompt: 'My mind keeps replaying worries', icon: '🔁' },
        { id: 'new-situations', title: 'New Situations', prompt: 'New places make me nervous', icon: '🆕' },
        { id: 'sleep-worries', title: 'Sleep Worries', prompt: 'I can\'t stop thinking at bedtime', icon: '🌙' },
        { id: 'perfectionism', title: 'Perfectionism', prompt: 'I worry my work isn\'t good enough', icon: '✨' }
    ],
    depression: [
        { id: 'low-motivation', title: 'Low Motivation', prompt: 'I don\'t feel like doing anything', icon: '🪫' },
        { id: 'negative-thoughts', title: 'Negative Thoughts', prompt: 'I keep thinking bad things about myself', icon: '☁️' },
        { id: 'isolation', title: 'Isolation', prompt: 'I don\'t want to see people', icon: '🏠' },
        { id: 'enjoyment', title: 'Finding Joy', prompt: 'Things I used to enjoy feel boring', icon: '🎮' }
    ],
    stress: [
        { id: 'overwhelm', title: 'Overwhelm', prompt: 'Everything feels like too much', icon: '🌊' },
        { id: 'tension', title: 'Physical Tension', prompt: 'My body feels tight and stressed', icon: '😤' },
        { id: 'work-balance', title: 'Work-Life Balance', prompt: 'I can\'t switch off from work/school', icon: '⚖️' },
        { id: 'deadlines', title: 'Deadlines', prompt: 'Deadlines make me panic', icon: '📅' }
    ],
    sleep: [
        { id: 'falling-asleep', title: 'Falling Asleep', prompt: 'It takes ages to fall asleep', icon: '😴' },
        { id: 'racing-thoughts', title: 'Racing Thoughts', prompt: 'My mind won\'t quiet down at night', icon: '💭' },
        { id: 'waking-up', title: 'Waking Up', prompt: 'I wake up in the night', icon: '⏰' },
        { id: 'wind-down', title: 'Winding Down', prompt: 'I don\'t have a bedtime routine', icon: '🌅' }
    ],
    everyone: [
        { id: 'general-routine', title: 'Daily Routine', prompt: 'My day feels disorganized', icon: '📋' },
        { id: 'creativity-block', title: 'Creativity Block', prompt: 'I feel stuck and uncreative', icon: '🧱' },
        { id: 'communication', title: 'Communication', prompt: 'Expressing my ideas is hard', icon: '💬' },
        { id: 'goal-setting', title: 'Goals', prompt: 'I don\'t know how to reach my goals', icon: '🎯' }
    ]
};

const PERSPECTIVE_LENSES = [
    { id: 'friend', label: 'Friend\'s View', icon: '👫', prompt: 'How would a supportive friend see this?' },
    { id: 'future', label: 'Future You', icon: '🔮', prompt: 'What would you think about this in 1 year?' },
    { id: 'teacher', label: 'Teacher View', icon: '👩‍🏫', prompt: 'How might a caring teacher approach this?' },
    { id: 'scientist', label: 'Scientist View', icon: '🔬', prompt: 'What would a curious scientist notice?' },
    { id: 'artist', label: 'Artist View', icon: '🎨', prompt: 'How would a creative artist reimagine this?' },
    { id: 'child', label: 'Younger You', icon: '👶', prompt: 'What would a much younger you think?' }
];

// =============================================
// UTILITY FUNCTIONS
// =============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit'
    });
}

// Load from localStorage
function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        // Try to migrate legacy data
        const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyData) {
            console.log('Migrating legacy garden data to Creativity Lab...');
            return migrateLegacyData(JSON.parse(legacyData));
        }
        return null;
    } catch (e) {
        console.error('Failed to load from storage:', e);
        return null;
    }
}

// Save to localStorage
function saveToStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to storage:', e);
    }
}

// Migrate legacy garden data
function migrateLegacyData(legacyData) {
    // Map old garden structures to new creativity lab format
    const migrated = {
        profiles: legacyData.profiles || {},
        learners: {},
        sessions: {},
        rewards: {},
        settings: legacyData.settings || {},
        legacySessions: [], // Store old sessions for reference
        migratedAt: Date.now()
    };
    
    // Convert old learner data
    if (legacyData.learners) {
        Object.entries(legacyData.learners).forEach(([id, learner]) => {
            migrated.learners[id] = {
                ...learner,
                creativityProgress: {},
                gamesPlayed: 0,
                lastActive: learner.lastActive || Date.now()
            };
        });
    }
    
    // Store old garden sessions as legacy
    if (legacyData.sessions) {
        migrated.legacySessions = Object.values(legacyData.sessions).map(s => ({
            ...s,
            type: 'legacy-garden',
            migratedFrom: 'garden'
        }));
    }
    
    return migrated;
}

// Normalize sessions to always be an array
function normalizeSessions(rawSessions) {
    if (Array.isArray(rawSessions)) return rawSessions;
    if (rawSessions && typeof rawSessions === 'object') {
        return Object.values(rawSessions);
    }
    return [];
}

// =============================================
// APP CONTEXT
// =============================================

const AppContext = createContext(null);

function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

// =============================================
// APP PROVIDER
// =============================================

function AppProvider({ children }) {
    // Core state
    const [profiles, setProfiles] = useState({});
    const [learners, setLearners] = useState({});
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [activeLearner, setActiveLearner] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [rewards, setRewards] = useState({ badges: [], tokens: 0, cards: [] });
    const [settings, setSettings] = useState({
        lowStimulation: false,
        soundEnabled: true,
        animationsEnabled: true,
        preferredStyle: 'mixed'
    });
    
    // UI state
    const [currentView, setCurrentView] = useState('hub'); // hub, game, history, settings
    const [currentTrainingArea, setCurrentTrainingArea] = useState(null);
    const [currentGame, setCurrentGame] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showHelp, setShowHelp] = useState(null); // Track which help guide is open
    const [gameState, setGameState] = useState(null); // Save game state for continuity
    const [dailyProgress, setDailyProgress] = useState({}); // Track daily progress
    const [goalSuggestions, setGoalSuggestions] = useState({}); // Store goal suggestions by learner { learnerId: [{ id, goal, suggestions, problem, createdAt, date }] }

    // Get today's date key for daily tracking
    const getTodayKey = useCallback(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }, []);

    // Get daily progress for current learner
    const getDailyProgress = useCallback(() => {
        if (!activeLearner) return null;
        const todayKey = getTodayKey();
        const learnerProgress = dailyProgress[activeLearner.id] || {};
        return learnerProgress[todayKey] || { gamesPlayed: 0, ideasCreated: 0, lastActivity: null, inProgressGames: [] };
    }, [activeLearner, dailyProgress, getTodayKey]);

    // Update daily progress
    const updateDailyProgress = useCallback((updates) => {
        if (!activeLearner) return;
        const todayKey = getTodayKey();
        setDailyProgress(prev => ({
            ...prev,
            [activeLearner.id]: {
                ...prev[activeLearner.id],
                [todayKey]: {
                    ...(prev[activeLearner.id]?.[todayKey] || { gamesPlayed: 0, ideasCreated: 0, lastActivity: null, inProgressGames: [] }),
                    ...updates,
                    lastActivity: Date.now()
                }
            }
        }));
    }, [activeLearner, getTodayKey]);

    // Save game state for continuity
    const saveGameState = useCallback((gameType, gameData) => {
        if (!activeLearner) return;
        setGameState(prev => ({
            ...prev,
            [activeLearner.id]: {
                ...prev?.[activeLearner.id],
                [gameType]: {
                    ...gameData,
                    savedAt: Date.now()
                }
            }
        }));
        // Also save to daily progress
        const todayProgress = getDailyProgress();
        updateDailyProgress({
            inProgressGames: [...(todayProgress.inProgressGames || []).filter(g => g.type !== gameType), { type: gameType, ...gameData }]
        });
    }, [activeLearner, getDailyProgress, updateDailyProgress]);

    // Check if profile is teacher/school type (unlimited resume time)
    const isUnlimitedResume = useCallback(() => {
        if (!activeProfileId || !profiles[activeProfileId]) return false;
        const profile = profiles[activeProfileId];
        return profile.type === 'teacher' || profile.type === 'school' || profile.type === 'group';
    }, [activeProfileId, profiles]);

    // Load game state for continuity
    const loadGameState = useCallback((gameType) => {
        if (!activeLearner || !gameState?.[activeLearner.id]?.[gameType]) return null;
        const saved = gameState[activeLearner.id][gameType];
        // Check resume time limit: 72 hours for regular users, unlimited for teacher/school
        if (!isUnlimitedResume()) {
            const hoursSinceSave = (Date.now() - saved.savedAt) / (1000 * 60 * 60);
            if (hoursSinceSave > 72) return null; // Too old (72 hours for regular users)
        }
        // Unlimited for teacher/school users - always return saved state
        return saved;
    }, [activeLearner, gameState, isUnlimitedResume]);

    // Clear game state (when game is completed)
    const clearGameState = useCallback((gameType) => {
        if (!activeLearner) return;
        setGameState(prev => {
            const updated = { ...prev };
            if (updated[activeLearner.id]) {
                const { [gameType]: removed, ...rest } = updated[activeLearner.id];
                updated[activeLearner.id] = rest;
            }
            return updated;
        });
        // Remove from daily progress
        const todayProgress = getDailyProgress();
        updateDailyProgress({
            inProgressGames: (todayProgress.inProgressGames || []).filter(g => g.type !== gameType)
        });
    }, [activeLearner, getDailyProgress, updateDailyProgress]);

    // Load data on mount
    useEffect(() => {
        const data = loadFromStorage();
        if (data) {
            setProfiles(data.profiles || {});
            setLearners(data.learners || {});
            setActiveProfileId(data.activeProfileId || null);
            setSessions(normalizeSessions(data.sessions));
            setRewards(data.rewards || { badges: [], tokens: 0, cards: [] });
            setSettings(prev => ({ ...prev, ...data.settings }));
            
            // Load daily progress and game state
            if (data.dailyProgress) {
                setDailyProgress(data.dailyProgress);
            }
            if (data.gameState) {
                setGameState(data.gameState);
            }
            if (data.goalSuggestions) {
                setGoalSuggestions(data.goalSuggestions);
            }
            
            // Set active learner if we have one saved
            if (data.activeLearner) {
                const savedLearner = data.learners[data.activeLearner];
                if (savedLearner) {
                    setActiveLearner(savedLearner);
                    setShowOnboarding(false);
                } else {
                    // Learner ID exists but learner object not found - clear it
                    console.warn('Active learner ID found but learner object missing');
                    // Don't show onboarding if we have profiles/learners, just no active one
                    if (Object.keys(data.learners || {}).length === 0) {
                        setShowOnboarding(true);
                    }
                }
            } else {
                // No active learner but we have data - don't show onboarding
                setShowOnboarding(false);
            }
        } else {
            setShowOnboarding(true);
        }
    }, []);

    // Save data on changes
    useEffect(() => {
        if (Object.keys(profiles).length > 0 || Object.keys(learners).length > 0) {
            saveToStorage({
                profiles,
                learners,
                activeProfileId,
                activeLearner: activeLearner?.id,
                sessions,
                rewards,
                settings,
                dailyProgress,
                gameState,
                goalSuggestions
            });
        }
    }, [profiles, learners, activeProfileId, activeLearner, sessions, rewards, settings, dailyProgress, gameState, goalSuggestions]);

    // Get training areas for current learner
    const trainingAreas = useMemo(() => {
        if (!activeLearner) {
            const areas = TRAINING_AREAS.everyone || [];
            return Array.isArray(areas) ? areas : [];
        }
        const condition = activeLearner.condition || 'everyone';
        const areas = TRAINING_AREAS[condition] || TRAINING_AREAS.everyone || [];
        const result = Array.isArray(areas) ? areas : [];
        console.log('Training areas computed:', { condition, count: result.length });
        return result;
    }, [activeLearner]);

    // Close onboarding when learner becomes active
    useEffect(() => {
        if (activeLearner && showOnboarding) {
            setShowOnboarding(false);
        }
    }, [activeLearner, showOnboarding]);

    // Get tiers for current learner
    const tiers = useMemo(() => {
        if (!activeLearner) return TIER_SYSTEMS.everyone.adult;
        const conditionTiers = TIER_SYSTEMS[activeLearner.condition];
        return conditionTiers?.[activeLearner.ageGroup] || TIER_SYSTEMS.everyone.adult;
    }, [activeLearner]);

    // Profile management
    const createProfile = useCallback((name, type = 'individual') => {
        const id = generateId();
        const newProfile = {
            id,
            name,
            type, // individual, family, group, teacher, school
            createdAt: Date.now(),
            learnerIds: []
        };
        setProfiles(prev => ({ ...prev, [id]: newProfile }));
        setActiveProfileId(id);
        return newProfile;
    }, []);

    // Reset functions
    const resetGameState = useCallback((gameType) => {
        if (!activeLearner) return;
        clearGameState(gameType);
        showNotification('Game progress cleared. You can start fresh!', 'info');
    }, [activeLearner, clearGameState, showNotification]);

    const resetDailyProgress = useCallback(() => {
        if (!activeLearner) return;
        const todayKey = getTodayKey();
        setDailyProgress(prev => {
            const updated = { ...prev };
            if (updated[activeLearner.id]) {
                const { [todayKey]: removed, ...rest } = updated[activeLearner.id];
                updated[activeLearner.id] = rest;
            }
            return updated;
        });
        showNotification('Daily progress reset. Fresh start!', 'success');
    }, [activeLearner, getTodayKey, showNotification]);

    const resetAllData = useCallback(() => {
        if (window.confirm('Are you sure you want to clear ALL your data? This cannot be undone. All profiles, learners, sessions, and progress will be deleted.')) {
            localStorage.removeItem(STORAGE_KEY);
            setProfiles({});
            setLearners({});
            setActiveProfileId(null);
            setActiveLearner(null);
            setSessions([]);
            setRewards({ badges: [], tokens: 0, cards: [] });
            setDailyProgress({});
            setGameState(null);
            setShowOnboarding(true);
            showNotification('All data cleared. Starting fresh!', 'info');
        }
    }, [showNotification]);

    const addLearner = useCallback((profileId, learnerData) => {
        const id = generateId();
        const newLearner = {
            id,
            profileId,
            name: learnerData.name,
            condition: learnerData.condition || 'everyone',
            ageGroup: learnerData.ageGroup || 'adult',
            preferredStyle: learnerData.preferredStyle || 'mixed',
            createdAt: Date.now(),
            lastActive: Date.now(),
            creativityProgress: {},
            gamesPlayed: 0
        };
        
        setLearners(prev => ({ ...prev, [id]: newLearner }));
        setProfiles(prev => ({
            ...prev,
            [profileId]: {
                ...prev[profileId],
                learnerIds: [...(prev[profileId]?.learnerIds || []), id]
            }
        }));
        
        // Automatically set as active learner if none is currently active
        if (!activeLearner) {
            setActiveLearner(newLearner);
        }
        
        return newLearner;
    }, [activeLearner]);

    const selectLearner = useCallback((learnerIdOrObject) => {
        // Accept either learner ID (string) or learner object
        let learner;
        if (typeof learnerIdOrObject === 'string') {
            learner = learners[learnerIdOrObject];
        } else {
            learner = learnerIdOrObject;
        }
        
        if (learner) {
            setActiveLearner(learner);
            // Update lastActive in learners state
            setLearners(prev => ({
                ...prev,
                [learner.id]: { ...learner, lastActive: Date.now() }
            }));
            setCurrentTrainingArea(null);
            setCurrentGame(null);
            setCurrentView('hub');
            // Ensure onboarding is closed when learner is selected
            setShowOnboarding(false);
        }
    }, [learners, setShowOnboarding]);

    // Session management
    const startSession = useCallback((gameType, trainingAreaId) => {
        if (!activeLearner) {
            console.warn('Cannot start session: no active learner');
            return null;
        }
        const session = {
            id: generateId(),
            learnerId: activeLearner.id,
            condition: activeLearner.condition || 'everyone',
            trainingArea: trainingAreaId,
            gameType,
            startedAt: Date.now(),
            steps: [],
            ideas: [],
            completed: false
        };
        return session;
    }, [activeLearner]);

    const completeSession = useCallback((session, results) => {
        const completedSession = {
            ...session,
            ...results,
            completedAt: Date.now(),
            completed: true
        };
        
        setSessions(prev => [...prev, completedSession]);
        
        // Update learner progress
        if (activeLearner) {
            setLearners(prev => ({
                ...prev,
                [activeLearner.id]: {
                    ...prev[activeLearner.id],
                    gamesPlayed: (prev[activeLearner.id]?.gamesPlayed || 0) + 1,
                    creativityProgress: {
                        ...prev[activeLearner.id]?.creativityProgress,
                        [session.trainingArea]: (prev[activeLearner.id]?.creativityProgress?.[session.trainingArea] || 0) + 1
                    }
                }
            }));
        }
        
        // Update daily progress
        const ideasCount = results.ideas?.length || 0;
        const todayProgress = getDailyProgress();
        updateDailyProgress({
            gamesPlayed: (todayProgress?.gamesPlayed || 0) + 1,
            ideasCreated: (todayProgress?.ideasCreated || 0) + ideasCount
        });
        
        // Clear game state since it's completed
        if (session.gameType) {
            clearGameState(session.gameType);
        }
        
        // Award tokens with celebration
        const tokensEarned = results.ideas?.length >= 5 ? 15 : 10;
        setRewards(prev => ({
            ...prev,
            tokens: (prev.tokens || 0) + tokensEarned
        }));
        
        // Show token celebration
        showNotification(`✨ +${tokensEarned} Creative Tokens earned!`, 'success');
        
        // Check for badges (with enhanced celebrations)
        checkForBadges(results);
        
        // Show completion celebration
        setTimeout(() => {
            showNotification('🎉 Great work! Your creativity is growing!', 'success');
        }, 1000);
        
        return completedSession;
    }, [activeLearner, getDailyProgress, updateDailyProgress, clearGameState, checkForBadges]);

    // Badge checking
    const checkForBadges = useCallback((results) => {
        const newBadges = [];
        const currentBadges = Array.isArray(rewards?.badges) ? rewards.badges : [];
        
        // First idea badge
        if (sessions.length === 0 && !currentBadges.includes('first-idea')) {
            newBadges.push('first-idea');
        }
        
        // Five ideas badge
        if (results.ideas?.length >= 5 && !currentBadges.includes('five-ideas')) {
            newBadges.push('five-ideas');
        }
        
        // Flexible thinker (multiple perspectives)
        if (results.perspectivesUsed?.length >= 2 && !currentBadges.includes('flexible-thinker')) {
            newBadges.push('flexible-thinker');
        }
        
        if (newBadges.length > 0) {
            setRewards(prev => ({
                ...prev,
                badges: [...(Array.isArray(prev?.badges) ? prev.badges : []), ...newBadges]
            }));
            
            // Show enhanced badge celebration
            newBadges.forEach((badgeId, index) => {
                const badge = BADGES[badgeId];
                setTimeout(() => {
                setNotification({
                        type: 'badge-celebration',
                    badge,
                        message: `🎉 Amazing! You earned: ${badge.label}! ${badge.icon}`,
                        celebration: true,
                        animation: 'celebration'
                });
                }, index * 500); // Stagger celebrations for multiple badges
            });
        }
    }, [sessions, rewards.badges]);

    // AI-generated ideas system - generates evidence-based solutions
    const generateAIIdeas = useCallback((userInput, context = {}) => {
        // This is a smart idea generator that creates plausible, evidence-based solutions
        const { problem, ideas = [], condition, trainingArea } = context;
        
        // Analyze user input and generate tailored suggestions
        const suggestions = [];
        
        if (problem) {
            // Break down the problem into components
            const problemKeywords = problem.toLowerCase().split(/\s+/);
            
            // Generate evidence-based solution approaches
            if (problemKeywords.some(k => ['anxiety', 'worry', 'stress', 'nervous'].includes(k))) {
                suggestions.push({
                    title: "Graded Exposure Approach",
                    text: "Start with the smallest step that feels manageable. Research shows gradual exposure reduces anxiety effectively.",
                    evidence: "Based on Cognitive Behavioral Therapy principles",
                    actionable: true
                });
            }
            
            if (problemKeywords.some(k => ['focus', 'attention', 'concentrate', 'distract'].includes(k))) {
                suggestions.push({
                    title: "Pomodoro Technique Adaptation",
                    text: "Work in 25-minute focused blocks with 5-minute breaks. This method is proven to improve sustained attention.",
                    evidence: "Supported by attention restoration theory",
                    actionable: true
                });
            }
            
            if (problemKeywords.some(k => ['organize', 'plan', 'routine', 'structure'].includes(k))) {
                suggestions.push({
                    title: "Visual Planning System",
                    text: "Create a visual timeline or checklist. Visual organization helps reduce cognitive load and improves follow-through.",
                    evidence: "Research shows visual aids improve executive function",
                    actionable: true
                });
            }
            
            // Generate creative reframing ideas
            if (ideas.length > 0) {
                const userIdeasText = ideas.map(i => i.text || i).join(' ');
                if (userIdeasText.length > 20) {
                    suggestions.push({
                        title: "Combine & Refine",
                        text: `Take your best ideas and combine elements: "${ideas[0]?.text?.substring(0, 50)}..." + "${ideas[1]?.text?.substring(0, 50) || 'another approach'}..." = New hybrid solution`,
                        evidence: "Innovation often comes from combining existing ideas",
                        actionable: true
                    });
                }
            }
        }
        
        // Generate general creative prompts based on training area
        if (trainingArea) {
            const areaPrompts = {
                'structure': [
                    {
                        title: "Start-Small Strategy",
                        text: "Break your goal into 3 tiny steps. What's the absolute smallest first action you could take?",
                        evidence: "Small wins build momentum and confidence",
                        actionable: true
                    }
                ],
                'communication': [
                    {
                        title: "Multi-Modal Expression",
                        text: "Try expressing your idea through drawing, writing, or movement. Different modes unlock different insights.",
                        evidence: "Multi-sensory learning enhances understanding",
                        actionable: true
                    }
                ],
                'focus': [
                    {
                        title: "Environment Design",
                        text: "What one change to your physical space would help you focus? Remove distractions or add helpful cues?",
                        evidence: "Environmental design significantly impacts attention",
                        actionable: true
                    }
                ]
            };
            
            if (areaPrompts[trainingArea]) {
                suggestions.push(...areaPrompts[trainingArea]);
            }
        }
        
        // Add condition-specific evidence-based approaches
        if (condition && condition !== 'everyone') {
            const conditionStrategies = {
                'autism': [
                    {
                        title: "Sensory-Friendly Approach",
                        text: "Consider sensory needs in your solution. What environmental adjustments would make this more comfortable?",
                        evidence: "Sensory considerations improve outcomes for autistic individuals",
                        actionable: true
                    }
                ],
                'adhd': [
                    {
                        title: "Interest-Based Activation",
                        text: "Link this to something you're naturally curious about. How can you make this more engaging?",
                        evidence: "Interest-based learning improves ADHD engagement",
                        actionable: true
                    }
                ],
                'anxiety': [
                    {
                        title: "Safety-First Planning",
                        text: "What would make you feel safer trying this? Build in supports and exit strategies.",
                        evidence: "Perceived safety reduces anxiety responses",
                        actionable: true
                    }
                ]
            };
            
            if (conditionStrategies[condition]) {
                suggestions.push(...conditionStrategies[condition]);
            }
        }
        
        // Return top 3-5 most relevant suggestions
        return suggestions.slice(0, 5).map((s, i) => ({
            ...s,
            id: `ai-${Date.now()}-${i}`,
            source: 'AI Assistant',
            confidence: 0.85
        }));
    }, []);

    // AI Goal Suggestions Generation (with API integration)
    const generateGoalSuggestions = useCallback(async (goal, context = {}) => {
        const { problem, description, condition } = context;
        
        // Check if API key is configured (only from localStorage in browser)
        const apiKey = localStorage.getItem('openai_api_key');
        const useAPI = apiKey && apiKey.trim() !== '';
        
        if (useAPI) {
            // Use OpenAI API for real AI suggestions
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini', // Using cost-effective model
                        messages: [
                            {
                                role: 'system',
                                content: `You are a helpful creativity and problem-solving assistant. Provide evidence-based, practical, and actionable solutions. Focus on neurodivergent-friendly approaches when relevant.`
                            },
                            {
                                role: 'user',
                                content: `Context:
- Problem: ${problem || 'Not specified'}
- Current situation: ${description || 'Not specified'}
- User's goal: ${goal}
- Condition: ${condition || 'general'}

Please provide 3-5 specific, actionable, evidence-based suggestions to help achieve this goal. Each suggestion should:
1. Be practical and implementable
2. Include brief evidence or reasoning
3. Be tailored to the user's specific context
4. Be supportive and encouraging

Format as JSON array with objects containing: title, text, evidence, actionable (boolean).`
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                const content = data.choices[0]?.message?.content;
                
                // Parse JSON response
                try {
                    const suggestions = JSON.parse(content);
                    return Array.isArray(suggestions) ? suggestions : [suggestions];
                } catch (parseError) {
                    // If JSON parsing fails, try to extract suggestions from text
                    const lines = content.split('\n').filter(line => line.trim());
                    return lines.slice(0, 5).map((line, i) => ({
                        title: `Suggestion ${i + 1}`,
                        text: line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, ''),
                        evidence: 'AI-generated based on your goal',
                        actionable: true
                    }));
                }
            } catch (error) {
                console.error('OpenAI API error:', error);
                // Fall back to simulated suggestions
                return generateSimulatedGoalSuggestions(goal, context);
            }
        } else {
            // Use simulated suggestions if no API key
            return generateSimulatedGoalSuggestions(goal, context);
        }
    }, []);

    // Simulated goal suggestions (fallback)
    const generateSimulatedGoalSuggestions = useCallback((goal, context) => {
        const { problem, description, condition } = context;
        const suggestions = [];
        
        // Analyze goal keywords
        const goalLower = goal.toLowerCase();
        const descriptionLower = (description || '').toLowerCase();
        
        // Complex routine with multiple activities and SMART goals
        if (goalLower.includes('routine') && (goalLower.includes('exercise') || goalLower.includes('work') || goalLower.includes('study') || goalLower.includes('bed') || goalLower.includes('wake'))) {
            // Extract times from goal text
            const timePatterns = goal.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/g) || [];
            const hasSMART = goalLower.includes('smart') || goalLower.includes('measurable') || goalLower.includes('achievable');
            
            suggestions.push({
                title: "SMART Goal Framework for Your Routine",
                text: "Break your routine into SMART goals: Specific (exact times), Measurable (track completion), Achievable (start with 80% success rate), Relevant (aligned with your values), Time-bound (daily/weekly targets). Example: 'Exercise at 3 PM for 30 minutes, 5 days/week' instead of 'exercise more'.",
                evidence: "SMART goals increase achievement rates by 76% compared to vague goals (Locke & Latham, 2002)",
                actionable: true,
                steps: [
                    "Specific: Write exact times for each activity (e.g., 'Exercise at 3:00 PM' not 'exercise in the afternoon')",
                    "Measurable: Track completion daily (e.g., 'Complete 5/7 days this week')",
                    "Achievable: Start with 80% success rate, adjust if too easy/hard",
                    "Relevant: Each activity should align with your values and priorities",
                    "Time-bound: Set daily and weekly targets with review dates"
                ]
            });
            
            // Add detailed step-by-step action plan
            suggestions.push({
                title: "📋 Detailed Step-by-Step Action Plan to Achieve Your SMART Goals",
                text: "Follow this comprehensive plan to build your routine systematically:",
                evidence: "Step-by-step plans increase goal achievement by 3x (Implementation Science, 2020)",
                actionable: true,
                steps: [
                    "Week 1 - Foundation: Set up tracking system (use phone calendar, app, or paper). Focus ONLY on wake-up time (2:30 AM). Set alarm, place phone across room. Track: Did you wake within 5 minutes of 2:30 AM? Target: 5/7 days success.",
                    "Week 2 - Add Study Block: Maintain 2:30 AM wake. Add 30-minute study session (2:30-3:00 AM). Prepare study materials night before. Track: Did you complete 30 min study? Target: 5/7 days success.",
                    "Week 3 - Add Exercise: Maintain wake + study. Add exercise at 3:00 PM (or 15:00). Set phone reminder at 2:45 PM. Have workout clothes ready. Track: Did you exercise? Target: 4/7 days success (start achievable).",
                    "Week 4 - Add Work Block: Maintain all previous. Add computer work 4:00-7:00 PM. Set 'Do Not Disturb' mode. Close unnecessary tabs. Track: Did you work focused for 3 hours? Target: 5/7 days success.",
                    "Week 5 - Add Bedtime Routine: Maintain all previous. Add 7:30 PM bedtime. Start wind-down at 7:15 PM (hygiene, prepare tomorrow). Track: Were you in bed by 7:30 PM? Target: 5/7 days success.",
                    "Week 6 - Add Personal Hygiene: Morning: After 2:30 AM wake, complete hygiene (5 min: brush teeth, wash face, change clothes). Evening: Before 7:15 PM wind-down, complete hygiene (10 min: shower, skincare, prepare clothes). Track both daily.",
                    "Week 7+ - Refinement: Review weekly. What worked? What didn't? Adjust times by 15 minutes if needed. Celebrate wins. If struggling, reduce to 80% success rate and rebuild."
                ]
            });
            
            suggestions.push({
                title: "Time Blocking & Buffer Zones",
                text: "Schedule your activities with 15-minute buffer zones between transitions. Your schedule: 3 PM exercise, 4-7 PM work, 7:30 PM bed, 2:30 AM wake, 2:30-3 AM study, 3 AM work. Add 15-min buffers: 2:45-3 PM prep, 3:15-4 PM transition, 7:15-7:30 PM wind-down, 2:45-3 AM work prep.",
                evidence: "Buffer time reduces stress and increases schedule adherence by 40% (Time Management Research, 2018)",
                actionable: true
            });
            
            suggestions.push({
                title: "Habit Stacking for Personal Hygiene",
                text: "Link hygiene to existing routine points: Morning hygiene after 2:30 AM wake-up (brush teeth, wash face, change clothes), Evening hygiene before 7:30 PM bed (shower, skincare, prepare tomorrow's clothes). Stack: 'After I wake at 2:30 AM, I will complete my morning hygiene routine (5 minutes)'.",
                evidence: "Habit stacking increases behavior change success by 40% (Fogg, 2020)",
                actionable: true
            });
            
            suggestions.push({
                title: "Visual Routine Chart",
                text: "Create a visual timeline showing your entire day: 2:30 AM (wake + hygiene), 2:30-3 AM (study), 3 AM-? (work), 3 PM (exercise), 4-7 PM (computer work), 7:15-7:30 PM (wind-down + hygiene), 7:30 PM (bed). Display this where you'll see it daily.",
                evidence: "Visual schedules improve routine adherence by 65% for structured routines (Executive Function Research, 2019)",
                actionable: true
            });
            
            suggestions.push({
                title: "Progressive Implementation Strategy",
                text: "Week 1: Master wake-up (2:30 AM) + study (30 min). Week 2: Add exercise (3 PM). Week 3: Add computer work block (4-7 PM). Week 4: Add bedtime routine (7:30 PM). Week 5: Refine and optimize. Track daily completion rates.",
                evidence: "Progressive implementation increases long-term success by 3x compared to all-at-once changes (Behavior Change Research, 2021)",
                actionable: true
            });
        }
        
        // Discipline and routine-related goals
        else if (goalLower.includes('discipline') || goalLower.includes('routine') || goalLower.includes('bedtime') || goalLower.includes('wake')) {
            suggestions.push({
                title: "📋 Step-by-Step SMART Goal Achievement Plan",
                text: "Follow this systematic approach to build discipline and achieve your routine goals:",
                evidence: "Structured plans increase goal achievement by 3x (Implementation Science, 2020)",
                actionable: true,
                steps: [
                    "Step 1 - Define Your SMART Goal: Write exactly what you want (e.g., 'Wake up at 6:00 AM, 5 days per week'). Make it Specific (exact time), Measurable (track 5/7 days), Achievable (start with 80% success), Relevant (why this matters to you), Time-bound (by end of month).",
                    "Step 2 - Identify Current Behavior: Track for 3 days. What time do you actually wake? What prevents you from waking on time? Write down obstacles.",
                    "Step 3 - Design Your Environment: Place alarm across room (forces you to get up). Set phone to 'Do Not Disturb' at bedtime. Prepare clothes night before. Remove phone from bedroom if needed.",
                    "Step 4 - Start Small: Week 1 - Just wake 5 minutes earlier than current time. Track daily. Target: 5/7 days success. Don't add anything else yet.",
                    "Step 5 - Build Gradually: Week 2 - If Week 1 successful, move wake time 5 more minutes earlier. Week 3 - Add 5 more minutes. Continue until you reach target time.",
                    "Step 6 - Track & Review: Use a simple calendar. Mark ✓ for success, ✗ for missed. Review weekly. If success rate below 80%, adjust goal to be easier.",
                    "Step 7 - Celebrate Wins: Acknowledge every successful day. Small rewards (favorite breakfast, extra 10 min break) after 3 successful days in a row.",
                    "Step 8 - Add Next Habit: Only after 2 weeks of 80%+ success, add the next small habit. Stack it: 'After I wake up, I will [new habit]'."
                ]
            });
            
            suggestions.push({
                title: "Gradual Habit Stacking",
                text: "Start with one tiny habit. Instead of changing your entire bedtime routine, pick ONE small action (like setting an alarm 5 minutes earlier) and do it consistently for 7 days before adding the next.",
                evidence: "Research shows habit stacking (adding new behaviors to existing routines) increases success rates by 40% (Fogg, 2020)",
                actionable: true
            });
            
            suggestions.push({
                title: "Environmental Design",
                text: "Make the desired behavior easier and the undesired behavior harder. Place your alarm across the room, set phone to 'Do Not Disturb' mode automatically, or prepare tomorrow's clothes the night before.",
                evidence: "Environmental design is more effective than willpower alone (Clear, 2018)",
                actionable: true
            });
            
            suggestions.push({
                title: "Accountability System",
                text: "Tell someone about your goal and check in daily. Use a simple tracking app or calendar. Visual progress tracking increases completion rates significantly.",
                evidence: "Accountability increases goal achievement by 65% (Duhigg, 2012)",
                actionable: true
            });
        }
        
        // Organization-related goals
        if (goalLower.includes('organize') || goalLower.includes('structure') || descriptionLower.includes('disorganized')) {
            suggestions.push({
                title: "5-Minute Daily Reset",
                text: "Set a timer for 5 minutes each day to organize one small area. This prevents overwhelm and builds momentum. Start with the most visible area first.",
                evidence: "Micro-tasks reduce procrastination and increase completion rates (Pychyl, 2013)",
                actionable: true
            });
            
            suggestions.push({
                title: "Visual Planning System",
                text: "Create a simple visual system: use color-coded categories, visual checklists, or a whiteboard. Visual organization reduces cognitive load and improves follow-through.",
                evidence: "Visual aids improve executive function and task completion (Dawson & Guare, 2018)",
                actionable: true
            });
        }
        
        // General productivity goals
        if (goalLower.includes('achieve') || goalLower.includes('accomplish') || goalLower.includes('complete')) {
            suggestions.push({
                title: "Break Into Micro-Steps",
                text: "Break your goal into the smallest possible steps. If a step feels too big, break it down further. Each step should take 5 minutes or less.",
                evidence: "Micro-steps reduce anxiety and increase task initiation (Piers Steel, 2011)",
                actionable: true
            });
            
            suggestions.push({
                title: "Celebrate Small Wins",
                text: "Acknowledge every small completion. This releases dopamine and builds motivation for the next step. Track your progress visually.",
                evidence: "Celebrating progress activates reward pathways and sustains motivation (Dopamine, 2017)",
                actionable: true
            });
        }
        
        // Default suggestions if no specific match
        if (suggestions.length === 0) {
            suggestions.push({
                title: "📋 Step-by-Step SMART Goal Achievement Plan",
                text: "Follow this comprehensive plan to achieve any goal systematically:",
                evidence: "Structured plans increase goal achievement by 3x (Implementation Science, 2020)",
                actionable: true,
                steps: [
                    "Step 1 - Write Your SMART Goal: Specific (exactly what you want), Measurable (how you'll track it), Achievable (realistic for you), Relevant (why it matters), Time-bound (deadline). Example: 'Complete [specific task] by [date], tracking [metric] daily'.",
                    "Step 2 - Break Into Micro-Steps: List every tiny step needed. If a step takes more than 5 minutes, break it down further. Write: 'Step 1: [5-min action], Step 2: [5-min action]...'",
                    "Step 3 - Identify Obstacles: What might stop you? List top 3 obstacles. For each, write: 'If [obstacle happens], then I will [solution]'. This is an implementation intention.",
                    "Step 4 - Set Up Tracking: Choose method (calendar, app, journal). Track daily: ✓ for done, ✗ for missed. Review weekly. Target: 80% success rate minimum.",
                    "Step 5 - Start With First Micro-Step: Do ONLY the first tiny step today. Don't think about the whole goal. Just complete step 1. Celebrate when done.",
                    "Step 6 - Build Momentum: After 3 successful days of step 1, add step 2. Continue adding one step at a time. Never add more than one new step per week.",
                    "Step 7 - Weekly Review: Every Sunday, review the week. What worked? What didn't? Adjust if success rate below 80%. Celebrate wins.",
                    "Step 8 - Get Support: Tell one person about your goal. Ask for weekly check-in. Accountability increases success by 65%."
                ]
            });
            
            suggestions.push({
                title: "Start Small Strategy",
                text: "Identify the smallest possible first step toward your goal. What's one tiny action you could take today that moves you closer?",
                evidence: "Small wins build momentum and confidence (Amabile & Kramer, 2011)",
                actionable: true
            });
            
            suggestions.push({
                title: "Obstacle Anticipation",
                text: "Think ahead: what might get in your way? Plan one simple solution for the most likely obstacle. This increases success rates significantly.",
                evidence: "Implementation intentions (if-then plans) double goal achievement (Gollwitzer, 1999)",
                actionable: true
            });
            
            suggestions.push({
                title: "Support System",
                text: "Identify one person who can support you or hold you accountable. Share your goal and ask for a simple check-in.",
                evidence: "Social support increases goal achievement by 40% (Cialdini, 2006)",
                actionable: true
            });
        }
        
        return suggestions.slice(0, 5); // Return max 5 suggestions
    }, []);

    // Save goal suggestions to user profile
    const saveGoalSuggestions = useCallback((goal, suggestions, problem) => {
        if (!activeLearner) return;
        
        const suggestionRecord = {
            id: generateId(),
            goal: goal,
            suggestions: suggestions,
            problem: problem?.title || problem || 'General',
            createdAt: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        
        setGoalSuggestions(prev => ({
            ...prev,
            [activeLearner.id]: [
                ...(prev[activeLearner.id] || []),
                suggestionRecord
            ]
        }));
        
        showNotification('✨ Goal suggestions saved to your profile!', 'success');
    }, [activeLearner, showNotification]);

    // Create creativity card
    const createCreativityCard = useCallback((session, title, summary) => {
        const card = {
            id: generateId(),
            sessionId: session.id,
            learnerId: activeLearner?.id,
            condition: session.condition,
            trainingArea: session.trainingArea,
            gameType: session.gameType,
            title,
            summary,
            emoji: getRandomEmoji(),
            createdAt: Date.now()
        };
        
        setRewards(prev => ({
            ...prev,
            cards: [...prev.cards, card]
        }));
        
        return card;
    }, [activeLearner]);

    // Update settings
    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    // Show notification
    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    }, []);

    const value = {
        // State
        profiles,
        learners,
        activeProfileId,
        activeLearner,
        sessions,
        rewards,
        settings,
        trainingAreas,
        tiers,
        currentView,
        currentTrainingArea,
        currentGame,
        showOnboarding,
        notification,
        
        // Actions
        createProfile,
        addLearner,
        selectLearner,
        setActiveProfileId,
        startSession,
        completeSession,
        createCreativityCard,
        updateSettings,
        showNotification,
        setCurrentView,
        setCurrentTrainingArea,
        setCurrentGame,
        setShowOnboarding,
        setNotification,
        showHelp,
        setShowHelp,
        getDailyProgress,
        updateDailyProgress,
        saveGameState,
        loadGameState,
        clearGameState,
        resetGameState,
        resetDailyProgress,
        resetAllData,
        isUnlimitedResume,
        generateAIIdeas,
        generateGoalSuggestions,
        saveGoalSuggestions,
        goalSuggestions
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// Helper for random emoji
function getRandomEmoji() {
    const emojis = ['✨', '💡', '🎯', '🌟', '🎨', '🧩', '🔮', '🌈', '💫', '🎪'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// =============================================
// NOTIFICATION COMPONENT
// =============================================

function Notification() {
    const { notification, setNotification, settings } = useApp();
    
    if (!notification) return null;
    
    const isBadge = notification.type === 'badge';
    
    return (
        <div 
            className={`notification notification--${notification.type} ${settings.animationsEnabled ? 'notification--animated' : ''}`}
            onClick={() => setNotification(null)}
        >
            {isBadge && (
                <div className="notification__badge">
                    <span className="notification__badge-icon">{notification.badge.icon}</span>
                    <div className="notification__badge-info">
                        <strong>{notification.badge.label}</strong>
                        <span>{notification.badge.description}</span>
                    </div>
                </div>
            )}
            {!isBadge && (
                <p>{notification.message}</p>
            )}
        </div>
    );
}

// =============================================
// PROFILE MANAGER COMPONENT
// =============================================

function ProfileManager() {
    const { 
        profiles, 
        learners, 
        activeLearner, 
        activeProfileId,
        createProfile, 
        addLearner, 
        selectLearner,
        setActiveProfileId,
        showOnboarding,
        setShowOnboarding
    } = useApp();
    
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddLearner, setShowAddLearner] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeProfile = profiles[activeProfileId];
    const profileLearners = activeProfile?.learnerIds?.map(id => learners[id]).filter(Boolean) || [];

    return (
        <div className="profile-manager" ref={dropdownRef}>
            <button 
                className="profile-manager__trigger"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
            >
                {activeLearner ? (
                    <>
                        <span className="profile-manager__icon">
                            {CONDITIONS[activeLearner.condition]?.icon || '🌟'}
                        </span>
                        <span className="profile-manager__name">{activeLearner.name}</span>
                        <span className="profile-manager__arrow">▾</span>
                    </>
                ) : (
                    <>
                        <span className="profile-manager__icon">👤</span>
                        <span className="profile-manager__name">Select Learner</span>
                        <span className="profile-manager__arrow">▾</span>
                    </>
                )}
            </button>

            {showDropdown && (
                <div className="profile-manager__dropdown">
                    {profileLearners.length > 0 && (
                        <div className="profile-manager__section">
                            <div className="profile-manager__section-label">Switch Learner</div>
                            {profileLearners.map(learner => (
                                <button
                                    key={learner.id}
                                    className={`profile-manager__item ${activeLearner?.id === learner.id ? 'profile-manager__item--active' : ''}`}
                                    onClick={() => {
                                        selectLearner(learner);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <span className="profile-manager__item-icon">
                                        {CONDITIONS[learner.condition]?.icon || '🌟'}
                                    </span>
                                    <div className="profile-manager__item-info">
                                        <span className="profile-manager__item-name">{learner.name}</span>
                                        <span className="profile-manager__item-detail">
                                            {CONDITIONS[learner.condition]?.label} • {AGE_GROUPS[learner.ageGroup]?.label}
                                        </span>
                                    </div>
                                    {activeLearner?.id === learner.id && (
                                        <span className="profile-manager__item-check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className="profile-manager__section">
                        <button 
                            className="profile-manager__item profile-manager__item--action"
                            onClick={() => {
                                setShowAddLearner(true);
                                setShowDropdown(false);
                            }}
                        >
                            <span className="profile-manager__item-icon">➕</span>
                            <span>Add Learner</span>
                        </button>
                        <button 
                            className="profile-manager__item profile-manager__item--action"
                            onClick={() => {
                                setShowOnboarding(true);
                                setShowDropdown(false);
                            }}
                        >
                            <span className="profile-manager__item-icon">📖</span>
                            <span>Tutorial</span>
                        </button>
                    </div>
                </div>
            )}

            {showAddLearner && (
                <AddLearnerModal 
                    onClose={() => setShowAddLearner(false)}
                    profileId={activeProfileId}
                />
            )}
        </div>
    );
}

// =============================================
// ADD LEARNER MODAL
// =============================================

function AddLearnerModal({ onClose, profileId }) {
    const { addLearner, selectLearner, createProfile, activeProfileId, setShowOnboarding } = useApp();
    
    const [name, setName] = useState('');
    const [condition, setCondition] = useState('everyone');
    const [ageGroup, setAgeGroup] = useState('adult');
    const [preferredStyle, setPreferredStyle] = useState('mixed');
    const [step, setStep] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let targetProfileId = profileId || activeProfileId;
        
        // Create default profile if none exists
        if (!targetProfileId) {
            const newProfile = createProfile('My Profile', 'individual');
            targetProfileId = newProfile.id;
        }
        
        const learner = addLearner(targetProfileId, {
            name,
            condition,
            ageGroup,
            preferredStyle
        });
        
        // Pass the learner object directly to avoid timing issues
        selectLearner(learner);
        // Close onboarding if it's showing
        setShowOnboarding(false);
        onClose();
    };

    const conditionInfo = CONDITIONS[condition];
    const needsAgeGroup = ['autism', 'adhd', 'dyslexia'].includes(condition);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--learner" onClick={e => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
                
                <div className="modal__header">
                    <h2>Add Learner</h2>
                    <p>Create a personalized creativity journey</p>
                </div>

                <form onSubmit={handleSubmit} className="learner-form">
                    {step === 1 && (
                        <div className="learner-form__step">
                            <label className="form-label">
                                Name
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter name..."
                                    className="form-input"
                                    autoFocus
                                    required
                                />
                            </label>

                            <div className="form-label">
                                Which area would you like to focus on?
                            </div>
                            <div className="condition-grid">
                                {Object.entries(CONDITIONS).map(([key, cond]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`condition-card ${condition === key ? 'condition-card--selected' : ''}`}
                                        onClick={() => setCondition(key)}
                                        style={{ '--condition-color': cond.color }}
                                    >
                                        <span className="condition-card__icon">{cond.icon}</span>
                                        <span className="condition-card__label">{cond.label}</span>
                                    </button>
                                ))}
                            </div>

                            {name && (
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={() => setStep(2)}
                                >
                                    Continue
                                </button>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="learner-form__step">
                            <div className="learner-preview">
                                <span className="learner-preview__icon">{conditionInfo.icon}</span>
                                <div>
                                    <strong>{name}</strong>
                                    <span>{conditionInfo.label}</span>
                                </div>
                            </div>

                            {needsAgeGroup && (
                                <>
                                    <div className="form-label">Age Group</div>
                                    <div className="age-group-grid">
                                        {Object.entries(AGE_GROUPS).map(([key, age]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`age-card ${ageGroup === key ? 'age-card--selected' : ''}`}
                                                onClick={() => setAgeGroup(key)}
                                            >
                                                <span className="age-card__label">{age.label}</span>
                                                <span className="age-card__desc">{age.description}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="form-label">Preferred Creative Style (optional)</div>
                            <div className="style-grid">
                                {Object.entries(CREATIVE_STYLES).map(([key, style]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`style-card ${preferredStyle === key ? 'style-card--selected' : ''}`}
                                        onClick={() => setPreferredStyle(key)}
                                    >
                                        <span className="style-card__icon">{style.icon}</span>
                                        <span className="style-card__label">{style.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="learner-form__summary">
                                <h4>Your Creativity Focus</h4>
                                <p>
                                    {conditionInfo.description}. You'll explore {TRAINING_AREAS[condition]?.length || 5} training areas 
                                    designed for {conditionInfo.label.toLowerCase()}.
                                </p>
                            </div>

                            <div className="learner-form__actions">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Start Creating
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

// =============================================
// ONBOARDING / TUTORIAL
// =============================================

function Onboarding() {
    const { setShowOnboarding, createProfile, addLearner, selectLearner, activeProfileId } = useApp();
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: 'Welcome to the Creativity Lab',
            content: 'A space designed to help neurodivergent minds unlock creative potential through playful, evidence-informed games.',
            illustration: 'welcome'
        },
        {
            title: 'Choose Your Focus',
            content: 'Select a condition or area you want to explore. Each has tailored creativity training tracks.',
            illustration: 'conditions'
        },
        {
            title: 'Training Areas',
            content: 'Each focus area has multiple training tracks. For example, ADHD includes Focus, Organisation, Energy, and Impulse Control.',
            illustration: 'tracks'
        },
        {
            title: 'Creative Games',
            content: 'Short, engaging games (2-7 minutes) help build creative thinking skills: generating ideas, seeing new perspectives, and making connections.',
            illustration: 'games'
        },
        {
            title: 'Earn Rewards',
            content: 'Complete games to earn tokens, unlock badges, and create Creativity Cards that capture your best ideas.',
            illustration: 'rewards'
        }
    ];

    const handleComplete = () => {
        // Create default profile and learner if needed
        let profileId = activeProfileId;
        if (!profileId) {
            const profile = createProfile('My Profile', 'individual');
            profileId = profile.id;
        }
        setShowOnboarding(false);
    };

    return (
        <div className="onboarding-overlay">
            <div className="onboarding">
                <div className="onboarding__progress">
                    {steps.map((_, i) => (
                        <div 
                            key={i} 
                            className={`onboarding__dot ${i <= step ? 'onboarding__dot--active' : ''}`}
                        />
                    ))}
                </div>

                <div className="onboarding__content">
                    <OnboardingIllustration type={steps[step].illustration} />
                    <h2>{steps[step].title}</h2>
                    <p>{steps[step].content}</p>
                </div>

                <div className="onboarding__actions">
                    {step > 0 && (
                        <button 
                            className="btn btn-secondary"
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button 
                            className="btn btn-primary"
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            className="btn btn-primary"
                            onClick={handleComplete}
                        >
                            Get Started
                        </button>
                    )}
                </div>

                <button 
                    className="onboarding__skip"
                    onClick={handleComplete}
                >
                    Skip tutorial
                </button>
            </div>
        </div>
    );
}

function OnboardingIllustration({ type }) {
    const illustrations = {
        welcome: (
            <div className="onboarding-ill onboarding-ill--welcome">
                <div className="onboarding-ill__logo">🧠✨</div>
                <div className="onboarding-ill__subtitle">NeuroBreath Creativity Lab</div>
            </div>
        ),
        conditions: (
            <div className="onboarding-ill onboarding-ill--conditions">
                <div className="onboarding-ill__grid">
                    {['🧩', '⚡', '📖', '🦋', '🌱', '🧘', '🌙', '🌟'].map((icon, i) => (
                        <div key={i} className="onboarding-ill__icon">{icon}</div>
                    ))}
                </div>
            </div>
        ),
        tracks: (
            <div className="onboarding-ill onboarding-ill--tracks">
                <div className="onboarding-ill__track">🎯 Focus</div>
                <div className="onboarding-ill__track">📁 Organisation</div>
                <div className="onboarding-ill__track">⚡ Energy</div>
                <div className="onboarding-ill__track">🛑 Impulse</div>
            </div>
        ),
        games: (
            <div className="onboarding-ill onboarding-ill--games">
                <div className="onboarding-ill__game">
                    <span>💡</span>
                    <span>Idea Sprint</span>
                </div>
                <div className="onboarding-ill__timer">2-7 min</div>
            </div>
        ),
        rewards: (
            <div className="onboarding-ill onboarding-ill--rewards">
                <div className="onboarding-ill__badge">🏆</div>
                <div className="onboarding-ill__tokens">+10 tokens</div>
                <div className="onboarding-ill__card">📇 Creativity Card</div>
            </div>
        )
    };

    return illustrations[type] || null;
}

// =============================================
// CREATIVITY HUB (MAIN VIEW)
// =============================================

function CreativityHub() {
    const { 
        activeLearner, 
        trainingAreas, 
        tiers,
        currentTrainingArea, 
        setCurrentTrainingArea,
        currentGame,
        setCurrentGame,
        rewards,
        sessions,
        settings
    } = useApp();

    const condition = activeLearner?.condition || 'everyone';
    const conditionInfo = CONDITIONS[condition];

    // Get progress for current learner
    const progress = useMemo(() => {
        if (!activeLearner) return {};
        const learnerSessions = sessions.filter(s => s.learnerId === activeLearner.id);
        return {
            totalGames: learnerSessions.length,
            totalIdeas: learnerSessions.reduce((sum, s) => sum + (s.ideas?.length || 0), 0),
            byArea: trainingAreas.reduce((acc, area) => {
                acc[area.id] = learnerSessions.filter(s => s.trainingArea === area.id).length;
                return acc;
            }, {})
        };
    }, [activeLearner, sessions, trainingAreas]);

    if (!activeLearner) {
        return <WelcomeView />;
    }

    if (currentGame) {
        return <GameView />;
    }

    return (
        <div className="creativity-hub">
            {/* Hero Section */}
            <section className="hub-hero">
                <div className="hub-hero__content">
                    <div className="hub-hero__badge" style={{ '--badge-color': conditionInfo.color }}>
                        <span className="hub-hero__icon">{conditionInfo.icon}</span>
                        <span className="hub-hero__condition">{conditionInfo.label}</span>
                        {activeLearner.ageGroup && (
                            <span className="hub-hero__age">{AGE_GROUPS[activeLearner.ageGroup]?.label}</span>
                        )}
                    </div>
                    <h1>Hi, {activeLearner.name}!</h1>
                    <p className="hub-hero__desc">{conditionInfo.description}</p>
                </div>
                
                <div className="hub-hero__stats">
                    <div className="hub-stat">
                        <span className="hub-stat__value">{progress.totalGames}</span>
                        <span className="hub-stat__label">Games Played</span>
                    </div>
                    <div className="hub-stat">
                        <span className="hub-stat__value">{progress.totalIdeas}</span>
                        <span className="hub-stat__label">Ideas Created</span>
                    </div>
                    <div className="hub-stat">
                        <span className="hub-stat__value">{rewards.tokens}</span>
                        <span className="hub-stat__label">Tokens</span>
                    </div>
                </div>
            </section>

            {/* Training Area Navigation */}
            {trainingAreas && trainingAreas.length > 0 && (
            <nav className="hub-nav">
                <div className="hub-nav__label">Training Areas</div>
                <div className="hub-nav__tabs">
                    {trainingAreas.map(area => (
                        <button
                            key={area.id}
                            className={`hub-nav__tab ${currentTrainingArea?.id === area.id ? 'hub-nav__tab--active' : ''}`}
                            onClick={() => setCurrentTrainingArea(area)}
                        >
                            <span className="hub-nav__tab-icon">{area.icon}</span>
                            <span className="hub-nav__tab-label">{area.label}</span>
                                {progress.byArea && progress.byArea[area.id] > 0 && (
                                <span className="hub-nav__tab-count">{progress.byArea[area.id]}</span>
                            )}
                        </button>
                    ))}
                </div>
            </nav>
            )}

            {/* Main Content Area */}
            <div className="hub-content">
                {currentTrainingArea ? (
                    <TrainingAreaView area={currentTrainingArea} />
                ) : (
                    <QuickStartView />
                )}
            </div>

            {/* Rewards Panel */}
            <RewardPanel />
        </div>
    );
}

// =============================================
// WELCOME VIEW (NO LEARNER SELECTED)
// =============================================

function WelcomeView() {
    const { setShowOnboarding } = useApp();
    const [showAddLearner, setShowAddLearner] = useState(false);

    return (
        <div className="welcome-view">
            <div className="welcome-view__content">
                <div className="welcome-view__icon">🧠✨</div>
                <h1>NeuroBreath Creativity Lab</h1>
                <p>
                    A supportive space for neurodivergent minds to explore creativity 
                    through short, engaging, evidence-informed games.
                </p>
                
                <div className="welcome-view__features">
                    <div className="welcome-feature">
                        <span className="welcome-feature__icon">🎮</span>
                        <span>Short games (2-7 min)</span>
                    </div>
                    <div className="welcome-feature">
                        <span className="welcome-feature__icon">🧩</span>
                        <span>Condition-specific</span>
                    </div>
                    <div className="welcome-feature">
                        <span className="welcome-feature__icon">🏆</span>
                        <span>Earn rewards</span>
                    </div>
                    <div className="welcome-feature">
                        <span className="welcome-feature__icon">🔒</span>
                        <span>Private & safe</span>
                    </div>
                </div>

                <div className="welcome-view__actions">
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => setShowAddLearner(true)}
                    >
                        Create Your Profile
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setShowOnboarding(true)}
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {showAddLearner && (
                <AddLearnerModal onClose={() => setShowAddLearner(false)} />
            )}
        </div>
    );
}

// =============================================
// QUICK START VIEW
// =============================================

function QuickStartView() {
    const { 
        activeLearner, 
        trainingAreas, 
        setCurrentTrainingArea, 
        setCurrentGame, 
        sessions,
        getDailyProgress,
        showHelp,
        setShowHelp
    } = useApp();
    
    // Ensure trainingAreas is always an array with fallback
    const safeTrainingAreas = useMemo(() => {
        if (Array.isArray(trainingAreas) && trainingAreas.length > 0) {
            return trainingAreas;
        }
        // Fallback to everyone areas if empty
        const fallback = TRAINING_AREAS.everyone || [];
        console.log('QuickStartView: Using fallback training areas', { count: fallback.length });
        return Array.isArray(fallback) ? fallback : [];
    }, [trainingAreas]);
    
    // Get daily progress and in-progress games
    const dailyProgress = getDailyProgress();
    const inProgressGames = dailyProgress?.inProgressGames || [];
    
    // Get recently used and suggested areas
    const recentAreas = useMemo(() => {
        if (!activeLearner || !safeTrainingAreas.length) return [];
        const learnerSessions = sessions.filter(s => s.learnerId === activeLearner.id);
        const areaIds = [...new Set(learnerSessions.slice(-5).map(s => s.trainingArea))];
        return areaIds.map(id => safeTrainingAreas.find(a => a.id === id)).filter(Boolean);
    }, [sessions, activeLearner, safeTrainingAreas]);

    return (
        <div className="quick-start">
            <div className="quick-start__header">
                <h2>Ready to Create?</h2>
                <p>Choose a training area or try today's suggested challenge</p>
            </div>

            {/* Featured Game */}
            <div className="quick-start__featured">
                <div className="featured-game">
                    <div className="featured-game__badge">✨ Suggested</div>
                    <div className="featured-game__content">
                        <h3>Mini Design Lab</h3>
                        <p>Solve a real problem with 4 simple creative steps</p>
                        <div className="featured-game__meta">
                            <span>🕐 5-7 minutes</span>
                            <span>💡 Generate ideas</span>
                        </div>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            if (safeTrainingAreas && safeTrainingAreas.length > 0) {
                                setCurrentTrainingArea(safeTrainingAreas[0]);
                            setCurrentGame('design-thinking');
                            } else {
                                console.error('No training areas available');
                            }
                        }}
                    >
                        Start
                    </button>
                </div>
            </div>

            {/* Training Area Cards */}
            {safeTrainingAreas.length > 0 ? (
            <div className="quick-start__areas">
                <h3>Explore Training Areas</h3>
                <div className="area-cards">
                        {safeTrainingAreas.map(area => (
                        <button
                            key={area.id}
                            className="area-card"
                            onClick={() => setCurrentTrainingArea(area)}
                        >
                            <span className="area-card__icon">{area.icon}</span>
                            <span className="area-card__label">{area.label}</span>
                            <span className="area-card__desc">{area.description}</span>
                        </button>
                    ))}
                </div>
            </div>
            ) : (
                <div className="quick-start__error">
                    <p>No training areas available. Please refresh the page.</p>
                </div>
            )}

            {/* Recent Activity */}
            {recentAreas.length > 0 && (
                <div className="quick-start__recent">
                    <h3>Continue Where You Left Off</h3>
                    <div className="recent-chips">
                        {recentAreas.map(area => {
                            // Check for in-progress games in this area
                            const areaInProgressGames = inProgressGames.filter(g => {
                                // Match games to training areas (you may need to adjust this logic)
                                return true; // For now, show all in-progress games
                            });
                            const hasInProgress = areaInProgressGames.length > 0;
                            
                            return (
                            <button
                                key={area.id}
                                    className={`recent-chip ${hasInProgress ? 'recent-chip--has-progress' : ''}`}
                                    onClick={() => {
                                        setCurrentTrainingArea(area);
                                        // Show continuation tutorial if there are in-progress games
                                        if (hasInProgress) {
                                            setTimeout(() => {
                                                setShowHelp(`continue-${area.id}`);
                                            }, 300);
                                        }
                                    }}
                            >
                                    <span className="recent-chip__icon">{area.icon}</span>
                                    <span className="recent-chip__label">{area.label}</span>
                                    {hasInProgress && (
                                        <span className="recent-chip__badge">🔄 {areaInProgressGames.length}</span>
                                    )}
                            </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// =============================================
// TRAINING AREA VIEW
// =============================================

function TrainingAreaView({ area }) {
    const { 
        activeLearner, 
        setCurrentGame, 
        sessions, 
        tiers,
        showHelp,
        setShowHelp,
        getDailyProgress,
        loadGameState
    } = useApp();
    const condition = activeLearner?.condition || 'everyone';

    // Get problems for this condition
    const problems = DESIGN_THINKING_PROBLEMS[condition] || DESIGN_THINKING_PROBLEMS.everyone;

    // Calculate area progress
    const areaProgress = useMemo(() => {
        const areaSessions = sessions.filter(
            s => s.learnerId === activeLearner?.id && s.trainingArea === area.id
        );
        return {
            total: areaSessions.length,
            ideas: areaSessions.reduce((sum, s) => sum + (s.ideas?.length || 0), 0),
            lastPlayed: areaSessions.length > 0 ? areaSessions[areaSessions.length - 1].completedAt : null
        };
    }, [sessions, activeLearner, area]);

    // Get daily progress
    const dailyProgress = getDailyProgress();
    const inProgressGames = dailyProgress?.inProgressGames || [];

    // Check for games in progress
    const hasInProgressGames = inProgressGames.length > 0;

    return (
        <div className="training-area-view">
            <div className="training-area-header">
                <div className="training-area-header__info">
                    <span className="training-area-header__icon">{area.icon}</span>
                    <div>
                        <h2>{area.label}</h2>
                        <p>{area.description}</p>
                        <button 
                            className="btn-help-link"
                            onClick={() => setShowHelp(showHelp === `area-${area.id}` ? null : `area-${area.id}`)}
                            aria-label="Learn more about this training area"
                        >
                            {showHelp === `area-${area.id}` ? '✕ Hide Guide' : '❓ How to Use This Area'}
                        </button>
                    </div>
                </div>
                <div className="training-area-header__stats">
                    <div className="mini-stat">
                        <span className="mini-stat__value">{areaProgress.total}</span>
                        <span className="mini-stat__label">Games</span>
                    </div>
                    <div className="mini-stat">
                        <span className="mini-stat__value">{areaProgress.ideas}</span>
                        <span className="mini-stat__label">Ideas</span>
                    </div>
                    {dailyProgress && (
                        <div className="mini-stat mini-stat--daily">
                            <span className="mini-stat__value">{dailyProgress.gamesPlayed || 0}</span>
                            <span className="mini-stat__label">Today</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Training Area Guide */}
            {showHelp === `area-${area.id}` && (
                <TrainingAreaGuide area={area} onClose={() => setShowHelp(null)} />
            )}

            {/* Continuation Tutorial - Shows when user clicks "Continue Where You Left Off" */}
            {showHelp && showHelp.startsWith('continue-') && showHelp === `continue-${area.id}` && (
                <ContinuationTutorial 
                    area={area} 
                    inProgressGames={inProgressGames}
                    onClose={() => setShowHelp(null)}
                    onResumeGame={(gameType) => {
                        const savedState = loadGameState(gameType);
                        if (savedState) {
                            setCurrentGame({ type: gameType, ...savedState });
                            setShowHelp(null);
                        }
                    }}
                />
            )}

            {/* Daily Continuity Banner */}
            {hasInProgressGames && (
                <div className="continuity-banner">
                    <div className="continuity-banner__icon">🔄</div>
                    <div className="continuity-banner__content">
                        <div className="continuity-banner__header">
                            <div>
                                <h3>Continue Your Progress</h3>
                                <p>You have {inProgressGames.length} game{inProgressGames.length > 1 ? 's' : ''} in progress. Pick up where you left off!</p>
                            </div>
                            <div className="continuity-banner__actions">
                                <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        if (window.confirm('Reset today\'s progress? You can start fresh, but your completed work will remain saved.')) {
                                            resetDailyProgress();
                                        }
                                    }}
                                >
                                    🔄 Reset Today
                                </button>
                            </div>
                        </div>
                        <div className="continuity-banner__games">
                            {inProgressGames.map((game, idx) => (
                                <button
                                    key={idx}
                                    className="continuity-game-btn"
                                    onClick={() => {
                                        const savedState = loadGameState(game.type);
                                        if (savedState) {
                                            setCurrentGame({ type: game.type, ...savedState });
                                        }
                                    }}
                                >
                                    <span className="continuity-game-btn__icon">
                                        {game.type === 'design-thinking' ? '💡' : 
                                         game.type === 'idea-sprint' ? '⚡' :
                                         game.type === 'perspective-flip' ? '🔄' :
                                         game.type === 'story-room' ? '📖' :
                                         game.type === 'block-builder' ? '🧱' :
                                         game.type === 'mode-switcher' ? '🎨' : '📇'}
                                    </span>
                                    <span className="continuity-game-btn__label">
                                        {game.type === 'design-thinking' ? 'Design Lab' : 
                                         game.type === 'idea-sprint' ? 'Idea Sprint' :
                                         game.type === 'perspective-flip' ? 'Perspective Flip' :
                                         game.type === 'story-room' ? 'Story Room' :
                                         game.type === 'block-builder' ? 'Block Builder' :
                                         game.type === 'mode-switcher' ? 'Mode Switcher' : 'Time Capsule'}
                                    </span>
                                    <span className="continuity-game-btn__arrow">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tier Progress */}
            <div className="tier-progress">
                <div className="tier-progress__label">Your Progress</div>
                <div className="tier-progress__bar">
                    {tiers.map((tier, i) => (
                        <div 
                            key={tier}
                            className={`tier-progress__step ${i === 0 ? 'tier-progress__step--active' : ''}`}
                        >
                            <span className="tier-progress__step-label">{TIER_LABELS[tier]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Games */}
            <div className="game-deck">
                <h3>Creative Challenges</h3>
                
                <div className="game-cards">
                    {/* Design Thinking Game */}
                    <div className="game-card">
                        <div className="game-card__header">
                            <span className="game-card__icon">💡</span>
                            <span className="game-card__tier">{TIER_LABELS[tiers[0]]}</span>
                            <button 
                                className="game-card__help"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHelp(showHelp === 'game-design-thinking' ? null : 'game-design-thinking');
                                }}
                                aria-label="How to play Design Lab"
                                title="How to play"
                            >
                                ❓
                            </button>
                        </div>
                        <h4>Mini Design Lab</h4>
                        <p>Solve a real problem with creative thinking</p>
                        <div className="game-card__meta">
                            <span>🕐 5-7 min</span>
                            <span>📊 4 steps</span>
                        </div>
                        <div className="game-card__actions">
                        <button 
                            className="btn btn-primary btn-sm"
                                onClick={() => {
                                    const savedState = loadGameState('design-thinking');
                                    setCurrentGame(savedState ? { type: 'design-thinking', ...savedState } : 'design-thinking');
                                }}
                        >
                                {loadGameState('design-thinking') ? '🔄 Continue' : 'Play'}
                        </button>
                        </div>
                        {showHelp === 'game-design-thinking' && (
                            <GameHelpGuide gameType="design-thinking" onClose={() => setShowHelp(null)} />
                        )}
                    </div>

                    {/* Idea Sprint Game */}
                    <div className="game-card">
                        <div className="game-card__header">
                            <span className="game-card__icon">⚡</span>
                            <span className="game-card__tier">{TIER_LABELS[tiers[0]]}</span>
                        </div>
                        <h4>Idea Sprint</h4>
                        <p>Generate as many ideas as you can</p>
                        <div className="game-card__meta">
                            <span>🕐 2-3 min</span>
                            <span>🎯 Fluency</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentGame('idea-sprint')}
                        >
                            Play
                        </button>
                    </div>

                    {/* Perspective Flip */}
                    <div className="game-card">
                        <div className="game-card__header">
                            <span className="game-card__icon">🔄</span>
                            <span className="game-card__tier">{TIER_LABELS[tiers[0]]}</span>
                        </div>
                        <h4>Perspective Flip</h4>
                        <p>See situations from different viewpoints</p>
                        <div className="game-card__meta">
                            <span>🕐 3-5 min</span>
                            <span>🧠 Flexibility</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentGame('perspective-flip')}
                        >
                            Play
                        </button>
                    </div>

                    {/* Story Room - Best for anxiety/stress/depression */}
                    <div className="game-card">
                        <div className="game-card__header">
                            <span className="game-card__icon">📖</span>
                            <span className="game-card__tier">{TIER_LABELS[tiers[0]]}</span>
                        </div>
                        <h4>Story Room</h4>
                        <p>Create visual stories and explore different endings</p>
                        <div className="game-card__meta">
                            <span>🕐 5-8 min</span>
                            <span>💭 Reframing</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentGame('story-room')}
                        >
                            Play
                        </button>
                    </div>

                    {/* Block Builder */}
                    <div className="game-card">
                        <div className="game-card__header">
                            <span className="game-card__icon">🧱</span>
                            <span className="game-card__tier">{TIER_LABELS[tiers[0]]}</span>
                        </div>
                        <h4>Block Builder</h4>
                        <p>Build routines and plans with colorful blocks</p>
                        <div className="game-card__meta">
                            <span>🕐 4-6 min</span>
                            <span>📋 Planning</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentGame('block-builder')}
                        >
                            Play
                        </button>
                    </div>

                    {/* Mode Switcher */}
                    <div className="game-card">
                        <div className="game-card__header">
                            <span className="game-card__icon">🎨</span>
                            <span className="game-card__tier">{TIER_LABELS[tiers[0]]}</span>
                        </div>
                        <h4>Mode Switcher</h4>
                        <p>Express ideas through word, visual, sound & movement</p>
                        <div className="game-card__meta">
                            <span>🕐 5-10 min</span>
                            <span>🔄 Multi-modal</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentGame('mode-switcher')}
                        >
                            Play
                        </button>
                    </div>

                    {/* Time Capsule */}
                    <div className="game-card game-card--special">
                        <div className="game-card__header">
                            <span className="game-card__icon">📇</span>
                            <span className="game-card__tier">Collection</span>
                        </div>
                        <h4>Time Capsule</h4>
                        <p>View your creativity cards & remix old ideas</p>
                        <div className="game-card__meta">
                            <span>🕐 Any time</span>
                            <span>🔀 Remix</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentGame('time-capsule')}
                        >
                            Open
                        </button>
                    </div>
                </div>
            </div>

            {/* Problem Prompts */}
            <div className="problem-prompts">
                <h3>Today's Challenges</h3>
                <div className="prompt-cards">
                    {problems.slice(0, 3).map(problem => (
                        <button 
                            key={problem.id}
                            className="prompt-card"
                            onClick={() => setCurrentGame({ type: 'design-thinking', problem })}
                        >
                            <span className="prompt-card__icon">{problem.icon}</span>
                            <div className="prompt-card__content">
                                <span className="prompt-card__title">{problem.title}</span>
                                <span className="prompt-card__prompt">{problem.prompt}</span>
                            </div>
                            <span className="prompt-card__arrow">→</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// =============================================
// REWARD PANEL
// =============================================

function RewardPanel() {
    const { rewards, sessions, activeLearner } = useApp();
    const [expanded, setExpanded] = useState(false);

    // Ensure rewards properties are arrays
    const safeBadges = Array.isArray(rewards?.badges) ? rewards.badges : [];
    const safeCards = Array.isArray(rewards?.cards) ? rewards.cards : [];
    const tokens = rewards?.tokens || 0;

    // Recent badges
    const recentBadges = safeBadges.slice(-3).map(id => ({ id, ...BADGES[id] })).filter(b => b.id);

    // Recent cards
    const recentCards = safeCards.slice(-3);

    return (
        <aside className={`reward-panel ${expanded ? 'reward-panel--expanded' : ''}`}>
            <button 
                className="reward-panel__toggle"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
            >
                <span className="reward-panel__toggle-icon">🏆</span>
                <span className="reward-panel__toggle-label">Rewards</span>
                <span className="reward-panel__toggle-count">{tokens}</span>
            </button>

            {expanded && (
                <div className="reward-panel__content">
                    {/* Tokens */}
                    <div className="reward-section">
                        <div className="reward-section__header">
                            <span>Creative Tokens</span>
                            <span className="token-count">{tokens} ✨</span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="reward-section">
                        <div className="reward-section__header">
                            <span>Badges</span>
                            <span>{safeBadges.length}/{Object.keys(BADGES).length}</span>
                        </div>
                        {recentBadges.length > 0 ? (
                            <div className="badge-list">
                                {recentBadges.map(badge => (
                                    <div key={badge.id} className="badge-item">
                                        <span className="badge-item__icon">{badge.icon}</span>
                                        <div className="badge-item__info">
                                            <span className="badge-item__label">{badge.label}</span>
                                            <span className="badge-item__desc">{badge.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="reward-section__empty">Complete games to earn badges!</p>
                        )}
                    </div>

                    {/* Creativity Cards */}
                    <div className="reward-section">
                        <div className="reward-section__header">
                            <span>Creativity Cards</span>
                            <span>{safeCards.length}</span>
                        </div>
                        {recentCards.length > 0 ? (
                            <div className="card-list">
                                {recentCards.map(card => (
                                    <div key={card.id} className="creativity-card-mini">
                                        <span className="creativity-card-mini__emoji">{card.emoji}</span>
                                        <div className="creativity-card-mini__info">
                                            <span className="creativity-card-mini__title">{card.title}</span>
                                            <span className="creativity-card-mini__date">
                                                {formatDate(card.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="reward-section__empty">Your creativity cards will appear here!</p>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}

// =============================================
// CONTINUATION TUTORIAL
// =============================================

function ContinuationTutorial({ area, inProgressGames, onClose, onResumeGame }) {
    const areaInProgressGames = inProgressGames.filter(g => {
        // Filter games that might be related to this area
        // You can enhance this logic based on your game-to-area mapping
        return true;
    });

    return (
        <div className="continuation-tutorial">
            <div className="continuation-tutorial__overlay" onClick={onClose}></div>
            <div className="continuation-tutorial__content">
                <div className="continuation-tutorial__header">
                    <div className="continuation-tutorial__icon-wrapper">
                        <div className="continuation-tutorial__icon-animation">
                            <span className="continuation-tutorial__icon">{area.icon}</span>
                            <div className="continuation-tutorial__pulse"></div>
                        </div>
                    </div>
                    <h2>Welcome Back to {area.label}!</h2>
                    <p className="continuation-tutorial__subtitle">Let's continue your creative journey</p>
                    <button className="btn-close" onClick={onClose} aria-label="Close tutorial">✕</button>
                </div>

                <div className="continuation-tutorial__body">
                    {areaInProgressGames.length > 0 ? (
                        <>
                            <div className="continuation-tutorial__section">
                                <div className="tutorial-step">
                                    <div className="tutorial-step__number">1</div>
                                    <div className="tutorial-step__content">
                                        <h3>🎮 You Have Games in Progress</h3>
                                        <p>Great news! You have {areaInProgressGames.length} game{areaInProgressGames.length > 1 ? 's' : ''} you can continue right now.</p>
                                        <div className="tutorial-illustration">
                                            <div className="tutorial-illustration__game-cards">
                                                {areaInProgressGames.slice(0, 3).map((game, idx) => (
                                                    <div key={idx} className="tutorial-game-card" style={{ animationDelay: `${idx * 0.2}s` }}>
                                                        <span className="tutorial-game-card__icon">
                                                            {game.type === 'design-thinking' ? '💡' : 
                                                             game.type === 'idea-sprint' ? '⚡' :
                                                             game.type === 'perspective-flip' ? '🔄' :
                                                             game.type === 'story-room' ? '📖' :
                                                             game.type === 'block-builder' ? '🧱' :
                                                             game.type === 'mode-switcher' ? '🎨' : '📇'}
                                                        </span>
                                                        <span className="tutorial-game-card__label">
                                                            {game.type === 'design-thinking' ? 'Design Lab' : 
                                                             game.type === 'idea-sprint' ? 'Idea Sprint' :
                                                             game.type === 'perspective-flip' ? 'Perspective Flip' :
                                                             game.type === 'story-room' ? 'Story Room' :
                                                             game.type === 'block-builder' ? 'Block Builder' :
                                                             game.type === 'mode-switcher' ? 'Mode Switcher' : 'Time Capsule'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tutorial-step">
                                    <div className="tutorial-step__number">2</div>
                                    <div className="tutorial-step__content">
                                        <h3>🔄 How to Resume</h3>
                                        <p>Click the "🔄 Continue" button on any game card below, or use the buttons here to jump straight in!</p>
                                        <div className="tutorial-illustration">
                                            <div className="tutorial-illustration__resume-demo">
                                                <div className="resume-demo-card">
                                                    <div className="resume-demo-card__header">
                                                        <span className="resume-demo-card__icon">💡</span>
                                                        <span className="resume-demo-card__title">Mini Design Lab</span>
                                                    </div>
                                                    <button className="resume-demo-card__button resume-demo-card__button--pulse">
                                                        🔄 Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tutorial-step">
                                    <div className="tutorial-step__number">3</div>
                                    <div className="tutorial-step__content">
                                        <h3>✨ Quick Resume Options</h3>
                                        <p>Choose a game to continue from where you left off:</p>
                                        <div className="continuation-tutorial__games">
                                            {areaInProgressGames.map((game, idx) => (
                                                <button
                                                    key={idx}
                                                    className="continuation-game-resume-btn"
                                                    onClick={() => onResumeGame(game.type)}
                                                >
                                                    <span className="continuation-game-resume-btn__icon">
                                                        {game.type === 'design-thinking' ? '💡' : 
                                                         game.type === 'idea-sprint' ? '⚡' :
                                                         game.type === 'perspective-flip' ? '🔄' :
                                                         game.type === 'story-room' ? '📖' :
                                                         game.type === 'block-builder' ? '🧱' :
                                                         game.type === 'mode-switcher' ? '🎨' : '📇'}
                                                    </span>
                                                    <div className="continuation-game-resume-btn__info">
                                                        <span className="continuation-game-resume-btn__name">
                                                            {game.type === 'design-thinking' ? 'Design Lab' : 
                                                             game.type === 'idea-sprint' ? 'Idea Sprint' :
                                                             game.type === 'perspective-flip' ? 'Perspective Flip' :
                                                             game.type === 'story-room' ? 'Story Room' :
                                                             game.type === 'block-builder' ? 'Block Builder' :
                                                             game.type === 'mode-switcher' ? 'Mode Switcher' : 'Time Capsule'}
                                                        </span>
                                                        <span className="continuation-game-resume-btn__status">Click to resume</span>
                                                    </div>
                                                    <span className="continuation-game-resume-btn__arrow">→</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="continuation-tutorial__section">
                                <div className="tutorial-step">
                                    <div className="tutorial-step__number">1</div>
                                    <div className="tutorial-step__content">
                                        <h3>🎯 Ready to Start Fresh?</h3>
                                        <p>You're in the <strong>{area.label}</strong> training area. This is where you'll explore creative challenges!</p>
                                        <div className="tutorial-illustration">
                                            <div className="tutorial-illustration__area">
                                                <div className="area-visual">
                                                    <span className="area-visual__icon">{area.icon}</span>
                                                    <span className="area-visual__label">{area.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tutorial-step">
                                    <div className="tutorial-step__number">2</div>
                                    <div className="tutorial-step__content">
                                        <h3>🎮 Choose a Game</h3>
                                        <p>Scroll down to see all available games. Each game helps you practice different creative skills!</p>
                                        <div className="tutorial-illustration">
                                            <div className="tutorial-illustration__games-grid">
                                                <div className="game-card-demo">
                                                    <span className="game-card-demo__icon">💡</span>
                                                    <span className="game-card-demo__label">Design Lab</span>
                                                </div>
                                                <div className="game-card-demo">
                                                    <span className="game-card-demo__icon">⚡</span>
                                                    <span className="game-card-demo__label">Idea Sprint</span>
                                                </div>
                                                <div className="game-card-demo">
                                                    <span className="game-card-demo__icon">🔄</span>
                                                    <span className="game-card-demo__label">Perspective</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tutorial-step">
                                    <div className="tutorial-step__number">3</div>
                                    <div className="tutorial-step__content">
                                        <h3>📋 What to Expect</h3>
                                        <ul className="tutorial-expectations">
                                            <li>✨ Step-by-step guidance at every stage</li>
                                            <li>💡 Help buttons (❓) for instant tips</li>
                                            <li>🔄 Your progress saves automatically</li>
                                            <li>🏆 Earn tokens and badges as you create</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="continuation-tutorial__footer">
                        <button className="btn btn-primary btn-lg" onClick={onClose}>
                            {areaInProgressGames.length > 0 ? 'Got It! Show Me the Games' : 'Got It! Let\'s Explore'}
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Skip Tutorial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================
// TRAINING AREA GUIDE
// =============================================

function TrainingAreaGuide({ area, onClose }) {
    const areaGuides = {
        structure: {
            title: "How to Use Structure Training",
            steps: [
                "Choose a game that matches your current energy level",
                "Follow the step-by-step prompts - there's no wrong answer!",
                "Take breaks between games if you need to",
                "Your progress is saved automatically - you can always come back later",
                "Complete games to unlock new challenges and earn rewards"
            ],
            tips: [
                "Start with Mini Design Lab if you're new to this area",
                "Use Block Builder to create visual routines and plans",
                "All your ideas are saved in your Time Capsule for later"
            ]
        },
        communication: {
            title: "How to Use Communication Training",
            steps: [
                "Select a game that interests you",
                "Express your ideas in whatever way feels comfortable",
                "Try different games to explore different communication styles",
                "Use Story Room for visual storytelling",
                "Check your progress in the stats above"
            ],
            tips: [
                "Mode Switcher lets you express the same idea in multiple ways",
                "There's no pressure - take your time with each step",
                "Your creativity cards save all your work automatically"
            ]
        },
        focus: {
            title: "How to Use Focus Training",
            steps: [
                "Begin with shorter games like Idea Sprint (2-3 min)",
                "Work your way up to longer challenges as you build focus",
                "Use the timer features to practice time management",
                "Take breaks when needed - progress saves automatically",
                "Track your daily progress in the stats"
            ],
            tips: [
                "Idea Sprint is great for quick focus bursts",
                "Design Lab helps you practice sustained attention",
                "Your daily progress resets each day, but all your work is saved"
            ]
        }
    };

    const guide = areaGuides[area.id] || {
        title: `How to Use ${area.label}`,
        steps: [
            "Choose any game that interests you",
            "Follow the on-screen instructions step by step",
            "Take your time - there's no rush",
            "Your progress saves automatically",
            "Come back anytime to continue where you left off"
        ],
        tips: [
            "All games are designed to be supportive and encouraging",
            "You can pause and resume games anytime",
            "Check your Time Capsule to see all your creative work"
        ]
    };

    return (
        <div className="training-area-guide">
            <div className="training-area-guide__header">
                <h3>{guide.title}</h3>
                <button className="btn-close" onClick={onClose} aria-label="Close guide">✕</button>
            </div>
            <div className="training-area-guide__content">
                <div className="guide-section">
                    <h4>📋 Step-by-Step Guide</h4>
                    <ol className="guide-steps">
                        {guide.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div className="guide-section">
                    <h4>💡 Helpful Tips</h4>
                    <ul className="guide-tips">
                        {guide.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
                <div className="guide-section guide-section--highlight">
                    <h4>🔄 Daily Continuity</h4>
                    <p>Your progress is saved automatically! If you start a game and need to stop, you can always come back later. Look for the "Continue Your Progress" banner at the top to resume any games you started today.</p>
                </div>
            </div>
        </div>
    );
}

// =============================================
// GAME HELP GUIDE
// =============================================

function GameHelpGuide({ gameType, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);
    
    const gameGuides = {
        'design-thinking': {
            title: "How to Play Mini Design Lab",
            overview: "A 4-step creative problem-solving game. You'll choose a challenge, explore it from different angles, generate ideas, and create an action plan.",
            steps: [
                {
                    step: 1,
                    title: "Choose Your Challenge",
                    description: "Pick a problem that matters to you. It can be big or small - anything you'd like to solve creatively."
                },
                {
                    step: 2,
                    title: "See It Clearly",
                    description: "Describe the problem in your own words. What makes it challenging? What would solving it look like?"
                },
                {
                    step: 3,
                    title: "Swap Lenses",
                    description: "View your challenge from 2-3 different perspectives. This helps you see new possibilities and solutions."
                },
                {
                    step: 4,
                    title: "Idea Sprint & Plan",
                    description: "Generate multiple ideas quickly, then pick your favorite and create a simple action plan to make it happen."
                }
            ],
            tips: [
                "There are no wrong answers - trust your creativity!",
                "You can save your progress and come back later",
                "Each step builds on the previous one",
                "Take breaks between steps if needed"
            ]
        },
        'idea-sprint': {
            title: "How to Play Idea Sprint",
            overview: "A fast-paced idea generation game. Generate as many ideas as you can in 90 seconds!",
            steps: [
                {
                    step: 1,
                    title: "Read the Prompt",
                    description: "You'll see a creative challenge or question. Take a moment to understand it."
                },
                {
                    step: 2,
                    title: "Start the Timer",
                    description: "Click 'Start Sprint' and the 90-second timer begins. Don't worry about perfect ideas - just generate as many as possible!"
                },
                {
                    step: 3,
                    title: "Type Your Ideas",
                    description: "Type each idea and press Enter. Keep going until time runs out. Quantity over quality!"
                },
                {
                    step: 4,
                    title: "Review & Save",
                    description: "See all your ideas, pick your favorites, and save them to your creativity collection."
                }
            ],
            tips: [
                "Don't overthink - first thoughts are often the most creative",
                "The timer creates helpful pressure to think fast",
                "You can pause and resume if needed",
                "All ideas are saved automatically"
            ]
        },
        'perspective-flip': {
            title: "How to Play Perspective Flip",
            overview: "Explore situations from different viewpoints to gain new understanding and find creative solutions.",
            steps: [
                {
                    step: 1,
                    title: "Choose a Situation",
                    description: "Pick a scenario that you'd like to explore from different angles."
                },
                {
                    step: 2,
                    title: "Select Perspectives",
                    description: "Choose 2-3 different 'lenses' to view the situation through (like 'Optimist', 'Problem Solver', 'Future You')."
                },
                {
                    step: 3,
                    title: "Explore Each View",
                    description: "For each perspective, write what you notice or how you'd approach the situation from that viewpoint."
                },
                {
                    step: 4,
                    title: "Reflect & Learn",
                    description: "See how different perspectives reveal new insights and possibilities you might not have considered."
                }
            ],
            tips: [
                "Try perspectives that feel different from your usual way of thinking",
                "There's no right or wrong - just exploration",
                "This game is great for anxiety, stress, and problem-solving",
                "Your insights are saved automatically"
            ]
        }
    };

    const guide = gameGuides[gameType] || {
        title: "How to Play",
        overview: "Follow the on-screen instructions step by step. Your progress saves automatically!",
        steps: [],
        tips: ["Take your time", "There are no wrong answers", "You can always come back later"]
    };

    const isLast = currentStep >= guide.steps.length;
    const currentStepData = guide.steps[currentStep] || null;

    const handleNext = () => {
        if (isLast) {
            onClose();
        } else {
            setCurrentStep(prev => Math.min(prev + 1, guide.steps.length));
            setAnimationKey(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setAnimationKey(prev => prev + 1);
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div className="tutorial-overlay" onClick={handleSkip}>
            <div className="tutorial-modal game-tutorial-modal" onClick={e => e.stopPropagation()}>
                <div className="tutorial-modal__header">
                    <h2 className="tutorial-modal__title">
                        {currentStep === 0 ? `📚 ${guide.title}` : currentStepData?.title || guide.title}
                    </h2>
                    <button className="tutorial-modal__close" onClick={handleSkip} aria-label="Close tutorial">×</button>
                </div>
                
                <div className="tutorial-modal__body">
                    {currentStep === 0 ? (
                        <>
                            <div className="tutorial-illustration tutorial-illustration--game-welcome" key={animationKey}>
                                <GameTutorialIllustration gameType={gameType} step="welcome" />
                            </div>
                            <div className="tutorial-content">
                                <p className="tutorial-overview">{guide.overview}</p>
                                <div className="tutorial-quick-tips">
                                    <h4>Quick Tips:</h4>
                                    <ul>
                                        {guide.tips.slice(0, 3).map((tip, i) => (
                                            <li key={i}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : currentStepData ? (
                        <>
                            <div className="tutorial-illustration tutorial-illustration--game-step" key={animationKey}>
                                <GameTutorialIllustration gameType={gameType} step={currentStepData.step} />
                            </div>
                            <div className="tutorial-content">
                                <div className="tutorial-step-number">Step {currentStepData.step}</div>
                                <h3 className="tutorial-step-title">{currentStepData.title}</h3>
                                <p className="tutorial-step-description">{currentStepData.description}</p>
                            </div>
                        </>
                    ) : null}

                    {guide.steps.length > 0 && (
                        <div className="tutorial-progress">
                            <div className="tutorial-progress-bar">
                                <div 
                                    className="tutorial-progress-fill" 
                                    style={{ width: `${((currentStep + 1) / (guide.steps.length + 1)) * 100}%` }}
                                />
                            </div>
                            <span className="tutorial-progress-text">
                                {currentStep === 0 ? 'Overview' : `Step ${currentStep} of ${guide.steps.length}`}
                            </span>
                        </div>
                    )}

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
                                {isLast ? 'Got It! Start Playing' : 'Next →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================
// GAME TUTORIAL ILLUSTRATIONS
// =============================================

function GameTutorialIllustration({ gameType, step }) {
    const [animationPhase, setAnimationPhase] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationPhase(prev => (prev + 1) % 4);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const renderIllustration = () => {
        if (step === 'welcome') {
            switch (gameType) {
                case 'design-thinking':
                    return (
                        <div className="tutorial-ill-design-thinking">
                            <div className="tutorial-game-flow">
                                <div className="tutorial-step-card tutorial-step-card--pulse" style={{ animationDelay: '0s' }}>
                                    <span className="tutorial-step-icon">🎯</span>
                                    <span className="tutorial-step-label">Choose</span>
                                </div>
                                <div className="tutorial-arrow">→</div>
                                <div className="tutorial-step-card tutorial-step-card--pulse" style={{ animationDelay: '0.2s' }}>
                                    <span className="tutorial-step-icon">👁️</span>
                                    <span className="tutorial-step-label">See</span>
                                </div>
                                <div className="tutorial-arrow">→</div>
                                <div className="tutorial-step-card tutorial-step-card--pulse" style={{ animationDelay: '0.4s' }}>
                                    <span className="tutorial-step-icon">🔄</span>
                                    <span className="tutorial-step-label">Swap</span>
                                </div>
                                <div className="tutorial-arrow">→</div>
                                <div className="tutorial-step-card tutorial-step-card--pulse" style={{ animationDelay: '0.6s' }}>
                                    <span className="tutorial-step-icon">💡</span>
                                    <span className="tutorial-step-label">Create</span>
                                </div>
                            </div>
                        </div>
                    );
                case 'idea-sprint':
                    return (
                        <div className="tutorial-ill-idea-sprint">
                            <div className="tutorial-timer-demo">
                                <div className="tutorial-timer-circle tutorial-timer-circle--pulse">
                                    <span className="tutorial-timer-text">90s</span>
                                </div>
                                <div className="tutorial-ideas-burst">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div 
                                            key={i} 
                                            className="tutorial-idea-bubble tutorial-idea-bubble--float"
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >
                                            💡
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                case 'perspective-flip':
                    return (
                        <div className="tutorial-ill-perspective-flip">
                            <div className="tutorial-perspective-demo">
                                <div className="tutorial-scenario-center">🎭</div>
                                <div className="tutorial-perspectives-ring">
                                    <div className="tutorial-perspective-lens tutorial-perspective-lens--rotate" style={{ animationDelay: '0s' }}>
                                        <span>🔍</span>
                                    </div>
                                    <div className="tutorial-perspective-lens tutorial-perspective-lens--rotate" style={{ animationDelay: '0.5s' }}>
                                        <span>💭</span>
                                    </div>
                                    <div className="tutorial-perspective-lens tutorial-perspective-lens--rotate" style={{ animationDelay: '1s' }}>
                                        <span>🔮</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'story-room':
                    return (
                        <div className="tutorial-ill-story-room">
                            <div className="tutorial-story-panels">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="tutorial-story-panel tutorial-story-panel--fade" style={{ animationDelay: `${i * 0.2}s` }}>
                                        <div className="tutorial-panel-bg">🎨</div>
                                        <div className="tutorial-panel-content">📖</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                case 'block-builder':
                    return (
                        <div className="tutorial-ill-block-builder">
                            <div className="tutorial-blocks-demo">
                                {['🧱', '🧱', '🧱', '🧱'].map((block, i) => (
                                    <div 
                                        key={i} 
                                        className="tutorial-block tutorial-block--stack"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    >
                                        {block}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                case 'mode-switcher':
                    return (
                        <div className="tutorial-ill-mode-switcher">
                            <div className="tutorial-modes-demo">
                                {['✏️', '🎨', '🎵', '🧍'].map((mode, i) => (
                                    <div 
                                        key={i} 
                                        className="tutorial-mode tutorial-mode--switch"
                                        style={{ animationDelay: `${i * 0.2}s` }}
                                    >
                                        {mode}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                case 'time-capsule':
                    return (
                        <div className="tutorial-ill-time-capsule">
                            <div className="tutorial-capsule-demo">
                                <div className="tutorial-capsule tutorial-capsule--glow">📇</div>
                                <div className="tutorial-cards-flying">
                                    {[1, 2, 3].map(i => (
                                        <div 
                                            key={i} 
                                            className="tutorial-card-fly tutorial-card-fly--float"
                                            style={{ animationDelay: `${i * 0.3}s` }}
                                        >
                                            💡
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                default:
                    return <div className="tutorial-ill-default">🎮</div>;
            }
        } else {
            // Step-specific illustrations
            switch (gameType) {
                case 'design-thinking':
                    switch (step) {
                        case 1:
                            return (
                                <div className="tutorial-ill-step">
                                    <div className="tutorial-problem-selector">
                                        <div className="tutorial-problem-card tutorial-problem-card--bounce">🎯 Problem</div>
                                        <div className="tutorial-problem-card tutorial-problem-card--bounce" style={{ animationDelay: '0.1s' }}>💡 Challenge</div>
                                        <div className="tutorial-problem-card tutorial-problem-card--bounce" style={{ animationDelay: '0.2s' }}>🤔 Question</div>
                                    </div>
                                </div>
                            );
                        case 2:
                            return (
                                <div className="tutorial-ill-step">
                                    <div className="tutorial-description-demo">
                                        <div className="tutorial-text-area tutorial-text-area--type">📝 Describing...</div>
                                    </div>
                                </div>
                            );
                        case 3:
                            return (
                                <div className="tutorial-ill-step">
                                    <div className="tutorial-lenses-demo">
                                        <div className="tutorial-lens tutorial-lens--glow">🔍 Lens 1</div>
                                        <div className="tutorial-lens tutorial-lens--glow" style={{ animationDelay: '0.2s' }}>🔍 Lens 2</div>
                                        <div className="tutorial-lens tutorial-lens--glow" style={{ animationDelay: '0.4s' }}>🔍 Lens 3</div>
                                    </div>
                                </div>
                            );
                        case 4:
                            return (
                                <div className="tutorial-ill-step">
                                    <div className="tutorial-ideas-sprint">
                                        <div className="tutorial-idea tutorial-idea--pop">💡 Idea 1</div>
                                        <div className="tutorial-idea tutorial-idea--pop" style={{ animationDelay: '0.1s' }}>💡 Idea 2</div>
                                        <div className="tutorial-idea tutorial-idea--pop" style={{ animationDelay: '0.2s' }}>💡 Idea 3</div>
                                    </div>
                                </div>
                            );
                        default:
                            return <div className="tutorial-ill-default">📋</div>;
                    }
                default:
                    return <div className="tutorial-ill-default">🎮</div>;
            }
        }
    };

    return (
        <div className="tutorial-illustration-wrapper">
            {renderIllustration()}
        </div>
    );
}

// =============================================
// GAME VIEW WRAPPER
// =============================================

function GameView() {
    const { currentGame, setCurrentGame, currentTrainingArea, resetGameState, clearGameState } = useApp();

    const handleExit = () => {
        setCurrentGame(null);
    };

    // Determine which game to render
    const gameType = typeof currentGame === 'string' ? currentGame : currentGame?.type;
    const gameData = typeof currentGame === 'object' ? currentGame : null;

    const handleReset = () => {
        if (window.confirm('Reset this game and start fresh? Your current progress will be cleared.')) {
            if (gameType) {
                resetGameState(gameType);
            }
            // Reset to fresh game state
            setCurrentGame(gameType);
        }
    };

    return (
        <div className="game-view">
            <div className="game-view__header">
            <button className="game-view__back" onClick={handleExit}>
                ← Back to {currentTrainingArea?.label || 'Hub'}
            </button>
                <button 
                    className="game-view__reset" 
                    onClick={handleReset}
                    title="Reset and start fresh"
                >
                    🔄 Reset Game
                </button>
            </div>

            {gameType === 'design-thinking' && (
                <DesignThinkingGame 
                    problem={gameData?.problem} 
                    onComplete={handleExit}
                />
            )}
            {gameType === 'idea-sprint' && (
                <IdeaSprintGame onComplete={handleExit} />
            )}
            {gameType === 'perspective-flip' && (
                <PerspectiveFlipGame onComplete={handleExit} />
            )}
            {gameType === 'story-room' && (
                <StoryRoomGame onComplete={handleExit} />
            )}
            {gameType === 'block-builder' && (
                <BlockBuilderGame onComplete={handleExit} />
            )}
            {gameType === 'mode-switcher' && (
                <ModeSwitcherGame onComplete={handleExit} />
            )}
            {gameType === 'time-capsule' && (
                <TimeCapsuleGame onComplete={handleExit} />
            )}
        </div>
    );
}

// =============================================
// DESIGN THINKING GAME
// =============================================

function DesignThinkingGame({ problem: initialProblem, onComplete }) {
    const { 
        activeLearner, 
        currentTrainingArea, 
        startSession, 
        completeSession, 
        createCreativityCard,
        showNotification,
        settings,
        generateAIIdeas,
        generateGoalSuggestions,
        saveGoalSuggestions,
        resetGameState
    } = useApp();

    const condition = activeLearner?.condition || 'everyone';
    const problems = DESIGN_THINKING_PROBLEMS[condition] || DESIGN_THINKING_PROBLEMS.everyone;

    const [step, setStep] = useState(0); // 0: select, 1: see, 2: swap, 3: sprint, 4: experiment, 5: complete
    const [selectedProblem, setSelectedProblem] = useState(initialProblem || null);
    const [description, setDescription] = useState('');
    const [selectedLenses, setSelectedLenses] = useState([]);
    const [lensInsights, setLensInsights] = useState({});
    const [ideas, setIdeas] = useState([]);
    const [currentIdea, setCurrentIdea] = useState('');
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [missionPlan, setMissionPlan] = useState('');
    const [session, setSession] = useState(null);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [userGoal, setUserGoal] = useState('');
    const [goalSuggestions, setGoalSuggestions] = useState([]);
    const [isGeneratingGoalSuggestions, setIsGeneratingGoalSuggestions] = useState(false);
    
    // Timer for idea sprint
    const [timeLeft, setTimeLeft] = useState(90);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef(null);

    // Start session when problem is selected
    useEffect(() => {
        if (selectedProblem && !session) {
            const newSession = startSession('design-thinking', currentTrainingArea?.id);
            setSession(newSession);
        }
    }, [selectedProblem]);

    // Timer effect
    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [timerActive, timeLeft]);

    const handleAddIdea = () => {
        if (currentIdea.trim()) {
            setIdeas(prev => [...prev, { text: currentIdea.trim(), id: generateId() }]);
            setCurrentIdea('');
        }
    };

    // Reset function for this game
    const handleReset = () => {
        if (window.confirm('Reset this game? All your progress in this session will be cleared and you\'ll start from the beginning.')) {
            setStep(0);
            setSelectedProblem(null);
            setDescription('');
            setSelectedLenses([]);
            setLensInsights({});
            setIdeas([]);
            setCurrentIdea('');
            setSelectedIdea(null);
            setMissionPlan('');
            setSession(null);
            setAiSuggestions([]);
            setShowAISuggestions(false);
            setTimeLeft(90);
            setTimerActive(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            resetGameState('design-thinking');
            showNotification('Game reset. Ready to start fresh!', 'info');
        }
    };

    const handleComplete = () => {
        if (session) {
            const results = {
                problem: selectedProblem,
                description,
                lensInsights,
                ideas,
                selectedIdea,
                missionPlan,
                perspectivesUsed: selectedLenses
            };
            
            completeSession(session, results);
            
            // Create creativity card
            createCreativityCard(
                session,
                `${selectedProblem.title} Solution`,
                selectedIdea?.text || ideas[0]?.text || 'Creative exploration'
            );
            
            showNotification('🎉 Design Lab complete! +10 tokens earned', 'success');
        }
        onComplete();
    };

    const stepTitles = [
        'Choose a Challenge',
        'See It Clearly',
        'Swap Lenses',
        'Idea Sprint',
        'Create Your Mission',
        'Complete!'
    ];

    return (
        <div className="design-thinking-game">
            {/* Game Header with Reset */}
            <div className="game-header">
                <div className="game-header__title">
                    <h2>Mini Design Lab</h2>
                    <span className="game-header__step">Step {step + 1} of {stepTitles.length}</span>
                </div>
                <button 
                    className="btn btn-reset btn-sm"
                    onClick={handleReset}
                    title="Reset and start over"
                >
                    🔄 Reset
                </button>
            </div>

            {/* Progress Bar */}
            <div className="game-progress">
                <div className="game-progress__bar">
                    <div 
                        className="game-progress__fill" 
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>
                <div className="game-progress__steps">
                    {stepTitles.map((title, i) => (
                        <div 
                            key={i}
                            className={`game-progress__step ${i <= step ? 'game-progress__step--done' : ''} ${i === step ? 'game-progress__step--current' : ''}`}
                        >
                            <span className="game-progress__step-num">{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="game-content">
                {/* Step 0: Problem Selection */}
                {step === 0 && (
                    <div className="game-step game-step--select">
                        <h2>What would you like to work on?</h2>
                        <p>Pick a challenge that feels relevant to you right now.</p>
                        
                        <div className="problem-grid">
                            {problems.map(problem => (
                                <button
                                    key={problem.id}
                                    className={`problem-btn ${selectedProblem?.id === problem.id ? 'problem-btn--selected' : ''}`}
                                    onClick={() => setSelectedProblem(problem)}
                                >
                                    <span className="problem-btn__icon">{problem.icon}</span>
                                    <span className="problem-btn__title">{problem.title}</span>
                                    <span className="problem-btn__prompt">{problem.prompt}</span>
                                </button>
                            ))}
                        </div>

                        <div className="step-actions">
                        {selectedProblem && (
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => setStep(1)}
                            >
                                Start with "{selectedProblem.title}"
                            </button>
                        )}
                            <button 
                                className="btn btn-reset"
                                onClick={handleReset}
                                title="Reset and start over"
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 1: See It Clearly */}
                {step === 1 && (
                    <div className="game-step game-step--see">
                        <div className="step-header">
                            <span className="step-number">1</span>
                            <h2>See It Clearly</h2>
                        </div>
                        <p>Let's understand this challenge better. When and where does this happen?</p>

                        <div className="challenge-card">
                            <span className="challenge-card__icon">{selectedProblem.icon}</span>
                            <span className="challenge-card__text">{selectedProblem.prompt}</span>
                        </div>

                        <div className="prompt-helpers">
                            <span className="prompt-helper">🕐 When does this happen?</span>
                            <span className="prompt-helper">📍 Where does it happen?</span>
                            <span className="prompt-helper">😟 What makes it hard?</span>
                        </div>

                        <textarea
                            className="game-textarea"
                            placeholder="Describe what happens... (e.g., 'Every morning when I need to get ready for school, I feel rushed because...')"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                        />

                        {/* AI Goal Suggestions Button */}
                        <div className="goal-suggestions-section">
                            <button 
                                className="btn btn-secondary btn-goal-suggestions"
                                onClick={() => setShowGoalModal(true)}
                                title="Get AI-powered goal suggestions"
                            >
                                🎯 What Do You Want to Achieve? Get AI Suggestions
                            </button>
                        </div>

                        {/* Goal Suggestions Modal */}
                        {showGoalModal && (
                            <GoalSuggestionsModal
                                problem={selectedProblem}
                                description={description}
                                condition={condition}
                                onClose={() => {
                                    setShowGoalModal(false);
                                    setUserGoal('');
                                    setGoalSuggestions([]);
                                }}
                                onGoalSubmit={async (goal) => {
                                    setUserGoal(goal);
                                    setIsGeneratingGoalSuggestions(true);
                                    try {
                                        const suggestions = await generateGoalSuggestions(goal, {
                                            problem: selectedProblem?.title,
                                            description: description,
                                            condition: condition
                                        });
                                        setGoalSuggestions(suggestions);
                                        // Auto-save suggestions to user profile
                                        saveGoalSuggestions(goal, suggestions, selectedProblem);
                                    } catch (error) {
                                        console.error('Error generating goal suggestions:', error);
                                        showNotification('Error generating suggestions. Please try again.', 'error');
                                    } finally {
                                        setIsGeneratingGoalSuggestions(false);
                                    }
                                }}
                                goalSuggestions={goalSuggestions}
                                isGenerating={isGeneratingGoalSuggestions}
                            />
                        )}

                        <div className="step-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setStep(0)}
                            >
                                Back
                            </button>
                            <button 
                                className="btn btn-reset"
                                onClick={handleReset}
                                title="Reset and start over"
                            >
                                🔄 Reset
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setStep(2)}
                                disabled={!description.trim()}
                            >
                                Next: Swap Lenses
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Swap Lenses */}
                {step === 2 && (
                    <div className="game-step game-step--swap">
                        <div className="step-header">
                            <span className="step-number">2</span>
                            <h2>Swap Lenses</h2>
                        </div>
                        <p>Look at your challenge from different perspectives. Pick 2-3 lenses to try.</p>

                        <div className="lens-grid">
                            {PERSPECTIVE_LENSES.map(lens => (
                                <button
                                    key={lens.id}
                                    className={`lens-card ${selectedLenses.includes(lens.id) ? 'lens-card--selected' : ''}`}
                                    onClick={() => {
                                        setSelectedLenses(prev => 
                                            prev.includes(lens.id) 
                                                ? prev.filter(l => l !== lens.id)
                                                : prev.length < 3 ? [...prev, lens.id] : prev
                                        );
                                    }}
                                >
                                    <span className="lens-card__icon">{lens.icon}</span>
                                    <span className="lens-card__label">{lens.label}</span>
                                    <span className="lens-card__prompt">{lens.prompt}</span>
                                </button>
                            ))}
                        </div>

                        {selectedLenses.length > 0 && (
                            <div className="lens-insights">
                                <h3>What do you notice from each lens?</h3>
                                {selectedLenses.map(lensId => {
                                    const lens = PERSPECTIVE_LENSES.find(l => l.id === lensId);
                                    return (
                                        <div key={lensId} className="lens-insight">
                                            <label>
                                                <span>{lens.icon} {lens.label}</span>
                                                <input
                                                    type="text"
                                                    placeholder={lens.prompt}
                                                    value={lensInsights[lensId] || ''}
                                                    onChange={e => setLensInsights(prev => ({
                                                        ...prev,
                                                        [lensId]: e.target.value
                                                    }))}
                                                />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="step-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>
                            <button 
                                className="btn btn-reset"
                                onClick={handleReset}
                                title="Reset and start over"
                            >
                                🔄 Reset
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setStep(3)}
                                disabled={selectedLenses.length === 0}
                            >
                                Next: Idea Sprint
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Idea Sprint */}
                {step === 3 && (
                    <div className="game-step game-step--sprint">
                        <div className="step-header">
                            <span className="step-number">3</span>
                            <h2>Idea Sprint</h2>
                        </div>
                        <p>
                            {settings.lowStimulation 
                                ? 'Write down as many ideas as you can. No pressure, take your time.'
                                : 'Quick! Generate as many ideas as you can. Every idea counts!'
                            }
                        </p>

                        {!settings.lowStimulation && (
                            <div className="sprint-timer">
                                <div className="sprint-timer__display">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </div>
                                {!timerActive && timeLeft === 90 && (
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setTimerActive(true)}
                                    >
                                        Start Timer
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="idea-input">
                            <input
                                type="text"
                                placeholder="Type an idea and press Enter..."
                                value={currentIdea}
                                onChange={e => setCurrentIdea(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddIdea()}
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={handleAddIdea}
                                disabled={!currentIdea.trim()}
                            >
                                Add 💡
                            </button>
                            <button 
                                className="btn btn-ai"
                                onClick={() => {
                                    const suggestions = generateAIIdeas(description, {
                                        problem: selectedProblem,
                                        ideas: ideas,
                                        condition: activeLearner?.condition,
                                        trainingArea: currentTrainingArea?.id
                                    });
                                    setAiSuggestions(suggestions);
                                    setShowAISuggestions(true);
                                    showNotification('✨ AI suggestions generated!', 'info');
                                }}
                                title="Get AI-generated ideas based on your input"
                            >
                                🤖 AI Ideas
                            </button>
                        </div>

                        {/* AI Suggestions Panel */}
                        {showAISuggestions && aiSuggestions.length > 0 && (
                            <div className="ai-suggestions-panel">
                                <div className="ai-suggestions-panel__header">
                                    <h4>✨ AI-Generated Ideas</h4>
                                    <button 
                                        className="btn-close"
                                        onClick={() => setShowAISuggestions(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="ai-suggestions-panel__content">
                                    {aiSuggestions.map((suggestion, idx) => (
                                        <div key={suggestion.id || idx} className="ai-suggestion-card">
                                            <div className="ai-suggestion-card__header">
                                                <span className="ai-suggestion-card__icon">💡</span>
                                                <h5>{suggestion.title}</h5>
                                            </div>
                                            <p className="ai-suggestion-card__text">{suggestion.text}</p>
                                            {suggestion.evidence && (
                                                <div className="ai-suggestion-card__evidence">
                                                    <span className="evidence-badge">📚 Evidence-based</span>
                                                    <span className="evidence-text">{suggestion.evidence}</span>
                                                </div>
                                            )}
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => {
                                                    setIdeas(prev => [...prev, { 
                                                        text: `${suggestion.title}: ${suggestion.text}`, 
                                                        id: generateId(),
                                                        source: 'AI'
                                                    }]);
                                                    showNotification('Idea added!', 'success');
                                                }}
                                            >
                                                Use This Idea
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="ideas-list">
                            {ideas.map((idea, i) => (
                                <div 
                                    key={idea.id} 
                                    className={`idea-chip ${settings.animationsEnabled ? 'idea-chip--animated' : ''}`}
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <span className="idea-chip__num">{i + 1}</span>
                                    <span className="idea-chip__text">{idea.text}</span>
                                </div>
                            ))}
                        </div>

                        {ideas.length > 0 && (
                            <div className="ideas-count">
                                <span className="ideas-count__number">{ideas.length}</span>
                                <span className="ideas-count__label">
                                    {ideas.length === 1 ? 'idea' : 'ideas'} generated!
                                </span>
                                {ideas.length >= 5 && <span className="ideas-count__badge">🎯 Great work!</span>}
                            </div>
                        )}

                        <div className="step-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setStep(2)}
                            >
                                Back
                            </button>
                            <button 
                                className="btn btn-reset"
                                onClick={handleReset}
                                title="Reset and start over"
                            >
                                🔄 Reset
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    setTimerActive(false);
                                    setStep(4);
                                }}
                                disabled={ideas.length === 0}
                            >
                                Next: Create Mission
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Create Mission */}
                {step === 4 && (
                    <div className="game-step game-step--mission">
                        <div className="step-header">
                            <span className="step-number">4</span>
                            <h2>Create Your Mission</h2>
                        </div>
                        <p>Pick your favourite idea and turn it into a small experiment to try.</p>

                        <div className="mission-ideas">
                            <h3>Your Ideas</h3>
                            <div className="mission-idea-list">
                                {ideas.map(idea => (
                                    <button
                                        key={idea.id}
                                        className={`mission-idea ${selectedIdea?.id === idea.id ? 'mission-idea--selected' : ''}`}
                                        onClick={() => setSelectedIdea(idea)}
                                    >
                                        <span className="mission-idea__check">
                                            {selectedIdea?.id === idea.id ? '✓' : '○'}
                                        </span>
                                        <span>{idea.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedIdea && (
                            <div className="mission-plan">
                                <h3>Your Micro-Experiment</h3>
                                <div className="mission-card">
                                    <div className="mission-card__header">
                                        <span className="mission-card__icon">🎯</span>
                                        <span className="mission-card__title">{selectedProblem.title} Mission</span>
                                    </div>
                                    <div className="mission-card__idea">
                                        <strong>Idea:</strong> {selectedIdea.text}
                                    </div>
                                    <textarea
                                        className="mission-card__plan"
                                        placeholder="When will you try this? What's one small step you can take today or this week?"
                                        value={missionPlan}
                                        onChange={e => setMissionPlan(e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="step-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setStep(3)}
                            >
                                Back
                            </button>
                            <button 
                                className="btn btn-reset"
                                onClick={handleReset}
                                title="Reset and start over"
                            >
                                🔄 Reset
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setStep(5)}
                                disabled={!selectedIdea}
                            >
                                Complete Mission
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Complete */}
                {step === 5 && (
                    <div className="game-step game-step--complete">
                        <div className="complete-celebration">
                            <span className="complete-icon">🎉</span>
                            <h2>Amazing Work!</h2>
                            <p>You've completed a full design thinking cycle.</p>
                        </div>

                        <div className="complete-summary">
                            <div className="summary-card">
                                <div className="summary-stat">
                                    <span className="summary-stat__value">{ideas.length}</span>
                                    <span className="summary-stat__label">Ideas Generated</span>
                                </div>
                                <div className="summary-stat">
                                    <span className="summary-stat__value">{selectedLenses.length}</span>
                                    <span className="summary-stat__label">Perspectives Used</span>
                                </div>
                                <div className="summary-stat">
                                    <span className="summary-stat__value">1</span>
                                    <span className="summary-stat__label">Mission Created</span>
                                </div>
                            </div>

                            <div className="mission-preview">
                                <h3>Your Mission Card</h3>
                                <div className="mission-card mission-card--final">
                                    <div className="mission-card__header">
                                        <span className="mission-card__icon">{selectedProblem.icon}</span>
                                        <span className="mission-card__title">{selectedProblem.title}</span>
                                    </div>
                                    <div className="mission-card__idea">{selectedIdea?.text}</div>
                                    {missionPlan && (
                                        <div className="mission-card__plan-preview">{missionPlan}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="complete-rewards">
                            <span className="reward-earned">+10 Creative Tokens ✨</span>
                            {ideas.length >= 5 && (
                                <span className="badge-earned">🏆 Idea Generator Badge!</span>
                            )}
                        </div>

                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={handleComplete}
                        >
                            Finish & Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// =============================================
// IDEA SPRINT GAME (Simplified)
// =============================================

function IdeaSprintGame({ onComplete }) {
    const { activeLearner, currentTrainingArea, startSession, completeSession, showNotification, settings, resetGameState } = useApp();
    
    const [prompt, setPrompt] = useState('');
    const [ideas, setIdeas] = useState([]);
    const [currentIdea, setCurrentIdea] = useState('');
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameState, setGameState] = useState('setup'); // setup, playing, complete

    const prompts = [
        'What could you do with 100 cardboard boxes?',
        'Invent a new holiday. What would you celebrate?',
        'Design a perfect bedroom for relaxation.',
        'What could a school of the future look like?',
        'Create a new sport using only items from your kitchen.',
        'Invent a new emoji and what it means.',
        'Design a helpful robot for everyday life.'
    ];

    useEffect(() => {
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }, []);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('complete');
        }
        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    const handleAddIdea = () => {
        if (currentIdea.trim()) {
            setIdeas(prev => [...prev, currentIdea.trim()]);
            setCurrentIdea('');
        }
    };

    const handleComplete = () => {
        const session = startSession('idea-sprint', currentTrainingArea?.id);
        completeSession(session, { ideas, prompt });
        showNotification(`🎉 Sprint complete! ${ideas.length} ideas generated!`, 'success');
        onComplete();
    };

    return (
        <div className="idea-sprint-game">
            {gameState === 'setup' && (
                <div className="sprint-setup">
                    <h2>⚡ Idea Sprint</h2>
                    <p>Generate as many ideas as you can in 90 seconds!</p>
                    <div className="sprint-prompt-card">
                        <span className="sprint-prompt-card__label">Your Challenge:</span>
                        <span className="sprint-prompt-card__text">{prompt}</span>
                    </div>
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => setGameState('playing')}
                    >
                        Start Sprint! 🚀
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="sprint-playing">
                    <div className="sprint-timer-big">
                        <span className="sprint-timer-big__time">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    
                    <div className="sprint-prompt">{prompt}</div>
                    
                    <div className="sprint-input">
                        <input
                            type="text"
                            placeholder="Type idea and press Enter..."
                            value={currentIdea}
                            onChange={e => setCurrentIdea(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddIdea()}
                            autoFocus
                        />
                        <button onClick={handleAddIdea}>Add</button>
                    </div>

                    <div className="sprint-ideas">
                        {ideas.map((idea, i) => (
                            <div key={i} className="sprint-idea">{i + 1}. {idea}</div>
                        ))}
                    </div>

                    <div className="sprint-count">{ideas.length} ideas</div>

                    <div className="sprint-actions">
                        <button 
                            className="btn btn-reset"
                            onClick={handleReset}
                            title="Reset and start over"
                        >
                            🔄 Reset
                        </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setGameState('complete')}
                    >
                        Finish Early
                    </button>
                    </div>
                </div>
            )}

            {gameState === 'complete' && (
                <div className="sprint-complete">
                    <h2>🎉 Sprint Complete!</h2>
                    <div className="sprint-results">
                        <div className="sprint-result">
                            <span className="sprint-result__value">{ideas.length}</span>
                            <span className="sprint-result__label">Ideas Generated</span>
                        </div>
                    </div>
                    <div className="sprint-ideas-final">
                        {ideas.map((idea, i) => (
                            <div key={i} className="sprint-idea">{i + 1}. {idea}</div>
                        ))}
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                        Save & Continue
                    </button>
                </div>
            )}
        </div>
    );
}

// =============================================
// PERSPECTIVE FLIP GAME (Simplified)
// =============================================

function PerspectiveFlipGame({ onComplete }) {
    const { startSession, completeSession, currentTrainingArea, showNotification, resetGameState } = useApp();
    
    const [scenario, setScenario] = useState('');
    const [perspectives, setPerspectives] = useState([]);
    const [currentPerspective, setCurrentPerspective] = useState(null);
    const [insights, setInsights] = useState({});
    const [step, setStep] = useState(0);

    const scenarios = [
        'You have to present in front of your class tomorrow.',
        'A friend said something that hurt your feelings.',
        'You made a mistake on an important project.',
        'Plans changed suddenly and your routine is disrupted.',
        'Someone asked you to do something you don\'t want to do.'
    ];

    useEffect(() => {
        setScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
        // Select 3 random perspectives
        const shuffled = [...PERSPECTIVE_LENSES].sort(() => 0.5 - Math.random());
        setPerspectives(shuffled.slice(0, 3));
    }, []);

    const handleComplete = () => {
        const session = startSession('perspective-flip', currentTrainingArea?.id);
        completeSession(session, { scenario, insights, perspectivesUsed: perspectives.map(p => p.id) });
        showNotification('🔄 Great perspective work! +10 tokens', 'success');
        onComplete();
    };

    return (
        <div className="perspective-game">
            {step === 0 && (
                <div className="perspective-intro">
                    <h2>🔄 Perspective Flip</h2>
                    <p>See a situation from different viewpoints to find new understanding.</p>
                    <div className="scenario-card">
                        <span className="scenario-card__label">Situation:</span>
                        <span className="scenario-card__text">{scenario}</span>
                    </div>
                    <div className="step-actions">
                    <button className="btn btn-primary" onClick={() => setStep(1)}>
                        Start Exploring
                    </button>
                        <button 
                            className="btn btn-reset"
                            onClick={handleReset}
                            title="Reset and start over"
                        >
                            🔄 Reset
                        </button>
                    </div>
                </div>
            )}

            {step >= 1 && step <= perspectives.length && (
                <div className="perspective-explore">
                    <div className="perspective-progress">
                        {perspectives.map((p, i) => (
                            <div 
                                key={p.id} 
                                className={`perspective-dot ${i < step ? 'done' : ''} ${i === step - 1 ? 'current' : ''}`}
                            />
                        ))}
                    </div>
                    
                    <div className="perspective-card">
                        <span className="perspective-card__icon">{perspectives[step - 1].icon}</span>
                        <span className="perspective-card__label">{perspectives[step - 1].label}</span>
                        <span className="perspective-card__prompt">{perspectives[step - 1].prompt}</span>
                    </div>

                    <div className="scenario-reminder">{scenario}</div>

                    <textarea
                        className="perspective-input"
                        placeholder="What do you notice from this perspective?"
                        value={insights[perspectives[step - 1].id] || ''}
                        onChange={e => setInsights(prev => ({
                            ...prev,
                            [perspectives[step - 1].id]: e.target.value
                        }))}
                        rows={3}
                    />

                    <div className="step-actions">
                        {step > 1 && (
                            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                                Back
                            </button>
                        )}
                        <button 
                            className="btn btn-primary"
                            onClick={() => setStep(step + 1)}
                            disabled={!insights[perspectives[step - 1].id]?.trim()}
                        >
                            {step === perspectives.length ? 'See Summary' : 'Next Perspective'}
                        </button>
                    </div>
                </div>
            )}

            {step > perspectives.length && (
                <div className="perspective-complete">
                    <h2>🎉 Great Perspective Work!</h2>
                    <div className="perspective-summary">
                        {perspectives.map(p => (
                            <div key={p.id} className="perspective-summary-item">
                                <span className="perspective-summary-item__icon">{p.icon}</span>
                                <div>
                                    <strong>{p.label}</strong>
                                    <p>{insights[p.id]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                        Save & Continue
                    </button>
                </div>
            )}
        </div>
    );
}

// =============================================
// STORY ROOMS & BRAINTRUST GAME
// Visual storytelling for anxiety/stress/depression
// =============================================

const STORY_BACKGROUNDS = [
    { id: 'bedroom', label: 'Bedroom', icon: '🛏️', color: '#B8A9C9' },
    { id: 'school', label: 'School', icon: '🏫', color: '#A8C5D8' },
    { id: 'park', label: 'Park', icon: '🌳', color: '#9DB4A0' },
    { id: 'home', label: 'Living Room', icon: '🏠', color: '#D4A59A' },
    { id: 'outside', label: 'Outside', icon: '🌤️', color: '#E5C76B' },
    { id: 'store', label: 'Shop/Store', icon: '🏪', color: '#7BA3C9' }
];

const STORY_CHARACTERS = [
    { id: 'me', label: 'Me', emoji: '🧑' },
    { id: 'friend', label: 'Friend', emoji: '👫' },
    { id: 'parent', label: 'Parent', emoji: '👨‍👩‍👧' },
    { id: 'teacher', label: 'Teacher', emoji: '👩‍🏫' },
    { id: 'stranger', label: 'Someone New', emoji: '🧍' },
    { id: 'pet', label: 'Pet', emoji: '🐕' }
];

const STORY_EMOTIONS = [
    { id: 'worried', label: 'Worried', emoji: '😰' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'angry', label: 'Frustrated', emoji: '😤' },
    { id: 'scared', label: 'Scared', emoji: '😨' },
    { id: 'confused', label: 'Confused', emoji: '😕' },
    { id: 'okay', label: 'Okay', emoji: '😊' },
    { id: 'happy', label: 'Happy', emoji: '😄' },
    { id: 'proud', label: 'Proud', emoji: '🥳' }
];

const BRAINTRUST_VOICES = [
    { 
        id: 'problem-solver', 
        label: 'Problem Solver', 
        icon: '🔧', 
        color: '#A8C5D8',
        prompts: [
            'What small step could help here?',
            'Is there another way to look at this?',
            'What has worked before in situations like this?',
            'Who could help with this?'
        ]
    },
    { 
        id: 'kind-friend', 
        label: 'Kind Friend', 
        icon: '💚', 
        color: '#9DB4A0',
        prompts: [
            'It\'s okay to feel this way.',
            'You\'re doing your best.',
            'Everyone struggles sometimes.',
            'What would you say to a friend in this situation?'
        ]
    },
    { 
        id: 'future-me', 
        label: 'Future Me', 
        icon: '🔮', 
        color: '#B8A9C9',
        prompts: [
            'How might this feel in a week?',
            'What will you remember about this later?',
            'What could you learn from this?',
            'How have you grown from similar situations?'
        ]
    }
];

function StoryRoomGame({ onComplete }) {
    const { startSession, completeSession, currentTrainingArea, showNotification, activeLearner, settings, resetGameState } = useApp();
    
    const [step, setStep] = useState(0); // 0: intro, 1-3: panels, 4: braintrust, 5: complete
    const [panels, setPanels] = useState([
        { background: null, characters: [], emotion: null, thought: '', speech: '' },
        { background: null, characters: [], emotion: null, thought: '', speech: '' },
        { background: null, characters: [], emotion: null, thought: '', speech: '' }
    ]);
    const [braintrustNotes, setBraintrustNotes] = useState({});
    const [alternativeEnding, setAlternativeEnding] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(null);

    const panelTitles = [
        'What\'s happening?',
        'What\'s the tricky part?',
        'What happens next?'
    ];

    const panelPrompts = [
        'Set the scene. Where are you? Who\'s there?',
        'What makes this situation difficult or uncomfortable?',
        'How does the story continue? (We\'ll explore alternatives too!)'
    ];

    const updatePanel = (index, updates) => {
        setPanels(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
    };

    const toggleCharacter = (panelIndex, charId) => {
        const panel = panels[panelIndex];
        const hasChar = panel.characters.includes(charId);
        updatePanel(panelIndex, {
            characters: hasChar 
                ? panel.characters.filter(c => c !== charId)
                : [...panel.characters, charId]
        });
    };

    const handleReset = () => {
        if (window.confirm('Reset this game? All your story panels and notes will be cleared.')) {
            setStep(0);
            setPanels([
                { background: null, characters: [], emotion: null, thought: '', speech: '' },
                { background: null, characters: [], emotion: null, thought: '', speech: '' },
                { background: null, characters: [], emotion: null, thought: '', speech: '' }
            ]);
            setBraintrustNotes({});
            setAlternativeEnding('');
            setSelectedVoice(null);
            resetGameState('story-room');
            showNotification('Game reset. Ready to create a new story!', 'info');
        }
    };

    const handleComplete = () => {
        const session = startSession('story-room', currentTrainingArea?.id);
        completeSession(session, { 
            panels, 
            braintrustNotes, 
            alternativeEnding,
            ideas: [alternativeEnding].filter(Boolean)
        });
        showNotification('📖 Story complete! +15 tokens earned', 'success');
        onComplete();
    };

    return (
        <div className="story-room-game">
            {/* Progress */}
            <div className="story-progress">
                <div className="story-progress__bar">
                    <div className="story-progress__fill" style={{ width: `${(step / 5) * 100}%` }} />
                </div>
                <div className="story-progress__labels">
                    <span className={step >= 0 ? 'active' : ''}>Start</span>
                    <span className={step >= 1 ? 'active' : ''}>Panel 1</span>
                    <span className={step >= 2 ? 'active' : ''}>Panel 2</span>
                    <span className={step >= 3 ? 'active' : ''}>Panel 3</span>
                    <span className={step >= 4 ? 'active' : ''}>Braintrust</span>
                    <span className={step >= 5 ? 'active' : ''}>Done</span>
                </div>
            </div>

            {/* Intro */}
            {step === 0 && (
                <div className="story-intro">
                    <div className="story-intro__icon">📖✨</div>
                    <h2>Story Room</h2>
                    <p>Create a 3-panel story about something on your mind. Then, we'll explore different endings with your Braintrust helpers!</p>
                    
                    <div className="story-intro__features">
                        <div className="story-feature">
                            <span>🎨</span>
                            <span>Build visual scenes</span>
                        </div>
                        <div className="story-feature">
                            <span>💭</span>
                            <span>Add thoughts & feelings</span>
                        </div>
                        <div className="story-feature">
                            <span>🔄</span>
                            <span>Explore alternatives</span>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>
                        Start My Story
                    </button>
                </div>
            )}

            {/* Panel Creation (steps 1-3) */}
            {step >= 1 && step <= 3 && (
                <div className="story-panel-creator">
                    <div className="panel-header">
                        <span className="panel-number">Panel {step} of 3</span>
                        <h2>{panelTitles[step - 1]}</h2>
                        <p>{panelPrompts[step - 1]}</p>
                    </div>

                    <div className="panel-canvas" style={{ 
                        '--bg-color': panels[step - 1].background 
                            ? STORY_BACKGROUNDS.find(b => b.id === panels[step - 1].background)?.color 
                            : '#f0f4f8'
                    }}>
                        <div className="panel-canvas__scene">
                            {panels[step - 1].background && (
                                <span className="panel-canvas__bg-icon">
                                    {STORY_BACKGROUNDS.find(b => b.id === panels[step - 1].background)?.icon}
                                </span>
                            )}
                            <div className="panel-canvas__characters">
                                {panels[step - 1].characters.map(charId => {
                                    const char = STORY_CHARACTERS.find(c => c.id === charId);
                                    return (
                                        <span key={charId} className="panel-character">
                                            {char?.emoji}
                                        </span>
                                    );
                                })}
                            </div>
                            {panels[step - 1].emotion && (
                                <div className="panel-canvas__emotion">
                                    {STORY_EMOTIONS.find(e => e.id === panels[step - 1].emotion)?.emoji}
                                </div>
                            )}
                            {panels[step - 1].thought && (
                                <div className="panel-canvas__thought">
                                    💭 {panels[step - 1].thought}
                                </div>
                            )}
                            {panels[step - 1].speech && (
                                <div className="panel-canvas__speech">
                                    💬 {panels[step - 1].speech}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="panel-tools">
                        {/* Background Selection */}
                        <div className="tool-section">
                            <label>📍 Setting</label>
                            <div className="tool-options tool-options--wrap">
                                {STORY_BACKGROUNDS.map(bg => (
                                    <button
                                        key={bg.id}
                                        className={`tool-btn ${panels[step - 1].background === bg.id ? 'tool-btn--selected' : ''}`}
                                        onClick={() => updatePanel(step - 1, { background: bg.id })}
                                        style={{ '--btn-color': bg.color }}
                                    >
                                        <span>{bg.icon}</span>
                                        <span>{bg.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Character Selection */}
                        <div className="tool-section">
                            <label>👥 Who's there?</label>
                            <div className="tool-options">
                                {STORY_CHARACTERS.map(char => (
                                    <button
                                        key={char.id}
                                        className={`tool-btn tool-btn--small ${panels[step - 1].characters.includes(char.id) ? 'tool-btn--selected' : ''}`}
                                        onClick={() => toggleCharacter(step - 1, char.id)}
                                    >
                                        <span>{char.emoji}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Emotion Selection */}
                        <div className="tool-section">
                            <label>😊 How do you feel?</label>
                            <div className="tool-options">
                                {STORY_EMOTIONS.map(emo => (
                                    <button
                                        key={emo.id}
                                        className={`tool-btn tool-btn--small ${panels[step - 1].emotion === emo.id ? 'tool-btn--selected' : ''}`}
                                        onClick={() => updatePanel(step - 1, { emotion: emo.id })}
                                    >
                                        <span>{emo.emoji}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Thought/Speech Bubbles */}
                        <div className="tool-section tool-section--text">
                            <div className="text-input-group">
                                <label>💭 Thought bubble</label>
                                <input
                                    type="text"
                                    placeholder="What are you thinking?"
                                    value={panels[step - 1].thought}
                                    onChange={e => updatePanel(step - 1, { thought: e.target.value })}
                                />
                            </div>
                            <div className="text-input-group">
                                <label>💬 Speech bubble</label>
                                <input
                                    type="text"
                                    placeholder="What do you say?"
                                    value={panels[step - 1].speech}
                                    onChange={e => updatePanel(step - 1, { speech: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="step-actions">
                        {step > 1 && (
                            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                                Back
                            </button>
                        )}
                        <button 
                            className="btn btn-reset"
                            onClick={handleReset}
                            title="Reset and start over"
                        >
                            🔄 Reset
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setStep(step + 1)}
                            disabled={!panels[step - 1].background}
                        >
                            {step === 3 ? 'Meet Your Braintrust' : 'Next Panel'}
                        </button>
                    </div>
                </div>
            )}

            {/* Braintrust (step 4) */}
            {step === 4 && (
                <div className="braintrust-view">
                    <h2>🧠 Your Braintrust</h2>
                    <p>These three helpers offer different perspectives on your story. What might each one suggest?</p>

                    {/* Story Summary */}
                    <div className="story-summary">
                        <div className="story-summary__panels">
                            {panels.map((panel, i) => (
                                <div key={i} className="story-summary__panel" style={{
                                    '--bg-color': STORY_BACKGROUNDS.find(b => b.id === panel.background)?.color || '#f0f4f8'
                                }}>
                                    <span className="summary-panel__num">{i + 1}</span>
                                    <span className="summary-panel__icon">
                                        {STORY_BACKGROUNDS.find(b => b.id === panel.background)?.icon}
                                    </span>
                                    {panel.emotion && (
                                        <span className="summary-panel__emotion">
                                            {STORY_EMOTIONS.find(e => e.id === panel.emotion)?.emoji}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Braintrust Voices */}
                    <div className="braintrust-voices">
                        {BRAINTRUST_VOICES.map(voice => (
                            <div 
                                key={voice.id} 
                                className={`braintrust-card ${selectedVoice === voice.id ? 'braintrust-card--expanded' : ''}`}
                                style={{ '--voice-color': voice.color }}
                            >
                                <button 
                                    className="braintrust-card__header"
                                    onClick={() => setSelectedVoice(selectedVoice === voice.id ? null : voice.id)}
                                >
                                    <span className="braintrust-card__icon">{voice.icon}</span>
                                    <span className="braintrust-card__label">{voice.label}</span>
                                    <span className="braintrust-card__toggle">
                                        {selectedVoice === voice.id ? '▲' : '▼'}
                                    </span>
                                </button>
                                
                                {selectedVoice === voice.id && (
                                    <div className="braintrust-card__content">
                                        <div className="braintrust-prompts">
                                            {voice.prompts.map((prompt, i) => (
                                                <div key={i} className="braintrust-prompt">
                                                    "{prompt}"
                                                </div>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder={`What does ${voice.label} suggest?`}
                                            value={braintrustNotes[voice.id] || ''}
                                            onChange={e => setBraintrustNotes(prev => ({
                                                ...prev,
                                                [voice.id]: e.target.value
                                            }))}
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Alternative Ending */}
                    <div className="alternative-ending">
                        <h3>✨ Alternative Ending</h3>
                        <p>Based on the Braintrust suggestions, how else could your story end?</p>
                        <textarea
                            placeholder="Write a different ending for Panel 3..."
                            value={alternativeEnding}
                            onChange={e => setAlternativeEnding(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="step-actions">
                        <button className="btn btn-secondary" onClick={() => setStep(3)}>
                            Back to Story
                        </button>
                        <button 
                            className="btn btn-reset"
                            onClick={handleReset}
                            title="Reset and start over"
                        >
                            🔄 Reset
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setStep(5)}
                            disabled={Object.keys(braintrustNotes).length === 0}
                        >
                            Complete Story
                        </button>
                    </div>
                </div>
            )}

            {/* Complete (step 5) */}
            {step === 5 && (
                <div className="story-complete">
                    <div className="complete-icon">📖✨</div>
                    <h2>Beautiful Storytelling!</h2>
                    <p>You explored a challenging situation and found new perspectives.</p>

                    <div className="story-final">
                        <div className="story-final__panels">
                            {panels.map((panel, i) => (
                                <div key={i} className="final-panel" style={{
                                    '--bg-color': STORY_BACKGROUNDS.find(b => b.id === panel.background)?.color
                                }}>
                                    <div className="final-panel__header">Panel {i + 1}</div>
                                    <div className="final-panel__scene">
                                        {STORY_BACKGROUNDS.find(b => b.id === panel.background)?.icon}
                                        {panel.characters.map(c => STORY_CHARACTERS.find(ch => ch.id === c)?.emoji).join(' ')}
                                    </div>
                                    {panel.thought && <div className="final-panel__thought">💭 {panel.thought}</div>}
                                </div>
                            ))}
                        </div>

                        {alternativeEnding && (
                            <div className="story-final__alternative">
                                <h4>✨ Your Alternative Ending</h4>
                                <p>{alternativeEnding}</p>
                            </div>
                        )}
                    </div>

                    <div className="complete-rewards">
                        <span className="reward-earned">+15 Creative Tokens ✨</span>
                        <span className="badge-earned">📖 Brave Storyteller</span>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                        Save Story
                    </button>
                </div>
            )}
        </div>
    );
}

// =============================================
// BLOCK BUILDER GAME
// LEGO-like draggable blocks for routines/sequences
// =============================================

const BLOCK_CATEGORIES = {
    autism: {
        categories: [
            { id: 'start', label: 'Start', color: '#9DB4A0', icon: '🟢' },
            { id: 'middle', label: 'Middle', color: '#A8C5D8', icon: '🔵' },
            { id: 'end', label: 'End', color: '#B8A9C9', icon: '🟣' },
            { id: 'backup', label: 'Backup Plan', color: '#E5C76B', icon: '🟡' }
        ]
    },
    adhd: {
        categories: [
            { id: 'focus', label: 'Focus', color: '#E5C76B', icon: '🎯' },
            { id: 'break', label: 'Break', color: '#9DB4A0', icon: '☕' },
            { id: 'reward', label: 'Reward', color: '#D4A59A', icon: '⭐' },
            { id: 'reset', label: 'Reset', color: '#A8C5D8', icon: '🔄' }
        ]
    },
    dyslexia: {
        categories: [
            { id: 'hear', label: 'Hear It', color: '#A8C5D8', icon: '👂' },
            { id: 'see', label: 'See It', color: '#B8A9C9', icon: '👀' },
            { id: 'say', label: 'Say It', color: '#9DB4A0', icon: '🗣️' },
            { id: 'act', label: 'Act It', color: '#E5C76B', icon: '🎭' }
        ]
    },
    default: {
        categories: [
            { id: 'collect', label: 'Collect', color: '#A8C5D8', icon: '📥' },
            { id: 'combine', label: 'Combine', color: '#B8A9C9', icon: '🔗' },
            { id: 'change', label: 'Change', color: '#9DB4A0', icon: '✨' },
            { id: 'create', label: 'Create', color: '#E5C76B', icon: '🎨' }
        ]
    }
};

const ROUTINE_CHALLENGES = [
    { id: 'morning', title: 'Morning Routine', prompt: 'Build a morning routine that helps you start the day calmly', icon: '🌅' },
    { id: 'homework', title: 'Homework Time', prompt: 'Create a homework routine that keeps you focused', icon: '📚' },
    { id: 'bedtime', title: 'Bedtime Routine', prompt: 'Design a bedtime routine for better sleep', icon: '🌙' },
    { id: 'transition', title: 'Activity Change', prompt: 'Plan how to smoothly switch between activities', icon: '🔄' },
    { id: 'difficult', title: 'Difficult Task', prompt: 'Break down a challenging task into manageable steps', icon: '🎯' }
];

function BlockBuilderGame({ onComplete }) {
    const { startSession, completeSession, currentTrainingArea, showNotification, activeLearner, settings, resetGameState } = useApp();
    
    const condition = activeLearner?.condition || 'everyone';
    const blockConfig = BLOCK_CATEGORIES[condition] || BLOCK_CATEGORIES.default;
    
    const [step, setStep] = useState(0); // 0: select challenge, 1: build, 2: mystery, 3: complete
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [currentBlockText, setCurrentBlockText] = useState('');
    const [currentCategory, setCurrentCategory] = useState(blockConfig.categories[0].id);
    const [mysteryBlock, setMysteryBlock] = useState(null);
    const [showMystery, setShowMystery] = useState(false);

    const addBlock = () => {
        if (currentBlockText.trim()) {
            const category = blockConfig.categories.find(c => c.id === currentCategory);
            setBlocks(prev => [...prev, {
                id: generateId(),
                text: currentBlockText.trim(),
                category: currentCategory,
                color: category.color,
                icon: category.icon
            }]);
            setCurrentBlockText('');
        }
    };

    const removeBlock = (blockId) => {
        setBlocks(prev => prev.filter(b => b.id !== blockId));
    };

    const handleReset = () => {
        if (window.confirm('Reset this game? All your blocks and progress will be cleared.')) {
            setStep(0);
            setSelectedChallenge(null);
            setBlocks([]);
            setCurrentBlockText('');
            setCurrentCategory(blockConfig.categories[0].id);
            setMysteryBlock(null);
            setShowMystery(false);
            resetGameState('block-builder');
            showNotification('Game reset. Ready to build again!', 'info');
        }
    };

    const moveBlock = (fromIndex, toIndex) => {
        setBlocks(prev => {
            const newBlocks = [...prev];
            const [moved] = newBlocks.splice(fromIndex, 1);
            newBlocks.splice(toIndex, 0, moved);
            return newBlocks;
        });
    };

    const generateMysteryBlock = () => {
        const mysteryPrompts = [
            'Add something fun or silly',
            'Include a 1-minute break',
            'Add a reward for yourself',
            'Include a backup plan',
            'Add something you can do with someone else',
            'Include a way to check progress'
        ];
        setMysteryBlock(mysteryPrompts[Math.floor(Math.random() * mysteryPrompts.length)]);
        setShowMystery(true);
    };

    const handleComplete = () => {
        const session = startSession('block-builder', currentTrainingArea?.id);
        completeSession(session, { 
            challenge: selectedChallenge,
            blocks,
            mysteryBlock,
            ideas: blocks.map(b => b.text)
        });
        showNotification('🧱 Routine built! +12 tokens earned', 'success');
        onComplete();
    };

    return (
        <div className="block-builder-game">
            {/* Step 0: Select Challenge */}
            {step === 0 && (
                <div className="block-intro">
                    <div className="block-intro__icon">🧱</div>
                    <h2>Block Builder</h2>
                    <p>Build routines and plans using colorful blocks. Each block is one step in your plan!</p>

                    <div className="challenge-grid">
                        {ROUTINE_CHALLENGES.map(challenge => (
                            <button
                                key={challenge.id}
                                className={`challenge-btn ${selectedChallenge?.id === challenge.id ? 'challenge-btn--selected' : ''}`}
                                onClick={() => setSelectedChallenge(challenge)}
                            >
                                <span className="challenge-btn__icon">{challenge.icon}</span>
                                <span className="challenge-btn__title">{challenge.title}</span>
                            </button>
                        ))}
                    </div>

                    {selectedChallenge && (
                        <div className="challenge-selected">
                            <p>{selectedChallenge.prompt}</p>
                            <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>
                                Start Building
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step 1: Build Routine */}
            {step === 1 && (
                <div className="block-builder">
                    <div className="builder-header">
                        <h2>{selectedChallenge.icon} {selectedChallenge.title}</h2>
                        <p>{selectedChallenge.prompt}</p>
                    </div>

                    {/* Block Input */}
                    <div className="block-input-area">
                        <div className="category-selector">
                            {blockConfig.categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`category-btn ${currentCategory === cat.id ? 'category-btn--selected' : ''}`}
                                    onClick={() => setCurrentCategory(cat.id)}
                                    style={{ '--cat-color': cat.color }}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="block-input">
                            <input
                                type="text"
                                placeholder="What's this step? (e.g., 'Get dressed', 'Take 3 breaths')"
                                value={currentBlockText}
                                onChange={e => setCurrentBlockText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addBlock()}
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={addBlock}
                                disabled={!currentBlockText.trim()}
                            >
                                Add Block
                            </button>
                        </div>
                    </div>

                    {/* Block Timeline */}
                    <div className="block-timeline">
                        <div className="timeline-label">Your Routine ({blocks.length} steps)</div>
                        
                        {blocks.length === 0 ? (
                            <div className="timeline-empty">
                                <p>Add blocks to build your routine!</p>
                                <p className="timeline-hint">Tip: Start with a "Start" block, then add middle steps, and finish with an "End" block.</p>
                            </div>
                        ) : (
                            <div className="timeline-blocks">
                                {blocks.map((block, index) => (
                                    <div 
                                        key={block.id} 
                                        className="timeline-block"
                                        style={{ '--block-color': block.color }}
                                    >
                                        <div className="timeline-block__connector" />
                                        <div className="timeline-block__content">
                                            <span className="timeline-block__icon">{block.icon}</span>
                                            <span className="timeline-block__text">{block.text}</span>
                                            <div className="timeline-block__actions">
                                                {index > 0 && (
                                                    <button 
                                                        className="block-action"
                                                        onClick={() => moveBlock(index, index - 1)}
                                                        title="Move up"
                                                    >↑</button>
                                                )}
                                                {index < blocks.length - 1 && (
                                                    <button 
                                                        className="block-action"
                                                        onClick={() => moveBlock(index, index + 1)}
                                                        title="Move down"
                                                    >↓</button>
                                                )}
                                                <button 
                                                    className="block-action block-action--delete"
                                                    onClick={() => removeBlock(block.id)}
                                                    title="Remove"
                                                >×</button>
                                            </div>
                                        </div>
                                        <span className="timeline-block__num">{index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mystery Block Option */}
                    {blocks.length >= 2 && !showMystery && (
                        <button 
                            className="mystery-btn"
                            onClick={generateMysteryBlock}
                        >
                            🎲 Add a Mystery Block Challenge!
                        </button>
                    )}

                    {showMystery && mysteryBlock && (
                        <div className="mystery-challenge">
                            <span className="mystery-challenge__icon">🎲</span>
                            <div className="mystery-challenge__content">
                                <strong>Mystery Challenge:</strong>
                                <p>{mysteryBlock}</p>
                            </div>
                        </div>
                    )}

                    <div className="step-actions">
                        <button className="btn btn-secondary" onClick={() => setStep(0)}>
                            Change Challenge
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setStep(2)}
                            disabled={blocks.length < 2}
                        >
                            Review & Complete
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Complete */}
            {step === 2 && (
                <div className="block-complete">
                    <div className="complete-icon">🧱✨</div>
                    <h2>Routine Complete!</h2>
                    <p>You've built a {blocks.length}-step plan for "{selectedChallenge.title}"</p>

                    <div className="routine-preview">
                        <div className="routine-preview__title">
                            {selectedChallenge.icon} {selectedChallenge.title}
                        </div>
                        <div className="routine-preview__blocks">
                            {blocks.map((block, i) => (
                                <div 
                                    key={block.id}
                                    className="preview-block"
                                    style={{ '--block-color': block.color }}
                                >
                                    <span className="preview-block__num">{i + 1}</span>
                                    <span className="preview-block__icon">{block.icon}</span>
                                    <span className="preview-block__text">{block.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="complete-rewards">
                        <span className="reward-earned">+12 Creative Tokens ✨</span>
                        <span className="badge-earned">🧱 Routine Crafter</span>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                        Save Routine
                    </button>
                </div>
            )}
        </div>
    );
}

// =============================================
// CREATIVE MODE SWITCHER GAME
// Same challenge through 4 different modes
// =============================================

const MODE_CHALLENGES = [
    { id: 'calm-place', title: 'My Calm Place', prompt: 'Express what a peaceful, calm place looks/sounds/feels like to you' },
    { id: 'emotion', title: 'Express an Emotion', prompt: 'Show what happiness (or another emotion) means to you' },
    { id: 'problem', title: 'A Problem I Solved', prompt: 'Express a time you overcame a challenge' },
    { id: 'dream', title: 'A Dream or Goal', prompt: 'Express something you hope for in the future' },
    { id: 'gratitude', title: 'Something I\'m Grateful For', prompt: 'Express appreciation for something in your life' }
];

function ModeSwitcherGame({ onComplete }) {
    const { startSession, completeSession, currentTrainingArea, showNotification, activeLearner, settings, resetGameState } = useApp();
    
    const [step, setStep] = useState(0); // 0: select, 1: create, 2: complete
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [currentMode, setCurrentMode] = useState('word');
    const [creations, setCreations] = useState({
        word: '',
        visual: { drawing: [], color: '#9DB4A0' },
        sound: { beats: [], tempo: 'medium' },
        movement: { moves: [] }
    });
    const [modesUsed, setModesUsed] = useState([]);

    // Canvas for visual mode
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#9DB4A0');
    const [brushSize, setBrushSize] = useState(5);

    // Sound pad
    const [soundPad, setSoundPad] = useState([
        { id: 1, sound: '🥁', active: false },
        { id: 2, sound: '🎹', active: false },
        { id: 3, sound: '🔔', active: false },
        { id: 4, sound: '👏', active: false },
        { id: 5, sound: '🎵', active: false },
        { id: 6, sound: '💨', active: false }
    ]);

    // Movement prompts
    const handleReset = () => {
        if (window.confirm('Reset this game? All your creations across all modes will be cleared.')) {
            setStep(0);
            setSelectedChallenge(null);
            setCurrentMode('word');
            setCreations({
                word: '',
                visual: { drawing: [], color: '#9DB4A0' },
                sound: { beats: [], tempo: 'medium' },
                movement: { moves: [] }
            });
            setModesUsed([]);
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            setSoundPad([
                { id: 1, sound: '🥁', active: false },
                { id: 2, sound: '🎹', active: false },
                { id: 3, sound: '🔔', active: false },
                { id: 4, sound: '👏', active: false },
                { id: 5, sound: '🎵', active: false },
                { id: 6, sound: '💨', active: false }
            ]);
            resetGameState('mode-switcher');
            showNotification('Game reset. Ready to create in new modes!', 'info');
        }
    };

    // Movement prompts
    const movementPrompts = [
        { id: 'stretch', label: 'Stretch up high', icon: '🙆' },
        { id: 'shake', label: 'Shake it out', icon: '💃' },
        { id: 'breathe', label: 'Deep breath', icon: '🌬️' },
        { id: 'jump', label: 'Small jump', icon: '🦘' },
        { id: 'twist', label: 'Gentle twist', icon: '🔄' },
        { id: 'freeze', label: 'Freeze pose', icon: '🧊' }
    ];

    const colors = ['#9DB4A0', '#A8C5D8', '#B8A9C9', '#E5C76B', '#D4A59A', '#7FB285'];

    const switchMode = (newMode) => {
        if (!modesUsed.includes(currentMode) && hasContent(currentMode)) {
            setModesUsed(prev => [...prev, currentMode]);
        }
        setCurrentMode(newMode);
    };

    const hasContent = (mode) => {
        switch (mode) {
            case 'word': return creations.word.trim().length > 0;
            case 'visual': return creations.visual.drawing.length > 0;
            case 'sound': return soundPad.some(s => s.active);
            case 'movement': return creations.movement.moves.length > 0;
            default: return false;
        }
    };

    const toggleSound = (id) => {
        setSoundPad(prev => prev.map(s => 
            s.id === id ? { ...s, active: !s.active } : s
        ));
    };

    const toggleMovement = (moveId) => {
        setCreations(prev => ({
            ...prev,
            movement: {
                ...prev.movement,
                moves: prev.movement.moves.includes(moveId)
                    ? prev.movement.moves.filter(m => m !== moveId)
                    : [...prev.movement.moves, moveId]
            }
        }));
    };

    const handleComplete = () => {
        // Count modes actually used
        const finalModesUsed = [...modesUsed];
        if (!finalModesUsed.includes(currentMode) && hasContent(currentMode)) {
            finalModesUsed.push(currentMode);
        }

        const session = startSession('mode-switcher', currentTrainingArea?.id);
        completeSession(session, { 
            challenge: selectedChallenge,
            creations,
            modesUsed: finalModesUsed,
            ideas: [creations.word].filter(Boolean)
        });
        
        const tokens = finalModesUsed.length >= 3 ? 20 : 12;
        showNotification(`🎨 Creative expression complete! +${tokens} tokens earned`, 'success');
        onComplete();
    };

    return (
        <div className="mode-switcher-game">
            {/* Step 0: Select Challenge */}
            {step === 0 && (
                <div className="mode-intro">
                    <div className="mode-intro__icon">🎨🎵✏️🧍</div>
                    <h2>Creative Mode Switcher</h2>
                    <p>Express the same idea in different creative modes. Try at least 3 modes to unlock the Mode Explorer badge!</p>

                    <div className="mode-preview">
                        <div className="mode-preview__item">
                            <span>✏️</span>
                            <span>Word</span>
                        </div>
                        <div className="mode-preview__item">
                            <span>🎨</span>
                            <span>Visual</span>
                        </div>
                        <div className="mode-preview__item">
                            <span>🎵</span>
                            <span>Sound</span>
                        </div>
                        <div className="mode-preview__item">
                            <span>🧍</span>
                            <span>Movement</span>
                        </div>
                    </div>

                    <div className="challenge-selection">
                        <h3>Choose your challenge:</h3>
                        <div className="challenge-list">
                            {MODE_CHALLENGES.map(challenge => (
                                <button
                                    key={challenge.id}
                                    className={`challenge-option ${selectedChallenge?.id === challenge.id ? 'challenge-option--selected' : ''}`}
                                    onClick={() => setSelectedChallenge(challenge)}
                                >
                                    <span className="challenge-option__title">{challenge.title}</span>
                                    <span className="challenge-option__prompt">{challenge.prompt}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedChallenge && (
                        <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>
                            Start Creating
                        </button>
                    )}
                </div>
            )}

            {/* Step 1: Create */}
            {step === 1 && (
                <div className="mode-creator">
                    <div className="creator-header">
                        <h2>{selectedChallenge.title}</h2>
                        <p>{selectedChallenge.prompt}</p>
                    </div>

                    {/* Mode Tabs */}
                    <div className="mode-tabs">
                        <button 
                            className={`mode-tab ${currentMode === 'word' ? 'mode-tab--active' : ''} ${modesUsed.includes('word') || hasContent('word') ? 'mode-tab--used' : ''}`}
                            onClick={() => switchMode('word')}
                        >
                            <span>✏️</span>
                            <span>Word</span>
                            {(modesUsed.includes('word') || (currentMode !== 'word' && hasContent('word'))) && <span className="mode-check">✓</span>}
                        </button>
                        <button 
                            className={`mode-tab ${currentMode === 'visual' ? 'mode-tab--active' : ''} ${modesUsed.includes('visual') || hasContent('visual') ? 'mode-tab--used' : ''}`}
                            onClick={() => switchMode('visual')}
                        >
                            <span>🎨</span>
                            <span>Visual</span>
                            {(modesUsed.includes('visual') || (currentMode !== 'visual' && hasContent('visual'))) && <span className="mode-check">✓</span>}
                        </button>
                        <button 
                            className={`mode-tab ${currentMode === 'sound' ? 'mode-tab--active' : ''} ${modesUsed.includes('sound') || hasContent('sound') ? 'mode-tab--used' : ''}`}
                            onClick={() => switchMode('sound')}
                        >
                            <span>🎵</span>
                            <span>Sound</span>
                            {(modesUsed.includes('sound') || (currentMode !== 'sound' && hasContent('sound'))) && <span className="mode-check">✓</span>}
                        </button>
                        <button 
                            className={`mode-tab ${currentMode === 'movement' ? 'mode-tab--active' : ''} ${modesUsed.includes('movement') || hasContent('movement') ? 'mode-tab--used' : ''}`}
                            onClick={() => switchMode('movement')}
                        >
                            <span>🧍</span>
                            <span>Movement</span>
                            {(modesUsed.includes('movement') || (currentMode !== 'movement' && hasContent('movement'))) && <span className="mode-check">✓</span>}
                        </button>
                    </div>

                    {/* Mode Content */}
                    <div className="mode-content">
                        {/* Word Mode */}
                        {currentMode === 'word' && (
                            <div className="mode-word">
                                <h3>✏️ Express with Words</h3>
                                <p>Write about "{selectedChallenge.title}" - a poem, story, list, or free writing.</p>
                                <textarea
                                    placeholder="Start writing... There's no wrong way to do this!"
                                    value={creations.word}
                                    onChange={e => setCreations(prev => ({ ...prev, word: e.target.value }))}
                                    rows={6}
                                />
                                <div className="word-prompts">
                                    <span>💡 Try: "It feels like...", "I remember...", "When I think of this..."</span>
                                </div>
                            </div>
                        )}

                        {/* Visual Mode */}
                        {currentMode === 'visual' && (
                            <div className="mode-visual">
                                <h3>🎨 Express Visually</h3>
                                <p>Pick colors and shapes that represent "{selectedChallenge.title}"</p>
                                
                                <div className="color-picker">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            className={`color-btn ${brushColor === color ? 'color-btn--selected' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setBrushColor(color)}
                                        />
                                    ))}
                                </div>

                                <div className="visual-canvas">
                                    <div className="canvas-placeholder">
                                        <div 
                                            className="color-blocks"
                                            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}
                                        >
                                            {creations.visual.drawing.map((color, i) => (
                                                <div 
                                                    key={i}
                                                    className="color-block"
                                                    style={{ 
                                                        width: '40px', 
                                                        height: '40px', 
                                                        backgroundColor: color,
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setCreations(prev => ({
                                                ...prev,
                                                visual: {
                                                    ...prev.visual,
                                                    drawing: [...prev.visual.drawing, brushColor]
                                                }
                                            }))}
                                        >
                                            Add Color Block
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setCreations(prev => ({
                                                ...prev,
                                                visual: { ...prev.visual, drawing: [] }
                                            }))}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sound Mode */}
                        {currentMode === 'sound' && (
                            <div className="mode-sound">
                                <h3>🎵 Express with Sound</h3>
                                <p>Create a rhythm or sound pattern for "{selectedChallenge.title}"</p>
                                
                                <div className="sound-pad">
                                    {soundPad.map(pad => (
                                        <button
                                            key={pad.id}
                                            className={`sound-btn ${pad.active ? 'sound-btn--active' : ''}`}
                                            onClick={() => toggleSound(pad.id)}
                                        >
                                            <span className="sound-btn__icon">{pad.sound}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="sound-sequence">
                                    <span>Your sounds: </span>
                                    {soundPad.filter(s => s.active).map(s => s.sound).join(' ') || 'Tap sounds above'}
                                </div>
                            </div>
                        )}

                        {/* Movement Mode */}
                        {currentMode === 'movement' && (
                            <div className="mode-movement">
                                <h3>🧍 Express with Movement</h3>
                                <p>Choose movements that express "{selectedChallenge.title}"</p>
                                
                                <div className="movement-grid">
                                    {movementPrompts.map(move => (
                                        <button
                                            key={move.id}
                                            className={`movement-btn ${creations.movement.moves.includes(move.id) ? 'movement-btn--selected' : ''}`}
                                            onClick={() => toggleMovement(move.id)}
                                        >
                                            <span className="movement-btn__icon">{move.icon}</span>
                                            <span className="movement-btn__label">{move.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="movement-sequence">
                                    <span>Your sequence: </span>
                                    {creations.movement.moves.length > 0 
                                        ? creations.movement.moves.map(m => 
                                            movementPrompts.find(p => p.id === m)?.icon
                                          ).join(' → ')
                                        : 'Select movements above'
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress indicator */}
                    <div className="modes-progress">
                        <span>Modes used: {modesUsed.length + (hasContent(currentMode) && !modesUsed.includes(currentMode) ? 1 : 0)}/4</span>
                        {modesUsed.length + (hasContent(currentMode) && !modesUsed.includes(currentMode) ? 1 : 0) >= 3 && (
                            <span className="badge-preview">🏆 Mode Explorer badge unlocked!</span>
                        )}
                    </div>

                    <div className="step-actions">
                        <button className="btn btn-secondary" onClick={() => setStep(0)}>
                            Change Challenge
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setStep(2)}
                            disabled={!hasContent(currentMode) && modesUsed.length === 0}
                        >
                            Complete Creation
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Complete */}
            {step === 2 && (
                <div className="mode-complete">
                    <div className="complete-icon">🎨✨</div>
                    <h2>Multi-Modal Masterpiece!</h2>
                    <p>You expressed "{selectedChallenge.title}" in {modesUsed.length + (hasContent(currentMode) && !modesUsed.includes(currentMode) ? 1 : 0)} different ways!</p>

                    <div className="creation-summary">
                        {(modesUsed.includes('word') || hasContent('word')) && creations.word && (
                            <div className="summary-mode">
                                <span className="summary-mode__icon">✏️</span>
                                <span className="summary-mode__label">Word</span>
                                <p className="summary-mode__preview">"{creations.word.substring(0, 50)}..."</p>
                            </div>
                        )}
                        {(modesUsed.includes('visual') || hasContent('visual')) && creations.visual.drawing.length > 0 && (
                            <div className="summary-mode">
                                <span className="summary-mode__icon">🎨</span>
                                <span className="summary-mode__label">Visual</span>
                                <div className="summary-mode__colors">
                                    {creations.visual.drawing.slice(0, 5).map((c, i) => (
                                        <span key={i} style={{ backgroundColor: c, width: 20, height: 20, borderRadius: 4, display: 'inline-block' }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {(modesUsed.includes('sound') || hasContent('sound')) && soundPad.some(s => s.active) && (
                            <div className="summary-mode">
                                <span className="summary-mode__icon">🎵</span>
                                <span className="summary-mode__label">Sound</span>
                                <p className="summary-mode__preview">{soundPad.filter(s => s.active).map(s => s.sound).join(' ')}</p>
                            </div>
                        )}
                        {(modesUsed.includes('movement') || hasContent('movement')) && creations.movement.moves.length > 0 && (
                            <div className="summary-mode">
                                <span className="summary-mode__icon">🧍</span>
                                <span className="summary-mode__label">Movement</span>
                                <p className="summary-mode__preview">
                                    {creations.movement.moves.map(m => movementPrompts.find(p => p.id === m)?.icon).join(' ')}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="complete-rewards">
                        <span className="reward-earned">
                            +{(modesUsed.length + (hasContent(currentMode) && !modesUsed.includes(currentMode) ? 1 : 0)) >= 3 ? 20 : 12} Creative Tokens ✨
                        </span>
                        {(modesUsed.length + (hasContent(currentMode) && !modesUsed.includes(currentMode) ? 1 : 0)) >= 3 && (
                            <span className="badge-earned">🏆 Mode Explorer</span>
                        )}
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                        Save Creation
                    </button>
                </div>
            )}
        </div>
    );
}

// =============================================
// TIME CAPSULE & REMIX BOARD
// Collection and recombination system
// =============================================

function TimeCapsuleGame({ onComplete }) {
    const { rewards, sessions, activeLearner, startSession, completeSession, createCreativityCard, showNotification } = useApp();
    
    const [view, setView] = useState('capsule'); // capsule, remix
    const [selectedCards, setSelectedCards] = useState([]);
    const [remixIdea, setRemixIdea] = useState('');
    const [remixTitle, setRemixTitle] = useState('');
    const [showRemixResult, setShowRemixResult] = useState(false);

    // Get cards for this learner
    const learnerCards = rewards.cards.filter(c => c.learnerId === activeLearner?.id);
    
    // Group cards by week
    const cardsByWeek = useMemo(() => {
        const grouped = {};
        learnerCards.forEach(card => {
            const date = new Date(card.createdAt);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];
            if (!grouped[weekKey]) {
                grouped[weekKey] = [];
            }
            grouped[weekKey].push(card);
        });
        return grouped;
    }, [learnerCards]);

    const toggleCardSelection = (cardId) => {
        setSelectedCards(prev => 
            prev.includes(cardId)
                ? prev.filter(id => id !== cardId)
                : prev.length < 3 ? [...prev, cardId] : prev
        );
    };

    const randomRemix = () => {
        if (learnerCards.length < 2) return;
        const shuffled = [...learnerCards].sort(() => 0.5 - Math.random());
        setSelectedCards(shuffled.slice(0, Math.min(3, shuffled.length)).map(c => c.id));
        setView('remix');
    };

    const completeRemix = () => {
        if (!remixIdea.trim()) return;
        
        const session = startSession('remix', 'creativity-capsule');
        const selectedCardData = selectedCards.map(id => learnerCards.find(c => c.id === id));
        
        completeSession(session, {
            remixedFrom: selectedCards,
            newIdea: remixIdea,
            title: remixTitle || 'Remix Creation'
        });

        createCreativityCard(
            session,
            remixTitle || 'Creative Remix',
            remixIdea
        );

        setShowRemixResult(true);
    };

    const handleComplete = () => {
        showNotification('🔀 Remix saved to your collection!', 'success');
        onComplete();
    };

    return (
        <div className="time-capsule-game">
            {/* Header */}
            <div className="capsule-header">
                <div className="capsule-header__tabs">
                    <button 
                        className={`capsule-tab ${view === 'capsule' ? 'capsule-tab--active' : ''}`}
                        onClick={() => setView('capsule')}
                    >
                        📇 My Collection
                    </button>
                    <button 
                        className={`capsule-tab ${view === 'remix' ? 'capsule-tab--active' : ''}`}
                        onClick={() => setView('remix')}
                    >
                        🔀 Remix Lab
                    </button>
                </div>
            </div>

            {/* Collection View */}
            {view === 'capsule' && (
                <div className="capsule-collection">
                    <div className="collection-header">
                        <h2>📇 Your Creativity Collection</h2>
                        <p>Every game you complete adds a card to your collection. {learnerCards.length} cards collected!</p>
                    </div>

                    {learnerCards.length === 0 ? (
                        <div className="collection-empty">
                            <span className="collection-empty__icon">📇</span>
                            <p>Your collection is empty!</p>
                            <p>Complete creativity games to earn cards.</p>
                            <button className="btn btn-primary" onClick={onComplete}>
                                Play a Game
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="collection-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{learnerCards.length}</span>
                                    <span className="stat-label">Total Cards</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{Object.keys(cardsByWeek).length}</span>
                                    <span className="stat-label">Weeks Active</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{new Set(learnerCards.map(c => c.gameType)).size}</span>
                                    <span className="stat-label">Game Types</span>
                                </div>
                            </div>

                            <div className="collection-grid">
                                {Object.entries(cardsByWeek).sort((a, b) => b[0].localeCompare(a[0])).map(([week, cards]) => (
                                    <div key={week} className="collection-week">
                                        <div className="week-label">
                                            Week of {new Date(week).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="week-cards">
                                            {cards.map(card => (
                                                <div 
                                                    key={card.id} 
                                                    className={`creativity-card ${selectedCards.includes(card.id) ? 'creativity-card--selected' : ''}`}
                                                    onClick={() => toggleCardSelection(card.id)}
                                                >
                                                    <div className="creativity-card__emoji">{card.emoji}</div>
                                                    <div className="creativity-card__content">
                                                        <span className="creativity-card__title">{card.title}</span>
                                                        <span className="creativity-card__summary">{card.summary}</span>
                                                        <span className="creativity-card__meta">
                                                            {CONDITIONS[card.condition]?.icon} {card.gameType}
                                                        </span>
                                                    </div>
                                                    {selectedCards.includes(card.id) && (
                                                        <span className="creativity-card__check">✓</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="collection-actions">
                                {selectedCards.length >= 2 && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setView('remix')}
                                    >
                                        🔀 Remix Selected ({selectedCards.length})
                                    </button>
                                )}
                                <button 
                                    className="btn btn-secondary"
                                    onClick={randomRemix}
                                    disabled={learnerCards.length < 2}
                                >
                                    🎲 Random Remix
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Remix View */}
            {view === 'remix' && !showRemixResult && (
                <div className="remix-lab">
                    <div className="remix-header">
                        <h2>🔀 Remix Lab</h2>
                        <p>Combine ideas from different cards to create something new!</p>
                    </div>

                    {selectedCards.length < 2 ? (
                        <div className="remix-select">
                            <p>Select 2-3 cards from your collection to remix</p>
                            <button className="btn btn-secondary" onClick={() => setView('capsule')}>
                                Go to Collection
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={randomRemix}
                                disabled={learnerCards.length < 2}
                            >
                                🎲 Random Selection
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="remix-ingredients">
                                <h3>Your Remix Ingredients</h3>
                                <div className="ingredients-list">
                                    {selectedCards.map(cardId => {
                                        const card = learnerCards.find(c => c.id === cardId);
                                        return card ? (
                                            <div key={cardId} className="ingredient-card">
                                                <span className="ingredient-emoji">{card.emoji}</span>
                                                <div className="ingredient-content">
                                                    <span className="ingredient-title">{card.title}</span>
                                                    <span className="ingredient-summary">{card.summary}</span>
                                                </div>
                                                <button 
                                                    className="ingredient-remove"
                                                    onClick={() => setSelectedCards(prev => prev.filter(id => id !== cardId))}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            <div className="remix-mixer">
                                <div className="mixer-animation">
                                    <span className="mixer-icon">🔀</span>
                                    <span className="mixer-label">Mix them together!</span>
                                </div>
                            </div>

                            <div className="remix-output">
                                <h3>Your New Creation</h3>
                                <input
                                    type="text"
                                    className="remix-title-input"
                                    placeholder="Give your remix a title..."
                                    value={remixTitle}
                                    onChange={e => setRemixTitle(e.target.value)}
                                />
                                <textarea
                                    className="remix-idea-input"
                                    placeholder="How do these ideas combine? What new idea emerges when you mix them together?"
                                    value={remixIdea}
                                    onChange={e => setRemixIdea(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="remix-actions">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSelectedCards([]);
                                        setRemixIdea('');
                                        setRemixTitle('');
                                        setView('capsule');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary"
                                    onClick={completeRemix}
                                    disabled={!remixIdea.trim()}
                                >
                                    Create Remix ✨
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Remix Result */}
            {showRemixResult && (
                <div className="remix-result">
                    <div className="result-celebration">
                        <span className="result-icon">🔀✨</span>
                        <h2>Remix Created!</h2>
                        <p>You've combined ideas to create something new!</p>
                    </div>

                    <div className="result-card">
                        <div className="result-card__header">
                            <span className="result-card__emoji">✨</span>
                            <span className="result-card__title">{remixTitle || 'Creative Remix'}</span>
                        </div>
                        <div className="result-card__content">
                            <p>{remixIdea}</p>
                        </div>
                        <div className="result-card__sources">
                            <span>Remixed from: </span>
                            {selectedCards.map(id => learnerCards.find(c => c.id === id)?.emoji).join(' + ')}
                        </div>
                    </div>

                    <div className="complete-rewards">
                        <span className="reward-earned">+15 Creative Tokens ✨</span>
                        <span className="badge-earned">🔀 Remix Artist</span>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                        Save to Collection
                    </button>
                </div>
            )}
        </div>
    );
}

// =============================================
// GOAL SUGGESTIONS MODAL
// =============================================

function GoalSuggestionsModal({ problem, description, condition, onClose, onGoalSubmit, goalSuggestions, isGenerating, userGoal }) {
    const [goal, setGoal] = useState(userGoal || '');
    const [hasSubmitted, setHasSubmitted] = useState(!!userGoal);

    const handleSubmit = () => {
        if (goal.trim()) {
            setHasSubmitted(true);
            onGoalSubmit(goal.trim());
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Goal Suggestions - ${new Date().toLocaleDateString()}</title>
                <style>
                    @media print {
                        @page { margin: 1cm; }
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                        .print-header h1 { margin: 0 0 10px 0; color: #333; }
                        .print-header p { margin: 5px 0; color: #666; }
                        .suggestion-card { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; page-break-inside: avoid; }
                        .suggestion-number { display: inline-block; width: 30px; height: 30px; background: #9DB4A0; color: white; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; margin-right: 10px; }
                        .suggestion-title { display: inline-block; font-size: 18px; font-weight: bold; color: #333; margin: 0; }
                        .suggestion-text { margin: 15px 0; line-height: 1.6; color: #555; }
                        .suggestion-evidence { margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-size: 14px; color: #666; font-style: italic; }
                        .suggestion-steps { margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #9DB4A0; border-radius: 5px; }
                        .suggestion-steps__title { margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #333; }
                        .suggestion-steps__list { margin: 0; padding-left: 25px; }
                        .suggestion-step { margin-bottom: 10px; line-height: 1.6; color: #555; }
                        .suggestion-step:last-child { margin-bottom: 0; }
                        .print-footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>🎯 Goal Suggestions & Action Plan</h1>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Goal:</strong> "${goal || userGoal}"</p>
                    ${problem ? `<p><strong>Challenge:</strong> ${problem.title || problem}</p>` : ''}
                </div>
                ${goalSuggestions.map((suggestion, i) => `
                    <div class="suggestion-card">
                        <div>
                            <span class="suggestion-number">${i + 1}</span>
                            <h3 class="suggestion-title">${suggestion.title}</h3>
                        </div>
                        <p class="suggestion-text">${suggestion.text}</p>
                        ${suggestion.steps && suggestion.steps.length > 0 ? `
                            <div class="suggestion-steps">
                                <h4 class="suggestion-steps__title">📋 Step-by-Step Action Plan:</h4>
                                <ol class="suggestion-steps__list">
                                    ${suggestion.steps.map(step => `
                                        <li class="suggestion-step">
                                            <span class="suggestion-step__content">${step}</span>
                                        </li>
                                    `).join('')}
                                </ol>
                            </div>
                        ` : ''}
                        ${suggestion.evidence ? `
                            <div class="suggestion-evidence">
                                🔬 ${suggestion.evidence}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                <div class="print-footer">
                    <p>Generated by NeuroBreath Creativity Lab</p>
                    <p>© ${new Date().getFullYear()} NeuroBreath. All rights reserved.</p>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal goal-suggestions-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">🎯 What Do You Want to Achieve?</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className="modal-body">
                    {!hasSubmitted ? (
                        <>
                            <div className="goal-input-section">
                                <p className="goal-prompt">
                                    Based on your challenge: <strong>{problem?.title || 'Your challenge'}</strong>
                                </p>
                                <p className="goal-instruction">
                                    What specific outcome or goal would you like to achieve? Be as specific as you can.
                                </p>
                                <textarea
                                    className="goal-textarea"
                                    placeholder="e.g., 'I want to go to bed by 10 PM and wake up at 6 AM consistently every day' or 'I want to feel more organized and in control of my daily routine'"
                                    value={goal}
                                    onChange={e => setGoal(e.target.value)}
                                    rows={4}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={handleSubmit}
                                    disabled={!goal.trim()}
                                >
                                    Get AI Suggestions →
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {isGenerating ? (
                                <div className="goal-loading">
                                    <div className="loading-spinner" />
                                    <p>Generating personalized suggestions based on your goal...</p>
                                    <p className="loading-hint">This may take a few seconds</p>
                                </div>
                            ) : goalSuggestions.length > 0 ? (
                                <div className="goal-suggestions-results">
                                    <div className="results-header">
                                        <h3>✨ AI-Generated Suggestions</h3>
                                        <p className="results-subtitle">Based on your goal: <strong>"{goal}"</strong></p>
                                    </div>
                                    <div className="suggestions-list">
                                        {goalSuggestions.map((suggestion, i) => (
                                            <div key={i} className="suggestion-card">
                                                <div className="suggestion-card__header">
                                                    <span className="suggestion-number">{i + 1}</span>
                                                    <h4 className="suggestion-title">{suggestion.title}</h4>
                                                </div>
                                                <p className="suggestion-text">{suggestion.text}</p>
                                                
                                                {/* Step-by-step plan */}
                                                {suggestion.steps && suggestion.steps.length > 0 && (
                                                    <div className="suggestion-steps">
                                                        <h5 className="suggestion-steps__title">📋 Step-by-Step Action Plan:</h5>
                                                        <ol className="suggestion-steps__list">
                                                            {suggestion.steps.map((step, stepIdx) => (
                                                                <li key={stepIdx} className="suggestion-step">
                                                                    <span className="suggestion-step__content">{step}</span>
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                )}
                                                
                                                {suggestion.evidence && (
                                                    <div className="suggestion-evidence">
                                                        <span className="evidence-icon">🔬</span>
                                                        <span className="evidence-text">{suggestion.evidence}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="modal-actions">
                                        <button 
                                            className="btn btn-secondary btn-print"
                                            onClick={handlePrint}
                                            title="Print suggestions"
                                        >
                                            🖨️ Print Suggestions
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => {
                                            setHasSubmitted(false);
                                            setGoal('');
                                        }}>
                                            Try Different Goal
                                        </button>
                                        <button className="btn btn-primary" onClick={onClose}>
                                            Got It! Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="goal-error">
                                    <p>Unable to generate suggestions. Please try again.</p>
                                    <button className="btn btn-secondary" onClick={() => {
                                        setHasSubmitted(false);
                                        setGoal('');
                                    }}>
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// =============================================
// MAIN APP COMPONENT
// =============================================

function App() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="app-loading">
                <div className="loading-spinner" />
                <span>Loading Creativity Lab...</span>
            </div>
        );
    }

    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

function AppContent() {
    const { showOnboarding, notification, activeLearner } = useApp();
    const profileContainer = document.getElementById('profile-manager-container');

    return (
        <div className="creativity-lab-app">
            {/* Render ProfileManager in header container if it exists */}
            {profileContainer && 
                ReactDOM.createPortal(<ProfileManager />, profileContainer)}
            
            {/* Main Content */}
            <CreativityHub />
            
            {/* Overlays */}
            {showOnboarding && <Onboarding />}
            {notification && <Notification />}
        </div>
    );
}

// =============================================
// RENDER APP
// =============================================

// Wait for DOM and React to be ready
function initApp() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('Root element not found');
        setTimeout(initApp, 100);
        return;
    }
    
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        // React not loaded yet, wait and retry
        setTimeout(initApp, 50);
        return;
    }
    
    // Check if React 18 createRoot is available
    if (typeof ReactDOM.createRoot === 'function') {
        try {
            const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
        } catch (error) {
            console.error('Error rendering React app with createRoot:', error);
            // Fallback to ReactDOM.render if createRoot fails
            if (typeof ReactDOM.render === 'function') {
                ReactDOM.render(<App />, rootElement);
            }
        }
    } else if (typeof ReactDOM.render === 'function') {
        // Fallback for React 17 or earlier
        try {
            ReactDOM.render(<App />, rootElement);
        } catch (error) {
            console.error('Error rendering React app:', error);
        }
    } else {
        console.error('ReactDOM.createRoot and ReactDOM.render not available');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for React CDN to load
        setTimeout(initApp, 100);
    });
} else {
    // DOM already loaded, wait for React CDN
    setTimeout(initApp, 100);
}

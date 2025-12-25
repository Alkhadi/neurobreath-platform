// =============================================
// NeuroBreath – Autism Condition Hub & Focus Garden
// React Single-Page Application
// =============================================

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// =============================================
// CONSTANTS & CONFIGURATION
// =============================================

const STORAGE_KEY = 'neurobreath_data';

const AUDIENCE_MODES = {
    child: { label: 'Autistic child', value: 'child' },
    young: { label: 'Autistic young person', value: 'young' },
    adult: { label: 'Autistic adult', value: 'adult' },
    everyone: { label: 'Non-autistic / Everyone', value: 'everyone' }
};

const MODE_CONFIG = {
    child: {
        tiers: ['gentle', 'spark'],
        tierLabels: { gentle: 'Gentle', spark: 'Spark' },
        startingSeeds: { gentle: 3, spark: 0 },
        plantsPerTier: 3,
        maxPlots: 3,
        progression: { gentle: { gentle: 1, sparkEvery: 3 }, spark: { xpOnly: true } }
    },
    young: {
        tiers: ['everyday', 'special', 'signature'],
        tierLabels: { everyday: 'Everyday', special: 'Special', signature: 'Signature' },
        startingSeeds: { everyday: 4, special: 0, signature: 0 },
        plantsPerTier: 4,
        maxPlots: 4,
        progression: {
            everyday: { everyday: 0.75, special: 0.25 },
            special: { signature: 0.15, everyday: 0.35, special: 0.50 }
        }
    },
    adult: {
        tiers: ['everyday', 'special', 'signature'],
        tierLabels: { everyday: 'Everyday', special: 'Special', signature: 'Signature' },
        startingSeeds: { everyday: 5, special: 0, signature: 0 },
        plantsPerTier: 5,
        maxPlots: 5,
        progression: {
            everyday: { everyday: 0.70, special: 0.30 },
            special: { signature: 0.20, everyday: 0.40, special: 0.40 },
            signature: { everyday: 0.5 }
        }
    },
    everyone: {
        tiers: ['everyday', 'special', 'signature'],
        tierLabels: { everyday: 'Everyday', special: 'Special', signature: 'Signature' },
        startingSeeds: { everyday: 6, special: 0, signature: 0 },
        plantsPerTier: 6,
        maxPlots: 5,
        progression: {
            everyday: { everyday: 0.60, special: 0.40 },
            special: { signature: 0.20, everyday: 0.30, special: 0.50 }
        }
    }
};

const LAYER_CONFIG = {
    structure: { name: 'Structure', icon: '📋', color: '#9DB4A0' },
    communication: { name: 'Communication', icon: '💬', color: '#A8C5D8' },
    zones: { name: 'Zones', icon: '🌈', color: '#B8A9C9' },
    selfMgmt: { name: 'Self-Management', icon: '🧭', color: '#8B7355' },
    anxiety: { name: 'Anxiety & Coaching', icon: '🦋', color: '#D4A59A' }
};

const ZONES = {
    blue: { name: 'Blue Zone', description: 'Low energy, tired, sad', color: '#7BA3C9' },
    green: { name: 'Green Zone', description: 'Calm, focused, ready to learn', color: '#7FB285' },
    yellow: { name: 'Yellow Zone', description: 'Excited, anxious, frustrated', color: '#E5C76B' },
    red: { name: 'Red Zone', description: 'Very upset, out of control', color: '#D4847C' }
};

const PLANT_TEMPLATES = {
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
};

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
    
    const createLearner = useCallback((profileId, name, audienceMode) => {
        const learnerId = generateId();
        const config = MODE_CONFIG[audienceMode];
        setState(prev => ({
            ...prev,
            learnersByProfile: { ...prev.learnersByProfile, [profileId]: [...(prev.learnersByProfile[profileId] || []), { learnerId, name, audienceMode }] },
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
    
    const contextValue = {
        state, currentProfile, currentLearners, currentLearner, learnerSettings, lowStimMode,
        createProfile, selectProfile, createLearner, selectLearner,
        plantSeed, waterPlant, harvestPlant, weedPlant, toggleLowStim,
        openModal, closeModal, activeModal, modalData
    };
    
    return (
        <AppContext.Provider value={contextValue}>
            <div className={`app-container ${lowStimMode ? 'low-stim-mode' : ''} mode-${currentLearner?.audienceMode || 'everyone'}`}>
                <SiteHeader />
                <main className="main-content">
                    <StickyNav />
                    <AutismConditionHub />
                </main>
                <SiteFooter />
                {activeModal && <ModalContainer />}
            </div>
        </AppContext.Provider>
    );
}

// =============================================
// HEADER & NAVIGATION
// =============================================

function SiteHeader() {
    const { state, currentProfile, currentLearners, currentLearner, selectProfile, selectLearner, learnerSettings, toggleLowStim, openModal } = useApp();
    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="profile-manager">
                    {state.profiles.length > 0 ? (
                        <>
                            <select className="profile-select" value={state.currentProfileId || ''} onChange={(e) => selectProfile(e.target.value)} aria-label="Select profile">
                                <option value="">Select Profile</option>
                                {state.profiles.map(p => <option key={p.profileId} value={p.profileId}>{p.name}</option>)}
                            </select>
                            {currentProfile && currentLearners.length > 0 && (
                                <select className="learner-select" value={state.currentLearnerId || ''} onChange={(e) => selectLearner(e.target.value)} aria-label="Select learner">
                                    <option value="">Select Learner</option>
                                    {currentLearners.map(l => <option key={l.learnerId} value={l.learnerId}>{l.name}</option>)}
                                </select>
                            )}
                            <button className="btn btn-secondary btn-small" onClick={() => openModal('addLearner')} aria-label="Add learner">+ Learner</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={() => openModal('createProfile')}>Get Started</button>
                    )}
                    {currentLearner && (
                        <div className="low-stim-toggle">
                            <span>Low-stim</span>
                            <button className={`toggle-switch ${learnerSettings.lowStimulation ? 'active' : ''}`} onClick={() => toggleLowStim(currentLearner.learnerId)} role="switch" aria-checked={learnerSettings.lowStimulation} aria-label="Toggle low-stimulation mode" />
                        </div>
                    )}
                </div>
                <a href="#" className="logo">
                    <div className="logo-icon">🌱</div>
                    <div>
                        <div className="logo-text">NeuroBreath</div>
                        <div className="logo-tagline">Focus Garden</div>
                    </div>
                </a>
            </div>
        </header>
    );
}

function StickyNav() {
    const sections = [
        { id: 'hub', label: 'Hub' }, { id: 'structure', label: 'Structure' }, { id: 'communication', label: 'Communication' },
        { id: 'zones', label: 'Zones' }, { id: 'selfmgmt', label: 'Self-Management' }, { id: 'anxiety', label: 'Anxiety & Coaching' }
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

function AutismConditionHub() {
    return (
        <div className="autism-condition-hub">
            <HubHero />
            <StructureSection />
            <CommunicationSection />
            <ZonesSection />
            <SelfManagementSection />
            <AnxietyCoachingSection />
        </div>
    );
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
                            <div className="garden-empty-state-icon">🌱</div>
                            <h3>Welcome to NeuroBreath</h3>
                            <p>Create a profile and add a learner to start growing your Focus Garden.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function StructureSection() {
    const { currentLearner } = useApp();
    return (
        <section id="structure" className="section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-icon structure">📋</div>
                    <h2 className="section-title">Structure</h2>
                    <p className="section-description">Build routines, schedules, and predictable patterns that create a calm foundation.</p>
                </div>
                {currentLearner && <FocusGardenPanel learner={currentLearner} layerContext="structure" />}
            </div>
        </section>
    );
}

function CommunicationSection() {
    const { currentLearner } = useApp();
    return (
        <section id="communication" className="section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-icon communication">💬</div>
                    <h2 className="section-title">Communication</h2>
                    <p className="section-description">Practice expressing needs, sharing feelings, and connecting with others.</p>
                </div>
                {currentLearner && <FocusGardenPanel learner={currentLearner} layerContext="communication" />}
            </div>
        </section>
    );
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
    const { currentLearner } = useApp();
    return (
        <section id="selfmgmt" className="section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-icon selfmgmt">🧭</div>
                    <h2 className="section-title">Self-Management</h2>
                    <p className="section-description">Develop planning skills, coping strategies, and independence.</p>
                </div>
                {currentLearner && <FocusGardenPanel learner={currentLearner} layerContext="selfMgmt" />}
            </div>
        </section>
    );
}

function AnxietyCoachingSection() {
    const { currentLearner } = useApp();
    return (
        <section id="anxiety" className="section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-icon anxiety">🦋</div>
                    <h2 className="section-title">Anxiety & Coaching</h2>
                    <p className="section-description">Take brave steps, face fears gently, and build confidence one small win at a time.</p>
                </div>
                {currentLearner && <FocusGardenPanel learner={currentLearner} layerContext="anxiety" />}
            </div>
        </section>
    );
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
                {Object.entries(LAYER_CONFIG).map(([key, cfg]) => <div key={key} className={`mastery-badge ${key}`}><div className="mastery-badge-icon">{cfg.icon}</div><span>{levels.layerMastery[key] || 0}</span></div>)}
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
        
        // Plots
        const plotWidth = Math.min(120, (width - 40) / maxPlots);
        const plotSpacing = (width - (plotWidth * maxPlots)) / (maxPlots + 1);
        const plotY = height * 0.5;
        
        for (let i = 0; i < maxPlots; i++) {
            const plotX = plotSpacing + (plotSpacing + plotWidth) * i;
            ctx.fillStyle = '#9B8365';
            ctx.beginPath(); ctx.ellipse(plotX + plotWidth/2, plotY + 40, plotWidth/2 - 5, 20, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#7B6345';
            ctx.beginPath(); ctx.ellipse(plotX + plotWidth/2, plotY + 35, plotWidth/2 - 10, 15, 0, 0, Math.PI); ctx.fill();
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
    const [audienceMode, setAudienceMode] = useState('child');
    const [profileId, setProfileId] = useState(null);
    
    const handleCreateProfile = (e) => { e.preventDefault(); if (!profileName.trim()) return; const id = createProfile(profileName.trim(), profileType); setProfileId(id); setStep(2); };
    const handleCreateLearner = (e) => { e.preventDefault(); if (!learnerName.trim() || !profileId) return; createLearner(profileId, learnerName.trim(), audienceMode); closeModal(); };
    
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
                        <div className="form-group"><label className="form-label" htmlFor="audience-mode">Who is this garden for?</label><select id="audience-mode" className="form-select" value={audienceMode} onChange={(e) => setAudienceMode(e.target.value)}>{Object.values(AUDIENCE_MODES).map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
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
    const [audienceMode, setAudienceMode] = useState('child');
    const handleSubmit = (e) => { e.preventDefault(); if (!learnerName.trim() || !state.currentProfileId) return; createLearner(state.currentProfileId, learnerName.trim(), audienceMode); closeModal(); };
    return (
        <div className="modal" role="dialog" aria-labelledby="add-learner-title">
            <div className="modal-header"><h2 id="add-learner-title" className="modal-title">Add New Learner</h2><button className="modal-close" onClick={closeModal} aria-label="Close">×</button></div>
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label className="form-label" htmlFor="new-learner-name">Learner Name</label><input id="new-learner-name" type="text" className="form-input" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="e.g., Jordan" required /></div>
                    <div className="form-group"><label className="form-label" htmlFor="new-audience-mode">Who is this garden for?</label><select id="new-audience-mode" className="form-select" value={audienceMode} onChange={(e) => setAudienceMode(e.target.value)}>{Object.values(AUDIENCE_MODES).map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
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
    
    const getTemplates = () => {
        if (layerContext === 'mixed') return Object.entries(PLANT_TEMPLATES).flatMap(([layer, templates]) => templates.map(t => ({ ...t, layer })));
        return (PLANT_TEMPLATES[layerContext] || []).map(t => ({ ...t, layer: layerContext }));
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
            </div>
        </footer>
    );
}

// =============================================
// RENDER APP
// =============================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

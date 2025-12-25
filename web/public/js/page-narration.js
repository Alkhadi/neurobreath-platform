/**
 * Card-Specific Narration TTS System
 * Natural text-to-speech narration for individual cards
 */
(function() {
  'use strict';

  // TTS State
  let synth = window.speechSynthesis;
  let voices = [];
  let maleVoice = null;
  let femaleVoice = null;

  // Active narrations (one per card)
  const activeNarrations = new Map();

  const VoicePrefs = window.NeurobreathVoicePreferences || null;

  function normalizeVoicePreference(value){
    if (value === 'female') return 'female';
    if (value === 'male') return 'male';
    return 'uk-male';
  }

  let sharedVoicePreference = normalizeVoicePreference(
    (VoicePrefs && typeof VoicePrefs.get === 'function' && VoicePrefs.get()) ||
    (VoicePrefs && typeof VoicePrefs.getDefault === 'function' && VoicePrefs.getDefault()) ||
    'uk-male'
  );

  let heroStateRef = null;

  function syncSelectorsWithPreference(value){
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.voice-selector').forEach(select => {
      const hasOption = Array.from(select.options || []).some(opt => opt.value === value);
      if (hasOption && select.value !== value){
        select.value = value;
      }
    });
  }

  function applySharedPreference(value){
    const normalized = normalizeVoicePreference(value);
    sharedVoicePreference = normalized;
    syncSelectorsWithPreference(normalized);
    activeNarrations.forEach(state => { state.selectedVoice = normalized; });
    if (heroStateRef) heroStateRef.selectedVoice = normalized;
  }

  function persistSharedPreference(value){
    if (VoicePrefs && typeof VoicePrefs.set === 'function'){
      VoicePrefs.set(normalizeVoicePreference(value));
    } else {
      applySharedPreference(value);
    }
  }

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(applySharedPreference);
  }

  // Helper: strongly prefer UK English female narration
  function pickEnGbFemale(voicesList){
    const primaryNames = [
      'Google UK English Female', 'Microsoft Hazel', 'Microsoft Sonia', 'Microsoft Libby',
      'Serena', 'Kate', 'Elizabeth', 'Victoria'
    ];
    const maleIndicators = ['male','daniel','george','brian','arthur','allan','alex','david','tom'];
    const femaleIndicators = ['female','hazel','sonia','libby','serena','kate','elizabeth','victoria'];
    const isMaleName = v => maleIndicators.some(m=>v.name.toLowerCase().includes(m));
    const isFemaleName = v => femaleIndicators.some(f=>v.name.toLowerCase().includes(f));

    // 1. Exact preferred names
    for (const name of primaryNames){
      const v = voicesList.find(v=> v.lang.startsWith('en-GB') && v.name === name);
      if (v) return v;
    }
    // 2. Partial preferred tokens
    for (const token of primaryNames){
      const v = voicesList.find(v=> v.lang.startsWith('en-GB') && v.name.toLowerCase().includes(token.toLowerCase()));
      if (v) return v;
    }
    // 3. Any en-GB clearly female
    const clearFemale = voicesList.find(v=> v.lang.startsWith('en-GB') && isFemaleName(v));
    if (clearFemale) return clearFemale;
    // 4. Any en-GB NOT male-indicated
    const notMale = voicesList.find(v=> v.lang.startsWith('en-GB') && !isMaleName(v));
    if (notMale) return notMale;
    // 5. Give up
    return null;
  }

  function pickEnGbMale(voicesList){
    if (!Array.isArray(voicesList) || !voicesList.length) return null;
    const primaryNames = [
      'Google UK English Male', 'Microsoft George', 'Microsoft Ryan', 'Microsoft Guy',
      'Daniel', 'Brian', 'Arthur', 'Matthew'
    ];
    const maleIndicators = ['male','daniel','george','brian','arthur','ryan','guy','matthew','adam','james','tom'];
    const hasIndicator = (voice, indicators) => indicators.some(token => voice.name.toLowerCase().includes(token));

    for (const name of primaryNames){
      const voice = voicesList.find(v => v.lang?.toLowerCase().startsWith('en-gb') && v.name === name);
      if (voice) return voice;
    }
    for (const token of primaryNames){
      const voice = voicesList.find(v => v.lang?.toLowerCase().startsWith('en-gb') && v.name.toLowerCase().includes(token.toLowerCase()));
      if (voice) return voice;
    }
    const enGbMale = voicesList.find(v => v.lang?.toLowerCase().startsWith('en-gb') && hasIndicator(v, maleIndicators));
    if (enGbMale) return enGbMale;
    const anyEnGb = voicesList.find(v => v.lang?.toLowerCase().startsWith('en-gb'));
    if (anyEnGb) return anyEnGb;
    const anyEn = voicesList.find(v => v.lang?.toLowerCase().startsWith('en'));
    if (anyEn) return anyEn;
    return voicesList[0] || null;
  }

  // Load available voices
  function loadVoices() {
    voices = synth.getVoices();

    // Re-pick female voice prioritising UK English
    femaleVoice = pickEnGbFemale(voices);

    // If no UK female available fall back to previous heuristic (simple)
    if (!femaleVoice){
      femaleVoice = voices.find(v=> v.lang.startsWith('en') && /female|zira|samantha|hazel|sonia|libby|serena|kate|elizabeth/i.test(v.name)) || voices.find(v=>v.lang.startsWith('en')) || voices[0];
    }

    // Male preference (now primary default)
    maleVoice = pickEnGbMale(voices);
    if (!maleVoice){
      maleVoice = voices.find(v=> v.lang.startsWith('en-GB') && /male|daniel|george|brian|arthur|ryan/i.test(v.name));
    }
    if (!maleVoice){
      maleVoice = voices.find(v=> /alex|daniel|tom|david|male|brian|arthur|ryan/i.test(v.name) && v.lang.startsWith('en')) || voices.find(v=>v.lang.startsWith('en')) || voices[0];
    }

    if (femaleVoice && /male|daniel|george|brian|arthur|alex|david|tom/i.test(femaleVoice.name)){
      console.warn('[TTS] Female selection landed on a male voice, retrying with stricter filter');
      const retry = voices.find(v=> v.lang.startsWith('en-GB') && /female|hazel|sonia|libby|serena|kate|elizabeth|victoria/i.test(v.name));
      if (retry) femaleVoice = retry;
    }
    console.log('[TTS] Female (en-GB preferred) voice selected:', femaleVoice?.name, femaleVoice?.lang);
    console.log('[TTS] Male (en-GB preferred) voice selected:', maleVoice?.name, maleVoice?.lang);
  }

  // Load voices on page load and when they change
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
  
  // Initial load
  setTimeout(() => {
    loadVoices();
    // Log all available voices for debugging
    console.log('All available voices:', voices.map(v => `${v.name} (${v.lang})`));
  }, 100);

  /**
   * Extract and clean text content from a specific card
   */
  function extractCardContent(cardElement) {
    const contentParts = [];

    // Get headings
    const headings = cardElement.querySelectorAll('h2, h3, h4');
    headings.forEach(h => {
      const text = cleanText(h.textContent);
      if (text) contentParts.push(text);
    });

    // Get paragraphs (exclude muted for cleaner reading, but include if no other content)
    const paragraphs = cardElement.querySelectorAll('p');
    paragraphs.forEach(p => {
      const text = cleanText(p.textContent);
      if (text) contentParts.push(text);
    });

    // Get list items
    const listItems = cardElement.querySelectorAll('li');
    listItems.forEach(li => {
      const text = cleanText(li.textContent);
      if (text) contentParts.push(text);
    });

    // Get details/summary content
    const details = cardElement.querySelectorAll('details');
    details.forEach(detail => {
      const summary = detail.querySelector('summary');
      if (summary) {
        const text = cleanText(summary.textContent);
        if (text) contentParts.push(text);
      }
      // Get content inside details if it's open or we're reading
      const detailContent = Array.from(detail.children).filter(el => el.tagName !== 'SUMMARY');
      detailContent.forEach(el => {
        const text = cleanText(el.textContent);
        if (text) contentParts.push(text);
      });
    });

    // Get badge content
    const badges = cardElement.querySelectorAll('.badge');
    badges.forEach(badge => {
      const text = cleanText(badge.textContent);
      if (text) contentParts.push(text);
    });

    return contentParts.join('. ');
  }

  /**
   * Clean text for natural speech
   */
  function cleanText(text) {
    if (!text) return '';

    return text
      // Remove emojis and unicode symbols
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      // Remove extra symbols but keep punctuation
      .replace(/[▾▴•■▶⏸◆●‹›]/g, '')
      // Normalize dash types to regular hyphen
      .replace(/[—–]/g, '-')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Normalize quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&amp;/g, 'and')
      // Remove leading/trailing whitespace
      .trim();
  }

  function formatList(items) {
    const filtered = (items || []).map(item => item && item.trim()).filter(Boolean);
    if (!filtered.length) return '';
    if (filtered.length === 1) return filtered[0];
    if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
    const last = filtered.pop();
    return `${filtered.join(', ')}, and ${last}`;
  }

  // Build a curated narration for the hero so it sounds intentional instead of reading raw markup order
  function buildHeroNarrationScript(heroSection) {
    if (!heroSection) return '';

    const scriptParts = [];

    const heroHeading = cleanText(heroSection.querySelector('h1')?.textContent || '');
    if (heroHeading) scriptParts.push(heroHeading);

    const heroTagline = cleanText(heroSection.querySelector('.hero-tagline')?.textContent || '');
    if (heroTagline) scriptParts.push(heroTagline);

    const quickStartLabel = cleanText(heroSection.querySelector('.hero-quick-start button')?.textContent || '');
    if (quickStartLabel) {
      scriptParts.push(`If you want a rapid walkthrough or to tune the voice, tap the button just below that says ${quickStartLabel}.`);
    }

    const voiceStatus = cleanText(document.getElementById('heroVoiceStatus')?.textContent || '');
    if (voiceStatus) {
      scriptParts.push(`Voice guidance is currently set to ${voiceStatus}.`);
    }

    const featureCols = heroSection.querySelectorAll('.hero-feature-col');
    const keyFeaturesCol = featureCols[0];
    if (keyFeaturesCol) {
      const keyFeatureHeading = cleanText(keyFeaturesCol.querySelector('.feature-title')?.textContent || 'Key features');
      const featureItems = Array.from(keyFeaturesCol.querySelectorAll('.hero-highlights li')).map(li => cleanText(li.textContent));
      const featureSummary = formatList(featureItems);
      if (featureSummary) {
        scriptParts.push(`${keyFeatureHeading} include ${featureSummary}.`);
      }
      const badgeTexts = Array.from(keyFeaturesCol.querySelectorAll('.hero-badges .badge')).map(badge => cleanText(badge.textContent));
      const badgeSummary = formatList(badgeTexts);
      if (badgeSummary) {
        scriptParts.push(`The programme stays ${badgeSummary}.`);
      }
    }

    const commonConcernsCol = featureCols[1];
    if (commonConcernsCol) {
      const concernHeading = cleanText(commonConcernsCol.querySelector('.feature-title')?.textContent || 'Common concerns');
      const concernLinks = Array.from(commonConcernsCol.querySelectorAll('.hero-condition-links a')).map(link => cleanText(link.textContent));
      const concernSummary = formatList(concernLinks);
      if (concernSummary) {
        scriptParts.push(`${concernHeading} we support include ${concernSummary}.`);
      }
    }

    return scriptParts.join(' ').trim();
  }

  /**
   * Create narration controls for a card
   */
  function createCardNarrationControls(cardId) {
    const controls = document.createElement('div');
    controls.className = 'card-narration-controls';
    controls.innerHTML = `
      <div class="narration-buttons">
        <button class="btn-narrate btn-narrate-start" data-action="start" aria-label="Start narration">🎧 Start</button>
        <button class="btn-narrate btn-narrate-pause" data-action="pause" aria-label="Pause narration" disabled>⏸ Pause</button>
        <button class="btn-narrate btn-narrate-resume" data-action="resume" aria-label="Resume narration" disabled>▶ Resume</button>
        <button class="btn-narrate btn-narrate-stop" data-action="stop" aria-label="Stop narration" disabled>■ Stop</button>
        <select class="voice-selector" aria-label="Select voice">
          <option value="uk-male" selected>UK English Voice (Preferred)</option>
          <option value="male">Male Voice</option>
          <option value="female">Female Voice</option>
        </select>
      </div>
    `;
    return controls;
  }

  /**
   * Initialize narration for a card
   */
  function initializeCardNarration(card) {
    const cardId = card.id || `card-${Math.random().toString(36).substr(2, 9)}`;
    if (!card.id) card.id = cardId;

    // Skip hero section - it has its own controls
    if (cardId === 'vp-home-hero') return;
    
    // Skip modal cards - they have their own controls
    if (card.classList.contains('modal-card')) return;
    
    // Skip cards inside modals
    if (card.closest('.modal-overlay')) return;

    // Add controls to card
    const controls = createCardNarrationControls(cardId);
    card.insertBefore(controls, card.firstChild);

    // Get button elements
    const startBtn = controls.querySelector('[data-action="start"]');
    const pauseBtn = controls.querySelector('[data-action="pause"]');
    const resumeBtn = controls.querySelector('[data-action="resume"]');
    const stopBtn = controls.querySelector('[data-action="stop"]');
    const voiceSelector = controls.querySelector('.voice-selector');

    // Create narration state for this card
    if (voiceSelector){
      const hasPrefOption = Array.from(voiceSelector.options || []).some(opt => opt.value === sharedVoicePreference);
      if (hasPrefOption) voiceSelector.value = sharedVoicePreference;
    }

    const state = {
      utterance: null,
      isPaused: false,
      isReading: false,
      selectedVoice: voiceSelector?.value || sharedVoicePreference
    };

    activeNarrations.set(cardId, state);

    // Update button states
    function updateButtons() {
      if (!state.isReading) {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
      } else if (state.isPaused) {
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = false;
        stopBtn.disabled = false;
      } else {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
        stopBtn.disabled = false;
      }
    }

    // Start narration
    startBtn.addEventListener('click', () => {
      // Stop all other card narrations
      stopAllNarrations();

      const text = extractCardContent(card);
      if (!text) return;

      // Ensure voices are loaded
      if (voices.length === 0) {
        loadVoices();
      }

      state.utterance = new SpeechSynthesisUtterance(text);
      
      // Select voice by preference; enforce en-GB for preferred options
      const freshVoices = synth.getVoices();
      let voice;
        if (state.selectedVoice === 'uk-male') {
          voice = pickEnGbMale(freshVoices) || freshVoices.find(v => v.name === maleVoice?.name) || maleVoice;
        } else if (state.selectedVoice === 'male') {
          voice = freshVoices.find(v => v.name === maleVoice?.name) || maleVoice;
        } else {
          voice = pickEnGbFemale(freshVoices) || freshVoices.find(v => v.name === femaleVoice?.name) || femaleVoice;
      }
      
      if (voice) {
        state.utterance.voice = voice;
          const defaultLang = state.selectedVoice === 'female' ? 'en-GB' : 'en-GB';
          state.utterance.lang = voice.lang || defaultLang;
        console.log('Using voice:', voice.name, '(', voice.lang, ') for', state.selectedVoice);
      } else {
        console.warn('No voice available for:', state.selectedVoice);
        // Force reload voices and try again
        loadVoices();
        const retryVoice = state.selectedVoice === 'male'
          ? maleVoice
          : (state.selectedVoice === 'uk-male'
            ? pickEnGbMale(synth.getVoices()) || maleVoice
            : pickEnGbFemale(synth.getVoices()) || femaleVoice);
        if (retryVoice){
          state.utterance.voice = retryVoice;
            const retryDefaultLang = state.selectedVoice === 'female' ? 'en-GB' : 'en-GB';
            state.utterance.lang = retryVoice.lang || retryDefaultLang;
        }
      }
      
      // For female voice, use slightly higher pitch for more feminine sound
    state.utterance.rate = 0.95;
    state.utterance.pitch = state.selectedVoice === 'female' ? 1.1 : 1.0;
      state.utterance.volume = 1.0;

      state.utterance.onstart = () => {
        state.isReading = true;
        state.isPaused = false;
        updateButtons();
      };

      state.utterance.onend = () => {
        state.isReading = false;
        state.isPaused = false;
        updateButtons();
      };

      state.utterance.onerror = () => {
        state.isReading = false;
        state.isPaused = false;
        updateButtons();
      };

      synth.speak(state.utterance);
    });

    // Pause narration
    pauseBtn.addEventListener('click', () => {
      if (!state.isReading || state.isPaused) return;
      synth.pause();
      state.isPaused = true;
      updateButtons();
    });

    // Resume narration
    resumeBtn.addEventListener('click', () => {
      if (!state.isReading || !state.isPaused) return;
      synth.resume();
      state.isPaused = false;
      updateButtons();
    });

    // Stop narration
    stopBtn.addEventListener('click', () => {
      synth.cancel();
      state.isReading = false;
      state.isPaused = false;
      state.utterance = null;
      updateButtons();
    });

    // Voice selection
    voiceSelector.addEventListener('change', (e) => {
      const nextValue = normalizeVoicePreference(e.target.value);
      state.selectedVoice = nextValue;
      persistSharedPreference(nextValue);
    });

    // Initialize button states
    updateButtons();
  }

  /**
   * Stop all active narrations
   */
  function stopAllNarrations() {
    synth.cancel();
    activeNarrations.forEach(state => {
      state.isReading = false;
      state.isPaused = false;
      state.utterance = null;
    });
  }

  // Initialize narration for all cards on the page
  function initializeAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      initializeCardNarration(card);
    });
  }

  // Initialize hero section narration (separate from cards)
  function initializeHeroNarration() {
    const heroSection = document.getElementById('vp-home-hero');
    if (!heroSection) return;

    const startBtn = document.getElementById('startSession');
    const pauseBtn = document.getElementById('pauseSession');
    const resumeBtn = document.getElementById('resumeSession');
    const stopBtn = document.getElementById('stopSession');

    if (!startBtn || !pauseBtn || !resumeBtn || !stopBtn) return;

    // Add voice selector to hero controls
    const heroControls = document.querySelector('.hero-controls');
    if (heroControls) {
      const heroVoiceSelector = document.createElement('select');
      heroVoiceSelector.className = 'voice-selector';
      heroVoiceSelector.setAttribute('aria-label', 'Select voice');
      heroVoiceSelector.innerHTML = `
        <option value="uk-male" selected>UK English Voice (Preferred)</option>
        <option value="male">Male Voice</option>
        <option value="female">Female Voice</option>
      `;
      heroControls.appendChild(heroVoiceSelector);
      const heroHasPrefOption = Array.from(heroVoiceSelector.options || []).some(opt => opt.value === sharedVoicePreference);
      if (heroHasPrefOption) heroVoiceSelector.value = sharedVoicePreference;

      // Create hero narration state
      const heroState = {
        utterance: null,
        isPaused: false,
        isReading: false,
        selectedVoice: heroVoiceSelector.value || sharedVoicePreference
      };
      heroStateRef = heroState;

      // Update button states
      function updateHeroButtons() {
        if (!heroState.isReading) {
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          resumeBtn.disabled = true;
          stopBtn.disabled = true;
        } else if (heroState.isPaused) {
          startBtn.disabled = true;
          pauseBtn.disabled = true;
          resumeBtn.disabled = false;
          stopBtn.disabled = false;
        } else {
          startBtn.disabled = true;
          pauseBtn.disabled = false;
          resumeBtn.disabled = true;
          stopBtn.disabled = false;
        }
      }

      // Start hero narration
      startBtn.addEventListener('click', () => {
        stopAllNarrations();

        const text = buildHeroNarrationScript(heroSection) || extractCardContent(heroSection);
        if (!text) return;

        // Ensure voices are loaded
        if (voices.length === 0) {
          loadVoices();
        }

        heroState.utterance = new SpeechSynthesisUtterance(text);
        
        // Select voice - ensure female voice is properly set
        // Get fresh voice reference to avoid stale references
        const freshVoices = synth.getVoices();
        let voice;
        if (heroState.selectedVoice === 'uk-male') {
          voice = pickEnGbMale(freshVoices) || freshVoices.find(v => v.name === maleVoice?.name) || maleVoice;
        } else if (heroState.selectedVoice === 'male') {
          voice = freshVoices.find(v => v.name === maleVoice?.name) || maleVoice;
        } else {
          voice = pickEnGbFemale(freshVoices) || freshVoices.find(v => v.name === femaleVoice?.name) || femaleVoice;
        }
        
        if (voice) {
          heroState.utterance.voice = voice;
          const defaultLang = heroState.selectedVoice === 'female' ? 'en-GB' : 'en-GB';
          heroState.utterance.lang = voice.lang || defaultLang;
          console.log('Hero using voice:', voice.name, '(', voice.lang, ') for', heroState.selectedVoice);
        } else {
          console.warn('No hero voice available for:', heroState.selectedVoice);
          // Force reload voices and try again
          loadVoices();
          const retryVoice = heroState.selectedVoice === 'male'
            ? maleVoice
            : (heroState.selectedVoice === 'uk-male'
              ? pickEnGbMale(synth.getVoices()) || maleVoice
              : pickEnGbFemale(synth.getVoices()) || femaleVoice);
          if (retryVoice){
            heroState.utterance.voice = retryVoice;
            const retryDefaultLang = heroState.selectedVoice === 'female' ? 'en-GB' : 'en-GB';
            heroState.utterance.lang = retryVoice.lang || retryDefaultLang;
          }
        }
        
        // For female voice, use slightly higher pitch for more feminine sound
  heroState.utterance.rate = 0.95;
  heroState.utterance.pitch = heroState.selectedVoice === 'female' ? 1.1 : 1.0;
        heroState.utterance.volume = 1.0;

        heroState.utterance.onstart = () => {
          heroState.isReading = true;
          heroState.isPaused = false;
          updateHeroButtons();
        };

        heroState.utterance.onend = () => {
          heroState.isReading = false;
          heroState.isPaused = false;
          updateHeroButtons();
        };

        heroState.utterance.onerror = () => {
          heroState.isReading = false;
          heroState.isPaused = false;
          updateHeroButtons();
        };

        synth.speak(heroState.utterance);
      });

      // Pause
      pauseBtn.addEventListener('click', () => {
        if (!heroState.isReading || heroState.isPaused) return;
        synth.pause();
        heroState.isPaused = true;
        updateHeroButtons();
      });

      // Resume
      resumeBtn.addEventListener('click', () => {
        if (!heroState.isReading || !heroState.isPaused) return;
        synth.resume();
        heroState.isPaused = false;
        updateHeroButtons();
      });

      // Stop
      stopBtn.addEventListener('click', () => {
        synth.cancel();
        heroState.isReading = false;
        heroState.isPaused = false;
        heroState.utterance = null;
        updateHeroButtons();
      });

      // Voice selector
      heroVoiceSelector.addEventListener('change', (e) => {
        const nextValue = normalizeVoicePreference(e.target.value);
        heroState.selectedVoice = nextValue;
        persistSharedPreference(nextValue);
      });

      updateHeroButtons();
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeHeroNarration();
      initializeAllCards();
    });
  } else {
    initializeHeroNarration();
    initializeAllCards();
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    synth.cancel();
  });

  console.log('Card narration system initialized');
})();


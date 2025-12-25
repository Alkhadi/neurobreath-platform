(function(){
  'use strict';

  const doc = document;
  const hero = doc.getElementById('adhd-tools-hero');
  if (!hero) return;

  const startBtn = doc.getElementById('adhdHeroStart');
  const pauseBtn = doc.getElementById('adhdHeroPause');
  const resumeBtn = doc.getElementById('adhdHeroResume');
  const stopBtn = doc.getElementById('adhdHeroStop');
  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voices = [];
  let utterance = null;
  const narrationState = { isReading:false, isPaused:false };
  const VoicePrefs = window.NeurobreathVoicePreferences || null;

  function normalizeVoiceProfile(value){
    if (value === 'female') return 'female';
    if (value === 'male') return 'male';
    return 'uk-male';
  }

  let voiceProfile = normalizeVoiceProfile(
    (VoicePrefs && typeof VoicePrefs.get === 'function' && VoicePrefs.get()) ||
    (VoicePrefs && typeof VoicePrefs.getDefault === 'function' && VoicePrefs.getDefault()) ||
    'uk-male'
  );

  const maleVoiceHints = [/google uk english male/i, /microsoft george/i, /microsoft ryan/i, /microsoft guy/i, /daniel/i, /brian/i, /arthur/i, /matthew/i];
  const femaleVoiceHints = [/female/i, /hazel/i, /sonia/i, /libby/i, /serena/i, /kate/i, /victoria/i, /emma/i, /samantha/i];

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(next => {
      voiceProfile = normalizeVoiceProfile(next);
    });
  }

  function loadVoices(){
    if (!synth) return;
    try{ voices = synth.getVoices(); }
    catch{ voices = []; }
  }

  function cleanText(text){
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[▾▴•■▶⏸◆●‹›]/g, '')
      .replace(/[—–]/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/&amp;/g, 'and')
      .trim();
  }

  function getNarrationText(){
    const parts = [];
    hero.querySelectorAll('h1, p').forEach(node => {
      const value = cleanText(node.textContent || '');
      if (value) parts.push(value);
    });
    return parts.join('. ');
  }

  function pickVoice(){
    if (!voices.length) loadVoices();
    if (!voices.length) return null;
    const profile = voiceProfile;
    const gender = profile === 'female' ? 'female' : 'male';
    const preferGb = profile !== 'male';
    const hints = gender === 'female' ? femaleVoiceHints : maleVoiceHints;
    const lowerLang = voice => (voice.lang || '').toLowerCase();

    if (preferGb){
      const gbVoices = voices.filter(v => lowerLang(v).startsWith('en-gb'));
      const gbMatch = gbVoices.find(v => hints.some(pattern => pattern.test(v.name)));
      if (gbMatch) return gbMatch;
      if (gbVoices[0]) return gbVoices[0];
    }

    const enVoices = voices.filter(v => /^en-/i.test(v.lang || ''));
    const enMatch = enVoices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (enMatch) return enMatch;
    if (enVoices[0]) return enVoices[0];

    const anyMatch = voices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (anyMatch) return anyMatch;
    return voices[0] || null;
  }

  function updateButtons(){
    if (startBtn) startBtn.disabled = narrationState.isReading || !synth;
    if (pauseBtn) pauseBtn.disabled = !narrationState.isReading || narrationState.isPaused || !synth;
    if (resumeBtn) resumeBtn.disabled = !narrationState.isReading || !narrationState.isPaused || !synth;
    if (stopBtn) stopBtn.disabled = !narrationState.isReading || !synth;
  }

  function stopNarration(){
    if (synth){
      try{ synth.cancel(); }catch{}
    }
    utterance = null;
    narrationState.isReading = false;
    narrationState.isPaused = false;
    updateButtons();
  }

  function startNarration(){
    if (!synth) return;
    const text = getNarrationText();
    if (!text) return;
    stopNarration();
    utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice){
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-GB';
    } else {
      utterance.lang = 'en-GB';
    }
    utterance.rate = 0.94;
    const femaleProfile = voiceProfile === 'female';
    utterance.pitch = femaleProfile ? 1.08 : 0.96;
    utterance.volume = 1.0;
    utterance.onstart = () => {
      narrationState.isReading = true;
      narrationState.isPaused = false;
      updateButtons();
    };
    const resetState = () => {
      narrationState.isReading = false;
      narrationState.isPaused = false;
      utterance = null;
      updateButtons();
    };
    utterance.onend = resetState;
    utterance.onerror = resetState;
    try{ synth.speak(utterance); }
    catch(err){ console.warn('Narration could not start', err); resetState(); }
  }

  function heroScrollTo(target, hash){
    if (!target) return;
    try{ target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    catch{ target.scrollIntoView(); }
    if (!hash) return;
    try{
      const url = new URL(window.location.href);
      url.hash = hash;
      window.history.replaceState(null, document.title, url.toString());
    }catch{
      try{ window.location.hash = hash; }catch{}
    }
  }

  if (synth){
    loadVoices();
    if (typeof synth.addEventListener === 'function'){
      synth.addEventListener('voiceschanged', loadVoices);
    } else if ('onvoiceschanged' in synth){
      synth.onvoiceschanged = loadVoices;
    }
  }

  if (!synth){
    [startBtn, pauseBtn, resumeBtn, stopBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = true;
      btn.title = 'Narration is unavailable in this browser.';
    });
  } else {
    updateButtons();
  }

  startBtn?.addEventListener('click', startNarration);
  pauseBtn?.addEventListener('click', () => {
    if (!synth || !narrationState.isReading || narrationState.isPaused) return;
    try{ synth.pause(); }catch{}
    narrationState.isPaused = true;
    updateButtons();
  });
  resumeBtn?.addEventListener('click', () => {
    if (!synth || !narrationState.isReading || !narrationState.isPaused) return;
    try{ synth.resume(); }catch{}
    narrationState.isPaused = false;
    updateButtons();
  });
  stopBtn?.addEventListener('click', stopNarration);

  hero.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', evt => {
      const href = link.getAttribute('href') || '';
      const id = href.replace(/^#/, '');
      if (!id) return;
      const target = doc.getElementById(id);
      if (!target) return;
      evt.preventDefault();
      stopNarration();
      heroScrollTo(target, id);
    });
  });

  const sessionButtons = [
    doc.getElementById('mpl-adhd-start'),
    doc.getElementById('mpl-adhd-stop')
  ];
  sessionButtons.forEach(btn => btn?.addEventListener('click', stopNarration));

  doc.addEventListener('visibilitychange', () => {
    if (doc.visibilityState === 'hidden') stopNarration();
  });
})();

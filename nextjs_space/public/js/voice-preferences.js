/**
 * Neurobreath voice preference helper
 * Persists user narration choice where possible and shares it across modules.
 */
(function(global){
  'use strict';

  const STORAGE_KEY = 'nb.voice.preference.v1';
  const ALLOWED = new Set(['uk-male','male','female']);
  const DEFAULT = 'uk-male';
  const listeners = new Set();
  let cache = null;
  let storageAvailable;

  function detectStorage(){
    if (typeof storageAvailable === 'boolean') return storageAvailable;
    try{
      const key = '__nb_voice_probe__';
      global.localStorage.setItem(key, '1');
      global.localStorage.removeItem(key);
      storageAvailable = true;
    }catch(err){
      storageAvailable = false;
    }
    return storageAvailable;
  }

  function safeStorage(){
    return detectStorage() ? global.localStorage : null;
  }

  function normalize(value){
    if (ALLOWED.has(value)) return value;
    if (typeof value === 'string'){
      const trimmed = value.trim().toLowerCase();
      if (ALLOWED.has(trimmed)) return trimmed;
    }
    return DEFAULT;
  }

  function readPreference(){
    if (cache) return cache;
    const store = safeStorage();
    if (!store){
      cache = DEFAULT;
      return cache;
    }
    try{
      const raw = store.getItem(STORAGE_KEY);
      if (!raw){
        cache = DEFAULT;
        return cache;
      }
      const parsed = JSON.parse(raw);
      cache = normalize(parsed);
      return cache;
    }catch(err){
      console.warn('[VoicePreferences] Failed to read persisted choice:', err);
      cache = DEFAULT;
      return cache;
    }
  }

  function writePreference(value){
    const normalized = normalize(value);
    cache = normalized;
    const store = safeStorage();
    if (store){
      try{
        store.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }catch(err){
        console.warn('[VoicePreferences] Unable to persist preference:', err);
      }
    }
    listeners.forEach(cb => {
      try{ cb(normalized); }catch(err){ console.error('[VoicePreferences] Listener failed', err); }
    });
    return normalized;
  }

  function subscribe(callback){
    if (typeof callback !== 'function') return () => {};
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  const api = {
    STORAGE_KEY,
    getDefault(){ return DEFAULT; },
    get(){ return readPreference(); },
    set(value){ return writePreference(value); },
    subscribe,
    allowed(){ return Array.from(ALLOWED); },
    hasPersistence(){ return detectStorage(); }
  };

  global.NeurobreathVoicePreferences = api;
})(window);

/**
 * NeuroBreath Storage Keys - Centralized Configuration
 * 
 * This file defines all localStorage keys used across the NeuroBreath application.
 * Import this file in other scripts to ensure consistency.
 * 
 * Usage:
 *   const STORAGE_KEY = window.NB_KEYS.CHALLENGE_STATS;
 */

(function() {
  'use strict';

  window.NB_KEYS = Object.freeze({
    // Challenge Lab stats (used by home-challenge-lab.js and tests)
    CHALLENGE_STATS: 'nb_challenge_stats_v1',
    
    // Rewards system
    REWARDS: 'nb_rewards_v1',
    REWARDS_WALLET: 'nb.rewards.wallet.v1',
    
    // Progress tracking
    PROGRESS: 'nb_progress_v2',
    HOME_PROGRESS: 'nb_home_progress_v3',
    
    // Main stats (from app.js / site.js)
    MAIN_STATS: 'mpl.stats.v1',
    
    // Voice preferences
    VOICE_PREFS: 'nb.voice.preference.v1',
    
    // Quick breathing preferences
    QUICK_BREATHING_PREFS: 'nb.quick-breathing.pref',
    
    // Dyslexia-specific keys
    DLX_RAPID_NAMING: 'dlx_rapidNamingStats',
    DLX_STUDIO_PREFIX: 'dlx_studio_',
    DLX_MINI_GAMES: 'dlx_miniGames',
    DLX_QUEST_PREFIX: 'dlx_quest_',
    DLX_REWARDS: 'dlx_rewards',
    DLX_STAGE3: 'nb_dlx_stage3_v1',
    DLX_STAGE3_LOG: 'nb_dlx_stage3_log_v1',
    
    // ADHD Focus Lab
    ADHD_FOCUS_LAB: 'nbFocusLabState_v1',
    
    // Other features
    QUEST_PASS: 'neurobreath_quest_pass',
    CREATIVITY_LAB: 'neurobreath_creativity_lab',
    MEGA_MISSION: 'nb_mega_mission_v1',
    DAILY_MISSION: 'nb_daily_mission_v1',
    PROMPT_VAULT: 'nb_prompt_vault_v1',
    OUTCOME_VAULT: 'nb_outcome_vault_v1',
    GAMES_LAB_THEME: 'nb_games_lab_theme',
    GAMES_LAB2_THEME: 'nb_games_lab2_theme',

    // Site-wide theme (light/dark)
    THEME: 'nb_theme'
  });

  /**
   * Migration helper: migrate old keys to new standardized keys
   * Call this once on app initialization if needed
   */
  function migrateKey(oldKey, newKey) {
    try {
      const oldVal = localStorage.getItem(oldKey);
      if (oldVal && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldVal);
      }
      if (oldVal) {
        localStorage.removeItem(oldKey);
      }
    } catch (err) {
      // Silently fail if migration isn't possible
      console.warn('Storage migration failed for', oldKey, '->', newKey, err);
    }
  }

  /**
   * Run migrations for known legacy keys
   */
  function runMigrations() {
    // Migrate old challenge stats key if it exists
    migrateKey('nb.challenge.meta.v1', window.NB_KEYS.CHALLENGE_STATS);
    
    // Add other migrations as needed
  }

  // Run migrations on load
  if (typeof window !== 'undefined' && window.localStorage) {
    runMigrations();
  }

  // Export migration function for manual use if needed
  window.NB_KEYS_MIGRATE = migrateKey;
})();

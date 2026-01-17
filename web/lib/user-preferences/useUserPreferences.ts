/**
 * Main User Preferences Hook
 * 
 * Client-side hook providing access to unified user preferences state.
 * Use composable hooks (useMyPlanActions, useTTSPreferences, etc.) for specific domains.
 */

'use client';

import { useContext } from 'react';
import { UserPreferencesContext } from '../../components/user-preferences/UserPreferencesProvider';
import type { UserPreferencesState } from './schema';

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }

  return context;
}

/**
 * Get current state (read-only)
 */
export function useUserPreferencesState(): UserPreferencesState {
  const { state } = useUserPreferences();
  return state;
}

/**
 * Export preferences as JSON
 */
export function useExportPreferences() {
  const { exportPreferences } = useUserPreferences();
  return exportPreferences;
}

/**
 * Import preferences from JSON
 */
export function useImportPreferences() {
  const { importPreferences } = useUserPreferences();
  return importPreferences;
}

/**
 * Reset all preferences to defaults
 */
export function useResetPreferences() {
  const { resetPreferences } = useUserPreferences();
  return resetPreferences;
}

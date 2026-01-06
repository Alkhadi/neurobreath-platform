'use client'

import { useState, useEffect } from 'react'
import type { UserContext } from '@/types/user-context'
import { loadContext, saveContext, clearContext, formatContextSummary } from '@/lib/user-context-storage'

/**
 * Hook for managing user context with localStorage persistence
 */
export function useUserContext() {
  const [context, setContextState] = useState<UserContext>({ country: 'UK' })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadContext()
    setContextState(loaded)
    setIsLoaded(true)
  }, [])

  // Update context and persist
  const updateContext = (updates: Partial<UserContext>) => {
    const newContext = { ...context, ...updates }
    setContextState(newContext)
    saveContext(newContext)
  }

  // Reset context
  const resetContext = () => {
    const defaultContext: UserContext = { country: 'UK' }
    setContextState(defaultContext)
    clearContext()
  }

  // Get formatted summary
  const summary = formatContextSummary(context)

  return {
    context,
    updateContext,
    resetContext,
    summary,
    isLoaded
  }
}







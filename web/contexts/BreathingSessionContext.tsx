'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type TechniqueType = 'box' | '478' | 'coherent' | 'sos' | null

interface BreathingSessionContextType {
  activeTechnique: TechniqueType
  challengeKey: string | null
  launchSession: (technique: TechniqueType, challengeKey?: string) => void
  closeSession: () => void
}

const BreathingSessionContext = createContext<BreathingSessionContextType | undefined>(undefined)

export function BreathingSessionProvider({ children }: { children: ReactNode }) {
  const [activeTechnique, setActiveTechnique] = useState<TechniqueType>(null)
  const [challengeKey, setChallengeKey] = useState<string | null>(null)

  const launchSession = useCallback((technique: TechniqueType, key?: string) => {
    setActiveTechnique(technique)
    setChallengeKey(key ?? null)
  }, [])

  const closeSession = useCallback(() => {
    setActiveTechnique(null)
    setChallengeKey(null)
  }, [])

  return (
    <BreathingSessionContext.Provider value={{ activeTechnique, challengeKey, launchSession, closeSession }}>
      {children}
    </BreathingSessionContext.Provider>
  )
}

export function useBreathingSession() {
  const context = useContext(BreathingSessionContext)
  if (!context) {
    throw new Error('useBreathingSession must be used within a BreathingSessionProvider')
  }
  return context
}

// Map challenge technique strings to session types
export function mapTechniqueToSession(technique: string): TechniqueType {
  switch (technique) {
    case 'box-4444':
      return 'box'
    case 'coherent-55':
      return 'coherent'
    case 'four-7-8':
      return '478'
    case 'sos-1m':
      return 'sos'
    default:
      return 'box'
  }
}

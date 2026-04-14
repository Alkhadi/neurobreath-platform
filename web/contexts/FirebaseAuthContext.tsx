'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  linkWithPopup,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

export type AuthStatus = 'loading' | 'guest' | 'authenticated'

interface FirebaseAuthContextValue {
  user: User | null
  status: AuthStatus
  uid: string | null
  signInAsGuest: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  createAccountWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | undefined>(undefined)

const googleProvider = new GoogleAuthProvider()

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) {
      setStatus('guest')
      return
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setStatus('guest')
      } else {
        setStatus(firebaseUser.isAnonymous ? 'guest' : 'authenticated')
      }
    })
    return unsubscribe
  }, [])

  const signInAsGuest = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth || user) return
    await signInAnonymously(firebaseAuth)
  }, [user])

  const signInWithGoogle = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    if (user?.isAnonymous) {
      try {
        await linkWithPopup(user, googleProvider)
        return
      } catch (e: unknown) {
        const code = (e as { code?: string }).code
        if (code !== 'auth/credential-already-in-use') throw e
      }
    }
    await signInWithPopup(firebaseAuth, googleProvider)
  }, [user])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    await signInWithEmailAndPassword(firebaseAuth, email, password)
  }, [])

  const createAccountWithEmail = useCallback(async (email: string, password: string) => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    await createUserWithEmailAndPassword(firebaseAuth, email, password)
  }, [])

  const signOut = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    await fbSignOut(firebaseAuth)
  }, [])

  const uid = user?.uid ?? null

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        status,
        uid,
        signInAsGuest,
        signInWithGoogle,
        signInWithEmail,
        createAccountWithEmail,
        signOut,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useAuth(): FirebaseAuthContextValue {
  const ctx = useContext(FirebaseAuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within FirebaseAuthProvider')
  }
  return ctx
}

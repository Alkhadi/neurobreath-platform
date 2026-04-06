"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export type AuthStatus = "loading" | "guest" | "authenticated";

const googleProvider = new GoogleAuthProvider();

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      // Firebase not configured — stay in guest mode, no crash
      setStatus("guest");
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setStatus("guest");
      } else {
        setStatus(firebaseUser.isAnonymous ? "guest" : "authenticated");
      }
    });
    return unsubscribe;
  }, []);

  const signInAsGuest = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth || user) return;
    await signInAnonymously(firebaseAuth);
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) return;
    // If user is anonymous, link with Google to preserve UID + Firestore data
    if (user?.isAnonymous) {
      try {
        await linkWithPopup(user, googleProvider);
        return;
      } catch (e: unknown) {
        const code = (e as { code?: string }).code;
        // If credential already in use, fall through to normal sign-in
        if (code !== "auth/credential-already-in-use") throw e;
      }
    }
    await signInWithPopup(firebaseAuth, googleProvider);
  }, [user]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const firebaseAuth = getFirebaseAuth();
      if (!firebaseAuth) return;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    },
    [],
  );

  const createAccountWithEmail = useCallback(
    async (email: string, password: string) => {
      const firebaseAuth = getFirebaseAuth();
      if (!firebaseAuth) return;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    },
    [],
  );

  const signOut = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) return;
    await fbSignOut(firebaseAuth);
  }, []);

  return {
    user,
    status,
    signInAsGuest,
    signInWithGoogle,
    signInWithEmail,
    createAccountWithEmail,
    signOut,
  };
}

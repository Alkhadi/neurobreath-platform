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
import { auth } from "@/lib/firebase";

export type AuthStatus = "loading" | "guest" | "authenticated";

const googleProvider = new GoogleAuthProvider();

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
    if (!user) {
      await signInAnonymously(auth);
    }
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
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
    await signInWithPopup(auth, googleProvider);
  }, [user]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const createAccountWithEmail = useCallback(
    async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
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

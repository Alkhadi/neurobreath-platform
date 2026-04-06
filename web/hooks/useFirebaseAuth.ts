"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AuthStatus = "loading" | "guest" | "authenticated";

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

  const signInAsGuest = async () => {
    if (!user) {
      await signInAnonymously(auth);
    }
  };

  return { user, status, signInAsGuest };
}

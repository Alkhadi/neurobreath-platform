"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Cloud, LogOut, Mail } from "lucide-react";
import type { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

type AuthActions = ReturnType<typeof useFirebaseAuth>;

interface FirebaseAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auth: AuthActions;
}

export function FirebaseAuthDialog({
  open,
  onOpenChange,
  auth,
}: FirebaseAuthDialogProps) {
  const { user, status, signInWithGoogle, signInWithEmail, createAccountWithEmail, signOut } =
    auth;

  const [mode, setMode] = useState<"idle" | "email-signin" | "email-signup">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = useCallback(() => {
    setMode("idle");
    setEmail("");
    setPassword("");
    setError(null);
    setBusy(false);
  }, []);

  const handleClose = useCallback(
    (v: boolean) => {
      if (!v) reset();
      onOpenChange(v);
    },
    [onOpenChange, reset],
  );

  const handleGoogle = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
      handleClose(false);
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user") {
        // user cancelled — do nothing
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }, [signInWithGoogle, handleClose]);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        setError("Please enter email and password.");
        return;
      }
      setBusy(true);
      try {
        if (mode === "email-signup") {
          await createAccountWithEmail(trimmedEmail, password);
        } else {
          await signInWithEmail(trimmedEmail, password);
        }
        handleClose(false);
      } catch (e: unknown) {
        const code = (e as { code?: string }).code ?? "";
        if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
          setError("Invalid email or password.");
        } else if (code === "auth/email-already-in-use") {
          setError("An account with this email already exists. Try signing in.");
        } else if (code === "auth/weak-password") {
          setError("Password must be at least 6 characters.");
        } else if (code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setBusy(false);
      }
    },
    [email, password, mode, signInWithEmail, createAccountWithEmail, handleClose],
  );

  const handleSignOut = useCallback(async () => {
    setBusy(true);
    try {
      await signOut();
      handleClose(false);
    } finally {
      setBusy(false);
    }
  }, [signOut, handleClose]);

  // Authenticated view — show account info + sign-out
  if (status === "authenticated" && user && !user.isAnonymous) {
    const displayName = user.displayName || user.email || "Signed in";
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-green-600" />
              Account
            </DialogTitle>
            <DialogDescription>
              Cards sync across your devices automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <p className="text-sm text-gray-700 truncate">{displayName}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSignOut}
              disabled={busy}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Guest / anonymous view — sign-in options
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in to NB-Card</DialogTitle>
          <DialogDescription>
            Sync your cards across devices and keep them safe in the cloud.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Google sign-in */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={busy}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Email mode selector / form */}
          {mode === "idle" ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMode("email-signin")}
              disabled={busy}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with email
            </Button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fb-auth-email">Email</Label>
                <Input
                  id="fb-auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fb-auth-password">Password</Label>
                <Input
                  id="fb-auth-password"
                  type="password"
                  autoComplete={mode === "email-signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {mode === "email-signup" ? "Create account" : "Sign in"}
              </Button>
              <p className="text-center text-xs text-gray-500">
                {mode === "email-signin" ? (
                  <>
                    No account?{" "}
                    <button
                      type="button"
                      className="underline hover:text-gray-900"
                      onClick={() => {
                        setMode("email-signup");
                        setError(null);
                      }}
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="underline hover:text-gray-900"
                      onClick={() => {
                        setMode("email-signin");
                        setError(null);
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </form>
          )}

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

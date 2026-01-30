'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProviders, getSession, signIn } from 'next-auth/react';
import type { ClientSafeProvider } from 'next-auth/react';
import Cookies from 'js-cookie';
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Shield,
  Smartphone,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Step = 'credentials' | 'otp' | 'magic-link-sent';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const TRUST_DEVICE_PREF_KEY = 'nb_trust_device_pref';

function getSafeCallbackUrl(raw: string | null): string {
  const fallback = '/uk';
  const value = raw?.trim();
  if (!value) return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//')) return fallback;
  if (value.startsWith('/api')) return fallback;
  if (value.startsWith('/uk/login') || value.startsWith('/uk/register')) return fallback;
  return value;
}

function getStoredAttempts(): { count: number; lockedUntil: number | null } {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: null };
  try {
    const stored = localStorage.getItem('login_attempts');
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore parse errors
  }
  return { count: 0, lockedUntil: null };
}

function setStoredAttempts(count: number, lockedUntil: number | null) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('login_attempts', JSON.stringify({ count, lockedUntil }));
}

function clearStoredAttempts() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('login_attempts');
}

// Social provider icons
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.4 11.4H2V2h9.4v9.4z" fill="#F25022" />
      <path d="M22 11.4h-9.4V2H22v9.4z" fill="#7FBA00" />
      <path d="M11.4 22H2v-9.4h9.4V22z" fill="#00A4EF" />
      <path d="M22 22h-9.4v-9.4H22V22z" fill="#FFB900" />
    </svg>
  );
}

export default function UkLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));
  const error = searchParams.get('error');
  const registered = searchParams.get('registered') === '1';

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [availableProviders, setAvailableProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  // Load stored attempts and device token on mount
  useEffect(() => {
    const stored = getStoredAttempts();
    setLoginAttempts(stored.count);
    setLockedUntil(stored.lockedUntil);
    
    // Load device token cookie
    const token = Cookies.get('nb_device_token');
    if (token) {
      setDeviceToken(token);
    }

    try {
      const pref = localStorage.getItem(TRUST_DEVICE_PREF_KEY);
      if (pref === 'true') setTrustDevice(true);
    } catch {
      // ignore
    }
    
    // Load available providers
    getProviders().then(setAvailableProviders);
  }, []);

  useEffect(() => {
    if (!registered) return;
    setMessage({ type: 'success', text: 'Account created. You can now sign in.' });
  }, [registered]);

  useEffect(() => {
    try {
      localStorage.setItem(TRUST_DEVICE_PREF_KEY, trustDevice ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [trustDevice]);

  const persistTrustedDeviceToken = useCallback(async () => {
    try {
      const session = await getSession();
      const token = (session as unknown as { deviceToken?: string } | null)?.deviceToken;
      if (!token) return;

      Cookies.set('nb_device_token', token, {
        expires: 30,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      setDeviceToken(token);
    } catch {
      // ignore
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) {
      setCountdown(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, lockedUntil - Date.now());
      setCountdown(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        setLockedUntil(null);
        setLoginAttempts(0);
        clearStoredAttempts();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const errorBanner = useMemo(() => {
    if (error === 'AUTH_CONFIG') return 'Login is not configured yet. Please try again later.';
    if (error === 'OAuthAccountNotLinked') return 'This email is already linked to a different sign-in method.';
    if (error === 'AccessDenied') return 'Access denied. Please contact support if you believe this is an error.';
    if (error === 'OAuthSignin') return 'Error connecting to sign-in provider. Please try again.';
    if (error === 'OAuthCallback') return 'Error during sign-in. Please try again.';
    if (error === 'OAuthCreateAccount') return 'Could not create account. Please try another method.';
    if (error === 'EmailCreateAccount') return 'Could not create account with this email.';
    if (error === 'Callback') return 'Sign-in error occurred. Please try again.';
    if (error === 'OAuthAccountNotLinked') return 'This email is already linked to a different sign-in method.';
    if (error === 'EmailSignin') return 'Unable to send email. Please check your email address.';
    if (error === 'CredentialsSignin') return 'Invalid email or password.';
    if (error === 'SessionRequired') return 'Please sign in to continue.';
    if (error === 'Default') return 'An error occurred during sign-in. Please try again.';
    return null;
  }, [error]);

  const handleFailedAttempt = useCallback(() => {
    const newCount = loginAttempts + 1;
    setLoginAttempts(newCount);

    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      const lockTime = Date.now() + LOCKOUT_DURATION_MS;
      setLockedUntil(lockTime);
      setStoredAttempts(newCount, lockTime);
      setMessage({
        type: 'error',
        text: `Too many failed attempts. Please try again in 15 minutes or reset your password.`,
      });
    } else {
      setStoredAttempts(newCount, null);
      const remaining = MAX_LOGIN_ATTEMPTS - newCount;
      setMessage({
        type: 'error',
        text: `Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      });
    }
  }, [loginAttempts]);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setMessage(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        trustDevice: trustDevice ? 'true' : 'false',
        rememberMe: rememberMe ? 'true' : 'false',
        deviceToken: deviceToken || '',
      });

      if (res?.error === '2FA_REQUIRED') {
        setStep('otp');
        setMessage({
          type: 'info',
          text: 'Two-factor authentication is enabled. Enter your code to continue.',
        });
        return;
      }

      if (res?.error) {
        setMessage({ type: 'error', text: 'Sign in failed. Please check your details and try again.' });
        handleFailedAttempt();
        return;
      }

      if (!res?.ok) {
        handleFailedAttempt();
        return;
      }

      // Success - clear attempts and redirect
      clearStoredAttempts();
      if (trustDevice) {
        await persistTrustedDeviceToken();
      }
      router.push(callbackUrl);
    } catch {
      setMessage({
        type: 'error',
        text: 'Sign in failed. Please try again in a moment.',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        token: otp,
        trustDevice: trustDevice ? 'true' : 'false',
        rememberMe: rememberMe ? 'true' : 'false',
        deviceToken: deviceToken || '',
      });

      if (res?.error === 'INVALID_OTP') {
        setMessage({ type: 'error', text: 'Invalid code. Please check and try again.' });
        setOtp('');
        return;
      }

      if (res?.error) {
        setMessage({ type: 'error', text: 'Sign in failed. Please try again.' });
        return;
      }

      if (!res?.ok) {
        setMessage({ type: 'error', text: 'Sign in failed. Please try again.' });
        return;
      }

      clearStoredAttempts();
      if (trustDevice) {
        await persistTrustedDeviceToken();
      }
      router.push(callbackUrl);
    } catch {
      setMessage({ type: 'error', text: 'Sign in failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: string) {
    setSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setMessage({ type: 'error', text: `Failed to sign in with ${provider}. Please try again.` });
      setSocialLoading(null);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address first.' });
      return;
    }

    setMagicLinkLoading(true);
    setMessage(null);

    try {
      // Check if email provider is configured
      if (!availableProviders?.email) {
        setMessage({ type: 'error', text: 'Email sign-in is not configured yet (SMTP not set up).' });
        setMagicLinkLoading(false);
        return;
      }
      const res = await signIn('email', { email, callbackUrl, redirect: false });
      if (res?.error) {
        setMessage({ type: 'error', text: 'Failed to send sign-in link. Please try again.' });
        return;
      }
      setStep('magic-link-sent');
      setMessage({
        type: 'success',
        text: `We've sent a sign-in link to ${email}. Check your inbox.`,
      });
    } catch {
      setMessage({ type: 'error', text: 'Failed to send magic link. Please try again.' });
    } finally {
      setMagicLinkLoading(false);
    }
  }

  function formatCountdown(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-7 w-7 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your NeuroBreath account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error banner */}
            {errorBanner && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorBanner}</AlertDescription>
              </Alert>
            )}

            {/* Lockout warning */}
            {isLocked && (
              <Alert variant="destructive">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Account temporarily locked. Try again in{' '}
                  <span className="font-mono font-semibold">{formatCountdown(countdown)}</span>
                  {' '}or{' '}
                  <Link href="/uk/password-reset" className="underline font-medium">
                    reset your password
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            )}

            {/* Status message */}
            {message && !isLocked && (
              <Alert
                variant={message.type === 'error' ? 'destructive' : 'default'}
                className={
                  message.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
                    : message.type === 'info'
                    ? 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    : ''
                }
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : message.type === 'info' ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {step === 'credentials' && (
              <>
                {/* Social login buttons - only show if providers are configured */}
                {(availableProviders?.google || availableProviders?.apple || availableProviders?.['azure-ad']) && (
                    <div className="grid grid-cols-3 gap-3">
                    {availableProviders?.google && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSocialSignIn('google')}
                            disabled={isLocked || loading || socialLoading !== null}
                          >
                            {socialLoading === 'google' ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <GoogleIcon className="h-5 w-5" />
                            )}
                            <span className="sr-only">Sign in with Google</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sign in with Google</TooltipContent>
                      </Tooltip>
                    )}

                    {availableProviders?.apple && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSocialSignIn('apple')}
                            disabled={isLocked || loading || socialLoading !== null}
                          >
                            {socialLoading === 'apple' ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <AppleIcon className="h-5 w-5" />
                            )}
                            <span className="sr-only">Sign in with Apple</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sign in with Apple</TooltipContent>
                      </Tooltip>
                    )}

                    {availableProviders?.['azure-ad'] && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSocialSignIn('azure-ad')}
                            disabled={isLocked || loading || socialLoading !== null}
                          >
                            {socialLoading === 'azure-ad' ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <MicrosoftIcon className="h-5 w-5" />
                            )}
                            <span className="sr-only">Sign in with Microsoft</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sign in with Microsoft</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading || isLocked}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/uk/password-reset"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading || isLocked}
                        className="pl-10 pr-10"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        disabled={loading || isLocked}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Remember me for 30 days
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trust-device"
                        checked={trustDevice}
                        onCheckedChange={(checked) => setTrustDevice(checked === true)}
                        disabled={loading || isLocked}
                      />
                      <label
                        htmlFor="trust-device"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                      >
                        Trust this device
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Shield className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            Skip 2FA verification on this device for 30 days. Only use on personal
                            devices you trust.
                          </TooltipContent>
                        </Tooltip>
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || isLocked}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Magic link option */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or sign in without password
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleMagicLink}
                  disabled={loading || magicLinkLoading || isLocked}
                  title={!availableProviders?.email ? 'Email sign-in is not configured' : undefined}
                >
                  {magicLinkLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email me a sign-in link
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      New to NeuroBreath?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push('/uk/register')}
                  disabled={loading}
                >
                  Create a free account
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push('/uk')}
                  disabled={loading}
                >
                  Continue without an account
                </Button>
              </>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Two-factor authentication
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Enter the 6-digit code from your authenticator app.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Authentication code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      id="otp"
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      disabled={loading}
                      autoFocus
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Can't access your authenticator?{' '}
                    <Link href="/uk/password-reset" className="underline hover:text-primary">
                      Use a recovery code
                    </Link>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify and sign in
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setOtp('');
                    setStep('credentials');
                    setMessage(null);
                  }}
                  disabled={loading}
                >
                  ← Back to sign in
                </Button>
              </form>
            )}

            {step === 'magic-link-sent' && (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We sent a sign-in link to <span className="font-medium">{email}</span>
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/40 p-4 text-sm text-left space-y-2">
                  <p className="font-medium">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Open your email inbox</li>
                    <li>Click the sign-in link in the email</li>
                    <li>You'll be automatically signed in</li>
                  </ol>
                </div>

                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={handleMagicLink}
                    className="underline hover:text-primary"
                    disabled={magicLinkLoading}
                  >
                    send again
                  </button>
                </p>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep('credentials');
                    setMessage(null);
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try another method
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Separator />
            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>
                By signing in, you agree to our{' '}
                <Link href="/trust/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/trust/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
              <p className="flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                <span>256-bit SSL encrypted connection</span>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Security notice */}
        <p className="text-xs text-center text-muted-foreground mt-4 px-4">
          Protect your account: Never share your password and enable two-factor authentication for
          added security.{' '}
          <Link href="/trust/safeguarding" className="underline hover:text-primary">
            Learn more
          </Link>
        </p>
      </div>
    </TooltipProvider>
  );
}

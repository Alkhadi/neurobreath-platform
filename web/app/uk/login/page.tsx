'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'credentials' | 'otp';

export default function UkLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/uk/my-account';
  const error = searchParams.get('error');

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const errorBanner = useMemo(() => {
    if (error === 'AUTH_CONFIG') return 'Login is not configured yet. Please try again later.';
    return null;
  }, [error]);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error === '2FA_REQUIRED') {
        setStep('otp');
        setMessage('2FA is enabled for this account. Enter your code to continue.');
        return;
      }

      if (!res?.ok) {
        setMessage('Invalid email or password.');
        return;
      }

      router.push(callbackUrl);
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
      });

      if (res?.error === 'INVALID_OTP') {
        setMessage('Invalid code. Please try again.');
        return;
      }

      if (!res?.ok) {
        setMessage('Sign in failed. Please try again.');
        return;
      }

      router.push(callbackUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          {errorBanner ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {errorBanner}
            </div>
          ) : null}

          {message ? (
            <div className="mb-4 rounded-md border bg-muted/40 p-3 text-sm">
              {message}
            </div>
          ) : null}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Link href="/uk/password-reset" className="underline">
                  Forgot password?
                </Link>
                <Link href="/uk/register" className="underline">
                  Create account
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-time code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify and sign in'}
              </Button>

              <button
                type="button"
                className="w-full text-sm underline"
                onClick={() => {
                  setOtp('');
                  setStep('credentials');
                }}
              >
                Back
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

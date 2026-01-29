'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TurnstileWidget } from '@/components/security/turnstile-widget';

export default function UkRegisterPage() {
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const turnstileEnabled = useMemo(() => !!siteKey, [siteKey]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (turnstileEnabled && !turnstileToken) {
      setMessage('Please complete the spam protection check.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email,
          password,
          confirmPassword,
          turnstileToken: turnstileEnabled ? turnstileToken : undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!res.ok || !data?.ok) {
        setMessage(data?.message || 'Registration failed. Please try again in a moment.');
        setTurnstileToken('');
        setTurnstileResetKey((k) => k + 1);
        return;
      }

      router.push('/uk/login?registered=1');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="mb-4 rounded-md border bg-muted/40 p-3 text-sm">{message}</div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {turnstileEnabled && siteKey ? (
              <div className="space-y-2">
                <TurnstileWidget
                  siteKey={siteKey}
                  action="register"
                  resetKey={turnstileResetKey}
                  onVerify={(t) => setTurnstileToken(t)}
                  onExpire={() => setTurnstileToken('')}
                  onError={() => setMessage('Spam protection failed to load. Please refresh and try again.')}
                />
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </Button>

            <div className="text-sm">
              <Link href="/uk/login" className="underline">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

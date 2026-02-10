'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TurnstileWidget } from '@/components/security/turnstile-widget';

export default function UsPasswordResetPage() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileEnabled = useMemo(() => !!siteKey, [siteKey]);

  const [email, setEmail] = useState('');
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
      const res = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          turnstileToken: turnstileEnabled ? turnstileToken : undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!res.ok || data?.ok === false) {
        setMessage(data?.message || 'Request failed. Please try again later.');
        setTurnstileToken('');
        setTurnstileResetKey((k) => k + 1);
        return;
      }

      setMessage(data?.message || 'If an account exists, you will receive an email shortly.');
      setTurnstileToken('');
      setTurnstileResetKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Password reset</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter your email and we’ll send a reset link.
          </p>

          {message ? (
            <div className="mb-4 rounded-md border bg-muted/40 p-3 text-sm">{message}</div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {turnstileEnabled && siteKey ? (
              <TurnstileWidget
                siteKey={siteKey}
                action="password_reset"
                resetKey={turnstileResetKey}
                onVerify={(t) => setTurnstileToken(t)}
                onExpire={() => setTurnstileToken('')}
                onError={() => setMessage('Spam protection failed to load. Please refresh and try again.')}
              />
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>

            <div className="text-sm">
              <Link href="/us/login" className="underline">
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

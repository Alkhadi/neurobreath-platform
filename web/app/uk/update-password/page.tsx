'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UkUpdatePasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const tokenPresent = useMemo(() => token.trim().length > 0, [token]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!tokenPresent) {
      setMessage('Missing reset token. Please request a new reset link.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!res.ok || !data?.ok) {
        setMessage(data?.message || 'Failed to update password');
        return;
      }

      setMessage(data.message || 'Password updated. You can now sign in.');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="mb-4 rounded-md border bg-muted/40 p-3 text-sm">{message}</div>
          ) : null}

          {!tokenPresent ? (
            <div className="mb-4 text-sm">
              <Link href="/uk/password-reset" className="underline">
                Request a new reset link
              </Link>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </Button>

            <div className="text-sm">
              <Link href="/uk/login" className="underline">
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

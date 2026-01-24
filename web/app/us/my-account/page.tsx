'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession, signOut } from 'next-auth/react';
import { QRCodeCanvas } from 'qrcode.react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SetupResponse = { ok: true; otpauthUrl: string; maskedSecret?: string; message?: string } | { ok: false; message?: string };

export default function UsMyAccountPage() {
  const [email, setEmail] = useState<string | null>(null);

  const [setup, setSetup] = useState<{ otpauthUrl: string; maskedSecret?: string } | null>(null);
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getSession()
      .then((s) => setEmail(s?.user?.email || null))
      .catch(() => setEmail(null));
  }, []);

  async function handleSetup2fa() {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/account/2fa/setup', { method: 'POST' });
      const data = (await res.json().catch(() => null)) as SetupResponse | null;

      if (!res.ok || !data || data.ok === false) {
        setMessage(data?.message || 'Failed to set up 2FA');
        return;
      }

      setSetup({ otpauthUrl: data.otpauthUrl, maskedSecret: data.maskedSecret });
      setMessage(data.message || 'Scan the QR code, then enter a code to enable 2FA.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable2fa(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/account/2fa/enable', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: otp }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!res.ok || !data?.ok) {
        setMessage(data?.message || 'Failed to enable 2FA');
        return;
      }

      setMessage(data.message || '2FA enabled.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable2fa() {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/account/2fa/disable', { method: 'POST' });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!res.ok || !data?.ok) {
        setMessage(data?.message || 'Failed to disable 2FA');
        return;
      }

      setSetup(null);
      setOtp('');
      setMessage(data.message || '2FA disabled.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {email ? `Signed in as ${email}` : 'Signed in'}
          </div>

          {message ? (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">{message}</div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/us/login' })} disabled={loading}>
              Sign out
            </Button>
            <Button asChild variant="outline" disabled={loading}>
              <Link href="/us/change-password">Change password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two‑factor authentication (2FA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Optional extra security using an authenticator app (TOTP).
          </p>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSetup2fa} disabled={loading}>
              Set up 2FA
            </Button>
            <Button variant="outline" onClick={handleDisable2fa} disabled={loading}>
              Disable 2FA
            </Button>
          </div>

          {setup ? (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm font-medium mb-2">Scan this QR code</div>
                <QRCodeCanvas value={setup.otpauthUrl} size={180} />
                {setup.maskedSecret ? (
                  <div className="mt-2 text-xs text-muted-foreground">Secret: {setup.maskedSecret}</div>
                ) : null}
              </div>

              <form onSubmit={handleEnable2fa} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter code from your app</Label>
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

                <Button type="submit" disabled={loading}>
                  Enable 2FA
                </Button>
              </form>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

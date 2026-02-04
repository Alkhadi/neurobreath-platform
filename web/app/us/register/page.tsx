'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TurnstileWidget } from '@/components/security/turnstile-widget';

export default function UsRegisterPage() {
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const turnstileEnabled = useMemo(() => !!siteKey, [siteKey]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  function validate(values: { email: string; password: string; confirmPassword: string }) {
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};

    const emailValue = values.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = 'Enter a valid email address.';
    }

    if (values.password.length < 8 || !/\d/.test(values.password)) {
      errors.password = 'Use 8+ characters and include at least one number.';
    }

    if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors = validate({ email: normalizedEmail, password, confirmPassword });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

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
          email: normalizedEmail,
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

      router.push('/us/login?registered=1&callbackUrl=/us');
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
              <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setFieldErrors((prev) => ({ ...prev, ...validate({ email, password, confirmPassword }) }))}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                autoCapitalize="none"
                required
              />
              {fieldErrors.email ? (
                <p id="email-error" className="text-xs text-destructive" role="alert">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                  onBlur={() => setFieldErrors((prev) => ({ ...prev, ...validate({ email, password, confirmPassword }) }))}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {capsLockOn ? <p className="text-xs text-muted-foreground">Caps Lock is on.</p> : null}
              {fieldErrors.password ? (
                <p id="password-error" className="text-xs text-destructive" role="alert">
                  {fieldErrors.password}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Use 8+ characters and include at least one number.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setFieldErrors((prev) => ({ ...prev, ...validate({ email, password, confirmPassword }) }))}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword ? (
                <p id="confirmPassword-error" className="text-xs text-destructive" role="alert">
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
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

            <p className="text-xs text-muted-foreground">
              Continue without an account saves progress on this device. Create an account to sync across devices.
            </p>

            <div className="text-sm">
              <Link href="/us/login" className="underline">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

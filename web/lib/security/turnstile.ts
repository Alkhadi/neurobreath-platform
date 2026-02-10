export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; error: 'MISSING_SECRET' | 'VERIFY_FAILED' | 'NETWORK_ERROR' };

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
};

function getClientIp(req: Request): string | undefined {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();

  const xff = req.headers.get('x-forwarded-for');
  if (!xff) return undefined;
  const first = xff.split(',')[0]?.trim();
  return first || undefined;
}

export async function verifyTurnstile(req: Request, token: string): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, error: 'MISSING_SECRET' };

  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);

    const ip = getClientIp(req);
    if (ip) form.set('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const data = (await res.json().catch(() => null)) as TurnstileVerifyResponse | null;
    if (!data?.success) return { ok: false, error: 'VERIFY_FAILED' };

    return { ok: true };
  } catch {
    return { ok: false, error: 'NETWORK_ERROR' };
  }
}

import type { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const NB_PROGRESS_CONSENT_COOKIE = 'nb_progress_consent';
export const NB_DEVICE_ID_COOKIE = 'nb_device_id';

export type ProgressConsentValue = '1' | '0';

export function getProgressConsentFromRequest(req: NextRequest): ProgressConsentValue | null {
  const raw = req.cookies.get(NB_PROGRESS_CONSENT_COOKIE)?.value;
  if (raw === '1' || raw === '0') return raw;
  return null;
}

export function getDeviceIdFromRequest(req: NextRequest): string | null {
  return req.cookies.get(NB_DEVICE_ID_COOKIE)?.value ?? null;
}

export function setProgressConsentCookie(res: NextResponse, value: ProgressConsentValue) {
  res.cookies.set({
    name: NB_PROGRESS_CONSENT_COOKIE,
    value,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function clearProgressCookies(res: NextResponse) {
  res.cookies.set({
    name: NB_PROGRESS_CONSENT_COOKIE,
    value: '0',
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 0,
  });

  res.cookies.set({
    name: NB_DEVICE_ID_COOKIE,
    value: '',
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 0,
  });
}

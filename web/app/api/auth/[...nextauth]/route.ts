import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';

import { authOptions } from '@/lib/auth/nextauth';
import { checkRateLimit, recordFailedAttempt } from '@/lib/auth/rate-limit';

export const runtime = 'nodejs';

if (!process.env.NEXTAUTH_URL) {
	process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

const handler = NextAuth(authOptions);

type NextAuthRouteContext = {
	params?: {
		nextauth?: string[];
	};
};

const routeHandler = handler as unknown as (req: NextRequest, context: NextAuthRouteContext) => Promise<Response>;

function getSetCookieHeaders(res: Response): string[] {
	const headersAny = res.headers as unknown as { getSetCookie?: () => string[] };
	if (typeof headersAny.getSetCookie === 'function') {
		return headersAny.getSetCookie();
	}
	const single = res.headers.get('set-cookie');
	return single ? [single] : [];
}

function withUpdatedCookieMaxAge(setCookie: string, maxAgeSeconds: number): string {
	const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();

	let updated = setCookie;
	if (/Max-Age=/i.test(updated)) {
		updated = updated.replace(/Max-Age=\d+/i, `Max-Age=${maxAgeSeconds}`);
	} else {
		updated = `${updated}; Max-Age=${maxAgeSeconds}`;
	}

	if (/Expires=/i.test(updated)) {
		updated = updated.replace(/Expires=[^;]+/i, `Expires=${expires}`);
	} else {
		updated = `${updated}; Expires=${expires}`;
	}

	return updated;
}

function rewriteSessionCookieMaxAge(res: Response, maxAgeSeconds: number): Response {
	const cookies = getSetCookieHeaders(res);
	if (cookies.length === 0) return res;

	const headers = new Headers(res.headers);
	headers.delete('set-cookie');

	for (const cookie of cookies) {
		const isSessionCookie =
			cookie.startsWith('next-auth.session-token=') ||
			cookie.startsWith('__Secure-next-auth.session-token=');

		headers.append(
			'set-cookie',
			isSessionCookie ? withUpdatedCookieMaxAge(cookie, maxAgeSeconds) : cookie
		);
	}

	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers,
	});
}

export async function GET(req: NextRequest, context: NextAuthRouteContext) {
	return routeHandler(req, context);
}

export async function POST(req: NextRequest, context: NextAuthRouteContext) {
	const url = new URL(req.url);
	const isCredentialsCallback = url.pathname.endsWith('/callback/credentials');
	const isEmailSignin = url.pathname.endsWith('/signin/email');

	if (isEmailSignin) {
		const form = await req.clone().formData().catch(() => null);
		const emailRaw = (form?.get('email') ?? '') as string;
		const email = typeof emailRaw === 'string' ? emailRaw.trim().toLowerCase() : '';

		if (email) {
			const rate = await checkRateLimit(req, email, 'magic_link');
			if (!rate.allowed) {
				return Response.json(
					{
						error: 'RATE_LIMITED',
						ok: false,
						status: 429,
						url: null,
					},
					{
						status: 200,
						headers: {
							'cache-control': 'no-store',
						},
					}
				);
			}

			// Record the request to enforce cooldown.
			await recordFailedAttempt(req, email, 'magic_link');
		}
	}

	let rememberMe = false;
	if (isCredentialsCallback) {
		const form = await req.clone().formData().catch(() => null);
		rememberMe = form?.get('rememberMe') === 'true';
	}

	const res = await routeHandler(req, context);
	if (!isCredentialsCallback) return res;

	const maxAgeSeconds = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
	return rewriteSessionCookieMaxAge(res, maxAgeSeconds);
}

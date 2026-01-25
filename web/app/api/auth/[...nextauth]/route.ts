import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth/nextauth';

export const runtime = 'nodejs';

if (!process.env.NEXTAUTH_URL) {
	process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
	process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

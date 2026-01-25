import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { verifySync } from 'otplib';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { decryptTotpSecret } from '@/lib/auth/totp';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/uk/login',
    error: '/uk/login',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          }),
        ]
      : []),
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
            tenantId: process.env.AZURE_AD_TENANT_ID,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'One-time code', type: 'text' },
        trustDevice: { label: 'Trust device', type: 'text' },
        rememberMe: { label: 'Remember me', type: 'text' },
      },
      async authorize(credentials) {
        const emailRaw = credentials?.email;
        const password = credentials?.password;
        const otp = credentials?.token;

        if (!emailRaw || !password) {
          return null;
        }

        const email = normalizeEmail(emailRaw);
        const user = await prisma.authUser.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        if (user.twoFactorEnabled) {
          if (!user.twoFactorSecretEnc) {
            // Misconfigured account; treat as invalid.
            return null;
          }
          if (!otp || otp.trim().length === 0) {
            throw new Error('2FA_REQUIRED');
          }

          const secret = decryptTotpSecret(user.twoFactorSecretEnc);
          const result = verifySync({ strategy: 'totp', secret, token: otp.trim() });
          const otpOk = !!(result as { valid?: boolean }).valid;
          if (!otpOk) throw new Error('INVALID_OTP');
        }

        return { id: user.id, email: user.email, name: user.name || undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        (token as unknown as { uid?: string }).uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const uid = (token as unknown as { uid?: string }).uid || token.sub;
      if (uid) {
        (session as unknown as { uid?: string }).uid = uid;
      }
      return session;
    },
  },
};

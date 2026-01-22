import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifySync } from 'otplib';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { decryptTotpSecret } from '@/lib/auth/totp';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/uk/login',
    error: '/uk/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'One-time code', type: 'text' },
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

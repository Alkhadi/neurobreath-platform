import type { NextAuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { verifySync } from 'otplib';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { decryptTotpSecret } from '@/lib/auth/totp';
import { verifyTrustedDevice, createTrustedDevice } from '@/lib/auth/trusted-device';
import { clearRateLimitOnSuccess } from '@/lib/auth/rate-limit';

type AdapterUser = {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
};

type AuthUserRecord = {
  id: string;
  email: string;
  name: string | null;
};

function toAdapterUser(user: AuthUserRecord | null): AdapterUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    emailVerified: null,
    name: user.name,
    image: null,
  };
}

function authPrismaAdapter() {
  return {
    async createUser(data: Omit<AdapterUser, 'id'> & { id?: string }) {
      if (!data.email) {
        throw new Error('EMAIL_REQUIRED');
      }
      const email = normalizeEmail(data.email);
      const created = await prisma.authUser.create({
        data: {
          id: data.id,
          email,
          name: data.name,
          passwordHash: '',
          twoFactorEnabled: false,
        },
      });
      return toAdapterUser(created)!;
    },

    async getUser(id: string) {
      const user = await prisma.authUser.findUnique({ where: { id } });
      return toAdapterUser(user);
    },

    async getUserByEmail(email: string) {
      const normalized = normalizeEmail(email);
      const user = await prisma.authUser.findUnique({ where: { email: normalized } });
      return toAdapterUser(user);
    },

    async getUserByAccount(providerAccountId: { provider: string; providerAccountId: string }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: providerAccountId.provider,
            providerAccountId: providerAccountId.providerAccountId,
          },
        },
        include: { user: true },
      });
      return toAdapterUser(account?.user ?? null);
    },

    async updateUser(data: Partial<AdapterUser> & { id: string }) {
      const email = data.email ? normalizeEmail(data.email) : undefined;
      const updated = await prisma.authUser.update({
        where: { id: data.id },
        data: {
          email,
          name: data.name ?? undefined,
        },
      });
      return toAdapterUser(updated)!;
    },

    async deleteUser(id: string) {
      const deleted = await prisma.authUser.delete({ where: { id } });
      return toAdapterUser(deleted)!;
    },

    async linkAccount(account: {
      userId: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
    }) {
      return prisma.account.create({ data: account });
    },

    async unlinkAccount(providerAccountId: { provider: string; providerAccountId: string }) {
      return prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider: providerAccountId.provider,
            providerAccountId: providerAccountId.providerAccountId,
          },
        },
      });
    },

    async createSession(data: { sessionToken: string; userId: string; expires: Date }) {
      const created = await prisma.authSession.create({ data });
      return { sessionToken: created.sessionToken, userId: created.userId, expires: created.expires };
    },

    async getSessionAndUser(sessionToken: string) {
      const session = await prisma.authSession.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;
      return {
        session: { sessionToken: session.sessionToken, userId: session.userId, expires: session.expires },
        user: toAdapterUser(session.user)!,
      };
    },

    async updateSession(data: { sessionToken: string; expires?: Date; userId?: string }) {
      const updated = await prisma.authSession.update({
        where: { sessionToken: data.sessionToken },
        data: { expires: data.expires, userId: data.userId },
      });
      return { sessionToken: updated.sessionToken, userId: updated.userId, expires: updated.expires };
    },

    async deleteSession(sessionToken: string) {
      const deleted = await prisma.authSession.delete({ where: { sessionToken } });
      return { sessionToken: deleted.sessionToken, userId: deleted.userId, expires: deleted.expires };
    },

    async createVerificationToken(data: { identifier: string; token: string; expires: Date }) {
      return prisma.verificationToken.create({ data });
    },

    async useVerificationToken(params: { identifier: string; token: string }) {
      try {
        return await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: params.identifier,
              token: params.token,
            },
          },
        });
      } catch {
        return null;
      }
    },
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_SERVER_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    server: {
      host,
      port,
      auth: { user, pass },
    },
    from,
  };
}

export const authOptions: NextAuthOptions = {
  adapter: authPrismaAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  debug:
    process.env.NEXTAUTH_DEBUG === 'true'
      ? true
      : process.env.NEXTAUTH_DEBUG === 'false'
        ? false
        : process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours default
  },
  pages: {
    signIn: '/uk/login', // Default to UK, will be overridden by callbackUrl region
    error: '/uk/login',
    verifyRequest: '/uk/login?verify=sent',
    newUser: '/uk/register',
  },
  providers: [
    // Credentials provider (email + password + optional 2FA)
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'One-time code', type: 'text' },
        trustDevice: { label: 'Trust device', type: 'text' },
        rememberMe: { label: 'Remember me', type: 'text' },
        deviceToken: { label: 'Device token', type: 'text' },
      },
      async authorize(credentials, _req) {
        const emailRaw = credentials?.email;
        const password = credentials?.password;
        const otp = credentials?.token;
        const trustDevice = credentials?.trustDevice === 'true';
        const rememberMe = credentials?.rememberMe === 'true';
        const deviceToken = credentials?.deviceToken;

        if (!emailRaw || !password) {
          throw new Error('INVALID_CREDENTIALS');
        }

        const email = normalizeEmail(emailRaw);
        const user = await prisma.authUser.findUnique({ where: { email } });
        
        if (!user) {
          throw new Error('INVALID_CREDENTIALS');
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
          throw new Error('INVALID_CREDENTIALS');
        }

        // 2FA logic
        if (user.twoFactorEnabled) {
          if (!user.twoFactorSecretEnc) {
            throw new Error('INVALID_CREDENTIALS');
          }

          // Check if device is trusted
          if (deviceToken) {
            const isTrusted = await verifyTrustedDevice(user.id, deviceToken);
            if (isTrusted) {
              // Skip 2FA for trusted device
              await clearRateLimitOnSuccess(email, 'login');
              return {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                rememberMe: rememberMe ? 'true' : 'false',
                deviceToken,
              };
            }
          }

          // Require OTP
          if (!otp || otp.trim().length === 0) {
            throw new Error('2FA_REQUIRED');
          }

          const secret = decryptTotpSecret(user.twoFactorSecretEnc);
          const result = verifySync({ strategy: 'totp', secret, token: otp.trim() });
          const otpOk = !!(result as { valid?: boolean }).valid;
          
          if (!otpOk) {
            throw new Error('INVALID_OTP');
          }

          // Create trusted device token if requested
          let newDeviceToken = deviceToken;
          if (trustDevice && !deviceToken) {
            newDeviceToken = await createTrustedDevice(user.id, 'Web Browser');
          }

          await clearRateLimitOnSuccess(email, 'login');
          return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            rememberMe: rememberMe ? 'true' : 'false',
            deviceToken: newDeviceToken,
          };
        }

        // No 2FA - simple success
        await clearRateLimitOnSuccess(email, 'login');
        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          rememberMe: rememberMe ? 'true' : 'false',
        };
      },
    }),

    // Email magic link provider
    ...(getSmtpConfig()
      ? [
          EmailProvider({
            ...getSmtpConfig()!,
            maxAge: 15 * 60, // 15 minutes
          }),
        ]
      : []),

    // OAuth providers
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
    
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
    
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth/Email providers, ensure user exists in AuthUser table
      if (account?.provider !== 'credentials' && user.email) {
        const email = normalizeEmail(user.email);
        const existingAuthUser = await prisma.authUser.findUnique({ where: { email } });
        
        if (!existingAuthUser) {
          // Create AuthUser for OAuth/magic link users
          await prisma.authUser.create({
            data: {
              id: user.id,
              email,
              name: user.name || null,
              passwordHash: '', // No password for OAuth/magic link users
              twoFactorEnabled: false,
            },
          });
        }
      }
      return true;
    },
    
    async jwt({ token, user }) {
      if (user?.id) {
        (token as JWT & { uid?: string; rememberMe?: string; deviceToken?: string }).uid = user.id;
        (token as JWT & { uid?: string; rememberMe?: string; deviceToken?: string }).rememberMe = 
          (user as typeof user & { rememberMe?: string }).rememberMe;
        (token as JWT & { uid?: string; rememberMe?: string; deviceToken?: string }).deviceToken = 
          (user as typeof user & { deviceToken?: string }).deviceToken;
      }
      return token;
    },
    
    async session({ session, token }) {
      const uid = (token as JWT & { uid?: string }).uid || token.sub;
      const deviceToken = (token as JWT & { deviceToken?: string }).deviceToken;
      
      if (uid) {
        (session as Session & { uid?: string; deviceToken?: string }).uid = uid;
      }
      if (deviceToken) {
        (session as Session & { uid?: string; deviceToken?: string }).deviceToken = deviceToken;
      }
      
      // Extend session for "remember me"
      const rememberMe = (token as JWT & { rememberMe?: string }).rememberMe === 'true';
      if (rememberMe) {
        const extendedExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        (session as Session & { expires: string }).expires = extendedExpiry.toISOString();
      }
      
      return session;
    },
  },
  
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed in: ${user.email}`);
      }
    },
  },
};

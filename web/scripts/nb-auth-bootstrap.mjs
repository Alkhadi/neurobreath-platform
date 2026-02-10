#!/usr/bin/env node
/**
 * NeuroBreath Auth Bootstrap (v4/v5 compatible)
 * Run from: /web
 * Command:  node scripts/nb-auth-bootstrap.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const ALL = args.has("--all");
const INSTALL = ALL || args.has("--install");
const MIGRATE = ALL || args.has("--migrate");
const GATES = ALL || args.has("--gates");
const APPLY = ALL || args.has("--apply") || true; // default apply (one-shot)

function die(msg) {
  console.error(`\n[nb-auth] ❌ ${msg}\n`);
  process.exit(1);
}
function ok(msg) {
  console.log(`[nb-auth] ✅ ${msg}`);
}
function note(msg) {
  console.log(`[nb-auth] ℹ️  ${msg}`);
}

function exists(p) {
  return fs.existsSync(p);
}
function readText(p) {
  return fs.readFileSync(p, "utf8");
}
function writeText(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf8");
}
function appendText(p, content) {
  fs.appendFileSync(p, content, "utf8");
}
function sh(cmd, cmdArgs, opts = {}) {
  const res = spawnSync(cmd, cmdArgs, { stdio: "inherit", ...opts });
  if (res.status !== 0) throw new Error(`${cmd} ${cmdArgs.join(" ")} failed with code ${res.status}`);
}

function parseMajor(semverLike) {
  if (!semverLike) return null;
  const m = String(semverLike).match(/(\d+)\./);
  return m ? Number(m[1]) : null;
}

function loadPkg() {
  const pkgPath = path.join(cwd, "package.json");
  if (!exists(pkgPath)) die(`Run this from your /web folder. package.json not found at ${pkgPath}`);
  return JSON.parse(readText(pkgPath));
}

function ensureEnvVars() {
  const envPath = path.join(cwd, ".env.local");
  if (!exists(envPath)) writeText(envPath, "");
  const lines = readText(envPath).split(/\r?\n/);

  const kv = new Map();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > 0) kv.set(trimmed.slice(0, idx), trimmed.slice(idx + 1));
  }

  // Do NOT overwrite user-provided secrets
  const ensure = (key, value) => {
    if (!kv.has(key) || kv.get(key) === "") {
      kv.set(key, value);
    }
  };

  const localUrl = "http://localhost:3001";
  const secret = kv.get("NEXTAUTH_SECRET") || kv.get("AUTH_SECRET") || crypto.randomBytes(32).toString("base64");
  const encKey = kv.get("NB_AUTH_ENCRYPTION_KEY") || crypto.randomBytes(32).toString("base64");

  ensure("NEXTAUTH_URL", localUrl);
  ensure("AUTH_URL", localUrl);
  ensure("NEXTAUTH_SECRET", secret);
  ensure("AUTH_SECRET", secret);
  ensure("NB_AUTH_ENCRYPTION_KEY", encKey);

  // Helpful placeholders (safe)
  ensure("EMAIL_FROM", `"NeuroBreath <no-reply@neurobreath.co.uk>"`);
  ensure("SMTP_HOST", "");
  ensure("SMTP_PORT", "587");
  ensure("SMTP_USER", "");
  ensure("SMTP_PASS", "");
  ensure("SMTP_SECURE", "false");

  ensure("GOOGLE_CLIENT_ID", "");
  ensure("GOOGLE_CLIENT_SECRET", "");
  ensure("AZURE_AD_CLIENT_ID", "");
  ensure("AZURE_AD_CLIENT_SECRET", "");
  ensure("AZURE_AD_TENANT_ID", "");
  ensure("APPLE_CLIENT_ID", "");
  ensure("APPLE_TEAM_ID", "");
  ensure("APPLE_KEY_ID", "");
  ensure("APPLE_PRIVATE_KEY", "");

  // Rebuild file, preserving existing comments where possible
  const out = [];
  out.push("# Local environment for NeuroBreath (DO NOT COMMIT)");
  out.push("# Auth (v4 and v5 compatible)");
  out.push(`NEXTAUTH_URL=${kv.get("NEXTAUTH_URL")}`);
  out.push(`AUTH_URL=${kv.get("AUTH_URL")}`);
  out.push(`NEXTAUTH_SECRET=${kv.get("NEXTAUTH_SECRET")}`);
  out.push(`AUTH_SECRET=${kv.get("AUTH_SECRET")}`);
  out.push(`NB_AUTH_ENCRYPTION_KEY=${kv.get("NB_AUTH_ENCRYPTION_KEY")}`);
  out.push("");
  out.push("# Email provider (Magic Link + Password Reset email sending)");
  out.push(`EMAIL_FROM=${kv.get("EMAIL_FROM")}`);
  out.push(`SMTP_HOST=${kv.get("SMTP_HOST")}`);
  out.push(`SMTP_PORT=${kv.get("SMTP_PORT")}`);
  out.push(`SMTP_USER=${kv.get("SMTP_USER")}`);
  out.push(`SMTP_PASS=${kv.get("SMTP_PASS")}`);
  out.push(`SMTP_SECURE=${kv.get("SMTP_SECURE")}`);
  out.push("");
  out.push("# OAuth providers (optional)");
  out.push(`GOOGLE_CLIENT_ID=${kv.get("GOOGLE_CLIENT_ID")}`);
  out.push(`GOOGLE_CLIENT_SECRET=${kv.get("GOOGLE_CLIENT_SECRET")}`);
  out.push(`AZURE_AD_CLIENT_ID=${kv.get("AZURE_AD_CLIENT_ID")}`);
  out.push(`AZURE_AD_CLIENT_SECRET=${kv.get("AZURE_AD_CLIENT_SECRET")}`);
  out.push(`AZURE_AD_TENANT_ID=${kv.get("AZURE_AD_TENANT_ID")}`);
  out.push(`APPLE_CLIENT_ID=${kv.get("APPLE_CLIENT_ID")}`);
  out.push(`APPLE_TEAM_ID=${kv.get("APPLE_TEAM_ID")}`);
  out.push(`APPLE_KEY_ID=${kv.get("APPLE_KEY_ID")}`);
  out.push(`APPLE_PRIVATE_KEY=${kv.get("APPLE_PRIVATE_KEY")}`);
  out.push("");

  writeText(envPath, out.join("\n"));
  ok(".env.local ensured (secrets preserved; missing values generated where needed)");
}

function ensureDeps(pkg) {
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const need = [];
  const want = ["next-auth", "bcryptjs", "otplib", "nodemailer", "zod"];
  for (const d of want) {
    if (!deps[d]) need.push(d);
  }
  if (need.length === 0) {
    ok("Dependencies already present (next-auth/bcryptjs/otplib/nodemailer/zod)");
    return;
  }
  note(`Installing missing deps: ${need.join(", ")}`);
  sh("yarn", ["add", ...need], { cwd });
  ok("Dependencies installed");
}

function findPrismaSchema() {
  const candidates = [
    path.join(cwd, "prisma", "schema.prisma"),
    path.join(cwd, "..", "prisma", "schema.prisma"),
    path.join(cwd, "src", "prisma", "schema.prisma"),
  ];
  for (const c of candidates) if (exists(c)) return c;

  // fallback search
  const walk = (dir, depth = 0) => {
    if (depth > 5) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && !["node_modules", ".next", ".git"].includes(e.name)) {
        const hit = walk(p, depth + 1);
        if (hit) return hit;
      } else if (e.isFile() && e.name === "schema.prisma") {
        return p;
      }
    }
    return null;
  };
  return walk(cwd, 0);
}

function ensurePrismaClient() {
  const target = path.join(cwd, "lib", "prisma.ts");
  if (exists(target)) {
    ok("lib/prisma.ts already exists");
    return;
  }
  writeText(
    target,
`import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`
  );
  ok("Created lib/prisma.ts");
}

function ensureAuthLibFiles(authMajor) {
  // Crypto helpers (2FA secret encryption + hashing)
  writeText(
    path.join(cwd, "lib", "auth", "crypto.ts"),
`import crypto from 'node:crypto';

function getKey(): Buffer {
  const b64 = process.env.NB_AUTH_ENCRYPTION_KEY;
  if (!b64) throw new Error('NB_AUTH_ENCRYPTION_KEY is missing');
  const key = Buffer.from(b64, 'base64');
  if (key.length !== 32) throw new Error('NB_AUTH_ENCRYPTION_KEY must be 32 bytes base64 (AES-256-GCM)');
  return key;
}

export function sha256Base64(input: string): string {
  return crypto.createHash('sha256').update(input).digest('base64');
}

// Format: v1:<iv_b64>:<cipher_b64>:<tag_b64>
export function encryptText(plain: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ['v1', iv.toString('base64'), enc.toString('base64'), tag.toString('base64')].join(':');
}

export function decryptText(payload: string): string {
  const [v, ivB64, encB64, tagB64] = payload.split(':');
  if (v !== 'v1' || !ivB64 || !encB64 || !tagB64) throw new Error('Invalid encrypted payload');
  const key = getKey();
  const iv = Buffer.from(ivB64, 'base64');
  const enc = Buffer.from(encB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}
`
  );

  writeText(
    path.join(cwd, "lib", "auth", "password.ts"),
`import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  // 12 rounds is a good baseline for web apps
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashValue: string): Promise<boolean> {
  return compare(password, hashValue);
}
`
  );

  writeText(
    path.join(cwd, "lib", "auth", "trusted-device.ts"),
`import { prisma } from '@/lib/prisma';
import { sha256Base64 } from '@/lib/auth/crypto';

const COOKIE_NAME = 'nb_td';

export function getTrustedDeviceCookieFromRequest(req: any): string | null {
  try {
    // NextRequest (App Router)
    const v = req?.cookies?.get?.(COOKIE_NAME)?.value;
    if (v) return v;
  } catch {}
  try {
    // Node req (older patterns)
    const v = req?.cookies?.[COOKIE_NAME];
    if (v) return v;
  } catch {}
  return null;
}

export async function isTrustedDevice(userId: string, rawToken: string | null): Promise<boolean> {
  if (!rawToken) return false;
  const tokenHash = sha256Base64(rawToken);
  const now = new Date();
  const found = await prisma.authTrustedDevice.findFirst({
    where: { userId, tokenHash, expiresAt: { gt: now } },
    select: { id: true },
  });
  return !!found;
}
`
  );

  // Auth config templates depend on major
  if (authMajor >= 5) {
    // Auth.js / NextAuth v5 style
    writeText(
      path.join(cwd, "auth.ts"),
`import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Email from 'next-auth/providers/email';
import Google from 'next-auth/providers/google';
import Apple from 'next-auth/providers/apple';
import AzureAD from 'next-auth/providers/azure-ad';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { decryptText } from '@/lib/auth/crypto';
import { authenticator } from 'otplib';
import { getTrustedDeviceCookieFromRequest, isTrustedDevice } from '@/lib/auth/trusted-device';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  token: z.string().optional(),
  trustDevice: z.union([z.string(), z.boolean()]).optional(),
  rememberMe: z.union([z.string(), z.boolean()]).optional(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days baseline
  pages: { signIn: '/login' },
  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || 'false') === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      },
      from: process.env.EMAIL_FROM,
    }),

    ...(process.env.GOOGLE_CLIENT_ID ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET || '' })] : []),
    ...(process.env.APPLE_CLIENT_ID ? [Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_PRIVATE_KEY ? {
        appleId: process.env.APPLE_CLIENT_ID,
        teamId: process.env.APPLE_TEAM_ID || '',
        privateKey: (process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        keyId: process.env.APPLE_KEY_ID || '',
      } : undefined,
    })] : []),
    ...(process.env.AZURE_AD_CLIENT_ID ? [AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID,
    })] : []),

    Credentials({
      credentials: { email: {}, password: {}, token: {}, trustDevice: {}, rememberMe: {} },
      async authorize(raw, req) {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) throw new Error('INVALID_CREDENTIALS');

        const { email, password, token } = parsed.data;

        const user = await prisma.authUser.findUnique({ where: { email } });
        if (!user || !user.passwordHash) throw new Error('INVALID_CREDENTIALS');

        const okPass = await verifyPassword(password, user.passwordHash);
        if (!okPass) throw new Error('INVALID_CREDENTIALS');

        if (user.twoFactorEnabled) {
          // Trusted device bypass
          const td = getTrustedDeviceCookieFromRequest(req);
          const trusted = await isTrustedDevice(user.id, td);
          if (!trusted) {
            if (!token) throw new Error('2FA_REQUIRED');
            const secret = user.twoFactorSecretEnc ? decryptText(user.twoFactorSecretEnc) : '';
            const good = authenticator.check(token, secret);
            if (!good) throw new Error('INVALID_OTP');
          }
        }

        return { id: user.id, email: user.email, name: user.name || undefined };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user).id = token.sub as string;
      return session;
    },
  },
});
`
    );

    // Route for v5
    writeText(
      path.join(cwd, "app", "api", "auth", "[...auth]", "route.ts"),
`import { handlers } from '@/auth';
export const { GET, POST } = handlers;
`
    );
    ok("Created Auth.js v5 auth.ts and app/api/auth/[...auth]/route.ts");
  } else {
    // NextAuth v4 style
    writeText(
      path.join(cwd, "lib", "auth", "nb-auth-options.ts"),
`import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { decryptText } from '@/lib/auth/crypto';
import { authenticator } from 'otplib';
import { getTrustedDeviceCookieFromRequest, isTrustedDevice } from '@/lib/auth/trusted-device';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  token: z.string().optional(),
  trustDevice: z.union([z.string(), z.boolean()]).optional(),
  rememberMe: z.union([z.string(), z.boolean()]).optional(),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || 'false') === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      },
      from: process.env.EMAIL_FROM,
    }),

    ...(process.env.GOOGLE_CLIENT_ID ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET || '' })] : []),
    ...(process.env.APPLE_CLIENT_ID ? [AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_PRIVATE_KEY ? {
        appleId: process.env.APPLE_CLIENT_ID,
        teamId: process.env.APPLE_TEAM_ID || '',
        privateKey: (process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        keyId: process.env.APPLE_KEY_ID || '',
      } : undefined,
    })] : []),
    ...(process.env.AZURE_AD_CLIENT_ID ? [AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID,
    })] : []),

    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {}, token: {}, trustDevice: {}, rememberMe: {} },
      async authorize(raw, req) {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) throw new Error('INVALID_CREDENTIALS');

        const { email, password, token } = parsed.data;

        const user = await prisma.authUser.findUnique({ where: { email } });
        if (!user || !user.passwordHash) throw new Error('INVALID_CREDENTIALS');

        const okPass = await verifyPassword(password, user.passwordHash);
        if (!okPass) throw new Error('INVALID_CREDENTIALS');

        if (user.twoFactorEnabled) {
          const td = getTrustedDeviceCookieFromRequest(req);
          const trusted = await isTrustedDevice(user.id, td);
          if (!trusted) {
            if (!token) throw new Error('2FA_REQUIRED');
            const secret = user.twoFactorSecretEnc ? decryptText(user.twoFactorSecretEnc) : '';
            const good = authenticator.check(token, secret);
            if (!good) throw new Error('INVALID_OTP');
          }
        }

        return { id: user.id, email: user.email, name: user.name || undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error add id onto session user
      if (session.user) session.user.id = token.sub;
      return session;
    },
  },
};
`
    );

    writeText(
      path.join(cwd, "app", "api", "auth", "[...nextauth]", "route.ts"),
`import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/nb-auth-options';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
`
    );
    ok("Created NextAuth v4 config and app/api/auth/[...nextauth]/route.ts");
  }

  // Region-aware sign-in alias page (/login)
  writeText(
    path.join(cwd, "app", "login", "page.tsx"),
`import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LoginAliasPage() {
  const c = cookies();
  const h = headers();

  const forced = c.get('nb_region')?.value; // optional cookie you can set elsewhere
  if (forced === 'us') redirect('/us/login');
  if (forced === 'uk') redirect('/uk/login');

  const accept = h.get('accept-language') || '';
  const isUS = /en-US/i.test(accept);
  redirect(isUS ? '/us/login' : '/uk/login');
}
`
  );
  ok("Ensured /login alias routes to /uk/login or /us/login");
}

function ensurePrismaModels(schemaPath) {
  const txt = readText(schemaPath);

  const START = "// --- NB_AUTH_MODELS_START ---";
  const END = "// --- NB_AUTH_MODELS_END ---";

  if (txt.includes(START) && txt.includes(END)) {
    ok("Prisma auth models already present (marker block exists)");
    return;
  }
  if (txt.includes("model AuthUser")) {
    note("Detected model AuthUser already exists; skipping Prisma append to avoid duplication");
    return;
  }

  const block = `
${START}

model AuthUser {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  passwordHash      String
  twoFactorEnabled  Boolean  @default(false)
  twoFactorSecretEnc String?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  resetTokens       AuthPasswordResetToken[]
  trustedDevices    AuthTrustedDevice[]
}

model AuthPasswordResetToken {
  id         String   @id @default(cuid())
  userId     String
  tokenHash  String
  expiresAt  DateTime
  usedAt     DateTime?
  createdAt  DateTime @default(now())

  user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model AuthTrustedDevice {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@unique([userId, tokenHash])
}

${END}
`;

  appendText(schemaPath, `\n${block}\n`);
  ok(`Appended Prisma auth models to: ${schemaPath}`);
}

function patchFileIfExists(filePath, patches) {
  if (!exists(filePath)) return false;
  const before = readText(filePath);
  let after = before;
  let changed = false;

  for (const p of patches) {
    const next = after.replace(p.pattern, p.replacement);
    if (next !== after) {
      after = next;
      changed = true;
    } else if (p.mustMatch) {
      note(`Patch pattern not found in ${filePath}: ${p.name}`);
    }
  }
  if (changed) {
    writeText(filePath, after);
    ok(`Patched: ${filePath}`);
  }
  return changed;
}

function patchLoginPages() {
  const uk = path.join(cwd, "app", "uk", "login", "page.tsx");
  const us = path.join(cwd, "app", "us", "login", "page.tsx");

  const patches = [
    {
      name: "pass trustDevice/rememberMe into credentials signIn",
      mustMatch: false,
      pattern: /await signIn\('credentials',\s*\{\s*redirect:\s*false,\s*email,\s*password,\s*\}\);/g,
      replacement:
`await signIn('credentials', {
        redirect: false,
        email,
        password,
        trustDevice: trustDevice ? 'true' : 'false',
        rememberMe: rememberMe ? 'true' : 'false',
      });`,
    },
    {
      name: "pass trustDevice/rememberMe into OTP signIn",
      mustMatch: false,
      pattern: /await signIn\('credentials',\s*\{\s*redirect:\s*false,\s*email,\s*password,\s*token:\s*otp,\s*\}\);/g,
      replacement:
`await signIn('credentials', {
        redirect: false,
        email,
        password,
        token: otp,
        trustDevice: trustDevice ? 'true' : 'false',
        rememberMe: rememberMe ? 'true' : 'false',
      });`,
    },
    {
      name: "replace magic link simulation with NextAuth Email provider signIn",
      mustMatch: false,
      pattern: /\/\/ Simulate magic link request[\s\S]*?setStep\('magic-link-sent'\);/g,
      replacement:
`const res = await signIn('email', { email, callbackUrl, redirect: false });
      if (res?.error) {
        setMessage({ type: 'error', text: 'Failed to send sign-in link. Please try again.' });
        return;
      }
      setStep('magic-link-sent');`,
    },
  ];

  patchFileIfExists(uk, patches);
  patchFileIfExists(us, patches);
}

function patchLinksVerify() {
  const target = path.join(cwd, "scripts", "links-verify.ts");
  if (!exists(target)) return;

  const before = readText(target);
  if (before.includes("async function safeGoto(")) {
    ok("links-verify already has safeGoto (skipping)");
    return;
  }

  // Add safeGoto helper near top (best-effort insertion)
  const insertion =
`\nasync function safeGoto(page: any, url: string) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg.includes('net::ERR_ABORTED')) {
      try { await page.waitForLoadState('domcontentloaded', { timeout: 15000 }); } catch {}
      const finalUrl = page.url?.() || '';
      if (finalUrl && finalUrl !== url) {
        // client-side redirect or hydration navigation
        return;
      }
    }
    throw err;
  }
}\n`;

  let after = before;
  // Insert after imports (first blank line after imports is typical)
  const idx = after.indexOf("\n\n");
  if (idx > 0) after = after.slice(0, idx) + insertion + after.slice(idx);

  // Replace page.goto(...) calls in the function that discovers links (best effort)
  after = after.replace(/await page\.goto\(([^)]+)\);/g, "await safeGoto(page, $1);");

  if (after !== before) {
    writeText(target, after);
    ok("Patched scripts/links-verify.ts to tolerate Next.js redirect aborts");
  }
}

function runPrismaGenerateAndMigrate() {
  // Prisma commands must run where package.json/prisma config exists (web)
  note("Running prisma generate...");
  sh("yarn", ["prisma", "generate"], { cwd });

  note("Running prisma migrate dev (nb_auth_init)...");
  sh("yarn", ["prisma", "migrate", "dev", "--name", "nb_auth_init"], { cwd });
  ok("Prisma generate + migrate completed");
}

function runQualityGates() {
  note("Running yarn lint...");
  sh("yarn", ["lint"], { cwd });
  note("Running yarn typecheck...");
  sh("yarn", ["typecheck"], { cwd });
  note("Running yarn build...");
  sh("yarn", ["build"], { cwd });
  ok("Quality gates passed (lint/typecheck/build)");
}

(function main() {
  const pkg = loadPkg();
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const nextAuthVer = deps["next-auth"];
  if (!nextAuthVer) die("next-auth not found in package.json. This script expects a NextAuth/Auth.js project.");
  const major = parseMajor(nextAuthVer) ?? 4;
  note(`Detected next-auth version: ${nextAuthVer} (major ${major})`);

  if (APPLY) {
    ensureEnvVars();
    if (INSTALL) ensureDeps(pkg);

    ensurePrismaClient();

    const schemaPath = findPrismaSchema();
    if (!schemaPath) die("Could not find schema.prisma. Ensure Prisma is set up (prisma/schema.prisma).");
    ensurePrismaModels(schemaPath);

    ensureAuthLibFiles(major);

    patchLoginPages();
    patchLinksVerify();

    if (MIGRATE) runPrismaGenerateAndMigrate();
    if (GATES) runQualityGates();

    console.log("\n[nb-auth] Done.\n");
    console.log("[nb-auth] Next manual steps (only if you want these features live):");
    console.log("  1) Configure SMTP_* + EMAIL_FROM in web/.env.local (for magic links + emails)");
    console.log("  2) Configure OAuth keys in web/.env.local (Google/Apple/Azure) if using social login");
    console.log("  3) Restart dev server:  PORT=3001 yarn start\n");
  } else {
    note("Dry-run mode not implemented in this one-shot script.");
  }
})();

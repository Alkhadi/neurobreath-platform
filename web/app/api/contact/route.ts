import { z } from "zod";
import { Resend } from "resend";

export const runtime = "nodejs";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
};

// ---- Config
// NOTE: Do not construct the Resend client at module scope.
// Next.js may evaluate route modules during build, and Resend throws if the API key is missing.

// In-memory rate limit (baseline). For stronger multi-region limiting, replace with Redis/KV.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 5; // max submissions per IP per window
const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  // Vercel provides x-forwarded-for. If you also proxy through Cloudflare, CF-Connecting-IP may exist.
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return "0.0.0.0";
  return xff.split(",")[0]?.trim() || "0.0.0.0";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_MAX - 1 };
  }

  if (entry.count >= RATE_MAX) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  rateMap.set(ip, entry);
  return { allowed: true, remaining: RATE_MAX - entry.count };
}

const Schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  subject: z.string().min(2).max(140),
  message: z.string().min(10).max(5000),

  // Optional metadata
  organization: z.preprocess(
    (v) => (typeof v === "string" && v.trim().length === 0 ? undefined : v),
    z.string().max(200).optional()
  ),
  phone: z.preprocess(
    (v) => (typeof v === "string" && v.trim().length === 0 ? undefined : v),
    z.string().max(50).optional()
  ),

  // Honeypot (bots fill it)
  company: z.preprocess(
    (v) => (typeof v === "string" && v.trim().length === 0 ? undefined : v),
    z.string().max(200).optional()
  ),

  // Turnstile token from client
  turnstileToken: z.string().min(10),
});

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, error: "Missing TURNSTILE_SECRET_KEY" } as const;

  // Cloudflare Siteverify API (server-side only).
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (ip && ip !== "0.0.0.0") form.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const data = (await res.json().catch(() => null)) as TurnstileVerifyResponse | null;
  return { ok: !!data?.success, data } as const;
}

export function GET() {
  return Response.json(
    {
      ok: true,
      route: "/api/contact",
      methods: ["POST"],
      note: "Send a POST request to submit the contact form.",
      ts: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate limit first (cheap)
    const rl = rateLimit(ip);
    if (!rl.allowed) {
      const retryAfterSeconds = Math.ceil((rl.retryAfterMs || 0) / 1000);
      return Response.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    const body: unknown = await req.json().catch(() => null);
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
    }

    const { name, email, subject, message, organization, phone, company, turnstileToken } = parsed.data;

    // Honeypot: silently accept, but do not send
    if (company && company.trim().length > 0) {
      return Response.json({ ok: true });
    }

    // Turnstile validation (strict anti-spam)
    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.ok) {
      if (turnstile.error === "Missing TURNSTILE_SECRET_KEY") {
        return Response.json(
          { ok: false, error: "Spam protection is not configured yet. Please try again later." },
          { status: 500 }
        );
      }
      return Response.json(
        { ok: false, error: "Verification failed. Please try again." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ ok: false, error: "Server email is not configured" }, { status: 500 });
    }

    // Check if we're in development mode and SKIP_EMAIL_SEND is set
    const skipEmailInDev = process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_SEND === "true";
    
    if (skipEmailInDev) {
      console.log("DEV MODE: Skipping actual email send. Contact data:", {
        name,
        email,
        subject,
        organization,
        phone,
        message: message.substring(0, 100),
      });
      return Response.json({ ok: true, dev: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const to = process.env.CONTACT_TO || "info@neurobreath.co.uk";
    const from = process.env.CONTACT_FROM || "NeuroBreath Support <onboarding@resend.dev>";

    // 1) Send to your support inbox
    const adminSend = await resend.emails.send({
      from,
      to,
      subject: `[Contact] ${subject}`,
      replyTo: email,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        (organization ? `Organisation: ${organization}\n` : "") +
        (phone ? `Phone: ${phone}\n` : "") +
        `IP: ${ip}\n\n` +
        `${message}`,
    });

    if (adminSend.error) {
      console.error("Resend API error:", JSON.stringify(adminSend.error, null, 2));
      
      // Provide user-friendly error messages based on common Resend errors
      let userMessage = "Email send failed. ";
      
      if (adminSend.error.message?.includes("domain") || adminSend.error.message?.includes("verify")) {
        userMessage += "The email service is not properly configured. Please contact support.";
      } else if (adminSend.error.message?.includes("API key")) {
        userMessage += "Email service authentication failed. Please contact support.";
      } else {
        userMessage += adminSend.error.message || "Please try again later.";
      }
      
      return Response.json(
        { 
          ok: false, 
          error: userMessage
        }, 
        { status: 500 }
      );
    }

    console.log("Admin email sent successfully:", adminSend.data?.id);

    // 2) Auto-responder to the user (best-effort)
    await resend.emails.send({
      from,
      to: email,
      subject: "We received your message — NeuroBreath",
      text:
        `Hello ${name},\n\n` +
        `Thank you for contacting NeuroBreath. We have received your message and will reply as soon as possible.\n\n` +
        `Your subject: ${subject}\n\n` +
        `Kind regards,\nNeuroBreath Support`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return Response.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}

import { z } from "zod";
import { Resend } from "resend";
import { randomBytes } from "crypto";

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

function stripNewlines(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

async function readRequestBody(req: Request): Promise<Record<string, unknown> | null> {
  const contentType = (req.headers.get("content-type") ?? "").toLowerCase();

  if (contentType.includes("application/json")) {
    const json = (await req.json().catch(() => null)) as unknown;
    return isRecord(json) ? json : null;
  }

  // Handles both multipart/form-data and application/x-www-form-urlencoded.
  const form = await req.formData().catch(() => null);
  if (!form) return null;

  const obj: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    obj[key] = typeof value === "string" ? value : "";
  }
  return obj;
}

function pickString(raw: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const v = raw[key];
    if (typeof v === "string") return v;
  }
  return "";
}

function normalizeContactPayload(raw: Record<string, unknown>) {
  return {
    name: pickString(raw, ["name", "fullName", "fullname"]),
    email: pickString(raw, ["email", "from"]),
    subject: pickString(raw, ["subject", "topic"]),
    message: pickString(raw, ["message", "content", "body"]),
    organization: pickString(raw, ["organization", "organisation", "org"]),
    phone: pickString(raw, ["phone", "tel", "telephone"]),

    // Honeypots: accept both current and older client field names.
    company: pickString(raw, ["company", "company_confirm", "nb_hp_company"]),
    website: pickString(raw, ["website", "website_confirm", "nb_hp_website"]),

    // Turnstile: accept common field names.
    turnstileToken: pickString(raw, ["turnstileToken", "cf-turnstile-response", "turnstile_token"]),
  };
}

function formatYmd(date: Date) {
  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function generateTicketId(now = new Date()) {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const bytes = randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `NB-${formatYmd(now)}-${code}`;
}

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
  name: z.preprocess((v) => stripNewlines(String(v ?? "")), z.string().min(1).max(80)),
  email: z.preprocess((v) => stripNewlines(String(v ?? "")), z.string().email().max(254)),
  subject: z.preprocess(
    (v) => {
      const s = stripNewlines(String(v ?? ""));
      return s.length > 0 ? s : "General enquiry";
    },
    z.string().min(1).max(120)
  ),
  message: z.preprocess((v) => String(v ?? "").trim(), z.string().min(5).max(4000)),

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

  // Honeypot (bots fill it)
  website: z.preprocess(
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

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const data = (await res.json().catch(() => null)) as TurnstileVerifyResponse | null;
    
    if (!data?.success) {
      const errorCodes = data?.["error-codes"]?.join(", ") || "Unknown error";
      console.warn("Turnstile verification failed:", { errorCodes, token: token.substring(0, 10) });
      return { ok: false, error: errorCodes, data } as const;
    }

    return { ok: true, data } as const;
  } catch (err) {
    console.error("Turnstile verification network error:", err);
    return { ok: false, error: "Verification service unreachable" } as const;
  }
}

export function GET() {
  return Response.json(
    {
      ok: true,
      route: "/api/contact",
      methods: ["POST"],
      note: "Send a POST request to submit the contact form.",
      env: {
        hasResendApiKey: !!process.env.RESEND_API_KEY,
        hasTurnstileSecretKey: !!process.env.TURNSTILE_SECRET_KEY,
        hasTurnstileSiteKey: !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        hasContactTo: !!process.env.CONTACT_TO,
        hasContactFrom: !!process.env.CONTACT_FROM,
      },
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
    const ticketId = generateTicketId();
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

    const raw = await readRequestBody(req);
    if (!raw) {
      return Response.json(
        {
          ok: false,
          error: "Invalid form data",
          ...(process.env.NODE_ENV !== "production"
            ? { dev: { hint: "Empty or unreadable request body", contentType: req.headers.get("content-type") } }
            : {}),
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const body = normalizeContactPayload(raw);
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: "Invalid form data",
          ...(process.env.NODE_ENV !== "production"
            ? { fieldErrors: parsed.error.flatten().fieldErrors, receivedKeys: Object.keys(raw) }
            : {}),
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const { name, email, subject, message, organization, phone, company, website, turnstileToken } = parsed.data;

    // Honeypot: reject if filled
    if ((company && company.trim().length > 0) || (website && website.trim().length > 0)) {
      return Response.json({ ok: false, error: "Invalid form data" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    // Turnstile validation (strict anti-spam)
    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.ok) {
      if (turnstile.error === "Missing TURNSTILE_SECRET_KEY") {
        return Response.json(
          { ok: false, error: "Spam protection is not configured yet. Please try again later." },
          { status: 500, headers: { "Cache-Control": "no-store" } }
        );
      }
      
      // Check for common Turnstile error codes
      const errorStr = turnstile.error?.toLowerCase() || "";
      let userMessage = "Verification failed. Please try again.";
      
      if (errorStr.includes("domain")) {
        userMessage = "The contact form is not properly configured for this domain. Please try again later or contact support.";
      } else if (errorStr.includes("timeout")) {
        userMessage = "Verification timed out. Please try again.";
      } else if (errorStr.includes("invalid")) {
        userMessage = "Verification token is invalid. Please refresh the page and try again.";
      }
      
      console.warn("Turnstile verification error:", { errorStr, ip });
      return Response.json(
        { ok: false, error: userMessage },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        { ok: false, error: "Server email is not configured" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
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
      return Response.json({ ok: true, dev: true, ticketId, adminEmailId: "dev" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const to = process.env.CONTACT_TO || "info@neurobreath.co.uk";
    const from = process.env.CONTACT_FROM || "NeuroBreath Support <onboarding@resend.dev>";

    // 1) Send to your support inbox
    const adminSend = await resend.emails.send({
      from,
      to,
      subject: `[Contact] ${subject} (${ticketId})`,
      replyTo: email,
      text:
        `Ticket: ${ticketId}\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Subject: ${subject}\n` +
        (organization ? `Organisation: ${organization}\n` : "") +
        (phone ? `Phone: ${phone}\n` : "") +
        `IP: ${ip}\n\n` +
        `${message}`,
    });

    if (adminSend.error) {
      console.error("Resend API error:", JSON.stringify(adminSend.error, null, 2));
      
      // Provide user-friendly error messages based on common Resend errors
      let userMessage = "Email send failed. ";
      const errorMsg = (adminSend.error.message || "").toLowerCase();
      
      if (errorMsg.includes("domain")) {
        userMessage = "Email service domain is not verified. Please contact support (domain error).";
      } else if (errorMsg.includes("verify") || errorMsg.includes("verification")) {
        userMessage = "Email service is not properly verified. Please contact support (verification error).";
      } else if (errorMsg.includes("api key") || errorMsg.includes("authentication")) {
        userMessage = "Email service authentication failed. Please contact support (API error).";
      } else if (errorMsg.includes("invalid email") || errorMsg.includes("invalid_email")) {
        userMessage = "The recipient email address is invalid. Please contact support.";
      } else if (errorMsg.includes("rate limit") || errorMsg.includes("429")) {
        userMessage = "Too many emails sent. Please try again in a few minutes.";
      } else if (adminSend.error.message) {
        userMessage += adminSend.error.message;
      } else {
        userMessage += "Please try again later.";
      }
      
      console.error("Mapped error message:", { original: adminSend.error.message, mapped: userMessage });
      
      return Response.json(
        { 
          ok: false, 
          error: userMessage
        }, 
        { status: 500 }
      );
    }

    console.log("Admin email sent successfully:", adminSend.data?.id);

    const adminEmailId = adminSend.data?.id;
    let autoReplyEmailId: string | undefined;
    let autoReplyWarning = false;

    // 2) Auto-responder to the user (best-effort, non-blocking)
    const autoReplySubject = "We received your message — NeuroBreath";
    const autoReplyText =
      `Hello ${name},\n\n` +
      `We received your message and will respond as soon as possible.\n\n` +
      `If you need to add more details, reply to this email and keep the subject.\n\n` +
      `Reference: ${ticketId}\n\n` +
      `Kind regards,\n` +
      `NeuroBreath Support\n\n` +
      `Privacy note: Please avoid sending sensitive medical information.`;

    const autoReplyHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${autoReplySubject}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:20px;line-height:1.3;">We received your message</h1>
      <p style="margin:0 0 12px 0;">Hello ${name},</p>
      <p style="margin:0 0 12px 0;">We received your message and will respond as soon as possible.</p>
      <p style="margin:0 0 12px 0;">If you need to add more details, reply to this email and keep the subject.</p>
      <div style="margin:16px 0;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
        <strong>Reference:</strong> ${ticketId}
      </div>
      <p style="margin:0 0 12px 0;">Kind regards,<br/>NeuroBreath Support</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
      <p style="margin:0;font-size:12px;line-height:1.4;color:#6b7280;">Privacy note: Please avoid sending sensitive medical information.</p>
    </div>
  </body>
</html>`;

    const supportFrom = "NeuroBreath Support <support@neurobreath.co.uk>";
    const fallbackFrom = "NeuroBreath Support <no-reply@neurobreath.co.uk>";

    try {
      const first = await resend.emails.send({
        from: supportFrom,
        to: email,
        replyTo: "admin@neurobreath.co.uk",
        subject: autoReplySubject,
        text: autoReplyText,
        html: autoReplyHtml,
      });

      if (!first.error) {
        autoReplyEmailId = first.data?.id;
      } else {
        const msg = String(first.error.message || "").toLowerCase();
        const shouldFallback =
          msg.includes("from") ||
          msg.includes("domain") ||
          msg.includes("verify") ||
          msg.includes("verification") ||
          msg.includes("unauthor") ||
          msg.includes("not verified");

        if (shouldFallback) {
          const second = await resend.emails.send({
            from: fallbackFrom,
            to: email,
            replyTo: "admin@neurobreath.co.uk",
            subject: autoReplySubject,
            text: autoReplyText,
            html: autoReplyHtml,
          });

          if (!second.error) {
            autoReplyEmailId = second.data?.id;
          } else {
            autoReplyWarning = true;
            console.warn("Auto-reply failed (non-critical)", {
              ticketId,
              error: second.error,
            });
          }
        } else {
          autoReplyWarning = true;
          console.warn("Auto-reply failed (non-critical)", {
            ticketId,
            error: first.error,
          });
        }
      }
    } catch (err) {
      autoReplyWarning = true;
      console.warn("Auto-reply threw (non-critical)", {
        ticketId,
        error: err instanceof Error ? err.message : err,
      });
    }

    return Response.json({
      ok: true,
      ticketId,
      adminEmailId,
      autoReplyEmailId,
      ...(autoReplyWarning ? { autoReplyWarning: true } : {}),
    });
  } catch (err) {
    console.error("Contact form error:", err);
    
    // Provide helpful error messages based on error type
    let userMessage = "An unexpected error occurred. ";
    
    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      if (msg.includes("fetch") || msg.includes("network")) {
        userMessage += "Network error. Please try again.";
      } else if (msg.includes("json")) {
        userMessage += "Invalid response from server. Please try again.";
      } else {
        userMessage += err.message;
      }
    } else {
      userMessage += "Please try again later.";
    }
    
    return Response.json(
      { 
        ok: false, 
        error: userMessage 
      }, 
      { status: 500 }
    );
  }
}

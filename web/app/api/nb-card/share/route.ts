/**
 * POST /api/nb-card/share
 *
 * Creates a tokenised share snapshot and returns the share token + URL.
 * The token maps to the Universal QR page at /nb-card/s/[token].
 *
 * Request body:
 * {
 *   cardModel: CardModel         — sanitised card data
 *   pngUrl?:   string            — pre-uploaded PNG url (optional)
 *   pdfUrl?:   string            — pre-uploaded PDF url (optional)
 *   deviceId?: string            — anonymous device id
 * }
 *
 * Response:
 * {
 *   token:    string
 *   shareUrl: string
 * }
 *
 * Error responses:
 * 400  — invalid request body
 * 500  — DB error (card data is valid but could not be stored)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma, isDbDown } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Request schema (loose — cardModel content is stored as-is)
// ---------------------------------------------------------------------------

const ShareRequestSchema = z.object({
  cardModel: z.record(z.string(), z.unknown()),
  pngUrl: z.string().url().optional(),
  pdfUrl: z.string().url().optional(),
  deviceId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ShareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cardModel, pngUrl, pdfUrl, deviceId } = parsed.data;

  // Resolve owner identity
  const session = await getServerSession(authOptions).catch(() => null);
  const ownerEmail = session?.user?.email ?? null;

  // Build expiry: 90 days from now
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  // Attempt DB write
  if (isDbDown()) {
    // DB is unavailable — return a degraded response that still allows
    // client-side local QR / download
    return NextResponse.json(
      {
        error: "Share service temporarily unavailable.",
        degraded: true,
      },
      { status: 503 }
    );
  }

  try {
    // Prisma uses camelCase model name for NbCardShare
    const record = await (
      prisma as unknown as {
        nbCardShare: {
          create(args: {
            data: {
              cardModelJson: Record<string, unknown>;
              pngUrl?: string | null;
              pdfUrl?: string | null;
              ownerEmail?: string | null;
              ownerDeviceId?: string | null;
              expiresAt: Date;
            };
          }): Promise<{ token: string }>;
        };
      }
    ).nbCardShare.create({
      data: {
        cardModelJson: cardModel,
        pngUrl: pngUrl ?? null,
        pdfUrl: pdfUrl ?? null,
        ownerEmail: ownerEmail ?? null,
        ownerDeviceId: deviceId ?? null,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? req.nextUrl.origin;
    const shareUrl = `${baseUrl}/nb-card/s/${record.token}`;

    return NextResponse.json({ token: record.token, shareUrl });
  } catch (err) {
    console.error("[nb-card/share] DB error:", err);
    return NextResponse.json(
      { error: "Could not create share link. Please try again." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/nb-card/share?token=<token>
// Fetches an existing share record (used by the share page server-component).
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token is required." }, { status: 400 });
  }

  if (isDbDown()) {
    return NextResponse.json(
      { error: "Share service temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const record = await (
      prisma as unknown as {
        nbCardShare: {
          findUnique(args: {
            where: { token: string };
          }): Promise<{
            token: string;
            cardModelJson: unknown;
            pngUrl: string | null;
            pdfUrl: string | null;
            isPublic: boolean;
            expiresAt: Date | null;
          } | null>;
        };
      }
    ).nbCardShare.findUnique({ where: { token } });

    if (!record) {
      return NextResponse.json({ error: "Share not found." }, { status: 404 });
    }

    // Check expiry
    if (record.expiresAt && record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This share link has expired." },
        { status: 410 }
      );
    }

    if (!record.isPublic) {
      return NextResponse.json({ error: "Share not accessible." }, { status: 403 });
    }

    return NextResponse.json({
      token: record.token,
      cardModel: record.cardModelJson,
      pngUrl: record.pngUrl,
      pdfUrl: record.pdfUrl,
    });
  } catch (err) {
    console.error("[nb-card/share] GET error:", err);
    return NextResponse.json(
      { error: "Could not fetch share." },
      { status: 500 }
    );
  }
}

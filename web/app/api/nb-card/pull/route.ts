/**
 * NB-Card Pull API Endpoint (Phase 7)
 * 
 * GET /api/nb-card/pull?deviceId=xxx
 * Downloads profiles and contacts from server to client
 * 
 * Authentication:
 * - Uses next-auth session (user email) OR anonymous deviceId query param
 * - Fetches records owned by userEmail (signed-in) or deviceId (anonymous)
 * 
 * Merge Strategy (client-side):
 * - Client receives server data and merges with local IndexedDB
 * - Deduplicate by UUID (profileId, contactId)
 * - Prefer most recent updatedAt timestamp
 * - Keep all unique records from both sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma, isDbDown, getDbDownReason } from '@/lib/db';

export const dynamic = 'force-dynamic';

type NBCardProfileRow = {
  profileId: string
  profileData: unknown
  templateData: unknown | null
  version: number
  updatedAt: Date
  createdAt: Date
}

type NBCardContactRow = {
  contactId: string
  contactData: unknown
  version: number
  updatedAt: Date
  createdAt: Date
}

type NBCardPrismaDelegates = {
  nBCardProfile: {
    findMany(args: unknown): Promise<NBCardProfileRow[]>
  }
  nBCardContact: {
    findMany(args: unknown): Promise<NBCardContactRow[]>
  }
}

export async function GET(request: NextRequest) {
  // Check database availability
  if (isDbDown()) {
    return NextResponse.json(
      {
        error: 'Database unavailable',
        dbUnavailable: true,
        dbUnavailableReason: getDbDownReason(),
      },
      { status: 503 }
    );
  }

  try {
    // Get deviceId from query params
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: deviceId' },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase() || null;

    // NOTE: If the editor's Prisma types get temporarily stale, this keeps the
    // API route usable without blocking dev via TS(2339) squiggles.
    const nbPrisma = prisma as unknown as NBCardPrismaDelegates;

    // Fetch profiles
    const profiles = await nbPrisma.nBCardProfile.findMany({
      where: userEmail
        ? { userEmail }
        : { deviceId },
      orderBy: { updatedAt: 'desc' },
    });

    // Fetch contacts
    const contacts = await nbPrisma.nBCardContact.findMany({
      where: userEmail
        ? { userEmail }
        : { deviceId },
      orderBy: { updatedAt: 'desc' },
    });

    // Transform server records to client format
    const profilesPayload = profiles.map((p) => ({
      id: p.profileId,
      profileData: p.profileData,
      templateData: p.templateData,
      version: p.version,
      updatedAt: p.updatedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
    }));

    const contactsPayload = contacts.map((c) => ({
      id: c.contactId,
      contactData: c.contactData,
      version: c.version,
      updatedAt: c.updatedAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      profiles: profilesPayload,
      contacts: contactsPayload,
      userEmail: userEmail || null,
      deviceId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[NBCard Pull] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Pull failed', details: String(error) },
      { status: 500 }
    );
  }
}

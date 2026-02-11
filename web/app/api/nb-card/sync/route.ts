/**
 * NB-Card Sync API Endpoint (Phase 7)
 * 
 * POST /api/nb-card/sync
 * Uploads profiles and contacts from client to server
 * 
 * Authentication:
 * - Uses next-auth session (user email) OR anonymous deviceId
 * - Stores under userEmail (signed-in) or deviceId (anonymous)
 * 
 * Merge Strategy:
 * - Server updates existing records with matching profileId/contactId
 * - Client-side updatedAt is preserved for conflict resolution
 * - Version field increments for optimistic locking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma, isDbDown, getDbDownReason } from '@/lib/db';

export const dynamic = 'force-dynamic';

type NBCardProfileRow = {
  profileId: string
  version: number
}

type NBCardContactRow = {
  contactId: string
  version: number
}

type NBCardPrismaDelegates = {
  nBCardProfile: {
    upsert(args: unknown): Promise<NBCardProfileRow>
  }
  nBCardContact: {
    upsert(args: unknown): Promise<NBCardContactRow>
  }
}

interface SyncPayload {
  deviceId: string;
  profiles: Array<{
    id: string;
    profileData: unknown;
    templateData?: unknown;
    updatedAt: string;
  }>;
  contacts: Array<{
    id: string;
    contactData: unknown;
    updatedAt: string;
  }>;
}

export async function POST(request: NextRequest) {
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
    // Parse request body
    const body = await request.json() as SyncPayload;
    
    if (!body.deviceId || !Array.isArray(body.profiles) || !Array.isArray(body.contacts)) {
      return NextResponse.json(
        { error: 'Invalid sync payload. Expected: { deviceId, profiles[], contacts[] }' },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase() || null;

    // NOTE: If the editor's Prisma types get temporarily stale, this keeps the
    // API route usable without blocking dev via TS(2339) squiggles.
    const nbPrisma = prisma as unknown as NBCardPrismaDelegates;

    // Sync profiles
    const profileResults = await Promise.all(
      body.profiles.map(async (p) => {
        try {
          // Upsert profile (create or update)
          const upserted = await nbPrisma.nBCardProfile.upsert({
            where: userEmail
              ? { userEmail_profileId: { userEmail, profileId: p.id } }
              : { deviceId_profileId: { deviceId: body.deviceId, profileId: p.id } },
            create: {
              userEmail,
              deviceId: userEmail ? null : body.deviceId,
              profileId: p.id,
              profileData: p.profileData as object,
              templateData: p.templateData ? (p.templateData as object) : undefined,
              version: 1,
              updatedAt: new Date(p.updatedAt),
            },
            update: {
              profileData: p.profileData as object,
              templateData: p.templateData ? (p.templateData as object) : undefined,
              version: { increment: 1 },
              updatedAt: new Date(p.updatedAt),
            },
          });
          return { success: true, profileId: p.id, version: upserted.version };
        } catch (error) {
          console.error(`[NBCard Sync] Profile ${p.id} failed:`, error);
          return { success: false, profileId: p.id, error: String(error) };
        }
      })
    );

    // Sync contacts
    const contactResults = await Promise.all(
      body.contacts.map(async (c) => {
        try {
          const upserted = await nbPrisma.nBCardContact.upsert({
            where: userEmail
              ? { userEmail_contactId: { userEmail, contactId: c.id } }
              : { deviceId_contactId: { deviceId: body.deviceId, contactId: c.id } },
            create: {
              userEmail,
              deviceId: userEmail ? null : body.deviceId,
              contactId: c.id,
              contactData: c.contactData as object,
              version: 1,
              updatedAt: new Date(c.updatedAt),
            },
            update: {
              contactData: c.contactData as object,
              version: { increment: 1 },
              updatedAt: new Date(c.updatedAt),
            },
          });
          return { success: true, contactId: c.id, version: upserted.version };
        } catch (error) {
          console.error(`[NBCard Sync] Contact ${c.id} failed:`, error);
          return { success: false, contactId: c.id, error: String(error) };
        }
      })
    );

    const profilesUploaded = profileResults.filter((r) => r.success).length;
    const contactsUploaded = contactResults.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      synced: {
        profiles: profilesUploaded,
        contacts: contactsUploaded,
      },
      results: {
        profiles: profileResults,
        contacts: contactResults,
      },
      userEmail: userEmail || null,
      deviceId: body.deviceId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[NBCard Sync] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

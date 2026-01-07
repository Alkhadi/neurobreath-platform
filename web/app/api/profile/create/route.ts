/**
 * Profile Creation API Route
 * 
 * Handles profile creation and marks onboarding as complete in the database.
 * This is the ONLY way to mark a profile as complete.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const CreateProfileSchema = z.object({
  deviceId: z.string().min(1),
  name: z.string().min(1).max(100),
  age: z.number().int().positive().max(120).optional(),
});

export async function POST(request: NextRequest) {
  // Check DB availability
  if (isDbDown()) {
    return NextResponse.json(
      {
        error: 'Database unavailable',
        dbUnavailable: true,
        reason: getDbDownReason(),
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    // Validate request
    const validation = CreateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { deviceId, name, age } = validation.data;

    // Create or update profile
    const userProfile = await prisma.userProfile.upsert({
      where: { deviceId },
      update: {
        name,
        age,
        profileComplete: true,
        updatedAt: new Date(),
      },
      create: {
        deviceId,
        name,
        age,
        profileComplete: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        profile: {
          id: userProfile.id,
          name: userProfile.name,
          profileComplete: userProfile.profileComplete,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/profile/create] Error:', error);

    // Mark DB as down if connectivity issue
    markDbDown(error);

    return NextResponse.json(
      {
        error: 'Failed to create profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}






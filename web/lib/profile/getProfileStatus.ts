/**
 * Server-side Profile Status Utility
 * 
 * CRITICAL: This is the ONLY source of truth for profile completion.
 * - Uses Prisma to check DB state
 * - NO localStorage
 * - NO cookies (except for deviceId)
 * - Server-side only
 */

import { prisma, isDbDown } from '@/lib/db';

export interface ProfileStatus {
  deviceId: string;
  profileComplete: boolean;
  hasProfile: boolean;
  name?: string;
  dbAvailable: boolean;
}

/**
 * Get profile completion status from database
 * 
 * @param deviceId - The device ID from client (cookie or header)
 * @returns ProfileStatus object
 */
export async function getProfileStatus(deviceId: string): Promise<ProfileStatus> {
  // If DB is down, fail safe to show onboarding (better UX than blocking)
  if (isDbDown()) {
    console.warn('[getProfileStatus] DB is down, returning safe default');
    return {
      deviceId,
      profileComplete: false,
      hasProfile: false,
      dbAvailable: false,
    };
  }

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { deviceId },
      select: {
        profileComplete: true,
        name: true,
      },
    });

    if (!userProfile) {
      // No profile exists yet
      return {
        deviceId,
        profileComplete: false,
        hasProfile: false,
        dbAvailable: true,
      };
    }

    return {
      deviceId,
      profileComplete: userProfile.profileComplete,
      hasProfile: true,
      name: userProfile.name ?? undefined,
      dbAvailable: true,
    };
  } catch (error) {
    console.error('[getProfileStatus] Error fetching profile:', error);
    
    // Fail safe: show onboarding if DB error
    return {
      deviceId,
      profileComplete: false,
      hasProfile: false,
      dbAvailable: false,
    };
  }
}

/**
 * Check if deviceId exists in cookies (server-side helper)
 * Falls back to generating a new one if missing
 */
export function getDeviceIdFromCookies(cookieHeader: string | null): string {
  if (!cookieHeader) {
    return generateDeviceId();
  }

  const cookies = parseCookies(cookieHeader);
  return cookies.nb_device_id || generateDeviceId();
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
}

function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}



import crypto from 'crypto';
import { prisma } from '@/lib/db';

type AuthTrustedDeviceRecord = {
  id: string;
  userId: string;
  expiresAt: Date;
};

type AuthTrustedDeviceDelegate = {
  create(args: unknown): Promise<unknown>;
  findUnique(args: unknown): Promise<AuthTrustedDeviceRecord | null>;
  delete(args: unknown): Promise<unknown>;
  deleteMany(args: unknown): Promise<unknown>;
};

function authTrustedDeviceDelegate(): AuthTrustedDeviceDelegate {
  const delegate = (prisma as unknown as Record<string, unknown>)['authTrustedDevice'];
  return delegate as AuthTrustedDeviceDelegate;
}

const TRUSTED_DEVICE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface TrustedDeviceToken {
  userId: string;
  deviceToken: string;
  deviceTokenHash: string;
}

export function generateDeviceToken(): { deviceToken: string; deviceTokenHash: string } {
  const deviceToken = crypto.randomBytes(32).toString('base64url');
  const deviceTokenHash = crypto.createHash('sha256').update(deviceToken).digest('hex');
  return { deviceToken, deviceTokenHash };
}

export function hashDeviceToken(deviceToken: string): string {
  return crypto.createHash('sha256').update(deviceToken).digest('hex');
}

export async function createTrustedDevice(userId: string, deviceName?: string): Promise<string> {
  const { deviceToken, deviceTokenHash } = generateDeviceToken();
  const expiresAt = new Date(Date.now() + TRUSTED_DEVICE_DURATION_MS);

  await authTrustedDeviceDelegate().create({
    data: {
      userId,
      deviceTokenHash,
      deviceName: deviceName || 'Trusted device',
      expiresAt,
    },
  });

  return deviceToken;
}

export async function verifyTrustedDevice(userId: string, deviceToken: string): Promise<boolean> {
  if (!deviceToken) return false;

  try {
    const deviceTokenHash = hashDeviceToken(deviceToken);
    const device = await authTrustedDeviceDelegate().findUnique({
      where: { deviceTokenHash },
    });

    if (!device) return false;
    if (device.userId !== userId) return false;
    if (device.expiresAt < new Date()) {
      // Clean up expired token
      await authTrustedDeviceDelegate().delete({ where: { id: device.id } }).catch(() => undefined);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function revokeTrustedDevice(deviceToken: string): Promise<void> {
  try {
    const deviceTokenHash = hashDeviceToken(deviceToken);
    await authTrustedDeviceDelegate().delete({ where: { deviceTokenHash } }).catch(() => undefined);
  } catch {
    // Fail silently
  }
}

export async function cleanExpiredTrustedDevices(): Promise<void> {
  try {
    await authTrustedDeviceDelegate().deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  } catch {
    // Fail silently
  }
}

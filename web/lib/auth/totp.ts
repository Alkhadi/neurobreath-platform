import crypto from 'crypto';

function getTwoFactorKey(): Buffer {
  const keyB64 = process.env.TWOFA_ENCRYPTION_KEY;
  if (!keyB64) {
    throw new Error('Missing TWOFA_ENCRYPTION_KEY');
  }

  const key = Buffer.from(keyB64, 'base64');
  if (key.length !== 32) {
    throw new Error('TWOFA_ENCRYPTION_KEY must decode to exactly 32 bytes (base64)');
  }
  return key;
}

export function encryptTotpSecret(secret: string): string {
  const key = getTwoFactorKey();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Layout: iv (12) + tag (16) + ciphertext (N)
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decryptTotpSecret(blobB64: string): string {
  const key = getTwoFactorKey();
  const raw = Buffer.from(blobB64, 'base64');
  if (raw.length < 12 + 16 + 1) {
    throw new Error('Invalid twoFactorSecretEnc blob');
  }

  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

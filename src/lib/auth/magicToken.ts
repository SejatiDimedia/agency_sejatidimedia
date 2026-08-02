import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Generate a new secure raw magic token for a user.
 * Stores ONLY the SHA-256 hash in the database.
 * Returns the raw token (to be sent via email/URL) and token metadata.
 */
export async function generateMagicToken(userId: string) {
  // 1. Generate 32 bytes (64 hex characters) raw random token
  const rawToken = crypto.randomBytes(32).toString('hex');

  // 2. Compute SHA-256 hash
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // 3. Expiry set to 48 hours from now (FR-3.3)
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  // 4. Save hash in database
  const magicToken = await prisma.magicToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    tokenId: magicToken.id,
    rawToken,
    tokenHash,
    expiresAt,
  };
}

/**
 * Verify an incoming raw magic token.
 * Hashes incoming token, checks DB for unexpired, unused token, and consumes it.
 */
export async function verifyMagicToken(rawToken: string) {
  if (!rawToken || typeof rawToken !== 'string') {
    return { valid: false, reason: 'Token tidak valid' };
  }

  // 1. Hash incoming raw token
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // 2. Query MagicToken database table
  const tokenRecord = await prisma.magicToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!tokenRecord) {
    return { valid: false, reason: 'Link login tidak ditemukan atau sudah tidak berlaku' };
  }

  // 3. Check if already used
  if (tokenRecord.usedAt) {
    return { valid: false, reason: 'Link login ini sudah pernah digunakan sebelumnya' };
  }

  // 4. Check expiry
  if (tokenRecord.expiresAt < new Date()) {
    return { valid: false, reason: 'Link login sudah kadaluarsa (berlaku 48 jam)' };
  }

  // 5. Consume token (one-time use) & update user activation timestamp
  await prisma.$transaction([
    prisma.magicToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: {
        activatedAt: tokenRecord.user.activatedAt || new Date(),
      },
    }),
  ]);

  return {
    valid: true,
    user: tokenRecord.user,
  };
}

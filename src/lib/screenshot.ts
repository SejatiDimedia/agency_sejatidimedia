import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, R2_BUCKET } from '@/lib/r2';

export interface CapturedThumbnail {
  thumbnailUrl: string;
  thumbnailKey: string | null;
}

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
};

function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      R2_BUCKET
  );
}

/**
 * Deletes an object from R2 storage if configured. Errors are logged but non-fatal.
 */
export async function deleteR2Object(key?: string | null): Promise<void> {
  if (!key || !isR2Configured()) return;
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    console.warn(`[R2] Failed to delete object "${key}":`, err);
  }
}

async function fetchImageBuffer(url: string, timeoutMs = 15000): Promise<{ buffer: Buffer; contentType: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SejatiDimedia-ThumbnailBot/1.0',
      },
    });

    if (!res.ok) return null;

    const contentType = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!contentType.startsWith('image/')) return null;

    const arrayBuf = await res.arrayBuffer();
    if (arrayBuf.byteLength < 512) return null;

    return {
      buffer: Buffer.from(arrayBuf),
      contentType,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Captures a screenshot thumbnail for a live URL using Microlink (with WordPress mShots fallback),
 * and stores it in Cloudflare R2 when configured so public pages load fast without external rate limits.
 */
export async function captureLiveWebsiteThumbnail(
  liveUrl: string,
  entityId: string
): Promise<CapturedThumbnail> {
  const encodedUrl = encodeURIComponent(liveUrl);
  const microlinkUrl = `https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url`;
  const mshotsUrl = `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=1280`;

  const captured =
    (await fetchImageBuffer(microlinkUrl, 8000)) ||
    (await fetchImageBuffer(mshotsUrl, 8000));

  if (captured && isR2Configured()) {
    const ext = MIME_TO_EXT[captured.contentType] || 'png';
    const key = `static-web/${entityId}-${Date.now()}.${ext}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: captured.buffer,
          ContentType: captured.contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      return {
        thumbnailUrl: `/api/media/${key}`,
        thumbnailKey: key,
      };
    } catch (err) {
      console.warn('[R2] Failed to upload static-web screenshot, using direct URL fallback:', err);
    }
  }

  return {
    thumbnailUrl: mshotsUrl,
    thumbnailKey: null,
  };
}

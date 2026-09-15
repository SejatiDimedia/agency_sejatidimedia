import { NextRequest, NextResponse } from 'next/server';
import { s3Client, R2_BUCKET } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params;
    if (!keyParts || keyParts.length === 0) {
      return NextResponse.json({ error: 'Key not specified' }, { status: 400 });
    }

    // Sanitize key (prevent directory traversal)
    const key = keyParts.join('/').replace(/\.\./g, '');

    // Fetch directly from Cloudflare R2 Cloud Storage
    if (!R2_BUCKET) {
      return NextResponse.json({ error: 'Cloud storage bucket not configured' }, { status: 500 });
    }

    try {
      const s3Response = await s3Client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
        })
      );

      if (s3Response.Body) {
        const byteArray = await s3Response.Body.transformToByteArray();
        const mimeType = s3Response.ContentType || getMimeType(key);

        return new NextResponse(byteArray, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (r2Err: any) {
      if (r2Err?.name === 'NoSuchKey' || r2Err?.$metadata?.httpStatusCode === 404) {
        return NextResponse.json({ error: 'Media tidak ditemukan di cloud storage' }, { status: 404 });
      }
      console.error(`[R2 Fetch Error] Key: ${key}`, r2Err?.message);
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    console.error('[Media Proxy Error]', error);
    return NextResponse.json({ error: 'Failed to retrieve media' }, { status: 500 });
  }
}

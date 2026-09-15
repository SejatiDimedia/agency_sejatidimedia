import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { s3Client, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Session
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus admin.' }, { status: 403 });
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File gambar wajib dipilih' }, { status: 400 });
    }

    // 3. Validate File Type & Size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
    if (!file.type.startsWith('image/') && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Harap unggah gambar (JPG, PNG, WEBP, AVIF, GIF)' },
        { status: 400 }
      );
    }

    // Max 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal 10MB' },
        { status: 400 }
      );
    }

    // 4. Determine Target Folder ('insights' or 'series')
    const folderParam = req.nextUrl.searchParams.get('folder') || (formData.get('folder') as string);
    const targetFolder = folderParam === 'series' ? 'series' : 'insights';

    // 5. Read Buffer and Convert/Compress to WebP using Sharp
    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const originalSize = file.size;

    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);

    let finalBuffer: Buffer = rawBuffer;
    let contentType = file.type || 'image/jpeg';
    let fileExtension = 'webp';

    // Check if SVG (keep as vector SVG without rasterizing to WebP)
    if (file.type === 'image/svg+xml') {
      contentType = 'image/svg+xml';
      fileExtension = 'svg';
    } else {
      try {
        const sharp = (await import('sharp')).default;
        finalBuffer = await sharp(rawBuffer)
          .rotate() // Automatically orient using EXIF
          .resize({
            width: 1920,
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({
            quality: 82,
            effort: 4,
          })
          .toBuffer();

        contentType = 'image/webp';
        fileExtension = 'webp';
      } catch (sharpErr) {
        console.warn('Sharp WebP conversion fallback:', sharpErr);
        fileExtension = file.name.split('.').pop() || 'jpg';
      }
    }

    const key = `${targetFolder}/${Date.now()}-${cleanBaseName}.${fileExtension}`;

    // 6. Upload directly to Cloudflare R2 Cloud Storage (strictly cloud, no local repo files)
    if (!R2_BUCKET) {
      return NextResponse.json(
        { error: 'Cloud Storage (R2_BUCKET_NAME) belum dikonfigurasi di server' },
        { status: 500 }
      );
    }

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: finalBuffer,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
    } catch (r2Err: any) {
      console.error('[Cloudflare R2 Upload Error]', r2Err?.message);
      return NextResponse.json(
        { error: `Gagal mengunggah ke Cloud Storage: ${r2Err?.message || 'Koneksi cloud gagal'}` },
        { status: 500 }
      );
    }

    // 8. Return reliable app media proxy URL (avoids ISP *.r2.dev TLS block)
    const publicUrl = `/api/media/${key}`;
    const finalSize = finalBuffer.length;
    const savedPercent = originalSize > 0 ? Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100)) : 0;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
      name: `${cleanBaseName}.${fileExtension}`,
      format: fileExtension,
      originalSize,
      size: finalSize,
      savingsPercent: `${savedPercent}%`,
    });
  } catch (error: any) {
    console.error('[POST /api/admin/insights/upload Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengunggah gambar ke cloud storage' },
      { status: 500 }
    );
  }
}

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

    // 4. Generate S3/R2 Key
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);

    const key = `insights/${Date.now()}-${cleanFileName}.${fileExtension}`;

    // 5. Upload to Cloudflare R2
    if (!R2_BUCKET) {
      throw new Error('R2_BUCKET_NAME belum dikonfigurasi di environment server');
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'image/jpeg',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    // 6. Build Public URL
    const publicBase = R2_PUBLIC_URL.replace(/\/$/, '');
    const publicUrl = publicBase
      ? `${publicBase}/${key}`
      : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
      name: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('[POST /api/admin/insights/upload Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengunggah gambar ke cloud storage' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { s3Client, R2_BUCKET } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const milestoneId = formData.get('milestoneId') as string | null;

    if (!file || !milestoneId) {
      return NextResponse.json({ error: 'File and Milestone ID are required' }, { status: 400 });
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || '';
    const key = `deliverables/${milestoneId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      })
    );

    const deliverable = await prisma.deliverable.create({
      data: {
        name: file.name,
        key,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        milestoneId,
      },
    });

    return NextResponse.json({ success: true, deliverable }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/admin/deliverables Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload deliverable' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { s3Client, R2_BUCKET } from '@/lib/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id },
    });
    if (!deliverable) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 });
    }

    // 1. Delete from Cloudflare R2
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: deliverable.key,
        })
      );
    } catch (s3Error) {
      console.warn('[DELETE R2 Object Warning]', s3Error);
    }

    // 2. Delete from DB
    await prisma.deliverable.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Deliverable deleted' });
  } catch (error: any) {
    console.error('[DELETE /api/admin/deliverables/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete deliverable' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { s3Client, R2_BUCKET } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id },
      include: {
        milestone: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!deliverable) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 });
    }

    const isOwner = deliverable.milestone.project.userId === session.id;
    const isAdmin = session.role === 'ADMIN';

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const s3Response = await s3Client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: deliverable.key,
      })
    );

    if (!s3Response.Body) {
      return NextResponse.json({ error: 'Empty file body' }, { status: 500 });
    }

    const fileStream = s3Response.Body as any;

    const headers = new Headers();
    headers.set('Content-Type', deliverable.mimeType || 'application/octet-stream');
    headers.set('Content-Length', deliverable.size.toString());
    
    const preview = req.nextUrl.searchParams.get('preview') === 'true';
    const disposition = preview ? 'inline' : `attachment; filename="${encodeURIComponent(deliverable.name)}"`;
    headers.set('Content-Disposition', disposition);

    return new NextResponse(fileStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('[GET /api/projects/deliverables/[id]/download Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to download file' },
      { status: 500 }
    );
  }
}

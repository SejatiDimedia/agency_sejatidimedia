import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        milestone: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Authorization: Admin can delete any comment, user can delete their own comment
    const isAuthor = comment.userId === session.id;
    const isAdmin = session.role === 'ADMIN';

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error: any) {
    console.error('[DELETE /api/projects/comments/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

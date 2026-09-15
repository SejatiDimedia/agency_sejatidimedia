import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { ids, action, isPublished } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Daftar ID artikel tidak valid' }, { status: 400 });
    }

    let newPublishedStatus: boolean | undefined = undefined;

    if (typeof isPublished === 'boolean') {
      newPublishedStatus = isPublished;
    } else if (action === 'draft') {
      newPublishedStatus = false;
    } else if (action === 'publish') {
      newPublishedStatus = true;
    }

    if (newPublishedStatus !== undefined) {
      const result = await prisma.insight.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          isPublished: newPublishedStatus,
        },
      });

      try {
        revalidatePath('/insights');
        revalidatePath('/insights', 'page');
        revalidatePath('/insights', 'layout');
        revalidatePath('/');
      } catch (revalErr) {
        console.warn('Revalidation error on bulk update insights:', revalErr);
      }

      return NextResponse.json({
        success: true,
        count: result.count,
        message: `${result.count} artikel berhasil diubah menjadi ${newPublishedStatus ? 'Published' : 'Draft'}`,
      });
    }

    if (action === 'delete') {
      const result = await prisma.insight.deleteMany({
        where: {
          id: { in: ids },
        },
      });

      try {
        revalidatePath('/insights');
        revalidatePath('/insights', 'page');
        revalidatePath('/insights', 'layout');
        revalidatePath('/');
      } catch (revalErr) {
        console.warn('Revalidation error on bulk delete insights:', revalErr);
      }

      return NextResponse.json({
        success: true,
        count: result.count,
        message: `${result.count} artikel berhasil dihapus`,
      });
    }

    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
  } catch (error) {
    console.error('Failed to execute bulk action on insights:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return POST(req);
}

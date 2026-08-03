import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { milestoneId, title, isDone } = body;

    if (!milestoneId || !title) {
      return NextResponse.json({ error: 'Milestone ID and Title are required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        milestoneId,
        title,
        isDone: isDone || false,
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/admin/tasks Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}

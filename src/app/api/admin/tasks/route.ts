import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { logAction } from '@/lib/audit';

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

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    });

    const task = await prisma.task.create({
      data: {
        milestoneId,
        title,
        isDone: isDone || false,
      },
    });

    await logAction({
      action: 'TASK_STATUS_CHANGE',
      entityId: task.id,
      entityName: task.title,
      projectName: milestone?.project?.name,
      oldValue: 'None',
      newValue: task.isDone ? 'Done' : 'To Do',
      userId: session.id,
      userName: session.name,
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

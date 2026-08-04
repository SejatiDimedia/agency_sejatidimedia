import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { logAction } from '@/lib/audit';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, isDone } = body;

    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        milestone: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(isDone !== undefined ? { isDone } : {}),
      },
    });

    // Log status change if applicable
    const isDoneChanged = isDone !== undefined && isDone !== existingTask.isDone;
    if (isDoneChanged) {
      await logAction({
        action: 'TASK_STATUS_CHANGE',
        entityId: id,
        entityName: updated.title,
        projectName: existingTask.milestone?.project?.name,
        oldValue: existingTask.isDone ? 'Done' : 'To Do',
        newValue: updated.isDone ? 'Done' : 'To Do',
        userId: session.id,
        userName: session.name,
      });
    }

    return NextResponse.json({ success: true, task: updated });
  } catch (error: any) {
    console.error('[PUT /api/admin/tasks/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/admin/tasks/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}

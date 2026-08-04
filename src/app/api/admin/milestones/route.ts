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
    const { projectId, title, description, dueDate, status } = body;

    if (!projectId || !title) {
      return NextResponse.json({ error: 'Project ID and Title are required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true }
    });

    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        title,
        description: description || null,
        dueDate: dueDate || null,
        status: status || 'To Do',
      },
    });

    await logAction({
      action: 'MILESTONE_STATUS_CHANGE',
      entityId: milestone.id,
      entityName: milestone.title,
      projectName: project?.name,
      oldValue: 'None',
      newValue: milestone.status,
      userId: session.id,
      userName: session.name,
    });

    return NextResponse.json({ success: true, milestone }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/admin/milestones Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create milestone' },
      { status: 500 }
    );
  }
}

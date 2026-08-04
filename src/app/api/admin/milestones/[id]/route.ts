import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { sendMilestoneStatusEmail } from '@/lib/email';
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
    const { title, description, dueDate, status } = body;

    // Fetch current milestone to check if status is changing
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!existingMilestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(dueDate !== undefined ? { dueDate } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    // Send email trigger if status changed to 'In Progress' or 'Done'
    const statusChanged = status && status !== existingMilestone.status;
    const isNotifyStatus = status === 'In Progress' || status === 'Done';

    // Log status change if applicable
    if (statusChanged) {
      await logAction({
        action: 'MILESTONE_STATUS_CHANGE',
        entityId: id,
        entityName: updated.title,
        projectName: existingMilestone.project.name,
        oldValue: existingMilestone.status,
        newValue: updated.status,
        userId: session.id,
        userName: session.name,
      });
    }

    let emailSent = false;
    let emailError = null;

    if (statusChanged && isNotifyStatus) {
      try {
        const clientEmail = existingMilestone.project.user.email;
        const clientName = existingMilestone.project.user.name;
        const projectName = existingMilestone.project.name;

        const emailRes = await sendMilestoneStatusEmail({
          to: clientEmail,
          name: clientName,
          projectName,
          milestoneTitle: updated.title,
          status: updated.status,
        });

        emailSent = emailRes.success;
        emailError = emailRes.error || null;
      } catch (err: any) {
        console.error('[Milestone Status Email Error]', err);
        emailError = err?.message || 'Error executing email trigger';
      }
    }

    return NextResponse.json({
      success: true,
      milestone: updated,
      notification: {
        emailSent,
        emailError,
      },
    });
  } catch (error: any) {
    console.error('[PUT /api/admin/milestones/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update milestone' },
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

    await prisma.milestone.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/admin/milestones/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete milestone' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMagicToken } from '@/lib/auth/magicToken';
import { sendOnboardingMagicLink } from '@/lib/email';
import { getSession } from '@/lib/auth/session';
import { logAction } from '@/lib/audit';

export async function PATCH(
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
    const { status, notes, email, name, service, sendEmail } = body;

    const normalizedStatus = status ? status.toUpperCase() : undefined;

    let updatedLead: any = null;
    let targetEmail = email;
    let targetName = name || 'Klien SejatiDimedia';
    let targetService = service || 'Web Development';

    // Fetch the lead before updating to check for status change
    const oldLead = await prisma.lead.findUnique({
      where: { id },
    }).catch(() => null);

    // 1. Try DB Lead Update
    try {
      updatedLead = await prisma.lead.update({
        where: { id },
        data: {
          ...(normalizedStatus ? { status: normalizedStatus, statusSetAt: new Date() } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
      });

      targetEmail = updatedLead.email || email;
      targetName = updatedLead.name || name;
      targetService = updatedLead.service || service;

      // Log status change if applicable
      if (normalizedStatus && oldLead && oldLead.status !== normalizedStatus) {
        await logAction({
          action: 'LEAD_STATUS_CHANGE',
          entityId: id,
          entityName: oldLead.name,
          oldValue: oldLead.status,
          newValue: normalizedStatus,
          userId: session.id,
          userName: session.name,
        });
      }
    } catch {
      // Fallback for mock/local items
      updatedLead = { id, status: normalizedStatus || status, notes, statusSetAt: new Date(), email, name, service };
    }

    let onboardingData: any = null;

    // 2. Client onboarding trigger (Only send email when sendEmail is true - i.e. when clicking Convert to Client Portal)
    if (normalizedStatus === 'WON' && targetEmail) {
      try {
        // Find or create User for this lead
        let user = await prisma.user.findUnique({
          where: { email: targetEmail },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: targetEmail,
              name: targetName,
              role: 'CLIENT',
            },
          });
        }

        // Link converted user to Lead if real DB lead
        if (updatedLead && updatedLead.id && !updatedLead.id.startsWith('lead-')) {
          await prisma.lead.update({
            where: { id: updatedLead.id },
            data: { convertedUserId: user.id },
          }).catch(() => {});
        }

        // Automatically create initial active Project for user
        const existingProject = await prisma.project.findFirst({
          where: { userId: user.id },
        });

        let project = existingProject;
        if (!project) {
          project = await prisma.project.create({
            data: {
              name: `Project ${targetService} - ${targetName}`,
              status: 'Active',
              startDate: new Date().toLocaleDateString('id-ID'),
              userId: user.id,
            },
          });
        }

        // Generate Magic Token & Onboarding URL
        const { rawToken, expiresAt } = await generateMagicToken(user.id);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const activationUrl = `${baseUrl}/auth/activate?token=${rawToken}`;

        let emailSent = false;
        let emailError = null;

        // Send email ONLY when explicitly requested (e.g. Convert button clicked)
        if (sendEmail) {
          const emailResult = await sendOnboardingMagicLink({
            to: targetEmail,
            name: targetName,
            projectName: project.name,
            activationUrl,
          });

          emailSent = emailResult.success;
          emailError = emailResult.error || null;
        }

        onboardingData = {
          userCreated: true,
          userId: user.id,
          projectId: project.id,
          projectName: project.name,
          activationUrl,
          expiresAt,
          emailSent,
          emailError,
        };
      } catch (err: any) {
        console.error('[Onboarding Error]', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: sendEmail 
        ? 'Lead berhasil dikonversi & Email Onboarding dipicu!' 
        : 'Status/Notes lead berhasil diperbarui',
      lead: updatedLead,
      onboarding: onboardingData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Gagal memperbarui lead' },
      { status: 500 }
    );
  }
}

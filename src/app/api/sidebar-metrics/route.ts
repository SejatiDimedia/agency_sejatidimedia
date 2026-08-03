import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: true, leadsCount: 0, projectsCount: 0 });
    }

    let leadsCount = 0;
    let projectsCount = 0;

    if (session.role === 'ADMIN') {
      // Count leads that are in active pipeline (not Spam or Lost)
      leadsCount = await prisma.lead.count({
        where: {
          NOT: {
            status: {
              in: ['SPAM', 'LOST'],
            },
          },
        },
      });

      projectsCount = await prisma.project.count();
    } else {
      // Count client-specific active projects
      projectsCount = await prisma.project.count({
        where: {
          userId: session.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      leadsCount,
      projectsCount,
    });
  } catch (error: any) {
    console.error('[sidebar-metrics error]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let projects = [];

    if (session.role === 'ADMIN') {
      // Admin sees all projects
      projects = await prisma.project.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          milestones: {
            include: {
              tasks: {
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Client sees only their own projects
      projects = await prisma.project.findMany({
        where: {
          userId: session.id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          milestones: {
            include: {
              tasks: {
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    const formattedProjects = projects.map((p) => ({
      ...p,
      projectName: p.name,
      clientName: p.user?.name || 'Klien',
      clientEmail: p.user?.email || '',
    }));

    return NextResponse.json({ success: true, projects: formattedProjects });
  } catch (error: any) {
    console.error('[GET /api/projects Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

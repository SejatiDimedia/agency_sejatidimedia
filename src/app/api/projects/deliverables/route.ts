import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.role === 'ADMIN';

    let deliverables;

    if (isAdmin) {
      deliverables = await prisma.deliverable.findMany({
        include: {
          milestone: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      deliverables = await prisma.deliverable.findMany({
        where: {
          milestone: {
            project: {
              userId: session.id,
            },
          },
        },
        include: {
          milestone: {
            include: {
              project: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json({ success: true, deliverables });
  } catch (error: any) {
    console.error('[GET /api/projects/deliverables Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch deliverables' },
      { status: 500 }
    );
  }
}

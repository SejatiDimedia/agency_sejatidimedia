import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const action = searchParams.get('action') || '';

    const logs = await prisma.auditLog.findMany({
      where: {
        AND: [
          action ? { action } : {},
          search ? {
            OR: [
              { entityName: { contains: search, mode: 'insensitive' } },
              { projectName: { contains: search, mode: 'insensitive' } },
              { userName: { contains: search, mode: 'insensitive' } },
            ]
          } : {}
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('[GET /api/admin/audit-logs Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

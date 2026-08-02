import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_LEADS } from '@/lib/portalMockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let leads;
    try {
      leads = await prisma.lead.findMany({
        where: statusFilter ? { status: statusFilter.toUpperCase() as any } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Fallback in-memory leads if Prisma DB is not configured locally
      leads = INITIAL_LEADS;
      if (statusFilter) {
        leads = leads.filter((l) => l.status.toLowerCase() === statusFilter.toLowerCase());
      }
    }

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Gagal mengambil data leads' },
      { status: 500 }
    );
  }
}

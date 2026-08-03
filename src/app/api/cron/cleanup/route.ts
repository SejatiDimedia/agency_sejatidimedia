import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    const expectedSecret = process.env.CRON_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const deleted = await prisma.lead.deleteMany({
      where: {
        status: {
          in: ['SPAM', 'LOST'],
        },
        statusSetAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(`[Cron Cleanup] Successfully deleted ${deleted.count} old SPAM/LOST leads.`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleted.count} old SPAM/LOST leads.`,
      count: deleted.count,
    });
  } catch (error: any) {
    console.error('[Cron Cleanup Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during cleanup' },
      { status: 500 }
    );
  }
}

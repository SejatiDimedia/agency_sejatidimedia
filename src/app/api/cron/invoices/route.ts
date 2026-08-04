import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAction } from '@/lib/audit';

export async function GET(request: Request) {
  return handleCronJob(request);
}

export async function POST(request: Request) {
  return handleCronJob(request);
}

async function handleCronJob(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow local development check
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Find SENT invoices where dueDate is strictly less than today's date
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'SENT',
        dueDate: {
          lt: todayStr,
        },
      },
      include: {
        project: true,
      },
    });

    let updatedCount = 0;
    for (const inv of overdueInvoices) {
      await prisma.invoice.update({
        where: { id: inv.id },
        data: { status: 'OVERDUE' },
      });

      await logAction({
        action: 'INVOICE_STATUS_CHANGE',
        entityId: inv.id,
        entityName: inv.invoiceNumber,
        projectName: inv.project.name,
        oldValue: 'SENT',
        newValue: 'OVERDUE',
        userId: null,
        userName: 'System (Overdue Cron Job)',
      });

      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Checked overdue invoices. Updated ${updatedCount} invoice(s) to OVERDUE.`,
      updatedCount,
    });
  } catch (error: any) {
    console.error('[Cron Invoices Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process overdue invoices' },
      { status: 500 }
    );
  }
}

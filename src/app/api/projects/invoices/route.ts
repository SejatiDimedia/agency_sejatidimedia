import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Filter invoices by user's owned projects (or all projects if ADMIN)
    const whereClause: any = {};
    if (session.role !== 'ADMIN') {
      whereClause.project = {
        userId: session.id,
      };
      // Exclude draft invoices from client view
      whereClause.status = {
        not: 'DRAFT',
      };
    }

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        items: { orderBy: { order: 'asc' } },
        project: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      status: inv.status,
      issuedDate: inv.issuedDate,
      dueDate: inv.dueDate,
      subtotal: inv.subtotal,
      taxPercent: inv.taxPercent,
      taxAmount: inv.taxAmount,
      total: inv.total,
      notes: inv.notes,
      bankInfo: inv.bankInfo,
      paymentProofKey: inv.paymentProofKey,
      paymentProofUrl: inv.paymentProofUrl,
      paymentUploadedAt: inv.paymentUploadedAt ? inv.paymentUploadedAt.toISOString() : null,
      paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
      projectId: inv.projectId,
      projectName: inv.project.name,
      clientName: inv.project.user.name,
      clientEmail: inv.project.user.email,
      items: inv.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
        order: item.order,
      })),
      createdAt: inv.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, invoices: formatted });
  } catch (error: any) {
    console.error('[GET /api/projects/invoices Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch project invoices' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { logAction } from '@/lib/audit';

/**
 * Auto-generate next Invoice Number in format INV-YYYYMM-SEQ (e.g. INV-202608-001)
 */
async function generateInvoiceNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${year}${month}-`;

  const latestInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });

  let seq = 1;
  if (latestInvoice && latestInvoice.invoiceNumber) {
    const parts = latestInvoice.invoiceNumber.split('-');
    if (parts.length === 3) {
      const parsedSeq = parseInt(parts[2], 10);
      if (!isNaN(parsedSeq)) {
        seq = parsedSeq + 1;
      }
    }
  }

  const formattedSeq = String(seq).padStart(3, '0');
  return `${prefix}${formattedSeq}`;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    if (search) {
      whereClause.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { project: { user: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
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
    console.error('[GET /api/admin/invoices Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      projectId,
      issuedDate,
      dueDate,
      items,
      taxPercent = 0,
      notes,
      bankInfo,
      status = 'DRAFT',
    } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Auto-generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Line items parsing & calculations
    const itemsArray = Array.isArray(items) ? items : [];
    let subtotal = 0;

    const parsedItems = itemsArray.map((item: any, index: number) => {
      const qty = parseInt(item.quantity || 1, 10);
      const price = parseFloat(item.unitPrice || 0);
      const itemAmount = qty * price;
      subtotal += itemAmount;

      return {
        description: item.description || 'Layanan Development',
        quantity: qty,
        unitPrice: price,
        amount: itemAmount,
        order: index,
      };
    });

    const taxPct = parseFloat(taxPercent || 0);
    const taxAmount = (subtotal * taxPct) / 100;
    const total = subtotal + taxAmount;

    const defaultBankInfo = bankInfo || 'Bank BCA: 1234-5678-90 a.n. PT SejatiDimedia Technology';

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        status: status.toUpperCase(),
        issuedDate: issuedDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        subtotal,
        taxPercent: taxPct,
        taxAmount,
        total,
        notes: notes || null,
        bankInfo: defaultBankInfo,
        projectId,
        items: {
          create: parsedItems,
        },
      },
      include: {
        items: true,
      },
    });

    await logAction({
      action: 'INVOICE_CREATED',
      entityId: invoice.id,
      entityName: invoice.invoiceNumber,
      projectName: project.name,
      oldValue: null,
      newValue: invoice.status,
      userId: session.id,
      userName: session.name,
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/admin/invoices Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

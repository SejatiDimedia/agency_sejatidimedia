import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { logAction } from '@/lib/audit';
import { sendInvoiceEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: { orderBy: { order: 'asc' } },
        project: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch invoice' }, { status: 500 });
  }
}

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
    const {
      status,
      issuedDate,
      dueDate,
      taxPercent,
      notes,
      bankInfo,
      items,
      verifyPaid,
    } = body;

    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          include: { user: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    let subtotal = existing.subtotal;
    let taxPct = taxPercent !== undefined ? parseFloat(taxPercent) : existing.taxPercent;

    // Handle updating items if passed
    if (Array.isArray(items)) {
      // Clear old items and recreate
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

      subtotal = 0;
      const newItems = items.map((item: any, index: number) => {
        const qty = parseInt(item.quantity || 1, 10);
        const price = parseFloat(item.unitPrice || 0);
        const amt = qty * price;
        subtotal += amt;
        return {
          invoiceId: id,
          description: item.description || 'Layanan Development',
          quantity: qty,
          unitPrice: price,
          amount: amt,
          order: index,
        };
      });

      if (newItems.length > 0) {
        await prisma.invoiceItem.createMany({ data: newItems });
      }
    }

    const taxAmount = (subtotal * taxPct) / 100;
    const total = subtotal + taxAmount;

    let targetStatus = status ? status.toUpperCase() : existing.status;
    let paidAt = existing.paidAt;

    if (verifyPaid || targetStatus === 'PAID') {
      targetStatus = 'PAID';
      paidAt = new Date();
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status: targetStatus,
        issuedDate: issuedDate || existing.issuedDate,
        dueDate: dueDate || existing.dueDate,
        subtotal,
        taxPercent: taxPct,
        taxAmount,
        total,
        notes: notes !== undefined ? notes : existing.notes,
        bankInfo: bankInfo !== undefined ? bankInfo : existing.bankInfo,
        paidAt,
      },
      include: {
        items: { orderBy: { order: 'asc' } },
        project: { include: { user: true } },
      },
    });

    // Log status change if applicable
    if (existing.status !== updated.status) {
      await logAction({
        action: 'INVOICE_STATUS_CHANGE',
        entityId: id,
        entityName: updated.invoiceNumber,
        projectName: updated.project.name,
        oldValue: existing.status,
        newValue: updated.status,
        userId: session.id,
        userName: session.name,
      });

      // Send email if status changed to SENT
      if (updated.status === 'SENT' && updated.project.user.email) {
        await sendInvoiceEmail({
          to: updated.project.user.email,
          name: updated.project.user.name,
          projectName: updated.project.name,
          invoiceNumber: updated.invoiceNumber,
          dueDate: updated.dueDate,
          totalAmount: updated.total,
        });
      }
    }

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error: any) {
    console.error('[PATCH /api/admin/invoices/[id] Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Invoice deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}

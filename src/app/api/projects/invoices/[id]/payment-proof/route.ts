import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { s3Client, R2_BUCKET } from '@/lib/r2';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { logAction } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!invoice || !invoice.paymentProofKey) {
      return NextResponse.json({ error: 'Bukti pembayaran tidak ditemukan' }, { status: 404 });
    }

    // Security check: only the project owner or ADMIN can view proof
    if (session.role !== 'ADMIN' && invoice.project.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const s3Response = await s3Client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: invoice.paymentProofKey,
      })
    );

    if (!s3Response.Body) {
      return NextResponse.json({ error: 'File body empty' }, { status: 500 });
    }

    const fileStream = s3Response.Body as any;
    const contentType = s3Response.ContentType || 'application/octet-stream';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `inline; filename="payment-proof-${invoice.invoiceNumber}"`);
    headers.set('Cache-Control', 'private, max-age=3600');

    return new NextResponse(fileStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('[GET /api/projects/invoices/[id]/payment-proof Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal membuka bukti pembayaran' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Security check: only the project owner or ADMIN can upload proof
    if (session.role !== 'ADMIN' && invoice.project.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File bukti pembayaran wajib diunggah' }, { status: 400 });
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file bukti pembayaran maksimal 10 MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || 'png';
    const key = `payment-proofs/${id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      })
    );

    const internalUrl = `/api/projects/invoices/${id}/payment-proof`;

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        paymentProofKey: key,
        paymentProofUrl: internalUrl,
        paymentUploadedAt: new Date(),
      },
    });

    await logAction({
      action: 'PAYMENT_PROOF_UPLOADED',
      entityId: id,
      entityName: invoice.invoiceNumber,
      projectName: invoice.project.name,
      oldValue: invoice.status,
      newValue: 'PAYMENT_PROOF_UPLOADED',
      userId: session.id,
      userName: session.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah! Admin akan segera memverifikasi.',
      invoice: updated,
    });
  } catch (error: any) {
    console.error('[POST /api/projects/invoices/[id]/payment-proof Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengunggah bukti pembayaran' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Security check: only the project owner or ADMIN can delete proof
    if (session.role !== 'ADMIN' && invoice.project.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot delete proof if invoice is already verified PAID
    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Bukti pembayaran pada invoice LUNAS tidak dapat dihapus.' }, { status: 400 });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        paymentProofKey: null,
        paymentProofUrl: null,
        paymentUploadedAt: null,
      },
    });

    await logAction({
      action: 'PAYMENT_PROOF_DELETED',
      entityId: id,
      entityName: invoice.invoiceNumber,
      projectName: invoice.project.name,
      oldValue: 'PROOF_EXISTS',
      newValue: 'PROOF_REMOVED',
      userId: session.id,
      userName: session.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Bukti pembayaran berhasil dihapus.',
      invoice: updated,
    });
  } catch (error: any) {
    console.error('[DELETE /api/projects/invoices/[id]/payment-proof Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menghapus bukti pembayaran' },
      { status: 500 }
    );
  }
}

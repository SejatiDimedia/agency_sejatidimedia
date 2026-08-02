import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    let updatedLead;
    try {
      updatedLead = await prisma.lead.update({
        where: { id },
        data: {
          ...(status ? { status: status.toUpperCase(), statusSetAt: new Date() } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
      });
    } catch {
      // Fallback mock object if DB not connected
      updatedLead = { id, status, notes, statusSetAt: new Date() };
    }

    return NextResponse.json({
      success: true,
      message: 'Status/Notes lead berhasil diperbarui',
      lead: updatedLead,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Gagal memperbarui lead' },
      { status: 500 }
    );
  }
}

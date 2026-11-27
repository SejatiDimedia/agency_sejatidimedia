import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { captureLiveWebsiteThumbnail, deleteR2Object } from '@/lib/screenshot';

function normalizeLiveUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.staticWebProject.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { name, category, liveUrl, isPublished, order, refreshThumbnail } = body;

    let nextLiveUrl = existing.liveUrl;
    if (typeof liveUrl === 'string') {
      const normalized = normalizeLiveUrl(liveUrl);
      if (!normalized) {
        return NextResponse.json(
          { error: 'Format Live URL tidak valid. Gunakan format https://domain.com' },
          { status: 400 }
        );
      }
      nextLiveUrl = normalized;
    }

    const shouldCapture = Boolean(refreshThumbnail) || nextLiveUrl !== existing.liveUrl;
    let thumbnailUrl = existing.thumbnailUrl;
    let thumbnailKey = existing.thumbnailKey;

    if (shouldCapture) {
      const captured = await captureLiveWebsiteThumbnail(nextLiveUrl, id);
      if (existing.thumbnailKey && existing.thumbnailKey !== captured.thumbnailKey) {
        await deleteR2Object(existing.thumbnailKey);
      }
      thumbnailUrl = captured.thumbnailUrl;
      thumbnailKey = captured.thumbnailKey;
    }

    const updated = await prisma.staticWebProject.update({
      where: { id },
      data: {
        name: typeof name === 'string' && name.trim() ? name.trim() : existing.name,
        category: typeof category === 'string' && category.trim() ? category.trim() : existing.category,
        liveUrl: nextLiveUrl,
        thumbnailUrl,
        thumbnailKey,
        isPublished: typeof isPublished === 'boolean' ? isPublished : existing.isPublished,
        order: order !== undefined && Number.isFinite(Number(order)) ? Number(order) : existing.order,
      },
    });

    revalidatePath('/statis-web');

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Failed to update static web project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.staticWebProject.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    await prisma.staticWebProject.delete({ where: { id } });
    if (existing.thumbnailKey) {
      await deleteR2Object(existing.thumbnailKey);
    }

    revalidatePath('/statis-web');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete static web project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { captureLiveWebsiteThumbnail } from '@/lib/screenshot';

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

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const items = await prisma.staticWebProject.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Failed to fetch static web projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      category,
      liveUrl,
      isPublished = true,
      order = 0,
    } = body;

    if (!name?.trim() || !category?.trim() || !liveUrl?.trim()) {
      return NextResponse.json(
        { error: 'Nama web, kategori, dan link live website wajib diisi.' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeLiveUrl(liveUrl);
    if (!normalizedUrl) {
      return NextResponse.json(
        { error: 'Format Live URL tidak valid. Gunakan format https://domain.com' },
        { status: 400 }
      );
    }

    const created = await prisma.staticWebProject.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        liveUrl: normalizedUrl,
        isPublished: Boolean(isPublished),
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    });

    const captured = await captureLiveWebsiteThumbnail(normalizedUrl, created.id);

    const updated = await prisma.staticWebProject.update({
      where: { id: created.id },
      data: {
        thumbnailUrl: captured.thumbnailUrl,
        thumbnailKey: captured.thumbnailKey,
      },
    });

    revalidatePath('/statis-web');

    return NextResponse.json({ success: true, item: updated }, { status: 201 });
  } catch (error) {
    console.error('Failed to create static web project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

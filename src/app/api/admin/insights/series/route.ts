import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatCategories(input: unknown): string {
  if (Array.isArray(input)) {
    const list = input.map((c) => String(c).trim()).filter(Boolean);
    return list.length > 0 ? list.join(', ') : 'Backend';
  }
  if (typeof input === 'string') {
    const list = input.split(',').map((c) => c.trim()).filter(Boolean);
    return list.length > 0 ? list.join(', ') : 'Backend';
  }
  return 'Backend';
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const series = await prisma.insightSeries.findMany({
      include: {
        insights: {
          select: {
            id: true,
            slug: true,
            titleId: true,
            titleEn: true,
            seriesPart: true,
            readTimeMinutes: true,
            isPublished: true,
          },
          orderBy: { seriesPart: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, series });
  } catch (error) {
    console.error('Failed to fetch series list:', error);
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
      titleId,
      titleEn,
      descriptionId,
      descriptionEn,
      coverImage,
      category = 'Backend',
      badge = 'ENGINEERING SERIES',
      order = 0,
      isPublished = true,
      slug: customSlug,
    } = body;

    if (!titleId || !descriptionId) {
      return NextResponse.json(
        { error: 'Mohon lengkapi Judul Seri dan Deskripsi Seri' },
        { status: 400 }
      );
    }

    let slug = customSlug ? slugify(customSlug) : slugify(titleId);
    if (!slug) {
      slug = `series-${Date.now()}`;
    }

    const existing = await prisma.insightSeries.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newSeries = await prisma.insightSeries.create({
      data: {
        slug,
        titleId,
        titleEn: titleEn || null,
        descriptionId,
        descriptionEn: descriptionEn || null,
        coverImage: coverImage?.trim() || '/images/insights/client_portal_cover.jpg',
        category: formatCategories(category),
        badge: badge || 'ENGINEERING SERIES',
        order: Number(order) || 0,
        isPublished: Boolean(isPublished),
      },
    });

    revalidatePath('/insights');

    return NextResponse.json({ success: true, series: newSeries });
  } catch (error) {
    console.error('Failed to create series:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

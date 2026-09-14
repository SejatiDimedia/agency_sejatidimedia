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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const series = await prisma.insightSeries.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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
    });

    if (!series) {
      return NextResponse.json({ error: 'Seri tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, series });
  } catch (error) {
    console.error('Failed to fetch series by id:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      titleId,
      titleEn,
      descriptionId,
      descriptionEn,
      coverImage,
      category,
      badge,
      order,
      isPublished,
      slug: customSlug,
    } = body;

    const existing = await prisma.insightSeries.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Seri tidak ditemukan' }, { status: 404 });
    }

    let slug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      slug = slugify(customSlug);
      const collision = await prisma.insightSeries.findFirst({
        where: { slug, id: { not: existing.id } },
      });
      if (collision) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    const updated = await prisma.insightSeries.update({
      where: { id: existing.id },
      data: {
        slug,
        titleId: titleId ?? existing.titleId,
        titleEn: titleEn !== undefined ? titleEn : existing.titleEn,
        descriptionId: descriptionId ?? existing.descriptionId,
        descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
        category: category ?? existing.category,
        badge: badge ?? existing.badge,
        order: order !== undefined ? Number(order) : existing.order,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
      },
    });

    revalidatePath('/insights');
    revalidatePath(`/insights/series/${existing.slug}`);
    revalidatePath(`/insights/series/${updated.slug}`);

    return NextResponse.json({ success: true, series: updated });
  } catch (error) {
    console.error('Failed to update series:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.insightSeries.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Seri tidak ditemukan' }, { status: 404 });
    }

    await prisma.insightSeries.delete({
      where: { id: existing.id },
    });

    revalidatePath('/insights');

    return NextResponse.json({ success: true, message: 'Seri berhasil dihapus' });
  } catch (error) {
    console.error('Failed to delete series:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

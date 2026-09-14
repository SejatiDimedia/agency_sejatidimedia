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
    const insight = await prisma.insight.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        series: {
          select: {
            id: true,
            titleId: true,
            titleEn: true,
            slug: true,
          },
        },
      },
    });

    if (!insight) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Failed to fetch insight:', error);
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
      excerptId,
      excerptEn,
      contentId,
      contentEn,
      category,
      tags,
      coverImage,
      readTimeMinutes,
      authorName,
      authorRole,
      authorAvatar,
      isPublished,
      featured,
      seriesId,
      seriesPart,
      slug: customSlug,
    } = body;

    const existing = await prisma.insight.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    let slug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      slug = slugify(customSlug);
      // Check collision
      const collision = await prisma.insight.findFirst({
        where: { slug, id: { not: existing.id } },
      });
      if (collision) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    const updated = await prisma.insight.update({
      where: { id: existing.id },
      data: {
        slug,
        titleId: titleId ?? existing.titleId,
        titleEn: titleEn !== undefined ? titleEn : existing.titleEn,
        excerptId: excerptId ?? existing.excerptId,
        excerptEn: excerptEn !== undefined ? excerptEn : existing.excerptEn,
        contentId: contentId ?? existing.contentId,
        contentEn: contentEn !== undefined ? contentEn : existing.contentEn,
        category: category ?? existing.category,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean)) : existing.tags,
        coverImage: coverImage ?? existing.coverImage,
        readTimeMinutes: readTimeMinutes !== undefined ? Number(readTimeMinutes) : existing.readTimeMinutes,
        authorName: authorName ?? existing.authorName,
        authorRole: authorRole ?? existing.authorRole,
        authorAvatar: authorAvatar ?? existing.authorAvatar,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        seriesId: seriesId !== undefined ? (seriesId ? seriesId : null) : existing.seriesId,
        seriesPart: seriesPart !== undefined ? (seriesPart !== null && seriesPart !== '' ? Number(seriesPart) : null) : existing.seriesPart,
      },
    });

    try {
      revalidatePath('/insights');
      revalidatePath(`/insights/${updated.slug}`);
      if (existing.slug !== updated.slug) {
        revalidatePath(`/insights/${existing.slug}`);
      }
      revalidatePath('/');
    } catch (revalErr) {
      console.warn('Revalidation error on update insight:', revalErr);
    }

    return NextResponse.json({ success: true, insight: updated });
  } catch (error) {
    console.error('Failed to update insight:', error);
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
    const existing = await prisma.insight.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    await prisma.insight.delete({
      where: { id: existing.id },
    });

    try {
      revalidatePath('/insights');
      revalidatePath(`/insights/${existing.slug}`);
      revalidatePath('/');
    } catch (revalErr) {
      console.warn('Revalidation error on delete insight:', revalErr);
    }

    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (error) {
    console.error('Failed to delete insight:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

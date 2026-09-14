import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getGlobalAuthorProfile } from '@/lib/server-template';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const insights = await prisma.insight.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error('Failed to fetch admin insights:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const defaultAuthor = await getGlobalAuthorProfile();
    const body = await req.json();
    const {
      titleId,
      titleEn,
      excerptId,
      excerptEn,
      contentId,
      contentEn,
      category = 'Backend',
      tags = [],
      coverImage,
      readTimeMinutes = 5,
      authorName = defaultAuthor.name,
      authorRole = defaultAuthor.role,
      authorAvatar = defaultAuthor.avatar,
      isPublished = true,
      featured = false,
      slug: customSlug,
    } = body;

    if (!titleId || !excerptId || !contentId || !coverImage) {
      return NextResponse.json(
        { error: 'Mohon lengkapi Judul, Ringkasan, Konten, dan URL Cover Image' },
        { status: 400 }
      );
    }

    let slug = customSlug ? slugify(customSlug) : slugify(titleId);
    if (!slug) {
      slug = `insight-${Date.now()}`;
    }

    // Check slug uniqueness
    const existing = await prisma.insight.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newInsight = await prisma.insight.create({
      data: {
        slug,
        titleId,
        titleEn: titleEn || null,
        excerptId,
        excerptEn: excerptEn || null,
        contentId,
        contentEn: contentEn || null,
        category,
        tags: Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        coverImage,
        readTimeMinutes: Number(readTimeMinutes) || 5,
        authorName,
        authorRole,
        authorAvatar,
        isPublished: Boolean(isPublished),
        featured: Boolean(featured),
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, insight: newInsight });
  } catch (error) {
    console.error('Failed to create insight article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

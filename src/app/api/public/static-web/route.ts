import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.staticWebProject.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        category: true,
        liveUrl: true,
        thumbnailUrl: true,
        order: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Failed to fetch public static web projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getGlobalFeaturedProjectSlugs } from '@/lib/server-template';
import { getProjects } from '@/lib/api/glio-projects';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeProjects = searchParams.get('includeProjects') !== 'false';

    const featuredSlugs = await getGlobalFeaturedProjectSlugs();

    let featuredProjects = undefined;
    if (includeProjects) {
      const allProjects = await getProjects();
      featuredProjects = allProjects.filter((p) => featuredSlugs.includes(p.slug));
    }

    const response = NextResponse.json({
      success: true,
      count: featuredSlugs.length,
      featuredSlugs,
      ...(featuredProjects ? { featuredProjects } : {}),
      updatedAt: new Date().toISOString(),
    });

    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error: any) {
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch featured projects',
      },
      { status: 500 }
    );
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}

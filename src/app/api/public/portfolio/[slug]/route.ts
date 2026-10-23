import { NextRequest, NextResponse } from 'next/server';
import {
  getProjectBySlug,
  isProfessionalProject,
  sanitizeProjectForNda,
} from '@/lib/api/glio-projects';
import {
  getGlobalFeaturedProjectSlugs,
  getGlobalNdaProjectSlugs,
  getGlobalNdaBlur,
} from '@/lib/server-template';

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const [project, featuredSlugs, ndaSlugs, ndaBlurEnabled] = await Promise.all([
      getProjectBySlug(slug),
      getGlobalFeaturedProjectSlugs(),
      getGlobalNdaProjectSlugs(),
      getGlobalNdaBlur(),
    ]);

    if (!project || project.isPublic === false) {
      return NextResponse.json(
        { success: false, error: `Project not found or is private for slug "${slug}"` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const isFeatured = featuredSlugs.includes(project.slug);
    const isNda = ndaSlugs.includes(project.slug) || isProfessionalProject(project, ndaSlugs);
    const sanitized = sanitizeProjectForNda(project, isNda && ndaBlurEnabled);

    const enrichedProject = {
      ...sanitized,
      isFeatured,
      isNda,
      isProfessional: isNda,
    };

    const response = NextResponse.json({
      success: true,
      project: enrichedProject,
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
        error: error?.message || 'Failed to fetch project detail',
      },
      { status: 500 }
    );
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}

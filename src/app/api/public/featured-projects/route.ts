import { NextRequest, NextResponse } from 'next/server';
import {
  getGlobalFeaturedProjectSlugs,
  getGlobalNdaProjectSlugs,
  getGlobalNdaBlur,
} from '@/lib/server-template';
import {
  getProjects,
  isProfessionalProject,
  sanitizeProjectForNda,
  Project,
} from '@/lib/api/glio-projects';

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
    const includeAll = searchParams.get('includeAll') === 'true';

    const [featuredSlugs, ndaSlugs, ndaBlurEnabled] = await Promise.all([
      getGlobalFeaturedProjectSlugs(),
      getGlobalNdaProjectSlugs(),
      getGlobalNdaBlur(),
    ]);

    let featuredProjects: Project[] | undefined = undefined;
    let ndaProjects: Project[] | undefined = undefined;
    let allProjects: Project[] | undefined = undefined;

    if (includeProjects) {
      const rawProjects = await getProjects();

      // Enrich and sanitize each project according to NDA status
      const enrichedProjects = rawProjects.map((p) => {
        const isFeatured = featuredSlugs.includes(p.slug);
        const isNda = ndaSlugs.includes(p.slug) || isProfessionalProject(p, ndaSlugs);
        const sanitized = sanitizeProjectForNda(p, isNda && ndaBlurEnabled);

        return {
          ...sanitized,
          isFeatured,
          isNda,
          isProfessional: isNda,
        };
      });

      featuredProjects = enrichedProjects.filter((p) => featuredSlugs.includes(p.slug));
      ndaProjects = enrichedProjects.filter((p) => p.isNda);

      if (includeAll) {
        allProjects = enrichedProjects;
      }
    }

    const response = NextResponse.json({
      success: true,
      count: featuredSlugs.length,
      featuredSlugs,
      ...(featuredProjects ? { featuredProjects } : {}),
      ndaCount: ndaSlugs.length,
      ndaSlugs,
      ndaBlurEnabled,
      ...(ndaProjects ? { ndaProjects } : {}),
      ...(allProjects ? { allProjects } : {}),
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
        error: error?.message || 'Failed to fetch public portfolio data',
      },
      { status: 500 }
    );
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}

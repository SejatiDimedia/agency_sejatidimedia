import { NextRequest, NextResponse } from 'next/server';
import {
  getGlobalNdaBlur,
  setGlobalNdaBlur,
  getGlobalNdaProjectSlugs,
  setGlobalNdaProjectSlugs,
  getGlobalFeaturedProjectSlugs,
  setGlobalFeaturedProjectSlugs,
} from '@/lib/server-template';
import { getProjects } from '@/lib/api/glio-projects';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ndaBlurEnabled = await getGlobalNdaBlur();
  const ndaProjectSlugs = await getGlobalNdaProjectSlugs();
  const featuredProjectSlugs = await getGlobalFeaturedProjectSlugs();
  const projects = await getProjects();

  const res = NextResponse.json({
    success: true,
    ndaBlurEnabled,
    ndaProjectSlugs,
    featuredProjectSlugs,
    projects,
  });
  res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ndaBlurEnabled, ndaProjectSlugs, featuredProjectSlugs } = body;

    if (typeof ndaBlurEnabled === 'boolean') {
      await setGlobalNdaBlur(ndaBlurEnabled);
    }

    if (Array.isArray(ndaProjectSlugs)) {
      await setGlobalNdaProjectSlugs(ndaProjectSlugs);
    }

    if (Array.isArray(featuredProjectSlugs)) {
      await setGlobalFeaturedProjectSlugs(featuredProjectSlugs);
    }

    try {
      revalidatePath('/', 'page');
      revalidatePath('/projects', 'page');
      revalidatePath('/projects/[slug]', 'page');
      revalidatePath('/portal/portfolio', 'page');
    } catch {
      // Revalidation fallback
    }

    const currentNdaBlur = await getGlobalNdaBlur();
    const currentSlugs = await getGlobalNdaProjectSlugs();
    const currentFeatured = await getGlobalFeaturedProjectSlugs();

    const res = NextResponse.json({
      success: true,
      ndaBlurEnabled: currentNdaBlur,
      ndaProjectSlugs: currentSlugs,
      featuredProjectSlugs: currentFeatured,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}


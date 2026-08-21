import { NextRequest, NextResponse } from 'next/server';
import { getGlobalNdaBlur, setGlobalNdaBlur } from '@/lib/server-template';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ndaBlurEnabled = await getGlobalNdaBlur();
  const res = NextResponse.json({ success: true, ndaBlurEnabled });
  res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ndaBlurEnabled } = body;
    if (typeof ndaBlurEnabled !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid ndaBlurEnabled value' }, { status: 400 });
    }

    await setGlobalNdaBlur(ndaBlurEnabled);

    try {
      revalidatePath('/projects', 'page');
      revalidatePath('/projects/[slug]', 'page');
    } catch {
      // Revalidation fallback
    }

    const res = NextResponse.json({ success: true, ndaBlurEnabled });
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

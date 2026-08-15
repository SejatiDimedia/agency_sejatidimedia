import { NextRequest, NextResponse } from 'next/server';
import { getGlobalActiveTemplate, setGlobalActiveTemplate } from '@/lib/server-template';
import { TemplateId } from '@/lib/templates';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const template = await getGlobalActiveTemplate();
  const res = NextResponse.json({ success: true, template });
  res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template } = body;
    if (template !== 'classic' && template !== 'professional') {
      return NextResponse.json({ success: false, error: 'Invalid template ID' }, { status: 400 });
    }

    await setGlobalActiveTemplate(template as TemplateId);

    try {
      revalidatePath('/', 'page');
    } catch {
      // Revalidation fallback
    }

    const res = NextResponse.json({ success: true, template });
    // Root cookie fallback so Next.js server components / middleware can also read across devices
    res.cookies.set('sejatidimedia-template', template, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

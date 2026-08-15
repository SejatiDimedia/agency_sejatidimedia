import { NextRequest, NextResponse } from 'next/server';
import { getGlobalActiveTemplate, setGlobalActiveTemplate } from '@/lib/server-template';
import { TemplateId } from '@/lib/templates';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const template = getGlobalActiveTemplate();
  return NextResponse.json({ success: true, template });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template } = body;
    if (template !== 'classic' && template !== 'professional') {
      return NextResponse.json({ success: false, error: 'Invalid template ID' }, { status: 400 });
    }

    const success = setGlobalActiveTemplate(template as TemplateId);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to save template setting' }, { status: 500 });
    }

    try {
      revalidatePath('/', 'page');
    } catch {
      // Revalidation fallback
    }

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

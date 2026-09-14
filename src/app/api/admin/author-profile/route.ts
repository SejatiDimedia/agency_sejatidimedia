import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getGlobalAuthorProfile, setGlobalAuthorProfile } from '@/lib/server-template';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await getGlobalAuthorProfile();
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Failed to get author profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, role, avatar, bioId, bioEn } = body;

    if (!name || !avatar) {
      return NextResponse.json(
        { error: 'Nama penulis dan URL foto profil wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Save to global server-template settings (JSON + Redis + in-memory)
    const updatedProfile = await setGlobalAuthorProfile({
      name,
      role,
      avatar,
      bioId,
      bioEn,
    });

    // 2. Update existing insights in database so they immediately reflect the new author photo & name
    try {
      await prisma.insight.updateMany({
        data: {
          authorName: updatedProfile.name,
          authorRole: updatedProfile.role,
          authorAvatar: updatedProfile.avatar,
        },
      });
    } catch (dbErr) {
      console.warn('Could not batch update insight articles in DB:', dbErr);
    }

    // 3. Revalidate paths
    try {
      revalidatePath('/', 'page');
      revalidatePath('/insights', 'page');
      revalidatePath('/insights/[slug]', 'page');
    } catch (revErr) {
      console.warn('Revalidate warning:', revErr);
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Profil dan foto penulis berhasil diperbarui di seluruh artikel insights!',
    });
  } catch (error) {
    console.error('Failed to update author profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

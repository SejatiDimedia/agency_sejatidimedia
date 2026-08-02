import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
      redirectUrl: '/auth/login',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal melakukan logout' },
      { status: 500 }
    );
  }
}

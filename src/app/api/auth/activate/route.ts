import { NextResponse } from 'next/server';
import { verifyMagicToken } from '@/lib/auth/magicToken';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`activate:${ip}`, 10, 3600000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak percobaaan verifikasi token dari IP ini.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Token aktivasi tidak valid' },
        { status: 400 }
      );
    }

    // Verify magic token
    const verification = await verifyMagicToken(token);
    if (!verification.valid || !verification.user) {
      return NextResponse.json(
        { success: false, error: verification.reason || 'Token tidak valid' },
        { status: 400 }
      );
    }

    const user = verification.user;

    // Create session cookie
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'CLIENT',
      activatedAt: user.activatedAt ? user.activatedAt.toISOString() : new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Aktivasi akun & login berhasil!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectUrl: '/portal',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memverifikasi token aktivasi' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/rateLimit';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Rate Limiting: max 5 login attempts per email/IP per 15 minutes (FR-3.6)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`login:${ip}:${email}`, 5, 900000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Batas percobaan login tercapai. Silakan coba lagi dalam 15 menit.' },
        { status: 429 }
      );
    }

    // Find User
    const user = await prisma.user.findUnique({ where: { email } });

    // Generic error message to prevent user enumeration
    const genericAuthError = 'Email atau password salah';

    if (!user) {
      return NextResponse.json({ success: false, error: genericAuthError }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Akun ini belum memiliki password. Silakan gunakan opsi "Kirim Magic Link ke Email".' 
        },
        { status: 400 }
      );
    }

    // Compare password
    const isMatched = await verifyPassword(password, user.passwordHash);
    if (!isMatched) {
      return NextResponse.json({ success: false, error: genericAuthError }, { status: 401 });
    }

    // Create session cookie
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'CLIENT',
      activatedAt: user.activatedAt ? user.activatedAt.toISOString() : null,
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
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
      { success: false, error: 'Terjadi kesalahan saat memproses login' },
      { status: 500 }
    );
  }
}

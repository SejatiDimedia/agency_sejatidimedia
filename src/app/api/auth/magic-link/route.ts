import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateMagicToken } from '@/lib/auth/magicToken';
import { checkRateLimit } from '@/lib/rateLimit';

const magicLinkSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = magicLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Rate Limiting: max 3 magic link requests per email/IP per hour (FR-3.6)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`magic-link:${ip}:${email}`, 3, 3600000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Batas permintaan magic link tercapai. Silakan coba lagi dalam 1 jam.' },
        { status: 429 }
      );
    }

    // Find or create User for this email
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role: 'CLIENT',
        },
      });
    }

    // Generate magic token & activation URL
    const { rawToken, expiresAt } = await generateMagicToken(user.id);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const activationUrl = `${baseUrl}/auth/activate?token=${rawToken}`;

    return NextResponse.json({
      success: true,
      message: 'Link login berhasil dikirim ke email Anda!',
      activationUrl, // Exposed for development & testing demo
      expiresAt,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memproses permintaan magic link' },
      { status: 500 }
    );
  }
}

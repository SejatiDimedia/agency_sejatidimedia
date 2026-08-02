import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/prisma';

const setPasswordSchema = z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = setPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { password } = result.data;
    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: session.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diset/diperbarui!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui password' },
      { status: 500 }
    );
  }
}

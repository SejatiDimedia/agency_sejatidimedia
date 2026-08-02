import { NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session,
  });
}

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, message: 'Logout berhasil' });
}

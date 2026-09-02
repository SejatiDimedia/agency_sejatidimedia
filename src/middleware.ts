import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('sejati_session')?.value;

  // 1. ALWAYS ALLOW public access to the interactive Guest Demo Portal
  if (pathname === '/portal/demo' || pathname.startsWith('/portal/demo/')) {
    return NextResponse.next();
  }

  // 2. If unauthenticated visitor visits /portal, redirect directly to /portal/demo
  if (pathname === '/portal' && !sessionCookie) {
    return NextResponse.redirect(new URL('/portal/demo', req.url));
  }

  // 3. Protected route prefixes (Admin & Private Client Pages)
  const protectedRoutes = ['/portal', '/admin'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If user tries to access private /portal or /admin routes without an active session cookie
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};

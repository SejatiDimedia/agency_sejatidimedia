import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionRole(cookieValue?: string): string | null {
  if (!cookieValue) return null;
  try {
    const parts = cookieValue.split('.');
    if (parts.length !== 2) return null;
    const base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const session = JSON.parse(jsonStr);
    return session.role || null;
  } catch {
    return null;
  }
}

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

  // 4. Strict Role Protection: No bypass allowed!
  const userRole = getSessionRole(sessionCookie);

  // Portfolio Showcase is strictly ADMIN ONLY - clients and guests cannot bypass via URL!
  if (pathname === '/portal/portfolio' || pathname.startsWith('/portal/portfolio/')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/portal', req.url));
    }
  }

  // /admin dashboard & routes are strictly ADMIN ONLY
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/portal', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};

import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'sejati_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'sejatidimedia-secure-session-secret-2026-key';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  activatedAt?: string | null;
}

/**
 * Sign session payload with HMAC SHA-256
 */
function signPayload(payloadStr: string): string {
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
  return `${Buffer.from(payloadStr).toString('base64url')}.${signature}`;
}

/**
 * Verify and parse signed session string
 */
function parseSessionToken(token: string): UserSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    return JSON.parse(payloadStr) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Set HTTP-Only session cookie
 */
export async function createSession(user: UserSession) {
  const payloadStr = JSON.stringify(user);
  const token = signPayload(payloadStr);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Retrieve current user session from HTTP-Only cookie
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return parseSessionToken(token);
}

/**
 * Destroy current session cookie (Logout)
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

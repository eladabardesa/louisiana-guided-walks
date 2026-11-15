import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'aae_admin_session';

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'louisiana2024';
}

function signToken(password: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || getAdminPassword();
  return createHmac('sha256', secret).update(password).digest('hex');
}

export function createAdminSessionCookie(): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
    maxAge: number;
  };
} {
  return {
    name: COOKIE_NAME,
    value: signToken(getAdminPassword()),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    },
  };
}

export function clearAdminSessionCookie(): {
  name: string;
  value: string;
  options: { httpOnly: boolean; path: string; maxAge: number };
} {
  return {
    name: COOKIE_NAME,
    value: '',
    options: { httpOnly: true, path: '/', maxAge: 0 },
  };
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const expected = signToken(getAdminPassword());
  try {
    const a = Buffer.from(cookie);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (isAdminAuthenticated(request)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

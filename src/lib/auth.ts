import crypto from 'crypto';
import { cookies } from 'next/headers';
import { UserSession } from '@/types';

const SECRET = process.env.NEXTAUTH_SECRET || 'secret-jwt-key-fallback-cinema-3000';
const COOKIE_NAME = 'bms_auth_token';

export function signToken(payload: UserSession): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(data)
      .digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      const json = Buffer.from(data, 'base64url').toString('utf8');
      return JSON.parse(json) as UserSession;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE_NAME };

import type { AuthUser } from '@/features/auth/types';

type JsonRecord = Record<string, unknown>;

export function extractAccessToken(data: JsonRecord): string {
  const token = data.accessToken ?? data.access_token ?? data.token;
  if (typeof token !== 'string' || !token) {
    throw new Error('Invalid auth response: missing access token');
  }
  return token;
}

export function extractUser(data: JsonRecord): AuthUser | undefined {
  const raw = data.user ?? (typeof data.data === 'object' && data.data !== null ? data.data : undefined);
  if (!raw || typeof raw !== 'object') return undefined;

  const record = raw as JsonRecord;
  const id = record.id ?? record._id;
  const email = record.email;

  if (typeof id !== 'string' && typeof id !== 'number') return undefined;
  if (typeof email !== 'string') return undefined;

  return {
    id: String(id),
    email,
    fullName:
      typeof record.fullName === 'string'
        ? record.fullName
        : typeof record.full_name === 'string'
          ? record.full_name
          : typeof record.name === 'string'
            ? record.name
            : undefined,
    companyName:
      typeof record.companyName === 'string'
        ? record.companyName
        : typeof record.company_name === 'string'
          ? record.company_name
          : undefined,
    phone: typeof record.phone === 'string' ? record.phone : undefined,
    role: typeof record.role === 'string' ? record.role : undefined,
    userType:
      typeof record.userType === 'string'
        ? record.userType
        : typeof record.user_type === 'string'
          ? record.user_type
          : undefined,
  };
}

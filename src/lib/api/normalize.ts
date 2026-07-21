import type { AuthUser, UserType } from '@/features/auth/types';

type JsonRecord = Record<string, unknown>;

function readAccessToken(record: JsonRecord): string | undefined {
  const token = record.accessToken ?? record.access_token ?? record.token;
  return typeof token === 'string' && token ? token : undefined;
}

export function extractAccessToken(data: JsonRecord): string {
  const token =
    readAccessToken(data) ??
    (typeof data.data === 'object' && data.data !== null
      ? readAccessToken(data.data as JsonRecord)
      : undefined);

  if (!token) {
    throw new Error('Invalid auth response: missing access token');
  }
  return token;
}

function readUserType(record: JsonRecord): UserType | undefined {
  const rawType = record.type ?? record.userType ?? record.user_type;
  return typeof rawType === 'number' ? (rawType as UserType) : undefined;
}

function readUserStatus(record: JsonRecord): UserStatus | undefined {
  const rawStatus = record.status ?? record.userStatus ?? record.user_status;
  return typeof rawStatus === 'number' ? (rawStatus as UserStatus) : undefined;
}

function isAuthTokenPayload(record: JsonRecord): boolean {
  return Boolean(readAccessToken(record)) && typeof record.email !== 'string';
}

export function extractUser(data: JsonRecord): AuthUser | undefined {
  const raw = data.user ?? (typeof data.data === 'object' && data.data !== null ? data.data : undefined);
  if (!raw || typeof raw !== 'object') return undefined;

  const record = raw as JsonRecord;
  if (isAuthTokenPayload(record)) return undefined;

  const email = record.email;
  if (typeof email !== 'string') return undefined;

  const id = record.id ?? record._id ?? record.userId ?? record.user_id ?? email;
  if (typeof id !== 'string' && typeof id !== 'number') return undefined;

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
    phone:
      typeof record.phone === 'string'
        ? record.phone
        : typeof record.phoneNumber === 'string'
          ? record.phoneNumber
          : typeof record.phone_number === 'string'
            ? record.phone_number
            : undefined,
    type: readUserType(record),
    status: readUserStatus(record),
    statusText: typeof record.statusText === 'string' ? record.statusText : undefined,

  };
}

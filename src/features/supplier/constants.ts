export const SUPPLIER_BASE_CITIES = [
  { label: 'Abuja', value: 'abuja' },
  { label: 'Jos', value: 'jos' },
  { label: 'Lafia', value: 'lafia' },
  { label: 'Kaduna', value: 'kaduna' },
  { label: 'Lokoja', value: 'lokoja' },
] as const;

export const MACHINE_TYPES = [
  { label: 'Excavator', value: 'excavator' },
  { label: 'Bulldozer', value: 'bulldozer' },
  { label: 'PayLoader', value: 'payloader' },
  { label: 'Tipper', value: 'tipper' },
  { label: 'Grader', value: 'grader' },
  { label: 'Crane', value: 'crane' },
  { label: 'Compactor', value: 'compactor' },
  // { label: 'Other', value: 'other' },
] as const;

export const ONBOARDING_STEPS = [
  { step: 1 as const, title: 'Identity', description: 'Account & verification' },
  { step: 2 as const, title: 'Location', description: 'Yard & operations' },
  { step: 3 as const, title: 'Assets', description: 'Machine details' },
  { step: 4 as const, title: 'Documents', description: 'Photos & proof' },
  { step: 5 as const, title: 'Submit', description: 'Verification' },
];

export const ACCOUNT_STATUS = {
  Pending: 'Pending',
  Active: 'Active',
  Suspended: 'Suspended',
  Banned: 'Banned',
  Deactivated: 'Deactivated',
} as const;

export type AccountStatusValue = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export const SUPPLIER_ACCOUNT_RESTRICTED_PATH = '/supplier/restricted';

const BLOCKED_STATUSES: AccountStatusValue[] = [
  ACCOUNT_STATUS.Suspended,
  ACCOUNT_STATUS.Banned,
  ACCOUNT_STATUS.Deactivated,
];

export function isAccountBlocked(status: unknown): boolean {
  return typeof status === 'string' && BLOCKED_STATUSES.includes(status as AccountStatusValue);
}

export const SUPPLIER_ONBOARDING_STORAGE_KEY = 'afrimine.supplier.onboarding';
export const SUPPLIER_ONBOARDING_PATH = '/supplier/onboarding';
export const SUPPLIER_DASHBOARD_PATH = '/supplier-dashboard';
export const SUPPLIER_MACHINES_PATH = '/supplier/machines';
export const SUPPLIER_BOOKINGS_PATH = '/supplier/bookings';
export const BUYER_BOOKINGS_PATH = '/my-bookings';
export const SUPPLIER_PROFILE_PATH = '/vendor-profile';

export const ASSET_STATUS_ENUM = {
  Available: 0,
  Rented: 1,
  UnderMaintenance: 2,
  Inactive: 3,
} as const;

export type AssetStatusValue = (typeof ASSET_STATUS_ENUM)[keyof typeof ASSET_STATUS_ENUM];

export const ASSET_STATUS_FROM_ENUM: Record<number, string> = {
  0: 'Available',
  1: 'Rented',
  2: 'UnderMaintenance',
  3: 'Inactive',
};

export function isAssetAvailable(status: string | undefined): boolean {
  if (!status) return true;
  const s = status.toLowerCase();
  return s === 'available' || s === 'active' || s === 'listed';
}

export function toAssetStatusEnum(status: string | undefined): number | undefined {
  if (!status) return undefined;
  return (ASSET_STATUS_ENUM as Record<string, number>)[status];
}

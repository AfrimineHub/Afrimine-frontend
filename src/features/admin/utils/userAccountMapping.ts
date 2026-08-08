import { USER_TYPES } from '@/features/auth';

export const ROLE_OPTIONS = [
  { value: USER_TYPES.supplier, label: 'Supplier' },
  { value: USER_TYPES.buyer, label: 'Buyer' },
  { value: USER_TYPES.investor, label: 'Investor' },
  { value: USER_TYPES.superAdmin, label: 'Super Admin' },
] as const;

export const ACCOUNT_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Active', label: 'Active' },
  { value: 'Suspended', label: 'Suspended' },
  { value: 'Banned', label: 'Banned' },
  { value: 'Deactivated', label: 'Deactivated' },
] as const;

export function getRoleNumber(role: string | null): number | undefined {
  if (!role) return undefined;

  const normalizedRole = role.trim().toLowerCase();

  if (normalizedRole === 'vendor' || normalizedRole === 'supplier') {
    return USER_TYPES.supplier;
  }

  const roleOption = ROLE_OPTIONS.find(
    (option) => option.label.toLowerCase() === normalizedRole,
  );

  if (roleOption) {
    return roleOption.value;
  }

  const numericRole = Number(role);

  return ROLE_OPTIONS.some((option) => option.value === numericRole)
    ? numericRole
    : undefined;
}

export function getAccountStatusNumber(accountStatus: string | null): number | undefined {
  if (!accountStatus) return undefined;

  const normalized = accountStatus.trim().toLowerCase();

  const byLabelIndex = ACCOUNT_STATUS_OPTIONS.findIndex(
    (option) => option.label.toLowerCase() === normalized,
  );

  if (byLabelIndex !== -1) {
    return byLabelIndex;
  }

  const numericStatus = Number(accountStatus);

  if (Number.isInteger(numericStatus) && numericStatus >= 0 && numericStatus <= 4) {
    return numericStatus;
  }

  return undefined;
}
/**
 * Backend enum (Vendor and Supplier share value 1 — one seller role).
 * Vendor = 1, Buyer = 2, Investor = 3, Supplier = 1, SuperAdmin = 5
 *
 * Use `isSellerRole` / `USER_TYPES.supplier` for equipment sellers.
 * `USER_TYPES.vendor` is kept as an alias for older RoleGuard / schema call sites.
 */
export const USER_TYPES = {
  /** @deprecated Alias of supplier — same backend value (1). Prefer `supplier`. */
  vendor: 1,
  buyer: 2,
  investor: 3,
  /** Equipment seller (and legacy mineral vendor) — backend type 1 */
  supplier: 1,
  superAdmin: 5,
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

/** Type 1: equipment supplier / vendor (indistinguishable on the backend). */
export function isSellerRole(type: UserType | null | undefined): boolean {
  return type === USER_TYPES.supplier;
}

export const USER_STATUS = {
  active: 1,
} as const;
 
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  phone?: string;
  type?: UserType;
  status?: UserStatus;
  statusText?: string;
  avatarUrl?: string;
}

export function isEmailVerified(user: AuthUser | null | undefined): boolean {
  return user?.status === USER_STATUS.active;
}


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  type: UserType;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  user?: AuthUser;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ConfirmEmailPayload {
  email: string;
  type: number;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

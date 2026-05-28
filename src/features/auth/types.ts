/**
 * Backend enum:
 * Vendor = 1, Buyer = 2, Investor = 3, Supplier = 4, SuperAdmin = 5
 */
export const USER_TYPES = {
  vendor: 1,
  buyer: 2,
  investor: 3,
  supplier: 4,
  superAdmin: 5,
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  phone?: string;
  role?: UserType;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  role: UserType;
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

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
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

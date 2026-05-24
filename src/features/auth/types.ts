export const USER_TYPES = {
  individual: 'individual',
  miner: 'miner',
  trader: 'trader',
  supplier: 'supplier',
  investor: 'investor',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  phone?: string;
  role?: string;
  userType?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  userType: UserType;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user?: AuthUser;
}

/** Sends OTP to the user's email (`POST auth/reset-password`). */
export interface RequestPasswordResetPayload {
  email: string;
}

/** Completes reset with OTP from email (`POST auth/forgot-password`). */
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

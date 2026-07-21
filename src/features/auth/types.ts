/**
 * Backend enum:
 * Vendor = 1, Buyer = 2, Investor = 3, Supplier = 4, SuperAdmin = 5
 */
export const USER_TYPES = {
  vendor: 1,
  buyer: 2,
  investor: 3,
  supplier: 1,
  superAdmin: 6,
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

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

export interface ConfirmEmailPayload {
  email: string;
  type: number;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

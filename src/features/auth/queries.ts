import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_SESSION_QUERY_KEY } from '@/features/auth/config';
import {
  bootstrapSession,
  confirmEmail,
  login,
  register,
  resendOtp,
  requestPasswordReset,
  resetPassword,
  changePassword,
} from '@/features/auth/api';
import { endSession, setSessionUser } from '@/features/auth/session';
import type {
  ConfirmEmailPayload,
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from '@/features/auth/types';

export function useSessionQuery() {
  return useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: bootstrapSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: ({ user }) => {
      if (user) setSessionUser(queryClient, user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => endSession(queryClient),
  });
}

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationFn: (payload: RequestPasswordResetPayload) => requestPasswordReset(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}

export function useConfirmEmailMutation() {
  return useMutation({
    mutationFn: (payload: ConfirmEmailPayload) => confirmEmail(payload),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => resendOtp(payload),
  });
}

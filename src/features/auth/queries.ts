import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_SESSION_QUERY_KEY } from '@/features/auth/config';
import { bootstrapSession, login, register } from '@/features/auth/api';
import { endSession, setSessionUser } from '@/features/auth/session';
import type { LoginPayload, RegisterPayload } from '@/features/auth/types';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: ({ user }) => {
      if (user) setSessionUser(queryClient, user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => endSession(queryClient),
  });
}

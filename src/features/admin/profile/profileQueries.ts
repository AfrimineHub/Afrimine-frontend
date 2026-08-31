import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_SESSION_QUERY_KEY } from '@/features/auth/config';
import { fetchCurrentUser } from '@/features/auth/api';
import { setSessionUser } from '@/features/auth/session';
import { updateAdminUser } from '@/features/admin/api';
import { ADMIN_PROFILE_QUERY_KEY } from '@/features/admin/config';
import type { UpdateAdminUserPayload } from '@/features/admin/types';

export interface AdminProfileFormData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

function normalizeAdminProfile(user: Awaited<ReturnType<typeof fetchCurrentUser>>): AdminProfileFormData {
  return {
    id: user.id,
    fullName: user.fullName ?? '',
    email: user.email,
    phone: user.phone ?? '',
  };
}

export function useAdminProfileQuery() {
  return useQuery({
    queryKey: ADMIN_PROFILE_QUERY_KEY,
    queryFn: async () => normalizeAdminProfile(await fetchCurrentUser()),
    staleTime: 60 * 1000,
  });
}

export function useUpdateAdminProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: Pick<UpdateAdminUserPayload, 'fullName' | 'phoneNumber' | 'email'>;
    }) => {
      await updateAdminUser(userId, payload);
      return fetchCurrentUser();
    },
    onSuccess: (user) => {
      setSessionUser(queryClient, user);
      queryClient.setQueryData(ADMIN_PROFILE_QUERY_KEY, normalizeAdminProfile(user));
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    },
  });
}

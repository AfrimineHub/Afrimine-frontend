import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/features/auth/api';
import {
  BUYER_ONBOARDING_QUERY_KEY,
  BUYER_PROFILE_QUERY_KEY,
} from './profileConfig';
import {
  fetchBuyerOnboardingProfile,
  normalizeBuyerBusinessProfile,
  updateBuyerBusinessProfile,
} from './profileApi';
import type { BuyerBusinessProfileInput, BuyerProfileFormData } from './profileTypes';

function normalizeBuyerProfile(account: Awaited<ReturnType<typeof fetchCurrentUser>>, business: unknown): BuyerProfileFormData {
  const businessProfile = normalizeBuyerBusinessProfile(business);

  return {
    fullName: account.fullName ?? '',
    email: account.email,
    phone: account.phone ?? '',
    companyName: account.companyName ?? '',
    country: businessProfile.country,
    business: businessProfile,
  };
}

export function useBuyerProfileQuery() {
  return useQuery({
    queryKey: BUYER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const [account, business] = await Promise.all([
        fetchCurrentUser(),
        fetchBuyerOnboardingProfile().catch(() => normalizeBuyerBusinessProfile(null)),
      ]);
      return normalizeBuyerProfile(account, business);
    },
    staleTime: 60 * 1000,
  });
}

export function useBuyerOnboardingQuery() {
  return useQuery({
    queryKey: BUYER_ONBOARDING_QUERY_KEY,
    queryFn: fetchBuyerOnboardingProfile,
    staleTime: 60 * 1000,
  });
}

export function useUpdateBuyerBusinessProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BuyerBusinessProfileInput) => updateBuyerBusinessProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUYER_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUYER_ONBOARDING_QUERY_KEY });
    },
  });
}

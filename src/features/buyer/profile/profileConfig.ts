const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const buyerProfileApiPaths = {
  onboarding: trimSlash(import.meta.env.VITE_ONBOARDING_PATH ?? 'onboarding'),
  businessProfile: trimSlash(
    import.meta.env.VITE_ONBOARDING_BUSINESS_PROFILE_PATH ?? 'onboarding/business-profile',
  ),
} as const;

export const BUYER_PROFILE_QUERY_KEY = ['buyer', 'profile'] as const;
export const BUYER_ONBOARDING_QUERY_KEY = ['buyer', 'onboarding'] as const;

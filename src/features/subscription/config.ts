const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const subscriptionApiPaths = {
  plans: trimSlash(import.meta.env.VITE_SUBSCRIPTION_PLANS_PATH ?? 'subscription/plans'),
  checkout: trimSlash(import.meta.env.VITE_SUBSCRIPTION_CHECKOUT_PATH ?? 'subscription/checkout'),
  changePlan: trimSlash(import.meta.env.VITE_SUBSCRIPTION_CHANGE_PLAN_PATH ?? 'subscription/change-plan'),
  cancel: trimSlash(import.meta.env.VITE_SUBSCRIPTION_CANCEL_PATH ?? 'subscription/cancel'),
  invoices: trimSlash(import.meta.env.VITE_SUBSCRIPTION_INVOICES_PATH ?? 'subscription/invoices'),
  contactSales: trimSlash(
    import.meta.env.VITE_SUBSCRIPTION_CONTACT_SALES_PATH ?? 'subscription/contact-sales',
  ),
  verifyCheckout: trimSlash(
    import.meta.env.VITE_SUBSCRIPTION_VERIFY_CHECKOUT_PATH ?? 'subscription/checkout/verify',
  ),
} as const;

export const SUBSCRIPTION_PLANS_QUERY_KEY = ['subscription', 'plans'] as const;
export const SUBSCRIPTION_INVOICES_QUERY_KEY = ['subscription', 'invoices'] as const;

const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const escrowApiPaths = {
  buyerOrderEscrow: trimSlash(import.meta.env.VITE_BUYER_ORDER_ESCROW_PATH ?? 'buyer/orders'),
  buyerOrderCheckout: trimSlash(import.meta.env.VITE_BUYER_ORDER_CHECKOUT_PATH ?? 'buyer/orders'),
  buyerOrderCheckoutVerify: trimSlash(
    import.meta.env.VITE_BUYER_ORDER_CHECKOUT_VERIFY_PATH ?? 'buyer/orders',
  ),
  vendorOrders: trimSlash(import.meta.env.VITE_VENDOR_ORDERS_PATH ?? 'vendor/orders'),
  vendorPayoutRequest: trimSlash(import.meta.env.VITE_VENDOR_PAYOUT_REQUEST_PATH ?? 'vendor/payout/request'),
  vendorQuotes: trimSlash(import.meta.env.VITE_VENDOR_QUOTES_SUBMIT_PATH ?? 'vendor/quotes'),
  adminDisputes: trimSlash(import.meta.env.VITE_ADMIN_DISPUTES_PATH ?? 'admin/disputes'),
  adminOrders: trimSlash(import.meta.env.VITE_ADMIN_ORDERS_PATH ?? 'admin/orders'),
} as const;

export const ESCROW_ORDER_QUERY_KEY = ['escrow', 'order'] as const;
export const ESCROW_DETAILS_QUERY_KEY = ['escrow', 'details'] as const;
export const ADMIN_DISPUTES_QUERY_KEY = ['admin', 'disputes'] as const;

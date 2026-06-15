/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_LOGIN_PATH?: string;
  readonly VITE_AUTH_REGISTER_PATH?: string;
  readonly VITE_AUTH_REFRESH_PATH?: string;
  readonly VITE_AUTH_LOGOUT_PATH?: string;
  readonly VITE_AUTH_ME_PATH?: string;
  readonly VITE_AUTH_FORGOT_PASSWORD_PATH?: string;
  readonly VITE_AUTH_RESET_PASSWORD_PATH?: string;
  readonly VITE_AUTH_CONFIRM_EMAIL_PATH?: string;
  readonly VITE_AUTH_RESEND_OTP_PATH?: string;
  readonly VITE_DASHBOARD_SUMMARY_PATH?: string;
  readonly VITE_DASHBOARD_NOTIFICATIONS_PATH?: string;
  readonly VITE_DASHBOARD_NOTIFICATIONS_READ_PATH?: string;
  readonly VITE_DASHBOARD_RECOMMENDED_PATH?: string;
  readonly VITE_DASHBOARD_SAVED_LISTINGS_PATH?: string;
  readonly VITE_DASHBOARD_SUBSCRIPTION_PATH?: string;
  readonly VITE_SUBSCRIPTION_PLANS_PATH?: string;
  readonly VITE_SUBSCRIPTION_CHECKOUT_PATH?: string;
  readonly VITE_SUBSCRIPTION_CHANGE_PLAN_PATH?: string;
  readonly VITE_SUBSCRIPTION_CANCEL_PATH?: string;
  readonly VITE_SUBSCRIPTION_INVOICES_PATH?: string;
  readonly VITE_SUBSCRIPTION_CONTACT_SALES_PATH?: string;
  readonly VITE_SUBSCRIPTION_VERIFY_CHECKOUT_PATH?: string;
  readonly VITE_VENDOR_LISTINGS_PATH?: string;
  readonly VITE_LISTINGS_CATEGORIES_PATH?: string;
  readonly VITE_VENDOR_REVENUE_SUMMARY_PATH?: string;
  readonly VITE_VENDOR_LISTING_PERFORMANCE_PATH?: string;
  readonly VITE_VENDOR_QUOTES_PATH?: string;
  readonly VITE_VENDOR_ORDERS_PATH?: string;
  readonly VITE_VENDOR_PAYOUTS_SUMMARY_PATH?: string;
  readonly VITE_BUYER_ORDERS_PATH?: string;
  readonly VITE_BUYER_ORDER_ESCROW_PATH?: string;
  readonly VITE_BUYER_ORDER_CHECKOUT_PATH?: string;
  readonly VITE_BUYER_ORDER_CHECKOUT_VERIFY_PATH?: string;
  readonly VITE_VENDOR_PAYOUT_REQUEST_PATH?: string;
  readonly VITE_VENDOR_QUOTES_SUBMIT_PATH?: string;
  readonly VITE_ADMIN_DISPUTES_PATH?: string;
  readonly VITE_ADMIN_ORDERS_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

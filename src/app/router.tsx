import { lazy, Suspense, type ReactElement } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from "@/layouts/Mainlayout/MainLayout";
import { GuestOnly } from "@/features/auth/components/GuestRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RoleGuard } from "@/features/auth/components/RoleGuard";
import { USER_TYPES } from "@/features/auth/types";
import { SupplierOnboardingGuard } from "@/features/supplier/components/SupplierOnboardingGuard";
import { VendorDashboardEntry } from "@/features/supplier/components/VendorDashboardEntry";

// ---------------------------------------------------------------------------
// Lazily-loaded pages.
// Each page becomes its own chunk, only downloaded when a user navigates to
// it, instead of all shipping in the single main bundle.
// ---------------------------------------------------------------------------

// Auth
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ChangePasswordPage = lazy(() => import('../features/auth/pages/ChangePasswordPage'));
const AccountRegistrationPage = lazy(() => import('../features/auth/pages/AccountRegistrationPage'));
const KycPage = lazy(() =>
  import('@/features/vendor/pages/profile').then((m) => ({ default: m.KycPage })),
);
const ProfileSetupPage = lazy(() => import('../features/auth/pages/ProfileSetupPage'));
const AccountCreatedPage = lazy(() => import('../features/auth/pages/AccountCreatedPage'));
const AccountSetupSuccessPage = lazy(() => import('../features/auth/pages/AccountSetupSuccessPage'));
const ConfirmEmailPage = lazy(() => import('../features/auth/pages/ConfirmEmailPage'));
const ResendOtpPage = lazy(() => import('../features/auth/pages/ResendOtpPage'));

// Marketplace / listings
const MarketplacePage = lazy(() => import("@/features/marketplace/pages/MarketplacePage"));
const MyAdsPage = lazy(() => import("@/features/marketplace/myAds/pages/MyAdsPage"));
const CreateListingPage = lazy(() => import("@/features/listings/pages/CreateListingPage"));
const EditListingPage = lazy(() => import("@/features/listings/pages/EditListingPage"));
const ViewListingPage = lazy(() => import("@/features/listings/pages/ViewListingPage"));
const MyOrdersPage = lazy(() => import("@/features/marketplace/myOrders/pages/MyOrderPage"));
const OrderDetailPage = lazy(() => import("@/features/marketplace/myOrders/pages/OrderDetailPage"));
const EquipmentdetailsPage = lazy(() =>
  import("@/features/marketplace").then((m) => ({ default: m.EquipmentdetailsPage })),
);
const MyBookingsPage = lazy(() => import("@/features/marketplace/myBookings/pages/MyBookingsPage"));
const MyBookingDetailPage = lazy(() => import("@/features/marketplace/myBookings/pages/MyBookingDetailPage"));

// Misc
const MessagesPage = lazy(() => import("@/features/messages/pages/MessagesPage"));
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const NotificationsPage = lazy(() => import("@/features/notification/pages/NotificationPage"));

// Vendor
const QuotesListPage = lazy(() =>
  import("@/features/vendor/pages/quotes/QuotesListPage").then((m) => ({ default: m.QuotesListPage })),
);
const QuoteDetailsPage = lazy(() =>
  import("@/features/vendor/pages/quotes/QuoteDetailsPage").then((m) => ({ default: m.QuoteDetailsPage })),
);
const VendorProfilePage = lazy(() => import("@/features/vendor/pages/profile/VendorProfilePage"));
const CompanyDetailsPage = lazy(() => import("@/features/vendor/pages/profile/CompanyDetails"));
const PayoutPage = lazy(() => import("@/features/vendor/pages/payouts/PayoutsPage"));
const SubscriptionPage = lazy(() => import("@/features/subscription/pages/SubscriptionPage"));
const RfqPage = lazy(() => import("@/features/rfq/pages/RfqPage"));
const RfqQuotesPage = lazy(() => import("@/features/rfq/pages/RfqQuotesPage"));
const VendorOpenRfqsPage = lazy(() => import("@/features/vendor/pages/rfqs/VendorOpenRfqsPage"));

// Admin
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboardPage"));
const UsersManagementPage = lazy(() => import("@/features/admin/pages/UsersManagementPage"));
const AdminListingsManagement = lazy(() => import("@/features/admin/pages/AdminListingsManagement"));
const AdminAllQuotesPage = lazy(() => import("@/features/admin/pages/AdminAllQuotesPage"));
const AdminOrderDetailPage = lazy(() => import("@/features/admin/pages/AdminOrderDetailPage"));
const AdminOrderTrackingPage = lazy(() => import("@/features/admin/pages/AdminOrderTrackingPage"));
const AdminDisputePage = lazy(() => import("@/features/admin/pages/AdminDisputePage"));
const DisputeResolutionPage = lazy(() => import("@/features/admin/pages/DisputeResolutionPage"));
const RevenueDashboard = lazy(() => import("@/features/admin/pages/RevenueDashboard"));
const AdminVendorWithdrawals = lazy(() => import("@/features/admin/pages/AdminVendorWithdrawals"));
const AdminProfilePage = lazy(() => import("@/features/admin/pages/AdminProfilePage"));
const KYCVerificationQueue = lazy(() => import("@/features/admin/pages/KYCVerificationQueue"));
const KYCReviewDetail = lazy(() => import("@/features/admin/components/KYCReviewDetail"));
const EscrowPage = lazy(() => import("@/features/admin/pages/EscrowPage"));
const MilestonesPage = lazy(() => import("@/features/admin/pages/MilestonesPage"));

// Buyer / investor
const BuyerDashboardPage = lazy(() => import("@/features/buyer/pages/BuyerDashboardPage"));
const BuyerProfilePage = lazy(() => import("@/features/buyer/pages/BuyerProfilePage"));
const InvestorDashboardPage = lazy(() => import("@/features/investor/pages/InvestorDashboardPage"));

// Supplier
const SupplierOnboardingPage = lazy(() => import("@/features/supplier/pages/SupplierOnboardingPage"));
const SupplierDashboardPage = lazy(() => import("@/features/supplier/pages/SupplierDashboardPage"));
const SupplierMachinesPage = lazy(() => import("@/features/supplier/pages/SupplierMachinesPage"));
const CreateMachinePage = lazy(() => import("@/features/supplier/pages/CreateMachinePage"));
const EditMachinePage = lazy(() => import("@/features/supplier/pages/EditMachinePage"));
const SupplierBookingsPage = lazy(() => import("@/features/supplier/pages/SupplierBookingsPage"));
const SupplierBookingDetailPage = lazy(() => import("@/features/supplier/pages/SupplierBookingDetailPage"));
const SupplierOperatorsPage = lazy(() => import("@/features/supplier/pages/SupplierOperatorsPage"));
const CreateOperatorPage = lazy(() => import("@/features/supplier/pages/CreateOperatorPage"));
const SupplierOperatorDetailPage = lazy(() => import("@/features/supplier/pages/SupplierOperatorDetailPage"));
const SupplierAccountRestrictedPage = lazy(() => import("@/features/supplier/pages/SupplierAccountRestrictedPage"));

// ---------------------------------------------------------------------------
// Suspense wrapper. Layouts (AuthLayout / MainLayout) render an <Outlet />
// for their children, so wrapping each individual lazy route element here
// (rather than once around the whole router) keeps fallback UI scoped to
// just the piece of the screen that's still loading.
// ---------------------------------------------------------------------------

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  );
}

function s(element: ReactElement): ReactElement {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <GuestOnly>
            {s(<LoginPage />)}
          </GuestOnly>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestOnly>
            {s(<ForgotPasswordPage />)}
          </GuestOnly>
        ),
      },
      {
        path: "confirm-email",
        element: (
          <GuestOnly>
            {s(<ConfirmEmailPage />)}
          </GuestOnly>
        ),
      },
      {
        path: "resend-otp",
        element: (
          <GuestOnly>
            {s(<ResendOtpPage />)}
          </GuestOnly>
        ),
      },
      {
        path: "register",
        element: (
          <GuestOnly>
            {s(<AccountRegistrationPage />)}
          </GuestOnly>
        ),
        handle: { step: '1/3' },
      },
      {
        path: "kyc",
        element: s(<KycPage />),
        handle: { step: '2/3' },
      },
      {
        path: "profile-setup",
        element: s(<ProfileSetupPage />),
        handle: { step: '3/3' },
      },
      { path: "created", element: s(<AccountCreatedPage />) },
      { path: "setup-successful", element: s(<AccountSetupSuccessPage />) },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: s(<LandingPage />) },
      { path: "home", element: s(<LandingPage />) },
      { path: "marketplace", element: s(<MarketplacePage />) },
      { path: "equipment/:id", element: s(<EquipmentdetailsPage />) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "messages", element: s(<MessagesPage />) },
          { path: "my-order", element: s(<MyOrdersPage />) },
          { path: "my-order/:orderId", element: s(<OrderDetailPage />) },
          { path: "rfq", element: s(<RfqPage />) },
          { path: "rfq/:rfqId/quotes", element: s(<RfqQuotesPage />) },
          { path: "notification", element: s(<NotificationsPage />) },
          {
            path: "change-password",
            element: s(<ChangePasswordPage />)
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.buyer]} />,
            children: [
              { path: "buyer-dashboard", element: s(<BuyerDashboardPage />) },
              { path: "buyer-profile", element: s(<BuyerProfilePage />) },
              { path: "my-bookings", element: s(<MyBookingsPage />) },
              { path: "my-bookings/:id", element: s(<MyBookingDetailPage />) },
            ],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.investor]} />,
            children: [{ path: "investor-dashboard", element: s(<InvestorDashboardPage />) }],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.supplier]} />,
            children: [
              {
                path: "supplier/onboarding",
                element: s(<SupplierOnboardingPage />),
              },
              {
                path: "supplier/restricted",
                element: s(<SupplierAccountRestrictedPage />),
              },
              {
                element: <SupplierOnboardingGuard requireComplete />,
                children: [
                  { path: "supplier-dashboard", element: s(<SupplierDashboardPage />) },
                  { path: "supplier/machines", element: s(<SupplierMachinesPage />) },
                  { path: "supplier/machines/new", element: s(<CreateMachinePage />) },
                  { path: "supplier/machines/:id/edit", element: s(<EditMachinePage />) },
                  { path: "supplier/operators", element: s(<SupplierOperatorsPage />) },
                  { path: "supplier/operators/new", element: s(<CreateOperatorPage />) },
                  { path: "supplier/operators/:id", element: s(<SupplierOperatorDetailPage />) },
                  { path: "supplier/bookings", element: s(<SupplierBookingsPage />) },
                  { path: "supplier/bookings/:id", element: s(<SupplierBookingDetailPage />) },
                ],
              },
            ],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.supplier]} />,
            children: [
              {
                path: "vendor-dashboard",
                element: (
                  <SupplierOnboardingGuard requireComplete>
                    {s(<VendorDashboardEntry />)}
                  </SupplierOnboardingGuard>
                ),
              },
              { path: "my-ad", element: s(<MyAdsPage />) },
              { path: "my-ad/new", element: s(<CreateListingPage />) },
              { path: "my-ad/:id", element: s(<ViewListingPage />) },
              { path: "my-ad/:id/edit", element: s(<EditListingPage />) },
              { path: "/dashboard/my-quotes", element: s(<QuotesListPage />) },
              { path: "/dashboard/buyer-rfqs", element: s(<VendorOpenRfqsPage />) },
              { path: "/dashboard/my-quotes/:id", element: s(<QuoteDetailsPage />) },
              { path: "/dashboard/my-subscription", element: s(<SubscriptionPage />) },
              { path: "/dashboard/my-payouts", element: s(<PayoutPage />) },
              { path: "/dashboard/my-kyc", element: s(<KycPage />) },
              { path: "/vendor-profile", element: s(<VendorProfilePage />) },
              { path: "/vendor/company-details", element: s(<CompanyDetailsPage />) },
              { path: "/vendor", element: <Navigate to="/vendor-profile" replace /> },
            ],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.superAdmin]} />,
            children: [
              { path: "/admin", element: s(<AdminDashboard />) },
              { path: "/admin/listings", element: s(<AdminListingsManagement />) },
              { path: "/admin/all-quotes", element: s(<AdminAllQuotesPage />) },
              { path: "/admin/order-tracker", element: s(<AdminOrderTrackingPage />) },
              { path: "/admin/orders/:orderId", element: s(<AdminOrderDetailPage />) },
              { path: "/admin/dispute", element: s(<AdminDisputePage />) },
              { path: "/admin/dispute/:disputeId", element: s(<DisputeResolutionPage />) },
              { path: "/admin/revenue", element: s(<RevenueDashboard />) },
              { path: "/admin/vendor-withdrawals", element: s(<AdminVendorWithdrawals />) },
              { path: "/admin/kyc/verification-queue", element: s(<KYCVerificationQueue />) },
              { path: "/admin/kyc/review/:submissionId", element: s(<KYCReviewDetail />) },
              { path: "/admin/user-management", element: s(<UsersManagementPage />) },
              { path: "/admin/profile", element: s(<AdminProfilePage />) },
              { path: "/admin/escrow", element: s(<EscrowPage />) },
              { path: "/admin/milestones", element: s(<MilestonesPage />) },
            ],
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
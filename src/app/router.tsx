import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import AccountRegistrationPage from '../features/auth/pages/AccountRegistrationPage';
import { KycPage } from '@/features/vendor/pages/profile';
import ProfileSetupPage from '../features/auth/pages/ProfileSetupPage';
import AccountCreatedPage from '../features/auth/pages/AccountCreatedPage';
import AccountSetupSuccessPage from '../features/auth/pages/AccountSetupSuccessPage';
import ConfirmEmailPage from '../features/auth/pages/ConfirmEmailPage';
import ResendOtpPage from '../features/auth/pages/ResendOtpPage';
import MainLayout from "@/layouts/Mainlayout/MainLayout";
import MarketplacePage from "@/features/marketplace/pages/MarketplacePage";
import MyAdsPage from "@/features/marketplace/myAds/pages/MyAdsPage";
import CreateListingPage from "@/features/listings/pages/CreateListingPage";
import EditListingPage from "@/features/listings/pages/EditListingPage";
import ViewListingPage from "@/features/listings/pages/ViewListingPage";
import MyOrdersPage from "@/features/marketplace/myOrders/pages/MyOrderPage";
import OrderDetailPage from "@/features/marketplace/myOrders/pages/OrderDetailPage";
import AdminOrderDetailPage from "@/features/admin/pages/AdminOrderDetailPage";
import MessagesPage from "@/features/messages/pages/MessagesPage";
import LandingPage from "@/features/landing/pages/LandingPage";
import { QuotesListPage } from "@/features/vendor/pages/quotes/QuotesListPage";
import { QuoteDetailsPage } from "@/features/vendor/pages/quotes/QuoteDetailsPage";
import VendorProfilePage from "@/features/vendor/pages/profile/VendorProfilePage";
import CompanyDetailsPage from "@/features/vendor/pages/profile/CompanyDetails";
import PayoutPage from "@/features/vendor/pages/payouts/PayoutsPage";
import SubscriptionPage from "@/features/subscription/pages/SubscriptionPage";
import RfqPage from "@/features/rfq/pages/RfqPage";
import RfqQuotesPage from "@/features/rfq/pages/RfqQuotesPage";
import VendorOpenRfqsPage from "@/features/vendor/pages/rfqs/VendorOpenRfqsPage";
import NotificationsPage from "@/features/notification/pages/NotificationPage";
import AdminDashboard from "@/features/admin/pages/AdminDashboardPage";
import UsersManagementPage from "@/features/admin/pages/UsersManagementPage";
import AdminListingsManagement from "@/features/admin/pages/AdminListingsManagement";
import AdminAllQuotesPage from "@/features/admin/pages/AdminAllQuotesPage";
import AdminOrderTrackingPage from "@/features/admin/pages/AdminOrderTrackingPage";
import AdminDisputePage from "@/features/admin/pages/AdminDisputePage";
import DisputeResolutionPage from "@/features/admin/pages/DisputeResolutionPage";
import RevenueDashboard from "@/features/admin/pages/RevenueDashboard";
import AdminVendorWithdrawals from "@/features/admin/pages/AdminVendorWithdrawals";
import KYCVerificationQueue from "@/features/admin/pages/KYCVerificationQueue";
import KYCReviewDetail from "@/features/admin/components/KYCReviewDetail";
import { GuestOnly } from "@/features/auth/components/GuestRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RoleGuard } from "@/features/auth/components/RoleGuard";
import { USER_TYPES } from "@/features/auth/types";
import BuyerDashboardPage from "@/features/buyer/pages/BuyerDashboardPage";
import InvestorDashboardPage from "@/features/investor/pages/InvestorDashboardPage";
import SupplierOnboardingPage from "@/features/supplier/pages/SupplierOnboardingPage";
import SupplierDashboardPage from "@/features/supplier/pages/SupplierDashboardPage";
import SupplierMachinesPage from "@/features/supplier/pages/SupplierMachinesPage";
import CreateMachinePage from "@/features/supplier/pages/CreateMachinePage";
import EditMachinePage from "@/features/supplier/pages/EditMachinePage";
import SupplierBookingsPage from "@/features/supplier/pages/SupplierBookingsPage";
import SupplierBookingDetailPage from "@/features/supplier/pages/SupplierBookingDetailPage";
import { SupplierOnboardingGuard } from "@/features/supplier/components/SupplierOnboardingGuard";
import { VendorDashboardEntry } from "@/features/supplier/components/VendorDashboardEntry";
import { EquipmentdetailsPage } from "@/features/marketplace";
import MyBookingsPage from "@/features/marketplace/myBookings/pages/MyBookingsPage";
import MyBookingDetailPage from "@/features/marketplace/myBookings/pages/MyBookingDetailPage";
import SupplierAccountRestrictedPage from "@/features/supplier/pages/SupplierAccountRestrictedPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestOnly>
            <ForgotPasswordPage />
          </GuestOnly>
        ),
      },
      {
        path: "confirm-email",
        element: (
          <GuestOnly>
            <ConfirmEmailPage />
          </GuestOnly>
        ),
      },
      {
        path: "resend-otp",
        element: (
          <GuestOnly>
            <ResendOtpPage />
          </GuestOnly>
        ),
      },
      {
        path: "register",
        element: (
          <GuestOnly>
            <AccountRegistrationPage />
          </GuestOnly>
        ),
        handle: { step: '1/3' },
      },
      {
        path: "kyc",
        element: <KycPage />,
        handle: { step: '2/3' },
      },
      {
        path: "profile-setup",
        element: <ProfileSetupPage />,
        handle: { step: '3/3' },
      },
      { path: "created", element: <AccountCreatedPage /> },
      { path: "setup-successful", element: <AccountSetupSuccessPage /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "home", element: <LandingPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "equipment/:id", element: <EquipmentdetailsPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "messages", element: <MessagesPage /> },
          { path: "my-order", element: <MyOrdersPage /> },
          { path: "my-order/:orderId", element: <OrderDetailPage /> },
          { path: "rfq", element: <RfqPage /> },
          { path: "rfq/:rfqId/quotes", element: <RfqQuotesPage /> },
          { path: "notification", element: <NotificationsPage /> },
          {
            element: <RoleGuard allowed={[USER_TYPES.buyer]} />,
            children: [
              { path: "buyer-dashboard", element: <BuyerDashboardPage /> },
              { path: "my-bookings", element: <MyBookingsPage /> },
              { path: "my-bookings/:id", element: <MyBookingDetailPage /> },
            ],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.investor]} />,
            children: [{ path: "investor-dashboard", element: <InvestorDashboardPage /> }],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.supplier]} />,
            children: [
              {
                path: "supplier/onboarding",
                element: <SupplierOnboardingPage />,
              },
              {
                path: "supplier/restricted",
                element: <SupplierAccountRestrictedPage />,
              },
              {
                element: <SupplierOnboardingGuard requireComplete />,
                children: [
                  { path: "supplier-dashboard", element: <SupplierDashboardPage /> },
                  { path: "supplier/machines", element: <SupplierMachinesPage /> },
                  { path: "supplier/machines/new", element: <CreateMachinePage /> },
                  { path: "supplier/machines/:id/edit", element: <EditMachinePage /> },
                  { path: "supplier/bookings", element: <SupplierBookingsPage /> },
                  { path: "supplier/bookings/:id", element: <SupplierBookingDetailPage /> },
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
                    <VendorDashboardEntry />
                  </SupplierOnboardingGuard>
                ),
              },
              { path: "my-ad", element: <MyAdsPage /> },
              { path: "my-ad/new", element: <CreateListingPage /> },
              { path: "my-ad/:id", element: <ViewListingPage /> },
              { path: "my-ad/:id/edit", element: <EditListingPage /> },
              { path: "/dashboard/my-quotes", element: <QuotesListPage /> },
              { path: "/dashboard/buyer-rfqs", element: <VendorOpenRfqsPage /> },
              { path: "/dashboard/my-quotes/:id", element: <QuoteDetailsPage /> },
              { path: "/dashboard/my-subscription", element: <SubscriptionPage /> },
              { path: "/dashboard/my-payouts", element: <PayoutPage /> },
              { path: "/dashboard/my-kyc", element: <KycPage /> },
              { path: "/vendor-profile", element: <VendorProfilePage /> },
              { path: "/vendor/company-details", element: <CompanyDetailsPage /> },
              { path: "/vendor", element: <Navigate to="/vendor-profile" replace /> },
            ],
          },
          {
            element: <RoleGuard allowed={[USER_TYPES.superAdmin]} />,
            children: [
              { path: "/admin", element: <AdminDashboard /> },
              { path: "/admin/listings", element: <AdminListingsManagement /> },
              { path: "/admin/all-quotes", element: <AdminAllQuotesPage /> },
              { path: "/admin/order-tracker", element: <AdminOrderTrackingPage /> },
              { path: "/admin/orders/:orderId", element: <AdminOrderDetailPage /> },
              { path: "/admin/dispute", element: <AdminDisputePage /> },
              { path: "/admin/dispute/:disputeId", element: <DisputeResolutionPage /> },
              { path: "/admin/revenue", element: <RevenueDashboard /> },
              { path: "/admin/vendor-withdrawals", element: <AdminVendorWithdrawals /> },
              { path: "/admin/kyc/verification-queue", element: <KYCVerificationQueue /> },
              { path: "/admin/kyc/review/:submissionId", element: <KYCReviewDetail /> },
              { path: "/admin/user-management", element: <UsersManagementPage /> },
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

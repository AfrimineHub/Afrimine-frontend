import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import AccountRegistrationPage from '../features/auth/pages/AccountRegistrationPage';
import { KycPage } from '@/features/vendor/pages/profile';
import ProfileSetupPage from '../features/auth/pages/ProfileSetupPage';
import AccountCreatedPage from '../features/auth/pages/AccountCreatedPage';
import AccountSetupSuccessPage from '../features/auth/pages/AccountSetupSuccessPage';
import MainLayout from "@/layouts/Mainlayout/MainLayout";
import MarketplacePage from "@/features/marketplace/pages/MarketplacePage";
import MyAdsPage from "@/features/marketplace/myAds/pages/MyAdsPage";
import MyOrdersPage from "@/features/marketplace/myOrders/pages/MyOrderPage";
import MessagesPage from "@/features/messages/pages/MessagesPage";
import LandingPage from "@/features/landing/pages/LandingPage";
import { VendorDashboardPage } from "@/features/vendor/pages/VendorDashboardPage";
import { QuotesListPage } from "@/features/vendor/pages/quotes/QuotesListPage";
import { QuoteDetailsPage } from "@/features/vendor/pages/quotes/QuoteDetailsPage";
import VendorProfilePage from "@/features/vendor/pages/profile/VendorProfilePage";
import CompanyDetailsPage from "@/features/vendor/pages/profile/CompanyDetails";
import PayoutPage from "@/features/vendor/pages/payouts/PayoutsPage";
import SubscriptionPage from "@/features/subscription/pages/SubscriptionPage";
import RfqPage from "@/features/rfq/pages/RfqPage";
import NotificationsPage from "@/features/notification/pages/NotificationPage";
import AdminDashboard from "@/features/admin/pages/AdminDashboardPage";
import UsersManagementPage from "@/features/admin/pages/UsersManagementPage";
import AdminListingsManagement from "@/features/admin/pages/AdminListingsManagement";
import AdminAllQuotesPage from "@/features/admin/pages/AdminAllQuotesPage";
import AdminOrderTrackingPage from "@/features/admin/pages/AdminOrderTrackingPage";
import AdminDisputePage from "@/features/admin/pages/AdminDisputePage";
import KYCVerificationQueue from "@/features/admin/pages/KYCVerificationQueue";
import KYCReviewDetail from "@/features/admin/components/KYCReviewDetail";
import { GuestOnly } from "@/features/auth/components/GuestRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

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
      {
        element: <ProtectedRoute />,
        children: [
          { path: "my-ad", element: <MyAdsPage /> },
          { path: "my-order", element: <MyOrdersPage /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "vendor-dashboard", element: <VendorDashboardPage /> },
          { path: "/dashboard/my-quotes", element: <QuotesListPage /> },
          { path: "/dashboard/my-quotes/:id", element: <QuoteDetailsPage /> },
          { path: "/dashboard/my-subscription", element: <SubscriptionPage /> },
          { path: "/dashboard/my-payouts", element: <PayoutPage /> },
          { path: "/dashboard/my-kyc", element: <KycPage /> },
          { path: "/vendor-profile", element: <VendorProfilePage /> },
          { path: "/vendor/company-details", element: <CompanyDetailsPage /> },
          { path: "/rfq", element: <RfqPage /> },
          { path: "/notification", element: <NotificationsPage /> },
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/listings", element: <AdminListingsManagement /> },
          { path: "/admin/all-quotes", element: <AdminAllQuotesPage /> },
          { path: "/admin/order-tracker", element: <AdminOrderTrackingPage /> },
          { path: "/admin/dispute", element: <AdminDisputePage /> },
          { path: "/admin/kyc/verification-queue", element: <KYCVerificationQueue /> },
          { path: "/admin/kyc/review", element: <KYCReviewDetail /> },
          { path: "/admin/user-management", element: <UsersManagementPage /> },
          { path: "/vendor", element: <Navigate to="/vendor-profile" replace /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

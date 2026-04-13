import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import AccountRegistrationPage from '../features/auth/pages/AccountRegistrationPage';
import KycPage from '../features/auth/pages/KycPage';
import ProfileSetupPage from '../features/auth/pages/ProfileSetupPage';
import AccountCreatedPage from '../features/auth/pages/AccountCreatedPage';
import AccountSetupSuccessPage from '../features/auth/pages/AccountSetupSuccessPage';
import MainLayout from "@/layouts/Mainlayout/MainLayout";
import MarketplacePage from "@/features/marketplace/pages/MarketplacePage";
import MyAdsPage from "@/features/marketplace/myAds/pages/MyAdsPage";
import MyOrdersPage from "@/features/marketplace/myOrders/pages/MyOrderPage";
import MessagesPage from "@/features/messages/pages/MessagesPage";
import LandingPage from "@/features/landing/pages/LandingPage";
import { VendorDashboardPage } from "@/features/dashboard/pages/VendorDashboardPage";
import { QuotesListPage } from "@/features/dashboard/pages/quotes/QuotesListPage";
import { QuoteDetailsPage } from "@/features/dashboard/pages/quotes/QuoteDetailsPage";

export const router = createBrowserRouter([
  { 
    path: "/auth", 
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { 
        path: "register", 
        element: <AccountRegistrationPage />, 
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
    ]
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "home", element: <LandingPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "my-ad", element: <MyAdsPage /> },
      { path: "my-order", element: <MyOrdersPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "vendor-dashboard", element: <VendorDashboardPage /> },
      { path: "/dashboard/my-quotes", element: <QuotesListPage /> },
      { path: "/dashboard/my-quotes/:id", element: <QuoteDetailsPage /> },
      { path: "/dashboard/my-subscription", element: <VendorDashboardPage /> },
      { path: "/dashboard/my-payouts", element: <VendorDashboardPage /> },
      { path: "/dashboard/my-kyc", element: <KycPage /> },
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

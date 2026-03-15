import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import AccountRegistrationPage from '../features/auth/pages/AccountRegistrationPage';
import KycPage from '../features/auth/pages/KycPage';
import ProfileSetupPage from '../features/auth/pages/ProfileSetupPage';
import AccountCreatedPage from '../features/auth/pages/AccountCreatedPage';
import AccountSetupSuccessPage from '../features/auth/pages/AccountSetupSuccessPage';
import MainLayout from "@/layouts/Mainlayout/MainLayout";
import HomePage from "@/features/home/pages/HomePage";

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
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthPage from "../features/auth/AuthPage";

export const router = createBrowserRouter([
  { path: "/login", element: <AuthPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

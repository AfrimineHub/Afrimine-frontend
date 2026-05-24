import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { queryClient } from "@/app/queryClient";
import { AuthProvider } from "@/features/auth/AuthProvider";
import store from "../store";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  </ReduxProvider>
);

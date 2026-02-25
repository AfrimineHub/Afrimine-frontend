import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import store from "../store";

const queryClient = new QueryClient();

export const AppProviders: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </ReduxProvider>
);

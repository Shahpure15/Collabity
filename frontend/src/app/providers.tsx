import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/features/auth/auth-context";
import { CollegeProvider } from "@/features/college/college-context";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CollegeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CollegeProvider>
      </ThemeProvider>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}

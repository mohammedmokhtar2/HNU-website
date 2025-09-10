'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from './theme-context';
import { UserProvider } from './userContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <ThemeProvider>
          <UserProvider>

            {children}
          </UserProvider>

        </ThemeProvider>
      </NextThemeProvider>
    </QueryClientProvider>
  );
}

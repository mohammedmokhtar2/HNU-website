'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode, useState } from 'react';
import { UserProvider } from './userContext';
import { UniversityProvider } from './UniversityContext';
import { CollegeProvider } from './CollegeContext';
import { SectionProvider } from './SectionContext';
import { EventConfigProvider } from './EventConfigContext';
import { ClerkProviderWrapper } from '@/components/providers/ClerkProvider';

interface ProvidersProps {
  children: ReactNode;
  collegeId?: string;
}

export function Providers({
  children,
  collegeId,
}: ProvidersProps) {
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
    <ClerkProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <NextThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <UniversityProvider>
            <CollegeProvider>
              <SectionProvider
                collegeId={collegeId}
              >
                <EventConfigProvider>
                  <UserProvider>{children}</UserProvider>
                </EventConfigProvider>
              </SectionProvider>
            </CollegeProvider>
          </UniversityProvider>
        </NextThemeProvider>
      </QueryClientProvider>
    </ClerkProviderWrapper>
  );
}

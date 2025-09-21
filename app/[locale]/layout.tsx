import type { Metadata } from 'next';
import './globals.css';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/contexts';
import Header3 from '@/components/layout/header3';
import DecorativeWrapper from '@/components/DecorativeWrapper';
import DockSocialMediaLinks from '@/components/layout/dockSocialMediaLinks';
import Footer from '@/components/layout/footer';
import { headerData } from '@/data/index';
import ChatWidget from '@/components/chat/ChatWidget';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Helwan National University',
  description: 'The official website of Helwan National University',
  icons: {
    icon: '/home.jpeg',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale}>
          <Providers universityId='cmfswgpf10000ubcgetg8o4fy'>
            <Header3 {...headerData} />
            <main className='bg-white'>
              <DecorativeWrapper>{children}</DecorativeWrapper>
            </main>
            <Footer local={locale} />
            {/* <DockSocialMediaLinks /> */}
            <ChatWidget />
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

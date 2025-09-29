import { PageRenderer } from '@/components/PageSection/PageRenderer';
import { notFound } from 'next/navigation';

interface DynamicPageProps {
  params: {
    locale: string;
    pageSlug: string;
  };
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const { pageSlug } = params;

  // Basic validation for pageSlug
  if (!pageSlug || typeof pageSlug !== 'string') {
    return notFound();
  }

  // Prevent certain reserved slugs
  const reservedSlugs = [
    'admin',
    'api',
    '_next',
    'static',
    'blogs',
    'about',
    'contact',
  ];
  if (reservedSlugs.includes(pageSlug)) {
    return notFound();
  }

  return <PageRenderer pageSlug={pageSlug} />;
}

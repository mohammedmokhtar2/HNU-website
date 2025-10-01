import { PageRenderer } from '@/components/PageSection/PageRenderer';
import { notFound } from 'next/navigation';
import HelwanPlusPage from '../../helwanPlus/page';

interface DynamicPageProps {
  params: {
    locale: string;
    pageSlug: string;
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { pageSlug } = await params;

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

  if (pageSlug === 'helwan-plus-team') {
    return <HelwanPlusPage />;
  }



  return <PageRenderer pageSlug={pageSlug} />;
}

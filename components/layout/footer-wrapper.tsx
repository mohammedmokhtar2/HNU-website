'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';
import Copyright from './copyright';

export interface FooterWrapperProps {
  local: string;
  showFooter?: boolean;
  showCopyright?: boolean;
  customDisplayLogic?: (pathname: string) => {
    showFooter: boolean;
    showCopyright: boolean;
  };
}

function FooterWrapper({
  local,
  showFooter = true,
  showCopyright = true,
  customDisplayLogic,
}: FooterWrapperProps) {
  const pathname = usePathname();

  // Use custom display logic if provided, otherwise use default logic
  const displayConfig = customDisplayLogic
    ? customDisplayLogic(pathname || '')
    : { showFooter, showCopyright };

  // Default logic: hide both on admin pages
  const shouldShowFooter =
    displayConfig.showFooter &&
    !(
      pathname?.includes('/admin') ||
      pathname?.includes('/pages/student-union') ||
      pathname?.includes('pages/family-of-egypt')
    );

  const shouldShowCopyright =
    displayConfig.showCopyright &&
    !(
      pathname?.includes('/admin') ||
      pathname?.includes('/pages/student-union') ||
      pathname?.includes('pages/family-of-egypt')
    );

  return (
    <>
      {shouldShowFooter && <Footer local={local} />}
      {shouldShowCopyright && <Copyright local={local} />}
    </>
  );
}

export default FooterWrapper;

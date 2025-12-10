// Example usage of FooterWrapper component
// This file demonstrates different ways to use the FooterWrapper component

import FooterWrapper from '@/components/layout/footer-wrapper';

// Example 1: Basic usage (same as before)
function BasicUsage({ locale }: { locale: string }) {
  return <FooterWrapper local={locale} />;
}

// Example 2: Hide footer on specific pages
function ConditionalDisplay({ locale }: { locale: string }) {
  return (
    <FooterWrapper
      local={locale}
      showFooter={true}
      showCopyright={false} // Hide copyright but show footer
    />
  );
}

// Example 3: Custom display logic
function CustomLogic({ locale }: { locale: string }) {
  const customDisplayLogic = (pathname: string) => {
    // Show footer on all pages except admin
    const showFooter = !pathname.includes('/admin');

    // Show copyright only on main pages (not on sub-pages)
    const showCopyright =
      !pathname.includes('/pages/') && !pathname.includes('/admin');

    return { showFooter, showCopyright };
  };

  return (
    <FooterWrapper local={locale} customDisplayLogic={customDisplayLogic} />
  );
}

// Example 4: Hide both components
function HideBoth({ locale }: { locale: string }) {
  return (
    <FooterWrapper local={locale} showFooter={false} showCopyright={false} />
  );
}

export { BasicUsage, ConditionalDisplay, CustomLogic, HideBoth };

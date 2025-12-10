'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ChevronDown, MenuIcon } from 'lucide-react';
import { useUniversity } from '@/contexts/UniversityContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export interface Label {
  ar: string;
  en: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface NavigationItem {
  label: Label;
  href: string;
  linkType?: 'page' | 'external';
  pageId?: string;
  submenu?: NavigationItem[];
}

export interface HeaderData {
  languages?: Language[];
  navigationItems?: NavigationItem[];
}

// ---------- Component ----------
function Header3({ navigationItems = [] }: HeaderData) {
  const locale = useLocale();
  const pathname = usePathname();
  const { university } = useUniversity();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isHelwanPlusTeam = pathname.includes('/helwan-plus-team');

  // menuBuilder?: {
  //   menuItems: {
  //     title: string;
  //     href: string;
  //     submenu?: {
  //       title: string;
  //       href: string;
  //     }[];
  //   }[];
  // };

  const config = university?.config;

  const menuBuilder = config?.menuBuilder;

  if (menuBuilder && menuBuilder.menuItems) {
    navigationItems = menuBuilder.menuItems.map(item => ({
      label: {
        en: typeof item.title === 'object' ? item.title.en : item.title,
        ar: typeof item.title === 'object' ? item.title.ar : item.title,
      },
      href: item.href,
      linkType: item.linkType || 'external',
      pageId: item.pageId,
      submenu: item.submenu?.map(subitem => ({
        label: {
          en:
            typeof subitem.title === 'object'
              ? subitem.title.en
              : subitem.title,
          ar:
            typeof subitem.title === 'object'
              ? subitem.title.ar
              : subitem.title,
        },
        href: subitem.href,
        linkType: subitem.linkType || 'external',
        pageId: subitem.pageId,
      })),
    }));
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeSidebar();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const currentLocale = locale as 'en' | 'ar';
  const basePath = '/';
  const isRTL = currentLocale === 'ar';

  const closeSidebar = () => {
    setOpen(false);
    setOpenSubmenus(new Set());
  };

  const toggleSubmenu = (href: string) => {
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(href)) {
      newOpenSubmenus.delete(href);
    } else {
      newOpenSubmenus.add(href);
    }
    setOpenSubmenus(newOpenSubmenus);
  };

  const handleSubmenuKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSubmenu(href);
    }
  };

  const isActivePath = (href: string) => {
    const normalizedPathname = pathname?.replace(/^\/(en|ar)/, '') || '/';
    return (
      normalizedPathname === href || normalizedPathname.startsWith(href + '/')
    );
  };

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // if the rotues starts with /admin, then show the admin header
  if (
    pathname.startsWith('/admin') ||
    pathname.includes('/programs/') ||
    pathname.includes('/blogs')
  ) {
    return null;
  }

  const headerLogo = isHelwanPlusTeam
    ? '/helwanBlack.png'
    : isScrolled
      ? '/logo-hnu-web2.png'
      : '/logossss.png';

  const logo = config?.logo || headerLogo;

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'shadow-xl h-30 bg-white/50' : 'bg-transparent h-30'
        }`}
      >
        <div className='h-full w-full'>
          <div className='flex justify-between items-center h-full mx-auto'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link href={basePath} className='text-white font-bold text-xl'>
                <Image
                  src={logo}
                  alt='HNU Logo'
                  width={isMobile ? 190 : 220}
                  height={isMobile ? 190 : 220}
                  className='object-contain mt-0'
                />
              </Link>
            </div>

            {/* Right Controls */}
            <div className='flex items-center gap-2 flex-shrink-0 mr-4 sm:mr-8 ml-4 sm:ml-20'>
              {/* Switch Language */}
              <Link
                href={pathname}
                locale={currentLocale === 'en' ? 'ar' : 'en'}
                onClick={closeSidebar}
              >
                <Button
                  variant={isScrolled ? 'default' : 'outline'}
                  size={isMobile ? 'sm' : 'lg'}
                  className={`rounded-lg border-white/30 text-white transition-all duration-300
      h-10 px-3 text-xs bg-transparent flex items-center gap-2
      ${isScrolled ? 'bg-slate-900 hover:bg-slate-900/80' : 'hover:bg-slate-200/80'}`}
                  aria-label={`Switch to ${currentLocale === 'en' ? 'Arabic' : 'English'}`}
                >
                  {currentLocale === 'en' ? (
                    <>
                      <span className='text-lg'>🇪🇬</span>
                      <span className='text-sm'>العربية</span>
                    </>
                  ) : (
                    <span className='text-sm'>English</span>
                  )}
                </Button>
              </Link>

              {/* Menu Button */}
              <Button
                ref={menuButtonRef}
                onClick={() => setOpen(true)}
                variant={isScrolled ? 'default' : 'outline'}
                size={isMobile ? 'sm' : 'lg'}
                className={`rounded-lg border-white/30 text-white transition-all duration-300
                  h-10 w-10 text-xs sm:text-sm bg-transparent
                  ${isScrolled ? 'bg-slate-900 hover:bg-slate-900/80' : 'hover:bg-slate-200/80'}`}
                aria-label='Open navigation menu'
                aria-expanded={open}
              >
                <MenuIcon className='h-10 w-10 ' />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div
          className='fixed inset-0 bg-black/20 z-40'
          onClick={closeSidebar}
          aria-hidden='true'
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md shadow-2xl overflow-y-auto bg-black/50 backdrop-blur-md transform transition-transform duration-300 z-50 
        ${open ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`}
        role='dialog'
        aria-modal='true'
        aria-label='Navigation menu'
      >
        {/* Header */}
        <div
          className={`p-4 flex justify-between items-center border-b border-white/20 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <div className='flex-shrink-0'>
            <Link
              href={basePath}
              className='text-white font-bold text-xl'
              onClick={closeSidebar}
            >
              <Image
                src='/logossss.png'
                alt='HNU Logo'
                width={180}
                height={180}
                className='object-contain'
              />
            </Link>
          </div>
          <Button
            onClick={closeSidebar}
            variant='outline'
            size='lg'
            className='h-10 w-32 text-xs border-white/30 text-white hover:bg-slate-200/80 transition-all duration-300 bg-transparent'
            aria-label='Close navigation menu'
          >
            <span className='font-bold text-sm'>
              {isRTL ? 'إغلاق' : 'Close'}
            </span>
            <ChevronDown className='h-4 w-4 ml-1' />
          </Button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4' role='navigation'>
          <ul className='space-y-2'>
            {navigationItems.map(item => (
              <li key={item.href}>
                <div className='group'>
                  <div className='flex items-center justify-between'>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex-1 block px-4 py-3 rounded-lg text-white transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        isActivePath(item.href)
                          ? 'bg-white/20 font-semibold'
                          : ''
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <span className='text-sm font-medium'>
                        {item.label[currentLocale]}
                      </span>
                    </Link>

                    {item.submenu && item.submenu.length > 0 && (
                      <Button
                        onClick={() => toggleSubmenu(item.href)}
                        onKeyDown={e => handleSubmenuKeyDown(e, item.href)}
                        className={`p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 bg-transparent ${
                          isRTL ? 'mr-2' : 'ml-2'
                        }`}
                        aria-expanded={openSubmenus.has(item.href)}
                        aria-label={`${
                          openSubmenus.has(item.href) ? 'Collapse' : 'Expand'
                        } ${item.label[currentLocale]} submenu`}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openSubmenus.has(item.href) ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    )}
                  </div>

                  {item.submenu && item.submenu.length > 0 && (
                    <div
                      className={`overflow-y-auto transition-all duration-300 ease-in-out ${
                        openSubmenus.has(item.href)
                          ? 'max-h-96 opacity-100 mt-2'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <ul
                        className={`space-y-1 ${
                          isRTL ? 'pr-4' : 'pl-4'
                        } border-l-2 border-white/20`}
                      >
                        {item.submenu.map(subItem => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              onClick={closeSidebar}
                              className={`block px-4 py-2 rounded-lg text-white/80 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-white/20 ${
                                isActivePath(subItem.href)
                                  ? 'bg-white/15 text-white font-medium'
                                  : ''
                              } ${isRTL ? 'text-right' : 'text-left'}`}
                            >
                              {subItem.label[currentLocale]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className='p-4 border-t border-white/20'>
          <div
            className={`flex items-center justify-center gap-4 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <Link
              href={pathname}
              locale={currentLocale === 'en' ? 'ar' : 'en'}
              onClick={closeSidebar}
            >
              <Button
                variant='outline'
                size='sm'
                className='border-white/30 text-white hover:bg-slate-200/80 transition-all duration-300 bg-transparent'
                aria-label={`Switch to ${
                  currentLocale === 'en' ? 'Arabic' : 'English'
                }`}
              >
                <span className='text-lg mr-2'>
                  {currentLocale === 'en' ? '🇪🇬' : '🇬🇧'}
                </span>
                <span className='text-sm'>
                  {currentLocale === 'en' ? 'العربية' : 'English'}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header3;

'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Home,
  Menu,
  Users,
  BarChart3,
  LogOut,
  Settings,
  Database,
  GraduationCap,
  User,
  FileText,
  ChevronDown,
  Building2,
  Shield,
  ClipboardList,
  TestTube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Header } from './header';
import { useLocale } from 'next-intl';
import { useCurrentUser } from '@/contexts/userContext';
import { CollegeService } from '@/services/collage.service';
import { useQuery } from '@tanstack/react-query';
import { College } from '@/types/college';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  dynamicBadge?: boolean | string;
  roles?: ('ADMIN' | 'SUPERADMIN' | 'OWNER')[];
  subItems?: SubItem[];
  hasSubItems?: boolean;
}

interface SubItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('ADMIN' | 'SUPERADMIN' | 'OWNER')[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation configuration with role-based access
const navigationSections: NavSection[] = [
  {
    title: 'Home',
    items: [
      {
        title: 'Main Site',
        href: '/',
        icon: Home,
        description: 'Return to the university website',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
      },
    ],
  },
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        href: '/admin',
        icon: Home,
        description: 'University dashboard and analytics',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        description: 'University statistics and insights',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Portfolios Management',
    items: [
      {
        title: 'University Config',
        href: '/admin/dashboard/uni',
        icon: Building2,
        description: 'University configuration and settings',
        roles: ['OWNER'],
        badge: 'Soon',
      },
      {
        title: 'Collage Studio',
        href: '/admin/dashboard/collages',
        icon: FolderOpen,
        description: 'Collage portfolios and management',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
        dynamicBadge: true,
        hasSubItems: true,
      },
      {
        title: 'Department',
        href: '/admin/dashboard/departments',
        icon: FolderOpen,
        description: 'Department portfolios',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'User Management',
        href: '/admin/dashboard/users',
        icon: Users,
        description: 'Manage admin users and permissions',
        roles: ['OWNER'],
      },
      {
        title: 'Permissions',
        href: '/admin/dashboard/permissions',
        icon: Shield,
        description: 'Manage permissions',
        roles: ['OWNER', 'SUPERADMIN'],
      },
      {
        title: 'Database',
        href: '/admin/database',
        icon: Database,
        description: 'System database administration and logs',
        roles: ['OWNER'],
        badge: 'Soon',
      },
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        description: 'System configuration',
        roles: ['OWNER'],
        badge: 'Soon',
      },
      {
        title: 'Forms',
        href: '/admin/dashboard/forms',
        icon: FileText,
        description: 'Manage forms',
        roles: ['OWNER'],
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Personal',
    items: [
      {
        title: 'Profile',
        href: '/admin/profile',
        icon: User,
      },
      {
        title: 'Audit Logs',
        href: '/admin/logs',
        icon: ClipboardList,
      },
      // {
      //   title: 'Test',
      //   href: '/admin/dashboard/rbac-test',
      //   icon: TestTube,
      // },
    ],
  },
];

function SidebarContent({
  collapsed,
  onNavigate,
  locale,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  locale: string;
}) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [openCollageStudio, setOpenCollageStudio] = useState(false);

  // Fetch collages based on user type and role
  const { data: allCollages, isLoading: allCollagesLoading } = useQuery({
    queryKey: ['collages', 'all'],
    queryFn: () => CollegeService.getColleges(),
    enabled: user?.role === 'OWNER',
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { data: createdCollages, isLoading: createdLoading } = useQuery({
    queryKey: ['collages', 'created', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User ID is required');
      return CollegeService.getColleges({ createdById: user.id });
    },
    enabled: user?.role !== 'OWNER' && !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { data: memberCollages, isLoading: memberLoading } = useQuery({
    queryKey: ['collages', 'member', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User ID is required');
      return CollegeService.getColleges({ assignedToUserId: user.id });
    },
    enabled: user?.role !== 'OWNER' && !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // Combine collages based on user role
  const userCollages =
    user?.role === 'OWNER'
      ? allCollages || []
      : [...(createdCollages || []), ...(memberCollages || [])];

  // Remove duplicates and create subitems
  const uniqueCollages = userCollages.filter(
    (college, index, self) => index === self.findIndex(c => c.id === college.id)
  );

  // Create collages navigation item with subitems
  const collagesSubItems: (SubItem & { logoUrl?: string })[] =
    uniqueCollages.map(college => ({
      title:
        typeof college.name === 'string'
          ? college.name
          : college.name?.en || college.name?.ar || 'Unknown College',
      href: `/admin/dashboard/collages/${college.slug}`,
      icon: FolderOpen,
      logoUrl: college.config?.logoUrl,
      roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
    }));

  // Update the navigation sections to include collages as a dropdown
  const navigationSectionsWithCollages = navigationSections.map(section => {
    if (section.title === 'Portfolios Management') {
      return {
        ...section,
        items: section.items.map(item => {
          if (item.title === 'Collage Studio') {
            return {
              ...item,
              subItems: collagesSubItems,
              hasSubItems: true,
              dynamicBadge: collagesSubItems.length.toString(),
            };
          }
          return item;
        }),
      };
    }
    return section;
  });

  const globalLoading = allCollagesLoading || createdLoading || memberLoading;

  return (
    <div className='flex h-full flex-col bg-gray-950'>
      {/* Header */}
      <div className='flex h-16 items-center border-b border-gray-800 px-4 bg-gray-900/50'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-900'>
            <GraduationCap className='h-4 w-4' />
          </div>
          {!collapsed && (
            <div className='flex flex-col'>
              <span className='text-sm font-semibold text-white'>
                Official Website Admin Panel
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className='flex-1 overflow-y-auto py-4 bg-gray-950'>
        <nav className='space-y-6 px-3'>
          {navigationSectionsWithCollages.map((section: NavSection) => {
            // Filter items based on user role
            const filteredItems = section.items.filter(
              (item: NavItem) =>
                !item.roles ||
                item.roles.includes(
                  user?.role as 'ADMIN' | 'SUPERADMIN' | 'OWNER'
                )
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title}>
                {!collapsed && (
                  <h3 className='mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>
                    {section.title}
                  </h3>
                )}
                <div className='space-y-1'>
                  {filteredItems.map((item: NavItem) => {
                    const isActive = pathname === `/${locale}${item.href}`;
                    const Icon = item.icon;
                    const isDisabled = item.badge === 'Soon';
                    const hasSubItems =
                      item.subItems && item.subItems.length > 0;

                    // Get the badge value - either static or dynamic
                    let badgeValue = item.badge;
                    if (item.dynamicBadge && item.title === 'Collage Studio') {
                      badgeValue =
                        typeof item.dynamicBadge === 'string'
                          ? item.dynamicBadge
                          : globalLoading
                            ? '...'
                            : collagesSubItems.length.toString();
                    }

                    if (collapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>
                            <Link
                              href={isDisabled ? '#' : `/${locale}${item.href}`}
                              onClick={onNavigate}
                              className={cn(
                                'flex items-center justify-center rounded-lg p-2 text-sm transition-all hover:bg-gray-900/50 text-gray-300 hover:text-white',
                                isActive && 'bg-gray-900/50 text-white',
                                isDisabled &&
                                  'cursor-not-allowed opacity-50 hover:bg-transparent'
                              )}
                            >
                              <Icon className='h-4 w-4 flex-shrink-0' />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side='right'>
                            {item.title}
                            {item.description && (
                              <p className='text-xs text-gray-400 mt-1'>
                                {item.description}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    // Render collapsible item with subitems
                    if (hasSubItems && !collapsed) {
                      return (
                        <div key={item.href}>
                          <Collapsible
                            open={openCollageStudio}
                            onOpenChange={setOpenCollageStudio}
                          >
                            <div className='flex items-center'>
                              {/* Main item link */}
                              <Link
                                href={
                                  isDisabled ? '#' : `/${locale}${item.href}`
                                }
                                onClick={onNavigate}
                                className={cn(
                                  'flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-900/50 text-gray-300 hover:text-white',
                                  isActive && 'bg-gray-900/50 text-white',
                                  isDisabled &&
                                    'cursor-not-allowed opacity-50 hover:bg-transparent'
                                )}
                              >
                                <Icon className='h-4 w-4 flex-shrink-0' />
                                <div className='flex-1'>
                                  <div className='flex items-center gap-2'>
                                    <span className='font-medium'>
                                      {item.title}
                                    </span>
                                    {badgeValue && (
                                      <Badge
                                        variant={
                                          badgeValue === 'Soon'
                                            ? 'secondary'
                                            : 'default'
                                        }
                                        className='h-5 text-xs bg-gray-800 text-gray-300 border-gray-700'
                                      >
                                        {badgeValue}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className='text-xs text-gray-400'>
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </Link>

                              {/* Dropdown toggle */}
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='p-1 h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-900/50'
                                >
                                  <ChevronDown
                                    className={cn(
                                      'h-4 w-4 transition-transform',
                                      openCollageStudio && 'rotate-180'
                                    )}
                                  />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className='space-y-1 mt-1'>
                              {item.subItems?.map(
                                (subItem: SubItem & { logoUrl?: string }) => {
                                  const isSubActive =
                                    pathname === `/${locale}${subItem.href}`;
                                  const SubIcon = subItem.icon;

                                  return (
                                    <Link
                                      key={subItem.href}
                                      href={`/${locale}${subItem.href}`}
                                      onClick={onNavigate}
                                      className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-900/50 text-gray-300 hover:text-white ml-6',
                                        isSubActive &&
                                          'bg-gray-900/50 text-white'
                                      )}
                                    >
                                      {subItem.logoUrl ? (
                                        <Avatar className='h-6 w-6'>
                                          <AvatarImage
                                            src={subItem.logoUrl}
                                            alt={subItem.title}
                                          />
                                          <AvatarFallback>
                                            <SubIcon className='h-3 w-3' />
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <SubIcon className='h-3 w-3 flex-shrink-0' />
                                      )}
                                      <span className='font-medium'>
                                        {subItem.title}
                                      </span>
                                    </Link>
                                  );
                                }
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    }

                    // Render regular item
                    return (
                      <Link
                        key={item.href}
                        href={isDisabled ? '#' : `/${locale}${item.href}`}
                        onClick={onNavigate}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-900/50 text-gray-300 hover:text-white',
                          isActive && 'bg-gray-900/50 text-white',
                          isDisabled &&
                            'cursor-not-allowed opacity-50 hover:bg-transparent'
                        )}
                      >
                        <Icon className='h-4 w-4 flex-shrink-0' />
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>{item.title}</span>
                            {badgeValue && (
                              <Badge
                                variant={
                                  badgeValue === 'Soon'
                                    ? 'secondary'
                                    : 'default'
                                }
                                className='h-5 text-xs bg-gray-800 text-gray-300 border-gray-700'
                              >
                                {badgeValue}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className='text-xs text-gray-400'>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {!collapsed && <Separator className='mt-4 bg-gray-800' />}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className='border-t border-gray-800 p-4 bg-gray-900/50'>
        <div
          className={cn(
            'flex items-center gap-3',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <Button
            variant='ghost'
            size={collapsed ? 'icon' : 'default'}
            className={cn(
              'text-red-400 hover:text-red-300 hover:bg-gray-800',
              collapsed ? 'h-8 w-8' : 'h-8'
            )}
            onClick={() => {
              // Handle logout - you can implement this with your auth system
              window.location.href = '/';
            }}
          >
            <LogOut className='h-4 w-4' />
            {!collapsed && <span className='ml-2'>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar({
  collapsed,
  setCollapsed,
  locale,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  locale: string;
}) {
  return (
    <div
      className={cn(
        'relative hidden border-r border-gray-800 bg-gray-950 transition-all duration-300 lg:block',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarContent collapsed={collapsed} locale={locale} />

      {/* Collapse Toggle */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-gray-700 bg-gray-950 p-0 shadow-md text-gray-300 hover:text-white hover:bg-gray-900'
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className='h-3 w-3' />
        ) : (
          <ChevronLeft className='h-3 w-3' />
        )}
        <span className='sr-only'>Toggle sidebar</span>
      </Button>
    </div>
  );
}

function MobileSidebar({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='lg:hidden text-gray-300 hover:text-white hover:bg-gray-900'
        >
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-64 p-0 bg-gray-950 border-gray-800'
      >
        <SidebarContent
          collapsed={false}
          onNavigate={() => setOpen(false)}
          locale={locale}
        />
      </SheetContent>
    </Sheet>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const locale = useLocale();
  return (
    <div className='flex h-screen bg-gray-950'>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        locale={locale} // Pass locale to sidebar if needed
      />

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden bg-gray-950'>
        {/* header */}
        <Header />
        {/* Mobile Header */}
        <header className='flex h-16 items-center gap-4 border-b border-gray-800 bg-gray-950 px-4 lg:hidden'>
          <MobileSidebar locale={locale} />
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-4 md:p-6 bg-gray-950'>
          {children}
        </main>
      </div>
    </div>
  );
}

import type React from 'react';

export interface NavItem {
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

export interface SubItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('ADMIN' | 'SUPERADMIN' | 'OWNER')[];
  logoUrl?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

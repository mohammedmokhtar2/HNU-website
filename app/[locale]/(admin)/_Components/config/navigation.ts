import {
  Home,
  BarChart3,
  FolderOpen,
  Building2,
  Users,
  File,
  Book,
  ClipboardList,
  Shield,
  Database,
  Settings,
  FileText,
  User,
  Mail,
} from 'lucide-react';
import { NavSection } from '../types/navigation';

// Navigation configuration with role-based access
export const navigationSections: NavSection[] = [
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
        href: '/admin/dashboard',
        icon: BarChart3,
        description: 'University statistics and insights',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
      },
    ],
  },
  {
    title: 'Dashboard Management',
    items: [
      {
        title: 'University Config',
        href: '/admin/dashboard/uni',
        icon: Building2,
        description: 'University configuration and settings',
        roles: ['OWNER'],
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
        title: 'Programs',
        href: '/admin/dashboard/programs',
        icon: FolderOpen,
        description: 'Program portfolios',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'User Management',
        href: '/admin/system/users',
        icon: Users,
        description: 'Manage admin users and permissions',
        roles: ['OWNER'],
      },
      {
        title: 'Storage',
        href: '/admin/system/storage',
        icon: File,
        description: 'Manage storage',
        roles: ['OWNER'],
      },
      {
        title: 'Blogs',
        href: '/admin/system/blogs',
        icon: Book,
        description: 'Manage blogs',
        roles: ['OWNER'],
      },
      {
        title: 'Messages',
        href: '/admin/system/messages',
        icon: Mail,
        description: 'Manage messages and notifications',
        roles: ['OWNER', 'SUPERADMIN', 'ADMIN'],
        dynamicBadge: true,
      },
      {
        title: 'Audit Logs',
        href: '/admin/system/logs',
        icon: ClipboardList,
        description: 'Manage audit logs',
        roles: ['OWNER'],
      },
      {
        title: 'Permissions',
        href: '/admin/system/permissions',
        icon: Shield,
        description: 'Manage permissions',
        roles: ['OWNER', 'SUPERADMIN'],
        badge: 'Soon',
      },
      {
        title: 'Database',
        href: '/admin/system/database',
        icon: Database,
        description: 'System database administration and logs',
        roles: ['OWNER'],
        badge: 'Soon',
      },
      {
        title: 'Settings',
        href: '/admin/system/settings',
        icon: Settings,
        description: 'System configuration',
        roles: ['OWNER'],
        badge: 'Soon',
      },
      {
        title: 'Forms',
        href: '/admin/system/forms',
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
    ],
  },
];

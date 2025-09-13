# Reusable Header System

A flexible header component system that supports both admin and user views with context menu editing capabilities.

## Features

- **Dual View Modes**: Switch between user (read-only) and admin (editable) views
- **Context Menu Editing**: Right-click on elements to access editing options
- **Double-click Editing**: Double-click on logo to edit directly
- **Menu Builder Integration**: Full menu editing with drag-and-drop support
- **Image Selector**: Built-in image selection for logo changes
- **RTL Support**: Full right-to-left language support
- **Mobile Responsive**: Works on all screen sizes
- **TypeScript**: Fully typed for better development experience

## Components

### Core Components

- `ReusableHeader.tsx` - Main header component
- `AppLayout.tsx` - Layout wrapper with providers
- `ViewModeToggle.tsx` - Toggle between admin/user modes
- `MenuEditorModal.tsx` - Modal for editing navigation menu

### Context Providers

- `ViewModeContext.tsx` - Manages admin/user view state
- `HeaderDataContext.tsx` - Manages header data (logo, menu items)

## Usage

### 1. Wrap your app with the layout

```tsx
import AppLayout from '@/components/layout/AppLayout';

function MyApp({ children }) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
```

### 2. Use the header data in your components

```tsx
import { useHeaderData } from '@/contexts/HeaderDataContext';
import { useViewMode } from '@/contexts/ViewModeContext';

function MyComponent() {
  const { logo, navigationItems, updateHeaderData } = useHeaderData();
  const { isAdmin } = useViewMode();

  const handleUpdateLogo = (newLogo) => {
    updateHeaderData({ logo: newLogo });
  };

  return (
    <div>
      {isAdmin && <p>You are in admin mode</p>}
      <img src={logo} alt="Logo" />
    </div>
  );
}
```

### 3. Initialize header data

```tsx
import { useHeaderData } from '@/contexts/HeaderDataContext';

function MyPage() {
  const { updateHeaderData } = useHeaderData();

  useEffect(() => {
    updateHeaderData({
      logo: '/my-logo.png',
      navigationItems: [
        {
          label: { en: 'Home', ar: 'الرئيسية' },
          href: '/',
        },
        {
          label: { en: 'About', ar: 'من نحن' },
          href: '/about',
          submenu: [
            {
              label: { en: 'Our Story', ar: 'قصتنا' },
              href: '/about/story',
            },
          ],
        },
      ],
    });
  }, []);

  return <div>Your page content</div>;
}
```

## Admin Features

### Logo Editing
- **Double-click** on the logo to edit the URL directly
- **Right-click** on the logo to open context menu
- Use the image selector to choose from existing images

### Menu Editing
- **Right-click** on the logo and select "Edit Menu"
- Use the menu builder to create and organize navigation items
- Support for nested submenus
- Drag and drop reordering

### View Mode Toggle
- Toggle button appears in bottom-right corner when in admin mode
- Switch between "User Mode" (read-only) and "Admin Mode" (editable)

## Data Structure

### NavigationItem Interface

```tsx
interface NavigationItem {
  label: {
    en: string;
    ar: string;
  };
  href: string;
  submenu?: NavigationItem[];
}
```

### Header Data

```tsx
interface HeaderData {
  logo: string;
  navigationItems: NavigationItem[];
}
```

## Styling

The header uses Tailwind CSS classes and follows the existing design system. You can customize the appearance by modifying the component styles or using CSS variables.

## Examples

See `components/examples/HeaderExample.tsx` for a complete working example.

## Integration with University Config

This system integrates with the university configuration system:

1. Load university config data into the header context
2. Save changes back to the university config
3. Use the same menu builder component for consistency

```tsx
// In your university config page
const { config, updateConfig } = useUniversityConfig();
const { updateHeaderData } = useHeaderData();

useEffect(() => {
  updateHeaderData({
    logo: config.logo,
    navigationItems: config.menuBuilder?.menuItems || [],
  });
}, [config]);

const handleHeaderUpdate = (data) => {
  updateConfig({
    ...config,
    logo: data.logo,
    menuBuilder: {
      menuItems: data.navigationItems,
    },
  });
};
```

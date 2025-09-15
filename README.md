# HNU Official Website

A modern, feature-rich official website for Helwan National University (HNU) built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 **Live Demo**

**Production**: https://hnu-official-website-orsypfjnq-mahmoud-matters-projects.vercel.app

## 📋 **Project Overview**

HNU Official Website is a comprehensive web platform designed to showcase Helwan National University's academic excellence, services, and information. The website features a modern, responsive design with internationalization support for both English and Arabic languages.

## ✨ **Current Features & Implementation**

### 🏠 **Homepage**
- **Hero Section**: Welcome message and university introduction
- **About HNU**: Mission statement and educational philosophy
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Modern black background with white text

### 🌍 **Internationalization (i18n)**
- **Multi-language Support**: English (EN) and Arabic (عربي)
- **Locale Routing**: Dynamic language switching with URL-based routing
- **Message Management**: Centralized message files in `messages/` directory
- **RTL Support**: Right-to-left language support for Arabic
- **Navigation**: Language switcher in the header

### 🧭 **Navigation System**
- **Responsive Menu**: Mobile-friendly hamburger menu
- **Navigation Items**: Home, About, Services, Contact
- **Active State**: Visual feedback for current page
- **Logo Branding**: HNU university branding
- **Mobile Optimization**: Collapsible navigation for small screens

### 🎨 **UI/UX Features**
- **Modern Design**: Clean, professional university website aesthetic
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Transitions**: CSS transitions and hover effects
- **Accessibility**: Semantic HTML and ARIA labels
- **Typography**: Optimized font hierarchy and readability

### 🔧 **Technical Features**
- **TypeScript**: Full type safety throughout the application
- **Next.js 15**: Latest App Router with Turbopack
- **Tailwind CSS**: Utility-first styling framework
- **Component Architecture**: Reusable React components
- **State Management**: React Context API for global state

## 🛠️ **Technology Stack & Libraries**

### **Core Framework**
- **Next.js 15.5.2**: React framework with App Router and Turbopack
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe JavaScript development

### **Styling & UI**
- **Tailwind CSS 4**: Utility-first CSS framework
- **CSS Variables**: Dynamic theming support
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Class Variance Authority integration

### **Internationalization**
- **next-intl 4.3.5**: Internationalization framework
- **Locale Routing**: Dynamic route handling
- **Message Bundles**: JSON-based translation files
- **RTL Support**: Right-to-left language layouts

### **State Management & Data**
- **React Context API**: Lightweight client state management
- **TanStack Query 5.85.5**: Server state management (configured)
- **React Hook Form 7.62.0**: Form handling (configured)
- **Zod 4.1.3**: Schema validation (configured)
- **Axios 1.11.0**: HTTP client with interceptors (configured)

### **Development Tools**
- **ESLint**: Code quality and style enforcement
- **Prettier 3.6.2**: Code formatting with custom configuration
- **TypeScript**: Type checking and IntelliSense
- **GitHub Actions**: Automated CI/CD pipeline

### **Deployment & Hosting**
- **Vercel**: One-click deployment platform
- **GitHub Actions**: Automated build and deployment
- **Branch Protection**: Secure development workflow

## 📁 **Project Structure**

```
hnu-offical-website/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── globals.css          # Global styles with Tailwind
│   │   ├── layout.tsx           # Locale-specific layout
│   │   └── page.tsx             # Homepage component
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx            # 404 error page
│   └── favicon.ico              # Site icon
├── components/                    # Reusable components
│   └── navigation.tsx            # Main navigation component
├── contexts/                      # React Context providers
│   ├── providers.tsx             # Main provider wrapper
│   ├── theme-context.tsx         # Theme management
│   └── index.ts                  # Context exports
├── lib/                          # Utility libraries
│   ├── axios.ts                  # HTTP client configuration
│   └── utils.ts                  # Utility functions
├── i18n/                         # Internationalization
│   ├── navigation.ts             # Navigation utilities
│   ├── request.ts                # Request handling
│   └── routing.ts                # Route configuration
├── messages/                      # Translation files
│   ├── en.json                   # English messages
│   └── ar.json                   # Arabic messages
├── .github/                       # GitHub configurations
│   ├── workflows/                 # CI/CD workflows
│   │   └── build.yml             # Build verification workflow
│   ├── CODEOWNERS                # Code ownership rules
│   ├── branch-protection.yml     # Branch protection documentation
│   └── pull_request_template.md  # PR template
├── scripts/                       # Deployment scripts
│   ├── deploy.sh                 # Bash deployment script
│   ├── deploy.bat                # Windows deployment script
│   ├── deploy.ts                 # TypeScript deployment script
│   └── config.json               # Deployment configuration
├── public/                        # Static assets
├── .prettierrc                   # Prettier configuration
├── .prettierignore               # Prettier ignore rules
├── Makefile                      # Project management commands
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── vercel.json                   # Vercel deployment config
```

## 🚀 **Getting Started**

### **Prerequisites**
- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Git**: Version control system

### **Installation**
```bash
# Clone the repository
git clone https://github.com/mahmoudmatter12/HNU-Official-website.git
cd hnu-offical-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Setup**
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Theme Configuration
NEXT_PUBLIC_DEFAULT_THEME=system

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

## 📜 **Available Scripts**

### **Development**
```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # TypeScript type checking
```

### **Code Quality**
```bash
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted correctly
npm run pre-commit       # Run pre-commit checks
```

### **Deployment**
```bash
npm run deploy           # Deploy to current branch
npm run deploy:prod      # Deploy to production (main)
npm run deploy:staging   # Deploy to staging (develop)
```

### **Versioning**
```bash
npm run version:patch    # Bump patch version (1.0.0 → 1.0.1)
npm run version:minor    # Bump minor version (1.0.0 → 1.1.0)
npm run version:major    # Bump major version (1.0.0 → 2.0.0)
```

## 🔧 **Makefile Commands**

```bash
make help                # Show all available commands
make install             # Install dependencies
make dev                 # Start development server
make build               # Build project
make format              # Format code with Prettier
make format-check        # Check code formatting
make type-check          # Run TypeScript checks
make clean               # Clean build files
make deploy              # Deploy to production
make quality             # Run all quality checks
```

## 🌐 **Internationalization**

### **Supported Languages**
- **English (EN)**: Primary language
- **Arabic (عربي)**: Secondary language with RTL support

### **Language Switching**
- **URL-based**: `/en/` for English, `/ar/` for Arabic
- **Dynamic Routing**: Seamless language switching
- **Persistent Selection**: Language preference maintained

### **Message Structure**
```json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "contact": "Contact"
  }
}
```

## 🎨 **Styling & Design**

### **Tailwind CSS Configuration**
- **Custom Colors**: University brand colors
- **Responsive Breakpoints**: Mobile-first design
- **Component Variants**: Consistent design system
- **Dark Theme**: Modern black background

### **Component Architecture**
- **Reusable Components**: Modular design approach
- **Props Interface**: TypeScript prop definitions
- **Styling Variants**: Flexible component styling
- **Accessibility**: ARIA labels and semantic HTML

## 🚀 **Deployment & CI/CD**

### **Vercel Integration**
- **Automatic Deployment**: Deploys on push to main
- **Preview Deployments**: Automatic for pull requests
- **Environment Variables**: Secure configuration management
- **Performance Monitoring**: Built-in analytics

### **GitHub Actions**
- **Build Verification**: Automated build testing
- **Quality Gates**: Ensures code quality
- **Branch Protection**: Secure development workflow
- **Automated Testing**: CI/CD pipeline

### **Branch Strategy**
- **Main Branch**: Production-ready code
- **Develop Branch**: Staging and testing
- **Feature Branches**: Individual feature development
- **Pull Requests**: Code review and approval process

## 📊 **Performance & Optimization**

### **Next.js 15 Features**
- **App Router**: Modern routing system
- **Turbopack**: Fast bundling and development
- **Server Components**: Optimized rendering
- **Image Optimization**: Automatic image handling

### **Build Optimization**
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination
- **Minification**: Production code optimization
- **Caching**: Efficient resource caching

## 🛡️ **Security & Quality**

### **Code Quality**
- **TypeScript**: Type safety and error prevention
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Pre-commit Hooks**: Quality gate enforcement

### **Security Features**
- **Environment Variables**: Secure configuration
- **Input Validation**: Schema-based validation
- **HTTPS Only**: Secure communication
- **Security Headers**: HTTP security headers

## 🔮 **Roadmap & Future Features**

### **Phase 1 (Current)**
- ✅ **Basic Website**: Homepage and navigation
- ✅ **Internationalization**: English and Arabic support
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Basic Styling**: Tailwind CSS implementation

### **Phase 2 (Planned)**
- 🚧 **Content Pages**: About, Services, Contact
- 🚧 **Admin Panel**: Content management system
- 🚧 **News & Events**: Dynamic content updates
- 🚧 **Student Portal**: User authentication system

### **Phase 3 (Future)**
- 📋 **E-learning Integration**: Online course platform
- 📋 **Student Services**: Registration and enrollment
- 📋 **Faculty Portal**: Staff management system
- 📋 **Analytics Dashboard**: Performance monitoring

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

### **Development Workflow**
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Make changes** and test locally
4. **Commit changes**: Use conventional commit messages
5. **Push branch**: `git push origin feature/new-feature`
6. **Create Pull Request**: Wait for review and approval

### **Code Standards**
- **TypeScript**: Full type coverage required
- **Prettier**: Automatic code formatting
- **ESLint**: Code quality enforcement
- **Conventional Commits**: Standard commit message format

## 📚 **Documentation**

- **Project Setup**: [PROJECT_SETUP_DOCUMENTATION.md](PROJECT_SETUP_DOCUMENTATION.md)
- **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Contributing**: [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)
- **API Reference**: Check individual component files

## 📞 **Support & Contact**

- **Repository**: https://github.com/mahmoudmatter12/HNU-Official-website
- **Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Owner**: @mahmoud-zel-din

## 📄 **License**

This project is private and proprietary. All rights reserved by Helwan National University.

## 🏆 **Acknowledgments**

- **Next.js Team**: For the amazing React framework
- **Vercel**: For seamless deployment platform
- **Tailwind CSS**: For the utility-first CSS framework
- **Open Source Community**: For the excellent libraries and tools

---

**Built with ❤️ for Helwan National University**

**Version**: 1.0.0  
**Last Updated**: August 2024  
**Status**: �� Production Ready

### test the new cicid for vercel

```
hnu-offical-website
├─ .prettierignore
├─ .prettierrc
├─ app
│  ├─ api
│  │  ├─ colleges
│  │  │  ├─ create
│  │  │  │  └─ route.ts
│  │  │  ├─ route.ts
│  │  │  ├─ slug
│  │  │  │  └─ [slug]
│  │  │  │     └─ route.ts
│  │  │  └─ [id]
│  │  │     ├─ delete
│  │  │     │  └─ route.ts
│  │  │     ├─ route.ts
│  │  │     └─ update
│  │  │        └─ route.ts
│  │  ├─ files
│  │  │  ├─ delete
│  │  │  │  └─ route.ts
│  │  │  ├─ list
│  │  │  │  └─ route.ts
│  │  │  ├─ upload
│  │  │  │  └─ route.ts
│  │  │  └─ usage
│  │  │     └─ route.ts
│  │  ├─ logs
│  │  │  ├─ route.ts
│  │  │  ├─ search
│  │  │  │  └─ route.ts
│  │  │  └─ stats
│  │  │     └─ route.ts
│  │  ├─ permission-templates
│  │  │  └─ route.ts
│  │  ├─ sections
│  │  │  ├─ college
│  │  │  │  └─ [collegeId]
│  │  │  │     └─ route.ts
│  │  │  ├─ reorder
│  │  │  │  └─ route.ts
│  │  │  ├─ route.ts
│  │  │  ├─ university
│  │  │  │  └─ [universityId]
│  │  │  │     └─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
│  │  ├─ statistics
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
│  │  ├─ test-cors
│  │  │  └─ route.ts
│  │  ├─ university
│  │  │  ├─ route.ts
│  │  │  ├─ slug
│  │  │  │  └─ [slug]
│  │  │  │     └─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
│  │  └─ users
│  │     ├─ all
│  │     │  └─ route.ts
│  │     ├─ clerk
│  │     │  └─ [clerkId]
│  │     │     └─ route.ts
│  │     ├─ create
│  │     │  └─ route.ts
│  │     ├─ find-or-create
│  │     │  └─ route.ts
│  │     ├─ route.ts
│  │     ├─ search
│  │     │  └─ route.ts
│  │     ├─ simple
│  │     │  └─ route.ts
│  │     ├─ superadmins
│  │     │  └─ route.ts
│  │     └─ [id]
│  │        ├─ delete
│  │        │  └─ route.ts
│  │        ├─ move-to-collage
│  │        │  └─ route.ts
│  │        ├─ route.ts
│  │        ├─ toggle-role
│  │        │  └─ route.ts
│  │        └─ update
│  │           └─ route.ts
│  ├─ favicon.ico
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  └─ [locale]
│     ├─ (admin)
│     │  ├─ admin
│     │  │  ├─ dashboard
│     │  │  │  ├─ collages
│     │  │  │  │  ├─ page.tsx
│     │  │  │  │  └─ _components
│     │  │  │  │     └─ collage
│     │  │  │  │        ├─ CollageCard.tsx
│     │  │  │  │        ├─ college-form-dialog.tsx
│     │  │  │  │        └─ delete-college-dialog.tsx
│     │  │  │  └─ uni
│     │  │  │     └─ page.tsx
│     │  │  ├─ page.tsx
│     │  │  ├─ profile
│     │  │  │  ├─ page.tsx
│     │  │  │  └─ _components
│     │  │  │     └─ UserProfile.tsx
│     │  │  └─ system
│     │  │     ├─ logs
│     │  │     │  └─ page.tsx
│     │  │     ├─ storage
│     │  │     │  └─ page.tsx
│     │  │     └─ users
│     │  │        └─ page.tsx
│     │  ├─ layout.tsx
│     │  └─ _Components
│     │     ├─ admin-layout.tsx
│     │     ├─ AdminAuthGuard.tsx
│     │     ├─ header.tsx
│     │     └─ sidebar.tsx
│     ├─ (auth)
│     │  ├─ login
│     │  │  └─ [[...sign-in]]
│     │  │     └─ page.tsx
│     │  └─ sign-up
│     │     └─ [[...sign-up]]
│     │        └─ page.tsx
│     ├─ (root)
│     │  ├─ collages
│     │  │  ├─ page.tsx
│     │  │  └─ [slug]
│     │  │     └─ page.tsx
│     │  └─ soon
│     │     └─ page.tsx
│     ├─ globals.css
│     ├─ layout.tsx
│     └─ page.tsx
├─ BRANCH_SUMMARY.md
├─ CHANGELOG.md
├─ CLOUDINARY_USAGE_TRACKING.md
├─ COLLAGE_DROPDOWN_IMPLEMENTATION.md
├─ components
│  ├─ admin
│  │  └─ SectionManager.tsx
│  ├─ auth
│  │  └─ AuthButton.tsx
│  ├─ chat
│  │  ├─ chat-widget.css
│  │  └─ ChatWidget.tsx
│  ├─ collages
│  ├─ DecorativeWrapper.tsx
│  ├─ file-manager
│  │  ├─ FileDetailsDialog.tsx
│  │  ├─ FileManager.tsx
│  │  └─ UploadDialog.tsx
│  ├─ header.tsx
│  ├─ header2.tsx
│  ├─ home
│  │  ├─ aboutSection.tsx
│  │  ├─ ContactUsSection.tsx
│  │  ├─ ContentCard.tsx
│  │  ├─ ExpandableContentCard.tsx
│  │  ├─ FAQ.tsx
│  │  ├─ FcatsAndNumber.tsx
│  │  ├─ heroSection.tsx
│  │  ├─ programsSection.tsx
│  │  ├─ slider.tsx
│  │  ├─ TopEvents.tsx
│  │  ├─ TopNews.tsx
│  │  └─ TopStudentActivities.tsx
│  ├─ layout
│  │  ├─ dockSocialMediaLinks.tsx
│  │  ├─ footer.tsx
│  │  ├─ header3.tsx
│  │  ├─ MobileMenu.tsx
│  │  └─ README.md
│  ├─ providers
│  │  └─ ClerkProvider.tsx
│  ├─ Reveal.tsx
│  ├─ sections
│  │  ├─ AboutSection.tsx
│  │  ├─ CollagesSection.tsx
│  │  ├─ CustomSection.tsx
│  │  ├─ DynamicHomePage.tsx
│  │  ├─ HeroSection.tsx
│  │  └─ SectionRenderer.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ dropdown-menu.tsx
│     ├─ error-boundary.tsx
│     ├─ form.tsx
│     ├─ image-selector-modal.tsx
│     ├─ index.ts
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ menu-builder.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ skeleton.tsx
│     ├─ sonner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ tooltip.tsx
│     ├─ video-player.tsx
│     └─ ViewModeToggle.tsx
├─ components.json
├─ contexts
│  ├─ AdminAuthProvider.tsx
│  ├─ index.ts
│  ├─ providers.tsx
│  ├─ QueryClientProvider.tsx
│  ├─ README.md
│  ├─ UniversityContext.tsx
│  ├─ userContext.tsx
│  └─ ViewModeContext.tsx
├─ CONTRIBUTING.md
├─ data
│  └─ index.ts
├─ eslint.config.mjs
├─ hooks
│  ├─ use-auth.ts
│  ├─ use-bot.ts
│  ├─ use-cloudinary-usage.ts
│  ├─ use-file-queries.ts
│  ├─ use-file-upload.ts
│  ├─ use-loading-state.ts
│  ├─ use-performance.ts
│  ├─ use-sections.ts
│  ├─ use-toast.ts
│  └─ useOutsideClick.tsx
├─ i18n
│  ├─ navigation.ts
│  ├─ request.ts
│  └─ routing.ts
├─ i18n.ts
├─ lib
│  ├─ auth-headers.ts
│  ├─ axios.ts
│  ├─ cloudinary-client.ts
│  ├─ cloudinary-server.ts
│  ├─ cloudinary.ts
│  ├─ cors.ts
│  ├─ db.ts
│  ├─ middleware
│  │  ├─ autoAuditLog.ts
│  │  ├─ autoWrapRoutes.ts
│  │  ├─ globalAuditMiddleware.ts
│  │  ├─ README.md
│  │  ├─ routeWrapper.ts
│  │  └─ withAuditLog.ts
│  ├─ server-axios.ts
│  └─ utils.ts
├─ messages
│  ├─ ar.json
│  └─ en.json
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ PERFORMANCE_OPTIMIZATIONS.md
├─ postcss.config.mjs
├─ prisma
│  └─ schema.prisma
├─ PROJECT_SETUP_DOCUMENTATION.md
├─ public
│  ├─ home.jpeg
│  ├─ images
│  │  ├─ Activity
│  │  │  ├─ architectural and engineering projects.jpg
│  │  │  ├─ engineering companies.jpg
│  │  │  ├─ Engineering Innovation Challenge.jpg
│  │  │  ├─ graduation-cap-earth-globe.jpg
│  │  │  ├─ hack.jpg
│  │  │  ├─ Research Symposium.jpg
│  │  │  ├─ Robotics Club.jpg
│  │  │  └─ Startup Incubator Program.jpg
│  │  ├─ exec
│  │  │  ├─ Bassel.png
│  │  │  ├─ Habeba.png
│  │  │  ├─ Habiba.png
│  │  │  ├─ Mai.png
│  │  │  ├─ Malak.png
│  │  │  ├─ Mariam.png
│  │  │  ├─ Mazen.png
│  │  │  ├─ Mostafa.png
│  │  │  ├─ Mounir.png
│  │  │  ├─ Remah.png
│  │  │  ├─ Roaa.png
│  │  │  ├─ Salma.png
│  │  │  ├─ Salma2.png
│  │  │  ├─ Shaza.png
│  │  │  ├─ Soha.png
│  │  │  └─ youssef.png
│  │  ├─ gallery
│  │  │  ├─ 1.jpg
│  │  │  ├─ 2.jpg
│  │  │  ├─ 3.jpg
│  │  │  ├─ 4.jpg
│  │  │  ├─ 5.jpg
│  │  │  ├─ 6.jpg
│  │  │  ├─ 7.jpg
│  │  │  ├─ 8.jpg
│  │  │  └─ 9.jpg
│  │  ├─ Logos
│  │  │  ├─ home.jpeg
│  │  │  ├─ logo-hnu-web2.png
│  │  │  ├─ logossss.png
│  │  │  ├─ new_logo.png
│  │  │  ├─ over.png
│  │  │  ├─ president.jpeg
│  │  │  └─ with_bg.jpg
│  │  ├─ news
│  │  │  ├─ 1.jpg
│  │  │  ├─ 2.jpg
│  │  │  ├─ 3.jpg
│  │  │  └─ 4.jpg
│  │  ├─ Placehold
│  │  │  ├─ Campus.png
│  │  │  ├─ Graduation.png
│  │  │  ├─ Research.png
│  │  │  └─ Student.png
│  │  └─ programs
│  │     ├─ Architecture.jpg
│  │     ├─ Cybersecurity.jpg
│  │     ├─ ISE.jpg
│  │     └─ Mechatronics.jpg
│  ├─ logo-hnu-web2.png
│  ├─ logossss.png
│  ├─ new_logo.png
│  ├─ over.png
│  ├─ president.jpeg
│  └─ with_bg.jpg
├─ QUICK_REFERENCE.md
├─ README.md
├─ services
│  ├─ bot.service.ts
│  ├─ collage.service.ts
│  ├─ file.service.ts
│  ├─ index.ts
│  ├─ section.service.ts
│  ├─ statistic.service.ts
│  ├─ university.service.ts
│  └─ user.service.ts
├─ TOAST_IMPLEMENTATION.md
├─ tsconfig.json
├─ types
│  ├─ audit.ts
│  ├─ college.ts
│  ├─ enums.ts
│  ├─ file.ts
│  ├─ index.ts
│  ├─ page.ts
│  ├─ permission.ts
│  ├─ section.ts
│  ├─ statistic.ts
│  ├─ university.ts
│  └─ user.ts
└─ utils
   └─ auditLogger.ts

```
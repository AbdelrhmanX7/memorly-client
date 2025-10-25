# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Memorly**, a Next.js client application built using the Pages Router architecture with HeroUI (v2) as the UI component library. The application appears to be in early development stages with a basic landing page and theme switching functionality.

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint with auto-fix
```

## Architecture

### Technology Stack
- **Framework**: Next.js 15.3.1 (Pages Router)
- **UI Library**: HeroUI v2 (custom themed)
- **State Management**: TanStack Query (React Query) v5
- **Styling**: Tailwind CSS v4 with custom HeroUI theme plugin
- **Animations**: Framer Motion
- **Theme Management**: next-themes for dark/light mode switching
- **TypeScript**: Strict mode enabled

### Directory Structure

```
client/
├── pages/           # Next.js pages (Pages Router)
│   ├── _app.tsx    # App wrapper with providers (HeroUI, Theme, QueryClient)
│   ├── _document.tsx
│   └── index.tsx   # Home page
├── components/      # Reusable UI components
│   ├── navbar.tsx  # Main navigation with theme switcher
│   ├── icons.tsx   # Icon components
│   ├── theme-switch.tsx
│   └── primitives.ts
├── layouts/         # Layout components
│   ├── default.tsx # Main layout with navbar and footer
│   └── head.tsx    # SEO head component
├── config/          # Configuration files
│   ├── site.ts     # Site metadata and navigation config
│   └── fonts.ts    # Font configuration
├── service/         # API and data fetching layer
│   ├── api/        # API client functions (empty scaffolding)
│   ├── hooks/      # Custom React Query hooks (empty scaffolding)
│   └── invalidate-query/ # Query invalidation utilities (empty scaffolding)
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

### Key Architectural Patterns

**Provider Hierarchy** (pages/_app.tsx):
- `HeroUIProvider` (outermost) - UI component context with Next.js router integration
- `NextThemesProvider` - Theme management (light/dark mode)
- `QueryClientProvider` - TanStack Query for server state management

**Styling System**:
- Custom HeroUI theme with extensive color palette for light/dark modes
- Primary color: Purple (#7828c8)
- Secondary color: Blue (#006fee)
- Dark theme uses deep navy background (#020817)
- Component styling uses `tailwind-variants` for variant-based styling

**Path Aliases**:
- `@/*` maps to root directory (configured in tsconfig.json)

**Service Layer Structure** (Currently Scaffolded):
The `service/` directory is set up for:
- `api/` - REST/GraphQL API client functions
- `hooks/` - React Query hooks wrapping API calls
- `invalidate-query/` - Query cache invalidation utilities

### Environment Variables

- `NEXT_PUBLIC_API` - API endpoint URL (currently set to placeholder)

## Development Guidelines

### ESLint Configuration
The project uses strict ESLint rules with:
- Import ordering enforced (type imports first, then builtin, external, internal)
- Automatic unused import removal
- JSX prop sorting (callbacks last, shorthand first, reserved first)
- Required blank lines before return statements and between declaration groups
- Warnings for console.log usage
- React 18+ (no need for React import in JSX files)

### Theme Development
When working with theme colors:
- Custom theme defined in `tailwind.config.js` with HeroUI plugin
- Both light and dark modes have full color palettes (50-900 scales)
- Content layers (content1-4) provide depth hierarchy
- Use semantic color names (primary, secondary, success, warning, danger)

### Component Patterns
- HeroUI components are imported from scoped packages (`@heroui/button`, etc.)
- Theme detection handled via `useTheme()` hook from next-themes
- Icons use lucide-react library or custom icons in `components/icons.tsx`

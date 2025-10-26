# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Memorly** is a social memory-sharing platform built with Next.js 15 (Pages Router) and HeroUI v2. The application allows users to capture, share, and chat about their memories with friends.

## Common Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint with auto-fix
```

## Architecture

### Technology Stack

- **Framework**: Next.js 15.3.1 (Pages Router)
- **UI Library**: HeroUI v2 with custom theme
- **State Management**: TanStack Query v5 (React Query)
- **Styling**: Tailwind CSS v4 with tailwind-variants
- **Animations**: Framer Motion
- **Theme**: next-themes (light/dark mode)
- **Real-time**: Socket.io Client v4.8
- **HTTP Client**: Axios v1.12
- **Form Validation**: Custom validation schemas in `/validation`
- **TypeScript**: Strict mode enabled

### Key Features

1. **Authentication Flow**: Registration → Email Verification (OTP) → Login → Dashboard
2. **File Uploads**: Smart chunked upload system for images/videos (see UPLOAD_FEATURE.md)
3. **Real-time Chat**: Socket.io integration for messaging
4. **Memory Sharing**: Timeline-based memory feed with activity cards
5. **Theme System**: Fully customized light/dark themes with deep navy dark mode

### Directory Structure

```
client/
├── pages/              # Next.js Pages Router
│   ├── _app.tsx       # Provider hierarchy: HeroUI → NextThemes → QueryClient
│   ├── _document.tsx  # HTML document wrapper with font setup
│   ├── index.tsx      # Landing page
│   ├── login.tsx      # Login with redirect after verification/reset
│   ├── register.tsx   # Registration → redirects to verify-email
│   ├── verify-email.tsx  # OTP verification page
│   ├── forgot-password.tsx  # Request password reset OTP
│   ├── reset-password.tsx   # Reset password with OTP
│   ├── dashboard.tsx  # Main authenticated view (redirects from login)
│   ├── memories.tsx   # Memory timeline feed
│   ├── chats.tsx      # Chat list view
│   ├── chat/[id].tsx  # Individual chat conversation
│   ├── friends.tsx    # Friends list and management
│   └── profile.tsx    # User profile
├── components/        # Reusable UI components
│   ├── navbar.tsx     # Top navigation with theme switcher
│   ├── bottom-navbar.tsx  # Mobile bottom navigation (shown when logged in)
│   ├── upload-modal.tsx   # Tabbed upload modal (images/videos)
│   ├── file-upload-zone.tsx  # Drag-and-drop upload zone
│   ├── upload-progress.tsx   # Individual upload progress indicator
│   ├── upload-button.tsx     # Trigger button for upload modal
│   ├── chat-list.tsx  # Chat conversation list
│   ├── new-chat-form.tsx  # Create new chat form
│   ├── activity-card.tsx  # Memory activity card component
│   └── timeline-day.tsx   # Day grouping for timeline
├── layouts/           # Layout components
│   ├── head.tsx       # SEO metadata component
│   ├── logo.tsx       # App logo component
│   ├── page-transition.tsx  # Route transition animations
│   └── route-loading-indicator.tsx  # Loading indicator for route changes
├── service/           # API and data layer
│   ├── api/
│   │   ├── auth.ts    # Auth endpoints (register, login, verify, forgot/reset password)
│   │   ├── chat.ts    # Chat endpoints (fetch, create, send message, delete)
│   │   └── memory.ts  # Memory endpoints
│   ├── hooks/
│   │   ├── useAuth.ts # Auth mutations (useRegister, useLogin, useVerifyEmail, etc.)
│   │   ├── useChat.ts # Chat queries and mutations
│   │   └── useMemories.ts  # Memory data hooks
│   ├── upload.ts      # Chunked upload service (smart routing for files >100MB)
│   └── invalidate-query/  # Query cache invalidation utilities
├── types/             # TypeScript type definitions
│   ├── auth.ts        # Auth DTOs and response types
│   ├── chat.ts        # Chat and message types
│   └── memory.ts      # Memory types
├── validation/        # Form validation schemas
│   └── auth.ts        # Auth form validation rules
├── config/
│   ├── site.ts        # Site metadata and navigation config
│   └── fonts.ts       # Font configuration (sans, mono)
└── styles/
    └── globals.css    # Global styles and CSS variables
```

## Key Architectural Patterns

### Provider Hierarchy (pages/_app.tsx)

The application uses a nested provider structure that must be maintained in this order:

```tsx
<HeroUIProvider>           // Outermost: UI component context
  <NextThemesProvider>     // Theme management (light/dark)
    <QueryClientProvider>  // TanStack Query for server state
      <ToastProvider />    // HeroUI toast notifications
      <Component />        // Your page
    </QueryClientProvider>
  </NextThemesProvider>
</HeroUIProvider>
```

**Authentication State Management**:
- Token stored in both `localStorage` and cookies (via `cookies-next`)
- Axios default headers set with Bearer token in `_app.tsx:44-45`
- Custom hook `useGetUserData()` reads from cookies/localStorage
- Navigation conditional on `isUserLoggedIn` state (shows BottomNavbar when true)

### Service Layer Pattern

The service layer follows a strict separation:

1. **API Layer** (`service/api/*.ts`): Pure API calls with axios
   - Functions accept data and token parameters
   - Return typed responses or throw errors
   - Error handling wraps axios errors with user-friendly messages

2. **Hook Layer** (`service/hooks/*.ts`): React Query wrappers
   - Use `useMutation` for mutations, `useQuery` for queries
   - Handle side effects (redirects, localStorage, etc.) in `onSuccess`
   - Example: `useLogin` stores token and redirects to `/dashboard` on success

**Important**: API functions use `axios.defaults.baseURL` set in `_app.tsx:25`, so endpoints are relative paths (e.g., `/auth/login`).

### Authentication Flow Details

1. **Register** (`/register`):
   - Calls `authApi.register()`
   - Stores `pendingVerificationEmail` in localStorage
   - Redirects to `/verify-email?email=...`

2. **Verify Email** (`/verify-email`):
   - Accepts OTP code (6 digits)
   - Calls `authApi.verifyEmail()`
   - Redirects to `/login?verified=true`

3. **Login** (`/login`):
   - Calls `authApi.login()`
   - Stores `token` and `user` in localStorage
   - Redirects to `/dashboard`

4. **Forgot Password** (`/forgot-password`):
   - Calls `authApi.forgotPassword()`
   - Redirects to `/reset-password?email=...`

5. **Reset Password** (`/reset-password`):
   - Accepts OTP and new password
   - Calls `authApi.resetPassword()`
   - Redirects to `/login?reset=true`

### File Upload System

The upload system intelligently routes files based on size:

- **Files ≤100MB**: Regular upload via `POST /files/upload`
- **Files >100MB**: Chunked upload (5MB chunks) via `/files/chunk/*` endpoints

**Key Components**:
- `UploadButton`: Simple trigger button
- `UploadModal`: Main modal with tabs for images/videos
- `FileUploadZone`: Drag-and-drop area
- `UploadProgress`: Progress indicator with chunk tracking

**Usage Pattern**:
```tsx
<UploadButton
  authToken={token}
  onUploadComplete={(results) => {
    // Handle uploaded files
  }}
/>
```

See `UPLOAD_FEATURE.md` for complete documentation.

### Theme System

Custom HeroUI theme with extensive color palettes:

**Light Mode**:
- Background: `#ffffff`
- Primary: Purple `#7828c8`
- Secondary: Blue `#006fee`
- Content layers: `content1-4` for depth hierarchy

**Dark Mode**:
- Background: Deep navy `#020817`
- Content layers: `#0d0e24` → `#17182f` → `#212137` → `#2b2c42`
- Same primary/secondary colors for brand consistency

**Theme Usage**:
```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
```

### ESLint Configuration

Strict rules enforced (see `eslint.config.mjs`):

- **Import ordering**: Type imports first → builtin → external → internal
- **Unused imports**: Automatically removed on lint
- **JSX props**: Sorted (callbacks last, shorthand first, reserved first)
- **Blank lines**: Required before `return` and between declaration groups
- **Console logs**: Warning only (not error)
- **React**: No React import needed in JSX (React 18+)

**Auto-fix**: Run `npm run lint` to automatically fix issues.

### Path Aliases

- `@/*` maps to root directory (configured in `tsconfig.json:18`)
- Example: `import { Button } from "@heroui/button"` (HeroUI components)
- Example: `import { authApi } from "@/service/api/auth"` (local files)

## Environment Variables

```env
NEXT_PUBLIC_API=http://localhost:4000/api  # Backend API base URL
```

**Note**: All `NEXT_PUBLIC_*` variables are exposed to the browser.

## Component Patterns

### HeroUI Components

- Components are scoped imports: `@heroui/button`, `@heroui/card`, etc.
- Use `tailwind-variants` for component variants
- Theme-aware via `useTheme()` hook

### Navigation

- **Desktop**: Top `Navbar` with theme switcher (always visible)
- **Mobile**: `BottomNavbar` with 4 tabs (Memories, Chats, Friends, Profile)
- Conditional rendering: Bottom navbar only shown when `isUserLoggedIn === true`

### Page Transitions

All pages wrapped in `PageTransition` component (Framer Motion):
- Fade in/out on route changes
- Coordinated with `RouteLoadingIndicator`

## Common Patterns

### API Calls with Auth

```tsx
// In API layer
export async function fetchData(token: string) {
  const response = await axios.get('/endpoint');
  return response.data.data;
}

// In hook layer
export function useData() {
  const { token } = useGetUserData();

  return useQuery({
    queryKey: ['data'],
    queryFn: () => fetchData(token),
    enabled: !!token,
  });
}
```

### Form Handling

```tsx
import { useLogin } from "@/hooks";
import { LoginDTO } from "@/types/auth";

const { mutate, isPending, error } = useLogin();

const handleSubmit = (data: LoginDTO) => {
  mutate(data); // onSuccess handles redirect
};
```

### Toast Notifications

```tsx
import { toast } from "@heroui/react";

toast.success("Operation successful!");
toast.error("Something went wrong");
```

## Development Notes

- **Pages Router**: Use `pages/` directory, not `app/`
- **No Server Components**: Pages Router doesn't support RSC
- **Router**: Use `next/router` `useRouter()` hook, not `next/navigation`
- **Fonts**: Configured in `config/fonts.ts`, applied in `_app.tsx`
- **Socket.io**: Client available via `socket.io-client` v4.8
- **Date Handling**: Use `@internationalized/date` for date operations
- **Hooks Library**: `usehooks-ts` available for common React hooks


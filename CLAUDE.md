# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **Turborepo monorepo** with **pnpm workspaces** with the following structure:

- `apps/web/` - Main Next.js application (formerly the root directory)
- `packages/` - Shared packages (currently empty, ready for future shared code)
- Root-level configuration manages the entire monorepo
- `pnpm-workspace.yaml` - pnpm workspace configuration defining apps and packages

### Turborepo Benefits

- **Caching**: Build and test results are cached for faster subsequent runs
- **Parallelization**: Tasks run in parallel across workspaces when possible
- **Dependency Management**: Proper task dependencies ensure correct build order
- **Future Expansion**: Ready to add more apps (mobile, admin, API server) and shared packages

## Development Commands

### Core Commands

All commands run through **Turborepo** and execute in the appropriate workspace:

- `pnpm dev:https` - Start web app development server with HTTPS on nonnalocal.fm
- `pnpm build` - Build all applications (currently just web app)
- `pnpm lint` - Run ESLint across all workspaces
- `pnpm format` - Format code with Prettier across all workspaces
- `pnpm type-check` - Run TypeScript type checking across all workspaces

### Testing Commands

- `pnpm test` - Run tests across all workspaces with Vitest
- `pnpm test:watch` - Run tests in watch mode across all workspaces
- `pnpm test:coverage` - Run tests with coverage report across all workspaces

### Workspace-Specific Commands

To run commands in specific workspaces:

- `pnpm build --filter=web` - Build only the web app
- `pnpm dev --filter=web` - Start only the web app dev server

### Note on HTTPS Development

The web app uses a custom HTTPS setup for development with certificates in `apps/web/certificates/`. The dev server runs on `nonnalocal.fm` which should be mapped in your `/etc/hosts` file.

## Tech Stack & Framework Versions

- **Turborepo** for monorepo management with caching and parallelization
- **pnpm** for fast, disk space efficient package management
- **Next.js 15** with App Router (React 19)
- **TypeScript** for type safety
- **Tailwind CSS v4** (CSS-first configuration)
- **Zod v4** (import from `zod/v4`)
- **Vitest** for testing with React Testing Library
- **Playwright** for E2E testing
- **Sentry** for error monitoring
- **Redis** for caching and session management

## Architecture Overview

### Music Service Integration

The web application (`apps/web/`) is built around a **service factory pattern** for integrating multiple music streaming platforms:

- **Factory**: `apps/web/src/lib/services/factory.ts` - Central service provider registry
- **Services**: Each platform has its own service implementation:
  - `apps/web/src/lib/services/spotify/` - Spotify Web API integration
  - `apps/web/src/lib/services/apple/` - Apple Music API with MusicKit.js
  - `apps/web/src/lib/services/youtube/` - YouTube Music API via ytmusic-api
  - `apps/web/src/lib/services/deezer/` - Deezer API integration
  - `apps/web/src/lib/services/tidal/` - TIDAL API integration (in development)

- **Common Interface**: All services implement `IMusicServiceProvider` for consistent API across platforms

### State Management Architecture

The app uses **React Context with reducer pattern** for complex state:

- **LibraryContext**: Main library state management with matching/transfer capabilities
  - Split across multiple files: `apps/web/src/contexts/LibraryContext.tsx`, `LibraryContext.matchingReducer.ts`, etc.
  - Handles liked songs, albums, playlists, and selection state
- **TransferContext**: Transfer limits and usage tracking
- **SelectionContext**: Multi-selection state for tracks/albums/playlists

### API Layer Structure

- **Music API Abstraction**: `apps/web/src/lib/musicApi.ts` provides unified functions that delegate to service-specific implementations
- **Service Detection**: Automatic detection of active source/target services based on auth state
- **Auth Handling**: Each service has its own auth implementation with token management

### Component Architecture

- **Route-based structure**: App Router with dynamic routes for `[source]/[target]` music service combinations
- **Shared components**: `apps/web/src/components/shared/` contains reusable UI components
- **Service-specific modals**: Platform connection and consent handling
- **Layout components**: Header with service selection, sidebar navigation

### Key Design Patterns

1. **Service Factory**: Centralized service instantiation and management
2. **Context + Reducer**: Complex state management with actions and selectors
3. **Async Service Resolution**: Dynamic service detection based on authentication state
4. **Matching Engine**: Cross-platform music matching and transfer logic
5. **Progressive Loading**: Playlist and library data loaded incrementally with progress tracking

### Configuration Management

- **Service Configuration**: `apps/web/src/config/services.ts` defines available services, status, and UI properties
- **Environment Variables**: Managed through `apps/web/src/env*.mjs` files with Zod validation
- **TypeScript Types**: Comprehensive type definitions in `apps/web/src/types/` directory

### Key Integration Points

- **OAuth Flows**: Each service implements platform-specific OAuth with callback handling in `apps/web/src/app/api/auth/`
- **Rate Limiting**: Transfer limits tracked per user with Redis backend
- **Error Handling**: Sentry integration for production error monitoring
- **Image Optimization**: Next.js Image component with service-specific domain patterns

### Turborepo Configuration

- **Pipeline**: Configured in root `turbo.json` with task dependencies and caching
- **Workspaces**: `pnpm-workspace.yaml` defines `apps/*` and `packages/*` workspaces
- **Package Manager**: Uses pnpm@10.12.4 for fast, efficient dependency management
- **Caching**: Build outputs cached in `.next/**` (excluding cache), test coverage in `coverage/**`

## Important Framework-Specific Notes

### Turborepo

- All tasks defined in root `turbo.json` with proper dependencies and caching
- Build outputs cached for faster subsequent builds
- Development tasks (`dev`, `dev:https`, `test:watch`) are persistent and uncached
- Build tasks depend on upstream builds, ensuring proper dependency order

### Tailwind CSS v4

- Uses CSS-first configuration with `@import "tailwindcss"` in `apps/web/src/app/globals.css`
- Theme configured via CSS variables in `@theme` directive
- Container queries and 3D transforms available

### Zod v4

- Import from `zod/v4` (not `zod`)
- Use unified `error` parameter instead of `message`, `invalid_type_error`, etc.
- Discriminated unions auto-infer discriminator keys

### Next.js 15 App Router

- Async params/searchParams: `const params = await props.params`
- Server Components by default, minimize `"use client"`
- API routes in `apps/web/src/app/api/` with proper error handling

### Current Development Status

- TIDAL integration is actively being developed (status: DEV)
- All other major services (Spotify, Apple Music, YouTube Music, Deezer) are production-ready
- Transfer functionality includes usage limits and progress tracking

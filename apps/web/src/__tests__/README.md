# Testing Strategy

This directory contains test files for our application, following the Next.js 15 app router structure.

## Directory Structure

Our tests are organized to mirror the application structure:

```
src/
├── __tests__/
│   ├── setup.ts                   # Global test setup
│   ├── providers/                 # Test utilities for context providers
│   │   └── mockProviders.tsx      # Shared mock providers and contexts
│   ├── app/                       # Tests for components in app directory
│   │   └── library/
│   │       └── [source]/
│   │           └── [target]/
│   │               ├── _components/
│   │               │   └── LibraryClientContent.test.tsx
│   │               ├── liked/
│   │               │   └── _components/
│   │               │       └── LikedSongs.test.tsx
│   │               └── albums/
│   │                   └── _components/
│   │                       └── Albums.test.tsx
│   ├── components/               # Tests for shared components
│   │   ├── layout/
│   │   │   └── Header.test.tsx
│   │   └── shared/
│   │       └── TransferButton.test.tsx
│   └── services/                 # Tests for service APIs
│       ├── README.md             # Service-specific testing documentation
│       └── spotify/
│           ├── api.test.ts
│           └── auth.test.ts
```

## Testing Philosophy

1. **Mirror App Structure**: Our test files mirror the application structure to make it easy to find tests related to specific components.

2. **Test Client Components**: We primarily test client components with React Testing Library, as server components cannot be directly tested with Jest/Vitest.

3. **Mock Context Providers**: We use shared mock providers to ensure consistent test environments.

4. **Service Tests**: API and service tests are isolated and can be run separately from component tests.

## Running Tests

```bash
# Run all component tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/__tests__/app/library/\\[source\\]/\\[target\\]/_components/LibraryClientContent.test.tsx

# Run service integration tests
npm run test:integration
```

## Adding New Tests

When adding new tests:

1. Place component tests in the same directory structure as the component
2. Use `mockProviders.tsx` to set up context providers
3. Mock API calls in the test file
4. Follow the pattern of testing loading, error, and success states

## Test Utilities

- `src/__tests__/providers/mockProviders.tsx`: Contains mock implementations of all context providers and Next.js hooks
- `src/__tests__/setup.ts`: Global test setup that runs before each test

## Service Test Documentation

For service-specific tests (Spotify, Apple Music, etc.), see `src/__tests__/services/README.md`.

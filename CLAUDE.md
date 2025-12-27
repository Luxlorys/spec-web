# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpecFlow is an AI-powered product specification creation tool built with Next.js 15+ App Router, TypeScript, and Feature-Sliced Design architecture.

## Essential Commands

```bash
# Development
yarn dev          # Start development server with Turbopack
yarn build        # Production build
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Auto-fix ESLint issues
yarn typescript   # Type checking (no emit)

# Code Generation
yarn generate:entity EntityName    # Create new business entity with CRUD
yarn generate:feature FeatureName  # Create new feature module

# Git
yarn commit       # Use Commitizen for conventional commits
```

## Architecture

### Feature-Sliced Design (FSD) Structure

```
src/
├── app/           # Next.js App Router pages
├── entities/      # Business entities (User, Specification, etc.)
├── features/      # User interactions (auth, theme, CRUD operations)
├── shared/        # Reusable code
│   ├── ui/       # UI components (shadcn/ui + custom)
│   ├── icons/    # SVG icons as React components
│   ├── api/      # API client and types
│   └── lib/      # Utilities and helpers
└── widgets/       # Page-level composite components
```

**Import Rules (Enforced by ESLint):**

- `app` → can import from anywhere
- `widgets` → can import from `features`, `entities`, `shared`
- `features` → can import from `entities`, `shared`
- `entities` → can import from `shared`
- `shared` → cannot import from other layers

### State Management

- **Authentication**: Zustand store in `features/auth/model/store.ts`
- **Server State**: TanStack Query with mock data in `shared/api/mock/`
- **UI State**: Local React state or Zustand for complex cases

### API Architecture

Currently using mock data with easy migration path:

1. Mock handlers in `shared/api/mock/handlers/`
2. Type-safe API client in `shared/api/client.ts`
3. Replace mock with real backend by updating base URL in env

### UI Development

- **Component Library**: shadcn/ui components in `shared/ui/`
- **Icons**: SVG icons in `shared/icons/`, imported as React components
- **Theme**: Purple color system with HSL tokens in `tailwind.config.ts`
- **Styling**: Tailwind CSS with custom utilities

## Key Technical Decisions

1. **Server/Client Components**: Use `"use client"` only when needed (interactivity, hooks)
2. **Environment Variables**: Type-safe with Zod validation in `src/env.ts`
3. **SVG Handling**: SVGR transforms SVGs to React components
4. **Form Handling**: React Hook Form + Zod for validation
5. **Data Fetching**: TanStack Query for all API calls
6. **Routing**: File-based with Next.js App Router

## Development Patterns

### Creating New Features

Use generators for consistency:

```bash
yarn generate:feature feature-name  # Creates feature structure
yarn generate:entity entity-name    # Creates entity with CRUD
```

### Working with UI Components

1. Check existing components in `shared/ui/` before creating new ones
2. Follow shadcn/ui patterns for consistency
3. Use design tokens from Tailwind config
4. Always use shadcn for new components and try avoiding custom components

### API Integration

1. Define types in `shared/api/types/`
2. Add mock handlers in `shared/api/mock/handlers/`
3. Use API client methods from `shared/api/client.ts`
4. Wrap API calls with TanStack Query hooks

### Common Patterns

```typescript
// Import UI components

// Access auth state
import { useAuthStore } from 'features/auth';
// Use API
import { api } from 'shared/api';
// Import icons
import { IconName } from 'shared/icons';
import { Button, Card } from 'shared/ui';
```

## Environment Configuration

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_API_URL`: Backend API URL (defaults to mock)
- `NEXT_PUBLIC_APP_URL`: Application URL

## Testing Commands

Currently no test framework configured. When adding tests, update this section with test commands.

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
4. **Form Handling**: React Hook Form + Zod for validation (see Forms section below)
5. **Data Fetching**: TanStack Query for all API calls
6. **Routing**: File-based with Next.js App Router

## Forms

**IMPORTANT: Always use React Hook Form for all form handling.** Do NOT use `useState` for form fields.

### Required Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema
const formSchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
});

type FormData = z.infer<typeof formSchema>;

// 2. Use the form hook
const {
  register,
  handleSubmit,
  formState: { errors, isDirty, isSubmitting },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { fieldName: '' },
});

// 3. Handle submission
const onSubmit = async (data: FormData) => {
  await api.mutateAsync(data);
  reset(data); // Reset dirty state after successful save
};
```

### Key Rules

- **Never use `useState` for form fields** - use `register()` or controlled fields with `Controller`
- **Always use Zod schemas** for validation instead of manual validation
- **Use `isDirty`** to detect changes instead of manual comparison
- **Use `isSubmitting`** for loading states instead of mutation.isPending
- **Call `reset(data)`** after successful submission to sync form state
- **Encapsulate form logic in custom hooks** - place form handlers in `features/<feature-name>/hooks/` folder to keep UI components clean and free of business logic

### Form Hook Pattern

**IMPORTANT:** All form business logic must be encapsulated in custom hooks. UI components should only contain render logic.

```typescript
// features/settings/hooks/use-profile-form.ts
export const useProfileForm = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  // Sync with external data
  useEffect(() => {
    if (user) {
      form.reset({ firstName: user.firstName, lastName: user.lastName });
    }
  }, [user, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    await updateProfileMutation.mutateAsync(data);
    form.reset(data);
  });

  return {
    form,
    onSubmit,
    isLoading: updateProfileMutation.isPending,
    isSuccess: updateProfileMutation.isSuccess,
    error: updateProfileMutation.error,
  };
};

// features/settings/hooks/index.ts
export * from './use-profile-form';

// UI component stays clean - only render logic
export const ProfileSettings = () => {
  const { form, onSubmit, isLoading } = useProfileForm();
  const { register, formState: { errors, isDirty } } = form;

  return (
    <form onSubmit={onSubmit}>
      <Input {...register('firstName')} error={errors.firstName?.message} />
      <Button type="submit" disabled={!isDirty || isLoading}>Save</Button>
    </form>
  );
};
```

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

**Real API Services (organized in folders):**
Each real API service has its own folder with types and service:
```
shared/api/
├── auth/
│   ├── types.ts      # Auth types (IUser, ILoginRequest, etc.)
│   ├── service.ts    # Auth API methods
│   └── index.ts      # Re-exports
├── feature-requests/
│   ├── types.ts      # Feature types (IFeatureRequest, etc.)
│   ├── service.ts    # Feature API methods
│   └── index.ts
├── specifications/
│   ├── types.ts      # Specification types (ISpecDocument, etc.)
│   ├── service.ts    # Specification API methods
│   └── index.ts
└── index.ts          # Re-exports all services
```

**Creating a new API service:**
1. Create folder `shared/api/<service-name>/`
2. Add `types.ts` with request/response types
3. Add `service.ts` with API methods
4. Add `index.ts` that exports both
5. Update `shared/api/index.ts` to export the new service
6. Add re-export in `shared/types/index.ts` for backward compatibility

**React Query Hooks:**
- Create hooks in `features/<feature-name>/api/`
- Export hooks from feature's `index.ts` for external use
- Internal components use relative imports `../../api` to avoid circular dependencies
- **Always use `mutateAsync()` instead of `mutate()`** for mutations (POST, PATCH, PUT, DELETE operations)

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

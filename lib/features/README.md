# Features

This directory contains features — self-contained, modular units of functionality that encapsulate related business
logic, UI components, and state management.

## What is a Feature?

A feature is an isolated module that owns a specific domain of the application. Features are designed to be:

- Self-contained: All related code lives within the feature directory
- Independently developable: Features can be built and tested in isolation
- Composable: Features can depend on other features or shared packages

## Directory Structure

Each feature follows a consistent structure with up to four main directories:

```
feature-name/
├── api/           # Data layer: queries, mutations, business logic, models
├── components/    # React UI components
├── hooks/         # Custom React hooks
└── contexts/      # React Context providers for state management
```

Not all features require every directory. Use only what's needed:

| Feature Type                           | Typical Structure    |
|:---------------------------------------|:---------------------|
| Full-featured (campaign, integrations) | All four directories |
| Data-focused (analytics)               | api/ + hooks/        |
| UI-focused (badges)                    | components/ + hooks/ |
| Utility (app-config)                   | api/ only            |

---

### API Directory (api/)

Contains server-side logic and data models.

```
api/
├── logic/         # TypeScript business logic functions
└── models/        # TypeScript type definitions and enums
```

#### Conventions

- Logic files export pure functions for data transformation
- Models define interfaces, types, and enums for the feature domain

---

### Components Directory (components/)

Contains React UI components, each in its own subdirectory.

```
components/
├── feature-card/
│   ├── feature-card.tsx           # Main component - Manages whether to show loading, error, or empty states
│   ├── feature-card-loading.tsx   # Skeleton/loading state
│   ├── feature-card-errored.tsx   # Error state for component
│   ├── feature-card-empty.tsx     # Empty state for component
│   └── index.ts                   # Barrel export
└── index.ts                       # Root barrel export
```

#### Naming Conventions

- Component directories use kebab-case matching the component name
- Loading states: {component-name}-loading.tsx
- Error states: {component-name}-errored.tsx
- Empty states: {component-name}-empty.tsx

#### Barrel Exports

Each component exports via index.ts:

```typescript
// components/feature-card/index.ts
export {FeatureCard} from "./feature-card";
export {FeatureCardLoading} from "./feature-card-loading";
export {FeatureCardErrored} from "./feature-card-errored";
export {FeatureCardEmpty} from "./feature-card-empty";
```

---

### Hooks Directory (hooks/)

Contains custom React hooks for data fetching and reusable logic.

```
hooks/
├── use-feature-data.ts
├── use-feature-actions.ts
└── __tests__/
└── use-feature-data.test.ts
```

#### Hook Pattern

```typescript
export interface UseFeatureDataParams {
    id: string;
}

export interface UseFeatureDataResult {
    data: FeatureData | null;
    isLoading: boolean;
    error: Error | null;
}

export function useFeatureData(params: UseFeatureDataParams): UseFeatureDataResult {
// Implementation
}
```

---

### Contexts Directory (contexts/)

Contains React Context providers for feature-level state management.

```
contexts/
└── feature-context/
├── feature-context.tsx          # Context creation
├── feature-provider.tsx         # Provider component
├── feature-state.ts             # State type definitions
├── feature-actions.ts           # Action type definitions
├── feature-reducer.ts           # Reducer logic
└── __tests__/
```

#### Context Pattern

- Use React Context + useReducer for complex state
- Export a custom hook for consuming the context (e.g., useFeatureContext)
- Keep state, actions, and reducer in separate files for clarity

---

## Key Principles

1. Separation of Concerns: Keep data logic in api/, UI in components/, state in contexts/
2. Barrel Exports: Use index.ts files for clean import paths
4. Consistent Naming: Follow kebab-case for files, PascalCase for components
5. Co-located Tests: Place __tests__/ directories alongside the code they test

---

## Creating a New Feature

1. Create a new directory under src/lib/features/
2. Add the directories you need (api/, components/, hooks/, contexts/)
3. Follow the patterns established in existing features
4. Export public APIs via barrel exports
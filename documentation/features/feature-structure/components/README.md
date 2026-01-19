# Feature Components

Components are the UI building blocks within a feature. Each component is organized in its own directory with a
consistent file structure that handles all UI states: loading, empty, error, and the main view.

## shadcn/ui Requirement

**All feature components MUST be built using shadcn/ui primitives.** Do not create custom implementations of common UI patterns when a shadcn component exists.

### Rules

1. **Always use shadcn components** for: buttons, cards, dialogs, forms, inputs, selects, tables, tooltips, etc.
2. **Check existing components** in `components/ui/` before building
3. **Add missing shadcn components** via the shadcn MCP server if needed:
   - Use `npx shadcn@latest add <component-name>` or the shadcn MCP tools
4. **Compose shadcn primitives** to build larger, feature-specific components
5. **Never recreate** what shadcn already provides

### Example: Building a Feature Card

```tsx
// ✅ CORRECT: Using shadcn primitives
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FeatureCard({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ❌ WRONG: Custom implementation
export function FeatureCard({ title, children }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-bold">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
```

### Common shadcn Components

| Use Case           | shadcn Component                    |
|--------------------|-------------------------------------|
| Clickable actions  | `Button`                            |
| Content containers | `Card`, `CardHeader`, `CardContent` |
| Loading states     | `Skeleton`                          |
| User input         | `Input`, `Textarea`, `Select`       |
| Overlays           | `Dialog`, `Sheet`, `Popover`        |
| Feedback           | `Alert`, `Toast`                    |
| Navigation         | `Tabs`, `NavigationMenu`            |
| Data display       | `Table`, `Avatar`, `Badge`          |

## Directory Structure

```
components/
├── {component-name}/
│ ├── {component-name}.tsx # Main component (orchestrator)
│ ├── {component-name}-view.tsx # View component (UI logic)
│ ├── {component-name}-loading.tsx # Loading/skeleton state
│ ├── {component-name}-empty.tsx # Empty state
│ ├── {component-name}-errored.tsx # Error state
│ ├── {component-name}.module.css # Scoped styles (optional)
│ └── index.ts # Barrel exports
└── index.ts # Root barrel export
```

---

## Component Architecture

Components follow a layered architecture that separates concerns:

- Main Component (Orchestrator)
    - ErrorBoundary wrapper
    - Suspense boundary
    - Container styling
    - Calls hooks for data fetching and business logic
    - Passes data and callbacks to View component
- View Component (Presentational)
    - Receives ALL data and callbacks via props
    - Pure presentation logic only
    - May use UI-only local state (e.g., `useState` for dropdowns, modals)
    - No data-fetching hooks
- State Components
    - Loading (skeleton)
    - Empty (no data)
    - Error (fallback)

---

## Dumb Component Pattern

**All feature components follow the "dumb component" (presentational) pattern.** This means:

### Core Principles

1. **Components are presentational only** - They render UI based on props, nothing more
2. **All data comes via props** - Data, loading states, error states, and callbacks are passed down
3. **Business logic lives in hooks** - Data fetching, transformations, and side effects belong in hooks
4. **Components don't fetch data** - No `useFeatureData()` or similar hooks inside view components

### Allowed Hooks in Components

View components may only use hooks for **UI-only state**:
- `useState` for local visual state (dropdown open/closed, modal visibility, hover states)
- `useRef` for DOM references
- `useCallback`/`useMemo` for performance optimization of UI logic

### Not Allowed in Components

- Data-fetching hooks (`useSWR`, `useQuery`, custom data hooks)
- Business logic hooks that manage feature state
- Side effect hooks that interact with APIs

### Pattern Example

```tsx
// ❌ WRONG: View component fetches its own data
export function FeatureCardView({ itemId }: FeatureCardViewProps) {
  const { items, isLoading } = useFeatureData({ itemId }); // Don't do this!
  // ...
}

// ✅ CORRECT: Main component owns data, View receives via props
export function FeatureCard({ itemId }: FeatureCardProps) {
  const { items, isLoading, onSelect } = useFeatureData({ itemId });

  if (isLoading) return <FeatureCardLoading />;
  if (items.length === 0) return <FeatureCardEmpty />;

  return <FeatureCardView items={items} onSelect={onSelect} />;
}

export function FeatureCardView({ items, onSelect }: FeatureCardViewProps) {
  // Pure presentation - no data fetching
  const [hoveredId, setHoveredId] = useState<string | null>(null); // UI-only state is OK

  return (
    <div>
      {items.map((item) => (
        <button key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

### Benefits

- **Testability**: View components can be tested with simple props, no mocking needed
- **Reusability**: Presentational components can be reused with different data sources
- **Clarity**: Clear separation between "what to render" and "where data comes from"
- **Debugging**: Data flow is explicit and traceable through props

---

## File Breakdown

### Main Component ({component-name}.tsx)

The orchestrator that composes error handling, suspense, and the view.

```tsx
import {Suspense} from "react";
import {ErrorBoundary} from "@/components/error-boundary";
import {FeatureCardView} from "./feature-card-view";
import {FeatureCardLoading} from "./feature-card-loading";
import {FeatureCardErrored} from "./feature-card-errored";

export interface FeatureCardProps {
    itemId: string;
    className?: string;
}

export function FeatureCard(props: FeatureCardProps) {
    const {itemId, className} = props;

    return (
        <ErrorBoundary
            fallback={<FeatureCardErrored/>}
            componentName="FeatureCard"
        >
            <div className={className}>
                <Suspense fallback={<FeatureCardLoading/>}>
                    <FeatureCardView itemId={itemId}/>
                </Suspense>
            </div>
        </ErrorBoundary>
    );

}
```

#### Responsibilities:

- Wrap with ErrorBoundary for runtime error handling
- Wrap with Suspense for loading states
- Apply container-level styling
- Pass props to the view component

#### Server vs Client:

- Can be a Server Component (async) or Client Component
- If async data fetching happens here, use async function

---

### View Component ({component-name}-view.tsx)

Presentational component that receives all data and callbacks via props.

```tsx
"use client";

import {useState} from "react";

// Presentational component - receives all data and callbacks via props
export interface FeatureCardViewProps {
    items: Item[];
    selectedItem: Item | null;
    onSelect: (item: Item) => void;
}

export function FeatureCardView(props: FeatureCardViewProps) {
    const {items, selectedItem, onSelect} = props;

    // UI-only local state is allowed (dropdown, hover, etc.)
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <h2 className="font-semibold">Feature Title</h2>
                <nav>{/* Navigation controls */}</nav>
            </header>

            <main>
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={hoveredId === item.id ? "highlighted" : ""}
                    >
                        {item.name}
                    </button>
                ))}
            </main>
        </div>
    );

}
```

#### Responsibilities:

- Render UI based on props received from main component
- Manage UI-only local state (hover, focus, dropdown visibility)
- Call callbacks passed via props for user interactions
- Contains the primary UI markup

#### Key patterns:

- Mark as "use client" when using hooks or event handlers
- Receive data, loading states, and callbacks via props
- No data-fetching hooks—all data comes from parent
- Only use `useState` for UI-only state (hover, dropdowns, modals)

---

### Loading Component ({component-name}-loading.tsx)

Skeleton UI that mirrors the structure of the loaded component.

```tsx
export function FeatureCardLoading() {
    return (
        <div className="space-y-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-stone-200 rounded animate-pulse"/>
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-stone-200 rounded animate-pulse"/>
                    <div className="h-8 w-8 bg-stone-200 rounded animate-pulse"/>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="flex gap-4">
                {Array.from({length: 3}).map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 h-28 bg-stone-100 rounded-lg p-4"
                    >
                        <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse mb-2"/>
                        <div className="h-3 w-1/2 bg-stone-200 rounded animate-pulse"/>
                    </div>
                ))}
            </div>
        </div>
    );

}
```

#### Guidelines:

- Match the exact layout structure of the view component
- Use animate-pulse for skeleton animations
- Use neutral colors (bg-stone-100, bg-stone-200)
- No data fetching or state—pure presentational
- Can be a Server Component (no "use client" needed)

---

### Empty Component ({component-name}-empty.tsx)

Displayed when data exists but is empty.

```tsx
export function FeatureCardEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <EmptyIcon className="w-12 h-12 text-stone-400 mb-4"/>
            <p className="text-stone-500 text-center">
                No items available. Please check back later.
            </p>
        </div>
    );
}
```

#### Guidelines:

- Provide helpful, friendly messaging
- Optionally include an action (e.g., "Create your first item")
- Match the height/dimensions of the loaded state
- Can be a Server Component

  ---

### Error Component ({component-name}-errored.tsx)

Fallback UI when an error occurs.

```tsx
export function FeatureCardErrored() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <ErrorIcon className="w-12 h-12 text-red-400 mb-4"/>
            <p className="text-stone-500 text-center">
                An error occurred while loading. Please try again later.
            </p>
        </div>
    );
}
```

#### Guidelines:

- Keep it simple—no complex logic
- Optionally include a retry action
- Match dimensions of the normal state
- Must be a Client Component if it includes interactive elements

  ---

## Barrel Export (index.ts)

Export all public components from the directory.

```typescript
export {FeatureCard} from "./feature-card";
export {FeatureCardLoading} from "./feature-card-loading";
export {FeatureCardEmpty} from "./feature-card-empty";
export {FeatureCardErrored} from "./feature-card-errored";
```

Note: The view component is typically internal and not exported.

---

#### Props Interface Conventions

```typescript
// Main component props - receives identifiers, passes to hooks
export interface FeatureCardProps {
    // Required data identifiers (passed to hooks)
    itemId: string;

    // Optional styling
    className?: string;

    // Optional behavior modifiers
    isCompact?: boolean;

    // Optional callbacks from parent
    onSelect?: (item: Item) => void;
}

// View component props - receives data and callbacks from main component
export interface FeatureCardViewProps {
    // Data from hooks (passed down from main component)
    items: Item[];
    selectedItem: Item | null;

    // Callbacks from hooks (passed down from main component)
    onSelect: (item: Item) => void;
    onClear: () => void;
}

// Loading component props (layout-affecting only)
export interface FeatureCardLoadingProps {
    isCompact?: boolean;
    className?: string;
}
```

---

## Styling Patterns

### Tailwind Classes (Preferred)

```
<div className="rounded-xl border border-stone-200 p-4 space-y-3">
```

### CSS Modules (When Needed)

import styles from "./feature-card.module.css";

```
<div className={styles["feature-card__content"]}>
```

Use CSS Modules for:

- Complex selectors
- Keyframe animations
- Pseudo-elements
- Third-party component overrides

  ---

## State Management Within Components

### Local State

```typescript
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
const [currentPage, setCurrentPage] = useState(0);
```

### Boolean State (usehooks-ts)

```typescript
import {useBoolean} from "usehooks-ts";

const isModalOpen = useBoolean(false);
// isModalOpen.value, isModalOpen.setTrue, isModalOpen.setFalse
```

### Complex State

Use a Context when state needs to be shared across multiple nested components.

---

## Checklist for New Components

- Create component directory with kebab-case name
- Implement main component with ErrorBoundary + Suspense
- Main component calls hooks for data fetching
- Main component passes data and callbacks to view
- Implement view component as presentational (receives all data via props)
- View component has no data-fetching hooks
- Implement loading skeleton matching view structure
- Implement empty state with helpful message
- Implement error state with fallback UI
- Create barrel export in index.ts
- Add "use client" directive where needed
- Define and export props interfaces
- Match loading skeleton dimensions to loaded state
- Consider creating a companion hook if component needs business logic

---

## File Naming Summary

| File                     | Purpose                              |
|--------------------------|--------------------------------------|
| feature-card.tsx         | Main orchestrator component          |
| feature-card-view.tsx    | Presentational view (receives props) |
| feature-card-loading.tsx | Skeleton/loading state               |
| feature-card-empty.tsx   | Empty data state                     |
| feature-card-errored.tsx | Error fallback state                 |
| feature-card.module.css  | Scoped CSS (optional)                |
| index.ts                 | Barrel exports                       |
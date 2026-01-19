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
- View Component (UI Logic)
    - Data fetching via hooks
    - User interactions
    - Conditional rendering (empty state)
- State Components
    - Loading (skeleton)
    - Empty (no data)
    - Error (fallback)

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

Contains the actual UI logic, data fetching, and user interactions.

```tsx
"use client";

import {useState, useCallback} from "react";
import {useFeatureData} from "../../hooks/use-feature-data";
import {FeatureCardEmpty} from "./feature-card-empty";

export interface FeatureCardViewProps {
    itemId: string;
}

export function FeatureCardView(props: FeatureCardViewProps) {
    const {itemId} = props;
    const {items, pages} = useFeatureData({itemId});
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelect = useCallback((item) => {
        setSelectedItem(item);
    }, []);

    // Handle empty state
    if (items.length === 0) {
        return <FeatureCardEmpty/>;
    }

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
                        onClick={() => handleSelect(item)}
                        className="..."
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

- Fetch data using feature hooks
- Manage local UI state (selections, pagination, etc.)
- Handle user interactions
- Render empty state when no data
- Contains the primary UI markup

#### Key patterns:

- Mark as "use client" when using hooks or event handlers
- Use useCallback for event handlers passed to children
- Check for empty data and render empty state component

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
// Main component props
export interface FeatureCardProps {
// Required data identifiers
    itemId: string;

    // Optional styling
    className?: string;

    // Optional behavior modifiers
    isCompact?: boolean;

    // Optional callbacks
    onSelect?: (item: Item) => void;

}

// View component props (subset of main props)
export interface FeatureCardViewProps {
    itemId: string;
    onSelect?: (item: Item) => void;
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
- Implement view component with data fetching
- Implement loading skeleton matching view structure
- Implement empty state with helpful message
- Implement error state with fallback UI
- Create barrel export in index.ts
- Add "use client" directive where needed
- Define and export props interfaces
- Match loading skeleton dimensions to loaded state

---

## File Naming Summary

| File                     | Purpose                     |
|--------------------------|-----------------------------|
| feature-card.tsx         | Main orchestrator component |
| feature-card-view.tsx    | UI logic and rendering      |
| feature-card-loading.tsx | Skeleton/loading state      |
| feature-card-empty.tsx   | Empty data state            |
| feature-card-errored.tsx | Error fallback state        |
| feature-card.module.css  | Scoped CSS (optional)       |
| index.ts                 | Barrel exports              |
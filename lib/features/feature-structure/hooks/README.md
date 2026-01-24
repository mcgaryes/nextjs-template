# Feature Hooks

Hooks are reusable functions that encapsulate stateful logic, data fetching, and side effects. They follow React's hooks
pattern and provide a clean API for components to consume feature functionality.

---

## Hooks Own Business Logic

**Hooks are the single source of truth for all business logic in a feature.** Components are presentational only—they receive data and callbacks from hooks via props.

### What Hooks Own

| Responsibility           | Description                                                     |
|--------------------------|-----------------------------------------------------------------|
| **Data Fetching**        | All API calls, SWR/React Query usage, and data retrieval        |
| **State Management**     | Feature state, selections, pagination, filters                  |
| **Data Transformations** | Mapping, filtering, sorting, and computing derived values       |
| **Side Effects**         | API mutations, browser APIs, subscriptions                      |
| **Action Callbacks**     | Functions passed to components for user interactions            |

### What Components Receive

Components receive everything they need via props from hooks:

```typescript
// Hook provides data and callbacks
const { items, isLoading, error, selectedItem, onSelect, onClear } = useFeatureItems({ categoryId });

// Component receives via props - no direct hook calls in view components
<FeatureCardView
  items={items}
  selectedItem={selectedItem}
  onSelect={onSelect}
  onClear={onClear}
/>
```

### Pattern: Hook + Presentational Component

```typescript
// hooks/use-feature-items.ts
export function useFeatureItems(params: UseFeatureItemsParams): UseFeatureItemsReturnValue {
  const { categoryId } = params;

  // Data fetching
  const { data, isLoading, error, mutate } = useSWR<Item[]>(
    `/api/categories/${categoryId}/items`,
    fetcher
  );

  // Memoized transformations
  const items = useMemo(() => data ?? [], [data]);

  // State management
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Action callbacks for components
  const onSelect = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const onClear = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    items,
    isLoading,
    error: error ?? null,
    selectedItem,
    onSelect,
    onClear,
    refresh: mutate,
  };
}
```

### Benefits

- **Testability**: Hooks can be tested independently with mock data
- **Reusability**: Same hook can power multiple presentational components
- **Single Source of Truth**: Business logic is centralized, not scattered across components
- **Clear Data Flow**: Props trace back to a single hook, making debugging easier

---

## Directory Structure

```
hooks/
├── use-{feature}-{purpose}.ts       # Individual hook files
├── use-{shared-utility}.ts          # Base/utility hooks (optional)
└── __tests__/
└── use-{feature}-{purpose}.test.tsx
```

---

## Anatomy of a Hook

Every hook follows a consistent structure with typed parameters and return values.

```typescript
"use client";

import {useMemo} from "react";

// 1. Parameters interface
export interface UseFeatureDataParams {
    id: string;
    pageSize?: number;
}

// 2. Additional types (if needed)
export interface DataPage {
    index: number;
    items: Item[];
}

// 3. Return value interface
export interface UseFeatureDataReturnValue {
    items: Item[];
    pages: DataPage[];
    isLoading: boolean;
    error: Error | null;
}

// 4. Hook implementation
export function useFeatureData(
    params: UseFeatureDataParams
): UseFeatureDataReturnValue {
    const {id, pageSize = 10} = params;

    // Data fetching
    const {data, isLoading, error} = useFetch<Item[]>(`/api/items/${id}`);

    // Memoized transformations
    const items = useMemo(() => data ?? [], [data]);

    const pages = useMemo(() => {
        const pageCount = Math.ceil(items.length / pageSize);
        return Array.from({length: pageCount}, (_, index) => ({
            index,
            items: items.slice(index * pageSize, (index + 1) * pageSize),
        }));
    }, [items, pageSize]);

    return {items, pages, isLoading, error};
}
```

---

## Hook Structure Requirements

### Client Directive (Next.js App Router)

```typescript
"use client";
```

Required for hooks that use React hooks (useState, useEffect, useMemo, etc.) in Next.js App Router.

### Parameters Interface

```
export interface Use{FeatureName}{Purpose}Params {
    requiredParam: string;
    optionalParam?: number;
}
```

- Name format: Use{FeatureName}{Purpose}Params
- Export the interface for consumers to use
- Use optional properties with defaults where appropriate

### Return Value Interface

```
export interface Use{FeatureName}{Purpose}ReturnValue {
    data: SomeType[];
    isLoading: boolean;
    error: Error | null;
}
```

- Name format: Use{FeatureName}{Purpose}ReturnValue
- Always export for type safety
- Include loading/error states for data-fetching hooks

### Hook Function

```
export function use{FeatureName}{Purpose}(params: Use{FeatureName}{Purpose}Params): Use{FeatureName}{Purpose}ReturnValue {
    // Implementation
}
```

- Name format: use{featureName}{Purpose} (camelCase, starts with use)
- Single params object for clean API
- Explicit return type annotation

---

## React Best Practices (React 19+)

### Memoization

Use useMemo for expensive computations and derived data:

```typescript
// Memoize transformed data
const stats = useMemo(() => {
    return data ? transformData(data) : [];
}, [data]);

// Memoize computed values
const total = useMemo(() => {
    return stats.reduce((sum, stat) => sum + stat.value, 0);
}, [stats]);
```

When to use useMemo:

- Transforming API response data
- Filtering or sorting arrays
- Computing derived values
- Preserving referential equality for child components

When NOT to use useMemo:

- Simple property access
- Primitive value assignments
- Operations that are already cheap

### Suspense Integration

For data-fetching hooks, support React Suspense:

```typescript
const {data} = useSWR<T>(endpoint, fetcher, {suspense: true});
```

### Benefits:

- Cleaner loading states at component boundaries
- No need to check isLoading in every component
- Better streaming SSR support

### Avoiding Common Pitfalls

```typescript
// BAD: Creating new objects/arrays on every render
return {
    data: data ?? [],  // New array reference each time
};

// GOOD: Memoize to preserve referential equality
const memoizedData = useMemo(() => data ?? [], [data]);
return {data: memoizedData};
```

---

## Data Fetching Patterns

### Basic Data Fetching Hook

```typescript
"use client";

import {useMemo} from "react";
import useSWR from "swr";

export interface UseItemsParams {
    categoryId: string;
}

export interface UseItemsReturnValue {
    items: Item[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
}

export function useItems(params: UseItemsParams): UseItemsReturnValue {
    const {categoryId} = params;

    const {data, error, isLoading, mutate} = useSWR<Item[]>(
        `/api/categories/${categoryId}/items`,
        fetcher
    );

    const items = useMemo(() => data ?? [], [data]);

    return {
        items,
        isLoading,
        error: error ?? null,
        refresh: mutate,
    };
}
```

### Conditional Fetching

Disable fetching by passing null as the key:

```typescript
const {data} = useSWR(
    shouldFetch ? `/api/items/${id}` : null,  // null disables the request
    fetcher
);
```

### Dependent Fetching

Chain hooks when one depends on another:

```typescript
export function useItemDetails(params: UseItemDetailsParams) {
    const {itemId} = params;

    // First fetch
    const {data: item} = useSWR(`/api/items/${itemId}`, fetcher);

    // Dependent fetch - only runs when item exists
    const {data: reviews} = useSWR(
        item ? `/api/items/${itemId}/reviews` : null,
        fetcher
    );

    return {item, reviews};
}
```

---

## Testing Hooks

Use `@testing-library/react` with MSW for API mocking:

```tsx
import {renderHook, waitFor, act} from "@testing-library/react";
import {http, HttpResponse} from "msw";
import {setupServer} from "msw/node";
import {SWRConfig} from "swr";
import {Suspense} from "react";

const server = setupServer();

describe("useItems", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("returns items when API succeeds", async () => {
        // Arrange
        const mockItems = [{id: "1", name: "Item 1"}];
        server.use(
            http.get("/api/categories/123/items", () => {
                return HttpResponse.json(mockItems);
            })
        );

        // Act
        const {result} = renderHook(
                () => useItems({categoryId: "123"}),
                {
                    wrapper: ({children}) => (
                        <SWRConfig value={
                            {
                                dedupingInterval: 0
                            }
                        }>
                            <Suspense fallback={null}> {children} < /Suspense>
                        < /SWRConfig>
                    ),
                }
            )
        ;

        // Assert
        await waitFor(() => {
            expect(result.current.items).toHaveLength(1);
            expect(result.current.items[0].name).toBe("Item 1");
        });
    });

    test("returns error when API fails", async () => {
        server.use(
            http.get("/api/categories/123/items", () => {
                return HttpResponse.error();
            })
        );

        const {result} = renderHook(
            () => useItems({categoryId: "123"}),
            {wrapper: TestWrapper}
        );

        await waitFor(() => {
            expect(result.current.error).toBeDefined();
        });
    });
});
```

### Testing Best Practices

1. Wrap with SWRConfig — Disable caching between tests with dedupingInterval: 0
2. Use Suspense wrapper — Required for suspense-enabled hooks
3. Reset handlers in afterEach — Prevent test pollution
4. Test memoization — Verify referential equality is preserved across re-renders

---

## Hook Categories

All hooks provide data and callbacks that components consume via props. Components never call these hooks directly in view components—only in main/orchestrator components.

| Category         | Purpose                                | Provides to Components                     |
|------------------|----------------------------------------|--------------------------------------------|
| Data Fetching    | Fetch and transform API data           | `items`, `isLoading`, `error`, `refresh`   |
| State Management | Manage local/shared state              | `selectedItem`, `onSelect`, `onClear`      |
| Side Effects     | Handle browser APIs, subscriptions     | `isRecording`, `onStart`, `onStop`         |
| Utility          | Reusable logic                         | `debouncedValue`, `storedValue`, `setValue`|
| Context Consumer | Access context state                   | `user`, `theme`, `onLogout`                |

---

## Naming Conventions

| Element          | Format                           | Example                   |
|------------------|----------------------------------|---------------------------|
| Hook file        | use-{feature}-{purpose}.ts       | use-user-profile.ts       |
| Hook function    | use{Feature}{Purpose}            | useUserProfile            |
| Params interface | Use{Feature}{Purpose}Params      | UseUserProfileParams      |
| Return interface | Use{Feature}{Purpose}ReturnValue | UseUserProfileReturnValue |
| Test file        | use-{feature}-{purpose}.test.tsx | use-user-profile.test.tsx |

---

## Checklist for New Hooks

- Add "use client" directive (Next.js App Router)
- Define and export Params interface
- Define and export ReturnValue interface
- Use useMemo for derived/transformed data
- Support suspense mode for data fetching (if applicable)
- Handle loading and error states
- Provide action callbacks (e.g., `onSelect`, `onClear`) for component interactions
- Use `useCallback` for all callback functions returned to components
- Return all data needed by presentational components via the return value
- Add unit tests with API mocking
- Document complex logic with comments
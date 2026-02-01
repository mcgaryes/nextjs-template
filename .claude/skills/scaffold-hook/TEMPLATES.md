# Templates

Placeholders:
- `{hook-name}` = kebab-case (e.g., `user-profile`)
- `{HookName}` = PascalCase (e.g., `UserProfile`)

---

## Data Fetching: `use-{hook-name}.ts`

useSWR pattern with loading/error states and refresh capability.

```typescript
"use client";

import { useMemo } from "react";
import useSWR from "swr";

export interface Use{HookName}Params {
  id: string;
}

export interface Use{HookName}ReturnValue {
  data: unknown;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function use{HookName}(
  params: Use{HookName}Params
): Use{HookName}ReturnValue {
  const { id } = params;

  const { data, error, isLoading, mutate } = useSWR<unknown>(
    `/api/{hook-name}/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  const memoizedData = useMemo(() => data ?? null, [data]);

  return {
    data: memoizedData,
    isLoading,
    error: error ?? null,
    refresh: mutate,
  };
}
```

---

## State Management: `use-{hook-name}.ts`

useState/useReducer pattern for local or shared state.

```typescript
"use client";

import { useCallback, useState } from "react";

export interface Use{HookName}State {
  value: unknown;
}

export interface Use{HookName}Params {
  initialValue?: unknown;
}

export interface Use{HookName}ReturnValue {
  state: Use{HookName}State;
  setValue: (value: unknown) => void;
  reset: () => void;
}

export function use{HookName}(
  params: Use{HookName}Params = {}
): Use{HookName}ReturnValue {
  const { initialValue = null } = params;

  const [state, setState] = useState<Use{HookName}State>({
    value: initialValue,
  });

  const setValue = useCallback((value: unknown) => {
    setState({ value });
  }, []);

  const reset = useCallback(() => {
    setState({ value: initialValue });
  }, [initialValue]);

  return {
    state,
    setValue,
    reset,
  };
}
```

---

## Utility: `use-{hook-name}.ts`

Reusable logic hook like useDebounce or useLocalStorage.

```typescript
"use client";

import { useEffect, useState } from "react";

export interface Use{HookName}Params {
  // Add parameters here
}

export interface Use{HookName}ReturnValue {
  // Add return values here
}

export function use{HookName}(
  params: Use{HookName}Params
): Use{HookName}ReturnValue {
  // Implement hook logic here

  return {
    // Return values
  } as Use{HookName}ReturnValue;
}
```

---

## Barrel Export: `hooks/index.ts`

### Standard export (Data Fetching, Utility)

```typescript
export { use{HookName} } from "./use-{hook-name}";
export type {
  Use{HookName}Params,
  Use{HookName}ReturnValue,
} from "./use-{hook-name}";
```

### State Management export (includes State type)

```typescript
export { use{HookName} } from "./use-{hook-name}";
export type {
  Use{HookName}Params,
  Use{HookName}ReturnValue,
  Use{HookName}State,
} from "./use-{hook-name}";
```

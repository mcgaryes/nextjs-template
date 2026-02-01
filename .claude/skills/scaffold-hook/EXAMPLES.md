# Examples

## Example 1: Data Fetching hook with usage

Input:
- hook: `user-profile`
- feature: `users`
- type: Data Fetching

Output:
```text
features/users/hooks/
├── use-user-profile.ts
└── index.ts
```

Usage:
```tsx
import { useUserProfile } from "@/features/users/hooks";

export function UserProfileCard({ userId }: { userId: string }) {
  const { data, isLoading, error, refresh } = useUserProfile({ id: userId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{data.name}</h2>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

## Example 2: State Management hook with usage

Input:
- hook: `form-draft`
- feature: `forms`
- type: State Management

Output:
```text
features/forms/hooks/
├── use-form-draft.ts
└── index.ts
```

The State type is also exported for this category:
```typescript
export { useFormDraft } from "./use-form-draft";
export type {
  UseFormDraftParams,
  UseFormDraftReturnValue,
  UseFormDraftState,
} from "./use-form-draft";
```

Usage:
```tsx
import { useFormDraft } from "@/features/forms/hooks";

export function DraftEditor() {
  const { state, setValue, reset } = useFormDraft({
    initialValue: { title: "", body: "" }
  });

  return (
    <form>
      <input
        value={state.value.title}
        onChange={(e) => setValue({ ...state.value, title: e.target.value })}
      />
      <button type="button" onClick={reset}>Clear Draft</button>
    </form>
  );
}
```

---

## Example 3: Utility hook

Input:
- hook: `debounce`
- feature: `shared`
- type: Utility

Output:
```text
features/shared/hooks/
├── use-debounce.ts
└── index.ts
```

Example implementation after scaffolding:
```typescript
"use client";

import { useEffect, useState } from "react";

export interface UseDebounceParams<T> {
  value: T;
  delay?: number;
}

export interface UseDebounceReturnValue<T> {
  debouncedValue: T;
}

export function useDebounce<T>(
  params: UseDebounceParams<T>
): UseDebounceReturnValue<T> {
  const { value, delay = 300 } = params;
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return { debouncedValue };
}
```

---

## Naming Convention Reference

| Input (kebab) | PascalCase | Function Name |
|---------------|------------|---------------|
| `user-profile` | `UserProfile` | `useUserProfile` |
| `form-draft` | `FormDraft` | `useFormDraft` |
| `debounce` | `Debounce` | `useDebounce` |

File naming:
| Element | Format | Example |
|---------|--------|---------|
| Hook file | `use-{hook-name}.ts` | `use-user-profile.ts` |
| Hook function | `use{HookName}` | `useUserProfile` |
| Params interface | `Use{HookName}Params` | `UseUserProfileParams` |
| Return interface | `Use{HookName}ReturnValue` | `UseUserProfileReturnValue` |
| State interface | `Use{HookName}State` | `UseUserProfileState` |

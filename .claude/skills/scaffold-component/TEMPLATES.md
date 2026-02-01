# Templates

Placeholders:
- `{component-name}` = kebab-case (e.g., `user-profile-card`)
- `{ComponentName}` = PascalCase (e.g., `UserProfileCard`)

---

## Base component: `{component-name}.tsx`

Default wrapper is a simple `<div>`. If the user prompt explicitly asks for shadcn primitives (e.g., Card), update this template accordingly.

```tsx
interface {ComponentName}Props {
  // Add your props here
}

export function {ComponentName}(props: {ComponentName}Props) {
  const {} = props;

  return (
    <div className="w-full">
      {/* {ComponentName} content */}
    </div>
  );
}
```

---

## Barrel: `index.ts`

Start with base exports, then add variant exports only for files that were generated.

```ts
export { {ComponentName} } from "./{component-name}";
```

### Variant exports (add only those created)

```ts
export { {ComponentName}Loading } from "./{component-name}-loading";
export { {ComponentName}Empty } from "./{component-name}-empty";
export { {ComponentName}Errored } from "./{component-name}-errored";
export { {ComponentName}View } from "./{component-name}-view";
export { {ComponentName}Server } from "./{component-name}-server";
```

---

## Loading: `{component-name}-loading.tsx`

Default UI is the text `"Loading"`. If the prompt asks for a Skeleton/spinner, the caller can pass it through `indicator`.

```tsx
import type { ReactNode } from "react";

interface {ComponentName}LoadingProps {
  indicator?: ReactNode;
  text?: string;
}

export function {ComponentName}Loading(props: {ComponentName}LoadingProps) {
  const { indicator, text = "Loading" } = props;

  return (
    <div className="w-full">
      {indicator ?? <div className="text-sm text-muted-foreground">{text}</div>}
    </div>
  );
}
```

---

## Empty: `{component-name}-empty.tsx`

```tsx
interface {ComponentName}EmptyProps {
  message?: string;
}

export function {ComponentName}Empty(props: {ComponentName}EmptyProps) {
  const { message = "No data available" } = props;

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
```

---

## Errored: `{component-name}-errored.tsx`

Default UI is the text `"Error"`. If the prompt asks for a retry button, the caller can pass it through `action`.

```tsx
import type { ReactNode } from "react";

interface {ComponentName}ErroredProps {
  message?: string;
  action?: ReactNode;
}

export function {ComponentName}Errored(props: {ComponentName}ErroredProps) {
  const { message = "Error", action } = props;

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-destructive">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
```

---

## View: `{component-name}-view.tsx`

Presentational only. UI-only local state is allowed.

```tsx
"use client";

import { useState } from "react";

interface {ComponentName}ViewProps {
  items: unknown[];
  onSelect?: (item: unknown) => void;
}

export function {ComponentName}View(props: {ComponentName}ViewProps) {
  const { items, onSelect } = props;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer rounded-md p-2 hover:bg-muted"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onSelect?.(item)}
        >
          <div className="text-sm">Item {index + 1}</div>
          {hoveredIndex === index ? (
            <div className="text-xs text-muted-foreground">Hovered</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
```

---

## Server: `{component-name}-server.tsx`

Async server component wrapper for Next.js App Router Suspense streaming pattern. Data fetching happens server-side without blocking page render.

```tsx
import { Suspense } from "react";

import { {ComponentName} } from "./{component-name}";
import { {ComponentName}Loading } from "./{component-name}-loading";

interface {ComponentName}ServerProps {
  // Props for data fetching configuration
}

// TODO: Replace with actual data fetching logic
async function getData() {
  // Example: const data = await fetch(...).then(res => res.json());
  return {};
}

export async function {ComponentName}Server(props: {ComponentName}ServerProps) {
  const data = await getData();

  return (
    <Suspense fallback={<{ComponentName}Loading />}>
      <{ComponentName} {...data} />
    </Suspense>
  );
}
```

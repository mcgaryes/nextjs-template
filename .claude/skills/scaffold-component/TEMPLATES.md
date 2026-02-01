# Templates

Placeholders:
- `{component-name}` = kebab-case (e.g., `user-profile-card`)
- `{ComponentName}` = PascalCase (e.g., `UserProfileCard`)

---

## Base component: `{component-name}.tsx`

Use shadcn `Card` when the component name contains "card" or represents a bounded container.

### With Card (default for card-like components)

```tsx
import { Card, CardContent } from '@/components/ui/card';

interface {ComponentName}Props {
  // Add your props here
}

export function {ComponentName}(props: {ComponentName}Props) {
  const {} = props;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* {ComponentName} content */}
      </CardContent>
    </Card>
  );
}
```

### With Card + Avatar (for user/profile components)

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface {ComponentName}Props {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export function {ComponentName}(props: {ComponentName}Props) {
  const { firstName, lastName, email, avatarUrl } = props;

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const defaultAvatarUrl = `https://i.pravatar.cc/150?u=${email}`;

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl ?? defaultAvatarUrl} alt={`${firstName} ${lastName}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Without Card (simple wrapper)

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

Always use shadcn `Skeleton` for loading states. The skeleton layout should mirror the base component structure.

### With Card + Avatar skeleton

```tsx
import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface {ComponentName}LoadingProps {
  indicator?: ReactNode;
}

export function {ComponentName}Loading(props: {ComponentName}LoadingProps) {
  const { indicator } = props;

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        {indicator ?? (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

### With Card skeleton (generic)

```tsx
import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface {ComponentName}LoadingProps {
  indicator?: ReactNode;
}

export function {ComponentName}Loading(props: {ComponentName}LoadingProps) {
  const { indicator } = props;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {indicator ?? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Without Card

```tsx
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface {ComponentName}LoadingProps {
  indicator?: ReactNode;
}

export function {ComponentName}Loading(props: {ComponentName}LoadingProps) {
  const { indicator } = props;

  return (
    <div className="w-full">
      {indicator ?? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}
    </div>
  );
}
```

---

## Empty: `{component-name}-empty.tsx`

### With Card

```tsx
import { Card, CardContent } from '@/components/ui/card';

interface {ComponentName}EmptyProps {
  message?: string;
}

export function {ComponentName}Empty(props: {ComponentName}EmptyProps) {
  const { message = 'No data available' } = props;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
```

### Without Card

```tsx
interface {ComponentName}EmptyProps {
  message?: string;
}

export function {ComponentName}Empty(props: {ComponentName}EmptyProps) {
  const { message = 'No data available' } = props;

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
```

---

## Errored: `{component-name}-errored.tsx`

Always use shadcn `Button` for the retry action.

### With Card + Button

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface {ComponentName}ErroredProps {
  message?: string;
  onRetry?: () => void;
}

export function {ComponentName}Errored(props: {ComponentName}ErroredProps) {
  const { message = 'Something went wrong', onRetry } = props;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3 p-4">
        <p className="text-sm text-destructive">{message}</p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
```

### Without Card

```tsx
import { Button } from '@/components/ui/button';

interface {ComponentName}ErroredProps {
  message?: string;
  onRetry?: () => void;
}

export function {ComponentName}Errored(props: {ComponentName}ErroredProps) {
  const { message = 'Something went wrong', onRetry } = props;

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
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
import { Suspense } from 'react';

import { {ComponentName} } from './{component-name}';
import { {ComponentName}Loading } from './{component-name}-loading';

interface {ComponentName}ServerProps {
  getData: () => Promise<Record<string, unknown>>;
}

async function {ComponentName}Async(props: {ComponentName}ServerProps) {
  const { getData } = props;
  const data = await getData();

  return <{ComponentName} {...data} />;
}

export function {ComponentName}Server(props: {ComponentName}ServerProps) {
  return (
    <Suspense fallback={<{ComponentName}Loading />}>
      <{ComponentName}Async {...props} />
    </Suspense>
  );
}
```

---

## Placeholder Images

When generating mock/demo data for components, use these placeholder services:

### Avatar placeholder (Pravatar)
Use email or userId as the unique identifier for consistent avatars:
```tsx
// In mock data or server components
const avatarUrl = `https://i.pravatar.cc/150?u=${email}`;
```

### Generic image placeholder (placehold.co)
```tsx
// Basic placeholder
const imageUrl = `https://placehold.co/400x300`;

// With custom colors (hex without #)
const imageUrl = `https://placehold.co/400x300/e2e8f0/64748b`;

// Common sizes
const thumbnail = `https://placehold.co/100x100`;
const card = `https://placehold.co/400x300`;
const hero = `https://placehold.co/1200x600`;
```

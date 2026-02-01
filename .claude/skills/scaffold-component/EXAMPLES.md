# Examples

## Example 1: Base component only

Input:
- component: `user-profile-card`
- feature: `users`
- variants: none

Output:
```text
features/users/components/user-profile-card/
├── user-profile-card.tsx
└── index.ts
```

---

## Example 2: Loading + Errored (defaults, no required primitives)

Input:
- component: `billing-summary`
- feature: `billing`
- variants: `loading, errored`

Output:
```text
features/billing/components/billing-summary/
├── billing-summary.tsx
├── billing-summary-loading.tsx   # defaults to "Loading", optional indicator
├── billing-summary-errored.tsx   # defaults to "Error", optional action
└── index.ts
```

---

## Example 3: Prompt requests a Skeleton and Retry Button (install only when asked)

If the user request says:
- "Use a Skeleton for loading"
- "Add a Retry Button"

Then infer requested primitives:
- `skeleton`
- `button`

And (if missing) install:
- `npx shadcn@latest add skeleton --yes`
- `npx shadcn@latest add button --yes`

The scaffolded files still keep these as optional props:
- `Loading` accepts `indicator?: ReactNode`
- `Errored` accepts `action?: ReactNode`

Example usage (illustrative):

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BillingSummaryLoading, BillingSummaryErrored } from "@/features/billing/components/billing-summary";

export function BillingSummaryContainer() {
  return (
    <>
      <BillingSummaryLoading indicator={<Skeleton className="h-4 w-full" />} />
      <BillingSummaryErrored action={<Button variant="outline">Retry</Button>} />
    </>
  );
}
```

---

## Example 4: View variant stays presentational

Input:
- component: `alerts-panel`
- feature: `alerts`
- variants: `view`

Output:
```text
features/alerts/components/alerts-panel/
├── alerts-panel.tsx
├── alerts-panel-view.tsx
└── index.ts
```

Notes:
- `alerts-panel-view.tsx` must not fetch data.
- It may use UI-only local state (hover, focus, open/closed).

---

## Example 5: Server variant with Suspense streaming

Input:
- component: `user-profile-card`
- feature: `feature-structure`
- variants: `loading, errored, server`
- request mentions: "suspenseful", "do not block rendering"

Output:
```text
features/feature-structure/components/user-profile-card/
├── user-profile-card.tsx
├── user-profile-card-loading.tsx
├── user-profile-card-errored.tsx
├── user-profile-card-server.tsx
└── index.ts
```

### Loading component with skeleton (`user-profile-card-loading.tsx`)

The loading variant mirrors the base component's layout using shadcn `Skeleton` components:

```tsx
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileCardLoadingProps {
    indicator?: ReactNode;
}

export function UserProfileCardLoading(props: UserProfileCardLoadingProps) {
    const { indicator } = props;

    return (
        <div className="flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            {indicator ?? (
                <>
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </>
            )}
        </div>
    );
}
```

### Server component pattern (`user-profile-card-server.tsx`)

The server variant wraps an async data-fetching component in Suspense, using the loading variant as the fallback:

```tsx
import { Suspense } from 'react';

import { UserProfileCard } from './user-profile-card';
import { UserProfileCardLoading } from './user-profile-card-loading';

interface UserProfileCardServerProps {
    getUserProfile: () => Promise<{
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl?: string;
    }>;
}

async function UserProfileCardAsync(props: UserProfileCardServerProps) {
    const { getUserProfile } = props;
    const data = await getUserProfile();

    return <UserProfileCard {...data} />;
}

export async function UserProfileCardServer(props: UserProfileCardServerProps) {
    return (
        <Suspense fallback={<UserProfileCardLoading />}>
            <UserProfileCardAsync {...props} />
        </Suspense>
    );
}
```

### Usage in a page (`app/page.tsx`)

The page renders immediately while the profile card streams in after data loads:

```tsx
import { UserProfileCardServer } from '@/features/feature-structure/components/user-profile-card';

async function getUserProfile() {
    // Fetch from API, database, etc.
    return { firstName: 'John', lastName: 'Doe', email: 'jd@example.com' };
}

export default function Home() {
    return (
        <main>
            {/* Page renders immediately, profile streams in when ready */}
            <UserProfileCardServer getUserProfile={getUserProfile} />
        </main>
    );
}
```

Notes:
- `server` variant auto-includes `loading` (required for Suspense fallback)
- Data fetcher is passed as a prop, keeping the component reusable
- Inner async component (`UserProfileCardAsync`) awaits data, outer component wraps in Suspense
- Page does not block on data fetch - content streams progressively
- Loading skeleton mirrors the base component's layout (same container, matching dimensions for avatar and text)
- Uses shadcn `Skeleton` component for consistent styling and animation
- Skeleton shapes match content: `rounded-full` for avatar, default `rounded-md` for text lines

# Examples

## Example 1: User profile card with shadcn primitives

Input:
- component: `user-profile-card`
- feature: `user`
- variants: `loading, errored, server`
- request: "profile card with avatar, name, and email"

**Inferred primitives:** `card`, `avatar`, `skeleton`, `button`

Output:
```text
features/user/components/user-profile-card/
├── user-profile-card.tsx          # Uses Card + Avatar
├── user-profile-card-loading.tsx  # Uses Card + Skeleton
├── user-profile-card-errored.tsx  # Uses Card + Button
├── user-profile-card-server.tsx   # Suspense wrapper
└── index.ts
```

### Base component (`user-profile-card.tsx`)

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface UserProfileCardProps {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

export function UserProfileCard(props: UserProfileCardProps) {
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

### Loading component (`user-profile-card-loading.tsx`)

```tsx
import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileCardLoadingProps {
    indicator?: ReactNode;
}

export function UserProfileCardLoading(props: UserProfileCardLoadingProps) {
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

### Errored component (`user-profile-card-errored.tsx`)

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UserProfileCardErroredProps {
    message?: string;
    onRetry?: () => void;
}

export function UserProfileCardErrored(props: UserProfileCardErroredProps) {
    const { message = 'Failed to load profile', onRetry } = props;

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

### Server component (`user-profile-card-server.tsx`)

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

export function UserProfileCardServer(props: UserProfileCardServerProps) {
    return (
        <Suspense fallback={<UserProfileCardLoading />}>
            <UserProfileCardAsync {...props} />
        </Suspense>
    );
}
```

---

## Example 2: Product card (card without avatar)

Input:
- component: `product-card`
- feature: `products`
- variants: `loading`

**Inferred primitives:** `card`, `skeleton`

Output:
```text
features/products/components/product-card/
├── product-card.tsx          # Uses Card
├── product-card-loading.tsx  # Uses Card + Skeleton
└── index.ts
```

### Base component (`product-card.tsx`)

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
    name: string;
    price: number;
    description: string;
}

export function ProductCard(props: ProductCardProps) {
    const { name, price, description } = props;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">${price}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
```

### Loading component (`product-card-loading.tsx`)

```tsx
import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardLoadingProps {
    indicator?: ReactNode;
}

export function ProductCardLoading(props: ProductCardLoadingProps) {
    const { indicator } = props;

    return (
        <Card className="w-full">
            {indicator ?? (
                <>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </>
            )}
        </Card>
    );
}
```

---

## Example 3: Simple list (no card)

Input:
- component: `notification-list`
- feature: `notifications`
- variants: `loading, empty`

**Inferred primitives:** `skeleton` (no card - name doesn't contain "card")

Output:
```text
features/notifications/components/notification-list/
├── notification-list.tsx
├── notification-list-loading.tsx  # Uses Skeleton
├── notification-list-empty.tsx
└── index.ts
```

### Loading component (`notification-list-loading.tsx`)

```tsx
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface NotificationListLoadingProps {
    indicator?: ReactNode;
}

export function NotificationListLoading(props: NotificationListLoadingProps) {
    const { indicator } = props;

    return (
        <div className="w-full space-y-3">
            {indicator ?? (
                <>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </>
            )}
        </div>
    );
}
```

---

## Example 4: View variant with Card

Input:
- component: `team-member-card`
- feature: `teams`
- variants: `view`

**Inferred primitives:** `card`, `avatar`

Output:
```text
features/teams/components/team-member-card/
├── team-member-card.tsx       # Uses Card + Avatar
├── team-member-card-view.tsx  # Client component with local state
└── index.ts
```

---

## Primitive inference summary

| Component name pattern | Variants | Primitives installed |
|------------------------|----------|---------------------|
| `*-card`, `*-panel` | any | `card` |
| `user-*`, `*-profile-*`, `*-avatar-*` | any | `avatar` |
| any | `loading` | `skeleton` |
| any | `errored` | `button` |

### Examples of inference:

- `user-profile-card` + `loading, errored` → `card`, `avatar`, `skeleton`, `button`
- `product-card` + `loading` → `card`, `skeleton`
- `notification-list` + `loading, empty` → `skeleton`
- `settings-panel` + `errored` → `card`, `button`

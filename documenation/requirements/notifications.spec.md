# Claude Code Requirements — Notifications Feature

> **Purpose:** This document is written to be directly usable by **Claude Code** (or similar coding agents) as an implementation spec.
>
> **Feature:** `notifications` (Next.js / React feature module)

---

## 1) Objective

Implement a **Notifications** feature that orchestrates between:

- An existing **cache library** (for pub/sub + key deletion)
- An existing **alerts feature** (for toast UI via `useAlert`)

The feature must subscribe to user-scoped notification channels for the lifetime of the app, convert cache notifications into toast alerts, and delete cache keys when surfaced and/or interacted with.

---

## 2) Key Behaviors (Must-Haves)

### Subscription
- Subscribe to cache channel pattern:

  `notification:userid:{userId}:*`

- Start listening only when `userId` is available.
- Maintain listening for the **lifetime of the app**.

### Alert creation
- On notification received:
  - Create a toast alert via the Alerts feature (`useAlert`).
  - **When an alert is created**, delete the notification item/key from cache.

### Digest
- If more than one notification exists for the same user within a short processing window:
  - Show **one** digest toast with the message:

    **“You have X unseen notifications”**

### Click behavior
- When the alert (single or digest) is clicked:
  - Navigate to the **Messages page**
  - The Messages page should load the **latest notification**
  - On click, **delete** the cached notification key(s) (idempotent)

### Provider ordering
- Notifications must run within app-level providers:
  - Wrapped around the app `children`
  - **Within** the `AlertProvider` so it can call `useAlert`

Required order:
```tsx
<AlertProvider>
  <NotificationsProvider>
    {children}
  </NotificationsProvider>
</AlertProvider>
```

---

## 3) Non-Goals

- Do not implement Alerts UI (already exists).
- Do not implement the cache library (already exists).
- Do not implement the Messages page UI (only navigate with correct intent).

---

## 4) Feature Module Structure (Create These Files)

Create a new feature directory:

```
features/notifications/
├── api/
│   ├── logic/
│   │   ├── notification-channel.ts
│   │   ├── notification-digest.ts
│   │   └── notification-cleanup.ts
│   └── models/
│       ├── notification.models.ts
│       └── notification.enums.ts
├── hooks/
│   ├── use-notifications.ts
│   └── use-notification.ts
└── contexts/
    └── notifications-provider/
        ├── notifications-context.tsx
        ├── notifications-provider.tsx
        ├── notifications-state.ts
        ├── notifications-actions.ts
        ├── notifications-reducer.ts
        ├── use-notifications-context.ts
        └── index.ts
```

Add barrel exports as needed:
- `features/notifications/hooks/index.ts`
- `features/notifications/api/index.ts`
- `features/notifications/index.ts`

---

## 5) Dependencies & Contracts (Do Not Re-Implement)

### Cache library (assumed existing)
You must integrate with the cache library. The exact function names may differ in your codebase; adapt accordingly.

**Required capabilities:**
- Subscribe to key pattern / channel:
  - `useCacheSubscription(pattern: string, onEvent: (event) => void)` OR equivalent
- Delete keys:
  - `delete(key: string)` OR equivalent
- Optional: fetch payload/value for key (if supported)

### Alerts feature (assumed existing)
**Required capability:**
- `useAlert()` hook with a method to enqueue toast alerts (e.g., `addAlert(...)`)

---

## 6) Data Model (Types)

Create these in `features/notifications/api/models/notification.models.ts`.

```ts
export interface NotificationKey {
  raw: string;      // full cache key
  userId: string;   // parsed from key
  id: string;       // parsed notification id portion
}

export interface NotificationItem {
  key: NotificationKey;
  payload?: unknown;     // if cache provides a value/payload
  createdAt?: string;    // optional if in payload
}

export interface NotificationDigest {
  count: number;
  keys: NotificationKey[];
}
```

Add enums in `notification.enums.ts` if useful (optional).

---

## 7) Logic Utilities (Pure Functions)

### `notification-channel.ts`
- `buildNotificationChannel(userId: string): string`
  - returns `notification:userid:${userId}:*`

- `parseNotificationKey(raw: string): NotificationKey | null`
  - Must return `null` if key does not match expected structure

### `notification-digest.ts`
- Implement batching/digest window logic:
  - Keep a short debounce/batch window (constant) to group multiple keys
  - Provide:
    - `shouldDigest(keys: NotificationKey[]): boolean`
    - `buildDigest(keys: NotificationKey[]): NotificationDigest`

### `notification-cleanup.ts`
- `deleteNotificationKeys(keys: NotificationKey[], deleter: (key: string) => Promise<void> | void): Promise<void>`
  - Must be **idempotent safe** (ignore not-found errors)

---

## 8) Hooks

### 8.1 `useNotifications` (lifetime listener)
File: `features/notifications/hooks/use-notifications.ts`

**Responsibilities:**
- Subscribe to `notification:userid:{userId}:*`
- Collect incoming notification keys into a short-lived queue/batch
- Decide single vs digest
- Enqueue toast alerts via `useAlert`
- Delete key(s) on alert creation
- Attach click handlers that navigate + delete key(s) again (idempotent)

**Suggested interface:**
```ts
export interface UseNotificationsResult {
  isListening: boolean;
  error: Error | null;
  unseenCount: number;
}

export function useNotifications(): UseNotificationsResult;
```

**Implementation notes:**
- Must not subscribe until `userId` is available (source of `userId` may be auth/session hook in your app).
- Must unsubscribe on unmount.
- Must not crash app on errors—store `error` and keep app running.
- Prefer a configurable digest debounce (e.g. `DIGEST_WINDOW_MS`).

### 8.2 `useNotification` (consumer hook)
File: `features/notifications/hooks/use-notification.ts`

**Responsibilities:**
- Expose Notifications state (from context) to consumers.

```ts
export interface UseNotificationResult {
  unseenCount: number;
  isListening: boolean;
  error: Error | null;
}

export function useNotification(): UseNotificationResult;
```

---

## 9) Context Provider

### `NotificationsProvider`
File: `features/notifications/contexts/notifications-provider/notifications-provider.tsx`

**Requirements:**
- Mount `useNotifications()` inside the provider so listening begins when provider renders.
- Provide `{ unseenCount, isListening, error }` to consumers.
- Ensure provider is used inside `AlertProvider` (see integration section).

---

## 10) Navigation Contract (Messages Page)

On alert click:
- Navigate to `/messages`
- Provide intent to load latest notification (choose one mechanism, consistent across codebase):
  - Query param recommended: `?focus=latest-notification`

Encapsulate construction in a helper, e.g.:
- `buildMessagesLatestNotificationUrl(): string`

---

## 11) Alert Content Requirements

### Single notification alert
- Default content if payload doesn’t provide title/description:
  - Title: `New notification`
  - Description: `Open to view details`

### Digest alert
- Title: `Notifications`
- Description: `You have X unseen notifications`

### Click actions (both)
- Navigate to messages latest notification
- Delete associated key(s)

---

## 12) Deletion Rules (Important)

- **On alert created:** delete key(s)
- **On alert click:** delete key(s) again
- Deletion must be idempotent (safe if already deleted)

---

## 13) Error Handling & Resilience

- Cache subscription failure:
  - Set `error`
  - Allow retry strategy (optional; if implemented, make it configurable)
- Cache delete failures:
  - Do not throw uncaught errors
  - Log/report if your codebase has a standard logger

---

## 14) App Integration Steps (Concrete)

1. Add `NotificationsProvider` to the app providers.
2. Ensure correct nesting:

```tsx
<AlertProvider>
  <NotificationsProvider>
    {children}
  </NotificationsProvider>
</AlertProvider>
```

3. Confirm Notifications begins listening immediately after user is resolved.

---

## 15) Acceptance Criteria (Testable)

- [ ] When a user is present, a cache subscription is opened for `notification:userid:{userId}:*`.
- [ ] When a notification key/event arrives, a toast alert is shown via Alerts feature.
- [ ] Creating the alert deletes the corresponding cache key(s).
- [ ] When multiple keys exist within the digest window, **one** digest toast appears: “You have X unseen notifications”.
- [ ] Clicking the toast navigates to `/messages?focus=latest-notification` (or agreed equivalent).
- [ ] Clicking the toast deletes the cache key(s) (idempotent).
- [ ] Subscription cleans up on unmount.
- [ ] Errors are captured in state and do not crash the app.

---

## 16) Testing Requirements (Minimum)

### Unit tests (pure logic)
- `notification-channel`
  - `buildNotificationChannel` outputs correct string
  - `parseNotificationKey` parses valid keys and rejects invalid ones
- `notification-digest`
  - Builds correct digest count/message
  - Batching window behavior (if implemented as pure logic)
- `notification-cleanup`
  - Calls deleter for each key and tolerates not-found errors

### Hook/provider tests
- `useNotifications`
  - Subscribes only when `userId` is available
  - Enqueues single alert on single key
  - Enqueues digest alert on multiple keys
  - Deletes on alert creation and on click
  - Navigates on click

---

## 17) Implementation Checklist (Claude Code Task List)

- [ ] Create `features/notifications/` directory structure
- [ ] Implement models and helpers in `api/`
- [ ] Implement digest batching logic
- [ ] Implement `useNotifications` hook integrating cache + alerts + navigation + deletion
- [ ] Implement context/provider and consumer hook `useNotification`
- [ ] Add provider to app-level layout within `AlertProvider`
- [ ] Write unit tests for helpers and basic integration tests for hook/provider

# Feature: Alerts

## Overview
Provide a global alert system that displays **toast notifications only** (via `sonner`). Alerts must render **above all other UI**, **support multiple simultaneous alerts**, **stack in the top-right**, and **expand to show all on hover**. Alerts must be **available app-wide** via a shared `AlertContext` and **persist across page navigation**. Provide an `AlertFactory` to generate common alert configurations quickly.

---

## Goals
- Render alerts above all other UI in the app.
- Support multiple simultaneous toast alerts.
- Use `sonner` for all toast rendering.
- Toasts stack (top-right) and expand to show all on hover.
- Provide app-wide API to **add / remove / update** alerts by `id`.
- Provide an `AlertFactory` that creates alerts with sensible defaults.

## Non-goals
- Modal/dialog alerts.
- Server persistence of alerts (unless added later).

---

## UI Requirements

### AlertsView (Global Container)
**Purpose:** Root-level, always-mounted overlay that hosts all active toast alerts.

**Requirements:**
- Must render **above all other components** (highest z-index overlay / portal usage).
- Must support rendering **multiple alerts concurrently**.
- Must render all alerts in a single fixed location: **top-right**.
- Must use the `sonner` toast system for rendering.
- Toast alerts must **stack** `expand={false}`.
- When the user **hovers over the toast stack**, the UI must reveal **all active alerts** (expanded view).
- Must remain mounted across route changes.

**Placement:**
- Must be mounted once at the application shell level (e.g., `app/layout.tsx`) so it persists through navigation.

---

### AlertView (Individual Alert)
**Purpose:** A single toast alert instance.

**Props:**
- `id: string` (required)
- `title?: string`
- `description?: string`
- `content?: ReactNode | string` (optional, for richer UI)
- `toastOptions?: SonnerToastOptions` (optional)

**Integration Requirements:**
- Must pass through supported `sonner` toast options (e.g., duration, action buttons, close behavior), while maintaining `id` as the canonical identifier for state operations.

---

## Behavior Requirements

### Toast Stacking & Hover Expand
- Default: show stacked toasts in the **top-right**.
- On hover over the toast stack:
  - Expand to reveal **all active toast alerts**.
  - Collapse back when hover ends.

### Lifecycle
- Alerts must be removable by `id`.
- Alerts may auto-dismiss via `sonner` duration configuration.
- Alerts must be manually dismissible when configured via `sonner` options.
- Updating an existing alert by `id` must update the currently rendered toast.

---

## Data Requirements

### Models

#### `Alert` (canonical model)
- `id: string`
- `title?: string`
- `description?: string`
- `content?: ReactNode | string`
- `createdAt: number` (for deterministic ordering)
- `toastOptions?: SonnerToastOptions`

**Validation Rules:**
- `id` is required and must be unique among active alerts.
- `toastOptions` must be compatible with `sonner`.

---

## State Requirements

### AlertContext
**Purpose:** Global state accessible by all components.

**Requirements:**
- Must persist through page navigation (provider mounted at app shell).
- Must manage a collection of active alerts (single global list).
- Must expose actions:
  - `addAlert(alert: Alert): void`
  - `removeAlert(id: string): void`
  - `updateAlert(id: string, patch: Partial<Alert>): void`
  - (Optional) `clearAll(): void`

**State Rules:**
- Adding an alert with an existing `id` must either:
  - Replace the existing alert (recommended), or
  - Reject and no-op (must be explicitly defined if chosen).
- Ordering must be deterministic (recommended: `createdAt` descending).

---

## Hook Requirements

### `useAlert`
**Purpose:** Consumer hook providing a simple API into `AlertContext`.

**Requirements:**
- Must provide:
  - `addAlert`
  - `removeAlert`
  - `updateAlert`
- Must not require `position` or `displayType` (position is always top-right; display is always toast).
- Must throw or provide a clear error behavior if used outside of the `AlertProvider`.

**Suggested signature:**
- `addAlert(alert: Omit<Alert, "createdAt">): void`

---

## Factory Requirements

### AlertFactory
**Purpose:** Provide helper methods to generate alerts quickly without requiring callers to define all properties.

**General Requirements:**
- Must be exported as part of the Alerts feature public API (barrel export).
- Must generate alerts compatible with the canonical `Alert` model.
- Must apply sensible defaults for omitted fields:
  - If `id` is not provided, must generate a unique `id`.
  - Must set `createdAt` automatically.
  - Must provide default `toastOptions` appropriate to the factory method used.
- Must allow caller overrides for any generated values (e.g., title, description, content, toastOptions).
- Factory outputs must be safe to pass directly into `addAlert`.

#### `AlertFactory.autoDismissable(...)`
**Requirements:**
- Must return an `Alert` configured to **auto-dismiss**.
- Must set default `toastOptions.duration` to a non-zero value (implementation-defined).
- Must be manually dismissible only if explicitly enabled via overrides (implementation-defined), or:
  - If the design expects a visible close button, it may still be shown; the key requirement is that it will auto-dismiss.

**Suggested inputs (flexible):**
- `params?: { id?: string; title?: string; description?: string; content?: ReactNode | string; toastOptions?: SonnerToastOptions }`

#### `AlertFactory.dismissable(...)`
**Requirements:**
- Must return an `Alert` configured to **not auto-dismiss** by default.
- Must set default `toastOptions.duration` to “persistent” semantics (implementation-defined; commonly `Infinity` or omitted based on sonner behavior).
- Must include UI affordance to dismiss (e.g., close button) via toast options if supported/needed.

**Suggested inputs (flexible):**
- `params?: { id?: string; title?: string; description?: string; content?: ReactNode | string; toastOptions?: SonnerToastOptions }`

**Factory Consistency Rules:**
- Both factory methods must produce alerts that render identically through the existing `AlertsView`/`AlertView` pipeline.
- Factory override behavior must be deterministic (caller-provided options replace defaults).

---

## Accessibility Requirements
- Toast alerts should be announced via appropriate ARIA live region behavior (prefer what `sonner` provides).
- All interactive controls (close, actions) must be keyboard accessible.

---

## Error Handling & Edge Cases
- Removing a non-existent `id` must no-op safely.
- Updating a non-existent `id` must no-op (recommended) or create it (if chosen, must be documented).
- High alert volume should be handled gracefully (optional: enforce a maximum number of active toasts).

---

## Testing Requirements
- Unit tests:
  - add/remove/update behavior, deterministic ordering.
  - `AlertFactory.autoDismissable` sets auto-dismiss defaults.
  - `AlertFactory.dismissable` sets persistent + dismissible defaults.
  - Factory override behavior (caller-provided options replace defaults).
- Component tests:
  - `AlertsView` renders above app content.
  - Toast stack expands on hover to reveal all active alerts.
- Hook tests:
  - `useAlert` returns context actions and mutates state correctly.

---

## Suggested Feature Directory Structure
```text
alerts/
├── api/
│   ├── models/
│   │   └── alert.ts
│   └── logic/
│       ├── alert-factory.ts
│       └── alert-reducer-helpers.ts
├── components/
│   ├── alerts-view/
│   │   ├── alerts-view.tsx
│   │   ├── alerts-view-loading.tsx
│   │   ├── alerts-view-errored.tsx
│   │   ├── alerts-view-empty.tsx
│   │   └── index.ts
│   ├── alert-view/
│   │   ├── alert-view.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── use-alert.ts
│   └── __tests__/
├── contexts/
│   └── alert-context/
│       ├── alert-context.tsx
│       ├── alert-provider.tsx
│       ├── alert-state.ts
│       ├── alert-actions.ts
│       ├── alert-reducer.ts
│       └── __tests__/
└── index.ts
```

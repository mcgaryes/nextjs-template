## Feature: Site Navigation

### Goal
Provide a persistent, app-wide navigation bar that lives in the main layout, supports expanded/collapsed modes, and gives users consistent access to page routes plus their profile entry point.

---

## Directory structure

```
features/site-navigation/
├── api/
│   ├── logic/
│   │   ├── build-navigation-items.ts
│   │   └── resolve-active-nav-item.ts
│   └── models/
│       ├── navigation-item.ts
│       └── navigation-state.ts
├── components/
│   ├── app-navigation/
│   │   ├── app-navigation.tsx
│   │   ├── app-navigation-loading.tsx
│   │   ├── app-navigation-errored.tsx
│   │   ├── app-navigation-empty.tsx
│   │   └── index.ts
│   ├── nav-logo/
│   │   ├── nav-logo.tsx
│   │   └── index.ts
│   ├── nav-link-item/
│   │   ├── nav-link-item.tsx
│   │   └── index.ts
│   ├── nav-links-list/
│   │   ├── nav-links-list.tsx
│   │   └── index.ts
│   ├── nav-collapse-toggle/
│   │   ├── nav-collapse-toggle.tsx
│   │   └── index.ts
│   ├── nav-profile-card/
│   │   ├── nav-profile-card.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── use-navigation-state.ts
│   ├── use-navigation-items.ts
│   └── __tests__/
│       ├── use-navigation-state.test.ts
│       └── use-navigation-items.test.ts
└── contexts/
    └── navigation-context/
        ├── navigation-context.tsx
        ├── navigation-provider.tsx
        ├── navigation-state.ts
        ├── navigation-actions.ts
        ├── navigation-reducer.ts
        └── __tests__/
            └── navigation-reducer.test.ts
```

---

## UI requirements

### 1. Layout integration
**Component:** `AppNavigation`

- The navigation bar **must be rendered from the main application layout** (e.g., `app/layout.tsx` or equivalent shared layout wrapper).
- Layout must be a **flex container**:
  - Navigation bar occupies the left side.
  - Main content occupies the remaining space.
- Navigation must be **persistent across route changes** (does not remount on navigation unless layout remounts).

**Acceptance criteria**
- Navigation appears on every page that uses the main app layout.
- Navigation and content display side-by-side with flex.

---

### 2. Expand / collapse behavior
**Component:** `NavCollapseToggle` + state controlled by NavigationContext

- Navigation has two states:
  - `expanded` (default)
  - `collapsed`
- A toggle button must exist at the **bottom-left** of the navigation bar.
- Clicking the toggle button must switch between states.

**Expanded state**
- Shows:
  - Full logo / site name at top
  - Icons + labels for all navigation links
  - Profile card shows avatar + user name + right chevron

**Collapsed state**
- Shows:
  - **Only icons** for navigation links (labels hidden)
  - Logo area is replaced with **compact iconography**:
    - Either a brand icon, or the **first letter** of the site name (fallback)
  - Profile card becomes compact:
    - Avatar remains visible
    - User name hidden
    - Chevron may remain (optional), but click affordance must still be clear

**Acceptance criteria**
- Default state on first render is expanded.
- Collapsing hides labels and replaces logo with a compact representation.
- Collapsed navigation still supports clicking each nav item and profile card.

---

### 3. Logo / site identity
**Component:** `NavLogo`

- Top section must include either:
  - A site logo image, **or**
  - The site name as text
- In collapsed mode, logo area must render a compact representation:
  - Preferred: logo icon
  - Fallback: first letter of site name (uppercase)

**Acceptance criteria**
- Expanded shows full identity (logo or name).
- Collapsed shows compact identity.

---

### 4. Navigation links list
**Components:** `NavLinksList`, `NavLinkItem`

- Under the logo, render a vertical list of navigation links.
- Each link must include:
  - `icon` on the left
  - `label` on the right (hidden in collapsed mode)
- Layout:
  - Use a flex row within each item (`icon` left, `label` right).
- Links must be keyboard accessible and clickable.

**Active state**
- The current route should be visually indicated as active (e.g., background highlight or accent border).
- Active detection should be based on the current pathname.

**Disabled state (optional but recommended)**
- Allow a nav item to be disabled (non-clickable, visually muted) via model property.

**Acceptance criteria**
- Each item displays icon + label in expanded mode.
- Each item displays icon only in collapsed mode.
- The active route is clearly indicated.

---

### 5. Profile card
**Component:** `NavProfileCard`

- Bottom section of navigation bar must render a profile card containing:
  - Current user avatar
  - Current user name
  - Chevron icon on the right indicating clickability
- Clicking the profile card triggers a navigation or action (implementation dependent), but must provide:
  - `onClick` handler support, or
  - `href` support to route to a profile/account page.

**Collapsed mode**
- Must still render avatar.
- Must hide the name.

**Acceptance criteria**
- Profile card appears pinned to the bottom.
- It is clickable and has a chevron indicator.
- Collapsed mode hides name but keeps functionality.

---

## State and behavior requirements

### Navigation state
**Context:** `NavigationProvider`

- State must include:
  - `isCollapsed: boolean`
- Actions must include:
  - `TOGGLE_COLLAPSE`
  - `SET_COLLAPSED(boolean)` (for programmatic control)

**Persistence (recommended)**
- Persist `isCollapsed` in `localStorage` so user preference survives reloads.
- If persistence is used:
  - On initial load, read from storage.
  - If no stored value exists, default to expanded.

**Acceptance criteria**
- Toggling updates UI immediately.
- If persistence is enabled, refresh maintains last state.

---

## Data model requirements

### NavigationItem model
**File:** `api/models/navigation-item.ts`

```ts
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode; // or a typed icon key if you standardize icons
  isDisabled?: boolean;
  match?: 'exact' | 'prefix'; // optional, for active route matching
}
```

### Navigation state model
**File:** `api/models/navigation-state.ts`

```ts
export interface NavigationState {
  isCollapsed: boolean;
}
```

---

## Hook requirements

### `useNavigationState`
- Provides:
  - `isCollapsed`
  - `toggle()`
  - `setCollapsed(value: boolean)`

### `useNavigationItems`
- Provides the list of `NavigationItem`s.
- Should allow either:
  - items passed in as props from the layout, or
  - items sourced from a centralized config (recommended).

---

## Component requirements

### `AppNavigation` (container)
Responsibilities:
- Renders:
  - `NavLogo`
  - `NavLinksList`
  - `NavProfileCard`
  - `NavCollapseToggle`
- Controls layout spacing so that:
  - links occupy the middle
  - profile + toggle remain at the bottom (e.g., using `flex-col` with `mt-auto`)

States:
- Loading: show skeleton (`app-navigation-loading.tsx`) if user or nav config is loading
- Error: show errored component if critical data fails
- Empty: show empty state if there are zero navigation items (unlikely but handled)

---

## Styling and accessibility requirements

### Accessibility
- All interactive elements must be keyboard navigable:
  - Links reachable via Tab
  - Toggle button reachable via Tab
  - Profile card reachable via Tab
- Toggle button must include:
  - `aria-label` describing action (e.g., “Collapse navigation” / “Expand navigation”)
- Collapsed mode must still provide label access:
  - Use `title` attribute and/or tooltip on hover/focus for each icon-only link.

### Responsive behavior (baseline)
- Navigation must not overlap content.
- Collapsed mode must reduce width significantly compared to expanded mode.

---

## Testing requirements

### Unit tests
- `navigation-reducer.test.ts`
  - toggles collapse state correctly
  - setCollapsed sets correct value
- `resolve-active-nav-item.test.ts` (if implemented)
  - active matching works for exact/prefix logic

### Component tests
- `AppNavigation` renders expected sections (logo, links, profile, toggle)
- Collapsed state hides labels and name
- Toggle button changes state and DOM updates accordingly

---

## Integration requirements

### Main layout integration
- Layout must wrap the app with `NavigationProvider`.
- Layout must render `AppNavigation` as the left-side element of a flex row layout.

**Acceptance criteria**
- Any page using the main layout automatically has navigation present without additional work.

---

## Out of scope (explicit)
- Role-based visibility rules for navigation items (can be added later).
- Nested nav groups / accordion sections.
- Multi-level route breadcrumbs.

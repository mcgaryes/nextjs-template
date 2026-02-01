---
name: scaffold-component
description: Scaffolds a presentational React component in an existing feature module at features/<feature>/components/<component>/. Optionally generates state variants (loading, empty, errored, view). Uses shadcn/ui primitives by default for common UI patterns.
after: ./scripts/after-scaffold-component.sh features/<feature>/components/<component>
---

# Scaffold Component

## Scope and terminology

- Feature module: `features/<feature>/`
- Component directory: `features/<feature>/components/<component>/`
- State variants: `loading`, `empty`, `errored`, `view`, `server`

## Guardrails

- Components scaffolded by this Skill are presentational: render UI from props and may use UI-only local state.
- Do not add data-fetching hooks (`useQuery`, `useSWR`, etc.) inside presentational components.

## Server action colocation

**Prefer colocating server actions with the server component that uses them.** Define `getData` and other server actions directly in the `-server.tsx` file rather than passing them as props.

### When to colocate (default)

Keep server actions in the `-server.tsx` file when:
- The action is specific to this component
- The data fetching logic is straightforward
- The component is the only consumer of the action

### When to extract

Move server actions elsewhere when:
- **Shared across components**: Multiple components need the same data-fetching logic
- **Complex business logic**: The action involves significant business rules that belong in `features/<feature>/api/logic/`
- **Reusable mutations**: Form submissions or mutations used by multiple components
- **Testing requirements**: The logic needs isolated unit testing

### Placement when extracted

- **Feature-specific**: `features/<feature>/api/logic/{action-name}.ts`
- **Shared across features**: `lib/actions/{action-name}.ts`

## shadcn-first approach

**Always use shadcn/ui primitives** for common UI patterns. Do not use raw HTML elements or custom styles when a shadcn primitive exists.

### Auto-inferred primitives

Automatically install and use these primitives based on component semantics:

| Pattern | Primitive | Trigger keywords/patterns |
|---------|-----------|---------------------------|
| Card container | `card` | "card" in name, bordered container, panel-like layout |
| Avatar | `avatar` | "avatar", "profile", "user" + image display |
| Skeleton loading | `skeleton` | `loading` variant selected |
| Retry button | `button` | `errored` variant selected |

### Installation

Install primitives via:
```bash
npx shadcn@latest add <component> --yes
```

Install all inferred primitives before generating files.

## Placeholder Image Services

When scaffolding components that display images, use these placeholder services for demo/mock data:

### Avatars (Pravatar)
- URL: `https://i.pravatar.cc/{size}?u={unique-id}`
- Example: `https://i.pravatar.cc/150?u=user@example.com`
- The `u` parameter ensures consistent avatar for the same identifier

### General Images (placehold.co)
- URL: `https://placehold.co/{width}x{height}`
- With colors: `https://placehold.co/{width}x{height}/{bg-color}/{text-color}`
- Example: `https://placehold.co/400x300` or `https://placehold.co/400x300/png`

## Workflow checklist
1. Collect inputs (component name, feature, variants)
2. Validate component name (kebab-case)
3. Resolve target feature module under features/
4. Select state variants
5. Infer shadcn/ui primitives from component semantics
6. Install all inferred primitives
7. Create component directory and files from templates
8. Update index.ts exports
9. Run post-scaffold script (lint + format)
10. Verify files exist and summarize outputs

### 1. Collect inputs

- Component name comes from `$ARGUMENTS` (kebab-case).
- If missing, prompt for a kebab-case name (example: `user-profile-card`).

### 2. Validate component name

Accept only:
- lowercase letters and hyphens
- not starting/ending with `-`
- not empty

If invalid, explain why and re-prompt.

### 3. Resolve target feature module (`features/`)

- List directories under `features/`.
- If none: direct the user to create a feature module first.
- If one: confirm it is the target.
- If multiple: ask which feature module to use.

### 4. Select state variants

Offer:
- `loading` - Loading/skeleton state (uses `skeleton` primitive)
- `empty` - Empty state when no data
- `errored` - Error state with retry action (uses `button` primitive)
- `view` - Presentational variant with UI-only local state
- `server` - Async server component wrapper with Suspense streaming (for Next.js App Router)

**Inference rules for `server` variant:**
Auto-select `server` when the user mentions any of:
- "server", "async", "suspense", "streaming", "data fetching", "server-side", "RSC", "server component"
- Both `loading` variant AND mentions fetching data

**Dependency:** If `server` is selected, automatically include `loading` (required for Suspense fallback).

### 5. Infer shadcn/ui primitives

Analyze the component name and user request to infer required primitives:

**Card** - Install when:
- Component name contains "card" (e.g., `user-profile-card`, `product-card`)
- User describes a "panel", "box", or "container" with borders/shadows
- Component has a distinct bounded layout

**Avatar** - Install when:
- Component name contains "avatar", "profile", or "user"
- User describes displaying a user image, profile picture, or initials
- Component involves user/person representation

**Skeleton** - Install when:
- `loading` variant is selected
- Always use Skeleton for loading states (never plain text)

**Button** - Install when:
- `errored` variant is selected (for retry action)
- User explicitly mentions buttons or actions

### 6. Install inferred primitives

Install all inferred primitives before generating files:

```bash
npx shadcn@latest add card avatar skeleton button --yes
```

Only install what's needed. If the shadcn MCP server is available and shows Connected in /mcp, use it to install primitives directly.

### 7. Generate files from templates

Create directory:
`features/<feature>/components/<component>/`

Always create:
- `<component>.tsx`
- `index.ts`

Conditionally create:
- `<component>-loading.tsx` (uses Skeleton)
- `<component>-empty.tsx`
- `<component>-errored.tsx` (uses Button for retry)
- `<component>-view.tsx`
- `<component>-server.tsx` (requires `loading` variant)

Templates live in: [TEMPLATES.md](TEMPLATES.md)

### 8. Update exports (`index.ts`)

Export:
- base component + props
- each generated variant + props (where applicable)

### 9. Run post-scaffold script

Run the after-scaffold script to lint and format the generated files:
```bash
./scripts/after-scaffold-component.sh features/<feature>/components/<component>
```

### 10. Verify and summarize

- Verify expected files exist.
- Print a tree of created files + next steps.
- List the shadcn primitives that were installed.

## Reference material

- Templates: [TEMPLATES.md](TEMPLATES.md)
- Examples: [EXAMPLES.md](EXAMPLES.md)

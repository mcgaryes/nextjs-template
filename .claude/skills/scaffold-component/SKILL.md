---
name: scaffold-component
description: Scaffolds a presentational React component in an existing feature module at features/<feature>/components/<component>/. Optionally generates state variants (loading, empty, errored, view). Uses shadcn/ui primitives when requested, but does not require any specific primitive by default.
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

## Dependencies (do not assume installed)

If the user request implies specific shadcn/ui primitives (e.g., “wrap in Card”, “use Skeleton”, “use Button”), install them via:
- `npx shadcn@latest add <component> --yes`

Do not install primitives that are not explicitly needed.

## Workflow checklist
1. Collect inputs (component name, feature, variants)
2. Validate component name (kebab-case)
3. Resolve target feature module under features/
4. Select state variants
5. Determine any explicitly requested shadcn/ui primitives
6. Verify/install only the requested primitives (if needed)
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
- `loading` - Loading/skeleton state
- `empty` - Empty state when no data
- `errored` - Error state with optional retry action
- `view` - Presentational variant with UI-only local state
- `server` - Async server component wrapper with Suspense streaming (for Next.js App Router)

**Inference rules for `server` variant:**
Auto-select `server` when the user mentions any of:
- "server", "async", "suspense", "streaming", "data fetching", "server-side", "RSC", "server component"
- Both `loading` variant AND mentions fetching data

**Dependency:** If `server` is selected, automatically include `loading` (required for Suspense fallback).

### 5. Determine explicitly requested shadcn/ui primitives

Only consider primitives “required” if the user request explicitly asks for them.

Examples:
- “Wrap in Card” → `card`
- “Use Skeleton for loading” → `skeleton`
- “Add a Retry Button” → `button`

### 6. Verify/install only the requested primitives

If the shadcn MCP server is available and shows Connected in /mcp, use it to install requested primitives (card/skeleton/button) directly. Otherwise, install `via npx shadcn@latest add <primitive> --yes`.

### 7. Generate files from templates

Create directory:
`features/<feature>/components/<component>/`

Always create:
- `<component>.tsx`
- `index.ts`

Conditionally create:
- `<component>-loading.tsx`
- `<component>-empty.tsx`
- `<component>-errored.tsx`
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

## Reference material

- Templates: [TEMPLATES.md](TEMPLATES.md)
- Examples: [EXAMPLES.md](EXAMPLES.md)
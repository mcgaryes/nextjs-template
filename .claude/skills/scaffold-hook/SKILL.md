---
name: scaffold-hook
description: Scaffold a new custom React hook inside an existing feature module, with templates for data fetching, state management, or utility hooks, and update the feature hooks barrel export.
---

# Scaffold Hook

Scaffold a new custom React hook within an existing feature module.

## Scope and terminology

- Feature module: `features/<feature>/`
- Hooks directory: `features/<feature>/hooks/`
- Hook file: `use-{hook-name}.ts`
- Hook categories: Data Fetching, State Management, Utility

## Guardrails

- Hooks must include `"use client"` directive for client-side usage.
- Export params and return value interfaces for type safety.
- Do not include business logic that belongs in API logic layer.

## Workflow checklist

1. Parse hook name from `$ARGUMENTS`
2. Validate hook name (kebab-case)
3. Select target feature module under features/
4. Ask hook category (Data Fetching, State Management, Utility)
5. Ensure hooks directory exists
6. Generate hook file from template
7. Update barrel exports
8. Output summary with next steps

### 1. Parse hook name

- Hook name comes from `$ARGUMENTS` (kebab-case).
- If missing, prompt for a kebab-case name (example: `user-profile`).

### 2. Validate hook name

Accept only:
- lowercase letters and hyphens
- not starting/ending with `-`
- not empty

If invalid, explain why and re-prompt.

### 3. Select target feature module (`features/`)

- List directories under `features/`.
- If none: direct the user to create a feature module first.
- If one: confirm it is the target.
- If multiple: ask which feature module to use.

### 4. Ask hook category

Offer three options:
- **Data Fetching (Recommended)** - useSWR pattern with loading/error states and refresh capability
- **State Management** - useState/useReducer pattern for local or shared state
- **Utility** - Reusable logic hook like useDebounce or useLocalStorage

### 5. Ensure hooks directory exists

Check if `features/{feature-name}/hooks/` exists. If not, create it.

### 6. Generate hook file from template

Create file:
`features/{feature}/hooks/use-{hook-name}.ts`

Use appropriate template based on selected category.

Templates live in: [TEMPLATES.md](TEMPLATES.md)

### 7. Update barrel exports

Update `features/{feature}/hooks/index.ts`:
- If file exists, append new exports
- If file doesn't exist, create it with exports
- For State Management hooks, also export the State type

### 8. Output summary

After creating all files, output:
- Tree of created/updated files
- Hook type selected
- Next steps (update interfaces, implement logic, add tests)

## Naming conventions

| Input (kebab) | PascalCase | Function Name |
|---------------|------------|---------------|
| `user-profile` | `UserProfile` | `useUserProfile` |
| `form-draft` | `FormDraft` | `useFormDraft` |

File naming:
| Element | Format | Example |
|---------|--------|---------|
| Hook file | `use-{hook-name}.ts` | `use-user-profile.ts` |
| Hook function | `use{HookName}` | `useUserProfile` |
| Params interface | `Use{HookName}Params` | `UseUserProfileParams` |
| Return interface | `Use{HookName}ReturnValue` | `UseUserProfileReturnValue` |
| State interface | `Use{HookName}State` | `UseUserProfileState` |

## Reference material

- Templates: [TEMPLATES.md](TEMPLATES.md)
- Examples: [EXAMPLES.md](EXAMPLES.md)

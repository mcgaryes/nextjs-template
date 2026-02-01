---
name: scaffold-feature
description: Scaffold a new feature module with the standard directory structure and optional API, components, hooks, and context boilerplate.
after: ./scripts/after-scaffold-feature.sh features/<feature>
---

# Scaffold Feature

Scaffold a new feature module with the standard directory structure and boilerplate files.

## Scope and terminology

- Features directory: `features/`
- Feature module: `features/<feature>/`
- Modules: api/models, api/logic, components, hooks, contexts

## Guardrails

- Features are self-contained domain modules.
- Each module directory includes an `index.ts` barrel file with guidance comments.
- Do not create empty directories without barrel files.

## Workflow checklist

1. Parse feature name from `$ARGUMENTS`
2. Validate feature name (kebab-case)
3. Ask which modules to include (API layer, UI layer)
4. Generate directory structure with barrel files
5. Output summary with next steps

### 1. Parse feature name

- Feature name comes from `$ARGUMENTS` (kebab-case).
- If missing, prompt for a kebab-case name (example: `user-management`).

### 2. Validate feature name

Accept only:
- lowercase letters and hyphens
- not starting/ending with `-`
- not empty

If invalid, explain why and re-prompt.

### 3. Ask which modules to include

Use multi-select questions for two layers:

**API Layer:**
- **API Models** - TypeScript types, interfaces, enums, and constants
- **API Logic** - Server-side business logic and data fetching functions

**UI Layer:**
- **Components** - React UI components with loading, empty, and error states
- **Hooks** - Custom React hooks for data fetching and state management
- **Contexts** - React Context + useReducer for complex shared state

### 4. Generate directory structure

Create the feature directory at `features/{feature-name}/`.

For each selected module, create subdirectory with `index.ts` barrel file.

Templates live in: [TEMPLATES.md](TEMPLATES.md)

### 5. Output summary

After creating all files, output:
- Tree of created directories and files
- Next steps based on selected modules

## Naming conventions

| Input (kebab) | Title Case |
|---------------|------------|
| `user-management` | `User Management` |
| `auth` | `Auth` |

Conversion: Split on hyphens, capitalize first letter of each word, join with spaces.

## Reference material

- Templates: [TEMPLATES.md](TEMPLATES.md)
- Examples: [EXAMPLES.md](EXAMPLES.md)

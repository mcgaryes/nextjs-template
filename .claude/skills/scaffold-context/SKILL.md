---
name: scaffold-context
description: Scaffold a new React Context module inside an existing feature using the Context + useReducer pattern (state, actions, reducer, context, provider, and barrel exports).
after: ./scripts/after-scaffold-context.sh features/<feature>/contexts/<context>
---

# Scaffold Context

Scaffold a new React Context module within an existing feature, following the Context + useReducer pattern.

## Scope and terminology

- Feature module: `features/<feature>/`
- Context directory: `features/<feature>/contexts/<context>/`
- Context files: state, actions, reducer, context, provider, index

## Guardrails

- Contexts use the useReducer pattern for predictable state management.
- Do not add data-fetching logic inside context providers; use hooks for that.

## Workflow checklist

1. Parse context name from `$ARGUMENTS`
2. Validate context name (kebab-case)
3. Select target feature module under features/
4. Ensure contexts directory exists
5. Generate context files from templates
6. Output summary with next steps

### 1. Parse context name

- Context name comes from `$ARGUMENTS` (kebab-case).
- If missing, prompt for a kebab-case name (example: `voice-recorder`).

### 2. Validate context name

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

### 4. Ensure contexts directory exists

Check if `features/{feature-name}/contexts/` exists. If not, create it along with an `index.ts` barrel file using the template from TEMPLATES.md.

### 5. Generate context files from templates

Create directory:
`features/{feature}/contexts/{context}/`

Generate 6 files:
- `{context-name}-state.tsx`
- `{context-name}-actions.tsx`
- `{context-name}-reducer.tsx`
- `{context-name}-context.tsx`
- `{context-name}-provider.tsx`
- `index.ts`

Templates live in: [TEMPLATES.md](TEMPLATES.md)

### 6. Output summary

After creating all files, output:
- Tree of created files
- Next steps (customize state, add actions, create companion hook)

## Naming conventions

| Input (kebab) | PascalCase | camelCase |
|---------------|------------|-----------|
| `voice-recorder` | `VoiceRecorder` | `voiceRecorder` |
| `user-auth` | `UserAuth` | `userAuth` |

Conversion rules:
1. Split on hyphens
2. For PascalCase: capitalize first letter of each word, join without separators
3. For camelCase: lowercase first word, capitalize first letter of subsequent words, join without separators

## Reference material

- Templates: [TEMPLATES.md](TEMPLATES.md)
- Examples: [EXAMPLES.md](EXAMPLES.md)

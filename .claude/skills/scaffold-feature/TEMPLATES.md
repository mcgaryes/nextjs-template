# Templates

Placeholders:
- `{feature-name}` = kebab-case (e.g., `user-management`)
- `{Feature Name}` = Title Case with spaces (e.g., `User Management`)

---

## API Models: `api/models/index.ts`

```typescript
// {Feature Name} Models
//
// Add your TypeScript interfaces, types, enums, and constants here.
//
// Naming conventions:
// - {entity}.ts - Interface definitions (e.g., user.ts)
// - {entity}-type.ts - Enum definitions (e.g., user-type.ts)
// - {feature}-constants.ts - Constants (e.g., dashboard-constants.ts)
```

---

## API Logic: `api/logic/index.ts`

```typescript
// {Feature Name} Logic
//
// Add your server-side business logic and data fetching functions here.
// Use `import "server-only"` for functions that access secrets or APIs.
//
// Naming conventions:
// - get-{resource}.ts - Fetch single resource
// - get-all-{resources}.ts - Fetch collections
// - {action}-{resource}.ts - Mutations (e.g., delete-session.ts)
```

---

## Components: `components/index.ts`

```typescript
// {Feature Name} Components
//
// Add your React components here. Each component should have its own directory:
//
// components/
// └── {component-name}/
//     ├── {component-name}.tsx         - Main component (orchestrator)
//     ├── {component-name}-view.tsx    - View component (optional)
//     ├── {component-name}-loading.tsx - Loading/skeleton state
//     ├── {component-name}-empty.tsx   - Empty state
//     ├── {component-name}-errored.tsx - Error state
//     └── index.ts                     - Barrel exports
```

---

## Hooks: `hooks/index.ts`

```typescript
// {Feature Name} Hooks
//
// Add your custom React hooks here.
//
// Naming conventions:
// - use-{feature}-{purpose}.ts (e.g., use-user-profile.ts)
// - Always include "use client" directive
// - Export params and return value interfaces
```

---

## Contexts: `contexts/index.ts`

```typescript
// {Feature Name} Contexts
//
// Add your React Context modules here. Each context should have its own directory:
//
// contexts/
// └── {context-name}/
//     ├── {context-name}-state.tsx    - State interface and initial values
//     ├── {context-name}-actions.tsx  - Action types and interfaces
//     ├── {context-name}-reducer.tsx  - Reducer function
//     ├── {context-name}-context.tsx  - React Context creation
//     └── {context-name}-provider.tsx - Provider component
```

# Examples

## Example 1: Full feature with all modules

Input:
- feature: `user-management`
- modules: API Models, API Logic, Components, Hooks, Contexts

Output:
```text
features/user-management/
├── api/
│   ├── logic/
│   │   └── index.ts
│   └── models/
│       └── index.ts
├── components/
│   └── index.ts
├── contexts/
│   └── index.ts
└── hooks/
    └── index.ts
```

---

## Example 2: API-only feature

Input:
- feature: `analytics`
- modules: API Models, API Logic

Output:
```text
features/analytics/
└── api/
    ├── logic/
    │   └── index.ts
    └── models/
        └── index.ts
```

Use case: Backend-focused features that provide data to other features but have no dedicated UI.

---

## Example 3: UI-only feature

Input:
- feature: `dashboard`
- modules: Components, Hooks

Output:
```text
features/dashboard/
├── components/
│   └── index.ts
└── hooks/
    └── index.ts
```

Use case: Features that consume data from other features' APIs but need their own UI components and hooks.

---

## Example 4: Minimal feature

Input:
- feature: `settings`
- modules: Components

Output:
```text
features/settings/
└── components/
    └── index.ts
```

Use case: Simple features that only need UI components, typically for static or configuration pages.

---

## Module Selection Guide

| Module | When to Include |
|--------|-----------------|
| **API Models** | Feature defines its own data types, interfaces, or enums |
| **API Logic** | Feature fetches data from external APIs or databases |
| **Components** | Feature has UI elements to render |
| **Hooks** | Feature needs data fetching or state management hooks |
| **Contexts** | Feature has complex shared state across multiple components |

Common combinations:
- **Full-stack feature**: All modules
- **Data service**: API Models + API Logic
- **UI feature**: Components + Hooks
- **Shared state feature**: Components + Hooks + Contexts

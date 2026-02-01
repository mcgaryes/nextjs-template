# Examples

## Example 1: Base component only

Input:
- component: `user-profile-card`
- feature: `users`
- variants: none

Output:
```text
features/users/components/user-profile-card/
├── user-profile-card.tsx
└── index.ts
```

---

## Example 2: Loading + Errored (defaults, no required primitives)

Input:
- component: `billing-summary`
- feature: `billing`
- variants: `loading, errored`

Output:
```text
features/billing/components/billing-summary/
├── billing-summary.tsx
├── billing-summary-loading.tsx   # defaults to "Loading", optional indicator
├── billing-summary-errored.tsx   # defaults to "Error", optional action
└── index.ts
```

---

## Example 3: Prompt requests a Skeleton and Retry Button (install only when asked)

If the user request says:
- "Use a Skeleton for loading"
- "Add a Retry Button"

Then infer requested primitives:
- `skeleton`
- `button`

And (if missing) install:
- `npx shadcn@latest add skeleton --yes`
- `npx shadcn@latest add button --yes`

The scaffolded files still keep these as optional props:
- `Loading` accepts `indicator?: ReactNode`
- `Errored` accepts `action?: ReactNode`

Example usage (illustrative):

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BillingSummaryLoading, BillingSummaryErrored } from "@/features/billing/components/billing-summary";

export function BillingSummaryContainer() {
  return (
    <>
      <BillingSummaryLoading indicator={<Skeleton className="h-4 w-full" />} />
      <BillingSummaryErrored action={<Button variant="outline">Retry</Button>} />
    </>
  );
}
```

---

## Example 4: View variant stays presentational

Input:
- component: `alerts-panel`
- feature: `alerts`
- variants: `view`

Output:
```text
features/alerts/components/alerts-panel/
├── alerts-panel.tsx
├── alerts-panel-view.tsx
└── index.ts
```

Notes:
- `alerts-panel-view.tsx` must not fetch data.
- It may use UI-only local state (hover, focus, open/closed).

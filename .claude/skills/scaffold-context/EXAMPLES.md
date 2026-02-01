# Examples

## Example 1: Basic context creation

Input:
- context: `voice-recorder`
- feature: `audio`

Output:
```text
features/audio/contexts/voice-recorder/
├── voice-recorder-state.tsx
├── voice-recorder-actions.tsx
├── voice-recorder-reducer.tsx
├── voice-recorder-context.tsx
├── voice-recorder-provider.tsx
└── index.ts
```

---

## Example 2: Context with companion hook suggestion

Input:
- context: `shopping-cart`
- feature: `checkout`

Output:
```text
features/checkout/contexts/shopping-cart/
├── shopping-cart-state.tsx
├── shopping-cart-actions.tsx
├── shopping-cart-reducer.tsx
├── shopping-cart-context.tsx
├── shopping-cart-provider.tsx
└── index.ts
```

Next steps suggest creating a companion hook:

```typescript
// features/checkout/hooks/use-shopping-cart.ts
import { useContext } from "react";
import { ShoppingCartContext } from "../contexts/shopping-cart";
import { ShoppingCartActionType } from "../contexts/shopping-cart";

export function useShoppingCart() {
  const { state, dispatch } = useContext(ShoppingCartContext);

  const addItem = (item: CartItem) => {
    dispatch({ type: ShoppingCartActionType.addItem, payload: item });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: ShoppingCartActionType.removeItem, payload: itemId });
  };

  return {
    ...state,
    addItem,
    removeItem,
  };
}
```

---

## Example 3: Multi-word context name (naming conversions)

Input:
- context: `user-auth-session`
- feature: `authentication`

Naming conversions applied:

| Format | Value |
|--------|-------|
| kebab-case | `user-auth-session` |
| PascalCase | `UserAuthSession` |
| camelCase | `userAuthSession` |

Output files use these conversions:
- `user-auth-session-state.tsx` exports `UserAuthSessionState` and `userAuthSessionInitialState`
- `user-auth-session-actions.tsx` exports `UserAuthSessionActionType` and `UserAuthSessionAction`
- `user-auth-session-reducer.tsx` exports `userAuthSessionReducer`
- `user-auth-session-context.tsx` exports `UserAuthSessionContext`
- `user-auth-session-provider.tsx` exports `UserAuthSessionProvider`

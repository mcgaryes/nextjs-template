# Templates

Placeholders:
- `{context-name}` = kebab-case (e.g., `voice-recorder`)
- `{ContextName}` = PascalCase (e.g., `VoiceRecorder`)
- `{contextName}` = camelCase (e.g., `voiceRecorder`)

---

## State: `{context-name}-state.tsx`

```typescript
export interface {ContextName}State {
  // Add your state properties here
  isLoading: boolean;
  error?: string;
}

export const {contextName}InitialState: {ContextName}State = {
  isLoading: false,
  error: undefined,
};
```

---

## Actions: `{context-name}-actions.tsx`

```typescript
export enum {ContextName}ActionType {
  setLoading = "SET_LOADING",
  setError = "SET_ERROR",
  reset = "RESET",
}

export interface SetLoadingAction {
  type: {ContextName}ActionType.setLoading;
  payload: boolean;
}

export interface SetErrorAction {
  type: {ContextName}ActionType.setError;
  payload: string | undefined;
}

export interface ResetAction {
  type: {ContextName}ActionType.reset;
}

export type {ContextName}Action =
  | SetLoadingAction
  | SetErrorAction
  | ResetAction;
```

---

## Reducer: `{context-name}-reducer.tsx`

```typescript
import { type {ContextName}State, {contextName}InitialState } from "./{context-name}-state";
import { type {ContextName}Action, {ContextName}ActionType } from "./{context-name}-actions";

export function {contextName}Reducer(
  state: {ContextName}State,
  action: {ContextName}Action
): {ContextName}State {
  switch (action.type) {
    case {ContextName}ActionType.setLoading:
      return {
        ...state,
        isLoading: action.payload,
      };

    case {ContextName}ActionType.setError:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case {ContextName}ActionType.reset:
      return {contextName}InitialState;

    default:
      return state;
  }
}
```

---

## Context: `{context-name}-context.tsx`

```typescript
import { createContext, type Dispatch } from "react";
import { type {ContextName}State, {contextName}InitialState } from "./{context-name}-state";
import { type {ContextName}Action } from "./{context-name}-actions";

export const {ContextName}Context = createContext<{
  state: {ContextName}State;
  dispatch: Dispatch<{ContextName}Action>;
}>({
  state: {contextName}InitialState,
  dispatch: () => {},
});
```

---

## Provider: `{context-name}-provider.tsx`

```tsx
"use client";

import { useReducer, type ReactNode } from "react";
import { {ContextName}Context } from "./{context-name}-context";
import { {contextName}Reducer } from "./{context-name}-reducer";
import { type {ContextName}State, {contextName}InitialState } from "./{context-name}-state";

export interface {ContextName}ProviderProps {
  children: ReactNode;
  initialState?: Partial<{ContextName}State>;
}

export function {ContextName}Provider(props: {ContextName}ProviderProps) {
  const { children, initialState } = props;
  const [state, dispatch] = useReducer(
    {contextName}Reducer,
    { ...{contextName}InitialState, ...initialState }
  );

  return (
    <{ContextName}Context.Provider value={{ state, dispatch }}>
      {children}
    </{ContextName}Context.Provider>
  );
}
```

---

## Barrel: `index.ts`

```typescript
export { {ContextName}Context } from "./{context-name}-context";
export { {ContextName}Provider } from "./{context-name}-provider";
export type { {ContextName}ProviderProps } from "./{context-name}-provider";
export { {contextName}Reducer } from "./{context-name}-reducer";
export { type {ContextName}State, {contextName}InitialState } from "./{context-name}-state";
export {
  {ContextName}ActionType,
  type {ContextName}Action,
  type SetLoadingAction,
  type SetErrorAction,
  type ResetAction,
} from "./{context-name}-actions";
```

---

## Contexts Directory Barrel: `contexts/index.ts`

Created only if the contexts directory doesn't exist yet.

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

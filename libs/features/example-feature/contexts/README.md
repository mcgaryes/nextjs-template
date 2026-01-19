# Feature Contexts

A context is a state management module within a feature that uses React Context + useReducer to manage complex, shared
state. Contexts follow a predictable file structure that separates concerns across multiple files.

## Directory Structure

```
contexts/
└── {context-name}/
├── {context-name}-state.tsx      # State interface and initial values
├── {context-name}-actions.tsx    # Action types and interfaces
├── {context-name}-reducer.tsx    # Reducer function
├── {context-name}-context.tsx    # React Context creation
└── {context-name}-provider.tsx   # Provider component
```

---

## File Breakdown

### State File (-state.tsx)

Defines the shape of the state and its initial values.

```typescript
// voice-recorder-state.tsx

export interface VoiceRecorderState {
    audioFile: Blob | null;
    transcript: string;
    displayState: VoiceRecorderDisplayState;
    error?: string;
    recordingLength?: number;
}

export const voiceRecorderInitialState: VoiceRecorderState = {
    audioFile: null,
    transcript: "",
    displayState: VoiceRecorderDisplayState.record,
    recordingLength: 0,
};
```

Exports:

- `{ContextName}State` — TypeScript interface defining state shape
- `{contextName}InitialState` — Default state values

  ---

### Actions File (-actions.tsx)

Defines all possible actions that can modify state.

```typescript
// voice-recorder-actions.tsx

// Enum of all action types
export enum VoiceRecorderActionType {
    updateAudioFile = "UPDATE_AUDIO_FILE",
    updateTranscript = "UPDATE_TRANSCRIPT",
    reset = "RESET",
    handleError = "HANDLE_ERROR",
}

// Individual action interfaces
export interface UpdateAudioFileAction {
    type: VoiceRecorderActionType.updateAudioFile;
    payload: {
        blob: Blob;
        recordingLength: number;
    };
}

export interface ResetAction {
    type: VoiceRecorderActionType.reset;
    payload?: null;
}

// Union type of all actions
export type VoiceRecorderAction =
    | UpdateAudioFileAction
    | ResetAction
    | HandleErrorAction;
```

Exports:

- `{ContextName}ActionType` — Enum of action type constants
    - Individual action interfaces (one per action)
- `{ContextName}Action` — Union type of all actions

---

### Reducer File (-reducer.tsx)

Pure function that handles state transitions based on actions.

```typescript
// voice-recorder-reducer.tsx

export function voiceRecorderReducer(
    state: VoiceRecorderState,
    action: VoiceRecorderAction
): VoiceRecorderState {
    switch (action.type) {
        case VoiceRecorderActionType.updateAudioFile:
            return {
                ...state,
                audioFile: action.payload.blob,
                displayState: VoiceRecorderDisplayState.process,
            };

        case VoiceRecorderActionType.reset:
            return {
                ...state,
                transcript: null,
                audioFile: null,
                displayState: VoiceRecorderDisplayState.record,
            };

        // ... handle all action types
    }
}
```

Exports:

- `{contextName}Reducer` — Reducer function

Guidelines:

- Always return a new state object (immutable updates)
- Handle every action type in the switch statement
- Keep logic simple; complex operations belong in hooks or logic files

  ---

### Context File (-context.tsx)

Creates the React Context with proper typing.

```typescript
// voice-recorder-context.tsx

import {createContext, Dispatch} from "react";

export const VoiceRecorderContext = createContext<{
    state: VoiceRecorderState;
    dispatch: Dispatch<VoiceRecorderAction>;
}>({
    state: voiceRecorderInitialState,
    dispatch: FunctionUtils.noop,
});
```

Exports:

- `{ContextName}Context` — The React Context object

Note: The default value uses noop for dispatch since the real dispatch comes from the provider.

---

### Provider File (-provider.tsx)

React component that wraps children with the context provider.

```tsx
// voice-recorder-provider.tsx

"use client";

import {useReducer} from "react";

interface VoiceRecorderProviderProps {
    children: ReactNode;
    initialState?: Partial<VoiceRecorderState>;
}

export function VoiceRecorderProvider(props: VoiceRecorderProviderProps) {
    const {children, initialState} = props;
    const [state, dispatch] = useReducer(
        voiceRecorderReducer,
        {...voiceRecorderInitialState, ...initialState}
    );

    return (
        <VoiceRecorderContext.Provider value={{state, dispatch}}>
            {children}
        </VoiceRecorderContext.Provider>
    );
}
````

Exports:

- `{ContextName}Provider` — Provider component

Key patterns:

- Mark as "use client" for Next.js client components
- Accept optional initialState prop for flexibility
- Merge initial state with defaults using spread operator

  ---

## Usage Pattern

### Wrapping Components

```tsx
<VoiceRecorderProvider initialState={{userFlow: "voice_note"}}>
    <VoiceRecorderUI/>
</VoiceRecorderProvider>
```

### Consuming the Context

Create a custom hook in hooks/ for clean access:

```typescript
// hooks/use-voice-recorder.ts

export function useVoiceRecorder() {
    const {state, dispatch} = useContext(VoiceRecorderContext);

    const updateAudioFile = (blob: Blob, recordingLength: number) => {
        dispatch({
            type: VoiceRecorderActionType.updateAudioFile,
            payload: {blob, recordingLength},
        });
    };

    const reset = () => {
        dispatch({type: VoiceRecorderActionType.reset});
    };

    return {
        ...state,
        updateAudioFile,
        reset,
    };
}
```

---

## When to Use a Context

Use contexts when:

- State needs to be shared across multiple components in a subtree
- State changes are complex with multiple related values
- You need predictable state transitions via actions

Avoid contexts when:

- State is only used by one component (use useState)
- Data comes from a server (use hooks with SWR/React Query)
- State is simple and doesn't require actions (use useState)
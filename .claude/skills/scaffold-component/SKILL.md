# Scaffold Component

Scaffold a new component within an existing feature module.

## Usage

```
/scaffold-component <component-name>
```

Example: `/scaffold-component user-profile-card`

## Instructions

Follow these steps to scaffold a new component:

### Step 1: Parse Component Name

The component name is provided in `$ARGUMENTS`. If `$ARGUMENTS` is empty or missing, use `AskUserQuestion` to prompt:

```
What is the name of the component? (use kebab-case, e.g., user-profile-card)
```

### Step 2: Validate Component Name

Ensure the component name:
- Uses kebab-case (lowercase letters and hyphens only)
- Does not start or end with a hyphen
- Is not empty

If invalid, inform the user and ask for a valid name.

### Step 3: Select Target Feature

List all existing features by scanning `libs/features/` directory.

If no features exist, inform the user they need to create a feature first using `/scaffold-feature`.

If only one feature exists, confirm with the user that they want to add the component to that feature.

If multiple features exist, use `AskUserQuestion` to ask which feature to add the component to:

**Question:** "Which feature should this component belong to?"
**Header:** "Feature"
**Options:** List existing feature names (up to 4). If more than 4 features exist, show the 4 most recently modified and include guidance to specify "Other" for unlisted features.

### Step 4: Ask Which State Files to Include

Use `AskUserQuestion` with multi-select to ask:

**Question:** "Which state files should be included?"
**Header:** "States"
**Options:**
1. **Loading** - "Skeleton/loading state shown while data is being fetched"
2. **Empty** - "Empty state shown when there is no data to display"
3. **Errored** - "Error state shown when data fetching fails"
4. **View** - "Separate view component for presentation logic"

### Step 5: Generate Component Files

Create the component directory at `libs/features/{feature-name}/components/{component-name}/`.

#### Always create these files:

**{component-name}.tsx:**
```tsx
import { type FC } from "react";

export interface {ComponentName}Props {
  // Add your props here
}

export const {ComponentName}: FC<{ComponentName}Props> = (props) => {
  return (
    <div>
      {/* {ComponentName} component */}
    </div>
  );
};
```

**index.ts:**
```typescript
export { {ComponentName} } from "./{component-name}";
export type { {ComponentName}Props } from "./{component-name}";
```

#### Conditionally create state files:

**{component-name}-loading.tsx** (if Loading selected):
```tsx
import { type FC } from "react";

export const {ComponentName}Loading: FC = () => {
  return (
    <div className="animate-pulse">
      {/* Loading skeleton */}
    </div>
  );
};
```

**{component-name}-empty.tsx** (if Empty selected):
```tsx
import { type FC } from "react";

export interface {ComponentName}EmptyProps {
  message?: string;
}

export const {ComponentName}Empty: FC<{ComponentName}EmptyProps> = ({
  message = "No data available",
}) => {
  return (
    <div>
      {message}
    </div>
  );
};
```

**{component-name}-errored.tsx** (if Errored selected):
```tsx
import { type FC } from "react";

export interface {ComponentName}ErroredProps {
  error?: Error | null;
  onRetry?: () => void;
}

export const {ComponentName}Errored: FC<{ComponentName}ErroredProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div>
      <p>Something went wrong{error?.message ? `: ${error.message}` : ""}</p>
      {onRetry && (
        <button onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  );
};
```

**{component-name}-view.tsx** (if View selected):
```tsx
import { type FC } from "react";
import { type {ComponentName}Props } from "./{component-name}";

export interface {ComponentName}ViewProps extends {ComponentName}Props {
  // Add view-specific props here
}

export const {ComponentName}View: FC<{ComponentName}ViewProps> = (props) => {
  return (
    <div>
      {/* Presentation markup */}
    </div>
  );
};
```

#### Update index.ts exports

Add exports for all created state files to `index.ts`:

```typescript
export { {ComponentName} } from "./{component-name}";
export type { {ComponentName}Props } from "./{component-name}";

// Add these based on selected states:
export { {ComponentName}Loading } from "./{component-name}-loading";
export { {ComponentName}Empty } from "./{component-name}-empty";
export type { {ComponentName}EmptyProps } from "./{component-name}-empty";
export { {ComponentName}Errored } from "./{component-name}-errored";
export type { {ComponentName}ErroredProps } from "./{component-name}-errored";
export { {ComponentName}View } from "./{component-name}-view";
export type { {ComponentName}ViewProps } from "./{component-name}-view";
```

### Step 6: Output Summary

After creating all files, output a summary:

```
Created component: {component-name} in {feature-name}

libs/features/{feature-name}/components/{component-name}/
├── {component-name}.tsx
├── {component-name}-loading.tsx
├── {component-name}-empty.tsx
├── {component-name}-errored.tsx
└── index.ts

Next steps:
1. Define your component props in {component-name}.tsx
2. Implement the component UI
3. Customize state files as needed
```

Adjust the tree output based on which files were actually created.

## Naming Conventions

- **component-name**: kebab-case (e.g., `user-profile-card`)
- **ComponentName**: PascalCase (e.g., `UserProfileCard`)

Convert kebab-case to PascalCase by:
1. Splitting on hyphens
2. Capitalizing the first letter of each word
3. Joining without separators

Example: `user-profile-card` → `UserProfileCard`
# Feature API Models

Models define the data structures, types, enums, and constants used throughout a feature. They serve as the single
source of truth for data shapes and are shared between server-side logic, client-side hooks, and UI components.

## Directory Structure

```
api/
└── models/
├── {entity}.ts                    # Interface definitions
├── {entity}-type.ts               # Enum definitions
├── {feature}-constants.ts         # Constant values
└── {entity}-validation-schema.ts  # Validation schemas (optional)
```

---

## Types of Model Files

### Interface Definitions

Define the shape of data objects returned from APIs or used in the application.

```typescript
// user.ts

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: string;      // ISO date string
    updatedAt?: string;     // Optional fields use ?
    settings?: UserSettings;
}

export interface UserSettings {
    theme: "light" | "dark";
    notifications: boolean;
    language: string;
}
```

#### Naming conventions:
- Use I prefix for interfaces that represent API responses: IUserModel, IApiResponse
- Omit prefix for domain models used internally: User, UserSettings
- Use descriptive property names in camelCase
- Add comments for non-obvious fields (e.g., date formats)

### Nested/Related Interfaces

Group related interfaces in a single file when they form a hierarchy.

```typescript
// actionable-insight.ts

export interface InsightDealStatus {
    amount: number | null;
    status: "unqualified" | "converted" | null;
}

export interface InsightSupportingLead {
    notes: string;
    dealStatus: InsightDealStatus;
    companyRegion: string | null;
    contactJobTitle: string | null;
    qualifiedLeadId: number;
}

export interface InsightRecommendedAction {
    priority: "high" | "medium" | "low";
    actionId: string;
    description: string;
    shortLabel: string;
}

// Main interface references the nested types
export interface ActionableInsight {
    id: string;
    category: string;
    title: string;
    description: string;
    confidenceScore: number;
    supportingLeads: InsightSupportingLead[];
    recommendedActions: InsightRecommendedAction[];
}
```

### Enum Definitions

Define fixed sets of values for type-safe usage.

```typescript
// user-role.ts

export enum UserRole {
    admin = "ADMIN",
    manager = "MANAGER",
    user = "USER",
    guest = "GUEST",
}
```

Enum values:
- Use SCREAMING_SNAKE_CASE for string values
- Use camelCase for enum keys
- Values should match API/database values exactly

### Enums with Helper Methods

Extend enums with utility functions using namespace merging.

```typescript
// activity-type.ts

export enum ActivityType {
    view = "VIEW",
    click = "CLICK",
    submit = "SUBMIT",
    download = "DOWNLOAD",
}

export namespace ActivityType {
    export function displayValue(type: ActivityType): string {
        switch (type) {
            case ActivityType.view:
                return "Viewed";
            case ActivityType.click:
                return "Clicked";
            case ActivityType.submit:
                return "Submitted";
            case ActivityType.download:
                return "Downloaded";
            default:
                return "";
        }
    }

    export function icon(type: ActivityType): string {
        switch (type) {
            case ActivityType.view:
                return "eye";
            case ActivityType.click:
                return "cursor";
            case ActivityType.submit:
                return "check";
            case ActivityType.download:
                return "download";
            default:
                return "circle";
        }
    }
}
```

Usage:
```typescript
const type = ActivityType.click;
const label = ActivityType.displayValue(type); // "Clicked"
const iconName = ActivityType.icon(type);      // "cursor"
```

### Constants

Define fixed values used throughout the feature.

```typescript
// feature-constants.ts

// Sizing constants
export const CARD_HEIGHT = 280;
export const CARD_WIDTH = 360;
export const AVATAR_SIZE = 48;

// Timing constants
export const FETCH_INTERVAL_MS = 30000;
export const ANIMATION_DURATION_MS = 300;
export const DEBOUNCE_DELAY_MS = 150;

// Color constants
export const PRIMARY_COLOR = "#6F150C";
export const SECONDARY_COLOR = "rgb(245, 245, 244)";

// Configuration arrays
export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
export const MAX_FILE_SIZE_MB = 10;

// Layout configurations
export const GRID_POSITIONS = [
    {x: 0.25, y: 0.25},
    {x: 0.75, y: 0.25},
    {x: 0.25, y: 0.75},
    {x: 0.75, y: 0.75},
];
```

Naming conventions:
- Use SCREAMING_SNAKE_CASE for constants
- Group related constants together
- Add unit suffixes where helpful: _MS, _MB, _PX 

### Route/Configuration Objects

Define structured configuration objects.

```typescript
// routes.ts

import {UserRole} from "./user-role";

interface RouteConfig {
    href: string;
    allowedRoles: UserRole[];
    pattern: string;
}

export const AppRoutes: Record<string, RouteConfig> = {
    dashboard: {
        href: "/dashboard",
        allowedRoles: [UserRole.admin, UserRole.manager],
        pattern: "/dashboard/*",
    },
    profile: {
        href: "/profile",
        allowedRoles: [UserRole.admin, UserRole.manager, UserRole.user],
        pattern: "/profile/*",
    },
    settings: {
        href: "/settings",
        allowedRoles: [UserRole.admin],
        pattern: "/settings/*",
    },
};
```

### Default Values

Define default instances of interfaces for initialization.

```typescript
// feature-flag.ts

export interface FeatureFlagConfig {
    enabled: boolean;
    allowedUserIds: string[];
    allowedCompanyIds: number[];
    allowAll: boolean;
}

export const defaultFeatureFlagConfig: FeatureFlagConfig = {
    enabled: false,
    allowedUserIds: [],
    allowedCompanyIds: [],
    allowAll: false,
};

// Usage with multiple flags
export type FeatureFlags = Record<FeatureFlagType, FeatureFlagConfig>;

export const defaultFeatureFlags: FeatureFlags = {
    [FeatureFlagType.newDashboard]: defaultFeatureFlagConfig,
    [FeatureFlagType.betaFeatures]: defaultFeatureFlagConfig,
    [FeatureFlagType.advancedAnalytics]: defaultFeatureFlagConfig,
};
```

### Class Definitions

Use classes when you need methods or instantiation logic.

```typescript
// user-action.ts

import {UserActionType} from "./user-action-type";
import {UserActionMetadata} from "./user-action-metadata";

export class UserAction {
    id: string;
    type: UserActionType;
    isComplete: boolean;
    timestamp: Date;
    metadata?: UserActionMetadata;

    constructor(data: Partial<UserAction>) {
        Object.assign(this, data);
        this.timestamp = data.timestamp ?? new Date();
    }

    get isExpired(): boolean {
        const expirationMs = 24 * 60 * 60 * 1000; // 24 hours
        return Date.now() - this.timestamp.getTime() > expirationMs;
    }
}
```

Note: Prefer interfaces over classes unless you need:

- Instance methods
- Constructor logic
- Computed properties (getters)

---

## Type Utilities

Union Types for Constrained Values

```typescript
export type Priority = "high" | "medium" | "low";
export type Status = "pending" | "active" | "completed" | "cancelled";
export type Theme = "light" | "dark" | "system";
```

## Mapped Types

```typescript
// Make all properties optional
export type PartialUser = Partial<User>;

// Make all properties required
export type RequiredUser = Required<User>;

// Pick specific properties
export type UserSummary = Pick<User, "id" | "name" | "email">;

// Omit specific properties
export type UserWithoutPassword = Omit<User, "password">;

// Record type for dictionaries
export type UserById = Record<string, User>;
```

## Generic Interfaces

```typescript
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
```

---

## File Naming Conventions:

| Pattern | Example | Use Case |
|--------------------------|--------------------------|-----------------------|
| `{entity}.ts`            | `user.ts`                | Main entity interface |
| `{entity}-type.ts`       | `user-type.ts`           | Enum for entity types |
| `{entity}-status.ts`     | `order-status.ts`        | Status enum |
| `{feature}-constants.ts` | `dashboard-constants.ts` | Feature constants |
| `{entity}-metadata.ts`   | `action-metadata.ts`     | Metadata interface |
| `{feature}-routes.ts`    | `app-routes.ts`          | Route configurations |

---

## Best Practices

1. Single Responsibility

Each file should define related types. Don't mix unrelated interfaces.

2. Export Everything

Export all types that might be needed elsewhere:
export interface User { ... }
export enum UserRole { ... }
export const DEFAULT_USER: User = { ... };

3. Document Complex Types

```typescript
export interface ApiConfig {
    /** Base URL for API requests */
    baseUrl: string;
    /** Request timeout in milliseconds */
    timeout: number;
    /** Number of retry attempts on failure */
    retries: number;
}
```

4. Use Strict Null Checks

Be explicit about nullable fields:

```typescript
export interface User {
    id: string;              // Required
    email: string;           // Required
    phone?: string;          // Optional (may be undefined)
    deletedAt: Date | null;  // Required but may be null
}
```

5. Avoid any

Use unknown for truly unknown types, then narrow:

```typescript
// Avoid
export interface ApiResponse {
    data: any;
}

// Prefer
export interface ApiResponse<T = unknown> {
    data: T;
}
```

---

##Checklist for New Model Files

- Use descriptive, consistent naming
- Export all types that may be used externally
- Add JSDoc comments for complex or non-obvious fields
- Use appropriate type (interface vs class vs enum)
- Define default values where applicable
- Handle null/undefined explicitly
- Group related types in the same file
- Follow camelCase for properties, SCREAMING_SNAKE_CASE for constants

# Feature API Logic

Logic files contain server-side business logic, data fetching, and utility functions. They encapsulate operations that
should run on the server and are used by API routes, Server Components, and other server-side code.

## Directory Structure

```
api/
├── logic/
│   ├── {operation-name}.ts           # Logic function files
│   ├── {helper-name}.ts              # Helper/utility functions
│   └── __tests__/
│       └── {operation-name}.test.ts  # Unit tests
├── models/                            # Type definitions
├── queries/                           # GraphQL queries
└── mutations/                         # GraphQL mutations
```

---

## Types of Logic Files

### Data Fetching Functions

Functions that retrieve data from external APIs, databases, or services.

```typescript
import "server-only";
import {apiRequest} from "@/lib/api";
import {Item} from "../models/item";

export async function getAllItems(): Promise<Item[]> {
    return await apiRequest({
        method: "GET",
        url: "https://api.example.com/items",
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
    });
}
```

### Business Logic Functions

Pure functions that implement domain-specific rules and transformations.

```typescript
import {UserInfo} from "../models/user-info";
import {UserStatus} from "../models/user-status";

export function determineUserStatus(info: UserInfo): UserStatus {
    const activityScore = info.loginCount + info.actionCount;

    if (activityScore > 100) {
        return UserStatus.active;
    } else if (activityScore > 10) {
        return UserStatus.moderate;
    }

    return UserStatus.inactive;
}
```

### Evaluation Functions

Functions that evaluate conditions, feature flags, or permissions.

```typescript
import "server-only";
import {getConfig} from "./get-config";
import {getSession} from "./get-session";
import {FeatureFlag} from "../models/feature-flag";

export async function evaluateFeatureFlag(
    flag: FeatureFlag
): Promise<boolean> {
    const session = await getSession();
    const config = await getConfig();
    const flagConfig = config.flags?.[flag];

    if (!flagConfig?.enabled) {
        return false;
    }

    if (flagConfig.allowAll) {
        return true;
    }

    if (flagConfig.allowedUserIds?.includes(session.userId)) {
        return true;
    }

    return false;
}
```

### Higher-Order Functions (Wrappers)

Functions that wrap other functions to add cross-cutting concerns.

```typescript
import "server-only";

export function withErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    fallback: Awaited<ReturnType<T>>
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    return async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error("Operation failed:", error);
            return fallback;
        }
    };
}

// Usage
const safeGetItems = withErrorHandling(getItems, []);
```

### Validation Schema Functions

Functions that return validation schemas for forms or API inputs.

```typescript
import * as Yup from "yup";

export function getContactFormValidationSchema() {
    return Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .min(2, "Name must be at least 2 characters"),
        email: Yup.string()
            .required("Email is required")
            .email("Must be a valid email"),
        message: Yup.string()
            .required("Message is required")
            .max(1000, "Message must be under 1000 characters"),
    });
}
```

---

## Key Patterns

### Server-Only Directive

Use `import "server-only"` to prevent accidental client-side imports:

```typescript
import "server-only";

// This code will throw an error if imported in a client component
export async function getSecretData() {
    return await fetchFromSecureAPI(process.env.SECRET_KEY);
}
```

When to use:

- Functions that access environment variables
- Functions that make authenticated API calls
- Functions that access databases directly
- Any code that should never run in the browser

### Typed Parameters and Returns

Always define explicit types for parameters and return values:

```typescript
interface GetUserParams {
    userId: string;
    includeProfile?: boolean;
}

interface GetUserResult {
    user: User;
    profile?: UserProfile;
}

export async function getUser(
    params: GetUserParams
): Promise<GetUserResult> {
    const {userId, includeProfile = false} = params;
// Implementation
}
```

### Caching with `unstable_cache`

Use Next.js caching for expensive operations:

```typescript
import "server-only";
import {unstable_cache} from "next/cache";

export async function getConfig(): Promise<Config> {
    const getCachedConfig = unstable_cache(
        async () => {
// Expensive operation
            return await fetchConfigFromRemote();
        },
        ["config"],  // Cache key
        {
            tags: ["config"],
            revalidate: 60,  // Seconds
        }
    );

    return await getCachedConfig();
}
```

### Error Handling

Handle errors gracefully with fallbacks:

```typescript
import "server-only";
import {logger} from "@/lib/logging";

export async function getItems(): Promise<Item[]> {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        logger.error({
            domain: "features/items/api/logic/get-items.ts",
            error
        });
        return [];  // Return safe fallback
    }
}
```

### Composing Logic Functions

Build complex operations from smaller functions:

```typescript
import "server-only";
import {getSession} from "./get-session";
import {getPermissions} from "./get-permissions";
import {validateAccess} from "./validate-access";

export async function getProtectedData(
    resourceId: string
): Promise<ProtectedData | null> {
    const session = await getSession();
    const permissions = await getPermissions(session.userId);

    if (!validateAccess(permissions, resourceId)) {
        return null;
    }

    return await fetchProtectedData(resourceId);
}
```

---

## Testing Logic Files

Use Jest with mocked dependencies:

```typescript
import {evaluateFeatureFlag} from "../evaluate-feature-flag";
import {FeatureFlag} from "../../models/feature-flag";

// Mock dependencies
jest.mock("../get-session", () => ({
    getSession: jest.fn().mockResolvedValue({
        userId: "user-123",
        companyId: "company-456",
    }),
}));

const mockGetConfig = jest.fn();
jest.mock("../get-config", () => ({
    getConfig: () => mockGetConfig(),
}));

describe("evaluateFeatureFlag", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns false when flag is disabled", async () => {
        mockGetConfig.mockResolvedValue({
            flags: {
                [FeatureFlag.newFeature]: {enabled: false},
            },
        });

        const result = await evaluateFeatureFlag(FeatureFlag.newFeature);

        expect(result).toBe(false);
    });

    test("returns true when flag is enabled and user is allowed", async () => {
        mockGetConfig.mockResolvedValue({
            flags: {
                [FeatureFlag.newFeature]: {
                    enabled: true,
                    allowedUserIds: ["user-123"],
                },
            },
        });

        const result = await evaluateFeatureFlag(FeatureFlag.newFeature);

        expect(result).toBe(true);
    });
});
```

## Testing Best Practices

1. Mock external dependencies — Isolate the function under test
2. Test edge cases — Empty arrays, null values, error conditions
3. Clear mocks between tests — Use beforeEach with jest.clearAllMocks()
4. Test the contract — Focus on inputs and outputs, not implementation details

---

## File Naming Conventions

| Pattern                           | Example                     | Use Case                  |
|-----------------------------------|-----------------------------|---------------------------|
| `get-{resource}.ts`               | `get-user.ts`               | Fetching single resource  |
| `get-all-{resources}.ts`          | `get-all-users.ts`          | Fetching collections      |
| `{action}-{resource}.ts`          | `delete-session.ts`         | Mutations/actions         |
| `evaluate-{subject}.ts`           | `evaluate-feature-flag.ts`  | Evaluation/decision logic |
| `determine-{subject}.ts`          | `determine-status.ts`       | Classification logic      |
| `with-{concern}.ts`               | `with-error-handling.ts`    | Higher-order functions    |
| `{resource}-validation-schema.ts` | `user-validation-schema.ts` | Validation schemas        |

---

## Logic vs Other Locations

| Location         | Use For                                   |
|------------------|-------------------------------------------|
| `api/logic/`     | Server-side business logic, data fetching |
| `hooks/`         | Client-side data fetching, UI state       |
| `api/models/`    | Type definitions, interfaces, enums       |
| `api/queries/`   | GraphQL query definitions                 |
| `api/mutations/` | GraphQL mutation definitions              |

---

## Checklist for New Logic Files

- Add import "server-only" if accessing secrets or server APIs
- Define explicit parameter and return types
- Handle errors with try/catch and logging
- Return safe fallbacks on failure
- Add caching for expensive operations
- Create unit tests in __tests__/ directory
- Mock external dependencies in tests
- Use descriptive function names following naming conventions
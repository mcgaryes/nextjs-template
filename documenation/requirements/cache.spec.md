# Cache Library (Next.js) — Requirements (Claude-friendly)

## Goal
Build a reusable cache library for a Next.js app that:
- Provides a stable, method-only API for cache operations
- Works with Upstash Redis initially
- Can swap Redis SDK/provider implementations without changing any consumer code
- Provides a client-component hook: `useCache`
- Supports **key-based** and **tag-based** invalidation
- Supports **subscriptions** to a Redis *keypath* (exact key or pattern/prefix)

---

## Non-Goals
- Exposing a raw Redis client to application code
- Shipping Redis credentials to the browser
- Implementing broader Redis command coverage beyond the V1 method list below

---

## Core Constraints
1. **Provider agnostic**
   - Consumers must not import or depend on Upstash types or SDK calls.
   - Replacing Upstash with another Redis package must require changes only inside the library (adapter), not in app code.

2. **Method-only public surface**
   - Export cache methods and `useCache` only.
   - Do **not** export the underlying client/connection/provider.

3. **Options-object API**
   - All public methods accept a single `options` object (no positional args for core params).

---

## Public API

### Exports
- `cache` (or `createCache()` that returns a `cache` object)
- `useCache()` hook for client components

### Required Methods (V1)
- `get(options)`
- `set(options)`
- `del(options)`
- `invalidate(options)`  ← key/tag invalidation
- `subscribe(options)`   ← subscribe to keypath changes (server + client bridge)

> No other Upstash methods are required at this point.

---

## Options Shape (baseline)
All methods must take `options: { ... }`

### Shared Options
- `namespace?: string` (optional prefixing mechanism)
- `type?: "string" | "json"` (default behavior must be defined)
- `ttlSeconds?: number` (optional expiration)
- `signal?: AbortSignal` (optional, if supported)

### `get` Options
- `key: string` (required)
- `deserialize?: (raw: string) => any` (optional override)

### `set` Options
- `key: string` (required)
- `value: string | number | boolean | object | array` (required)
- `serialize?: (value: any) => string` (optional override)
- `tags?: string[]` (optional; associates the key to tags for later invalidation)

### `del` Options
- `key: string` (required)

### `invalidate` Options
Supports both mechanisms:
- Key-based:
  - `{ key: string }`
  - `{ keys: string[] }`
- Tag-based:
  - `{ tag: string }`
  - `{ tags: string[] }`

### `subscribe` Options (keypath subscription)
The library must support subscribing to:
- an exact key, or
- a keypath/prefix/pattern (e.g. `user:*`)

Options:
- Exact key:
  - `{ key: string, ... }`
- Pattern/prefix:
  - `{ pattern: string, ... }` (glob-style match; provider-agnostic)

Additional options:
- `events?: Array<"set" | "del" | "expire" | "incr" | "invalidate" | "any">`
  - default: `["any"]`
- `includeValue?: boolean`
  - default: `false` (avoid extra reads unless requested)
- `onEvent: (event) => void` (required)
- `format?: "keyspace" | "channel"`
  - default: `"keyspace"` (listen to key changes), but allow `"channel"` for explicit pub/sub channels if needed.

Subscribe return value:
- returns an `unsubscribe(): Promise<void>` function (or `{ unsubscribe }` object)

Event payload shape (normalized):
- `key: string` (logical key, without internal prefixes)
- `namespace?: string`
- `event: "set" | "del" | "expire" | "incr" | "invalidate" | "unknown"`
- `timestampMs: number`
- `value?: string` or parsed JSON (only if `includeValue: true` and value is available)

---

## Return Types (baseline)
- `get<T>`: `Promise<T | null>`
- `set`: `Promise<boolean>` (or normalized success result)
- `del`: `Promise<number>` (# keys deleted)
- `invalidate`: `Promise<{ deletedKeys: number; deletedTags?: number }>` (normalized)
- `subscribe`: `Promise<() => Promise<void>>` (unsubscribe)

---

## Serialization Rules
1. `type: "string"`
   - Store raw string (or stringified primitive)
   - `get` returns string (or the result of `deserialize` if provided)

2. `type: "json"`
   - Store `JSON.stringify(value)`
   - `get` must `JSON.parse(raw)` and return parsed value
   - **On JSON parse failure: return `null`** (do not throw)

---

## Tag-Based Invalidation Semantics

### Tag Association
When `set({ key, tags })` is called, the library must record the mapping:
- tag -> keys
- (optional but recommended) key -> tags (to support cleanup)

### Invalidation Behavior
- `invalidate({ tag })` removes all keys associated with that tag
- `invalidate({ tags })` removes all keys associated with any of those tags
- Key deletions should also clean up tag mappings where feasible

### Namespacing
- If `namespace` is provided, both keys and tag mappings must be namespaced consistently to avoid collisions.

---

## Subscription Semantics (Keypath)

### What “subscribe to a keypath” means
- Receive events when keys under a given logical key or key pattern change.
- Preferred implementation is Redis **keyspace notifications** (provider supports this via pub/sub). See Upstash guidance and Redis docs.

### Event Sources
Subscriptions should work when any of the following cause changes:
- direct calls via this library (`set`, `del`, `invalidate`)
- changes by other producers (where the Redis provider supports keyspace notifications)

### Client Support
Because client components cannot connect to Redis safely:
- `useCache().subscribe(...)` must subscribe via a **server-mediated stream**:
  - Server-Sent Events (SSE) or WebSocket route handler
- No Redis credentials may be sent to the browser.

---

## Provider/Adapter Architecture

### Internal Provider Interface
Create an internal adapter interface (example responsibilities):
- basic KV operations: get/set/del
- tag index operations: add/remove key-to-tag mappings, list keys for tag, delete tag index
- subscription operations:
  - `subscribe(patternOrKey, handler)` and `unsubscribe`
  - must support both exact and pattern subscriptions (if provider supports pattern subscriptions)

### Upstash Adapter
- Implement provider interface using Upstash Redis SDK.
- Support keyspace notification subscriptions using Redis pub/sub patterns (where available).

### Swap Requirement
- It must be possible to add a second adapter (e.g., `ioredis` or `node-redis`) without changing:
  - exported method names
  - options shapes
  - consumer callsites

---

## Client Hook: `useCache`

### Purpose
Provide a cache API usable inside `"use client"` components.

### Security Requirement
- Must not connect directly to Redis from the browser.
- Must not expose Redis credentials in client bundle.

### Hook API (minimum)
`useCache()` returns:
- `get(options)`
- `set(options)`
- `del(options)`
- `invalidate(options)`
- `subscribe(options)` (server-mediated stream)
- optional `loading` / `error` state (recommended)

---

## Configuration

### Initialization
- Library must have a single configuration entrypoint.
- Consumer code should not need to pass provider details everywhere.

Pick one:
- `createCache({ provider: "upstash", ... })`
- `cache.configure({ provider: "upstash", ... })`
- environment-driven config with one exported `cache`

### Key Namespacing
- If `namespace` is provided, keys must be prefixed consistently:
  - `${namespace}:${key}`

---

## Error Handling
- Normalize provider errors into library-level errors.
- No Upstash-specific error types should leak into app code.
- JSON parse failures return `null` (not an error).

---

## Acceptance Criteria (DoD)
- [ ] Consumers call `cache.get/set/del/invalidate/subscribe` without importing any Redis SDK
- [ ] Underlying client is not exported
- [ ] All public methods use an `options` object
- [ ] Upstash Redis works end-to-end with env-based config
- [ ] JSON/object round-trip works via `type: "json"`
- [ ] JSON parse failure returns `null`
- [ ] `useCache` works in client components and does not expose secrets
- [ ] Tag-based invalidation works: `set({ key, tags })` + `invalidate({ tag/tags })`
- [ ] Key-based invalidation works: `invalidate({ key/keys })`
- [ ] Subscriptions work for exact key and pattern subscriptions, with normalized events
- [ ] Swapping provider requires changes only in adapter/config, not callsites

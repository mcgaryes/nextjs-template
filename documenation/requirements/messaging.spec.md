# Feature: Messaging Center

## Goals
- Provide a dedicated Messaging Center page that lists messages and displays the selected message details.
- Track **read/unread** state in persistence and reflect it in the UI.

---

## User Flows

### Direct Navigation → Message
- When a user navigates to the Messaging Center page, the UI **must** load and select the **most recent** message by default (given descending sort).

### Selecting a Message
- Clicking a message in the left panel **must** display that message’s details in the right panel.
- Selecting a message **must** mark it as **read**.

---

## Data & State Requirements

### Message List Source
- The Messaging Center **must** load a list of **all previous messages** from the database (first pass may use a local store; see Implementation constraints).

### Ordering
- Messages **must** be displayed in **descending order** (newest first, by date).

### Read Tracking
- When a message is **opened/selected**, it **must** be marked as **read**.
- A message can be toggled between **read** and **unread**.

### Visual Read State
- Messages in the list that are **unread** must be rendered in **bold**.
- Messages that are **read** must be rendered in **regular font**.

---

## Page Layout Requirements (Next.js)

### Page
- Messaging Center **must** be a **separate page view** in the Next.js app.

### Two-Panel Layout
- The page **must** be a **two panel view**:
  - **Left panel**: message list and list controls
  - **Right panel**: message details and message actions

---

## Left Panel Requirements

### Sections
- Left panel contains **two sections aligned in row format**:
  1. **Toolbar**
  2. **Message list**

### Toolbar
- Must include:
  - **Search bar** (filters messages)
  - **Sort button** that sorts messages by **date**

### Message List
- Must render messages in a **list format** with:
  - **Title**
  - **Brief description**
- Messages must be displayed newest-first.
- Clicking a message selects it and shows details on the right.

---

## Right Panel Requirements

### Sections
- Right panel contains **two sections aligned in row format**:
  1. **Toolbar**
  2. **Message detail view**

### Toolbar Actions
- Must include icon buttons:
  - **Trash**: deletes the message
  - **Envelope**: toggles the message between **read** and **unread**

---

## Server Actions & API Layer Requirements

### Loading
- Messages **must** be loaded via a **server action**.

### Mutations
- Message updates (delete, mark read/unread) **must** be performed via **server actions**.

### Location & Constraints
- Server actions **must** live in `api/logic/`.
- Server actions **must** be marked as **server-only**.

---

## Initial Storage (First Pass)
- For the first pass, messages should be backed by a **local store** instead of a real DB:
  - Either a **shared instance of a model** in memory, or
  - A **local file-based store**
- Choose whichever is simpler to implement, while preserving the same load/mutation interfaces that a DB-backed implementation would use.

---

## Componentization Requirements

### Separation
- The UI parts described above **must** be split into individual components and composed in the page view.

### Suggested Component Boundaries
- `MessageCenterPage` (page composition only)
- `MessageListPanel`
  - `MessageListToolbar` (search + sort)
  - `MessageList`
  - `MessageListItem`
- `MessageDetailPanel`
  - `MessageDetailToolbar` (trash + envelope)
  - `MessageDetailView`

---

## Context & State Management

### Message Context
- Components **must** be wrapped in a **Message Context** that contains:
  - The **currently selected message**
  - The list of messages (or references needed to render it)

### Reducer + Actions
- Context must use a reducer pattern with actions in place for:
  - Selecting a message
  - Marking a message as **read**
  - Marking a message as **unread**
  - Deleting a message
  - Applying search filter
  - Applying/changing sort
- Context actions (e.g., mark read/unread) **must** update state via the reducer and persist changes via server actions.

---

## Acceptance Criteria
- Messaging Center is a standalone Next.js page with a two-panel layout and toolbars as specified.
- Messages load via server action; updates mutate via server action.
- Messages are displayed newest-first.
- Unread messages appear bold; read messages appear normal.
- Selecting a message marks it read (persisted).
- Trash deletes the message (persisted).
- Envelope toggles read/unread (persisted).
- Feature is componentized and wrapped in a Message Context using reducer-driven actions.

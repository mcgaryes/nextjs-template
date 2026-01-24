# Requirements

## UI

### AlertsView

- should sit above all other components in the app
- should be able to handle multiple Alert
- Toast messages should use "sonner" component.
- Alert dialogs should use "shadcn" alert dialog component.
- Toast style alerts view should stack and when hovered over should show all alerts.

### AlertView

- should add the following custom parameter:
    - position: `AlertPositionType`
    - type: AlertDisplayType
        - if AlertDisplayType is toast then the view should inherit from the sonner toast parameters
        - if AlertDisplayType is dialog then is should inherit from shadcn’s dialog interface

## Data

### Models

#### `AlertPositionType`

- top-left, top-center, top-right, bottom-right, bottom-center, bottom-left

#### `AlertDisplayType`

- dialog, toast

## State

- Manages groups of alerts
- Should persist through page navigation
- Should be available to all components through shared AlertContext
- AlertContext - ability to add and remove alerts by id.

## Hooks

### `useAlert`

- should contain reference to alert context. add, remove, update alert.
- addAlert should take a property alertPositionType so that the alert can be placed within the same group

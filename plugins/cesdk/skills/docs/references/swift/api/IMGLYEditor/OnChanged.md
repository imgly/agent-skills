# OnChanged

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnChanged`

A namespace for `onChanged` callbacks.

```swift
enum OnChanged
```

## Members

### default

```swift
static let `default`: OnChanged.Callback
```

The default callback. The following state updates are handled by default:

### ViewModeState.editorViewMode

```swift
let editorViewMode: EditorViewMode
```

The currently active view mode.

### Context.engine

```swift
let engine: Engine
```

The engine of the current editor.

### Context.eventHandler

```swift
let eventHandler: any EditorEventHandler
```

The event handler of the current editor.

### ViewModeState.insets

```swift
let insets: EdgeInsets?
```

The insets of the canvas.

### OnChanged.Callback

```swift
typealias Callback = @MainActor @Sendable (OnChanged.EditorStateChange, OnChanged.Context) throws -> Void
```

The callback type.

### OnChanged.Context

```swift
struct Context
```

The context of the [`OnChanged.Callback`](callback.md).

### OnChanged.EditorStateChange

```swift
enum EditorStateChange
```

A namespace for the editor state updates received through the [`OnChanged.Callback`](callback.md).

### EditorStateChange.OnChanged.EditorStateChange.editMode(oldValue:newValue:)

```swift
case editMode(oldValue: EditMode, newValue: EditMode)
```

The current edit mode changed. `oldValue`

### EditorStateChange.OnChanged.EditorStateChange.gestureActive(oldValue:newValue:)

```swift
case gestureActive(oldValue: Bool, newValue: Bool)
```

The canvas started/ended receiving a touch gesture. `oldValue`

### EditorStateChange.OnChanged.EditorStateChange.page(oldValue:newValue:)

```swift
case page(oldValue: Int, newValue: Int)
```

The current page index changed. `oldValue`

### EditorStateChange.OnChanged.EditorStateChange.viewMode(oldValue:newValue:)

```swift
case viewMode(oldValue: OnChanged.ViewModeState, newValue: OnChanged.ViewModeState)
```

The current view mode changed. `oldValue`

### OnChanged.Handler

```swift
typealias Handler = @MainActor @Sendable (OnChanged.EditorStateChange, OnChanged.Context, () throws -> Void) throws -> Void
```

The handler type that receives an `existing` closure for chaining.

### OnChanged.ViewModeState

```swift
struct ViewModeState
```

The view mode state of the editor.

### ViewModeState.pageIndex

```swift
let pageIndex: Int
```

The index of the currently visible page.

### ViewModeState.verticalSizeClass

```swift
let verticalSizeClass: UserInterfaceSizeClass?
```

The current `@Environment(\.verticalSizeClass)`.

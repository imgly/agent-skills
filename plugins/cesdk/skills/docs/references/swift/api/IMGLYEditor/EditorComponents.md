# EditorComponents

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorComponents`

A namespace for the editor components.

```swift
enum EditorComponents
```

## Members

### Button.body(_:)

```swift
@MainActor func body(_ context: Context) throws -> some View
```

The content and behavior of this component. `context`

### Custom.body(_:)

```swift
@MainActor func body(_ context: Context) throws -> some View
```

The content and behavior of this component. `context`

### EditorComponents.Button

```swift
struct Button<Label, Context, Modifier> where Label : View, Context : EditorContext, Modifier : ViewModifier
```

A control that initiates an action.

### EditorComponents.Custom

```swift
struct Custom<Content, Context> where Content : View, Context : EditorContext
```

A custom view.

### Button.id

```swift
let id: EditorComponentID
```

The unique identifier of this component suitable to be used with a `ForEach` view.

### Custom.id

```swift
let id: EditorComponentID
```

The unique identifier of this component suitable to be used with a `ForEach` view.

### Button.init(id:action:label:isEnabled:isVisible:)

```swift
init(id: EditorComponentID, action: @escaping Context.To<Void>, @ViewBuilder label: @escaping Context.To<Label>, isEnabled: @escaping Context.To<Bool> = { _ in true }, isVisible: @escaping Context.To<Bool> = { _ in true })
```

### Button.init(id:action:label:isEnabled:isVisible:modifier:)

```swift
init(id: EditorComponentID, action: @escaping Context.To<Void>, @ViewBuilder label: @escaping Context.To<Label>, isEnabled: @escaping Context.To<Bool> = { _ in true }, isVisible: @escaping Context.To<Bool> = { _ in true }, modifier: @escaping Context.To<Modifier>)
```

Creates a button that displays a custom label. `id`

### Custom.init(id:content:isEnabled:isVisible:)

```swift
init(id: EditorComponentID, @ViewBuilder content: @escaping Context.To<Content>, isEnabled: @escaping Context.To<Bool> = { _ in true }, isVisible: @escaping Context.To<Bool> = { _ in true })
```

Creates a custom view that displays custom content. `id`

### Button.isVisible(_:)

```swift
@MainActor func isVisible(_ context: Context) throws -> Bool
```

The visibility of this component. `context`

### Custom.isVisible(_:)

```swift
@MainActor func isVisible(_ context: Context) throws -> Bool
```

The visibility of this component. `context`

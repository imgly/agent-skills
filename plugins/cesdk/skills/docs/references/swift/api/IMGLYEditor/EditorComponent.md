# EditorComponent

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorComponent`

A type that represents a view component that can be used in the editor.

```swift
protocol EditorComponent
```

## Members

### Body

```swift
associatedtype Body : View
```

The type of view representing the `body` of this component.

### body(_:)

```swift
@MainActor @ViewBuilder func body(_ context: Self.Context) throws -> Self.Body
```

The content and behavior of this component. `context`

### Context

```swift
associatedtype Context : EditorContext
```

The type of the context of this component.

### id

```swift
var id: EditorComponentID { get }
```

The unique identifier of this component suitable to be used with a `ForEach` view.

### isVisible(_:)

```swift
@MainActor func isVisible(_ context: Self.Context) throws -> Bool
```

The visibility of this component. `context`

### isVisible(_:)-7twi1

```swift
func isVisible(_: Self.Context) throws -> Bool
```

The visibility of this component. By default, the component is always visible. Always `true`.

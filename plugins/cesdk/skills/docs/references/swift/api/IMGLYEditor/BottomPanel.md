# BottomPanel

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/BottomPanel`

A namespace for the bottom panel component.

```swift
enum BottomPanel
```

## Members

### BottomPanel.Configuration

```swift
struct Configuration
```

Configuration for the bottom panel.

### Configuration.BottomPanel.Configuration.Builder

```swift
struct Builder
```

Builder for bottom panel configuration.

### BottomPanel.Content

```swift
typealias Content = BottomPanel.Context.To<any View>
```

A closure to build a bottom panel.

### BottomPanel.Context

```swift
struct Context
```

The context for bottom panel components.

### Configuration.Builder.content

```swift
var content: BottomPanel.Content?
```

The bottom panel content.

### Configuration.Builder.content(_:)

```swift
mutating func content(@ViewBuilder _ content: @escaping BottomPanel.Content)
```

Sets the bottom panel content using a view builder.

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

### Configuration.init(_:)

```swift
init(_ configure: (inout BottomPanel.Configuration.Builder) -> Void)
```

Creates bottom panel configuration.

### Context.state

```swift
let state: any EditorState
```

The state of the current editor.

# EditorConfiguration

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorConfiguration`

A composable editor configuration. Subclass this to create reusable configurations. Override computed properties to customize callbacks, UI components, and other editor settings.

```swift
@MainActor class EditorConfiguration
```

## Members

### assetLibrary

```swift
@MainActor var assetLibrary: AssetLibraryConfiguration? { get }
```

The asset library configuration.

### Builder.assetLibrary(_:)

```swift
@MainActor func assetLibrary(_ configure: (inout AssetLibraryConfiguration.Builder) -> Void)
```

Sets the asset library configuration. Merges with any existing configuration.

### bottomPanel

```swift
@MainActor var bottomPanel: BottomPanel.Configuration? { get }
```

The bottom panel configuration.

### Builder.bottomPanel(_:)

```swift
@MainActor func bottomPanel(_ configure: (inout BottomPanel.Configuration.Builder) -> Void)
```

Sets the bottom panel configuration. Merges with any existing configuration.

### canvasMenu

```swift
@MainActor var canvasMenu: CanvasMenu.Configuration? { get }
```

The canvas menu configuration.

### Builder.canvasMenu(_:)

```swift
@MainActor func canvasMenu(_ configure: (inout CanvasMenu.Configuration.Builder) -> Void)
```

Sets the canvas menu configuration. Merges with any existing configuration.

### Builder.captionsGeneration(_:)

```swift
@MainActor func captionsGeneration(_ callback: @escaping CaptionsGeneration.Callback)
```

Sets the caption generation callback that backs the Add Captions sheet’s “Generate Automatically” action. Unlike the chained handlers, the last configured callback wins.

### colorPalette

```swift
@MainActor var colorPalette: [NamedColor]? { get }
```

The color palette.

### Builder.colorPalette(_:)

```swift
@MainActor func colorPalette(_ colors: [NamedColor])
```

Sets the color palette.

### dock

```swift
@MainActor var dock: Dock.Configuration? { get }
```

The dock configuration.

### Builder.dock(_:)

```swift
@MainActor func dock(_ configure: (inout Dock.Configuration.Builder) -> Void)
```

Sets the dock configuration. Merges with any existing configuration (e.g., subclass defaults).

### EditorConfiguration.Builder

```swift
@MainActor final class Builder
```

Builder for editor configuration.

### init(_:)

```swift
@MainActor init(_ customize: (EditorConfiguration.Builder) -> Void = { _ in })
```

Creates a configuration with optional customizations. `customize`

### Builder.init()

```swift
@MainActor init()
```

Creates an empty builder.

### inspectorBar

```swift
@MainActor var inspectorBar: InspectorBar.Configuration? { get }
```

The inspector bar configuration.

### Builder.inspectorBar(_:)

```swift
@MainActor func inspectorBar(_ configure: (inout InspectorBar.Configuration.Builder) -> Void)
```

Sets the inspector bar configuration. Merges with any existing configuration.

### navigationBar

```swift
@MainActor var navigationBar: NavigationBar.Configuration? { get }
```

The navigation bar configuration.

### Builder.navigationBar(_:)

```swift
@MainActor func navigationBar(_ configure: (inout NavigationBar.Configuration.Builder) -> Void)
```

Sets the navigation bar configuration. Merges with any existing configuration.

### onChanged

```swift
@MainActor var onChanged: OnChanged.Handler? { get }
```

The `onChanged` handler.

### Builder.onChanged(_:)

```swift
@MainActor func onChanged(_ handler: @escaping OnChanged.Handler)
```

Sets the `onChanged` handler.

### onClose

```swift
@MainActor var onClose: OnClose.Handler? { get }
```

The `onClose` handler.

### Builder.onClose(_:)

```swift
@MainActor func onClose(_ handler: @escaping OnClose.Handler)
```

Sets the `onClose` handler.

### onCreate

```swift
@MainActor var onCreate: OnCreate.Handler? { get }
```

The `onCreate` handler.

### Builder.onCreate(_:)

```swift
@MainActor func onCreate(_ handler: @escaping OnCreate.Handler)
```

Sets the `onCreate` handler.

### onError

```swift
@MainActor var onError: OnError.Handler? { get }
```

The `onError` handler.

### Builder.onError(_:)

```swift
@MainActor func onError(_ handler: @escaping OnError.Handler)
```

Sets the `onError` handler.

### onExport

```swift
@MainActor var onExport: OnExport.Handler? { get }
```

The `onExport` handler.

### Builder.onExport(_:)

```swift
@MainActor func onExport(_ handler: @escaping OnExport.Handler)
```

Sets the `onExport` handler.

### onLoaded

```swift
@MainActor var onLoaded: OnLoaded.Handler? { get }
```

The `onLoaded` handler.

### Builder.onLoaded(_:)

```swift
@MainActor func onLoaded(_ handler: @escaping OnLoaded.Handler)
```

Sets the `onLoaded` handler.

### onUpload

```swift
@MainActor var onUpload: OnUpload.Handler? { get }
```

The `onUpload` handler.

### Builder.onUpload(_:)

```swift
@MainActor func onUpload(_ handler: @escaping OnUpload.Handler)
```

Sets the `onUpload` handler.

### zoomPadding

```swift
@MainActor var zoomPadding: CGFloat? { get }
```

The zoom padding for the canvas.

### Builder.zoomPadding(_:)

```swift
@MainActor func zoomPadding(_ padding: CGFloat)
```

Sets the zoom padding for the canvas.

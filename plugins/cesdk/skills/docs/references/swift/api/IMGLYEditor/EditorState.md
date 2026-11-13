# EditorState

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorState`

A type for the state of the editor.

```swift
@MainActor protocol EditorState
```

## Members

### isCreating

```swift
@MainActor var isCreating: Bool { get }
```

Indicates that the [`onCreate(_:)`](../editorconfiguration/builder/oncreate(_:).md) callback did not yet complete.

### isExporting

```swift
@MainActor var isExporting: Bool { get }
```

Indicates that the [`onExport(_:)`](../editorconfiguration/builder/onexport(_:).md) callback is running.

### viewMode

```swift
@MainActor var viewMode: EditorViewMode { get }
```

The view mode of the editor.

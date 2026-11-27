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

### layout

```swift
@MainActor var layout: EditorLayout { get }
```

The layout that the editor shows. It can differ from [`layout`](../editorconfiguration/layout.md), the layout that the app asks for: it is [`EditorLayout.stacked`](../editorlayout/stacked.md) wherever [`EditorLayout.sideBySide`](../editorlayout/sidebyside.md) does not apply, such as on a phone in portrait.

### layout-1n50i

```swift
@MainActor var layout: EditorLayout { get }
```

`EditorLayout/stacked` for a conforming type that does not implement `EditorState/layout`. The states that the editor passes to components report the layout that it shows.

### viewMode

```swift
@MainActor var viewMode: EditorViewMode { get }
```

The view mode of the editor.

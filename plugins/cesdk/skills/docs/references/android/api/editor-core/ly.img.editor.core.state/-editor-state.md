# EditorState

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.state`

Current state of the editor.

```kotlin
@Immutable
data class EditorState(val insets: Insets = Insets.Zero, val extraInsets: Insets = Insets.Zero, val activeSheet: SheetType? = null, val activeSheetState: SheetState? = null, val isTouchActive: Boolean = false, val isHistoryEnabled: Boolean = true, val isBackHandlerEnabled: Boolean = false, val viewMode: EditorViewMode = EditorViewMode.Edit(), val dimensions: Dimensions = Dimensions(), val minVideoDuration: Duration? = null, val maxVideoDuration: Duration? = null, val layout: EditorLayout = EditorLayout.STACKED)
```


## Members

### EditorState

```kotlin
constructor(insets: Insets, extraInsets: Insets, activeSheet: SheetType?, activeSheetState: SheetState?, isTouchActive: Boolean, isHistoryEnabled: Boolean, isBackHandlerEnabled: Boolean, viewMode: EditorViewMode, dimensions: Dimensions, minVideoDuration: Duration?, maxVideoDuration: Duration?)
```

```kotlin
constructor(insets: Insets = Insets.Zero, extraInsets: Insets = Insets.Zero, activeSheet: SheetType? = null, activeSheetState: SheetState? = null, isTouchActive: Boolean = false, isHistoryEnabled: Boolean = true, isBackHandlerEnabled: Boolean = false, viewMode: EditorViewMode = EditorViewMode.Edit(), dimensions: Dimensions = Dimensions(), minVideoDuration: Duration? = null, maxVideoDuration: Duration? = null, layout: EditorLayout = EditorLayout.STACKED)
```

Keeps the constructor of earlier releases, which have no layout, so the state is EditorLayout.STACKED.

### activeSheetState

```kotlin
val activeSheetState: SheetState? = null
```

### activeSheet

```kotlin
val activeSheet: SheetType? = null
```

### dimensions

```kotlin
val dimensions: Dimensions
```

### extraInsets

```kotlin
val extraInsets: Insets
```

### insets

```kotlin
val insets: Insets
```

### isBackHandlerEnabled

```kotlin
val isBackHandlerEnabled: Boolean = false
```

### isHistoryEnabled

```kotlin
val isHistoryEnabled: Boolean = true
```

### isTouchActive

```kotlin
val isTouchActive: Boolean = false
```

### layout

```kotlin
val layout: EditorLayout
```

### maxVideoDuration

```kotlin
val maxVideoDuration: Duration? = null
```

### minVideoDuration

```kotlin
val minVideoDuration: Duration? = null
```

### viewMode

```kotlin
val viewMode: EditorViewMode
```

# EditorState

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.state`

Current state of the editor.

```kotlin
@Immutable
data class EditorState(val insets: Insets = Insets.Zero, val extraInsets: Insets = Insets.Zero, val activeSheet: SheetType? = null, val activeSheetState: SheetState? = null, val isTouchActive: Boolean = false, val isHistoryEnabled: Boolean = true, val isBackHandlerEnabled: Boolean = false, val viewMode: EditorViewMode = EditorViewMode.Edit(), val dimensions: Dimensions = Dimensions(), val minVideoDuration: Duration? = null, val maxVideoDuration: Duration? = null)
```


## Members

### EditorState

```kotlin
constructor(insets: Insets = Insets.Zero, extraInsets: Insets = Insets.Zero, activeSheet: SheetType? = null, activeSheetState: SheetState? = null, isTouchActive: Boolean = false, isHistoryEnabled: Boolean = true, isBackHandlerEnabled: Boolean = false, viewMode: EditorViewMode = EditorViewMode.Edit(), dimensions: Dimensions = Dimensions(), minVideoDuration: Duration? = null, maxVideoDuration: Duration? = null)
```

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

# SetExtra

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

Sets extra canvas insets on top of what is already calculated based on system status and navigation bars, IMG.LY dock and navigation bars, currently open sheet, timeline, system keyboard etc. The value will be reflected on ly.img.editor.core.state.EditorState.insets.

```kotlin
class SetExtra(val insets: Insets) : EditorEvent
```


## Members

### SetExtra

```kotlin
constructor(insets: Insets)
```

### insets

```kotlin
val insets: Insets
```

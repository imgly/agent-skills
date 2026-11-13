# OnClosed

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event that is emitted when the sheet is fully expanded after calling Close or the user manually does it.

```kotlin
class OnClosed(val type: SheetType) : EditorEvent
```


## Members

### OnClosed

```kotlin
constructor(type: SheetType)
```

### type

```kotlin
val type: SheetType
```

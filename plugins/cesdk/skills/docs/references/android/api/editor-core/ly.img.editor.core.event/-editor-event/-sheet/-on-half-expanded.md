# OnHalfExpanded

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event that is emitted when the sheet is fully expanded after calling HalfExpand or the user manually does it.

```kotlin
class OnHalfExpanded(val type: SheetType) : EditorEvent
```


## Members

### OnHalfExpanded

```kotlin
constructor(type: SheetType)
```

### type

```kotlin
val type: SheetType
```

# OnExpanded

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event that is emitted when the sheet is fully expanded after calling Expand or the user manually does it.

```kotlin
class OnExpanded(val type: SheetType) : EditorEvent
```


## Members

### OnExpanded

```kotlin
constructor(type: SheetType)
```

### type

```kotlin
val type: SheetType
```

# SheetType

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

An interface representing different types of sheets used in the editor. Below you can find some of the implementations of this interface. Avoid inheriting from this interface. If you want to have a custom sheet consider using Custom instead.

```kotlin
interface SheetType
```


## Members

### style

```kotlin
abstract val style: SheetStyle
```

the style that should be used to display the sheet.

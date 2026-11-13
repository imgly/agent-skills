# FillStroke

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that is used to control the fill and/or stroke of various blocks.

```kotlin
class FillStroke(val style: SheetStyle = SheetStyle(), val fillOnly: Boolean = false) : SheetType
```


## Members

### FillStroke

```kotlin
constructor(style: SheetStyle = SheetStyle(), fillOnly: Boolean = false)
```

### fillOnly

```kotlin
val fillOnly: Boolean = false
```

### style

```kotlin
open override val style: SheetStyle
```

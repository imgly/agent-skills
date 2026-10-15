# Crop

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that is used to crop design blocks with image and video fills.

```kotlin
open class Crop(val style: SheetStyle = SheetStyle(), val mode: SheetType.Crop.Mode) : SheetType
```


## Members

### Crop

```kotlin
constructor(style: SheetStyle = SheetStyle(), mode: SheetType.Crop.Mode)
```

### mode

```kotlin
val mode: SheetType.Crop.Mode
```

### style

```kotlin
open override val style: SheetStyle
```

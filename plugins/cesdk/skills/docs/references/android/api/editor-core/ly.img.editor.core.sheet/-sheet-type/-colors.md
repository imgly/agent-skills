# Colors

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that is used to control the fill and stroke color of design blocks. Selected color is tried to be applied to both fill and stroke. It is applied to: - fill if both ly.img.engine.BlockApi.supportsFill and ly.img.engine.BlockApi.isFillEnabled are true. - stroke if both ly.img.engine.BlockApi.supportsStroke and ly.img.engine.BlockApi.isStrokeEnabled are true. In case the target design block has a name (via ly.img.engine.BlockApi.getName), it is displayed as title for the section.

```kotlin
class Colors(val style: SheetStyle = SheetStyle(), val designBlocks: List<DesignBlock>) : SheetType
```


## Members

### Colors

```kotlin
constructor(style: SheetStyle = SheetStyle(), designBlocks: List<DesignBlock>)
```

### designBlocks

```kotlin
val designBlocks: List<DesignBlock>
```

### style

```kotlin
open override val style: SheetStyle
```

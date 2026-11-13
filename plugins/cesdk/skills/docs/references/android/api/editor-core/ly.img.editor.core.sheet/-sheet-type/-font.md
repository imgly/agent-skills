# Font

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that is used to control the font of the text designBlock.

```kotlin
class Font(val style: SheetStyle = SheetStyle(), val designBlock: DesignBlock, val fontFamilies: List<String>? = null) : SheetType
```


## Members

### Font

```kotlin
constructor(style: SheetStyle = SheetStyle(), designBlock: DesignBlock, fontFamilies: List<String>? = null)
```

### designBlock

```kotlin
val designBlock: DesignBlock
```

### fontFamilies

```kotlin
val fontFamilies: List<String>? = null
```

### style

```kotlin
open override val style: SheetStyle
```

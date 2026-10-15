# Transition

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that configures the transition owned by outgoingBlock.

```kotlin
class Transition(val outgoingBlock: DesignBlock, val style: SheetStyle = SheetStyle()) : SheetType
```


## Members

### Transition

```kotlin
constructor(outgoingBlock: DesignBlock, style: SheetStyle = SheetStyle())
```

### outgoingBlock

```kotlin
val outgoingBlock: DesignBlock
```

### style

```kotlin
open override val style: SheetStyle
```

the style that should be used to display the sheet.

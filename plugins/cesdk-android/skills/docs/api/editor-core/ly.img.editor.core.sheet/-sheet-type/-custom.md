# Custom

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A custom sheet with custom content. Note that if you need the content to be scrollable, then you need to add it manually.

```kotlin
class Custom(val style: SheetStyle, val content: @Composable EditorScope.() -> Unit) : SheetType
```


## Members

### Custom

```kotlin
constructor(style: SheetStyle, content: @Composable EditorScope.() -> Unit)
```

### content

```kotlin
val content: @Composable EditorScope.() -> Unit
```

### style

```kotlin
open override val style: SheetStyle
```

# Companion

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

```kotlin
object Companion
```


## Members

### getDefault

```kotlin
fun getDefault(editorContext: EditorContext, designBlock: DesignBlock): Selection
```

Default implementation of Selection for a given designBlock.

### supportedDesignBlockTypes

```kotlin
val supportedDesignBlockTypes: Set<DesignBlockType>
```

The design block types that the selection-driven editor UI components support. Blocks of other types stay selectable on the canvas, but the editor does not offer any editing UI for them yet.

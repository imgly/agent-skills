# ItemScope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Scope of the items inside the CanvasMenu.

```kotlin
@Stable
open class ItemScope(parentScope: EditorScope) : EditorScope
```


## Members

### ItemScope

```kotlin
constructor(parentScope: EditorScope)
```

### canSelectionBringForward

```kotlin
val EditorContext.canSelectionBringForward: Boolean
```

Returns true if the selection can be brought forward in the z-order.

### canSelectionMove

```kotlin
val EditorContext.canSelectionMove: Boolean
```

Returns true if the selection can be moved: forward or backward.

### canSelectionSendBackward

```kotlin
val EditorContext.canSelectionSendBackward: Boolean
```

Returns true if the selection can be sent backward in the z-order.

### isSelectionInGroup

```kotlin
val EditorContext.isSelectionInGroup: Boolean
```

Returns true if the design block in selection is in a DesignBlockType.Group.

### safeSelection

```kotlin
val EditorContext.safeSelection: Selection?
```

Current selection of the editor.

### selectionSiblings

```kotlin
val EditorContext.selectionSiblings: List<DesignBlock>
```

Returns the list of siblings of the design block in selection that can be used to reorder. Note that the list contains Selection.designBlock as well.

### selection

```kotlin
val EditorContext.selection: Selection
```

Current selection of the editor. Note that this is an unsafe call. Consider using safeSelection to get the nullable value.

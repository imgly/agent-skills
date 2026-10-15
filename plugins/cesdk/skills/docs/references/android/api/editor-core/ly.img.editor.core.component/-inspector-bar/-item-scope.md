# ItemScope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Scope of the items inside the InspectorBar.

```kotlin
@Stable
open class ItemScope(parentScope: EditorScope) : EditorScope
```


## Members

### ItemScope

```kotlin
constructor(parentScope: EditorScope)
```

### safeSelection

```kotlin
val EditorContext.safeSelection: Selection?
```

Current selection of the editor.

### selection

```kotlin
val EditorContext.selection: Selection
```

Current selection of the editor. Note that this is an unsafe call. Consider using safeSelection to get the nullable value.

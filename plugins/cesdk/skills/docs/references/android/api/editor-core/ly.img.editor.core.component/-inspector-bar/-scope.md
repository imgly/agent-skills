# Scope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Scope of the InspectorBar component.

```kotlin
@Stable
open class Scope(parentScope: EditorScope, selection: Selection?, editMode: String) : EditorScope
```


## Members

### Scope

```kotlin
constructor(parentScope: EditorScope, selection: Selection?, editMode: String)
```

### editMode

```kotlin
val EditorContext.editMode: String
```

Current edit mode of the editor.

### safeSelection

```kotlin
val EditorContext.safeSelection: Selection?
```

Current selection in the editor.

### selection

```kotlin
val EditorContext.selection: Selection
```

Current selection in the editor. Note that this is an unsafe call. Consider using safeSelection to get the nullable value.

# Scope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Scope of the Timeline component.

```kotlin
@Stable
open class Scope(parentScope: EditorScope, expandedState: MutableState<Boolean>) : EditorScope
```


## Members

### Scope

```kotlin
constructor(parentScope: EditorScope, expandedState: MutableState<Boolean>)
```

### expandedState

```kotlin
val EditorContext.expandedState: MutableState<Boolean>
```

Current selection of the editor.

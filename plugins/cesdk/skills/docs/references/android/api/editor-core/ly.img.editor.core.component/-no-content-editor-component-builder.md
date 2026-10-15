# NoContentEditorComponentBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Implementation of EditorComponentBuilder where content is empty. Useful when component does not need to have any special structure and UI can be provided via decoration.

```kotlin
abstract class NoContentEditorComponentBuilder<Scope : EditorScope> : EditorComponentBuilder<EditorComponent<Scope>, Scope>
```


## Members

### NoContentEditorComponentBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): EditorComponent<Scope>
```

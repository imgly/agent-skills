# AbstractDividerBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for Divider.

```kotlin
@Stable
abstract class AbstractDividerBuilder<Scope : EditorScope> : EditorComponentBuilder<Divider<Scope>, Scope>
```


## Members

### AbstractDividerBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): Divider<Scope>
```

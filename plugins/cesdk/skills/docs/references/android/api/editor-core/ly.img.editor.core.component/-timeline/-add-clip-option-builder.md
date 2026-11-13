# AddClipOptionBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for AddClipOption.

```kotlin
@Stable
open class AddClipOptionBuilder : Timeline.AbstractOptionBuilder<Timeline.AddClipOption>
```


## Members

### AddClipOptionBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Timeline.ItemScope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.ItemScope>): Timeline.AddClipOption
```

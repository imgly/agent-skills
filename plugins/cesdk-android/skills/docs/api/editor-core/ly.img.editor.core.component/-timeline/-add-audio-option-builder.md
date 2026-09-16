# AddAudioOptionBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for AddAudioOption.

```kotlin
@Stable
open class AddAudioOptionBuilder : Timeline.AbstractOptionBuilder<Timeline.AddAudioOption>
```


## Members

### AddAudioOptionBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Timeline.ItemScope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.ItemScope>): Timeline.AddAudioOption
```

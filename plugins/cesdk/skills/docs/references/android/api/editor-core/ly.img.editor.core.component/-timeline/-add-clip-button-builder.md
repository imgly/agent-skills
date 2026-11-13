# AddClipButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for AddClipButton.

```kotlin
@Stable
open class AddClipButtonBuilder : Timeline.AbstractAddButtonBuilder<Timeline.AddClipButton>
```


## Members

### AddClipButtonBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Timeline.ItemScope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.ItemScope>): Timeline.AddClipButton
```

### containerColor

```kotlin
open override var containerColor: ScopedProperty<Timeline.ItemScope, Color>
```

Container (background) color of the button. Default value is always surface3 from MaterialTheme.colorScheme.

### id

```kotlin
open override var id: ScopedProperty<Timeline.ItemScope, EditorComponentId>
```

Unique id of this component. By default the value is Timeline.Button.Id.addClip.

### optionsBuilder

```kotlin
open var optionsBuilder: ScopedProperty<Timeline.ItemScope, UnalignedListBuilder<Timeline.AddClipOption>>
```

The entries that are displayed in the button's menu. When only a single entry remains, clicking the button triggers it directly instead of opening a menu.

### text

```kotlin
open override var text: @Composable Timeline.ItemScope.() -> Unit?
```

The label of the button. A lone option has no menu to open, so by default the button names that option instead.

### visible

```kotlin
open override var visible: ScopedProperty<Timeline.ItemScope, Boolean>
```

Whether the button should be visible. By default, the button is visible as long as one option is.

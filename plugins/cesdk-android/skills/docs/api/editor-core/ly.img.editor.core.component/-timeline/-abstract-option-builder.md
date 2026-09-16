# AbstractOptionBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class shared by the entries of the Timeline's "Add Clip" and "Add Audio" menus. The properties match the other configurable components, so an entry is configured the way a Dock or InspectorBar button is.

```kotlin
@Stable
abstract class AbstractOptionBuilder<Target : EditorComponent<Timeline.ItemScope>> : EditorComponentBuilder<Target, Timeline.ItemScope>
```


## Members

### AbstractOptionBuilder

```kotlin
constructor()
```

### contentDescription

```kotlin
open var contentDescription: @Composable Timeline.ItemScope.() -> String?
```

Content description of this entry. Useful for handling accessibility issues. Default value is null.

### enabled

```kotlin
open var enabled: ScopedProperty<Timeline.ItemScope, Boolean>
```

Whether the entry is enabled or not. Default value is always true.

### icon

```kotlin
open var icon: @Composable Timeline.ItemScope.() -> Unit?
```

Composable function that is used to render an icon. Can be used to draw ambiguous content. By default, no icon is applied.

### onClick

```kotlin
open var onClick: Timeline.ItemScope.() -> Unit
```

Callback that is invoked when the entry is clicked. By default, it does nothing.

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, Timeline.ItemScope>
```

Scope of this component. By default, it is updated only when the parent scope (accessed via this) is updated.

### textString

```kotlin
open var textString: ScopedProperty<Timeline.ItemScope, String>?
```

Custom implementation of text that provides a text from a string. By default no text string is applied.

### text

```kotlin
open var text: @Composable Timeline.ItemScope.() -> Unit?
```

Composable function that is used to render a text. Can be used to draw ambiguous content. By default no text is applied.

### vectorIcon

```kotlin
open var vectorIcon: ScopedProperty<Timeline.ItemScope, ImageVector>?
```

Custom implementation of icon that provides an icon from a vector resource. By default no vector icon is applied.

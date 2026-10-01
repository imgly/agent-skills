# AbstractAddButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class shared by the Timeline's "Add Clip" and "Add Audio" buttons. The properties match the other configurable components, so the buttons are configured the way a Dock button is.

```kotlin
@Stable
abstract class AbstractAddButtonBuilder<Target : EditorComponent<Timeline.ItemScope>> : EditorComponentBuilder<Target, Timeline.ItemScope>
```


## Members

### AbstractAddButtonBuilder

```kotlin
constructor()
```

### containerColor

```kotlin
abstract var containerColor: ScopedProperty<Timeline.ItemScope, Color>
```

Container (background) color of the button. Every subclass sets a default.

### contentDescription

```kotlin
open var contentDescription: @Composable Timeline.ItemScope.() -> String?
```

Content description of this button. Useful for handling accessibility issues. Default value is null.

### contentPadding

```kotlin
open var contentPadding: ScopedProperty<Timeline.ItemScope, PaddingValues>
```

Content padding of the button. By default the padding matches the built-in lane buttons.

### enabled

```kotlin
open var enabled: ScopedProperty<Timeline.ItemScope, Boolean>
```

Whether the button is enabled or not. Default value is always true.

### icon

```kotlin
open var icon: @Composable Timeline.ItemScope.() -> Unit?
```

Composable function that is used to render an icon. Can be used to draw ambiguous content. Default value is IconPack.Plus.

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, Timeline.ItemScope>
```

Scope of this component. By default it is updated only when the parent scope (accessed via this) is updated.

### textString

```kotlin
open var textString: ScopedProperty<Timeline.ItemScope, String>?
```

Custom implementation of text that provides a text from a string. Assigning it also drops the built-in naming of a lone menu entry.

### text

```kotlin
open var text: @Composable Timeline.ItemScope.() -> Unit?
```

Composable function that is used to render a text. Can be used to draw ambiguous content. Every subclass sets a default.

### tint

```kotlin
open var tint: ScopedProperty<Timeline.ItemScope, Color>
```

Tint of this button. Default value is always onSurface from MaterialTheme.colorScheme.

### vectorIcon

```kotlin
open var vectorIcon: ScopedProperty<Timeline.ItemScope, ImageVector>?
```

Custom implementation of icon that provides an icon from a vector resource. The icon is sized to match the built-in one.

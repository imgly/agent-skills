# AbstractButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Abstract builder class for Button.

```kotlin
@Stable
abstract class AbstractButtonBuilder<Scope : EditorScope> : EditorComponentBuilder<Button<Scope>, Scope>
```


## Members

### AbstractButtonBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): Button<Scope>
```

### containerColor

```kotlin
open var containerColor: ScopedProperty<Scope, Color>
```

Container (background) color of the button. Defaults to Color.Transparent.

### contentDescription

```kotlin
open var contentDescription: @Composable Scope.() -> String?
```

Content description of this button. Useful for handling accessibility issues. Always provide this value if the button does not contain visual text explaining what it does. Default value is null.

### contentPadding

```kotlin
open var contentPadding: ScopedProperty<Scope, PaddingValues>
```

Content padding of the button. By default both vertical and horizontal values are applied.

### enabled

```kotlin
open var enabled: ScopedProperty<Scope, Boolean>
```

Whether button is enabled or not. Default value is always true.

### icon

```kotlin
open var icon: @Composable Scope.() -> Unit?
```

Composable function that is used to render an icon. Can be used to draw ambiguous content. By default no icon is applied.

### onClick

```kotlin
open var onClick: Scope.() -> Unit
```

Callback that is invoked when the button is clicked. By default it does nothing.

### textString

```kotlin
open var textString: ScopedProperty<Scope, String>?
```

Custom implementation of text that provides a text from a string. By default no text string is applied.

### text

```kotlin
open var text: @Composable Scope.() -> Unit?
```

Composable function that is used to render a text. Can be used to draw ambiguous content. By default no text is applied.

### tint

```kotlin
open var tint: ScopedProperty<Scope, Color>
```

Tint of this button. Default value is always onSurfaceVariant from MaterialTheme.colorScheme.

### vectorIcon

```kotlin
open var vectorIcon: ScopedProperty<Scope, ImageVector>?
```

Custom implementation of icon that provides an icon from a vector resource. By default no vector icon is applied.

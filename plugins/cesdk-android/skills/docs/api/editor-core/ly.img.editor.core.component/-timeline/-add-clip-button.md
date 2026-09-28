# AddClipButton

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

The built-in "Add Clip" button of the Timeline. Use Timeline.Button.rememberAddClip composable function to create an instance of this class.

```kotlin
@Stable
data class AddClipButton(val scope: Timeline.ItemScope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Timeline.ItemScope>, val optionsBuilder: UnalignedListBuilder<Timeline.AddClipOption>, val icon: @Composable Timeline.ItemScope.() -> Unit?, val text: @Composable Timeline.ItemScope.() -> Unit?, val enabled: Boolean, val tint: Color, val contentPadding: PaddingValues, val containerColor: Color) : EditorComponent<Timeline.ItemScope>
```


## Members

### AddClipButton

```kotlin
constructor(scope: Timeline.ItemScope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.ItemScope>, optionsBuilder: UnalignedListBuilder<Timeline.AddClipOption>, icon: @Composable Timeline.ItemScope.() -> Unit?, text: @Composable Timeline.ItemScope.() -> Unit?, enabled: Boolean, tint: Color, contentPadding: PaddingValues, containerColor: Color)
```

### containerColor

```kotlin
val containerColor: Color
```

### contentPadding

```kotlin
val contentPadding: PaddingValues
```

### decoration

```kotlin
open override val decoration: ScopedDecoration<Timeline.ItemScope>
```

### enabled

```kotlin
val enabled: Boolean
```

### enterTransition

```kotlin
open override val enterTransition: EnterTransition
```

### exitTransition

```kotlin
open override val exitTransition: ExitTransition
```

### icon

```kotlin
val icon: @Composable Timeline.ItemScope.() -> Unit?
```

### id

```kotlin
open override val id: EditorComponentId
```

### modifier

```kotlin
open override val modifier: Modifier
```

### optionsBuilder

```kotlin
val optionsBuilder: UnalignedListBuilder<Timeline.AddClipOption>
```

### scope

```kotlin
open override val scope: Timeline.ItemScope
```

### text

```kotlin
val text: @Composable Timeline.ItemScope.() -> Unit?
```

### tint

```kotlin
val tint: Color
```

### visible

```kotlin
open override val visible: Boolean
```

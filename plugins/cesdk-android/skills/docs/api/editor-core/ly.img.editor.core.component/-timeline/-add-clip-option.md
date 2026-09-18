# AddClipOption

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A single entry in the Timeline's "Add Clip" menu. Use Timeline.AddClipOption.Companion.rememberCamera and its siblings to create an instance of this class.

```kotlin
@Stable
data class AddClipOption(val scope: Timeline.ItemScope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Timeline.ItemScope>, val onClick: Timeline.ItemScope.() -> Unit, val icon: @Composable Timeline.ItemScope.() -> Unit?, val text: @Composable Timeline.ItemScope.() -> Unit?, val enabled: Boolean) : EditorComponent<Timeline.ItemScope>
```


## Members

### AddClipOption

```kotlin
constructor(scope: Timeline.ItemScope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.ItemScope>, onClick: Timeline.ItemScope.() -> Unit, icon: @Composable Timeline.ItemScope.() -> Unit?, text: @Composable Timeline.ItemScope.() -> Unit?, enabled: Boolean)
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

### onClick

```kotlin
val onClick: Timeline.ItemScope.() -> Unit
```

### scope

```kotlin
open override val scope: Timeline.ItemScope
```

### text

```kotlin
val text: @Composable Timeline.ItemScope.() -> Unit?
```

### visible

```kotlin
open override val visible: Boolean
```

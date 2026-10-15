# Button

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A component for rendering an icon button. Check AbstractButtonBuilder and its superclasses to see what each property does.

```kotlin
@Stable
data class Button<Scope : EditorScope>(val scope: Scope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Scope>, val onClick: Scope.() -> Unit, val icon: @Composable Scope.() -> Unit?, val text: @Composable Scope.() -> Unit?, val tint: Color, val enabled: Boolean, val contentPadding: PaddingValues, val containerColor: Color) : EditorComponent<Scope>
```


## Members

### Button

```kotlin
constructor(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>, onClick: Scope.() -> Unit, icon: @Composable Scope.() -> Unit?, text: @Composable Scope.() -> Unit?, tint: Color, enabled: Boolean, contentPadding: PaddingValues, containerColor: Color)
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
open override val decoration: ScopedDecoration<Scope>
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
val icon: @Composable Scope.() -> Unit?
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
val onClick: Scope.() -> Unit
```

### scope

```kotlin
open override val scope: Scope
```

### text

```kotlin
val text: @Composable Scope.() -> Unit?
```

### tint

```kotlin
val tint: Color
```

### visible

```kotlin
open override val visible: Boolean
```

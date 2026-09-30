# CanvasMenu

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A component for rendering the canvas menu next to a design block when it is selected. Use CanvasMenu.Companion.remember composable function to create an instance of this class. Check AbstractCanvasMenuBuilder and its superclasses to see what each property does.

```kotlin
@Stable
data class CanvasMenu<Scope : CanvasMenu.Scope>(val scope: Scope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Scope>, val listBuilder: HorizontalListBuilder<EditorComponent<*>>, val itemDecoration: ScopedDecoration<Scope>) : EditorComponent<Scope>
```


## Members

### CanvasMenu

```kotlin
constructor(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>, listBuilder: HorizontalListBuilder<EditorComponent<*>>, itemDecoration: ScopedDecoration<Scope>)
```

### decoration

```kotlin
open override val decoration: ScopedDecoration<Scope>
```

### enterTransition

```kotlin
open override val enterTransition: EnterTransition
```

### exitTransition

```kotlin
open override val exitTransition: ExitTransition
```

### id

```kotlin
open override val id: EditorComponentId
```

### itemDecoration

```kotlin
val itemDecoration: ScopedDecoration<Scope>
```

### listBuilder

```kotlin
val listBuilder: HorizontalListBuilder<EditorComponent<*>>
```

### modifier

```kotlin
open override val modifier: Modifier
```

### scope

```kotlin
open override val scope: Scope
```

### visible

```kotlin
open override val visible: Boolean
```

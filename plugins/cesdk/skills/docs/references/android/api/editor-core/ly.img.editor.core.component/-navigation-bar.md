# NavigationBar

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A component for rendering the navigation bar at the top of the editor. Use NavigationBar.Companion.remember composable function to create an instance of this class. Check AbstractNavigationBarBuilder and its superclasses to see what each property does.

```kotlin
@Stable
data class NavigationBar<Scope : NavigationBar.Scope>(val scope: Scope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Scope>, val listBuilder: HorizontalListBuilder<EditorComponent<*>>, val horizontalArrangement: Arrangement.Horizontal, val itemDecoration: ScopedDecoration<Scope>) : EditorComponent<Scope>
```


## Members

### NavigationBar

```kotlin
constructor(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>, listBuilder: HorizontalListBuilder<EditorComponent<*>>, horizontalArrangement: Arrangement.Horizontal, itemDecoration: ScopedDecoration<Scope>)
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

### horizontalArrangement

```kotlin
val horizontalArrangement: Arrangement.Horizontal
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

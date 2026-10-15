# InspectorBar

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A component for rendering the inspector bar at the bottom of the editor. Use InspectorBar.Companion.remember composable function to create an instance of this class. Check AbstractInspectorBarBuilder and its superclasses to see what each property does.

```kotlin
@Stable
data class InspectorBar<Scope : InspectorBar.Scope>(val scope: Scope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Scope>, val listBuilder: HorizontalListBuilder<EditorComponent<*>>, val horizontalArrangement: Arrangement.Horizontal, val itemsRowEnterTransition: EnterTransition, val itemsRowExitTransition: ExitTransition, val itemDecoration: ScopedDecoration<Scope>) : EditorComponent<Scope>
```


## Members

### InspectorBar

```kotlin
constructor(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>, listBuilder: HorizontalListBuilder<EditorComponent<*>>, horizontalArrangement: Arrangement.Horizontal, itemsRowEnterTransition: EnterTransition, itemsRowExitTransition: ExitTransition, itemDecoration: ScopedDecoration<Scope>)
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

### itemsRowEnterTransition

```kotlin
val itemsRowEnterTransition: EnterTransition
```

### itemsRowExitTransition

```kotlin
val itemsRowExitTransition: ExitTransition
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

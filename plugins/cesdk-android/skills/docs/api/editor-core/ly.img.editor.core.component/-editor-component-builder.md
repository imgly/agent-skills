# EditorComponentBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Base builder class of all EditorComponents.

```kotlin
@Stable
abstract class EditorComponentBuilder<Target : EditorComponent<Scope>, Scope : EditorScope>
```


## Members

### EditorComponentBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
abstract fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): Target
```

```kotlin
@Composable
fun build(): Target
```

### decoration

```kotlin
open var decoration: ScopedDecoration<Scope>
```

Decoration of this component. Useful when you want to add custom background, foreground, shadow, paddings etc. By default no decoration is applied.

### enterTransition

```kotlin
open var enterTransition: ScopedProperty<Scope, EnterTransition>
```

Transition of the component when it enters the parent composable. By default no transition is applied.

### exitTransition

```kotlin
open var exitTransition: ScopedProperty<Scope, ExitTransition>
```

Transition of the component when it exits the parent composable. By default no transition is applied.

### id

```kotlin
open var id: ScopedProperty<Scope, EditorComponentId>
```

Unique id of this component. By default property is not initialized.

### modifier

```kotlin
open var modifier: ScopedProperty<Scope, Modifier>
```

Modifier of this component. By default empty Modifier is applied.

### scope

```kotlin
abstract var scope: ScopedProperty<EditorScope, Scope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. Property is abstract.

### visible

```kotlin
open var visible: ScopedProperty<Scope, Boolean>
```

Whether the component should be visible. By default component is always visible.

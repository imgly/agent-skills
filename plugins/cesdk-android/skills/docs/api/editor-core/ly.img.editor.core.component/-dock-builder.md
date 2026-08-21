# DockBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for Dock where the scope is Dock.Scope.

```kotlin
@Stable
open class DockBuilder : AbstractDockBuilder<Dock.Scope>
```


## Members

### DockBuilder

```kotlin
constructor()
```

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, Dock.Scope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default it is updated only when the parent scope (accessed via this) is updated.

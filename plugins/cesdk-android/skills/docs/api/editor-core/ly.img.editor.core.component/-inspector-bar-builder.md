# InspectorBarBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for InspectorBar where the scope is InspectorBar.Scope.

```kotlin
@Stable
open class InspectorBarBuilder : AbstractInspectorBarBuilder<InspectorBar.Scope>
```


## Members

### InspectorBarBuilder

```kotlin
constructor()
```

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, InspectorBar.Scope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the inspector bar. Also prefer updating individual EditorComponents over updating the whole InspectorBar. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default InspectorBar.Companion.rememberDefaultScope is used.

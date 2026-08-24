# FillStrokeButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for the rememberFillStroke button.

```kotlin
@Stable
open class FillStrokeButtonBuilder : AbstractButtonBuilder<FillStrokeItemScope>
```


## Members

### FillStrokeButtonBuilder

```kotlin
constructor()
```

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, FillStrokeItemScope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default the value is updated whenever ly.img.editor.core.component.data.EditorIcon.FillStroke visually changes for any selected design block.

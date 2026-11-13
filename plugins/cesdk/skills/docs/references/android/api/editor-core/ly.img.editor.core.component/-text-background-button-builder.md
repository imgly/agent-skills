# TextBackgroundButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for the rememberTextBackground button.

```kotlin
@Stable
open class TextBackgroundButtonBuilder : AbstractButtonBuilder<TextBackgroundItemScope>
```


## Members

### TextBackgroundButtonBuilder

```kotlin
constructor()
```

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, TextBackgroundItemScope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default the value is updated whenever ly.img.editor.core.component.data.EditorIcon visually changes for any selected design block.

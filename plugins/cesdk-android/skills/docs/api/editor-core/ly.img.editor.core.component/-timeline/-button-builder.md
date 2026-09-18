# ButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class of ly.img.editor.core.component.Button components inside the Timeline header.

```kotlin
@Stable
open class ButtonBuilder : AbstractButtonBuilder<Timeline.ItemScope>
```


## Members

### ButtonBuilder

```kotlin
constructor()
```

### modifier

```kotlin
open override var modifier: ScopedProperty<Timeline.ItemScope, Modifier>
```

Modifier of this component. By default, the size matches the touch target of the built-in header buttons.

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, Timeline.ItemScope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. Property is abstract.

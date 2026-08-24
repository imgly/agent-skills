# ButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class of Button component inside the CanvasMenu.

```kotlin
@Stable
open class ButtonBuilder : AbstractButtonBuilder<CanvasMenu.ItemScope>
```


## Members

### ButtonBuilder

```kotlin
constructor()
```

### contentPadding

```kotlin
open override var contentPadding: ScopedProperty<CanvasMenu.ItemScope, PaddingValues>
```

Content padding of the button. By default no paddings are applied.

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, CanvasMenu.ItemScope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default it is updated only when the parent scope (accessed via this) is updated.

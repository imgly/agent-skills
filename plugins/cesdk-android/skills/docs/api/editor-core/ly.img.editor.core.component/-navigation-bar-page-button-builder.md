# NavigationBarPageButtonBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for rememberPreviousPage and rememberNextPage buttons.

```kotlin
open class NavigationBarPageButtonBuilder : NoContentEditorComponentBuilder<NavigationBar.ItemScope>
```


## Members

### NavigationBarPageButtonBuilder

```kotlin
constructor()
```

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, NavigationBar.ItemScope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default it is updated only when the parent scope (accessed via this) is updated.

### textString

```kotlin
open var textString: ScopedProperty<NavigationBar.ItemScope, String>?
```

Text of the button as string. By default no text string is applied.

### vectorIcon

```kotlin
open var vectorIcon: ScopedProperty<NavigationBar.ItemScope, ImageVector>?
```

Icon of the button as image vector. By default no image vector is applied.

# AbstractDockBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Abstract builder class for Dock.

```kotlin
@Stable
abstract class AbstractDockBuilder<Scope : Dock.Scope> : EditorComponentBuilder<Dock<Scope>, Scope>
```


## Members

### AbstractDockBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): Dock<Scope>
```

### decoration

```kotlin
open override var decoration: ScopedDecoration<Scope>
```

Decoration of this component. Useful when you want to add custom background, foreground, shadow, paddings etc. Default value is Dock.Companion.DefaultDecoration.

### horizontalArrangement

```kotlin
open var horizontalArrangement: ScopedProperty<Scope, Arrangement.Horizontal>
```

Horizontal arrangement that should be used to render the items in the dock horizontally. Note that the value will be ignored in case listBuilder contains aligned items. Check EditorComponent.ListBuilder.New.aligned for more details on how to configure arrangement of aligned items. Default value is Arrangement.Start.

### id

```kotlin
open override var id: ScopedProperty<Scope, EditorComponentId>
```

Unique id of this component. By default the value is "ly.img.component.dock".

### itemDecoration

```kotlin
open var itemDecoration: ScopedDecoration<Scope>
```

Decoration of the items in the dock. Useful when you want to add custom background, foreground, shadow, paddings etc to the items. Prefer using this decoration when you want to apply the same decoration to all the items, otherwise set decoration to individual items. Default value is an empty decoration.

### listBuilder

```kotlin
var listBuilder: ScopedProperty<Scope, HorizontalListBuilder<EditorComponent<*>>>
```

A list builder that builds a list of EditorComponents that should be part of the dock. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that items will be rebuilt when scope is updated. By default listBuilder does not add anything to the dock.

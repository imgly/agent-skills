# AbstractCanvasMenuBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Abstract builder class for CanvasMenu.

```kotlin
@Stable
abstract class AbstractCanvasMenuBuilder<Scope : CanvasMenu.Scope> : EditorComponentBuilder<CanvasMenu<Scope>, Scope>
```


## Members

### AbstractCanvasMenuBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): CanvasMenu<Scope>
```

### decoration

```kotlin
open override var decoration: ScopedDecoration<Scope>
```

Decoration of this component. Useful when you want to add custom background, foreground, shadow, paddings etc. Default value is CanvasMenu.Companion.DefaultDecoration.

### enterTransition

```kotlin
open override var enterTransition: ScopedProperty<Scope, EnterTransition>
```

Transition of the component when it enters the parent composable. Default value is always no enter transition.

### exitTransition

```kotlin
open override var exitTransition: ScopedProperty<Scope, ExitTransition>
```

Transition of the component when it exits the parent composable. Default value is always no exit transition.

### id

```kotlin
open override var id: ScopedProperty<Scope, EditorComponentId>
```

Unique id of this component. By default the value is "ly.img.component.canvasMenu".

### itemDecoration

```kotlin
open var itemDecoration: ScopedDecoration<Scope>
```

Decoration of the items in the canvas menu. Useful when you want to add custom background, foreground, shadow, paddings etc to the items. Prefer using this decoration when you want to apply the same decoration to all the items, otherwise set decoration to individual items. Default value is an empty decoration.

### listBuilder

```kotlin
open var listBuilder: ScopedProperty<Scope, HorizontalListBuilder<EditorComponent<*>>>
```

A builder that builds the list of EditorComponents that should be part of the canvas menu. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that items will be rebuilt when scope is updated. By default listBuilder does not add anything to the canvas menu.

### visible

```kotlin
open override var visible: ScopedProperty<Scope, Boolean>
```

Whether the component should be visible. Default value is true when touch is not active, no sheet is displayed currently, a design block is selected, the selected design block has a type in Selection.supportedDesignBlockTypes other than DesignBlockType.Audio or DesignBlockType.Page and the keyboard is not visible. In addition, selected design block should be visible at current playback time and containing scene should be on pause if design block is selected in a video scene.

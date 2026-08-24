# AbstractInspectorBarBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Abstract builder class for InspectorBar.

```kotlin
@Stable
abstract class AbstractInspectorBarBuilder<Scope : InspectorBar.Scope> : EditorComponentBuilder<InspectorBar<Scope>, Scope>
```


## Members

### AbstractInspectorBarBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>): InspectorBar<Scope>
```

### decoration

```kotlin
open override var decoration: ScopedDecoration<Scope>
```

Decoration of this component. Useful when you want to add custom background, foreground, shadow, paddings etc. Default value is InspectorBar.Companion.DefaultDecoration.

### enterTransition

```kotlin
open override var enterTransition: ScopedProperty<Scope, EnterTransition>
```

Transition of the component when it enters the parent composable. Default value is a vertical slide in transition.

### exitTransition

```kotlin
open override var exitTransition: ScopedProperty<Scope, ExitTransition>
```

Transition of the component when it exits the parent composable. Default value is a vertical slide out transition.

### horizontalArrangement

```kotlin
open var horizontalArrangement: ScopedProperty<Scope, Arrangement.Horizontal>
```

Horizontal arrangement that should be used to render the items in the inspector bar horizontally. Note that the value will be ignored in case listBuilder contains aligned items. Check EditorComponent.ListBuilder.New.aligned for more details on how to configure arrangement of aligned items. Default value is Arrangement.Start.

### id

```kotlin
open override var id: ScopedProperty<Scope, EditorComponentId>
```

Unique id of this component. By default the value is "ly.img.component.inspectorBar".

### itemDecoration

```kotlin
open var itemDecoration: ScopedDecoration<Scope>
```

Decoration of the items in the inspector bar. Useful when you want to add custom background, foreground, shadow, paddings etc to the items. Prefer using this decoration when you want to apply the same decoration to all the items, otherwise set decoration to individual items. Default value is an empty decoration.

### itemsRowEnterTransition

```kotlin
open var itemsRowEnterTransition: ScopedProperty<Scope, EnterTransition>
```

Transition of the items row only (without close button) when enterTransition is running. Default value is a horizontal slide in transition.

### itemsRowExitTransition

```kotlin
open var itemsRowExitTransition: ScopedProperty<Scope, ExitTransition>
```

Transition of the items row only (without close button) when exitTransition is running. Default value is always no exit transition.

### listBuilder

```kotlin
var listBuilder: ScopedProperty<Scope, HorizontalListBuilder<EditorComponent<*>>>
```

A list builder that builds a list of EditorComponents that should be part of the inspector bar. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that items will be rebuilt when scope is updated. By default listBuilder does not add anything to the inspector bar.

### visible

```kotlin
open override var visible: ScopedProperty<Scope, Boolean>
```

Whether the component should be visible. Default value is true if a block with a type in Selection.supportedDesignBlockTypes is selected, the edit mode is not "Crop" and the active sheet is not SheetType.Voiceover. The inspector bar is also visible when the voiceover sheet is closing.

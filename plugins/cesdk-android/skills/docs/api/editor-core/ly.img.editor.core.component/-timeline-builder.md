# TimelineBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Builder class for Timeline.

```kotlin
@Stable
open class TimelineBuilder : EditorComponentBuilder<Timeline, Timeline.Scope>
```


## Members

### TimelineBuilder

```kotlin
constructor()
```

### build

```kotlin
@Composable
open override fun build(scope: Timeline.Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.Scope>): Timeline
```

### decoration

```kotlin
open override var decoration: ScopedDecoration<Timeline.Scope>
```

Decoration of this component. Useful when you want to add custom background, foreground, shadow, paddings etc. Default value is Timeline.Companion.DefaultDecoration.

### id

```kotlin
open override var id: ScopedProperty<Timeline.Scope, EditorComponentId>
```

Unique id of this component. By default the value is "ly.img.component.timeline".

### scope

```kotlin
open override var scope: ScopedProperty<EditorScope, Timeline.Scope>
```

Scope of this component. Every new value will trigger recomposition of all ScopedPropertys such as visible, enterTransition, exitTransition etc. Consider using Compose androidx.compose.runtime.State objects in the lambdas for granular recompositions over updating the scope, since scope change triggers full recomposition of the component. Ideally, scope should be updated when the parent scope (scope of the parent component) is updated and when you want to observe changes from the Engine. By default it is updated only when the parent scope (accessed via this) is updated.

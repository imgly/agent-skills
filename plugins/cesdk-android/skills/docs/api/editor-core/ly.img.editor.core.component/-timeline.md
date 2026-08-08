# Timeline

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A component for rendering the timeline. Use Timeline.Companion.remember composable function to create an instance of this class. Check TimelineBuilder and its superclasses to see what each property does.

```kotlin
@Stable
data class Timeline(val scope: Timeline.Scope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Timeline.Scope>) : EditorComponent<Timeline.Scope>
```


## Members

### Timeline

```kotlin
constructor(scope: Timeline.Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Timeline.Scope>)
```

### decoration

```kotlin
open override val decoration: ScopedDecoration<Timeline.Scope>
```

### enterTransition

```kotlin
open override val enterTransition: EnterTransition
```

### exitTransition

```kotlin
open override val exitTransition: ExitTransition
```

### id

```kotlin
open override val id: EditorComponentId
```

### modifier

```kotlin
open override val modifier: Modifier
```

### scope

```kotlin
open override val scope: Timeline.Scope
```

### visible

```kotlin
open override val visible: Boolean
```

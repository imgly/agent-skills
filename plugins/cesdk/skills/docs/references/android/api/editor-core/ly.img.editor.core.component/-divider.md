# Divider

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A component that represents a divider.

```kotlin
@Stable
data class Divider<Scope : EditorScope>(val scope: Scope, val id: EditorComponentId, val modifier: Modifier, val visible: Boolean, val enterTransition: EnterTransition, val exitTransition: ExitTransition, val decoration: ScopedDecoration<Scope>) : EditorComponent<Scope>
```


## Members

### Divider

```kotlin
constructor(scope: Scope, id: EditorComponentId, modifier: Modifier, visible: Boolean, enterTransition: EnterTransition, exitTransition: ExitTransition, decoration: ScopedDecoration<Scope>)
```

### decoration

```kotlin
open override val decoration: ScopedDecoration<Scope>
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
open override val scope: Scope
```

### visible

```kotlin
open override val visible: Boolean
```

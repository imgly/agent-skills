# EditorComponent

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A class that represents a component that can be rendered in the editor. Use EditorComponent.Companion.remember function to create ambiguous components or use our inherited classes. Check EditorComponentBuilder to see what each property does.

```kotlin
@Stable
abstract class EditorComponent<Scope : EditorScope>
```


## Members

### EditorComponent

```kotlin
constructor()
```

### decoration

```kotlin
abstract val decoration: ScopedDecoration<Scope>
```

### enterTransition

```kotlin
abstract val enterTransition: EnterTransition
```

### exitTransition

```kotlin
abstract val exitTransition: ExitTransition
```

### id

```kotlin
abstract val id: EditorComponentId
```

### modifier

```kotlin
abstract val modifier: Modifier
```

### scope

```kotlin
abstract val scope: Scope
```

### visible

```kotlin
abstract val visible: Boolean
```

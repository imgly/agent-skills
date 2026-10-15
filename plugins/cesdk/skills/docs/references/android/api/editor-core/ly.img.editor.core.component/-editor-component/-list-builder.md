# ListBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A utility class for building list of EditorComponents.

```kotlin
@Stable
abstract class ListBuilder<Item : EditorComponent<*>, Alignment : Any, Arrangement : Any>
```


## Members

### ListBuilder

```kotlin
constructor()
```

### buildLocal

```kotlin
@Composable
abstract fun EditorScope.buildLocal(): Map<Alignment?, EditorComponent.ListBuilder.AlignmentData<Item, Arrangement>>
```

### build

```kotlin
@Composable
fun build(scope: EditorScope): Map<Alignment?, EditorComponent.ListBuilder.AlignmentData<Item, Arrangement>>
```

Returns mapping between Alignment and list of items. Note that null key in that map corresponds to no Alignment (items that were added outside aligned { ... }.

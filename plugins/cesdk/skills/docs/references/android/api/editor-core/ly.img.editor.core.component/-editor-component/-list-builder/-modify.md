# Modify

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A scope that allows only modifications on the original ListBuilder.

```kotlin
class Modify<Item : EditorComponent<*>, Alignment : Any, Arrangement : Any> : EditorComponent.ListBuilder<Item, Alignment, Arrangement>
```


## Members

### addAfter

```kotlin
fun addAfter(id: EditorComponentId, failIfNotFound: Boolean = true, block: ScopedProperty<EditorScope, Item>)
```

Adds a new EditorComponent item right after previously added EditorComponent with id. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that EditorScope in the block builder is the scope of the parent EditorComponent.

### addBefore

```kotlin
fun addBefore(id: EditorComponentId, failIfNotFound: Boolean = true, block: ScopedProperty<EditorScope, Item>)
```

Adds a new EditorComponent item right before previously added EditorComponent with id. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that EditorScope in the block builder is the scope of the parent EditorComponent.

### addFirst

```kotlin
fun addFirst(block: ScopedProperty<EditorScope, Item>)
```

```kotlin
fun addFirst(alignment: Alignment, block: ScopedProperty<EditorScope, Item>)
```

Prepends a new EditorComponent item in the list. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that EditorScope in the block builder is the scope of the parent EditorComponent.

### addLast

```kotlin
fun addLast(block: ScopedProperty<EditorScope, Item>)
```

```kotlin
fun addLast(alignment: Alignment, block: ScopedProperty<EditorScope, Item>)
```

Appends a new EditorComponent item in the list. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that EditorScope in the block builder is the scope of the parent EditorComponent.

### buildLocal

```kotlin
@Composable
open override fun EditorScope.buildLocal(): MutableMap<Alignment?, EditorComponent.ListBuilder.AlignmentData<Item, Arrangement>>
```

### remove

```kotlin
fun remove(id: EditorComponentId, failIfNotFound: Boolean = true)
```

Removes the EditorComponent with id = id that was previously added in the source.

### replace

```kotlin
fun replace(id: EditorComponentId, failIfNotFound: Boolean = true, block: ScopedProperty<EditorScope, Item>)
```

Replaces the EditorComponent with id = id that was previously added in the source. Note that EditorScope in the block builder is the scope of the parent EditorComponent.

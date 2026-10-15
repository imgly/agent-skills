# New

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

A scope that allows only appending new items.

```kotlin
class New<Item : EditorComponent<*>, Alignment : Any, Arrangement : Any> : EditorComponent.ListBuilder<Item, Alignment, Arrangement>
```


## Members

### New

```kotlin
constructor()
```

### add

```kotlin
fun add(block: ScopedProperty<EditorScope, Item>)
```

Appends a new EditorComponent item in the list. Note that adding items to the list does not mean displaying. The items will be displayed if EditorComponent.visible is true for them. Also note that EditorScope in the block builder is the scope of the parent EditorComponent.

### aligned

```kotlin
fun aligned(alignment: Alignment, arrangement: Arrangement? = null, block: () -> Unit)
```

Starts a new aligned group in the component. All add invocations withing block will be grouped together, be aligned via alignment and be arranged via arrangement. Note that it is not allowed to add items both inside and outside align block at the same time meaning all items should either be part of aligned groups or there should not be aligned groups at all.

### buildLocal

```kotlin
@Composable
open override fun EditorScope.buildLocal(): Map<Alignment?, EditorComponent.ListBuilder.AlignmentData<Item, Arrangement>>
```

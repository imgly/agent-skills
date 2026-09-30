# AlignmentProviderData

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

```kotlin
class AlignmentProviderData<Item : EditorComponent<*>, Arrangement : Any>(val arrangement: Arrangement?, val items: List<ScopedProperty<EditorScope, Item>>)
```


## Members

### AlignmentProviderData

```kotlin
constructor(arrangement: Arrangement?, items: List<ScopedProperty<EditorScope, Item>>)
```

### arrangement

```kotlin
val arrangement: Arrangement?
```

### items

```kotlin
val items: List<ScopedProperty<EditorScope, Item>>
```

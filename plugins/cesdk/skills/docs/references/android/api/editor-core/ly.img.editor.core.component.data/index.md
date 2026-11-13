# ly.img.editor.core.component.data

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### unsafeLazy

```kotlin
fun <T> unsafeLazy(initializer: () -> T): Lazy<T>
```

A convenience function for creating a Lazy object with no thread safety.

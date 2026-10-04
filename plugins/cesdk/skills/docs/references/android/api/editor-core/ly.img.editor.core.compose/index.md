# ly.img.editor.core.compose

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.compose`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### rememberLastValue

```kotlin
@Composable
inline fun <T> rememberLastValue(crossinline calculation: @DisallowComposableCalls RememberLastScope<T>.() -> T): T
```

```kotlin
@Composable
inline fun <T> rememberLastValue(key: Any?, crossinline calculation: @DisallowComposableCalls RememberLastScope<T>.() -> T): T
```

```kotlin
@Composable
inline fun <T> rememberLastValue(key1: Any?, key2: Any?, crossinline calculation: @DisallowComposableCalls RememberLastScope<T>.() -> T): T
```

```kotlin
@Composable
inline fun <T> rememberLastValue(key1: Any?, key2: Any?, key3: Any?, crossinline calculation: @DisallowComposableCalls RememberLastScope<T>.() -> T): T
```

```kotlin
@Composable
inline fun <T> rememberLastValue(vararg keys: Any?, crossinline calculation: @DisallowComposableCalls RememberLastScope<T>.() -> T): T
```

An extension to the regular remember function that allows accessing last calculated value in the calculation block.

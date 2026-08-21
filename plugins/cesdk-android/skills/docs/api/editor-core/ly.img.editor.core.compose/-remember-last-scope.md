# RememberLastScope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.compose`

The scope class of calculation block in rememberLastValue functions.

```kotlin
class RememberLastScope<T>
```


## Members

### RememberLastScope

```kotlin
constructor()
```

### isValueSet

```kotlin
val isValueSet: Boolean
```

Whether rememberLastValue block has returned value before.

### lastValue

```kotlin
val lastValue: T
```

Last value, that was returned by calculation block in rememberLastValue. Note that accessing this property will throw an exception if calculation block has not returned any value before. Use isValueSet to check if value was set before.

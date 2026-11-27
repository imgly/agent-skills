# CombineOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The options of BlockApi.combine.

```kotlin
data class CombineOptions(val editable: Boolean = false)
```


## Members

### CombineOptions

```kotlin
constructor(editable: Boolean = false)
```

### editable

```kotlin
val editable: Boolean = false
```

Whether the blocks stay as the parts of a compound shape, which BlockApi.releaseCombination takes apart again. The default value is false: the result is one vector path.

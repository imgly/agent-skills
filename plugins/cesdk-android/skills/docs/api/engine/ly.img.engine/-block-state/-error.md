# Error

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

There's an error preventing rendering.

```kotlin
data class Error(val type: BlockState.Error.Type) : BlockState
```


## Members

### Error

```kotlin
constructor(typeOrdinal: Int)
```

```kotlin
constructor(type: BlockState.Error.Type)
```

### type

```kotlin
val type: BlockState.Error.Type
```

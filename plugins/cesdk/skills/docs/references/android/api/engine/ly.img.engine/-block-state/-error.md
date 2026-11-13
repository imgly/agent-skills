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

### engineError

```kotlin
var engineError: EngineException?
```

The catalog error behind type, when the engine knows it, for example the code SCENE.LOTTIE_ARCHIVE_UNSAFE_PATH for a .lottie archive with an entry outside it. It has the fields of the EngineException that a failed call throws. null for an error that BlockApi.setState set, or that has no catalog error. It is not part of equals.

### type

```kotlin
val type: BlockState.Error.Type
```

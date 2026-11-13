# Pending

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

There is an ongoing operation on the block. Rendering may be affected.

```kotlin
data class Pending(@FloatRange(from = 0.0, to = 1.0)val progress: Float) : BlockState
```


## Members

### Pending

```kotlin
constructor(@FloatRange(from = 0.0, to = 1.0)progress: Float)
```

### progress

```kotlin
val progress: Float
```

The progress is in the range of 0, 1.

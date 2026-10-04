# CMYK

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class CMYK(@FloatRange(from = 0.0, to = 1.0)val c: Float, @FloatRange(from = 0.0, to = 1.0)val m: Float, @FloatRange(from = 0.0, to = 1.0)val y: Float, @FloatRange(from = 0.0, to = 1.0)val k: Float) : AssetColor.Representation
```


## Members

### CMYK

```kotlin
constructor(@FloatRange(from = 0.0, to = 1.0)c: Float, @FloatRange(from = 0.0, to = 1.0)m: Float, @FloatRange(from = 0.0, to = 1.0)y: Float, @FloatRange(from = 0.0, to = 1.0)k: Float)
```

### c

```kotlin
val c: Float
```

The cyan color component in the range of 0 to 1.

### k

```kotlin
val k: Float
```

The black color component in the range of 0 to 1.

### m

```kotlin
val m: Float
```

The magenta color component in the range of 0 to 1.

### y

```kotlin
val y: Float
```

The yellow color component in the range of 0 to 1.

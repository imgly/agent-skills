# RGB

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class RGB(@FloatRange(from = 0.0, to = 1.0)val r: Float, @FloatRange(from = 0.0, to = 1.0)val g: Float, @FloatRange(from = 0.0, to = 1.0)val b: Float) : AssetColor.Representation
```


## Members

### RGB

```kotlin
constructor(@FloatRange(from = 0.0, to = 1.0)r: Float, @FloatRange(from = 0.0, to = 1.0)g: Float, @FloatRange(from = 0.0, to = 1.0)b: Float)
```

### b

```kotlin
val b: Float
```

The blue color component in the range of 0 to 1.

### g

```kotlin
val g: Float
```

The green color component in the range of 0 to 1.

### r

```kotlin
val r: Float
```

The red color component in the range of 0 to 1.

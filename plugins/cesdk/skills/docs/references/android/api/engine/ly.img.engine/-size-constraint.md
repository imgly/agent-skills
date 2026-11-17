# SizeConstraint

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The smallest and the largest frame size that user interactions can give a block, in design units. A value that is null has no limit on that side.

```kotlin
data class SizeConstraint(val minWidth: Float? = null, val maxWidth: Float? = null, val minHeight: Float? = null, val maxHeight: Float? = null)
```


## Members

### SizeConstraint

```kotlin
constructor(minWidth: Float? = null, maxWidth: Float? = null, minHeight: Float? = null, maxHeight: Float? = null)
```

### maxHeight

```kotlin
val maxHeight: Float? = null
```

### maxWidth

```kotlin
val maxWidth: Float? = null
```

### minHeight

```kotlin
val minHeight: Float? = null
```

### minWidth

```kotlin
val minWidth: Float? = null
```

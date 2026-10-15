# Insets

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

Insets of a component.

```kotlin
data class Insets(val left: Dp, val top: Dp, val right: Dp, val bottom: Dp)
```


## Members

### Insets

```kotlin
constructor(horizontal: Dp, vertical: Dp)
```

```kotlin
constructor(value: Dp)
```

```kotlin
constructor(left: Dp, top: Dp, right: Dp, bottom: Dp)
```

Convenience constructor for equal insets on each direction.

### bottom

```kotlin
val bottom: Dp
```

### div

```kotlin
operator fun div(factor: Float): Insets
```

Div operator implementation that divides the values of each side by factor.

### left

```kotlin
val left: Dp
```

### minus

```kotlin
operator fun minus(other: Insets): Insets
```

Minus operator implementation that subtracts other's values on each side.

### plus

```kotlin
operator fun plus(other: Insets): Insets
```

Plus operator implementation that adds other's values on each side.

### right

```kotlin
val right: Dp
```

### times

```kotlin
operator fun times(factor: Float): Insets
```

Times operator implementation that multiplies the values of each side by factor.

### top

```kotlin
val top: Dp
```

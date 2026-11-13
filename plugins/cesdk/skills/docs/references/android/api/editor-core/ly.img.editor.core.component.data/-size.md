# Size

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

Size of a component.

```kotlin
data class Size(val width: Dp, val height: Dp)
```


## Members

### Size

```kotlin
constructor(value: Dp)
```

```kotlin
constructor(width: Dp, height: Dp)
```

Convenience constructor for equal width and height.

### div

```kotlin
operator fun div(factor: Float): Size
```

Div operator implementation that divides the values of width and height by factor.

### height

```kotlin
val height: Dp
```

### minus

```kotlin
operator fun minus(other: Size): Size
```

Minus operator implementation that subtracts other's width and height.

### plus

```kotlin
operator fun plus(other: Size): Size
```

Plus operator implementation that adds other's width and height.

### times

```kotlin
operator fun times(factor: Float): Size
```

Times operator implementation that multiplies the values of width and height by factor.

### width

```kotlin
val width: Dp
```

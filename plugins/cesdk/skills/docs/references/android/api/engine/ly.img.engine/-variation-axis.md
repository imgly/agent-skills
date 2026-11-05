# VariationAxis

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A variation axis of a variable font, read from its fvar table.

```kotlin
data class VariationAxis(val tag: String, val minValue: Float, val defaultValue: Float, val maxValue: Float)
```


## Members

### VariationAxis

```kotlin
constructor(tag: String, minValue: Float, defaultValue: Float, maxValue: Float)
```

### defaultValue

```kotlin
val defaultValue: Float
```

The value of the axis in the default instance of the font.

### maxValue

```kotlin
val maxValue: Float
```

The largest value of the axis.

### minValue

```kotlin
val minValue: Float
```

The smallest value of the axis.

### tag

```kotlin
val tag: String
```

The four-letter OpenType axis tag, such as wght, wdth or ital.

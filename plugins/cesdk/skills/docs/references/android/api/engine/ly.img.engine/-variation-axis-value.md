# VariationAxisValue

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A value for one variation axis of a variable font, such as wdth or opsz.

```kotlin
data class VariationAxisValue(val tag: String, val value: Float)
```


## Members

### VariationAxisValue

```kotlin
constructor(tag: String, value: Float)
```

### tag

```kotlin
val tag: String
```

The four-character OpenType axis tag, such as wght, wdth or opsz.

### value

```kotlin
val value: Float
```

The axis value in the units of the font's fvar table. The font clamps it to the range of the axis.

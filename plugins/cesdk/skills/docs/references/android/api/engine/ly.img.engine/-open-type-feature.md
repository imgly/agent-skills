# OpenTypeFeature

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

An OpenType feature setting for a text range, such as tnum for tabular figures.

```kotlin
data class OpenTypeFeature(val tag: String, @IntRange(from = 0)val value: Int = 1)
```


## Members

### OpenTypeFeature

```kotlin
constructor(tag: String, @IntRange(from = 0)value: Int = 1)
```

### tag

```kotlin
val tag: String
```

The four-character OpenType feature tag, such as tnum, ss01 or zero.

### value

```kotlin
val value: Int = 1
```

0 turns the feature off, 1 turns it on, and a larger value selects an alternate by its index. BlockApi.setTextOpenTypeFeatures rejects a negative value.

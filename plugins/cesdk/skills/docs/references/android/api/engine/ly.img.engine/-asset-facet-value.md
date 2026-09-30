# AssetFacetValue

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

One bucket of a facet distribution.

```kotlin
data class AssetFacetValue(val value: String, val count: Int? = null)
```


## Members

### AssetFacetValue

```kotlin
constructor(value: String, count: Int? = null)
```

### count

```kotlin
val count: Int? = null
```

Number of matched assets carrying this value. Always set by local asset sources; custom asset sources may omit it when counting is expensive.

### value

```kotlin
val value: String
```

Raw value exactly as stored on the assets (no casing or locale normalization).

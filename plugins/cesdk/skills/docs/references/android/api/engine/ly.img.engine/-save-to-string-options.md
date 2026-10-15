# SaveToStringOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Options for saving a scene to string.

```kotlin
data class SaveToStringOptions(val allowedResourceSchemes: List<String> = listOf("blob", "bundle", "file", "http", "https"), val compression: CompressionOptions? = null)
```


## Members

### SaveToStringOptions

```kotlin
constructor(allowedResourceSchemes: List<String> = listOf("blob", "bundle", "file", "http", "https"), compression: CompressionOptions? = null)
```

### allowedResourceSchemes

```kotlin
val allowedResourceSchemes: List<String>
```

### compression

```kotlin
val compression: CompressionOptions? = null
```

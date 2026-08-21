# CompressionOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Compression options for scene serialization.

```kotlin
data class CompressionOptions(val format: CompressionFormat = CompressionFormat.ZSTD, val level: CompressionLevel = CompressionLevel.DEFAULT)
```


## Members

### CompressionOptions

```kotlin
constructor(format: CompressionFormat = CompressionFormat.ZSTD, level: CompressionLevel = CompressionLevel.DEFAULT)
```

### format

```kotlin
val format: CompressionFormat
```

### level

```kotlin
val level: CompressionLevel
```

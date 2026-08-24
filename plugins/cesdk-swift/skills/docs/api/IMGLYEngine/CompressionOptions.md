# CompressionOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CompressionOptions`

Compression options for scene serialization.

```swift
struct CompressionOptions
```

## Members

### format

```swift
var format: CompressionFormat
```

The compression format to use.

### init(format:level:)

```swift
init(format: CompressionFormat = .zstd, level: CompressionLevel = .default)
```

Initialize compression options.

### level

```swift
var level: CompressionLevel
```

The compression level to use.

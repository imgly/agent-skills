# SaveToArchiveOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SaveToArchiveOptions`

Options for saving a scene to an archive.

```swift
struct SaveToArchiveOptions
```

## Members

### compression

```swift
var compression: CompressionOptions?
```

Optional compression settings for the scene inside the archive. Without them, the scene is compressed with Zstd at the default level.

### init(compression:)

```swift
init(compression: CompressionOptions? = nil)
```

Initialize archive save options with default values.

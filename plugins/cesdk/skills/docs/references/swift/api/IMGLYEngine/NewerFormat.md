# NewerFormat

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/NewerFormat`

A loaded scene or blocks string that names a format newer than this engine reads, see `SceneAPI.onNewerFormat`.

```swift
struct NewerFormat
```

## Members

### engineVersion

```swift
let engineVersion: String
```

The newest format version that this engine reads.

### kind

```swift
let kind: String
```

What was loaded: `"scene"` or `"blocks"`.

### minReaderVersion

```swift
let minReaderVersion: String
```

The oldest format version that reads the loaded string without loss.

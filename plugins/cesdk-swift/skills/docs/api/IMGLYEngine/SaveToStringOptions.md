# SaveToStringOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SaveToStringOptions`

Options for saving a scene to string.

```swift
struct SaveToStringOptions
```

## Members

### allowedResourceSchemes

```swift
var allowedResourceSchemes: [String]
```

The resource schemes to allow in the saved string. Defaults to [“blob”, “bundle”, “file”, “http”, “https”].

### compression

```swift
var compression: CompressionOptions?
```

Optional compression settings.

### init(allowedResourceSchemes:onDisallowedResourceScheme:compression:)

```swift
init(allowedResourceSchemes: [String] = ["blob", "bundle", "file", "http", "https"], onDisallowedResourceScheme: (@MainActor @Sendable (URL, String) async -> URL)? = nil, compression: CompressionOptions? = nil)
```

Initialize save options with default values.

### onDisallowedResourceScheme

```swift
var onDisallowedResourceScheme: (@MainActor @Sendable (URL, String) async -> URL)?
```

An optional callback for handling disallowed resource schemes.

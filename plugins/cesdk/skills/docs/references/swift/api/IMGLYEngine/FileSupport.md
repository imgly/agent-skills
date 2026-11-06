# FileSupport

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/FileSupport`

Engine media support; external editable-design importers remain host registrations.

```swift
struct FileSupport
```

## Members

### extensions

```swift
let extensions: [String]
```

Extensions of the engine media path, without dots.

### init(mimeType:extensions:inspection:uses:)

```swift
init(mimeType: String, extensions: [String], inspection: String, uses: [FileSupportUse])
```

### inspection

```swift
let inspection: String
```

`format` for the runtime catalog; `metadata` after header/container inspection.

### mimeType

```swift
let mimeType: String
```

Recognized MIME type, or `unknown`.

### uses

```swift
let uses: [FileSupportUse]
```

Image, audio, and video results, in that order. No result guarantees a complete decode.

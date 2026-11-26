# EmbeddedFont

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/EmbeddedFont`

A font file that an archive of the scene bundles.

```swift
struct EmbeddedFont
```

## Members

### info

```swift
let info: FontInfo
```

The names, license and style of the font. Every name is empty when the file is not a font.

### init(uri:info:)

```swift
init(uri: String, info: FontInfo)
```

### uri

```swift
let uri: String
```

The URI of the font file, with the axis fragment of a variable font when the scene names one.

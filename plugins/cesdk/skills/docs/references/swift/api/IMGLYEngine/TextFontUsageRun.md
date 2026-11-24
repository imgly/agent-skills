# TextFontUsageRun

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextFontUsageRun`

Font provenance for a contiguous range of the resolved text in [`text`](textfontusage/text.md).

```swift
struct TextFontUsageRun
```

## Members

### actualFontFileURI

```swift
let actualFontFileURI: String?
```

The loaded opaque font identifier including applied variation axes, or `nil` when no usable face loaded.

### effectiveFontSize

```swift
let effectiveFontSize: Float
```

Laid-out font size in the scene font unit, including automatic and script scaling.

### from

```swift
let from: Int
```

Inclusive start UTF-16 code-unit index in the returned resolved text.

### init(from:to:requestedFontFileURI:actualFontFileURI:status:effectiveFontSize:requested:)

```swift
init(from: Int, to: Int, requestedFontFileURI: String, actualFontFileURI: String?, status: String, effectiveFontSize: Float, requested: FontRequest? = nil)
```

### requested

```swift
let requested: FontRequest?
```

Stored font identity, if this range uses a runtime font request.

### requestedFontFileURI

```swift
let requestedFontFileURI: String
```

The requested opaque font identifier before shaping fallback, including variation axes.

### status

```swift
let status: String
```

`resolved` matches the stored request or URI; `substituted` uses another face; `unresolved` has no usable face. Emoji fonts count as substitutions. `resolved` does not guarantee glyph coverage.

### to

```swift
let to: Int
```

Exclusive end UTF-16 code-unit index in the returned resolved text.

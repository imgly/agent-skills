# TextRenderDiagnostics

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextRenderDiagnostics`

A current shaping snapshot. This does not indicate framebuffer or export completion.

```swift
struct TextRenderDiagnostics
```

## Members

### fontUsage

```swift
let fontUsage: TextFontUsage
```

### init(fontUsage:missingGlyphRanges:layout:)

```swift
init(fontUsage: TextFontUsage, missingGlyphRanges: [Range<Int>], layout: TextLayoutDiagnostics?)
```

### layout

```swift
let layout: TextLayoutDiagnostics?
```

Planar layout, or `nil` while pending, before shaping, or for curved text.

### missingGlyphRanges

```swift
let missingGlyphRanges: [Range<Int>]
```

Half-open UTF-16 ranges in [`text`](../textfontusage/text.md) with no glyph, including curved text.

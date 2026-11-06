# TextRenderDiagnostics

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A current shaping snapshot. This does not indicate framebuffer or export completion.

```kotlin
data class TextRenderDiagnostics(val fontUsage: TextFontUsage, val missingGlyphRanges: List<TextRange>, val layout: TextLayoutDiagnostics?)
```


## Members

### TextRenderDiagnostics

```kotlin
constructor(fontUsage: TextFontUsage, missingGlyphRanges: List<TextRange>, layout: TextLayoutDiagnostics?)
```

### fontUsage

```kotlin
val fontUsage: TextFontUsage
```

### layout

```kotlin
val layout: TextLayoutDiagnostics?
```

Planar layout, or null while pending, before shaping, or for curved text.

### missingGlyphRanges

```kotlin
val missingGlyphRanges: List<TextRange>
```

Half-open UTF-16 ranges in TextFontUsage.text with no glyph, including curved text.

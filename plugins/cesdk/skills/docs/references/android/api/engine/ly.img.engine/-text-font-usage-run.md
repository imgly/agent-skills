# TextFontUsageRun

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Font provenance for a contiguous UTF-16 range in TextFontUsage.text.

```kotlin
data class TextFontUsageRun(val from: Int, val to: Int, val requestedFontFileUri: String, val actualFontFileUri: String?, val status: String, val effectiveFontSize: Float, val requested: FontRequest? = null)
```


## Members

### TextFontUsageRun

```kotlin
constructor(from: Int, to: Int, requestedFontFileUri: String, actualFontFileUri: String?, status: String, effectiveFontSize: Float, requested: FontRequest? = null)
```

### actualFontFileUri

```kotlin
val actualFontFileUri: String?
```

The loaded opaque font identifier including applied variation axes, or null when no usable face loaded.

### effectiveFontSize

```kotlin
val effectiveFontSize: Float
```

Laid-out font size in the scene font unit, including automatic and script scaling.

### from

```kotlin
val from: Int
```

Inclusive start UTF-16 code-unit index in the returned resolved text.

### requestedFontFileUri

```kotlin
val requestedFontFileUri: String
```

The requested opaque font identifier before shaping fallback, including variation axes.

### requested

```kotlin
val requested: FontRequest? = null
```

Stored font identity, if this range uses a runtime font request.

### status

```kotlin
val status: String
```

resolved matches the stored request or URI; substituted uses another face; unresolved has no usable face. Emoji fonts count as substitutions. resolved does not guarantee glyph coverage.

### to

```kotlin
val to: Int
```

Exclusive end UTF-16 code-unit index in the returned resolved text.

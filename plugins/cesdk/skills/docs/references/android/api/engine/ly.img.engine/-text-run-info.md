# TextRunInfo

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Represents a single contiguous text run with uniform formatting. Each run covers a range of grapheme clusters [from, to) within the text block.

```kotlin
data class TextRunInfo(val from: Int, val to: Int, val text: String, val color: Color, val fontWeight: FontWeight, val fontStyle: FontStyle, val fontSize: Float, val textCase: TextCase, val typeface: Typeface, val resolvedFontFileUri: String, val textDecoration: TextDecorationConfig, val kerning: Float)
```


## Members

### TextRunInfo

```kotlin
constructor(from: Int, to: Int, text: String, color: Color, fontWeight: FontWeight, fontStyle: FontStyle, fontSize: Float, textCase: TextCase, typeface: Typeface, resolvedFontFileUri: String, textDecoration: TextDecorationConfig, kerning: Float)
```

### color

```kotlin
val color: Color
```

The text color.

### fontSize

```kotlin
val fontSize: Float
```

The font size in points.

### fontStyle

```kotlin
val fontStyle: FontStyle
```

The font style.

### fontWeight

```kotlin
val fontWeight: FontWeight
```

The font weight.

### from

```kotlin
val from: Int
```

Start grapheme index (inclusive).

### kerning

```kotlin
val kerning: Float
```

Additional kerning offset in em units.

### resolvedFontFileUri

```kotlin
val resolvedFontFileUri: String
```

The resolved font file URI.

### textCase

```kotlin
val textCase: TextCase
```

The text case transformation.

### textDecoration

```kotlin
val textDecoration: TextDecorationConfig
```

The text decoration configuration of this run.

### text

```kotlin
val text: String
```

The text content of this run.

### to

```kotlin
val to: Int
```

End grapheme index (exclusive).

### typeface

```kotlin
val typeface: Typeface
```

The typeface used by this run.

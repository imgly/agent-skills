# FontMetrics

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Font metrics extracted from a font file. Values are in the font's design units coordinate space.

```kotlin
data class FontMetrics(val ascender: Float, val descender: Float, val unitsPerEm: Float, val lineGap: Float, val capHeight: Float, val xHeight: Float, val underlineOffset: Float, val underlineSize: Float, val strikeoutOffset: Float, val strikeoutSize: Float)
```


## Members

### FontMetrics

```kotlin
constructor(ascender: Float, descender: Float, unitsPerEm: Float, lineGap: Float, capHeight: Float, xHeight: Float, underlineOffset: Float, underlineSize: Float, strikeoutOffset: Float, strikeoutSize: Float)
```

### ascender

```kotlin
val ascender: Float
```

The ascender value in font design units.

### capHeight

```kotlin
val capHeight: Float
```

The OS/2 sCapHeight value in font design units.

### descender

```kotlin
val descender: Float
```

The descender value in font design units (typically negative).

### lineGap

```kotlin
val lineGap: Float
```

The OS/2 sTypoLineGap value in font design units.

### strikeoutOffset

```kotlin
val strikeoutOffset: Float
```

The OS/2 yStrikeoutPosition value in font design units.

### strikeoutSize

```kotlin
val strikeoutSize: Float
```

The OS/2 yStrikeoutSize value in font design units.

### underlineOffset

```kotlin
val underlineOffset: Float
```

The post.underlinePosition value in font design units (typically negative).

### underlineSize

```kotlin
val underlineSize: Float
```

The post.underlineThickness value in font design units.

### unitsPerEm

```kotlin
val unitsPerEm: Float
```

The number of units per em square (typically 1000 or 2048).

### xHeight

```kotlin
val xHeight: Float
```

The OS/2 sxHeight value in font design units.

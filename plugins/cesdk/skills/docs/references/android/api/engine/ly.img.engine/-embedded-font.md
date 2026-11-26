# EmbeddedFont

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A font file that an archive of the scene bundles.

```kotlin
data class EmbeddedFont(val uri: String, val info: FontInfo)
```


## Members

### EmbeddedFont

```kotlin
constructor(uri: String, info: FontInfo)
```

### info

```kotlin
val info: FontInfo
```

The names, license and style of the font. Every name is empty when the file is not a font.

### uri

```kotlin
val uri: String
```

The URI of the font file, with the axis fragment of a variable font when the scene names one.

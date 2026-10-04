# Font

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class Font(val uri: Uri, val subFamily: String, val weight: FontWeight, val style: FontStyle)
```


## Members

### Font

```kotlin
constructor(uri: Uri, subFamily: String, weight: FontWeight, style: FontStyle)
```

### style

```kotlin
val style: FontStyle
```

The style of the font.

### subFamily

```kotlin
val subFamily: String
```

The subFamily of the font, like "Bold", "Bold Italic" etc.

### uri

```kotlin
val uri: Uri
```

The uri of the font file.

### weight

```kotlin
val weight: FontWeight
```

The weight of the font.

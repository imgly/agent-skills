# FontInfo

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The identity of a font file: its names, weight, style, variation axes and OpenType features. A variable font is described by its default instance.

```kotlin
data class FontInfo(val family: String, val legacyFamily: String, val subFamily: String, val postScriptName: String, val weight: Int, val fontWeight: FontWeight, val style: FontStyle, val isVariable: Boolean, val variationAxes: List<VariationAxis>, val openTypeFeatures: List<String>)
```


## Members

### FontInfo

```kotlin
constructor(family: String, legacyFamily: String, subFamily: String, postScriptName: String, weight: Int, fontWeight: FontWeight, style: FontStyle, isVariable: Boolean, variationAxes: List<VariationAxis>, openTypeFeatures: List<String>)
```

### family

```kotlin
val family: String
```

The typographic family name (OpenType name ID 16), or the legacy family name when the font has none.

### fontWeight

```kotlin
val fontWeight: FontWeight
```

The named weight that is closest to weight.

### isVariable

```kotlin
val isVariable: Boolean
```

Whether the font has an fvar table.

### legacyFamily

```kotlin
val legacyFamily: String
```

The legacy family name (name ID 1). It can name the weight too, such as "Inter Semi Bold".

### openTypeFeatures

```kotlin
val openTypeFeatures: List<String>
```

The OpenType feature tags of the font's GSUB and GPOS tables, such as tnum or ss01, sorted and without duplicates. BlockApi.setTextOpenTypeFeatures takes these tags.

### postScriptName

```kotlin
val postScriptName: String
```

The PostScript name (name ID 6).

### style

```kotlin
val style: FontStyle
```

FontStyle.ITALIC when the font is marked italic or oblique.

### subFamily

```kotlin
val subFamily: String
```

The typographic subfamily name (name ID 17), or the legacy subfamily name (ID 2) when the font has none.

### variationAxes

```kotlin
val variationAxes: List<VariationAxis>
```

The variation axes of a variable font, in the order of its fvar table. Empty for a static font.

### weight

```kotlin
val weight: Int
```

The weight class from the OS/2 table, from 1 to 1000. Without one, 700 when the head table marks the font bold, otherwise 400.

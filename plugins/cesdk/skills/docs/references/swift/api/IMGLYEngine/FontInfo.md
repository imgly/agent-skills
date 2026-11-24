# FontInfo

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/FontInfo`

The identity of a font file: its names, weight, style, variation axes and OpenType features. A variable font is described by its default instance.

```swift
struct FontInfo
```

## Members

### family

```swift
let family: String
```

The typographic family name (OpenType name ID 16), or the legacy family name when the font has none.

### fontWeight

```swift
let fontWeight: FontWeight
```

The named weight that is closest to `weight`.

### init(family:legacyFamily:subFamily:postScriptName:weight:fontWeight:style:isVariable:variationAxes:openTypeFeatures:)

```swift
init(family: String, legacyFamily: String, subFamily: String, postScriptName: String, weight: Int, fontWeight: FontWeight, style: FontStyle, isVariable: Bool, variationAxes: [VariationAxis], openTypeFeatures: [String])
```

### isVariable

```swift
let isVariable: Bool
```

Whether the font has an `fvar` table.

### legacyFamily

```swift
let legacyFamily: String
```

The legacy family name (name ID 1). It can name the weight too, such as “Inter Semi Bold”.

### openTypeFeatures

```swift
let openTypeFeatures: [String]
```

The OpenType feature tags of the font’s `GSUB` and `GPOS` tables, such as `tnum` or `ss01`, sorted and without duplicates. [`setTextOpenTypeFeatures(_:features:in:)`](../blockapi/settextopentypefeatures(_:features:in:).md) takes these tags.

### postScriptName

```swift
let postScriptName: String
```

The PostScript name (name ID 6).

### style

```swift
let style: FontStyle
```

`.italic` when the font is marked italic or oblique.

### subFamily

```swift
let subFamily: String
```

The typographic subfamily name (name ID 17), or the legacy subfamily name (ID 2) when the font has none.

### variationAxes

```swift
let variationAxes: [VariationAxis]
```

The variation axes of a variable font, in the order of its `fvar` table. Empty for a static font.

### weight

```swift
let weight: Int
```

The weight class from the OS/2 table, from 1 to 1000. Without one, 700 when the `head` table marks the font bold, otherwise 400.

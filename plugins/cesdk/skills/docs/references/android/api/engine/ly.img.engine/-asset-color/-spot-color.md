# SpotColor

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class SpotColor(val name: String, val representation: AssetColor.Representation, val externalReference: String? = null) : AssetColor
```


## Members

### SpotColor

```kotlin
constructor(name: String, representation: AssetColor.Representation, externalReference: String? = null)
```

### externalReference

```kotlin
val externalReference: String? = null
```

The external reference of a spot color, e.g. the name of formula guide it comes from.

### name

```kotlin
val name: String
```

The name of the spot color i.e. "PANTONE 102 C" or "HKS 47".

### representation

```kotlin
val representation: AssetColor.Representation
```

The representation of the spot color. Can be AssetColor.RGB or AssetColor.CMYK.

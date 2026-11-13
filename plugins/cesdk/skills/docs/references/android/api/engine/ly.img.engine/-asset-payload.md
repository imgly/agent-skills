# AssetPayload

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Structured information about the contained asset.

```kotlin
data class AssetPayload(val color: AssetColor? = null, val sourceSet: List<Source>? = null, val typeface: Typeface? = null, val transformPreset: AssetTransformPreset? = null, val properties: List<AssetProperty>? = null, val stylePreset: String? = null)
```


## Members

### AssetPayload

```kotlin
constructor(color: AssetColor? = null, sourceSet: List<Source>? = null, typeface: Typeface? = null, transformPreset: AssetTransformPreset? = null, properties: List<AssetProperty>? = null, stylePreset: String? = null)
```

### color

```kotlin
val color: AssetColor? = null
```

A color representing this asset.

### properties

```kotlin
val properties: List<AssetProperty>? = null
```

Description of the properties of this asset.

### sourceSet

```kotlin
val sourceSet: List<Source>? = null
```

A source set containing different representations of this asset.

### stylePreset

```kotlin
val stylePreset: String? = null
```

A declarative style preset applied to a block via applyAssetSourceAssetToBlock, carried as a raw JSON document. The engine parses and applies it; binding code treats it as an opaque pass-through.

### transformPreset

```kotlin
val transformPreset: AssetTransformPreset? = null
```

A transform preset for this asset.

### typeface

```kotlin
val typeface: Typeface? = null
```

A typeface representing this asset.

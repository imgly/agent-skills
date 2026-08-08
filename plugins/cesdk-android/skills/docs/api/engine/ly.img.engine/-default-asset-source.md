# DefaultAssetSource

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum DefaultAssetSource : Enum<DefaultAssetSource>
```
> **Deprecated:** Uses legacy v4 asset source IDs and will be removed in a future version. Register sources by raw v5 string ID via Engine.asset.addLocalSourceFromJSON(contentUri) instead.


## Members

### BLUR

```kotlin
enum entry BLUR
```

### COLORS_DEFAULT_PALETTE

```kotlin
enum entry COLORS_DEFAULT_PALETTE
```

### CROP_PRESETS

```kotlin
enum entry CROP_PRESETS
```

### EFFECT

```kotlin
enum entry EFFECT
```

### FILTER_DUO_TONE

```kotlin
enum entry FILTER_DUO_TONE
```

### FILTER_LUT

```kotlin
enum entry FILTER_LUT
```

### PAGE_PRESETS

```kotlin
enum entry PAGE_PRESETS
```

### STICKER

```kotlin
enum entry STICKER
```

### TYPEFACE

```kotlin
enum entry TYPEFACE
```

### VECTOR_PATH

```kotlin
enum entry VECTOR_PATH
```

### entries

```kotlin
val entries: EnumEntries<DefaultAssetSource>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

### valueOf

```kotlin
fun valueOf(value: String): DefaultAssetSource
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<DefaultAssetSource>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

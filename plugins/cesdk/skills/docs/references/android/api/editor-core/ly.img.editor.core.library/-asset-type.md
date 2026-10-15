# AssetType

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

Asset types that can be specified when creating a LibraryContent.

```kotlin
enum AssetType : Enum<AssetType>
```


## Members

### Animation

```kotlin
enum entry Animation
```

### Audio

```kotlin
enum entry Audio
```

### Blur

```kotlin
enum entry Blur
```

### Effect

```kotlin
enum entry Effect
```

### Filter

```kotlin
enum entry Filter
```

### Gallery

```kotlin
enum entry Gallery
```

### Image

```kotlin
enum entry Image
```

### Shape

```kotlin
enum entry Shape
```

### Sticker

```kotlin
enum entry Sticker
```

### TextComponent

```kotlin
enum entry TextComponent
```

### TextStylePreset

```kotlin
enum entry TextStylePreset
```

### Text

```kotlin
enum entry Text
```

### Transition

```kotlin
enum entry Transition
```

### Typeface

```kotlin
enum entry Typeface
```

### Video

```kotlin
enum entry Video
```

### entries

```kotlin
val entries: EnumEntries<AssetType>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): AssetType
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<AssetType>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

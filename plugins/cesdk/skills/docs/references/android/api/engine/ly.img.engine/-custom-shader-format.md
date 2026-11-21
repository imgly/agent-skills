# CustomShaderFormat

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Raw simulation storage; presentation preserves stored feedback precision.

```kotlin
enum CustomShaderFormat : Enum<CustomShaderFormat>
```


## Members

### RGBA16_FLOAT

```kotlin
enum entry RGBA16_FLOAT
```

### RGBA32_FLOAT

```kotlin
enum entry RGBA32_FLOAT
```

### entries

```kotlin
val entries: EnumEntries<CustomShaderFormat>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): CustomShaderFormat
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<CustomShaderFormat>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# ColorSpace

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum ColorSpace : Enum<ColorSpace>
```


## Members

### CMYK

```kotlin
enum entry CMYK
```

### SPOT_COLOR

```kotlin
enum entry SPOT_COLOR
```

### SRGB

```kotlin
enum entry SRGB
```

### entries

```kotlin
val entries: EnumEntries<ColorSpace>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ColorSpace
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ColorSpace>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

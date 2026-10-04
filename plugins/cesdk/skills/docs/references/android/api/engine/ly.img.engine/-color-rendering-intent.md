# ColorRenderingIntent

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

How a color that the destination cannot reproduce is mapped into it.

```kotlin
enum ColorRenderingIntent : Enum<ColorRenderingIntent>
```


## Members

### ABSOLUTE_COLORIMETRIC

```kotlin
enum entry ABSOLUTE_COLORIMETRIC
```

### PERCEPTUAL

```kotlin
enum entry PERCEPTUAL
```

### RELATIVE_COLORIMETRIC

```kotlin
enum entry RELATIVE_COLORIMETRIC
```

### SATURATION

```kotlin
enum entry SATURATION
```

### entries

```kotlin
val entries: EnumEntries<ColorRenderingIntent>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ColorRenderingIntent
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: Int
```

### values

```kotlin
fun values(): Array<ColorRenderingIntent>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

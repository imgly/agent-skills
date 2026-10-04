# TextDecorationStyle

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Represents the visual style of a text decoration line.

```kotlin
enum TextDecorationStyle : Enum<TextDecorationStyle>
```


## Members

### DASHED

```kotlin
enum entry DASHED
```

A series of dashes.

### DOTTED

```kotlin
enum entry DOTTED
```

A series of dots.

### DOUBLE

```kotlin
enum entry DOUBLE
```

Two parallel lines.

### SOLID

```kotlin
enum entry SOLID
```

A solid line.

### WAVY

```kotlin
enum entry WAVY
```

A wavy line.

### entries

```kotlin
val entries: EnumEntries<TextDecorationStyle>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): TextDecorationStyle
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<TextDecorationStyle>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

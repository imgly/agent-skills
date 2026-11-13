# TextDecorationLine

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Represents a type of text decoration line. Text decoration lines are combinable — a text range can have multiple decoration lines.

```kotlin
enum TextDecorationLine : Enum<TextDecorationLine>
```


## Members

### NONE

```kotlin
enum entry NONE
```

No text decoration.

### OVERLINE

```kotlin
enum entry OVERLINE
```

The text range is rendered with a line above the text.

### STRIKETHROUGH

```kotlin
enum entry STRIKETHROUGH
```

The text range is rendered with a strikethrough line.

### UNDERLINE

```kotlin
enum entry UNDERLINE
```

The text range is rendered with an underline.

### entries

```kotlin
val entries: EnumEntries<TextDecorationLine>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): TextDecorationLine
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<TextDecorationLine>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# TextCase

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum TextCase : Enum<TextCase>
```


## Members

### LOWER_CASE

```kotlin
enum entry LOWER_CASE
```

All characters of the text range are rendered as lowercase.

### NORMAL

```kotlin
enum entry NORMAL
```

The text is rendered without modifications as specified by the string

### TITLE_CASE

```kotlin
enum entry TITLE_CASE
```

The first letter of each word is uppercase.

### UPPER_CASE

```kotlin
enum entry UPPER_CASE
```

All characters of the text range are rendered as uppercase.

### entries

```kotlin
val entries: EnumEntries<TextCase>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): TextCase
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<TextCase>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

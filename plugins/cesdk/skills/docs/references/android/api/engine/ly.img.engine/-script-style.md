# ScriptStyle

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Represents the script style of a range of text.

```kotlin
enum ScriptStyle : Enum<ScriptStyle>
```


## Members

### NORMAL

```kotlin
enum entry NORMAL
```

The text sits on the regular baseline at its regular size.

### SUBSCRIPT

```kotlin
enum entry SUBSCRIPT
```

The text is scaled down and lowered below the baseline.

### SUPERSCRIPT

```kotlin
enum entry SUPERSCRIPT
```

The text is scaled down and raised above the baseline.

### entries

```kotlin
val entries: EnumEntries<ScriptStyle>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ScriptStyle
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ScriptStyle>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

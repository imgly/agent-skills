# EditorUiMode

- **Module:** `ly.img:editor`
- **Package:** `ly.img.editor`

An enum class for configuring the ui mode of the editor.

```kotlin
enum EditorUiMode : Enum<EditorUiMode>
```


## Members

### DARK

```kotlin
enum entry DARK
```

Display the editor in dark mode.

### LIGHT

```kotlin
enum entry LIGHT
```

Display the editor in light mode.

### SYSTEM

```kotlin
enum entry SYSTEM
```

Display the editor in the same mode as the operating system.

### entries

```kotlin
val entries: EnumEntries<EditorUiMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): EditorUiMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<EditorUiMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

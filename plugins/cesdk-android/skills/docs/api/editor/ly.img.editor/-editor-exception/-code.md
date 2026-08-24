# Code

- **Module:** `ly.img:editor`
- **Package:** `ly.img.editor`

```kotlin
enum Code : Enum<EditorException.Code>
```


## Members

### NO_INTERNET

```kotlin
enum entry NO_INTERNET
```

### entries

```kotlin
val entries: EnumEntries<EditorException.Code>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): EditorException.Code
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<EditorException.Code>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

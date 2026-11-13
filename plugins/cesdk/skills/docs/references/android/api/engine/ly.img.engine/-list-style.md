# ListStyle

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum ListStyle : Enum<ListStyle>
```


## Members

### NONE

```kotlin
enum entry NONE
```

No list style; the paragraph is a normal paragraph.

### ORDERED

```kotlin
enum entry ORDERED
```

Ordered list with a numeric marker.

### UNORDERED

```kotlin
enum entry UNORDERED
```

Unordered list with a bullet marker.

### entries

```kotlin
val entries: EnumEntries<ListStyle>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ListStyle
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ListStyle>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

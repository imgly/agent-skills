# FontUnit

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum FontUnit : Enum<FontUnit>
```


## Members

### PIXEL

```kotlin
enum entry PIXEL
```

### POINT

```kotlin
enum entry POINT
```

### entries

```kotlin
val entries: EnumEntries<FontUnit>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): FontUnit
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<FontUnit>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

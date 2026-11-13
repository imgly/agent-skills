# AngleUnit

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum AngleUnit : Enum<AngleUnit>
```


## Members

### DEGREE

```kotlin
enum entry DEGREE
```

### RADIAN

```kotlin
enum entry RADIAN
```

### entries

```kotlin
val entries: EnumEntries<AngleUnit>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): AngleUnit
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<AngleUnit>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# StrokeStyle

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum StrokeStyle : Enum<StrokeStyle>
```


## Members

### DASHED

```kotlin
enum entry DASHED
```

### DASHED_ROUND

```kotlin
enum entry DASHED_ROUND
```

### DOTTED

```kotlin
enum entry DOTTED
```

### LONG_DASHED

```kotlin
enum entry LONG_DASHED
```

### LONG_DASHED_ROUND

```kotlin
enum entry LONG_DASHED_ROUND
```

### SOLID

```kotlin
enum entry SOLID
```

### entries

```kotlin
val entries: EnumEntries<StrokeStyle>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): StrokeStyle
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<StrokeStyle>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

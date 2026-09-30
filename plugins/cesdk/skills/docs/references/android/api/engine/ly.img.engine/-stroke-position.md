# StrokePosition

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum StrokePosition : Enum<StrokePosition>
```


## Members

### CENTER

```kotlin
enum entry CENTER
```

### INNER

```kotlin
enum entry INNER
```

### OUTER

```kotlin
enum entry OUTER
```

### entries

```kotlin
val entries: EnumEntries<StrokePosition>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): StrokePosition
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<StrokePosition>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

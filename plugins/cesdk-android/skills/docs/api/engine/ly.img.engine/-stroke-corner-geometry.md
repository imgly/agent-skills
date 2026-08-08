# StrokeCornerGeometry

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum StrokeCornerGeometry : Enum<StrokeCornerGeometry>
```


## Members

### BEVEL

```kotlin
enum entry BEVEL
```

### MITER

```kotlin
enum entry MITER
```

### ROUND

```kotlin
enum entry ROUND
```

### entries

```kotlin
val entries: EnumEntries<StrokeCornerGeometry>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): StrokeCornerGeometry
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<StrokeCornerGeometry>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

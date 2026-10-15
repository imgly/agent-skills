# BooleanOperation

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum BooleanOperation : Enum<BooleanOperation>
```


## Members

### DIFFERENCE

```kotlin
enum entry DIFFERENCE
```

### INTERSECTION

```kotlin
enum entry INTERSECTION
```

### UNION

```kotlin
enum entry UNION
```

### XOR

```kotlin
enum entry XOR
```

### entries

```kotlin
val entries: EnumEntries<BooleanOperation>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): BooleanOperation
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<BooleanOperation>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

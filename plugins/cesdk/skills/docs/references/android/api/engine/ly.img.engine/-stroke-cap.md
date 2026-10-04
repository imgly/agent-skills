# StrokeCap

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Controls how the ends of open stroked paths (such as line shapes) are rendered. - BUTT: flat end, no overshoot past the endpoint. - ROUND: semi-circular cap extending half the stroke width past the endpoint. - SQUARE: square cap extending half the stroke width past the endpoint.

```kotlin
enum StrokeCap : Enum<StrokeCap>
```


## Members

### BUTT

```kotlin
enum entry BUTT
```

### ROUND

```kotlin
enum entry ROUND
```

### SQUARE

```kotlin
enum entry SQUARE
```

### entries

```kotlin
val entries: EnumEntries<StrokeCap>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): StrokeCap
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<StrokeCap>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# VerticalBlockAlignment

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum VerticalBlockAlignment : Enum<VerticalBlockAlignment>
```


## Members

### BOTTOM

```kotlin
enum entry BOTTOM
```

The blocks get bottom aligned.

### CENTER

```kotlin
enum entry CENTER
```

The blocks get center aligned.

### TOP

```kotlin
enum entry TOP
```

The blocks get top aligned.

### entries

```kotlin
val entries: EnumEntries<VerticalBlockAlignment>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): VerticalBlockAlignment
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<VerticalBlockAlignment>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

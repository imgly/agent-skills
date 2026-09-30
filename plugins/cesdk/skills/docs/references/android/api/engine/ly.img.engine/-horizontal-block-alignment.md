# HorizontalBlockAlignment

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum HorizontalBlockAlignment : Enum<HorizontalBlockAlignment>
```


## Members

### CENTER

```kotlin
enum entry CENTER
```

The blocks get center aligned.

### LEFT

```kotlin
enum entry LEFT
```

The blocks get left aligned.

### RIGHT

```kotlin
enum entry RIGHT
```

The blocks get right aligned.

### entries

```kotlin
val entries: EnumEntries<HorizontalBlockAlignment>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): HorizontalBlockAlignment
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<HorizontalBlockAlignment>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# HorizontalAlignment

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum HorizontalAlignment : Enum<HorizontalAlignment>
```


## Members

### Auto

```kotlin
enum entry Auto
```

Match alignment to the text direction.

### Center

```kotlin
enum entry Center
```

Align text to the center.

### Left

```kotlin
enum entry Left
```

Align text to the left.

### Right

```kotlin
enum entry Right
```

Align text to the right.

### entries

```kotlin
val entries: EnumEntries<HorizontalAlignment>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): HorizontalAlignment
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<HorizontalAlignment>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

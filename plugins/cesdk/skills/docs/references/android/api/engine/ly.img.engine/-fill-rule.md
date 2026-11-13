# FillRule

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Fill rule for resolving self-intersecting or overlapping subpaths of a vector path shape. Use with the shape/vector_path/fillRule enum property.

```kotlin
enum FillRule : Enum<FillRule>
```


## Members

### EVEN_ODD

```kotlin
enum entry EVEN_ODD
```

### NON_ZERO

```kotlin
enum entry NON_ZERO
```

### entries

```kotlin
val entries: EnumEntries<FillRule>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

### valueOf

```kotlin
fun valueOf(value: String): FillRule
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<FillRule>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# DesignUnit

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum DesignUnit : Enum<DesignUnit>
```


## Members

### INCH

```kotlin
enum entry INCH
```

### MILLIMETER

```kotlin
enum entry MILLIMETER
```

### PIXEL

```kotlin
enum entry PIXEL
```

### entries

```kotlin
val entries: EnumEntries<DesignUnit>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): DesignUnit
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<DesignUnit>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

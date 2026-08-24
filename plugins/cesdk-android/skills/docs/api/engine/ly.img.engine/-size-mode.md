# SizeMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum SizeMode : Enum<SizeMode>
```


## Members

### ABSOLUTE

```kotlin
enum entry ABSOLUTE
```

Size in absolute design units.

### AUTO

```kotlin
enum entry AUTO
```

Size is automatically determined.

### PERCENT

```kotlin
enum entry PERCENT
```

Size in relation to the block's parent's size in percent, where 1.0 means 100%.

### entries

```kotlin
val entries: EnumEntries<SizeMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SizeMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SizeMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

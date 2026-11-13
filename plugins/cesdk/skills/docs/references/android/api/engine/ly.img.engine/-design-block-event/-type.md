# Type

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum Type : Enum<DesignBlockEvent.Type>
```


## Members

### CREATED

```kotlin
enum entry CREATED
```

### DESTROYED

```kotlin
enum entry DESTROYED
```

### UPDATED

```kotlin
enum entry UPDATED
```

### entries

```kotlin
val entries: EnumEntries<DesignBlockEvent.Type>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): DesignBlockEvent.Type
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<DesignBlockEvent.Type>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

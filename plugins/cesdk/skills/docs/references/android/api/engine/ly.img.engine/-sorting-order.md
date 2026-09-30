# SortingOrder

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source.

```kotlin
enum SortingOrder : Enum<SortingOrder>
```


## Members

### ASCENDING

```kotlin
enum entry ASCENDING
```

### DESCENDING

```kotlin
enum entry DESCENDING
```

### NONE

```kotlin
enum entry NONE
```

### entries

```kotlin
val entries: EnumEntries<SortingOrder>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SortingOrder
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SortingOrder>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

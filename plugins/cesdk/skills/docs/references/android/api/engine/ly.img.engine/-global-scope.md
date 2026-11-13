# GlobalScope

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum GlobalScope : Enum<GlobalScope>
```


## Members

### ALLOW

```kotlin
enum entry ALLOW
```

### DEFER

```kotlin
enum entry DEFER
```

### DENY

```kotlin
enum entry DENY
```

### entries

```kotlin
val entries: EnumEntries<GlobalScope>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): GlobalScope
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<GlobalScope>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

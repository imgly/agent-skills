# ContentFillMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum ContentFillMode : Enum<ContentFillMode>
```


## Members

### CONTAIN

```kotlin
enum entry CONTAIN
```

Automatically contain content inside frame.

### COVER

```kotlin
enum entry COVER
```

Automatically cover the entire frame.

### CROP

```kotlin
enum entry CROP
```

Manual crop.

### entries

```kotlin
val entries: EnumEntries<ContentFillMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ContentFillMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ContentFillMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

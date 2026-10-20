# MatteMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The channel of a matte source that masks a block. The order matches the engine values. Experimental: this API may change in a minor release.

```kotlin
enum MatteMode : Enum<MatteMode>
```


## Members

### ALPHA

```kotlin
enum entry ALPHA
```

The block shows where the source is opaque.

### ALPHA_INVERTED

```kotlin
enum entry ALPHA_INVERTED
```

The block shows where the source is transparent.

### LUMA

```kotlin
enum entry LUMA
```

The block shows where the source is bright.

### LUMA_INVERTED

```kotlin
enum entry LUMA_INVERTED
```

The block shows where the source is dark or transparent.

### entries

```kotlin
val entries: EnumEntries<MatteMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): MatteMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<MatteMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# Type

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum Type : Enum<BlockState.Error.Type>
```


## Members

### AUDIO_DECODING

```kotlin
enum entry AUDIO_DECODING
```

Failed to decode the block's audio stream.

### FILE_FETCH

```kotlin
enum entry FILE_FETCH
```

Failed to retrieve the block's remote content.

### IMAGE_DECODING

```kotlin
enum entry IMAGE_DECODING
```

Failed to decode the block's image stream.

### UNKNOWN

```kotlin
enum entry UNKNOWN
```

An unknown error occurred.

### VIDEO_DECODING

```kotlin
enum entry VIDEO_DECODING
```

Failed to decode the block's video stream.

### entries

```kotlin
val entries: EnumEntries<BlockState.Error.Type>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): BlockState.Error.Type
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<BlockState.Error.Type>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

# AV1EncodingMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

How an AV1 export trades speed for quality. Other codecs ignore it.

```kotlin
enum AV1EncodingMode : Enum<AV1EncodingMode>
```


## Members

### QUALITY

```kotlin
enum entry QUALITY
```

A sharper video at the same bitrate, but the export takes about ten times as long and about three times the memory.

### REALTIME

```kotlin
enum entry REALTIME
```

The fast mode.

### entries

```kotlin
val entries: EnumEntries<AV1EncodingMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): AV1EncodingMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: Int
```

### values

```kotlin
fun values(): Array<AV1EncodingMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

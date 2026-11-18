# TimeBase

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The clock that the keyframes of a block run over.

```kotlin
enum TimeBase : Enum<TimeBase>
```


## Members

### BLOCK

```kotlin
enum entry BLOCK
```

Keyframe times are normalized over the block's playback duration.

### MEDIA

```kotlin
enum entry MEDIA
```

Keyframe times are normalized over the total duration of the video that the block shows.

### entries

```kotlin
val entries: EnumEntries<TimeBase>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): TimeBase
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<TimeBase>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

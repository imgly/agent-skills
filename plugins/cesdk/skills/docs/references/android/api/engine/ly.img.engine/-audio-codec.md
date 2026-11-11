# AudioCodec

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The audio codec of a video export. An MP4 file holds AAC and OPUS, and a WebM file holds OPUS and VORBIS.

```kotlin
enum AudioCodec : Enum<AudioCodec>
```


## Members

### AAC

```kotlin
enum entry AAC
```

AAC-LC.

### AUTO

```kotlin
enum entry AUTO
```

AAC for an MP4 file, Opus for a WebM file.

### OPUS

```kotlin
enum entry OPUS
```

Opus, bundled with the engine.

### VORBIS

```kotlin
enum entry VORBIS
```

Vorbis, bundled with the engine.

### entries

```kotlin
val entries: EnumEntries<AudioCodec>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): AudioCodec
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: Int
```

### values

```kotlin
fun values(): Array<AudioCodec>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

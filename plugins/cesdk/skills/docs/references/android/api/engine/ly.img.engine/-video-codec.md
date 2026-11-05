# VideoCodec

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The codec of a video export. MimeType.MP4 holds H264 and HEVC, and MimeType.WEBM holds VP8, VP9 and AV1.

```kotlin
enum VideoCodec : Enum<VideoCodec>
```


## Members

### AUTO

```kotlin
enum entry AUTO
```

H.264 for MimeType.MP4, VP9 for MimeType.WEBM.

### AV1

```kotlin
enum entry AV1
```

AV1, bundled with the engine.

### HEVC

```kotlin
enum entry HEVC
```

H.265 / HEVC.

### H264

```kotlin
enum entry H264
```

H.264 / AVC.

### VP8

```kotlin
enum entry VP8
```

VP8, bundled with the engine.

### VP9

```kotlin
enum entry VP9
```

VP9, bundled with the engine.

### entries

```kotlin
val entries: EnumEntries<VideoCodec>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): VideoCodec
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: Int
```

### values

```kotlin
fun values(): Array<VideoCodec>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

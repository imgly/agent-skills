# MimeType

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum MimeType : Enum<MimeType>
```


## Members

### AUDIO_MP4

```kotlin
enum entry AUDIO_MP4
```

An MP4 audio file, AAC by default, from BlockApi.exportAudio.

### AUDIO_WAV

```kotlin
enum entry AUDIO_WAV
```

An uncompressed WAV file from BlockApi.exportAudio.

### AUDIO_WEBM

```kotlin
enum entry AUDIO_WEBM
```

A WebM audio file, Opus by default, from BlockApi.exportAudio.

### BINARY

```kotlin
enum entry BINARY
```

### JPEG

```kotlin
enum entry JPEG
```

### MP4

```kotlin
enum entry MP4
```

### PDF

```kotlin
enum entry PDF
```

### PNG

```kotlin
enum entry PNG
```

### SVG

```kotlin
enum entry SVG
```

### TGA

```kotlin
enum entry TGA
```

### WEBM

```kotlin
enum entry WEBM
```

### WEBP

```kotlin
enum entry WEBP
```

A WebP image from BlockApi.export. ExportOptions.webpQuality sets the quality.

### entries

```kotlin
val entries: EnumEntries<MimeType>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

### valueOf

```kotlin
fun valueOf(value: String): MimeType
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<MimeType>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

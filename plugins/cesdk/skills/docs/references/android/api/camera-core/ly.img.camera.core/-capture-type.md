# CaptureType

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Determines what kind of media the camera can capture. Defaults to Video to preserve the existing camera behavior.

```kotlin
enum CaptureType : Enum<CaptureType>
```


## Members

### Mixed

```kotlin
enum entry Mixed
```

The camera captures both photos and videos. The user picks the active sub-mode via a photo↔video toggle rendered in the bottom-center of the camera UI.

### Photo

```kotlin
enum entry Photo
```

The camera captures still photos only. Tap-to-shoot. Microphone permission is not requested.

### Video

```kotlin
enum entry Video
```

The camera captures videos only. This is the legacy behavior.

### entries

```kotlin
val entries: EnumEntries<CaptureType>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): CaptureType
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<CaptureType>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

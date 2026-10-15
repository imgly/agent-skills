# CaptureCount

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Determines whether the camera produces a single capture per session or a stack of captures. Defaults to Multi to preserve the existing camera behavior.

```kotlin
enum CaptureCount : Enum<CaptureCount>
```


## Members

### Multi

```kotlin
enum entry Multi
```

The camera produces a list of captures stacked into the recording-segments ring.

### Single

```kotlin
enum entry Single
```

The camera produces exactly one capture and finishes. The recording-segments ring and the delete-last-clip button are hidden.

### entries

```kotlin
val entries: EnumEntries<CaptureCount>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): CaptureCount
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<CaptureCount>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

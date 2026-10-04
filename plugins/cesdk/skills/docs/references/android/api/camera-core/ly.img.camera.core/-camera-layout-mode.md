# CameraLayoutMode

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Determines the layout of the two video feeds in reaction mode.

```kotlin
enum CameraLayoutMode : Enum<CameraLayoutMode>
```


## Members

### Horizontal

```kotlin
enum entry Horizontal
```

Displays two video feeds next to each other.

### Vertical

```kotlin
enum entry Vertical
```

Displays two video feeds, one on top of the other.

### entries

```kotlin
val entries: EnumEntries<CameraLayoutMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): CameraLayoutMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<CameraLayoutMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

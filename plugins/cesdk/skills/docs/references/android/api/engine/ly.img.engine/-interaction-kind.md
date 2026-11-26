# InteractionKind

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The edit that an interaction performs on the selected blocks, as a drag of the matching handle would.

```kotlin
enum InteractionKind : Enum<InteractionKind>
```


## Members

### CROP_MOVE

```kotlin
enum entry CROP_MOVE
```

Moves the content inside the crop frame. Needs the Crop edit mode.

### CROP_RESIZE

```kotlin
enum entry CROP_RESIZE
```

Resizes the crop frame, as an inner crop handle does. Needs the Crop edit mode.

### CROP_SCALE

```kotlin
enum entry CROP_SCALE
```

Scales the content inside the crop frame, as an outer crop handle does. Needs the Crop edit mode.

### MOVE

```kotlin
enum entry MOVE
```

### RESIZE

```kotlin
enum entry RESIZE
```

### ROTATE

```kotlin
enum entry ROTATE
```

### entries

```kotlin
val entries: EnumEntries<InteractionKind>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): InteractionKind
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<InteractionKind>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

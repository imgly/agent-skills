# CameraResizeAnchor

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The point of the viewport that keeps showing the same scene point when the viewport resizes.

```kotlin
enum CameraResizeAnchor : Enum<CameraResizeAnchor>
```


## Members

### BOTTOM

```kotlin
enum entry BOTTOM
```

### BOTTOM_LEFT

```kotlin
enum entry BOTTOM_LEFT
```

### BOTTOM_RIGHT

```kotlin
enum entry BOTTOM_RIGHT
```

### CENTER

```kotlin
enum entry CENTER
```

### LEFT

```kotlin
enum entry LEFT
```

### RIGHT

```kotlin
enum entry RIGHT
```

### TOP

```kotlin
enum entry TOP
```

### TOP_LEFT

```kotlin
enum entry TOP_LEFT
```

### TOP_RIGHT

```kotlin
enum entry TOP_RIGHT
```

### entries

```kotlin
val entries: EnumEntries<CameraResizeAnchor>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): CameraResizeAnchor
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<CameraResizeAnchor>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

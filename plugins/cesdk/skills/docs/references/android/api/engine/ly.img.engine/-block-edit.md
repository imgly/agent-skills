# BlockEdit

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

An edit of a block that a variable binding can lock. The order matches the engine values.

```kotlin
enum BlockEdit : Enum<BlockEdit>
```


## Members

### CROP

```kotlin
enum entry CROP
```

A change of the crop.

### FLIP

```kotlin
enum entry FLIP
```

A horizontal or vertical flip.

### MOVE

```kotlin
enum entry MOVE
```

A change of the position, on either axis.

### MOVE_X

```kotlin
enum entry MOVE_X
```

A change of the x position.

### MOVE_Y

```kotlin
enum entry MOVE_Y
```

A change of the y position.

### RESIZE

```kotlin
enum entry RESIZE
```

A change of the width or the height, or of both.

### RESIZE_HEIGHT

```kotlin
enum entry RESIZE_HEIGHT
```

A change of the height.

### RESIZE_WIDTH

```kotlin
enum entry RESIZE_WIDTH
```

A change of the width.

### ROTATE

```kotlin
enum entry ROTATE
```

A change of the rotation.

### SCALE

```kotlin
enum entry SCALE
```

A scale of the block with everything below it, as a content-aware resize does.

### entries

```kotlin
val entries: EnumEntries<BlockEdit>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): BlockEdit
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<BlockEdit>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

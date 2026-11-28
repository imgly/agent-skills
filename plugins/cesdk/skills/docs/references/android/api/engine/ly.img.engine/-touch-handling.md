# TouchHandling

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

How the touch events of a view bound with Engine.bindSurfaceView or Engine.bindTextureView reach the engine.

```kotlin
enum TouchHandling : Enum<TouchHandling>
```


## Members

### AUTOMATIC

```kotlin
enum entry AUTOMATIC
```

The engine sets a touch listener on the view and takes every touch event of it.

### MANUAL

```kotlin
enum entry MANUAL
```

The engine sets no touch listener. The host passes the events that the engine should handle to Engine.onTouchEvent, so it can share the touches of the view with its own gestures.

### entries

```kotlin
val entries: EnumEntries<TouchHandling>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): TouchHandling
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<TouchHandling>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

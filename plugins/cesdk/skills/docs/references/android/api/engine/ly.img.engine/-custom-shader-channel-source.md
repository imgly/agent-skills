# CustomShaderChannelSource

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Source of a pass channel.

```kotlin
enum CustomShaderChannelSource : Enum<CustomShaderChannelSource>
```


## Members

### BACKDROP

```kotlin
enum entry BACKDROP
```

The composited background prefix, excluding this output and later siblings; the name must be empty.

### CURRENT_PASS

```kotlin
enum entry CURRENT_PASS
```

### EFFECT_INPUT

```kotlin
enum entry EFFECT_INPUT
```

The image entering this effect in its render chain; the channel name must be empty.

### EMPTY

```kotlin
enum entry EMPTY
```

Transparent RGBA zero sampled from a 1x1 texture.

### INPUT

```kotlin
enum entry INPUT
```

### PREVIOUS_PASS

```kotlin
enum entry PREVIOUS_PASS
```

### TRANSITION_INCOMING

```kotlin
enum entry TRANSITION_INCOMING
```

The incoming clip of a custom-shader transition; only transitions accept it, and the name must be empty.

### TRANSITION_OUTGOING

```kotlin
enum entry TRANSITION_OUTGOING
```

The outgoing clip of a custom-shader transition; only transitions accept it, and the name must be empty.

### entries

```kotlin
val entries: EnumEntries<CustomShaderChannelSource>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): CustomShaderChannelSource
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<CustomShaderChannelSource>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

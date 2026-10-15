# AudioContext

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum AudioContext : Enum<AudioContext>
```


## Members

### AUTO

```kotlin
enum entry AUTO
```

A context, where Engine has the ability to play audio streams.

### NONE

```kotlin
enum entry NONE
```

A context, where Engine should not play any audio.

### entries

```kotlin
val entries: EnumEntries<AudioContext>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): AudioContext
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<AudioContext>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

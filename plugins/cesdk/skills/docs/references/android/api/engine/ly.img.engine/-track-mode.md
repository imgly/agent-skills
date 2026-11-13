# TrackMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

How a keyframe track combines with the static value of its property. Experimental: this API may change in a minor release.

```kotlin
enum TrackMode : Enum<TrackMode>
```


## Members

### ABSOLUTE

```kotlin
enum entry ABSOLUTE
```

The track value replaces the static value.

### RELATIVE

```kotlin
enum entry RELATIVE
```

The track value is added to the static value. Only float and vec2 properties accept this mode.

### entries

```kotlin
val entries: EnumEntries<TrackMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): TrackMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<TrackMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

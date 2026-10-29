# ClipInitialDurationMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

How new foreground clips receive their initial duration via clip/initialDurationMode.

```kotlin
enum ClipInitialDurationMode : Enum<ClipInitialDurationMode>
```


## Members

### DEFAULT

```kotlin
enum entry DEFAULT
```

Static clips use clip/defaultDurationValue; videos use their media duration.

### FOLLOW_PARENT

```kotlin
enum entry FOLLOW_PARENT
```

Static clips end with the background track; videos use their media duration capped at that end. Without a remaining background interval, uses the same duration as DEFAULT.

### entries

```kotlin
val entries: EnumEntries<ClipInitialDurationMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

### valueOf

```kotlin
fun valueOf(value: String): ClipInitialDurationMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ClipInitialDurationMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

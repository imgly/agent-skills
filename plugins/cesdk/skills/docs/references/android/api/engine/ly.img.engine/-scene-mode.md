# SceneMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum SceneMode : Enum<SceneMode>
```
> **Deprecated:** Class will be removed in the future.


## Members

### DESIGN

```kotlin
enum entry DESIGN
```

### VIDEO

```kotlin
enum entry VIDEO
```

### entries

```kotlin
val entries: EnumEntries<SceneMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SceneMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SceneMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

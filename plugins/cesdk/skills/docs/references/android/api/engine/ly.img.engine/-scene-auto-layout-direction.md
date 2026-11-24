# SceneAutoLayoutDirection

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The direction along which a scene arranges its pages one after another. See SceneApi.setAutoLayout.

```kotlin
enum SceneAutoLayoutDirection : Enum<SceneAutoLayoutDirection>
```


## Members

### DEPTH

```kotlin
enum entry DEPTH
```

The pages lie on top of each other.

### HORIZONTAL

```kotlin
enum entry HORIZONTAL
```

The pages follow each other from left to right.

### VERTICAL

```kotlin
enum entry VERTICAL
```

The pages follow each other from top to bottom.

### entries

```kotlin
val entries: EnumEntries<SceneAutoLayoutDirection>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SceneAutoLayoutDirection
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SceneAutoLayoutDirection>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

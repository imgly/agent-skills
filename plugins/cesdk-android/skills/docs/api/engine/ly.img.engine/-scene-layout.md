# SceneLayout

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum SceneLayout : Enum<SceneLayout>
```


## Members

### DEPTH_STACK

```kotlin
enum entry DEPTH_STACK
```

### FREE

```kotlin
enum entry FREE
```

### HORIZONTAL_STACK

```kotlin
enum entry HORIZONTAL_STACK
```

### VERTICAL_STACK

```kotlin
enum entry VERTICAL_STACK
```

### entries

```kotlin
val entries: EnumEntries<SceneLayout>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SceneLayout
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SceneLayout>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

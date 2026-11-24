# SceneLayout

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The layout of a scene.

```kotlin
enum SceneLayout : Enum<SceneLayout>
```


## Members

### DEPTH_STACK

```kotlin
enum entry DEPTH_STACK
```
> **Deprecated:** Use SceneApi.setAutoLayout with SceneAutoLayoutDirection.DEPTH instead. Replace with `import ly.img.engine.SceneAutoLayoutDirection; SceneAutoLayoutDirection.DEPTH`.

### FREE

```kotlin
enum entry FREE
```

The pages stay at free positions on the canvas.

### HORIZONTAL_STACK

```kotlin
enum entry HORIZONTAL_STACK
```
> **Deprecated:** Use SceneApi.setAutoLayout with SceneAutoLayoutDirection.HORIZONTAL instead. Replace with `import ly.img.engine.SceneAutoLayoutDirection; SceneAutoLayoutDirection.HORIZONTAL`.

### VERTICAL_STACK

```kotlin
enum entry VERTICAL_STACK
```
> **Deprecated:** Use SceneApi.setAutoLayout with SceneAutoLayoutDirection.VERTICAL instead. Replace with `import ly.img.engine.SceneAutoLayoutDirection; SceneAutoLayoutDirection.VERTICAL`.

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

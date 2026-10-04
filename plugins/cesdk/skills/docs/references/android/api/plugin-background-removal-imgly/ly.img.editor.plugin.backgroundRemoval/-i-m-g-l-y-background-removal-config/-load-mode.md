# LoadMode

- **Module:** `ly.img:plugin-background-removal-imgly`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Controls when the IMG.LY model is loaded.

```kotlin
enum LoadMode : Enum<IMGLYBackgroundRemovalConfig.LoadMode>
```


## Members

### EAGER

```kotlin
enum entry EAGER
```

Load the model during plugin initialization.

### LAZY

```kotlin
enum entry LAZY
```

Load the model on first use.

### entries

```kotlin
val entries: EnumEntries<IMGLYBackgroundRemovalConfig.LoadMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): IMGLYBackgroundRemovalConfig.LoadMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<IMGLYBackgroundRemovalConfig.LoadMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

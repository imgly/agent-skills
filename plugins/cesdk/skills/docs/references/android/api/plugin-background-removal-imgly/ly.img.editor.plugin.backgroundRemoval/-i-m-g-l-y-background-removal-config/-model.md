# Model

- **Module:** `ly.img:plugin-background-removal-imgly`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Available IMG.LY background removal model variants.

```kotlin
enum Model : Enum<IMGLYBackgroundRemovalConfig.Model>
```


## Members

### FP16

```kotlin
enum entry FP16
```

Half-precision FP16 model.

### FP32

```kotlin
enum entry FP32
```

Full-precision FP32 model.

### QUINT8

```kotlin
enum entry QUINT8
```

Quantized unsigned 8-bit model.

### entries

```kotlin
val entries: EnumEntries<IMGLYBackgroundRemovalConfig.Model>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

File-name key used to resolve the model artifact.

### valueOf

```kotlin
fun valueOf(value: String): IMGLYBackgroundRemovalConfig.Model
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<IMGLYBackgroundRemovalConfig.Model>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

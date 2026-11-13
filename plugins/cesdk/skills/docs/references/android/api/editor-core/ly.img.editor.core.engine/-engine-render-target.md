# EngineRenderTarget

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.engine`

Configures which android view should be used for ly.img.engine.Engine rendering.

```kotlin
enum EngineRenderTarget : Enum<EngineRenderTarget>
```


## Members

### SURFACE_VIEW

```kotlin
enum entry SURFACE_VIEW
```

For rendering on android.view.SurfaceView.

### TEXTURE_VIEW

```kotlin
enum entry TEXTURE_VIEW
```

For rendering on android.view.TextureView.

### entries

```kotlin
val entries: EnumEntries<EngineRenderTarget>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): EngineRenderTarget
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<EngineRenderTarget>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.

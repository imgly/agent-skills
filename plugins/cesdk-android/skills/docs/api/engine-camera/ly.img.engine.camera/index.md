# ly.img.engine.camera

- **Module:** `ly.img:engine-camera`
- **Package:** `ly.img.engine.camera`
- **Module catalog:** [`ly.img:engine-camera`](<../../indexes/engine-camera.md>)

## Top-level declarations

### setCameraPreview

```kotlin
fun Engine.setCameraPreview(pixelStreamFill: DesignBlock, preview: Preview, mirrored: Boolean = false, onFirstFrameAvailable: () -> Unit = {})
```

```kotlin
fun Engine.setCameraPreview(pixelStreamFill: DesignBlock, preview: Preview, mirroredState: StateFlow<Boolean>, onFirstFrameAvailable: () -> Unit = {})
```

Connects android camerax to the Engine. Calling this function will render the camera output to the pixelStreamFill. Configuration of the preview should be provided via camerax preview. Note that the dimensions of the block that holds pixelStreamFill should be set manually and have nothing to do with preview dimensions.

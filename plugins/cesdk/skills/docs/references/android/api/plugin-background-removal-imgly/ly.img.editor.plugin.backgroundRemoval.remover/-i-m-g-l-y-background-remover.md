# IMGLYBackgroundRemover

- **Module:** `ly.img:plugin-background-removal-imgly`
- **Package:** `ly.img.editor.plugin.backgroundRemoval.remover`

ONNX Runtime based background remover that uses IMG.LY segmentation models.

```kotlin
open class IMGLYBackgroundRemover(config: IMGLYBackgroundRemovalConfig) : BackgroundRemover<IMGLYBackgroundRemovalConfig>
```


## Members

### IMGLYBackgroundRemover

```kotlin
constructor(config: IMGLYBackgroundRemovalConfig)
```

### forceDownloadModel

```kotlin
suspend fun forceDownloadModel(context: Context)
```

Forces model file download outside editor scope. This can be helpful if you want to have the model ready even before the editor is launched.

### initialize

```kotlin
open override fun EditorScope.initialize()
```

Starts loading the configured model when IMGLYBackgroundRemovalConfig.loadMode is eager.

### processImage

```kotlin
open suspend override fun EditorScope.processImage(bitmap: Bitmap): BackgroundRemovalMask
```

Runs the configured ONNX model for bitmap and returns its foreground mask.

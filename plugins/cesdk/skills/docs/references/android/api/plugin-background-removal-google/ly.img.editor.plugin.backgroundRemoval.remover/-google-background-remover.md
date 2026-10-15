# GoogleBackgroundRemover

- **Module:** `ly.img:plugin-background-removal-google`
- **Package:** `ly.img.editor.plugin.backgroundRemoval.remover`

ML Kit segmentation implementation for background removal.

```kotlin
open class GoogleBackgroundRemover : BackgroundRemover<GoogleBackgroundRemovalConfig>
```


## Members

### GoogleBackgroundRemover

```kotlin
constructor()
```

### initialize

```kotlin
open override fun EditorScope.initialize()
```

Performs no setup because ML Kit clients are created when processing images.

### processImage

```kotlin
open suspend override fun EditorScope.processImage(bitmap: Bitmap): BackgroundRemovalMask
```

Runs ML Kit selfie segmentation for bitmap and returns its foreground mask.

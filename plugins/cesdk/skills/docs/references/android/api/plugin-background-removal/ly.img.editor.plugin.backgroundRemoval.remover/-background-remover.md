# BackgroundRemover

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval.remover`

Produces foreground masks for images that should have their background removed.

```kotlin
interface BackgroundRemover<Config : BackgroundRemovalConfig>
```


## Members

### initialize

```kotlin
abstract fun EditorScope.initialize()
```

Prepares the remover for use. Implementations can use this hook to warm up local models or initialize third-party clients.

### processImage

```kotlin
abstract suspend fun EditorScope.processImage(bitmap: Bitmap): BackgroundRemovalMask
```

Processes bitmap and returns a mask where foreground pixels should remain visible.

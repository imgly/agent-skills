> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Create From Image](./from-image.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-scene-from-image-url/CreateSceneFromImageURL.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.SceneLayout

suspend fun createSceneFromImageURL(engine: Engine) {
    val imageRemoteUri = Uri.parse("https://img.ly/static/ubq_samples/sample_4.jpg")
    engine.scene.createFromImage(imageRemoteUri)

    val page = engine.block.findByType(DesignBlockType.Page).first()
    val pageWidth = engine.block.getWidth(page)
    val pageHeight = engine.block.getHeight(page)

    check(pageWidth > 0F)
    check(pageHeight > 0F)

    val pageFill = engine.block.getFill(page)
    val imageFillType = engine.block.getType(pageFill)

    check(imageFillType == FillType.Image.key)

    val configuredScene = engine.scene.createFromImage(
        imageUri = imageRemoteUri,
        dpi = 300F,
        pixelScaleFactor = 1F,
        sceneLayout = SceneLayout.FREE,
    )

    check(configuredScene >= 0)
}
```

```kotlin file=@cesdk_android_examples/engine-guides-create-scene-from-image-blob/CreateSceneFromImageBlob.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import java.io.ByteArrayOutputStream
import java.io.File
import java.net.URL

suspend fun createSceneFromImageBlob(engine: Engine) {
    val blobUrl = URL("https://img.ly/static/ubq_samples/sample_4.jpg")
    val imageBytes = withContext(Dispatchers.IO) {
        val outputStream = ByteArrayOutputStream()
        blobUrl.openStream().use { inputStream ->
            outputStream.use(inputStream::copyTo)
        }
        outputStream.toByteArray()
    }

    check(imageBytes.isNotEmpty())

    val blobFile = withContext(Dispatchers.IO) {
        File.createTempFile("cesdk-image-", ".jpg").apply {
            outputStream().use { it.write(imageBytes) }
        }
    }
    val blobUri = Uri.fromFile(blobFile)

    check(blobFile.length() > 0L)

    engine.scene.createFromImage(blobUri)

    val page = engine.block.findByType(DesignBlockType.Page).first()
    val pageWidth = engine.block.getWidth(page)
    val pageHeight = engine.block.getHeight(page)

    check(pageWidth > 0F)
    check(pageHeight > 0F)

    val pageFill = engine.block.getFill(page)
    val imageFillType = engine.block.getType(pageFill)

    check(imageFillType == FillType.Image.key)
}
```

Create an editable scene from an image with the Android Engine API. The engine
builds a single-page scene sized to the image and configured in pixel design
units, ready for immediate editing.

![A photograph loaded as an editable Android Engine scene, with the page sized to and filled by the source image.](https://img.ly/docs/cesdk/android/open-the-editor/from-image-ad9b5e/assets/android.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-create-scene-from-image-url)

<EngineReferenceNote {...props} />

`engine.scene.createFromImage()` loads the image, creates a scene whose page matches the image dimensions, and adds the image directly as the page fill. Use this when an image file is the starting point for an editing workflow where users enhance, annotate, or transform the image.

## Create a Scene From an Image URL

Pass a remote or local image `Uri` to `createFromImage()`. The suspend function returns after the image is loaded and the scene is ready for editing.

```kotlin highlight-android-create-from-url
val imageRemoteUri = Uri.parse("https://img.ly/static/ubq_samples/sample_4.jpg")
engine.scene.createFromImage(imageRemoteUri)
```

The scene's page dimensions match the image, and the scene uses pixel design units.

### Inspect the Page Fill

The image becomes the page's fill rather than a separate image block. Locate the page with `findByType()` and read its dimensions when you need to position additional blocks relative to the image.

```kotlin highlight-android-work-with-scene
val page = engine.block.findByType(DesignBlockType.Page).first()
val pageWidth = engine.block.getWidth(page)
val pageHeight = engine.block.getHeight(page)
```

Read the page fill and compare its type with `FillType.Image` to confirm that the image is attached to the page.

```kotlin highlight-android-inspect-page-fill
val pageFill = engine.block.getFill(page)
val imageFillType = engine.block.getType(pageFill)
```

## Create a Scene From Image Bytes

When the image arrives as raw bytes from a file picker, network response, or other app storage, write those bytes to a file that remains available to the engine. The complete [image-bytes example](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-create-scene-from-image-blob) fetches the bytes from a URL to stand in for data your app already holds.

```kotlin highlight-android-fetch-image-bytes
val blobUrl = URL("https://img.ly/static/ubq_samples/sample_4.jpg")
val imageBytes = withContext(Dispatchers.IO) {
    val outputStream = ByteArrayOutputStream()
    blobUrl.openStream().use { inputStream ->
        outputStream.use(inputStream::copyTo)
    }
    outputStream.toByteArray()
}
```

Write the bytes to a temporary image file and create a `Uri` for that file.

```kotlin highlight-android-write-image-file
val blobFile = withContext(Dispatchers.IO) {
    File.createTempFile("cesdk-image-", ".jpg").apply {
        outputStream().use { it.write(imageBytes) }
    }
}
val blobUri = Uri.fromFile(blobFile)
```

Use the file `Uri` as the image source for `createFromImage()`.

```kotlin highlight-android-create-from-file
engine.scene.createFromImage(blobUri)
```

As with a remote URL, the created page matches the source image dimensions and uses an image fill.

```kotlin highlight-android-work-with-blob-scene
val page = engine.block.findByType(DesignBlockType.Page).first()
val pageWidth = engine.block.getWidth(page)
val pageHeight = engine.block.getHeight(page)
```

```kotlin highlight-android-inspect-blob-page-fill
val pageFill = engine.block.getFill(page)
val imageFillType = engine.block.getType(pageFill)
```

## Configure Scene Parameters

`createFromImage()` accepts optional parameters that control how the image maps to scene dimensions and how pages are arranged.

```kotlin highlight-android-configure-scene
val configuredScene = engine.scene.createFromImage(
    imageUri = imageRemoteUri,
    dpi = 300F,
    pixelScaleFactor = 1F,
    sceneLayout = SceneLayout.FREE,
)
```

| Parameter | Default | Description |
| --- | --- | --- |
| `dpi` | `300F` | Dots per inch of the scene, used when converting between pixels and physical units. |
| `pixelScaleFactor` | `1F` | Scale factor applied to the final export resolution. |
| `sceneLayout` | `SceneLayout.FREE` | Page arrangement: `FREE`, `HORIZONTAL_STACK`, `VERTICAL_STACK`, or `DEPTH_STACK`. |

To later save your scene, see [Saving Scenes](../export-save-publish/save.md).

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.createFromImage(imageUri=_)` | Create a scene whose single page is sized to the image and filled with it |
| `engine.scene.createFromImage(imageUri=_, dpi=_, pixelScaleFactor=_, sceneLayout=_)` | Create an image scene with explicit DPI, scale, and layout parameters |
| `engine.block.findByType(type=DesignBlockType.Page)` | Find page blocks in the current scene |
| `engine.block.getWidth(block=_)` | Read the page width |
| `engine.block.getHeight(block=_)` | Read the page height |
| `engine.block.getFill(block=_)` | Get the fill block attached to a page |
| `engine.block.getType(block=_)` | Read a block type string, including the fill type |
| `Uri.parse(_)` | Create a `Uri` from a remote or local string |
| `Uri.fromFile(_)` | Create a `Uri` from a local file |
| `URL.openStream()` | Read image bytes from a remote URL |
| `File.createTempFile(prefix=_, suffix=_)` | Create a temporary file for image bytes |
| `engine.scene.saveToString(scene=_)` | Save the scene as a string |
| `engine.scene.saveToArchive(scene=_)` | Save the scene with embedded assets |

## Next Steps

- [Saving Scenes](../export-save-publish/save.md) - Persist the edited scene to a string or an archive.
- [Load Scene](./load-scene.md) - Open the editor from a previously saved scene file.
- [Create From Video](./from-video.md) - Start the editor from a video instead of an image.
- [Blank Canvas](./blank-canvas.md) - Launch the editor with an empty canvas.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
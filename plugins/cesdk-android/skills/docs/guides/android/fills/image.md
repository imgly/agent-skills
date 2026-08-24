> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Fills](../fills.md) > [Image](./image.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-fills-image/FillsImage.kt reference-only
import android.net.Uri
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.Source
import java.nio.ByteBuffer
import kotlin.math.abs

data class FillsImage(
    val sceneSupportsFill: Boolean,
    val blockSupportsFill: Boolean,
    val blockSupportsContentFillMode: Boolean,
    val blockSupportsOpacity: Boolean,
    val imageFillType: String,
    val imageUri: Uri,
    val currentFillMatches: Boolean,
    val coverMode: ContentFillMode,
    val containMode: ContentFillMode,
    val cropMode: ContentFillMode,
    val contentFillModeAfterSourceSet: ContentFillMode,
    val sourceSetWidths: List<Int>,
    val opacity: Float,
    val exportedImage: ByteBuffer,
)

suspend fun fillsImage(engine: Engine): FillsImage {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 80F)
    engine.block.setWidth(imageBlock, value = 360F)
    engine.block.setHeight(imageBlock, value = 240F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val sceneSupportsFill = engine.block.supportsFill(scene)
    val blockSupportsFill = engine.block.supportsFill(imageBlock)
    val blockSupportsContentFillMode = engine.block.supportsContentFillMode(imageBlock)
    val blockSupportsOpacity = engine.block.supportsOpacity(imageBlock)

    require(!sceneSupportsFill) { "Scenes do not support fills." }
    require(blockSupportsFill) { "Graphic blocks with shapes can render fills." }
    require(blockSupportsContentFillMode) { "This block must support content fill modes." }
    require(blockSupportsOpacity) { "This block must support opacity." }

    val imageFill = engine.block.createFill(FillType.Image)
    val imageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg")

    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = imageUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)

    check(engine.block.getType(imageFill) == FillType.Image.key)

    val currentFill = engine.block.getFill(imageBlock)
    val imageFillType = engine.block.getType(currentFill)
    val currentImageUri = engine.block.getUri(
        block = currentFill,
        property = "fill/image/imageFileURI",
    )

    check(currentFill == imageFill)
    check(imageFillType == FillType.Image.key)
    check(currentImageUri == imageUri)

    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
    val coverMode = engine.block.getContentFillMode(imageBlock)

    check(coverMode == ContentFillMode.COVER)

    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CONTAIN)
    val containMode = engine.block.getContentFillMode(imageBlock)

    check(containMode == ContentFillMode.CONTAIN)

    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CROP)
    val cropMode = engine.block.getContentFillMode(imageBlock)

    check(cropMode == ContentFillMode.CROP)

    val sourceSet = listOf(
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_512x341.jpg"),
            width = 512,
            height = 341,
        ),
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_1024x683.jpg"),
            width = 1024,
            height = 683,
        ),
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg"),
            width = 2048,
            height = 1366,
        ),
    )

    engine.block.setSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
        sourceSet = sourceSet,
    )

    // setSourceSet resets crop and content fill mode on the associated block.
    // Reapply Cover or Contain after changing responsive image sources.
    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CONTAIN)

    val contentFillModeAfterSourceSet = engine.block.getContentFillMode(imageBlock)
    check(contentFillModeAfterSourceSet == ContentFillMode.CONTAIN)

    val currentSourceSet = engine.block.getSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
    )

    check(currentSourceSet.map(Source::width) == listOf(2048, 1024, 512))

    engine.block.setOpacity(block = imageBlock, value = 0.65F)
    val opacity = engine.block.getOpacity(imageBlock)

    check(abs(opacity - 0.65F) < 0.0001F)

    val exportedImage = engine.block.export(imageBlock, mimeType = MimeType.PNG)

    return FillsImage(
        sceneSupportsFill = sceneSupportsFill,
        blockSupportsFill = blockSupportsFill,
        blockSupportsContentFillMode = blockSupportsContentFillMode,
        blockSupportsOpacity = blockSupportsOpacity,
        imageFillType = imageFillType,
        imageUri = currentImageUri,
        currentFillMatches = currentFill == imageFill,
        coverMode = coverMode,
        containMode = containMode,
        cropMode = cropMode,
        contentFillModeAfterSourceSet = contentFillModeAfterSourceSet,
        sourceSetWidths = currentSourceSet.map(Source::width),
        opacity = opacity,
        exportedImage = exportedImage,
    )
}
```

Fill graphic blocks with photos and images from URLs, app-owned files, or
responsive source sets using CE.SDK's image fill system.

![A square graphic block filled with an aerial coastline photograph using an image fill in Contain mode](https://img.ly/docs/cesdk/android/fills/image-e9cb5c/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0/engine-guides-fills-image)

Image fills render design blocks with raster or vector image content, supporting common formats such as PNG, JPEG, WebP, and SVG. You can load images from remote URLs or app-owned Android URIs, provide responsive source sets, and choose how the image scales inside its block.

This guide covers how to create and apply image fills programmatically, configure content fill modes, work with responsive source sets, and pass image URIs that Android can resolve.

<EngineReferenceNote {...props} />

## Understanding Image Fills

Image fills are one of the fundamental fill types in CE.SDK, identified by the type string `"//ly.img.ubq/fill/image"` or the `FillType.Image` type-safe constant. While color fills produce solid colors and gradient fills produce color transitions, image fills display raster or vector content from image files.

The image fill is a separate fill block from the graphic block that renders it. The URI and source set live on the fill, while sizing, opacity, and content fill mode live on the design block that owns the fill.

## Checking Image Fill Capabilities

Before working with image fills, verify that the target block supports the fill-related capabilities this guide changes. Scenes do not support fills, while graphic blocks with shapes can render image fills. Content fill mode and opacity are block-level settings, so check those capabilities before changing how the image is framed or blended.

```kotlin highlight-android-check-support
    val sceneSupportsFill = engine.block.supportsFill(scene)
    val blockSupportsFill = engine.block.supportsFill(imageBlock)
    val blockSupportsContentFillMode = engine.block.supportsContentFillMode(imageBlock)
    val blockSupportsOpacity = engine.block.supportsOpacity(imageBlock)

    require(!sceneSupportsFill) { "Scenes do not support fills." }
    require(blockSupportsFill) { "Graphic blocks with shapes can render fills." }
    require(blockSupportsContentFillMode) { "This block must support content fill modes." }
    require(blockSupportsOpacity) { "This block must support opacity." }
```

`supportsFill()` returns `true` when a block can have a fill assigned to it. `supportsContentFillMode()` and `supportsOpacity()` confirm that the same block can change image scaling and opacity. Check these predicates before calling the corresponding APIs on a block you did not create.

## Creating Image Fills

Create an image fill with `createFill(FillType.Image)`, set its `fill/image/imageFileURI` property, and attach it to the graphic block with `setFill()`.

```kotlin highlight-android-create-image-fill
    val imageFill = engine.block.createFill(FillType.Image)
    val imageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg")

    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = imageUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
```

The fill exists independently until you attach it to a block. If you create a fill and do not attach it, destroy it with `engine.block.destroy()` to avoid leaking an unowned fill block. When you replace an existing fill with `setFill()`, the previous fill is not destroyed automatically.

### Getting the Current Fill

Retrieve the fill from a block with `getFill()` and inspect its type with `getType()` to verify that it is an image fill.

```kotlin highlight-android-get-current-fill
val currentFill = engine.block.getFill(imageBlock)
val imageFillType = engine.block.getType(currentFill)
val currentImageUri = engine.block.getUri(
    block = currentFill,
    property = "fill/image/imageFileURI",
)
```

`getFill()` returns the fill block ID. Use that ID to read image fill properties such as `fill/image/imageFileURI` or `fill/image/sourceSet`.

## Configuring Content Fill Modes

Content fill modes control how the image scales and positions within the containing block. Use `setContentFillMode()` on the design block, not on the fill block.

### Cover Mode

`ContentFillMode.COVER` scales the image until it fills the entire block while maintaining its aspect ratio. Parts of the image may be cropped when the image and block aspect ratios differ.

```kotlin highlight-android-cover-mode
engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
val coverMode = engine.block.getContentFillMode(imageBlock)
```

Cover mode is useful for backgrounds, hero images, and photo frames where the block should never show empty space.

### Contain Mode

`ContentFillMode.CONTAIN` scales the image so the full image fits inside the block while maintaining its aspect ratio. Empty space can remain when the aspect ratios differ.

```kotlin highlight-android-contain-mode
engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CONTAIN)
val containMode = engine.block.getContentFillMode(imageBlock)
```

Contain mode is useful for logos, product images, and other content where preserving the complete image matters more than filling the entire block.

### Crop Mode

`ContentFillMode.CROP` represents a manual crop. Use it when your app manages crop transforms directly or when the editor UI has produced a user-controlled crop.

```kotlin highlight-android-crop-mode
engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CROP)
val cropMode = engine.block.getContentFillMode(imageBlock)
```

## Working with Source Sets

Source sets provide multiple resolutions of the same image. The engine selects the most appropriate source for the current drawing size, which keeps previews efficient while preserving quality for high-resolution exports.

### Setting Up a Source Set

A source set is a list of `Source` values. Each source contains a URI and the image dimensions in pixels.

```kotlin highlight-android-source-set
    val sourceSet = listOf(
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_512x341.jpg"),
            width = 512,
            height = 341,
        ),
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_1024x683.jpg"),
            width = 1024,
            height = 683,
        ),
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg"),
            width = 2048,
            height = 1366,
        ),
    )

    engine.block.setSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
        sourceSet = sourceSet,
    )

    // setSourceSet resets crop and content fill mode on the associated block.
    // Reapply Cover or Contain after changing responsive image sources.
    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CONTAIN)
```

The engine uses the source with the closest size that meets or exceeds the required drawing size. During export, it can use the highest available resolution.

> **Note:** `setSourceSet()` resets crop and content fill mode on the associated block.
> Reapply `ContentFillMode.COVER` or `ContentFillMode.CONTAIN` after changing
> a fill's responsive sources if you need to preserve that mode.

> **Note:** When both `fill/image/sourceSet` and `fill/image/imageFileURI` are set on a
> fill, the source set takes precedence. The single URI remains stored and is
> used again if the source set is cleared.

### Retrieving Source Sets

Read the current source set with `getSourceSet()` when you need to inspect or update the responsive image sources.

```kotlin highlight-android-get-source-set
val currentSourceSet = engine.block.getSourceSet(
    block = imageFill,
    property = "fill/image/sourceSet",
)
```

The returned list contains the same `Source` fields you provided: `uri`, `width`, and `height`.

## Loading Images from Different Sources

Image fills accept URI values, so Android integrations can use HTTPS URLs and app-owned local or content URIs that the engine can resolve.

### HTTPS URLs

Pass remote image URLs as `Uri` values to `setUri(...)`, as shown in the image fill and source set examples above. Use HTTPS URLs that are reachable by the running app and keep responsive alternatives in `fill/image/sourceSet` when the same image is available in multiple sizes.

### Data URIs and Base64

Android does not currently load image fill resources from `data:` URIs. If your app starts with base64 image data, decode it into an app-owned file or expose it through a `content://` provider, then pass that `Uri` to `setUri(...)`.

### App-Owned Local and Content URIs

For images owned by your Android app, pass a `file://` or `content://` `Uri` to `setUri(...)` in the same way as an HTTPS URL. The URI must remain readable to the engine while the scene is loaded; if your app hands out a `content://` URI, make sure the provider grants access for that URI and that the data is still available when the editor reopens the scene.

## Additional Techniques

### Controlling Opacity

Set opacity on the design block that owns the image fill. The value ranges from `0F` for fully transparent to `1F` for fully opaque.

```kotlin highlight-android-opacity
engine.block.setOpacity(block = imageBlock, value = 0.65F)
val opacity = engine.block.getOpacity(imageBlock)
```

> **Note:** Opacity is a block property, not a fill property. It affects the whole block,
> including strokes, effects, and any other visual properties applied to that
> block. For transparency inside the image itself, use an image format with
> alpha support such as PNG, WebP, or SVG.

## Troubleshooting

### Image Not Visible

- Check `engine.block.supportsFill(block)` before assigning the fill and `engine.block.isFillEnabled(block)` when a fill is already assigned.
- Make sure the graphic block has a shape, non-zero width and height, and is appended to the scene hierarchy.
- Verify that the image fill is attached to the visible design block with `engine.block.setFill(block=_, fill=_)`; setting the URI on an unattached fill does not render it.

### Image Not Loading

- Read the stored URI with `engine.block.getUri(block=fill, property="fill/image/imageFileURI")` and confirm it uses the expected `https`, `file`, or `content` scheme.
- For HTTPS URLs, verify that the URL is reachable from the device or emulator and that the app has network access.
- For base64 image data, write the decoded bytes to app-owned storage or expose them through a content provider instead of passing a `data:` URI directly.
- For local or content URIs, keep the referenced file available and grant URI access through your app's storage or content provider.
- If `fill/image/sourceSet` is set, remember that it takes precedence over `fill/image/imageFileURI`; inspect the source set when the single URI looks correct but another image is used.

### Unowned or Replaced Fill Cleanup

Image fills are design blocks. A fill created with `engine.block.createFill(FillType.Image)` remains unowned until it is attached with `engine.block.setFill(...)`, so destroy unused fills with `engine.block.destroy(block=_)`. When you replace a block's existing fill, store the old fill from `engine.block.getFill(block=_)` first and destroy it after the replacement if your app no longer needs it.

## API Reference

### Core Methods

| API | Description |
| --- | --- |
| `engine.block.supportsFill(block=_)` | Checks whether a design block can have a fill |
| `engine.block.isFillEnabled(block=_)` | Checks whether fill rendering is enabled on a design block |
| `engine.block.supportsContentFillMode(block=_)` | Checks whether content fill mode can be changed on a block |
| `engine.block.supportsOpacity(block=_)` | Checks whether opacity can be changed on a block |
| `engine.block.createFill(fillType=FillType.Image)` | Creates an image fill block |
| `engine.block.setFill(block=_, fill=_)` | Assigns a fill block to a design block |
| `engine.block.getFill(block=_)` | Returns the fill block attached to a design block |
| `engine.block.getType(block=_)` | Reads a block type string such as `"//ly.img.ubq/fill/image"` |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Writes the image URI |
| `engine.block.getUri(block=_, property="fill/image/imageFileURI")` | Reads the image URI |
| `engine.block.setSourceSet(block=_, property="fill/image/sourceSet", sourceSet=_)` | Writes responsive image sources |
| `engine.block.getSourceSet(block=_, property="fill/image/sourceSet")` | Reads responsive image sources |
| `engine.block.setContentFillMode(block=_, mode=ContentFillMode.COVER)` | Sets how image content scales inside the block |
| `engine.block.getContentFillMode(block=_)` | Reads the current content fill mode |
| `engine.block.setOpacity(block=_, value=_)` | Sets block opacity from `0F` to `1F` |
| `engine.block.getOpacity(block=_)` | Reads block opacity |
| `engine.block.destroy(block=_)` | Destroys an unused fill block |

### Image Fill Properties

| Property | Type | Description |
| --- | --- | --- |
| `fill/image/imageFileURI` | `Uri` | Single image URI, such as HTTPS, file, or content URI |
| `fill/image/sourceSet` | `List<Source>` | Responsive image sources with pixel dimensions |

### Content Fill Properties

| Property | Type | Values | Description |
| --- | --- | --- | --- |
| `contentFill/mode` | `ContentFillMode` | `CROP`, `COVER`, `CONTAIN` | How image content scales or crops inside the block |

### Source

| Property | Type | Description |
| --- | --- | --- |
| `uri` | `Uri` | Image URI |
| `width` | `Int` | Image width in pixels |
| `height` | `Int` | Image height in pixels |

## Next Steps

- [Fills Overview](./overview.md) - Learn how fills attach to design blocks and how fill types are replaced.
- [Source Sets](../import-media/source-sets.md) - Use multiple versions of an asset for different resolutions.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
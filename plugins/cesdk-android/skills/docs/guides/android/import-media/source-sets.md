> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Source Sets](./source-sets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-source-sets/SourceSets.kt reference-only
import android.net.Uri
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetPayload
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.Source
import java.nio.ByteBuffer

data class SourceSets(
    val configuredImageSourceWidths: List<Int>,
    val updatedImageSourceWidths: List<Int>,
    val assetSourceWidths: List<Int>,
    val videoSourceWidths: List<Int>,
    val lowQualityVideoPreviewEnabled: Boolean,
    val exportedImage: ByteBuffer,
)

suspend fun sourceSets(engine: Engine): SourceSets {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.setPositionX(imageBlock, value = 50F)
    engine.block.setPositionY(imageBlock, value = 50F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
        sourceSet = listOf(
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
        ),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.appendChild(parent = page, child = imageBlock)

    val configuredImageSourceSet = engine.block.getSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
    )
    check(configuredImageSourceSet.map(Source::width) == listOf(1024, 512))

    val currentImageSourceSet = engine.block.getSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
    )

    engine.block.addImageFileUriToSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
        uri = "https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg",
    )

    val updatedImageSourceSet = engine.block.getSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
    )

    check(currentImageSourceSet.map(Source::width) == listOf(1024, 512))
    check(updatedImageSourceSet.map(Source::width) == listOf(2048, 1024, 512))

    val assetSourceId = "android-guide-source-sets"
    if (assetSourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(assetSourceId)
    }

    val assetWithSourceSet = AssetDefinition(
        id = "multi-resolution-image",
        label = mapOf("en" to "Multi-resolution image"),
        meta = mapOf(
            "kind" to "image",
            "fillType" to FillType.Image.key,
        ),
        payload = AssetPayload(
            sourceSet = listOf(
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
            ),
        ),
    )

    engine.asset.addLocalSource(
        sourceId = assetSourceId,
        supportedMimeTypes = listOf(MimeType.JPEG.key),
    )
    engine.asset.addAsset(sourceId = assetSourceId, asset = assetWithSourceSet)

    val asset = engine.asset.fetchAsset(
        sourceId = assetSourceId,
        assetId = assetWithSourceSet.id,
    ) ?: error("Expected the local source to return the asset.")

    val assetBlock = engine.asset.defaultApplyAsset(asset)
        ?: error("Expected the image asset to create a block.")
    val assetFill = engine.block.getFill(assetBlock)
    val assetSourceSet = engine.block.getSourceSet(
        block = assetFill,
        property = "fill/image/sourceSet",
    )

    check(assetSourceSet.map(Source::width) == listOf(2048, 1024, 512))

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(videoBlock, value = 400F)
    engine.block.setHeight(videoBlock, value = 225F)
    engine.block.setPositionX(videoBlock, value = 50F)
    engine.block.setPositionY(videoBlock, value = 400F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setSourceSet(
        block = videoFill,
        property = "fill/video/sourceSet",
        sourceSet = listOf(
            Source(
                uri = Uri.parse("https://img.ly/static/example-assets/sourceset/1x.mp4"),
                width = 720,
                height = 1280,
            ),
        ),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.addVideoFileUriToSourceSet(
        block = videoFill,
        property = "fill/video/sourceSet",
        uri = "https://img.ly/static/example-assets/sourceset/2x.mp4",
    )

    val videoSourceSet = engine.block.getSourceSet(
        block = videoFill,
        property = "fill/video/sourceSet",
    )

    check(videoSourceSet.map(Source::width) == listOf(1440, 720))

    val previousLowQualityVideoPreview = engine.editor.getSettingBoolean(
        keypath = "features/forceLowQualityVideoPreview",
    )

    engine.editor.setSettingBoolean(
        keypath = "features/forceLowQualityVideoPreview",
        value = true,
    )

    val lowQualityVideoPreviewEnabled = engine.editor.getSettingBoolean(
        keypath = "features/forceLowQualityVideoPreview",
    )
    engine.editor.setSettingBoolean(
        keypath = "features/forceLowQualityVideoPreview",
        value = previousLowQualityVideoPreview,
    )

    val exportedImage = engine.block.export(imageBlock, mimeType = MimeType.PNG)

    return SourceSets(
        configuredImageSourceWidths = configuredImageSourceSet.map(Source::width),
        updatedImageSourceWidths = updatedImageSourceSet.map(Source::width),
        assetSourceWidths = assetSourceSet.map(Source::width),
        videoSourceWidths = videoSourceSet.map(Source::width),
        lowQualityVideoPreviewEnabled = lowQualityVideoPreviewEnabled,
        exportedImage = exportedImage,
    )
}
```

Configure source sets for images and videos so CE.SDK can choose an
appropriate resolution for editing previews and exports.

![Source Sets result exported from the Android guide](https://img.ly/docs/cesdk/android/import-media/source-sets-5679c8/assets/android.hero.png)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-source-sets)

Source sets let you provide multiple versions of the same media asset at
different pixel dimensions. The engine can load a smaller source for preview
rendering and still use a higher-resolution source when the target drawing or
export size needs it.

This guide covers source sets on image fills, source sets inside asset
definitions, video source sets, and the video preview quality setting that helps
keep editing responsive.

<EngineReferenceNote {...props} />

## How Source Set Selection Works

When CE.SDK renders a fill, it calculates the current drawing size in screen
pixels. If the fill has a source set, the engine selects the source with the
closest size that meets or exceeds the drawing size. If every source is smaller
than the drawing size, the largest source is used.

Without a source set, image fills decode the single image source and clamp the
maximum edge length to the `maxImageSize` setting. Source sets give you explicit
control over the intermediate resolutions used during editing and export.

## Setting a Source Set on an Image Fill

Set image source sets on the image fill block with
`engine.block.setSourceSet()`. Each `Source` contains a `Uri`, `width`, and
`height`, and the dimensions must match the actual media file.

> **Caution:** CE.SDK supports either `fill/image/imageFileURI` for one image or
> `fill/image/sourceSet` for multiple image resolutions. Avoid setting both on the
> same fill because the engine may choose a source that does not match the single
> URI you expected.

```kotlin highlight-android-set-source-set
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.setPositionX(imageBlock, value = 50F)
    engine.block.setPositionY(imageBlock, value = 50F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
        sourceSet = listOf(
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
        ),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.appendChild(parent = page, child = imageBlock)
```

## Querying and Modifying Source Sets

Use `engine.block.getSourceSet()` to inspect the sources stored on a fill. When
you need to add an image and do not already know its dimensions, call
`engine.block.addImageFileUriToSourceSet()` so the engine loads the image and
records its width and height.

```kotlin highlight-android-query-source-set
    val currentImageSourceSet = engine.block.getSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
    )

    engine.block.addImageFileUriToSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
        uri = "https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg",
    )

    val updatedImageSourceSet = engine.block.getSourceSet(
        block = imageFill,
        property = "fill/image/sourceSet",
    )
```

`setSourceSet()` is still the better choice when your backend already knows the
dimensions because it avoids fetching the file just to read metadata.

## Using Source Sets in Asset Definitions

Asset definitions can carry the same responsive sources in
`AssetPayload.sourceSet`. After you add the asset to a local source and apply
it, `engine.asset.defaultApplyAsset()` configures the resulting block's fill
with the source set from the asset payload.

```kotlin highlight-android-asset-source-set
    val assetSourceId = "android-guide-source-sets"
    if (assetSourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(assetSourceId)
    }

    val assetWithSourceSet = AssetDefinition(
        id = "multi-resolution-image",
        label = mapOf("en" to "Multi-resolution image"),
        meta = mapOf(
            "kind" to "image",
            "fillType" to FillType.Image.key,
        ),
        payload = AssetPayload(
            sourceSet = listOf(
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
            ),
        ),
    )

    engine.asset.addLocalSource(
        sourceId = assetSourceId,
        supportedMimeTypes = listOf(MimeType.JPEG.key),
    )
    engine.asset.addAsset(sourceId = assetSourceId, asset = assetWithSourceSet)

    val asset = engine.asset.fetchAsset(
        sourceId = assetSourceId,
        assetId = assetWithSourceSet.id,
    ) ?: error("Expected the local source to return the asset.")

    val assetBlock = engine.asset.defaultApplyAsset(asset)
        ?: error("Expected the image asset to create a block.")
    val assetFill = engine.block.getFill(assetBlock)
    val assetSourceSet = engine.block.getSourceSet(
        block = assetFill,
        property = "fill/image/sourceSet",
    )
```

Use this pattern when your asset library stores the available resolutions
alongside each asset. The applied block then behaves like a block you configured
manually with `setSourceSet()`.

## Video Source Sets

Video fills use the `fill/video/sourceSet` property. The source selection rules
match image fills: CE.SDK chooses the closest source for the current drawing
size and can use the highest-quality source for export.

```kotlin highlight-android-video-source-set
    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(videoBlock, value = 400F)
    engine.block.setHeight(videoBlock, value = 225F)
    engine.block.setPositionX(videoBlock, value = 50F)
    engine.block.setPositionY(videoBlock, value = 400F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setSourceSet(
        block = videoFill,
        property = "fill/video/sourceSet",
        sourceSet = listOf(
            Source(
                uri = Uri.parse("https://img.ly/static/example-assets/sourceset/1x.mp4"),
                width = 720,
                height = 1280,
            ),
        ),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.addVideoFileUriToSourceSet(
        block = videoFill,
        property = "fill/video/sourceSet",
        uri = "https://img.ly/static/example-assets/sourceset/2x.mp4",
    )

    val videoSourceSet = engine.block.getSourceSet(
        block = videoFill,
        property = "fill/video/sourceSet",
    )
```

Use `engine.block.addVideoFileUriToSourceSet()` when the engine should load a
video file to determine its dimensions before adding it to the existing source
set.

## Video Preview Quality Settings

For editing performance, enable `features/forceLowQualityVideoPreview` to force
video previews to use the smallest available source. Export still uses the
highest-quality source available for the requested output.

```kotlin highlight-android-video-preview-settings
engine.editor.setSettingBoolean(
    keypath = "features/forceLowQualityVideoPreview",
    value = true,
)
```

The related `features/matchThumbnailSourceToFill` setting controls whether
video thumbnails follow the fill's selected source. When it is disabled, which
is the default, thumbnails use the smallest source.

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Wrong resolution is selected | Check that every `Source.width` and `Source.height` matches the actual file dimensions. |
| Preview performance is poor | Add smaller sources to the source set, especially for video fills or large images. |
| Export quality is too low | Include a source that is large enough for the target export resolution. |
| The asset applies without a source set | Confirm that `AssetPayload.sourceSet` is populated and that the applied asset uses an image or video fill. |

## API Reference

| API | Description |
| --- | --- |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a graphic block that can display a fill. |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangular shape for the graphic block. |
| `engine.block.setShape(block=_, shape=_)` | Attach the shape to a graphic block. |
| `engine.block.setWidth(block=_, value=_)` | Set the block width. |
| `engine.block.setHeight(block=_, value=_)` | Set the block height. |
| `engine.block.setPositionX(block=_, value=_)` | Set the block's horizontal position. |
| `engine.block.setPositionY(block=_, value=_)` | Set the block's vertical position. |
| `engine.block.appendChild(parent=_, child=_)` | Add a block to the scene or page hierarchy. |
| `engine.block.createFill(fillType=FillType.Image)` | Create an image fill block. |
| `engine.block.createFill(fillType=FillType.Video)` | Create a video fill block. |
| `engine.block.setFill(block=_, fill=_)` | Attach a fill to a design block. |
| `engine.block.getFill(block=_)` | Read the fill attached to a design block. |
| `engine.block.setSourceSet(block=_, property="fill/image/sourceSet", sourceSet=_)` | Assign responsive image sources. |
| `engine.block.getSourceSet(block=_, property="fill/image/sourceSet")` | Read responsive image sources. |
| `engine.block.addImageFileUriToSourceSet(block=_, property="fill/image/sourceSet", uri=_)` | Add an image source after loading its dimensions. |
| `engine.block.setSourceSet(block=_, property="fill/video/sourceSet", sourceSet=_)` | Assign responsive video sources. |
| `engine.block.getSourceSet(block=_, property="fill/video/sourceSet")` | Read responsive video sources. |
| `engine.block.addVideoFileUriToSourceSet(block=_, property="fill/video/sourceSet", uri=_)` | Add a video source after loading its dimensions. |
| `engine.asset.findAllSources()` | List registered asset source IDs. |
| `engine.asset.removeSource(sourceId=_)` | Remove a previously registered local asset source. |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Create a local asset source. |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Add an asset definition to a local source. |
| `engine.asset.fetchAsset(sourceId=_, assetId=_)` | Fetch the asset result to apply. |
| `engine.asset.defaultApplyAsset(asset=_)` | Apply an asset and configure the created block from its payload. |
| `engine.editor.setSettingBoolean(keypath="features/forceLowQualityVideoPreview", value=_)` | Force video previews to use the smallest source while editing. |

### Source

| Property | Type | Description |
| --- | --- | --- |
| `uri` | `Uri` | Image or video resource URI. |
| `width` | `Int` | Source width in pixels. |
| `height` | `Int` | Source height in pixels. |

## Next Steps

- [Image Fills](../fills/image.md) - Apply photos and responsive image sources to design blocks.
- [Video Fills](../fills/video.md) - Apply video content and responsive video sources to design blocks.
- [Export](../export-save-publish/export.md) - Export designs using the best matching source for the target output.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
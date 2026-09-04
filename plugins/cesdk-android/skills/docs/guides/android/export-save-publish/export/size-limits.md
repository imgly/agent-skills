> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Size Limits](./size-limits.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-size-limits/SizeLimits.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.EngineException
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import java.nio.ByteBuffer
import kotlin.math.ceil
import kotlin.math.max

fun observeMaxImageSizeChanges(
    engine: Engine,
    scope: CoroutineScope,
    onMaxImageSizeChanged: (Int) -> Unit,
): Job = scope.launch(Dispatchers.Main) {
    engine.editor.onSettingsChanged().collect {
        onMaxImageSizeChanged(engine.editor.getSettingInt("maxImageSize"))
    }
}

suspend fun sizeLimits(engine: Engine): ByteBuffer = withContext(Dispatchers.Main) {
    val scene = engine.scene.create()
    engine.scene.setDesignUnit(DesignUnit.PIXEL)

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 800F)
    engine.block.setHeight(background, value = 600F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromHex("#FF2457D6"))
    engine.block.appendChild(parent = page, child = background)

    val originalMaxImageSize = engine.editor.getSettingInt("maxImageSize")

    try {
        val currentMaxImageSize = engine.editor.getSettingInt("maxImageSize")
        // The default value is 4096 pixels.
        check(currentMaxImageSize > 0)

        // Lower the limit on memory-constrained devices. Apply this before
        // loading images so newly loaded textures are downscaled to the new limit.
        engine.editor.setSettingInt(keypath = "maxImageSize", value = 2048)

        // Or raise it for high-quality workflows on capable devices:
        // engine.editor.setSettingInt(keypath = "maxImageSize", value = 8192)
        check(engine.editor.getSettingInt("maxImageSize") == 2048)

        // The engine reports the maximum export size supported on the current device.
        // The value is an upper bound. Exports may still fail for memory or other
        // reasons. When the limit is unknown, the engine returns Int.MAX_VALUE.
        val maxExportSize = engine.editor.getMaxExportSize()
        check(maxExportSize > 0)

        // This helper is scoped to this sample's untransformed page. In a more
        // general scene, validate against the world-space dimensions your export
        // workflow uses, or rely on export error handling.
        val plannedExportOptions = ExportOptions(targetWidth = 1600F, targetHeight = 1000F)
        val designUnit = engine.scene.getDesignUnit()
        val widthMode = engine.block.getWidthMode(page)
        val heightMode = engine.block.getHeightMode(page)
        require(
            designUnit == DesignUnit.PIXEL &&
                widthMode == SizeMode.ABSOLUTE &&
                heightMode == SizeMode.ABSOLUTE,
        )

        val pageWidth = engine.block.getWidth(page)
        val pageHeight = engine.block.getHeight(page)
        val targetWidth = plannedExportOptions.targetWidth ?: pageWidth
        val targetHeight = plannedExportOptions.targetHeight ?: pageHeight
        val fillScale = max(targetWidth / pageWidth, targetHeight / pageHeight)
        val renderedWidth = ceil(pageWidth * fillScale).toInt()
        val renderedHeight = ceil(pageHeight * fillScale).toInt()
        val withinLimit = renderedWidth <= maxExportSize && renderedHeight <= maxExportSize
        check(withinLimit)

        // Catch export errors so the app can recover. Common remediations are
        // lowering the target box for the retry.
        // ExportOptions.targetWidth/targetHeight are pixel values for the box
        // that the exported block fills while preserving its aspect ratio.
        val initialOptions = ExportOptions(targetWidth = 1600F, targetHeight = 1200F)
        val pngData = try {
            engine.block.export(block = page, mimeType = MimeType.PNG, options = initialOptions)
        } catch (error: EngineException) {
            val retryOptions = ExportOptions(targetWidth = 640F, targetHeight = 480F)
            engine.block.export(block = page, mimeType = MimeType.PNG, options = retryOptions)
        }

        check(engine.editor.getSettingInt("maxImageSize") == 2048)
        pngData.asReadOnlyBuffer()
    } finally {
        engine.editor.setSettingInt(keypath = "maxImageSize", value = originalMaxImageSize)
    }
}
```

Configure size limits to balance quality and performance in CE.SDK applications.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/engine-guides-size-limits)

CE.SDK processes images and videos on the device, so size limits depend on available memory and rendering hardware. Tuning these limits keeps memory use predictable on smaller devices while still letting capable devices export at high resolution.

<EngineReferenceNote {...props} />

This guide covers reading and writing the `maxImageSize` setting, observing setting changes, querying the device's maximum export size, and handling export failures.

## Understanding Size Limits

CE.SDK manages size limits at two stages: **input** (when loading images) and **output** (when exporting). The `maxImageSize` setting controls input resolution and downscales images that exceed the configured limit before they reach the canvas. The default is 4096×4096 pixels, which keeps memory use predictable on a wide range of devices.

Export resolution has no artificial limit. The engine can render up to 16,384×16,384 pixels in theory, but the actual ceiling is determined by the device's rendering hardware and available memory. Use `engine.editor.getMaxExportSize()` to read the device's reported upper bound at runtime.

## Resolution & Duration Limits

## Configuring maxImageSize

Read and modify `maxImageSize` through the Settings API. The setting is an integer in pixels, so use the `Int` accessors on `engine.editor`.

### Reading the Current Setting

To check the value currently in effect:

```kotlin highlight-android-read-setting
val currentMaxImageSize = engine.editor.getSettingInt("maxImageSize")
// The default value is 4096 pixels.
```

The default is `4096`. Read this value at startup to surface it in your UI, or to make runtime decisions about asset loading.

### Setting a New Value

Apply a new limit before loading images so newly loaded textures are downscaled to the new size:

```kotlin highlight-android-write-setting
        // Lower the limit on memory-constrained devices. Apply this before
        // loading images so newly loaded textures are downscaled to the new limit.
        engine.editor.setSettingInt(keypath = "maxImageSize", value = 2048)

        // Or raise it for high-quality workflows on capable devices:
        // engine.editor.setSettingInt(keypath = "maxImageSize", value = 8192)
```

Images already on the canvas keep their loaded resolution until they are reloaded. Lower values reduce memory pressure on phones and tablets; higher values preserve detail on higher-end devices.

### Observing Settings Changes

Subscribe to settings changes through `engine.editor.onSettingsChanged()`. The Flow emits `Unit` on setting changes, so collect it in an owning coroutine scope and read `maxImageSize` back inside the collector. The helper launches the collection on `Dispatchers.Main` because Android Engine APIs must run on the Engine thread:

```kotlin highlight-android-observe-changes
fun observeMaxImageSizeChanges(
    engine: Engine,
    scope: CoroutineScope,
    onMaxImageSizeChanged: (Int) -> Unit,
): Job = scope.launch(Dispatchers.Main) {
    engine.editor.onSettingsChanged().collect {
        onMaxImageSizeChanged(engine.editor.getSettingInt("maxImageSize"))
    }
}
```

Start this subscription after the engine has started and cancel the returned `Job` when the owning screen or view model no longer needs updates.

## Device Export Capabilities

The maximum export size on the current device is exposed directly:

```kotlin highlight-android-max-export-size
// The engine reports the maximum export size supported on the current device.
// The value is an upper bound. Exports may still fail for memory or other
// reasons. When the limit is unknown, the engine returns Int.MAX_VALUE.
val maxExportSize = engine.editor.getMaxExportSize()
```

`getMaxExportSize()` returns the upper export limit in pixels for both width and height. When the device limit is unknown or not reported, the engine returns `Int.MAX_VALUE` as a sentinel value. Treat that as "no reported limit", not as a guarantee that every export size is safe: memory and GPU constraints still apply, so keep large export presets conservative and handle export failures.

Use the value to:

- Cap export presets to dimensions the device can render
- Warn users when a requested export exceeds the device limit
- Pick a conservative default `maxImageSize` for the device class

You can also pre-validate a planned export against the limit when your app can resolve the exported block's dimensions. Static exports use `ExportOptions.targetWidth` and `targetHeight`; MP4 exports use the matching fields on `ExportVideoOptions`. Those target fields are already pixel dimensions for the box the block fills while preserving its aspect ratio.

The helper below is intentionally scoped to the guide sample's untransformed page: the scene uses `DesignUnit.PIXEL`, both page size modes are `SizeMode.ABSOLUTE`, and no parent transform changes the page scale. In that setup, `getWidth()` and `getHeight()` match the page dimensions used to compute the export aspect ratio. If your app supports non-pixel units, percentage or auto sizing, rotated blocks, or parent-scaled content, do not treat local `getWidth()` / `getHeight()` values as final export dimensions. Instead, validate with the world-space dimensions your app uses for export presets, or skip the pre-check and rely on the export error handling shown below.

When the block and target box have different aspect ratios, the rendered width or height can be larger than the raw target value. Use the fill scale, `max(targetWidth / pageWidth, targetHeight / pageHeight)`, then compare `ceil(pageWidth * scale)` and `ceil(pageHeight * scale)` with the device limit.

```kotlin highlight-android-validate-export
        // This helper is scoped to this sample's untransformed page. In a more
        // general scene, validate against the world-space dimensions your export
        // workflow uses, or rely on export error handling.
        val plannedExportOptions = ExportOptions(targetWidth = 1600F, targetHeight = 1000F)
        val designUnit = engine.scene.getDesignUnit()
        val widthMode = engine.block.getWidthMode(page)
        val heightMode = engine.block.getHeightMode(page)
        require(
            designUnit == DesignUnit.PIXEL &&
                widthMode == SizeMode.ABSOLUTE &&
                heightMode == SizeMode.ABSOLUTE,
        )

        val pageWidth = engine.block.getWidth(page)
        val pageHeight = engine.block.getHeight(page)
        val targetWidth = plannedExportOptions.targetWidth ?: pageWidth
        val targetHeight = plannedExportOptions.targetHeight ?: pageHeight
        val fillScale = max(targetWidth / pageWidth, targetHeight / pageHeight)
        val renderedWidth = ceil(pageWidth * fillScale).toInt()
        val renderedHeight = ceil(pageHeight * fillScale).toInt()
        val withinLimit = renderedWidth <= maxExportSize && renderedHeight <= maxExportSize
```

## Handling Export Errors

`engine.block.export()` can throw, so wrap it in a `try`/`catch` block and provide a fallback when a static export fails. A practical recovery is to catch `EngineException` and retry with smaller `targetWidth` and `targetHeight` values:

```kotlin highlight-android-handle-export
// Catch export errors so the app can recover. Common remediations are
// lowering the target box for the retry.
// ExportOptions.targetWidth/targetHeight are pixel values for the box
// that the exported block fills while preserving its aspect ratio.
val initialOptions = ExportOptions(targetWidth = 1600F, targetHeight = 1200F)
val pngData = try {
    engine.block.export(block = page, mimeType = MimeType.PNG, options = initialOptions)
} catch (error: EngineException) {
    val retryOptions = ExportOptions(targetWidth = 640F, targetHeight = 480F)
    engine.block.export(block = page, mimeType = MimeType.PNG, options = retryOptions)
}
```

This pattern lets the app keep delivering an export even when the first attempt is too large for the current device or memory pressure is high. Use the same retry strategy for video exports, but call `engine.block.exportVideo()` and pass `ExportVideoOptions(targetWidth=_, targetHeight=_)` instead. Catching `EngineException` keeps coroutine cancellation and VM errors from being converted into retry work. Lowering `maxImageSize` only affects images loaded after the setting changes; if image input size is part of your recovery path, reload or recreate the affected image blocks before retrying.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Images appear blurry on the canvas | `maxImageSize` is below the source resolution | Raise `maxImageSize` if the device has the memory headroom |
| Out-of-memory crashes during editing | `maxImageSize` is too high for the device | Lower `maxImageSize`, especially on phones and tablets |
| Export throws unexpectedly | Rendered output dimensions exceed `getMaxExportSize()` | Reduce the target box or pick a smaller export preset |
| Video export fails | Resolution or duration exceeds device capability | Export at 1080p instead of 4K, or shorten the video |
| Inconsistent results across devices | Different rendering hardware | Set a conservative `maxImageSize` such as `4096` and gate larger exports on `getMaxExportSize()` |

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.getSettingInt(keypath=_)` | Reads an integer setting, such as `maxImageSize` |
| `engine.editor.setSettingInt(keypath=_, value=_)` | Updates an integer setting |
| `engine.editor.onSettingsChanged()` | Returns a Flow that emits when editor settings change |
| `engine.editor.getMaxExportSize()` | Returns the device's maximum export dimension in pixels |
| `engine.block.export(block=_, mimeType=_, options=_)` | Exports a block as static image, binary, SVG, or PDF data |
| `ExportOptions(targetWidth=_, targetHeight=_)` | Configures the target box that static exports fill while preserving aspect ratio |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_)` | Exports a page block as MP4 video data |
| `ExportVideoOptions(targetWidth=_, targetHeight=_)` | Configures the target box that video exports fill while preserving aspect ratio |
| `engine.block.getWidth(block=_)` | Returns the block width in the scene's design unit. Use it for export pre-validation only in a scope where that local value matches the exported block's resolved dimensions, such as an untransformed absolute pixel page |
| `engine.block.getHeight(block=_)` | Returns the block height in the scene's design unit. Use it for export pre-validation only in a scope where that local value matches the exported block's resolved dimensions, such as an untransformed absolute pixel page |
| `engine.block.getWidthMode(block=_)` | Returns the `SizeMode` used for the block width |
| `engine.block.getHeightMode(block=_)` | Returns the `SizeMode` used for the block height |
| `engine.scene.getDesignUnit()` | Reads the scene's design unit |
| `engine.scene.setDesignUnit(designUnit=_)` | Sets the scene's design unit |

## Next Steps

Explore related guides to build complete export workflows:

- [Settings Guide](../../settings.md) - Complete Settings API reference and configuration options
- [File Format Support](../../file-format-support.md) - Supported image and video formats with capabilities
- [Export Overview](./overview.md) - Fundamentals of exporting images and videos from CE.SDK
- [Export to PDF](./to-pdf.md) - PDF export guide with multi-page support and print optimization



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Improve Performance](./performance.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-performance/Performance.kt reference-only
import android.net.Uri
import android.util.Log
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.Source
import java.nio.ByteBuffer
import java.util.Locale
import kotlin.math.max
import kotlin.math.roundToInt

private const val TAG = "PerformanceGuide"

data class PerformanceSummary(
    val sourceSetWidths: List<Int>,
    val usedMemoryBytes: Long,
    val availableMemoryBytes: Long,
    val maxExportSize: Int,
    val maxExportSizeIsKnownLimit: Boolean,
    val exportWithinSizeLimit: Boolean,
    val exportedJpeg: ByteBuffer,
    val assetBasePath: String,
)

suspend fun performance(engine: Engine): PerformanceSummary {
    val assetBasePath = "file:///android_asset/assets"

    engine.editor.setSettingString(keypath = "basePath", value = assetBasePath)

    val scene = engine.scene.create(designUnit = DesignUnit.PIXEL)
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 1920F)
    engine.block.setHeight(block = page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block = imageBlock, value = 1280F)
    engine.block.setHeight(block = imageBlock, value = 853F)
    engine.block.setPositionX(block = imageBlock, value = 320F)
    engine.block.setPositionY(block = imageBlock, value = 113F)

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
            Source(
                uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg"),
                width = 2048,
                height = 1366,
            ),
        ),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
    engine.block.appendChild(parent = page, child = imageBlock)

    val configuredSourceWidths = engine.block
        .getSourceSet(block = imageFill, property = "fill/image/sourceSet")
        .map(Source::width)
        .sorted()
    check(configuredSourceWidths == listOf(512, 1024, 2048))

    val usedMemory = engine.editor.getUsedMemory()
    val availableMemory = engine.editor.getAvailableMemory()
    val totalMemory = usedMemory + availableMemory
    if (totalMemory > 0L) {
        val usagePercentage = usedMemory.toDouble() / totalMemory.toDouble() * 100.0
        Log.i(TAG, "Memory usage: ${String.format(Locale.US, "%.2f", usagePercentage)}%")
    }

    val exportOptions = ExportOptions(
        jpegQuality = 0.8F,
        targetWidth = 1280F,
        targetHeight = 720F,
    )

    val maxExportSize = engine.editor.getMaxExportSize()
    val maxExportSizeIsKnownLimit = maxExportSize != Int.MAX_VALUE

    val exportWithinSizeLimit = if (!maxExportSizeIsKnownLimit) {
        true
    } else if (
        engine.scene.getDesignUnit() == DesignUnit.PIXEL &&
        engine.block.getWidthMode(page) == SizeMode.ABSOLUTE &&
        engine.block.getHeightMode(page) == SizeMode.ABSOLUTE
    ) {
        val pageWidth = engine.block.getWidth(page)
        val pageHeight = engine.block.getHeight(page)
        val targetWidth = exportOptions.targetWidth ?: pageWidth
        val targetHeight = exportOptions.targetHeight ?: pageHeight
        val fillScale = max(targetWidth / pageWidth, targetHeight / pageHeight)
        val renderedWidth = (pageWidth * fillScale).roundToInt()
        val renderedHeight = (pageHeight * fillScale).roundToInt()

        renderedWidth <= maxExportSize && renderedHeight <= maxExportSize
    } else {
        true
    }

    check(exportWithinSizeLimit) { "Requested export dimensions exceed the device export limit." }

    val exportedJpeg = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = exportOptions,
    )

    check(exportedJpeg.hasRemaining()) { "JPEG export is empty." }

    return PerformanceSummary(
        sourceSetWidths = configuredSourceWidths,
        usedMemoryBytes = usedMemory,
        availableMemoryBytes = availableMemory,
        maxExportSize = maxExportSize,
        maxExportSizeIsKnownLimit = maxExportSizeIsKnownLimit,
        exportWithinSizeLimit = exportWithinSizeLimit,
        exportedJpeg = exportedJpeg.asReadOnlyBuffer(),
        assetBasePath = engine.editor.getSettingString("basePath"),
    )
}

fun releasePerformanceEngine(
    engine: Engine,
    finishingSession: Boolean,
) {
    if (!engine.isEngineRunning()) return

    if (engine.isBound()) {
        engine.unbind()
    }

    if (finishingSession) {
        engine.stop()
    } else {
        engine.editor.setAppIsPaused(paused = true)
        engine.pause()
    }
}

fun resumePerformanceEngine(
    engine: Engine,
    bindRenderTarget: () -> Unit,
) {
    if (!engine.isEngineRunning()) return

    if (!engine.isBound()) {
        bindRenderTarget()
    }

    engine.editor.setAppIsPaused(paused = false)
    engine.unpause()
}
```

Optimize CE.SDK integration for faster loading, lower memory pressure, and reliable exports on Android.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1/engine-guides-performance)

![Exported Android performance sample](https://img.ly/docs/cesdk/android/performance-3c12eb/assets/android.export.webp)

<EngineReferenceNote {...props} />

CE.SDK ships a fully featured engine runtime. On Android, performance work usually comes from downloading and starting the `Engine` only when an editing session needs it, loading smaller media while editing, tuning export dimensions, and releasing engine resources when the session ends.

This guide covers source sets for large assets, memory monitoring with the editor APIs, export size and quality tuning, and the Android lifecycle calls that keep idle engine instances from doing unnecessary work.

## Delay Engine and Editor Loading

Keep CE.SDK out of the initial install path when many users may never open an editing flow. Android supports this with [Play Feature Delivery](https://developer.android.com/guide/playcore/feature-delivery): move the CE.SDK engine dependency, editor dependency, or copied editor module into a dynamic feature module, then request that feature when the user enters the editor.

This is the Android counterpart to code splitting on web platforms. The app shell can stay small, while the engine/editor code and native libraries are delivered on demand. See [Bundle Size](./bundle-size.md) for the dynamic feature setup notes and the current Android size expectations.

Even when CE.SDK ships with the base app, still delay runtime startup. Create or start the `Engine` when the editing session begins, and stop it when the session is finished.

## Managing Large Assets

High-resolution images and videos consume significant memory. Use source sets to give the engine multiple resolution variants so it can pick the smallest source that still looks good at the current drawing size.

### Use Source Sets

A source set is a list of `Source` entries with different resolutions for the same image or video. The engine picks the variant whose dimensions best match the current viewport and uses higher-resolution entries when the output needs them.

```kotlin highlight-android-source-sets
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
        Source(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg"),
            width = 2048,
            height = 1366,
        ),
    ),
)
```

This reduces memory pressure during editing while preserving export quality. See [Source Sets](./import-media/source-sets.md) for the full API, including video source sets and asset-source integration.

### Additional Optimization Tips

- Remove unused blocks from the scene when they are no longer needed.
- Prefer source assets sized for your expected editing and export targets.
- Keep only one interactive engine instance active at a time.

## Memory Management

Use the editor memory APIs to observe how much memory the engine currently holds and how much headroom remains. Track these values across long sessions to detect leaks or decide when to free unused assets.

```kotlin highlight-android-memory-monitoring
val usedMemory = engine.editor.getUsedMemory()
val availableMemory = engine.editor.getAvailableMemory()
val totalMemory = usedMemory + availableMemory
if (totalMemory > 0L) {
    val usagePercentage = usedMemory.toDouble() / totalMemory.toDouble() * 100.0
    Log.i(TAG, "Memory usage: ${String.format(Locale.US, "%.2f", usagePercentage)}%")
}
```

`getUsedMemory()` and `getAvailableMemory()` both return byte counts as `Long`. Log or report these values with your normal app telemetry so you can compare behavior across representative Android devices.

## Export Optimization

Tune export resolution and quality to balance fidelity against time and memory. The settings below apply to image exports; video exports use dedicated video export options.

### Optimize Export Settings

`ExportOptions` controls compression and output scaling. Lowering `targetWidth`, `targetHeight`, and `jpegQuality` produces smaller files faster, at the cost of fidelity.

```kotlin highlight-android-export-settings
val exportOptions = ExportOptions(
    jpegQuality = 0.8F,
    targetWidth = 1280F,
    targetHeight = 720F,
)
```

Pass the same options to `engine.block.export` after validating the requested output size against the device limit.

| Property | Type | Purpose |
| --- | --- | --- |
| `targetWidth` / `targetHeight` | `Float?` | Optional output dimensions in pixels. The block is rendered large enough to fill the target while keeping its aspect ratio. Leave both `null` to use the block's intrinsic size. |
| `jpegQuality` | `Float` | JPEG quality in the range `(0, 1]`. Lower values trade quality for smaller files. Defaults to `0.9`. |
| `pngCompressionLevel` | `Int` | PNG compression from `0` to `9`. Higher values produce smaller files but take longer to encode. Defaults to `5`. |
| `webpQuality` | `Float` | WebP quality in the range `(0, 1]`. At `1.0`, WebP uses a lossless encoding path that usually produces smaller files than PNG. Defaults to `1.0`. |

### Export Size Limits

Different devices support different maximum export sizes. Call `getMaxExportSize()` before starting a large export, then branch on `Int.MAX_VALUE`: that value means the Android binding does not know a finite device limit.

```kotlin highlight-android-max-export-size
    val maxExportSize = engine.editor.getMaxExportSize()
    val maxExportSizeIsKnownLimit = maxExportSize != Int.MAX_VALUE

    val exportWithinSizeLimit = if (!maxExportSizeIsKnownLimit) {
        true
    } else if (
        engine.scene.getDesignUnit() == DesignUnit.PIXEL &&
        engine.block.getWidthMode(page) == SizeMode.ABSOLUTE &&
        engine.block.getHeightMode(page) == SizeMode.ABSOLUTE
    ) {
        val pageWidth = engine.block.getWidth(page)
        val pageHeight = engine.block.getHeight(page)
        val targetWidth = exportOptions.targetWidth ?: pageWidth
        val targetHeight = exportOptions.targetHeight ?: pageHeight
        val fillScale = max(targetWidth / pageWidth, targetHeight / pageHeight)
        val renderedWidth = (pageWidth * fillScale).roundToInt()
        val renderedHeight = (pageHeight * fillScale).roundToInt()

        renderedWidth <= maxExportSize && renderedHeight <= maxExportSize
    } else {
        true
    }
```

`getWidth()` and `getHeight()` return values in design units, so use them as fallback output dimensions only when the scene uses `DesignUnit.PIXEL` and the block width and height modes are `SizeMode.ABSOLUTE`. When `ExportOptions` sets `targetWidth` or `targetHeight`, compare the rendered output box against the limit instead. A finite returned value is an upper bound for both output edges; exports can still fail for memory, codec, or scene-complexity reasons.

## Engine Lifecycle and Asset Loading

Create or start the `Engine` when the editing session begins, then keep a strong reference for the lifetime of that session. Before loading scenes that depend on bundled CE.SDK assets, point `basePath` at the copied or hosted Android asset folder.

```kotlin highlight-android-asset-base-path
engine.editor.setSettingString(keypath = "basePath", value = assetBasePath)
```

The sample uses `file:///android_asset/assets`, which expects the extracted CE.SDK Android asset bundle in your app assets. Use an HTTPS URL when you host the same asset folder yourself. See [Serve Assets From Your Server](./serve-assets.md) for the full asset-hosting setup.

When a render target is disposed, unbind it so the engine does not keep a destroyed surface. If the editing session continues in memory, pause the engine so it stops spending processing time; when the session really ends, stop the engine to release native resources.

```kotlin highlight-android-lifecycle
fun releasePerformanceEngine(
    engine: Engine,
    finishingSession: Boolean,
) {
    if (!engine.isEngineRunning()) return

    if (engine.isBound()) {
        engine.unbind()
    }

    if (finishingSession) {
        engine.stop()
    } else {
        engine.editor.setAppIsPaused(paused = true)
        engine.pause()
    }
}
```

When the same screen becomes visible again, bind a new render target if the previous one was released, then clear the paused state and unpause the engine before continuing the editing session.

```kotlin highlight-android-resume-lifecycle
fun resumePerformanceEngine(
    engine: Engine,
    bindRenderTarget: () -> Unit,
) {
    if (!engine.isEngineRunning()) return

    if (!engine.isBound()) {
        bindRenderTarget()
    }

    engine.editor.setAppIsPaused(paused = false)
    engine.unpause()
}
```

Call these lifecycle methods on the main thread. `stop()` makes the engine APIs unavailable until `start()` runs again, so use it only when the editing session is finished.

## Troubleshooting

### Memory warnings or crashes

Monitor memory with `getUsedMemory()` and `getAvailableMemory()` and react when usage climbs. Common remediations are removing unused blocks, lowering the `maxImageSize` setting, or stopping the engine and creating a fresh editing session.

### Export hangs or fails

Validate the requested output dimensions against `getMaxExportSize()` before exporting and lower `targetWidth` or `targetHeight` for large designs. For persistent failures, reduce scene complexity or input asset resolution.

### Slow asset loading

Use source sets so editing loads smaller media. For default CE.SDK assets, host the asset folder close to your users or bundle it in the app when offline access matters.

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.setSettingString(keypath="basePath", value=_)` | Configure where CE.SDK assets are loaded from. |
| `engine.block.setSourceSet(block=_, property="fill/image/sourceSet", sourceSet=_)` | Provide multiple image resolutions for a fill. |
| `engine.block.getSourceSet(block=_, property="fill/image/sourceSet")` | Read the configured source set. |
| `engine.editor.getUsedMemory()` | Get current engine memory usage in bytes. |
| `engine.editor.getAvailableMemory()` | Get remaining available memory in bytes. |
| `engine.editor.getMaxExportSize()` | Get the maximum export edge length in pixels, or `Int.MAX_VALUE` when the limit is unknown. |
| `engine.scene.getDesignUnit()` | Read the scene's design unit before comparing dimensions with pixel limits. |
| `engine.block.getWidthMode(block=_)` | Check whether a block's width is an absolute value. |
| `engine.block.getHeightMode(block=_)` | Check whether a block's height is an absolute value. |
| `engine.block.getWidth(block=_)` | Read the block width before validating export dimensions. |
| `engine.block.getHeight(block=_)` | Read the block height before validating export dimensions. |
| `ExportOptions(jpegQuality=_, targetWidth=_, targetHeight=_)` | Configure image compression and output scaling. |
| `engine.block.export(block=_, mimeType=MimeType.JPEG, options=_)` | Export a block with the selected image settings. |
| `engine.isEngineRunning()` | Check whether the engine is currently started. |
| `engine.isBound()` | Check whether the engine is bound to a render surface or offscreen context. |
| `engine.unbind()` | Release the current render binding. |
| `engine.stop()` | Release native engine resources and make APIs unavailable until restart. |
| `engine.editor.setAppIsPaused(paused=_)` | Inform the engine that the app is paused so it can reduce resource usage. |
| `engine.pause()` | Stop engine processing while keeping resources in memory for a later resume. |
| `engine.unpause()` | Resume processing after a temporary pause. |

## Next Steps

- [Architecture](./concepts/architecture.md) - Understand CE.SDK structure and components
- [Headless Mode](./concepts/headless-mode.md) - Run CE.SDK programmatically without any user interface
- [Export Overview](./export-save-publish/export/overview.md) - Learn about export formats and options



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Compress](./compress.md)

---

Compression's goal is to reduce file sizes during export while maintaining as much visual quality as possible. With the CreativeEditor SDK (CE.SDK) for Android, you can fine-tune compression settings for both images and videos in Kotlin. This allows your app to balance performance, quality, and storage efficiency across all Android devices.

## What You'll Learn

- How to configure compression for PNG and JPEG image exports in Kotlin.
- How to control video file size using bitrate and resolution scaling.
- How to balance file size, quality, and export performance for different use cases.
- How to configure compression programmatically during automation or batch operations.

## When to Use It

Compression tuning is useful whenever:

- Exported media is too large for upload limits
- You need to optimize storage quotas
- You have constrained network bandwidth

Use it when preparing images or videos for any workflow that benefits from:

- Faster load times and smaller files, like:

  - Social media
  - Web delivery

- Consistent file size and predictable performance, like:
  - Batch export
  - Automation scenarios

## Understanding Compression Options by Format

Each format supports its own parameters for balancing:

- Speed
- File size
- Quality

You pass these through the `ExportOptions` structure when calling the export functions.

| Format | Parameter                 | Type     | Effect                              | Default |
| ------ | ------------------------- | -------- | ----------------------------------- | ------- |
| PNG    | `pngCompressionLevel`     | 0–9      | Higher = smaller, slower (lossless) | 5       |
| JPEG   | `jpegQuality`             | 0.0–1.0  | Lower = smaller, lower quality      | 0.9     |
| MP4    | Video bitrate via options | bits/sec | Higher = larger, higher quality     | Auto    |

## Export Images with Compression

Below is an example that exports a design block as PNG and JPEG while tuning compression options.

```kotlin
import android.content.Context
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType
import java.io.File

fun exportCompressedImages(
    context: Context,
    license: String,
    userId: String
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    // Load a demo scene
    val sceneUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene")
    val scene = engine.scene.load(sceneUri = sceneUri)

    // Select the first graphic block to export
    val blocks = engine.block.findByType(DesignBlockType.Graphic)
    if (blocks.isNotEmpty()) {
        val block = blocks.first()

        // Export PNG with maximum compression (lossless)
        val pngOptions = ExportOptions(pngCompressionLevel = 9)
        val pngData = engine.block.export(block, mimeType = MimeType.PNG, options = pngOptions)

        // Save PNG to file
        val pngFile = File(context.filesDir, "compressed.png")
        withContext(Dispatchers.IO) {
            pngFile.outputStream().channel.use { channel ->
                channel.write(pngData)
            }
        }

        // Export JPEG with balanced quality (lossy)
        val jpegOptions = ExportOptions(jpegQuality = 0.7f)
        val jpegData = engine.block.export(block, mimeType = MimeType.JPEG, options = jpegOptions)

        // Save JPEG to file
        val jpegFile = File(context.filesDir, "compressed.jpg")
        withContext(Dispatchers.IO) {
            jpegFile.outputStream().channel.use { channel ->
                channel.write(jpegData)
            }
        }
    }

    engine.stop()
}
```

Choose a format depending on what matters the most for your output:

- **PNG** is ideal for flat graphics or assets that require **transparency**.
- **JPEG** is best for photographs where slight **compression** artifacts are acceptable.
- Use PNG when you need lossless output or transparency, and JPEG when compact photographic output is more important.

## Combine Compression with Resolution Scaling

You can further reduce file size by downscaling exports:

```kotlin
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType

val scaledOptions = ExportOptions(
    pngCompressionLevel = 7,
    targetWidth = 1080f,
    targetHeight = 1080f
)
val scaledData = engine.block.export(block, mimeType = MimeType.PNG, options = scaledOptions)
```

When you specify only one dimension, CE.SDK automatically preserves aspect ratio for consistent results.

## Compress Video Exports

For video exports, you can control compression through various export parameters. The Android SDK uses callback-based video export with progress tracking.

```kotlin
import android.content.Context
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MimeType
import java.io.File

fun exportCompressedVideo(
    context: Context,
    license: String,
    userId: String
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1280, height = 720)

    // Load or create a video scene
    val scene = engine.scene.createForVideo()
    // ... add video content ...

    // Export page as compressed MP4
    val page = engine.block.findByType(DesignBlockType.Page).firstOrNull()
    if (page != null) {
        val videoData = engine.block.exportVideo(
            block = page,
            timeOffset = 0.0,
            duration = engine.block.getDuration(page),
            mimeType = MimeType.MP4,
            progressCallback = { progress ->
                println("Rendered ${progress.renderedFrames}/${progress.totalFrames} frames")
                println("Encoded ${progress.encodedFrames}/${progress.totalFrames} frames")
            }
        )

        // Save video to file
        val videoFile = File(context.filesDir, "compressed_video.mp4")
        withContext(Dispatchers.IO) {
            videoFile.outputStream().channel.use { channel ->
                channel.write(videoData)
            }
        }
    }

    engine.stop()
}
```

About the video compression:

- Video bitrate and encoding settings are handled automatically by the engine
- The SDK optimizes compression based on the content and target resolution
- You can control output quality through resolution scaling using `targetWidth` and `targetHeight` in export options

## Performance and Trade-Offs

Higher compression results in smaller files but slower export speeds. For example:

- PNG Level 9 may take twice as long to encode as Level 3–5, though it produces smaller files.
- JPEG exports are faster but can introduce visible compression artifacts.

Video exports are more demanding and depend heavily on device CPU and GPU performance.

You can check available export limits before encoding:

```kotlin
import ly.img.engine.Engine

val maxSize = engine.editor.getMaxExportSize()
println("Max export size: $maxSize pixels")
```

## Real-World Compression Comparison (1080 × 1080)

The following table compares average results across different compression settings for photo-like and graphic-like images.

| Format   | Setting    | Avg. File Size (KB) | Encode Time (ms) | PSNR (dB)\*  | Notes                    |
| -------- | ---------- | ------------------- | ---------------- | ------------ | ------------------------ |
| **PNG**  | Level 0    | ~1 450              | ~44              | ∞ (lossless) | Fastest, largest         |
|          | Level 5    | ~1 260              | ~61              | ∞            | Balanced speed and size  |
|          | Level 9    | ~1 080              | ~88              | ∞            | Smallest, slowest        |
| **JPEG** | Quality 95 | ~640                | ~24              | 43           | Near-lossless appearance |
|          | Quality 80 | ~420                | ~20              | 39           | Good default for photos  |
|          | Quality 60 | ~290                | ~17              | 35           | Some artifacts visible   |
|          | Quality 40 | ~190                | ~15              | 31           | Heavy compression        |

\*PSNR > 40 dB ≈ visually lossless; 30–35 dB shows mild artifacts.

**Key Takeaways**:

- **JPEG** performs well for photographs; use `jpegQuality = 0.8f–0.9f` for web or print, `0.6f` for compact exports.
- **PNG** is essential for transparency and vector-like shapes; higher levels reduce size modestly at the cost of speed.
- Test on realistic assets: complex photos and flat graphics compress differently.

## Practical Presets

These presets provide starting points for common export scenarios.

| Use Case                             | Format | Typical Settings                             | Result                         | Notes                       |
| ------------------------------------ | ------ | -------------------------------------------- | ------------------------------ | --------------------------- |
| **Web or Social Sharing**            | JPEG   | `jpegQuality: 0.8f`                          | ~60–70 % smaller than PNG      | Balanced quality and size   |
| **UI Graphics / Transparent Assets** | PNG    | `pngCompressionLevel: 6–8`                   | ~25 % smaller than default PNG | Maintains transparency      |
| **High-Quality Print or Archival**   | PNG    | `pngCompressionLevel: 9`                     | Maximum fidelity               | Slower export, large files  |
| **Video for Web / Social**           | MP4    | Use default settings with resolution scaling | Smooth playback, small file    | Adjust resolution as needed |
| **Video for Download / HD**          | MP4    | Higher resolution (1920×1080)                | Full HD quality                | Larger file, slower encode  |

**PDF and Print**: PDF exports use vector graphics when possible and aren't compressed by default.

> **Note:** Consider showing users an **estimated file size** before export. It helps them make informed choices about quality vs. performance.

## Automating Compression in Batch Exports

When exporting multiple elements, apply the same compression settings programmatically:

```kotlin
import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType
import java.io.File

suspend fun exportAllGraphics(engine: Engine, context: Context) {
    val blocks = engine.block.findByType(DesignBlockType.Graphic)
    val options = ExportOptions(jpegQuality = 0.8f)

    blocks.forEachIndexed { index, block ->
        val data = engine.block.export(block, mimeType = MimeType.JPEG, options = options)

        val file = File(context.filesDir, "export_$index.jpg")
        withContext(Dispatchers.IO) {
            file.outputStream().channel.use { channel ->
                channel.write(data)
            }
        }
    }
}
```

This ensures consistent quality and file size across all exported assets.

## Troubleshooting

**❌ File size not reduced**:

- Ensure correct property name such as `jpegQuality` or `pngCompressionLevel`.
- Check that values are floats (e.g., `0.8f` not `0.8`).

**❌ JPEG Quality too low**:

- Increase quality to `0.9f` or use PNG for lossless output.

**❌ Export slow**:

- Check for excessive compression level.
- Lower PNG level to 5–6.
- Use `withContext(Dispatchers.IO)` for file operations.

**❌ Video export issues**:

- Ensure video scene is properly configured.
- Check available memory with `engine.editor.getMaxExportSize()`.
- Monitor progress callback for encoding status.

**❌ Out of memory errors**:

- Reduce target resolution with `targetWidth` and `targetHeight`.
- Export smaller blocks instead of full scene.
- Call `engine.stop()` and restart for fresh memory state.

## Next Steps

Compression is one of the most practical tools for optimizing export workflows. By adjusting the `ExportOptions` structure in Kotlin, you can deliver high-quality results efficiently—whether your users are exporting social media posts, UI assets, or professional-grade print layouts.

- [Export Overview](./overview.md) to learn about all available export formats.
- Apply compression consistently in automated exports using [batch processing](../../automation/batch-processing.md).
- Combine scaling and compression for [thumbnails](../create-thumbnail.md).



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
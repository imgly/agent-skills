> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [To Base64](./to-base64.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-conversion-to-base64/ToBase64.kt reference-only
import android.util.Base64
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

suspend fun exportDesignToBase64(engine: Engine): List<String> = withContext(engine.dispatcher) {
    val scene = engine.scene.create()
    val page = createSamplePage(engine)
    engine.block.appendChild(parent = scene, child = page)

    val mimeType = MimeType.PNG
    val buffer = engine.block.export(block = page, mimeType = mimeType)
    val base64 = buffer.toBase64()
    val dataUri = "data:${mimeType.key};base64,$base64"

    val inlineImageSource = "data:${mimeType.key};base64,$base64"
    // Use inlineImageSource wherever your app expects a URI string,
    // for example in a WebView, JSON payload, or HTML email template.

    val jpegOptions = ExportOptions(jpegQuality = 0.7F, targetWidth = 720F)
    val jpegBuffer = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = jpegOptions,
    )
    val jpegDataUri = jpegBuffer.toDataUri(MimeType.JPEG)

    val compressedPngOptions = ExportOptions(pngCompressionLevel = 9, targetWidth = 720F)
    val compressedPngBuffer = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = compressedPngOptions,
    )
    val compressedPngDataUri = compressedPngBuffer.toDataUri(MimeType.PNG)

    val secondPage = createSamplePage(engine)
    engine.block.appendChild(parent = scene, child = secondPage)

    val pages = engine.scene.getPages()
    val pageBuffers = engine.block.export(blocks = pages, mimeType = MimeType.PNG)
    val pageDataUris = pageBuffers.map { pageBuffer ->
        pageBuffer.toDataUri(MimeType.PNG)
    }

    check(inlineImageSource.startsWith("data:image/png;base64,"))
    check(jpegDataUri.startsWith("data:image/jpeg;base64,"))
    check(compressedPngDataUri.startsWith("data:image/png;base64,"))
    check(pageDataUris.size == pages.size)
    check(pageDataUris.all { it.startsWith("data:image/png;base64,") })
    listOf(dataUri, jpegDataUri, compressedPngDataUri) + pageDataUris
}

private fun ByteBuffer.toBase64(): String {
    val copy = asReadOnlyBuffer()
    copy.rewind()
    val bytes = ByteArray(copy.remaining())
    copy.get(bytes)
    return Base64.encodeToString(bytes, Base64.NO_WRAP)
}

private fun ByteBuffer.toDataUri(mimeType: MimeType): String = "data:${mimeType.key};base64,${toBase64()}"

private fun createSamplePage(engine: Engine): DesignBlock {
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromHex("#F4F0EA"))
    engine.block.appendChild(parent = page, child = background)
    engine.block.fillParent(background)

    val text = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(text, text = "Base64 export")
    engine.block.setPositionX(text, value = 96F)
    engine.block.setPositionY(text, value = 456F)
    engine.block.setWidth(text, value = 888F)
    engine.block.setTextFontSize(text, fontSize = 96F)
    engine.block.setTextColor(text, color = Color.fromHex("#23201D"))
    engine.block.appendChild(parent = page, child = text)

    return page
}
```

Convert CE.SDK exports to Base64-encoded strings for embedding in HTML, storing in databases, or transmitting via JSON APIs.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260821/engine-guides-conversion-to-base64)

<EngineReferenceNote {...props} />

Base64 encoding transforms binary image data into ASCII text. On Android, CE.SDK's `engine.block.export()` returns a `ByteBuffer`; convert that buffer to a Base64 string with Android's `Base64` API, then prepend the MIME type when you need a data URI.

## Export a Block to Base64

Export a design block as PNG and convert the resulting buffer to a Base64 string.

```kotlin highlight-android-export-base64
val mimeType = MimeType.PNG
val buffer = engine.block.export(block = page, mimeType = mimeType)
val base64 = buffer.toBase64()
val dataUri = "data:${mimeType.key};base64,$base64"
```

The export buffer contains the rendered image. `Base64.NO_WRAP` keeps the encoded output on one line, which is required for data URIs and JSON string values.

## Convert Buffer to Base64

Copy the readable bytes out of the `ByteBuffer`, then encode them as Base64 text.

```kotlin highlight-android-convert-buffer
private fun ByteBuffer.toBase64(): String {
    val copy = asReadOnlyBuffer()
    copy.rewind()
    val bytes = ByteArray(copy.remaining())
    copy.get(bytes)
    return Base64.encodeToString(bytes, Base64.NO_WRAP)
}

private fun ByteBuffer.toDataUri(mimeType: MimeType): String = "data:${mimeType.key};base64,${toBase64()}"
```

The helper uses a read-only copy so converting the buffer does not consume the original buffer's position for later file writes or checks.

## Create a Data URI

Construct a data URI by combining the MIME type with the Base64 string. Data URIs embed image data directly in HTML, CSS, or WebView content without separate file references.

```kotlin highlight-android-data-uri
val inlineImageSource = "data:${mimeType.key};base64,$base64"
// Use inlineImageSource wherever your app expects a URI string,
// for example in a WebView, JSON payload, or HTML email template.
```

The resulting string follows the format `data:image/png;base64,...`. Use `MimeType.key` so the URI prefix always matches the export format.

## Work with Different MIME Types

CE.SDK supports multiple image formats, each with format-specific quality options through `ExportOptions`.

```kotlin highlight-android-mime-types
    val jpegOptions = ExportOptions(jpegQuality = 0.7F, targetWidth = 720F)
    val jpegBuffer = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = jpegOptions,
    )
    val jpegDataUri = jpegBuffer.toDataUri(MimeType.JPEG)

    val compressedPngOptions = ExportOptions(pngCompressionLevel = 9, targetWidth = 720F)
    val compressedPngBuffer = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = compressedPngOptions,
    )
    val compressedPngDataUri = compressedPngBuffer.toDataUri(MimeType.PNG)
```

| Format | Option | Default | Notes |
|--------|--------|---------|-------|
| PNG | `pngCompressionLevel` | `5` | Lossless, supports transparency |
| JPEG | `jpegQuality` | `0.9` | Lossy, smaller file size, no transparency |

> **Note:** Base64 increases data size by approximately 33%. For images larger than 100KB, consider storing the raw bytes or a file URI instead.

## Batch Process Multiple Pages

Export all pages in a scene to Base64 strings with the batch export API. Pass the full page list to `engine.block.export(blocks = pages, mimeType = MimeType.PNG)`, then encode each returned buffer.

```kotlin highlight-android-batch
val pages = engine.scene.getPages()
val pageBuffers = engine.block.export(blocks = pages, mimeType = MimeType.PNG)
val pageDataUris = pageBuffers.map { pageBuffer ->
    pageBuffer.toDataUri(MimeType.PNG)
}
```

The batch API returns one buffer per input block in the same order, so keep the page list and encoded strings aligned when you persist metadata.

## When to Use Base64

Base64 encoding is useful for:

- Embedding images in HTML email templates or WebView content
- Storing image data in text-only databases or `SharedPreferences`
- Transmitting images through JSON APIs that don't support binary data
- Creating inline data URIs for CSS backgrounds

For large images or file storage, write the buffer bytes directly to disk instead of expanding them into Base64 text.

## Troubleshooting

**Base64 string too long** — Use JPEG with a lower `jpegQuality`, reduce dimensions with `targetWidth` and `targetHeight`, or store the raw bytes when your API accepts binary data.

**Image not displaying** — Verify the data URI starts with `data:${mimeType.key};base64,` and that the Base64 payload was not truncated during storage or transport.

**Memory pressure with batch exports** — Keep batch exports scoped to the pages or blocks you need. Convert each `ByteBuffer` through a read-only copy so checks or later writes do not depend on a consumed buffer position.

## API Reference

| API | Purpose |
|-----|---------|
| `engine.block.export(block=_, mimeType=_, options=_)` | Export one `DesignBlock` to a `ByteBuffer` with image format and size options |
| `engine.block.export(blocks=_, mimeType=_, options=_)` | Export multiple blocks and receive one `ByteBuffer` per block in input order |
| `engine.scene.getPages()` | Get the scene pages for page-by-page batch exports |
| `ExportOptions(jpegQuality=_, pngCompressionLevel=_, targetWidth=_, targetHeight=_)` | Configure compression quality and output dimensions for supported image exports |
| `Base64.encodeToString(input=_, flags=Base64.NO_WRAP)` | Encode exported bytes as a single-line Base64 string |

## Next Steps

- [Export Options](../export-save-publish/export/overview.md) — Explore all available export formats and configuration
- [To PDF](./to-pdf.md) — Convert your design or document into a high-quality, print-ready PDF format.
- [Partial Export](../export-save-publish/export/partial-export.md) — Learn how to export specific blocks, groups, and page elements instead of entire scenes using CE.SDK's programmatic export API.
- [Size Limits](../export-save-publish/export/size-limits.md) — Understand and configure limits on exported file dimensions or data size



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
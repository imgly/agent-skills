> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [Overview](./overview.md)

---

CreativeEditor SDK (CE.SDK) exports Android designs to formats such as PNG,
PDF, SVG, and MP4 so your app can prepare assets for sharing, printing,
storage, or publishing workflows.

<EngineReferenceNote {...props} />

You can trigger conversions programmatically with the Android Engine API or let
users start exports through the editor UI.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android)

[Get Started](../get-started/overview.md)

## Supported Input and Output Formats

CE.SDK accepts a range of input formats when working with designs, including:

When it comes to exporting or converting designs, the SDK supports the following output formats:

| Category     | Supported Formats                                    |
| ------------ | ---------------------------------------------------- |
| **Images**   | `.png`, `.jpeg`, `.tga`                              |
| **Vector**   | `.svg` with text exported as paths                   |
| **Print**    | `.pdf` with compatibility and underlayer options     |
| **Video**    | `.mp4`                                               |
| **Scene**    | serialized scene strings for `.scene` workflows     |
| **Blocks**   | proprietary block strings or block archive entries such as `blocks.blocks` |
| **Archive**  | `.zip` archives with scenes or blocks and their assets |
| **Raw Data** | binary RGBA8888 image data through `MimeType.BINARY` |

Each format serves different use cases, giving you the flexibility to adapt designs for your application’s needs.

## Conversion Methods

Use the conversion path that matches how much control your Android app needs over
the export workflow.

| Method | Android API | Use it for |
| ------ | ----------- | ---------- |
| Programmatic image, vector, PDF, or raw binary export | `engine.block.export(...)` | Exporting a scene, page, group, or block from Kotlin with a selected `MimeType` and optional `ExportOptions`. |
| Programmatic video export | `engine.block.exportVideo(...)` | Exporting a page timeline to MP4 while receiving progress updates. |
| Scene and block serialization | `engine.scene.saveToString(scene=_)`, `engine.scene.saveToArchive(scene=_)`, `engine.block.saveToString(blocks=_)`, `engine.block.saveToArchive(blocks=_)` | Persisting editable CE.SDK content either as a serialized scene string or archive, or as proprietary block data or a block archive. |
| Color-mask export | `engine.block.exportWithColorMask(...)` | Creating image data plus a mask for workflows that need a separate color mask. |
| Editor UI export | `onExport` / built-in export action | Letting users export from the Android editor UI while your app controls the final export handling. |

Programmatic exports return binary data that your app can write to storage,
upload, share, or pass to another workflow. UI-driven exports are useful when
the editor should remain user-facing and the app only needs to customize what
happens after the user taps export.

## Customization Options

Android exports combine scene-level settings with `ExportOptions` for static
formats and `ExportVideoOptions` for MP4 output.

| Option | Applies to | Purpose |
| ------ | ---------- | ------- |
| `targetWidth` / `targetHeight` | Static and video exports | Render output at a specific size while preserving the block aspect ratio. |
| `scene/dpi` | Scene exports and design units | Set print metadata and the pixel-to-inch or millimeter conversion, either while creating an image scene with `engine.scene.createFromImage(imageUri = imageUri, dpi = 300F)` or later with `engine.block.setFloat(block = scene, property = "scene/dpi", value = 300F)`. |
| `pngCompressionLevel` | PNG | Balance file size and encode time without changing visual quality. |
| `jpegQuality` | JPEG | Control compression quality for JPEG exports. |
| `exportPdfWithHighCompatibility` | PDF | Rasterize effects and images for broader PDF viewer compatibility. |
| `exportPdfWithUnderlayer` and underlayer settings | PDF | Generate print underlayers for production workflows that require them. |
| `frameRate`, bitrate, and H.264 settings | MP4 | Tune video export quality, size, and encoding behavior. |

Check `engine.editor.getMaxExportSize()` before large raster exports so the
requested dimensions stay within the device-supported export limit.
Use `targetWidth` and `targetHeight` for explicit pixel dimensions; changing
`scene/dpi` does not replace those pixel-size controls.

## Next Steps

- [To Base64](./to-base64.md) — Convert exported binary data into Base64 strings and data URIs.
- [To Binary Data](./to-blob.md) — Export design blocks to `ByteBuffer` data for saving, uploading, or sharing.
- [To PNG](../export-save-publish/export/to-png.md) — Export CE.SDK designs as PNG images with lossless compression, alpha support, and configurable output dimensions.&#x20;
- [To PDF](./to-pdf.md) — Convert your design or document into a high-quality, print-ready PDF format.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
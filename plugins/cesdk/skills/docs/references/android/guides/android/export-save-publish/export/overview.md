> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Overview](./overview.md)

---

Choose the right export path for images, documents, raw data, and video.
CE.SDK exports on the device and lets Android integrations tune file size,
quality, dimensions, transparency, and compatibility in the dedicated export
guides.

This overview is a map of the export category. Use the format-specific guides for implementation code and option details.

## What Export Options Control

Export options determine the output format and the trade-offs that matter for your app:

- **Format**: Pick the output type that matches the destination, such as an image preview, a print-ready PDF, raw pixel data, or an MP4 video.
- **Quality and compression**: Balance visual fidelity, encoding time, and file size.
- **Dimensions**: Set a target box that the export fills while preserving the exported block's aspect ratio.
- **Transparency**: Use a format that preserves alpha when the design depends on transparent pixels.
- **Compatibility**: Prefer compatibility-oriented settings for files that must open reliably across viewers and devices.

## Android Export Scope

Current Android bindings expose block export APIs for static files, color masks, and MP4 video. They do not expose an audio export API or audio MIME type enum, so audio export is not presented as an Android-supported export area here.

## Supported Android Formats

Use these Android `MimeType` values when choosing an export format:

| Format | Android `MimeType` | MIME String                | Practical Use                                                                                          |
| ------ | ------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| PNG    | `MimeType.PNG`     | `image/png`                | Lossless image output with transparency for previews, UI graphics, and designs with sharp edges.       |
| JPEG   | `MimeType.JPEG`    | `image/jpeg`               | Compact lossy image output for photos, sharing flows, and backgrounds that do not need alpha.          |
| TGA    | `MimeType.TGA`     | `image/x-tga`              | Image pipelines that specifically require TGA files.                                                   |
| SVG    | `MimeType.SVG`     | `image/svg+xml`            | Scalable graphics and post-processing workflows, with unsupported visual effects rasterized as needed. |
| PDF    | `MimeType.PDF`     | `application/pdf`          | Document and print workflows, including compatibility-oriented export settings.                        |
| MP4    | `MimeType.MP4`     | `video/mp4`                | Timeline-based page export for video sharing or playback.                                              |
| Binary | `MimeType.BINARY`  | `application/octet-stream` | Raw RGBA8888 data for custom image processing or graphics pipelines.                                   |

For the complete format compatibility matrix, including codecs and size limits, see [File Format Support](../../file-format-support.md).

## Programmatic Export Basics

Android exports run locally on the device. Use `engine.block.export(...)` for static image, document, SVG, and raw-data output, passing the block to export, a supported `MimeType`, and optional `ExportOptions`. The API returns a `ByteBuffer` that your app can write to app storage, pass to a share flow, or upload to your backend.

Use `ExportOptions` to configure the options that apply to the selected format:

- `pngCompressionLevel` controls PNG file size and encoding speed without changing image quality.
- `jpegQuality` controls JPEG visual quality and file size.
- `targetWidth` and `targetHeight` set a target box that the export fills while preserving the block's aspect ratio; if the ratios differ, one output dimension can exceed the requested target.
- PDF options such as `exportPdfWithHighCompatibility`, `exportPdfWithUnderlayer`, and the underlayer fields tune print and compatibility workflows.
- `pdfImageQuality` controls the encoding quality of images that CE.SDK has to rasterize during PDF export; values below the default of `1.0` encode them as lossy JPEG.
- `allowTextOverhang` includes glyph overhangs when text would otherwise clip at its frame bounds.

For several blocks, use the list overload of `engine.block.export(...)` so the export worker can process them together. Use `engine.block.exportWithColorMask(...)` when you need a masked image and alpha mask from a specific color, and use `engine.block.exportVideo(...)` for MP4 video exports from page blocks with a time offset, duration, progress callback, and optional `ExportVideoOptions`.

## Single-Page vs Multi-Page Designs

Export the block that matches the result you want. Exporting a page gives you one predictable page-sized file, while exporting a group or individual block limits the output to that hierarchy.

When a scene contains multiple pages, exporting the whole scene includes the pages in their scene layout. That can produce transparent areas between pages when page spacing is part of the scene bounds. For multi-page workflows, export each page individually when you need consistent per-page files or dimensions.

## Device Export Limits

Before requesting large exports, check the current device's reported limits. `engine.editor.getMaxExportSize()` returns the maximum supported export dimension in pixels; both the requested width and height must stay at or below that value. When the limit is unknown, the API returns the maximum signed 32-bit integer value.

`engine.editor.getAvailableMemory()` returns currently available memory in bytes. Treat both values as planning signals, not guarantees: an export can still fail because of memory pressure, asset loading, or the complexity of the rendered content. For large previews, prefer explicit `targetWidth` and `targetHeight` values that stay comfortably below the reported size limit.

## Export from the Editor UI

The CE.SDK editor UI can expose export actions for users. Use the editor configuration guides when your app needs to replace the default export behavior, write the resulting file to app storage, or hand it to an Android share flow.

For a complete editor surface around video workflows, see the [Video Editor Starter Kit](../../starterkits/video-editor.md).

## Next Steps

- [To PNG](./to-png.md) — Export your designs as PNG images with transparency
  support and configurable compression for web graphics, UI elements, and content
  requiring crisp edges.

- [To JPEG](./to-jpeg.md) — Export CE.SDK designs to JPEG format with configurable
  quality settings for photographs, web images, and social media content.

- [Export to PDF](./to-pdf.md) — Configure PDF export from the editor UI
  and decide how your app stores or shares the generated file.

- [To MP4](./to-mp4.md) — Export video compositions as MP4 files with configurable
  encoding options, progress tracking, and resolution control.

- [To Raw Data](./to-raw-data.md) — Export designs to uncompressed RGBA pixel
  data for custom image processing, GPU uploads, and advanced graphics workflows.

- [With a Color Mask](./with-color-mask.md) — Learn how to export design blocks
  with color masking to remove specific colors and generate alpha masks for print
  workflows and compositing.

- [Partial Export](./partial-export.md) — Learn how to export specific blocks,
  groups, and page elements instead of entire scenes using CE.SDK's programmatic
  export API.

- [Compress Exports for Smaller Files](./compress.md) — Tune compression
  and quality settings to reduce output size.

- [Size Limits](./size-limits.md) — Understand and configure limits on exported
  file dimensions or data size.




---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
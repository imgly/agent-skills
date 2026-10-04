> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [File Format Support](./file-format-support.md)

---

When building creative applications with CE.SDK, understanding which file formats your users can import is crucial for delivering a smooth editing experience. CE.SDK supports a comprehensive range of modern media formats.

This guide provides a complete reference of supported file formats for importing media, templates, and fonts into CE.SDK.

## Supported Import Formats

CE.SDK supports importing the following media types:

| Category      | Supported Formats                                                  |
| ------------- | ------------------------------------------------------------------ |
| **Images**    | `.png`, `.apng`, `.jpeg`, `.jpg`, `.gif`, `.webp`, `.svg`, `.bmp`  |
| **Video**     | `.mp4` (H.264/AVC, H.265/HEVC), `.mov` (H.264/AVC, H.265/HEVC)     |
| **Audio**     | `.wav`, `.mp3`, `.m4a`, `.mp4` (AAC or MP3), `.mov` (AAC or MP3)   |
| **Animation** | `.json` (Lottie)                                                   |

Animated images (`.gif` and `.apng`) import as a static first frame in design
scenes and as a looping video fill in video scenes.

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs
> programmatically.

## Video and Audio Codecs

While container formats (`.mp4`, `.mov`) define how media is packaged, codecs determine how the content is compressed. CE.SDK supports the following codecs for playback and editing:

### **Video Codecs**

- **H.264 / AVC** (in `.mp4`)
- **H.265 / HEVC** (in `.mp4`, may require platform-specific support)

### **Audio Codecs**

- **MP3** (in `.mp3` or within `.mp4`)
- **AAC** (in `.m4a` or within `.mp4` or `.mov`)

These codecs apply to importing media. For export, CE.SDK produces MP4 with H.264 (H.265 only on supported browser and mobile platforms); the native Node.js package (`@cesdk/node-native`) exports H.264 video with AAC audio.

> **Warning:** H.265/HEVC playback depends on the device providing a hardware or system
> decoder. Availability varies across devices and operating system versions, so
> test H.265 content on your target hardware before relying on it.

## Size Limits and Constraints

CE.SDK processes media on-device, so performance is bounded by the hardware capabilities of the device running the editor. Keep these practical limits in mind:

### Image Resolution Limits

| Constraint            | Recommendation / Limit                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input Resolution**  | Maximum input resolution is **4096×4096 pixels**. Images from external sources (e.g., Unsplash) are resized to this size before rendering on the canvas. You can modify this value using the `maxImageSize` setting.  |
| **Output Resolution** | There is no enforced output resolution limit. Theoretically, the editor supports output sizes up to **16,384×16,384 pixels**. However, practical limits depend on the device's GPU capabilities and available memory. |

All image processing in CE.SDK happens on the device running the engine, so these values depend on the **maximum texture size** supported by its hardware. The default limit of 4096×4096 is a safe baseline that works universally. Higher resolutions (e.g., 8192×8192) may work on certain devices but could fail on others during export if the GPU texture size is exceeded.

> **Note:** To ensure consistent results across devices, it’s best to test higher output
> sizes on your target hardware and set conservative defaults in production.

### Video Resolution and Duration Limits

| Constraint     | Recommendation / Limit                                                                                                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resolution** | Up to **4K UHD** is supported for **playback** and **export** on capable devices, bounded by GPU texture size and available memory. For **import**, CE.SDK does not impose artificial limits, but maximum video size is bounded by available device memory and the native media framework's decoder capabilities. The maximum export dimension varies by device and can be queried via `engine.editor.getMaxExportSize()`. |
| **Frame Rate** | 30 FPS at 1080p is broadly supported; 60 FPS and high-resolution exports benefit from hardware acceleration via the device's native media frameworks.                                                                                                                                            |
| **Duration**   | Stories and reels of up to **2 minutes** are fully supported. Longer videos are also supported, but we generally found a maximum duration of **10 minutes** to be a good balance for a smooth editing experience and a pleasant export duration of around one minute on modern hardware.        |

> **Note:** Performance scales with device hardware. For best results with high-resolution
> or high-frame-rate video, modern devices with hardware video acceleration are
> recommended.

## Format-Specific Considerations

### SVG Limitations

CE.SDK uses Skia for SVG parsing and rendering. While most SVG files render correctly, there are some important limitations to be aware of:

### Text Elements

- SVG text elements are not supported - any text in SVG files will not be rendered.
- Convert text to paths in your vector editor before exporting if text is needed.

### Styling Limitations

- CSS styles included in SVGs are not supported - use presentation attributes instead.
- RGBA color syntax is not supported - use `fill-opacity` and `stroke-opacity` attributes.
- When exporting SVGs from design tools, choose the "presentation attributes" option.

### Unsupported SVG Elements

The following SVG elements are not supported:

- Animation elements (`<animate>`)
- Foreign object (`<foreignObject>`)
- Text-related elements (`<altGlyph>`, `<font>`, `<glyph>`)
- Script elements (`<script>`)
- Some filter elements (`<feComponentTransfer>`, `<feConvolveMatrix>`, `<feTile>`, `<feDropShadow>`)
- Inlined SVGs via `<image>` or `<feImage>` elements

### WebP Support

WebP images are fully supported for import. CE.SDK handles both lossy and lossless WebP formats, including images with transparency (alpha channel). WebP provides excellent compression with high quality, making it a strong choice for creative applications.

### Animated Image Considerations (GIF and APNG)

CE.SDK handles animated GIF and APNG files based on scene type:

- **Design scenes**: rendered as a static image showing the first frame.
- **Video scenes**: imported as a looping video fill, with frame timing and duration parsed from the file's metadata.

For vector-based animations, consider **Lottie** (`.json`). For complex animated content, prefer `.mp4`, which offers better compression and broad codec support.

### Template Format Details

CE.SDK loads scenes and design archives directly on-device:

- **Scene** – CE.SDK's native scene format (`.imgly` or `.scene`), loaded with `engine.scene.load(from:)`.
- **Archive** – A portable `.imgly` (or `.zip`) file that bundles a scene with its embedded assets, loaded with the same `engine.scene.load(from:)` call.

**PSD** (Adobe Photoshop) and **IDML** (Adobe InDesign) files have no on-device parser — the `@imgly/psd-importer` and `@imgly/idml-importer` packages parse them in Node.js or the browser. Convert those files to an `.imgly` archive on a server, then load the archive on-device with `engine.scene.load(from:)`. See [Import from Photoshop](../open-the-editor/import-design/from-photoshop.md) and [Import from InDesign](../open-the-editor/import-design/from-indesign.md) for the complete workflow.

## Font Format Support

CE.SDK supports modern font formats for typography:

| Format   | Description                       |
| -------- | --------------------------------- |
| `.ttf`   | TrueType Font                     |
| `.otf`   | OpenType Font                     |
| `.woff`  | Web Open Font Format              |
| `.woff2` | Compressed Web Open Font Format 2 |

> **Note:** Fonts should be appropriately licensed before being embedded in your
> application.

## Best Practices

### Format Selection

When building your application, consider these format recommendations:

- **Images**: Use `.webp` for the best compression-to-quality ratio. Fall back to `.png` for transparency or `.jpeg` for photographs without transparency.
- **Video**: Prefer `.mp4` with H.264 encoding for the widest compatibility across devices.
- **Audio**: Use `.mp3` for universal compatibility or `.m4a` (AAC) for better quality at smaller file sizes.
- **Templates**: Use `.imgly` scene or archive files for CE.SDK-to-CE.SDK workflows. To migrate `.psd`/`.idml` designs, convert them to an `.imgly` archive first — there is no on-device parser for those formats.

### Validation and Error Handling

Always validate file formats before attempting import:

1. **Check MIME types** when a file is selected to quickly reject unsupported formats.
2. **Validate file extensions** as a first line of defense.
3. **Monitor file sizes** to prevent memory issues with extremely large files.
4. **Provide clear error messages** that explain which formats are supported when an import fails.

### Memory Management

Media is processed on-device, so be mindful of memory constraints:

- Large video files can cause performance issues on memory-constrained devices.
- Multiple high-resolution images loaded simultaneously can exhaust GPU memory.
- Consider lazy loading for asset libraries that contain many files.
- Provide progress indicators for large file imports to improve the user experience.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [File Format Support](./import-media/file-format-support.md)

---

When building creative applications with CE.SDK, understanding which file formats your users can import is crucial for delivering a smooth editing experience. CE.SDK supports a comprehensive range of modern media formats.

This guide provides a complete reference of supported file formats for importing media, templates, and fonts into CE.SDK on web platforms.

## Supported Import Formats

CE.SDK supports importing the following media types directly in the browser:

| Category        | Supported Formats                                                                       |
| --------------- | --------------------------------------------------------------------------------------- |
| **Images**      | `.png`, `.jpeg`, `.jpg`, `.gif`, `.webp`, `.svg`, `.bmp`                               |
| **Video**       | `.mp4` (H.264/AVC, H.265/HEVC), `.mov` (H.264/AVC, H.265/HEVC), `.webm` (VP8, VP9, AV1) |
| **Audio**       | `.mp3`, `.m4a`, `.mp4` (AAC or MP3), `.mov` (AAC or MP3)                               |
| **Animation**   | `.json` (Lottie)                                                                        |
| **Templates**   | `.idml` (InDesign), `.psd` (Photoshop), `.scene` (CE.SDK Native)                       |

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs
> programmatically. Contact our support team to learn more about implementing
> custom importers.

## Video and Audio Codecs

While container formats (`.mp4`, `.mov`, `.webm`) define how media is packaged, codecs determine how the content is compressed. CE.SDK supports the following codecs for web playback and editing:

### Video Codecs

- **H.264 / AVC** (in `.mp4` or `.mov`) – Universally supported across all modern browsers
- **H.265 / HEVC** (in `.mp4` or `.mov`) – Requires platform-specific support; availability varies by browser and operating system
- **VP8, VP9, AV1** (in `.webm`) – Modern web-native codecs with broad browser support

### Audio Codecs

- **MP3** (in `.mp3` files or within `.mp4`/`.mov` containers)
- **AAC** (in `.m4a`, `.mp4`, or `.mov` containers)

> **Warning:** H.265/HEVC support varies by browser and requires hardware acceleration or
> licensed software decoders. Always test video playback on your target browsers
> before deploying H.265 content to end users.

## Size Limits and Constraints

CE.SDK processes all media client-side in the browser, which means performance is bounded by the user's hardware capabilities. Here are the practical limits to keep in mind:

### Image Resolution Limits

| Constraint            | Recommendation / Limit                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input Resolution**  | Maximum input resolution is **4096×4096 pixels**. Images from external sources (e.g., Unsplash) are resized to this size before rendering on the canvas. You can modify this value using the `maxImageSize` setting.  |
| **Output Resolution** | There is no enforced output resolution limit. Theoretically, the editor supports output sizes up to **16,384×16,384 pixels**. However, practical limits depend on the device's GPU capabilities and available memory. |

All image processing in CE.SDK is handled client-side, so these values depend on the **maximum texture size** supported by the user's hardware. The default limit of 4096×4096 is a safe baseline that works universally. Higher resolutions (e.g., 8192×8192) may work on certain devices but could fail on others during export if the GPU texture size is exceeded.

> **Note:** To ensure consistent results across devices, test higher output sizes on your
> target hardware and set conservative defaults in production.

### Video Resolution and Duration Limits

| Constraint     | Recommendation / Limit                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Resolution** | Up to **4K UHD** is supported for **playback** and **export**, depending on the user's hardware and available GPU resources. For **import**, CE.SDK does not impose artificial limits, but maximum video size is bounded by the **32-bit address space of WebAssembly (wasm32)** and the **browser tab's memory cap (~2 GB)**. |
| **Frame Rate** | 30 FPS at 1080p is broadly supported; 60 FPS and high-res exports benefit from hardware acceleration                                                                                                                                                                                                                           |
| **Duration**   | Stories and reels of up to **2 minutes** are fully supported. Longer videos are also supported, but we generally found a maximum duration of **10 minutes** to be a good balance for a smooth editing experience and a pleasant export duration of around one minute on modern hardware.                                       |

> **Note:** Performance scales with client hardware. For best results with high-resolution
> or high-frame-rate video, modern CPUs/GPUs with hardware acceleration are
> recommended.

## Format-Specific Considerations

### SVG Limitations

CE.SDK uses Skia for SVG parsing and rendering. While most SVG files render correctly, there are some important limitations to be aware of:

#### Text Elements

- SVG text elements are not supported – any text in SVG files will not be rendered.
- Convert text to paths in your vector editor before exporting if text is needed.

#### Styling Limitations

- CSS styles included in SVGs are not supported – use presentation attributes instead.
- RGBA color syntax is not supported – use `fill-opacity` and `stroke-opacity` attributes.
- When exporting SVGs from design tools, choose the "presentation attributes" option.

#### Unsupported SVG Elements

The following SVG elements are not supported:

- Animation elements (`<animate>`)
- Foreign object (`<foreignObject>`)
- Text-related elements (`<altGlyph>`, `<font>`, `<glyph>`)
- Script elements (`<script>`)
- Some filter elements (`<feComponentTransfer>`, `<feConvolveMatrix>`, `<feTile>`, `<feDropShadow>`)
- Inlined SVGs via `<image>` or `<feImage>` elements

> **Note:** When preparing SVG assets, always export with "presentation attributes" and
> convert text to paths for maximum compatibility with CE.SDK.

### WebP Support

WebP images are fully supported for import. CE.SDK handles both lossy and lossless WebP formats, including images with transparency (alpha channel). WebP provides excellent compression with high quality, making it ideal for web-based creative applications.

### Animated GIF Considerations

While CE.SDK can import animated GIF files, they are rendered as static images showing only the first frame. For animated content, consider using:

- **Lottie animations** (`.json`) for vector-based animations
- **Video files** (`.mp4`, `.webm`) for complex animated content

### Template Format Details

CE.SDK supports importing templates from popular design applications:

- **IDML** (InDesign Markup Language) – Import layouts and designs created in Adobe InDesign
- **PSD** (Photoshop Document) – Import layered Photoshop files with preserved layer structure
- **SCENE** – CE.SDK's native scene format, optimized for fast loading and editing

When importing IDML or PSD files, CE.SDK preserves layer hierarchy, text formatting, and design structure where possible. Some advanced effects or features specific to the source application may require manual adjustment after import.

## Font Format Support

CE.SDK supports modern web font formats for typography:

| Format   | Description                       |
| -------- | --------------------------------- |
| `.ttf`   | TrueType Font                     |
| `.otf`   | OpenType Font                     |
| `.woff`  | Web Open Font Format              |
| `.woff2` | Compressed Web Open Font Format 2 |

> **Warning:** Ensure fonts are appropriately licensed before embedding them in your
> application. Many commercial fonts have specific licensing requirements for
> web use and redistribution.

## Best Practices

### Format Selection

When building your application, consider these format recommendations:

- **Images**: Use `.webp` for the best compression-to-quality ratio on the web. Fall back to `.png` for transparency or `.jpeg` for photographs without transparency.
- **Video**: Prefer `.mp4` with H.264 encoding for maximum browser compatibility. Use `.webm` for modern browsers when you need open-source codecs.
- **Audio**: Use `.mp3` for universal compatibility or `.m4a` (AAC) for better quality at smaller file sizes.
- **Templates**: Use `.scene` format for CE.SDK-to-CE.SDK workflows, or import from `.psd`/`.idml` when migrating content from design tools.

### Validation and Error Handling

Always validate file formats before attempting import:

1. **Check MIME types** on file upload to quickly reject unsupported formats
2. **Validate file extensions** as a first line of defense
3. **Monitor file sizes** to prevent memory issues with extremely large files
4. **Provide clear error messages** to users when imports fail, explaining which formats are supported

### Memory Management

For web applications, be mindful of browser memory constraints:

- Large video files (>100 MB) may cause performance issues or browser tab crashes
- Multiple high-resolution images loaded simultaneously can exhaust GPU memory
- Consider implementing lazy loading for asset libraries with many files
- Provide progress indicators for large file imports to improve user experience



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [File Format Support](./file-format-support.md)

---

When building creative applications with CE.SDK, understanding which file formats your users can import is crucial for delivering a smooth editing experience. CE.SDK supports a comprehensive range of modern media formats.

This guide provides a complete reference of supported file formats for importing media, templates, and fonts into CE.SDK.

## Supported Import Formats

CE.SDK supports importing the following media types:

## Video and Audio Codecs

While container formats (`.mp4`, `.mov`) define how media is packaged, codecs determine how the content is compressed. CE.SDK supports the following codecs for playback and editing:

> **Warning:** H.265/HEVC playback depends on the device providing a hardware or system
> decoder. Availability varies across devices and operating system versions, so
> test H.265 content on your target hardware before relying on it.

## Size Limits and Constraints

CE.SDK processes media on-device, so performance is bounded by the hardware capabilities of the device running the editor. Keep these practical limits in mind:

### Image Resolution Limits

### Video Resolution and Duration Limits

## Format-Specific Considerations

### SVG Limitations

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

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
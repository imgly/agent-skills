> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Images](../edit-image.md) > [Overview](./overview.md)

---

Build image editing workflows on Android with CE.SDK's customizable editor UI
and the CreativeEngine API.

CE.SDK edits images on the device, so user content stays in your app while the
editor provides real-time previews and export-ready output. You can start with
the [Photo Editor Starter Kit](../starterkits/photo-editor.md), customize the CE.SDK
editor UI for your product, or drive the same image operations programmatically
with CreativeEngine.

[Get Started](../get-started/overview.md)

## Core Capabilities

CE.SDK combines interactive image editing tools with the same engine APIs that
power automated workflows. Typical Android image editing features include:

- **Transformations**: Crop, rotate, resize, scale, move, and flip image content.
- **Adjustments and effects**: Apply filters, blur, brightness, contrast, color,
  and style effects.
- **Background removal**: Add plugin-powered background removal to isolate
  subjects for compositing.
- **Layers and compositing**: Combine images with text, shapes, graphics,
  overlays, and masks.
- **Programmatic editing**: Create, update, and export scenes through
  CreativeEngine when edits should run without direct user input.

## Supported Input Formats

Android integrations can import common image formats from app storage, remote
URLs, asset sources, or user-selected content.

| Category   | Supported Formats                                        |
| ---------- | -------------------------------------------------------- |
| **Images** | `.png`, `.jpeg`, `.jpg`, `.gif`, `.webp`, `.svg`, `.bmp` |

For color-sensitive workflows, treat the file format and the color model as
separate concerns. CE.SDK supports design colors across screen and print
workflows, including sRGB, Display P3, CMYK, and spot colors. Imported raster
image profile handling depends on the source asset and Android's media
decoding path, so test profile-sensitive images on your target devices. See
[Colors](../colors/overview.md) for color-space behavior in CE.SDK.

## Output and Export Options

Export edited scenes using the public Android `MimeType` values exposed by
CE.SDK.

| Category       | Supported Formats                                  |
| -------------- | -------------------------------------------------- |
| **Images**     | `.png` (with transparency), `.jpeg`, `.tga`        |
| **Vector**     | `.svg` (scalable vector graphics with text paths)  |
| **Print**      | `.pdf` (supports underlayer printing and spot colors) |
| **Video**      | `.mp4` (for video scenes)                          |
| **Binary data** | `application/octet-stream` for binary export data |

Screen-oriented exports such as PNG, JPEG, TGA, SVG, and MP4 should be treated
as RGB output. For print workflows, PDF export supports spot colors, but CE.SDK
does not produce true CMYK PDF or PDF/X output. See
[Colors](../colors/overview.md) for the current color conversion and print-color
behavior.

You can choose export MIME type, target dimensions, compression quality, and
whether the result includes transparency. Practical export limits depend on the
device's GPU capabilities and available memory.

## UI-Based vs. Programmatic Editing

Use the CE.SDK editor UI when users should directly adjust images through
inspectors, canvas gestures, asset panels, and tool controls. The Android editor
is built with Jetpack Compose and can be themed, localized, and configured for
your product.

Use CreativeEngine when edits should be driven by app logic, templates, or
automation. Programmatic workflows can create image blocks, update block
properties, compose layers, and export the final scene without exposing every
operation in the UI.

Many apps combine both approaches: users edit visually, while app code applies
defaults, validates output, or performs batch operations in the background.

## Customizing the Image Editor

The Android editor surface can be adapted to match your app's workflow:

- **Tool availability**: Show, hide, or reorder editor controls for the tasks
  your users need.
- **UI appearance**: Apply your theme, icons, typography, and localization.
- **Asset and plugin setup**: Add app-specific asset sources, quick actions, or
  plugin features such as background removal.
- **Workflow integration**: Open existing app images, save edited output back to
  your storage layer, or continue with CreativeEngine after a user finishes.

## Performance Considerations

Image editing is client-side and performance depends on the Android device. For
large images, test target devices with representative files and set conservative
resolution defaults when needed.

Keep these limits in mind:

- Higher input or export resolutions require more GPU memory.
- Real-time previews are optimized for interactive editing, but complex scenes
  with many layers can still increase memory pressure.
- Exporting at very high dimensions may fail on devices with smaller maximum
  texture sizes.

## Working with Image Blocks

Images in CE.SDK are represented as blocks in a scene. A page can contain one
image or a layered composition with text, graphics, shapes, masks, and effects.
The editor UI exposes common controls for these blocks, while CreativeEngine
lets your app update the same scene data through code.

Use image blocks when you need direct control over the image content itself, and
combine them with other block types when your workflow needs overlays,
watermarks, annotations, or templates.

## Next Steps

- [Transform Images](./transform.md) - Crop, resize, rotate, scale, or flip image content.
- [Photo Editor Starter Kit](../starterkits/photo-editor.md) - Start from a complete Android photo editing UI.
- [Background Removal](./remove-bg.md) - Add subject extraction to the Android editor.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
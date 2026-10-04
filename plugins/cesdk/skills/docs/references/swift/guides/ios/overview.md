> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Editing Overview](./overview.md)

---

Use CreativeEditor SDK (CE.SDK) to build video editing experiences directly in your Apple app. CE.SDK supports both video and audio editing — including trimming, joining, adding text, annotating, and more — all performed on-device. Developers can integrate editing functionality using the CE.SDK editor UI or programmatically via the SDK API.

CE.SDK also supports music and sound effects alongside video editing.

[Explore Demos](https://img.ly/showcases/cesdk?tags=ios)

[Get Started](./get-started/overview.md)

## Core Capabilities

CreativeEditor SDK includes a comprehensive set of video editing tools, accessible through both a UI and a programmatic interface. Supported editing actions include:

- **Trim, Split, Join, and Arrange**: Modify clips, reorder segments, and stitch together content.
- **Transform**: Crop, rotate, resize, scale, and flip.
- **Audio Editing**: Add, adjust, and synchronize audio including music, voiceovers, and effects.
- **Programmatic Editing**: Control all editing features via API.

CE.SDK is well-suited for scenarios like short-form content, reels, promotional videos, and other linear video workflows.

## Timeline Editor

The [Timeline Editor](./create-video/timeline-editor.md) provides a familiar video editing experience for users. It supports:

- Layered tracks for video and audio
- Drag-and-drop sequencing with snapping
- Trim handles, in/out points, and time offsets
- Real-time preview updates

## Supported Input Formats and Codecs

CE.SDK supports a wide range of video input formats and encodings, including:

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

CE.SDK supports the most widely adopted video and audio codecs to ensure compatibility across platforms:

### **Video Codecs**

- **H.264 / AVC** (in `.mp4`)
- **H.265 / HEVC** (in `.mp4`, may require platform-specific support)

### **Audio Codecs**

- **MP3** (in `.mp3` or within `.mp4`)
- **AAC** (in `.m4a` or within `.mp4` or `.mov`)

These codecs apply to importing media. For export, CE.SDK produces MP4 with H.264 (H.265 only on supported browser and mobile platforms); the native Node.js package (`@cesdk/node-native`) exports H.264 video with AAC audio.

## Output and Export Options

You can export edited videos in several formats, with control over resolution, encoding, and file size:

| Category    | Supported Formats                                                                    |
| ----------- | ------------------------------------------------------------------------------------ |
| **Images**  | `.png` (with transparency), `.jpeg`, `.webp`, `.tga`                                 |
| **Vector**  | `.svg` (scalable vector graphics with text as paths)                                 |
| **Print**   | `.pdf` (supports underlayer printing and spot colors)                                |
| **Video**   | `.mp4` (H.264 or H.265 on supported platforms with limited transparency support)     |
| **Scene**   | `.imgly` or `.scene` (description of the scene without any assets) |
| **Archive** | `.imgly` or `.zip` (fully self-contained archive that bundles the scene file with all assets) |

> **Note:** Our custom cross-platform C++ based rendering and layout engine ensures
> consistent output quality across devices.

## UI-Based vs. Programmatic Editing

CE.SDK offers a fully interactive editor with intuitive UI tools for creators. At the same time, developers can build workflows entirely programmatically using the SDK API.

- Use the UI to let users trim, arrange, and caption videos manually
- Use the API to automate the assembly or editing of videos at scale

## Customization

You can tailor the editor to match your product's design and user needs:

- Show or hide tools
- Reorder UI elements and dock items
- Apply custom themes, colors, or typography
- Add additional plugin components

## Performance and File Size Considerations

All editing operations are performed on-device. While this keeps user content private and the editor responsive, it introduces some limits:

| Constraint     | Recommendation / Limit                                                                                                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resolution** | Up to **4K UHD** is supported for **playback** and **export** on capable devices, bounded by GPU texture size and available memory. For **import**, CE.SDK does not impose artificial limits, but maximum video size is bounded by available device memory and the native media framework's decoder capabilities. The maximum export dimension varies by device and can be queried via `engine.editor.getMaxExportSize()`. |
| **Frame Rate** | 30 FPS at 1080p is broadly supported; 60 FPS and high-resolution exports benefit from hardware acceleration via the device's native media frameworks.                                                                                                                                            |
| **Duration**   | Stories and reels of up to **2 minutes** are fully supported. Longer videos are also supported, but we generally found a maximum duration of **10 minutes** to be a good balance for a smooth editing experience and a pleasant export duration of around one minute on modern hardware.        |

> **Note:** Performance scales with device hardware. For best results with high-resolution
> or high-frame-rate video, modern devices with hardware video acceleration are
> recommended.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
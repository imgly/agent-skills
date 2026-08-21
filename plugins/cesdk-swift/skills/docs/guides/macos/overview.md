> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

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

CE.SDK supports the most widely adopted video and audio codecs to ensure compatibility across platforms:

## Output and Export Options

You can export edited videos in several formats, with control over resolution, encoding, and file size:

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



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
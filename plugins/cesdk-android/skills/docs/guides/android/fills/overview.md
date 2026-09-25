> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Fills](../fills.md) > [Overview](./overview.md)

---

Use fills to paint supported design blocks with color, gradient, image, video,
or live pixel content.

Fills define the visual content inside the shape of a supported [design block](../concepts/blocks.md). They are separate fill blocks attached to an owner block, so the owner controls geometry, layout, selection, and transforms while the fill controls the pixels drawn inside that shape.

The CE.SDK editor UI exposes fill controls for selected blocks when the block and the active editor configuration allow it. The CreativeEngine APIs expose the same model programmatically, including checking whether a block supports fills, reading the assigned fill, replacing it, disabling it, or configuring type-specific properties.

## Fill Types

Choose the fill type that matches the content you want the block to render:

| Fill type | Use it for |
| --- | --- |
| Color | Solid brand colors, simple backgrounds, masks, or placeholder states. |
| Linear gradient | Directional transitions between colors, such as top-to-bottom or left-to-right shading. |
| Radial gradient | Circular or elliptical color transitions, such as highlights and glow effects. |
| Conical gradient | Angular color transitions around a center point, such as color wheels or sweep effects. |
| Image | Photos, textures, rendered thumbnails, and other still media. |
| Video | Moving media inside a design block, including trimmed or looping clips. |
| Pixel stream | Dynamic pixel content supplied by an integration at runtime. |

Color and gradient fills are usually best for graphic shapes, backgrounds, and design accents. Image, video, and pixel stream fills are media fills: they depend on a source and often need content fitting decisions so the media appears correctly inside the block frame.

## Fill Support

Not every design block can have a fill. Shapes, pages, text blocks, and many visual blocks support fills, while scene/root blocks do not. Text blocks support solid color fills only; graphic, page, and media-capable blocks can support broader fill types depending on their block capabilities. Check fill support before applying fill operations to arbitrary blocks.

A block can also have its fill disabled while retaining other styling, such as a stroke. This is useful when a shape should act as an outline, frame, or interaction target without painting its interior.

## Fill Properties

Each fill type has its own properties. A solid color fill stores a color value, gradient fills store color stops and geometry, image fills store image sources, and video fills store video sources plus playback-related data.

These properties usually fall into a few categories:

- Color values define the visible color of solid fills.
- Gradient geometry and color stops define the direction, shape, and transitions of gradient fills.
- Image sources, previews, placeholders, and source sets define how still media loads and adapts.
- Video sources, playback values, trimming, looping, and related media state define how moving media behaves inside a block.

## Content Fill Modes

Media fills need a rule for fitting source content into the block frame. CE.SDK supports three content fill modes:

| Mode | Behavior |
| --- | --- |
| Crop | Uses explicit manual crop framing for the visible media region. |
| Cover | Scales media to cover the whole block frame and may crop edges. |
| Contain | Scales media so the whole source remains visible and may leave empty space. |

Cover is a good default for image-heavy layouts where the frame should always be filled. Contain is better when preserving the complete source matters more than filling every pixel. Crop is best when users or templates already define the exact visible region.

## Ownership and Reuse

A fill attached to one block is part of that block's visual appearance. Duplicating the owner block duplicates an owned fill, so changes to the duplicate can be made independently.

The same fill can also be shared by multiple blocks. Shared fills are useful when several elements must stay visually synchronized, but any change to the shared fill affects every block using it. Use shared fills intentionally, especially when user edits should apply to only one selected block.

## Editor and Engine Workflows

Use the editor UI when users should choose or adjust fills interactively. Use CreativeEngine APIs when your app needs to apply templates, enforce brand defaults, generate scenes, migrate existing content, or update fills from app state.

For a complete Android editing surface, see the [Design Editor Starter Kit](../starterkits/design-editor.md). The same fill model applies whether users adjust fills in the editor UI or your app updates them through CreativeEngine APIs.

## Next Steps

- [Color Fills](./color.md) — Work with solid color fills and their properties
- [Gradient Fills](./gradient.md) — Apply linear, radial, and conical gradient fills
- [Image Fills](./image.md) — Use images as fills for design blocks
- [Video Fills](./video.md) — Use videos as fills for design blocks



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Fills](../fills.md) > [Overview](./overview.md)

---

Fills define the visual content rendered inside the shape of a supported [design block](../concepts/blocks.md). They are separate fill objects attached to an owner block, so the owner controls geometry, layout, selection, and transforms while the fill controls the pixels drawn inside that shape. CE.SDK exposes fills through both the editor UI and the engine API, so you can manage them interactively or programmatically — and the same fill can be queried, modified, shared across blocks, or replaced at any time.

[Explore Demos](https://img.ly/showcases/cesdk?tags=ios)

[Get Started](../get-started/overview.md)

## Fill Types

Choose the fill type that matches the content the block should render:

| Fill type        | Use it for                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Color            | Solid brand colors, simple backgrounds, masks, or placeholders.                             |
| Linear gradient  | Directional transitions between colors, such as top-to-bottom or left-to-right shading.     |
| Radial gradient  | Circular or elliptical color transitions, such as highlights and glow effects.              |
| Conical gradient | Angular color transitions around a center point, such as color wheels or sweep effects.     |
| Image            | Photos, textures, rendered thumbnails, and other still media.                               |
| Video            | Moving media inside a design block, including trimmed or looping clips.                     |
| Pixel stream     | Dynamic pixel content supplied by an integration at runtime, such as camera feeds.          |

Color and gradient fills are usually best for graphic shapes, backgrounds, and design accents. Image, video, and pixel stream fills are media fills: they depend on a source and often need content fitting decisions so the media appears correctly inside the block frame.

## Fill Support

Not every design block can have a fill. Shapes, pages, text blocks, and many visual blocks support fills, while scene and root blocks do not. Text blocks support solid color fills only — the text color is the fill. Graphic, page, and media-capable blocks accept the broader set of fill types depending on their block capabilities. Before applying any fill operation to an arbitrary block, check fill support.

A block can also have its fill disabled while retaining other styling, such as a stroke. This is useful when a shape should act as an outline, frame, or interaction target without painting its interior.

## Fill Properties

Each fill type has its own properties, and they usually fall into a few categories:

- Color values define the visible color of solid fills.
- Gradient geometry and color stops define the direction, shape, and transitions of gradient fills.
- Image sources, previews, placeholders, and source sets define how still media loads and adapts.
- Video sources, playback values, trimming, looping, and related media behavior define how moving media behaves inside a block.

Use the fill APIs to query and modify these properties the same way you do on any other design block.

## Content Fill Modes

Media fills need a rule for fitting source content into the block frame. CE.SDK supports three content fill modes:

| Mode    | Behavior                                                                                       |
| ------- | ---------------------------------------------------------------------------------------------- |
| Crop    | Uses explicit manual crop framing for the visible media region.                                |
| Cover   | Scales media to cover the whole block frame and may crop edges.                                |
| Contain | Scales media so the whole source remains visible and may leave empty space.                    |

Cover is a good default for image-heavy layouts where the frame should always be filled. Contain is better when preserving the complete source matters more than filling every pixel. Crop is best when users or templates already define the exact visible region. Cover and Contain also support horizontal and vertical alignment, so you can pull the visible region toward an edge or center.

## Ownership and Reuse

A fill attached to a single block is part of that block's visual appearance — destroying the block destroys the fill with it. Duplicating the owner block duplicates an owned fill too, so changes to the duplicate can be made independently.

The same fill can also be shared by multiple blocks. Shared fills are useful when several elements must stay visually synchronized, but any change to a shared fill affects every block using it. Destroying a block with a shared fill does not destroy the fill until no other blocks reference it. Use shared fills intentionally, especially when user edits should apply only to one selected block.

## Editor and Engine Workflows

If on iOS, use the editor UI when users should choose or adjust fills interactively. End users pick fill types and adjust properties through the inspector — color pickers for solid colors, gradient editors for gradients, image and video pickers backed by your asset sources.

Otherwise, use the CreativeEngine API to apply templates, enforce brand defaults, generate scenes programmatically, migrate existing content, or update fills from app state. The same fill model applies whether users adjust fills in the editor UI or your app updates them through the engine.

## Next Steps

- [Color Fills](./color.md) — Work with solid color fills and their properties
- [Gradient Fills](./gradient.md) — Apply linear, radial, and conical gradient fills
- [Image Fills](./image.md) — Use images as fills for design blocks
- [Video Fills](./video.md) — Use videos as fills for design blocks
- [Blocks](../concepts/blocks.md) — Learn how blocks define elements in a scene



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
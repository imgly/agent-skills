> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Outlines](../outlines.md) > [Overview](./overview.md)

---

In CreativeEditor SDK (CE.SDK), *outlines* refer to visual enhancements added around design elements. They include strokes, shadows, and glows, each serving to emphasize, separate, or stylize content. Outlines help improve visibility, create visual contrast, and enhance the overall aesthetic of a design.

You can add, edit, and remove outlines both through the CE.SDK user interface and programmatically via the API.

[Explore Demos](https://img.ly/showcases/cesdk?tags=ios)

[Get Started](../get-started/overview.md)

## Understanding Outlines

- **Stroke (Outline):** A solid line that directly traces the border of an element. Strokes can vary in thickness, color, and style (such as dashed or dotted lines).
- **Shadow:** A duplicate of the element rendered with an offset and blur effect, creating the illusion of depth.
- **Glow:** A soft, diffused light that radiates outward from the element, typically used to create a luminous or halo effect.

> **Note:** Glow effects are configured through the effects system. For simple halo
> styling, a brightly colored shadow can also create a glow-like result.

Each type of outline offers different visual styles and purposes, allowing you to tailor your design's look and feel.

## Supported Elements

You can apply outlines to a wide range of elements in CE.SDK, including:

- Text elements
- Shapes
- Images
- Stickers

Some asset types or highly customized components may have limitations on which outline effects they support. Always check element capabilities if outline options appear unavailable.

## UI Editing

The native editor exposes outline controls in feature-specific sheets:

- **Strokes** are available from the Fill & Stroke sheet for supported elements.
- **Glows** are available from the Effects sheet when that option is included in the editor configuration.
- **Drop shadows** do not have built-in native editor controls. Configure them with the Engine API instead.

Use the dedicated [Strokes](./strokes.md) and [Shadows and Glows](./shadows-and-glows.md) guides for the available controls and programmatic properties.

## Programmatic Editing

Developers can also manage outlines programmatically using the CE.SDK API. This includes:

- **Accessing and modifying properties** such as stroke color, stroke width, shadow blur, and shadow offset.
- **Enabling or disabling outlines** for individual design blocks.
- **Removing outlines** programmatically by disabling stroke or shadow effects on a block.

Programmatic control enables dynamic styling and automation for design generation workflows.

## Customizing Outline Properties

Outlines in CE.SDK offer a variety of customizable properties to fit different design needs:

- **Color:** Define stroke or shadow color to match branding or design themes.
- **Thickness (Stroke Width):** Adjust how bold or subtle the stroke appears around the element.
- **Opacity:** Control the transparency of strokes, shadows, or glows for subtle or strong effects.
- **Blur (for Shadows and Glows):** Soften the appearance of shadows or glows by adjusting their blur radius.
- **Offset (for Shadows):** Set how far a shadow is displaced from the element to control the sense of depth.

## Next Steps

This page introduces outlines at a conceptual level. To apply each effect in code, follow the dedicated guides:

- [Using Strokes](./strokes.md) — Add and customize solid outlines around shapes, text, and images with the stroke API.
- [Shadows and Glows](./shadows-and-glows.md) — Apply drop shadows and glow effects to add depth and emphasis.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Overview](./overview.md)

---

In CreativeEditor SDK (CE.SDK), a *composition* is an arrangement of multiple design elements—such as images, text, shapes, graphics, and effects—combined into a single, cohesive visual layout. Unlike working with isolated elements, compositions allow you to design complex, multi-element visuals that tell a richer story or support more advanced use cases.

All composition processing is handled entirely on the client side, ensuring fast, secure, and efficient editing without requiring server infrastructure.

You can use compositions to create a wide variety of projects, including social media posts, marketing materials, collages, and multi-page exports like PDFs. Whether you are building layouts manually through the UI or generating them dynamically with code, compositions give you the flexibility and control to design at scale.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](../get-started/overview.md)

## Working with Multiple Pages and Artboards

CE.SDK supports working with multiple artboards or canvases within a single document, enabling you to design multi-page layouts or create several design variations within the same project.

Typical multi-page use cases include:

- Designing multi-page marketing brochures.
- Exporting designs as multi-page PDFs.
- Building multiple versions of a design for different audiences or platforms.

## Working with Elements

You can easily arrange and manage elements within a composition:

- **Positioning and Aligning:** Move elements precisely and align them to each other or to the canvas.
- **Guides and Snapping:** Use visual guides and automatic snapping to align objects accurately.
- **Grouping:** Group elements for easier collective movement and editing.
- **Layer Management:** Control the stacking order and organize elements in layers.
- **Locking:** Lock elements to prevent accidental changes during editing.

## UI vs. Programmatic Creation

### Using the UI

The CE.SDK UI provides drag-and-drop editing, alignment tools, a layer panel, and snapping guides, making it easy to visually build complex compositions. You can group, align, lock, and arrange elements directly through intuitive controls.

### Programmatic Creation

You can also build compositions programmatically by using CE.SDK’s APIs. This is especially useful for:

- Automatically generating large volumes of designs.
- Creating data-driven layouts.
- Integrating CE.SDK into a larger automated workflow.

## Exporting Compositions

CE.SDK compositions can be exported in several formats:

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



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
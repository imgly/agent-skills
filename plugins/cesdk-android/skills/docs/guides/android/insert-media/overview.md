> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Overview](./overview.md)

---

See how inserted media becomes part of a CE.SDK scene on Android: which block
types represent each media type, how the editor UI and Engine API place them,
and how saved scenes keep references or embedded bytes.

Inserting media turns an asset, such as an image, video clip, audio file, shape, or sticker, into a design block in the scene graph. Each block has an ID and belongs to a page or timeline. Visual blocks carry layout and styling properties, while time-based blocks carry timing and playback properties. Both participate in save, reload, and export.

Use this overview to build a mental model before moving to the focused Android guides. The Android editor UI gives users a visual insertion surface, while the Engine API lets your app prepare or modify scenes programmatically.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android)

[Get Started](../get-started/overview.md)

## Inserting Media vs. Importing Assets

*Importing* registers media with an asset source so it can be searched, browsed, or selected later. Importing alone does not place anything on the canvas.

*Inserting* places media into the current scene as a design block. Images, videos, shapes, and stickers usually become `DesignBlockType.Graphic` blocks. Audio becomes a `DesignBlockType.Audio` block that participates in the timeline without a visual layer.

The two steps are independent. You can insert media directly from a URI without first showing it in the asset library, and you can import assets for users to browse without inserting them immediately.

## How Media Is Handled in Scenes

Inserted media lives in the scene graph. The representation depends on the media type:

| Media Type | Android Scene Representation | Notes |
| --- | --- | --- |
| Images | A `DesignBlockType.Graphic` block with a `FillType.Image` fill | The graphic block controls position, size, rotation, opacity, and stacking. The fill references the image URI. |
| Videos | A `DesignBlockType.Graphic` block with a `FillType.Video` fill | The block behaves like visual content on the page or timeline. The fill references the video URI. |
| Audio | A `DesignBlockType.Audio` block | Audio has no canvas shape, but it can be arranged on the page timeline and configured with timing and playback properties. |
| Shapes | A `DesignBlockType.Graphic` block with a `ShapeType` shape | The shape defines the outline, while the graphic block controls layout and styling. |
| Stickers | A `DesignBlockType.Graphic` block, usually with a rect shape and image fill | Stickers often come from an asset source, then behave like other graphic blocks for positioning and ordering. |

Each inserted item receives a block ID. Store that ID when your app needs to update, query, duplicate, reorder, or remove the inserted content later.

## Inserting Media

### Insert via the UI

The Android editor UI inserts media through asset-library sheets and editor actions. Users select an asset or add action, and the editor creates the right scene block, applies default sizing, and selects the inserted content for further editing.

Configure available categories and sources through your editor configuration and asset-library setup. See [Customize Asset Library](../import-media/asset-library/customize.md) for details on controlling which media users can browse and insert.

For a complete Android editing surface, start from the relevant Starter Kit, such as the [Design Editor Starter Kit](../starterkits/design-editor.md) or [Video Editor Starter Kit](../starterkits/video-editor.md). This overview focuses on how inserted content is represented once it is in the scene.

### Insert Programmatically

Use the Engine API when your app needs reproducible output, template population, or insertion before the editor opens. Programmatic insertion follows the same high-level sequence for most media:

1. Create the appropriate graphic or audio block.
2. Add the media fill, shape, or source URI that defines its content.
3. Attach the block to a page or timeline and configure its layout, timing, and styling.

The focused guides in Next Steps show the exact Android APIs for each media type.

## Referencing Existing Assets

Inserted blocks normally point to media by URI. The same URI can back multiple blocks, for example when you place the same logo on several pages. Each inserted block remains independent and keeps its own position, size, rotation, opacity, timing, and effects.

When an asset is already available through the asset library, reuse the selected asset result or URI instead of registering duplicate asset entries. Importing controls what users can browse; insertion controls what becomes part of the scene.

## Media Lifecycle Within a Scene

Inserted media participates in the regular scene lifecycle:

- **Save.** Scene data stores referenced resource URIs. A scene archive includes the accessible media bytes alongside the scene.
- **Reload.** Scene data resolves its referenced URIs again. An archive resolves media from its bundled contents.
- **Export.** CE.SDK resolves each block's current media and properties when it renders image, PDF, or video output.

If a referenced URL or local file no longer resolves, the affected block cannot display or export that media until your app restores the reference or inserts a replacement. Archives reduce that risk by carrying the media bytes with the scene.

## Embedding vs. Linking Media

CE.SDK supports two strategies for saved scene media:

| Mode | Description | Use Case |
| --- | --- | --- |
| **Referenced** scene data | The scene stores resource URIs. Media stays where it is hosted or stored. | Smaller saved scenes, shared assets, server-hosted media. |
| **Embedded** archives | The archive bundles the scene and accessible media bytes. | Offline editing, portable handoff, scenes that need to reopen without original URLs. |

Choose referenced scene data when your app controls stable media hosting. Choose archives when the scene must travel between devices, users, or storage systems without depending on the original media locations.

## Next Steps

- [Insert Images](./images.md) — Add image fills to graphic blocks or insert independent image blocks.
- [Insert Videos](./videos.md) — Add and trim a video block in a scene.
- [Insert Audio](./audio.md) — Add audio files to your video projects programmatically, configure timeline position, volume, and playback properties.
- [Insert Shapes or Stickers](./shapes-or-stickers.md) — Add vector shapes and sticker assets to a CE.SDK scene.
- [Import Media Overview](../import-media/overview.md) — Bring local, remote, or device-sourced assets into CE.SDK so they are available to insert.
- [Customize Asset Library](../import-media/asset-library/customize.md) — Tailor the categories, sources, and ordering that show up in the asset panel.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
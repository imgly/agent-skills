> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Overview](./overview.md)

---

See how inserted media becomes part of a CE.SDK scene — what kinds of blocks
back each media type, how the editor UI and the Engine API place them, and
how saved scenes carry references versus embedded bytes.

Inserting media turns an asset — a photo, a video clip, an audio file, a shape, a sticker — into a design block that lives in the scene graph. Once inserted, the asset behaves like any other block in the scene: it has a `DesignBlockID`, occupies a position on a page or timeline, carries its own size, rotation, opacity, and styling, and participates in save, reload, and export.

Use this overview to build a mental model of how insertion fits into CE.SDK scenes before reaching for the focused sub-guides. The Engine API works the same way across iOS, macOS, and Mac Catalyst. On iOS, the editor UI gives users a visual surface for the same insertion flows.

## Inserting Media vs. Importing Assets

*Importing* an asset registers it with the asset library so it can be looked up or browsed later. Use `engine.asset.addLocalSource(sourceID:...)` to register a custom asset source, or `engine.asset.addLocalAssetSourceFromJSON(_:)` to register an entire JSON manifest of assets. Importing alone does not place anything on the canvas.

*Inserting* places media into the scene as a design block. Image and video assets typically become the fill of a `.graphic` block — create the block with `engine.block.create(.graphic)`, build the fill with `engine.block.createFill(.image)` (or `.video`), and attach it with `engine.block.setFill(_:fill:)`. Audio files become standalone `.audio` blocks. Shapes and stickers become `.graphic` blocks with a custom shape and a solid or vector fill.

The two steps are independent. You can insert media without importing it first (point a fill directly at a URL or a file on disk), and you can import assets without ever inserting any of them (populate an asset panel that the user picks from later).

## How Media Is Handled in Scenes

Inserted media lives inside the scene graph as design blocks. The shape depends on the media type:

- **Images and videos** are stored as the *fill* of a `.graphic` block. The block defines the position, size, rotation, and opacity; the fill carries the source URI and, for video, the playback offsets. Set the URI with `engine.block.setString(_:property:value:)` using the property keys `fill/image/imageFileURI` or `fill/video/fileURI`.
- **Audio** is a `.audio` block appended directly to a page. It has no visual representation but participates in the page timeline through its time offset, duration, volume, and looping flag.
- **Shapes** are `.graphic` blocks paired with a shape child block — `rect`, `ellipse`, `star`, `polygon`, `line`, or `vector_path` — created via `engine.block.createShape(_:)` and attached with `engine.block.setShape(_:shape:)`. The block carries a color, gradient, or image fill that the shape outlines.
- **Stickers** are `.graphic` blocks with a rect shape and an image fill pointed at a sticker asset, typically a transparent PNG or SVG. They behave like image blocks for positioning, ordering, and styling.

Every inserted block exposes a `DesignBlockID` that you can store, query, and pass back into the Engine to read or modify its properties.

## Inserting Media

### Insert via the UI

On iOS, the editor UI exposes asset-library panels, drag-and-drop targets, and quick-add buttons that let users place media without writing code. Configure the available categories and sources through your editor configuration, and open an asset sheet from a dock or inspector item by sending an `EditorEvent.openSheet(...)`. The user's selection drives the insertion: the editor creates the block, sets reasonable defaults, and selects it for further editing.

On native macOS, the editor UI does not ship — drive insertion programmatically from the Engine API and surface it through your own AppKit or SwiftUI views.

To control which categories and sources users see in the iOS asset panel, see [Customize Asset Library for iOS](../import-media/asset-library/customize.md).

### Insert Programmatically

The Engine API inserts media without involving the UI. The pattern is the same for every media-backed block:

1. Create the block with `engine.block.create(_:)` — `.graphic` for images, videos, shapes, and stickers; `.audio` for audio.
2. For media-backed blocks, create a fill with `engine.block.createFill(_:)` and attach it with `engine.block.setFill(_:fill:)`.
3. Point the fill at a source file with `engine.block.setString(_:property:value:)` and the relevant property key (`fill/image/imageFileURI`, `fill/video/fileURI`).
4. Append the block to a parent — a page, a track, or another container — with `engine.block.appendChild(to:child:)`.
5. Configure layout and styling with the position, size, rotation, opacity, and z-order setters.

Reach for the Engine API when you need reproducible output: a template applied to user data, a scene prepared before the editor opens, or a batch operation across many scenes.

## Referencing Existing Assets

Inserted blocks point at media via URIs rather than embedding the bytes inline. The same URI can back any number of blocks — for example, place the same logo on every page of a brochure — and each instance keeps its own position, size, rotation, and opacity.

When the same asset already lives in the asset library, look it up and reuse its URI rather than re-importing. The library entry stays a single record; each insertion is a separate block that references it.

## Media Lifecycle Within a Scene

Once inserted, media participates in the regular scene lifecycle:

- **Save.** `engine.scene.saveToString()` returns a scene definition that records each block's properties and the URIs it references. `engine.scene.saveToArchive()` returns a `Blob` that bundles the scene definition together with the actual media bytes.
- **Reload.** `engine.scene.load(from:)` rebuilds the scene from a scene string and re-resolves any URIs the blocks point at. `engine.scene.load(from:)` unpacks an archive and rewires its internal references so the bundled media loads from the archive contents rather than the original URLs.
- **Export.** `engine.block.export(_:mimeType:options:)` returns the rendered page as an image or PDF `Blob`. `engine.block.exportVideo(_:mimeType:options:)` returns an `AsyncThrowingStream<VideoExport, Error>` — iterate it to receive progress updates and the encoded video bytes when the stream finishes. The exporter resolves each block's fill at render time, so the output reflects each block's current properties at export.

If a referenced URL stops resolving — the asset moves, the host disappears, the local file gets deleted — the affected block can't display the missing content until the URL is repaired or the media is re-inserted. Archives sidestep this by carrying the bytes inline.

## Embedding vs. Linking Media

CE.SDK supports two strategies for how inserted media ends up in saved or exported output:

| Mode                       | Description                                                              | Use Case                                                      |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Linked** (scene strings) | The output stores the asset's URI. The original file stays where it is. | Smaller files, shared assets, scenes that reuse hosted media. |
| **Embedded** (archives)    | The output bundles the asset bytes alongside the scene definition.       | Offline editing, portable scenes, hand-off workflows.         |

`saveToString()` and `load(from:)` operate on the linked shape. `saveToArchive()` and `loadArchive(from:)` operate on the embedded shape. Pick the one that matches how the scene will be transported and reopened.

## Next Steps

- [Insert Images](./images.md) — Add image fills to graphic blocks or insert independent image blocks.
- [Insert Videos](./videos.md) — Add and trim a video block in a scene.
- [Insert Audio](./audio.md) — Add audio blocks for background music, voiceovers, and sound effects on the timeline.
- [Insert Shapes or Stickers](./shapes-or-stickers.md) — Add shapes and stickers as independent graphic blocks.
- [Import Media Overview](../import-media/overview.md) — Bring local, remote, or device-sourced assets into CE.SDK so they're available to insert.
- [Customize Asset Library for iOS](../import-media/asset-library/customize.md) — Tailor the categories, sources, and ordering that show up in the iOS asset panel.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
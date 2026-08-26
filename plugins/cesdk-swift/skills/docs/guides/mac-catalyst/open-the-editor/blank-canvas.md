> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Start With Blank Canvas](./blank-canvas.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-scene-from-scratch/CreateSceneFromScratch.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createSceneFromScratch(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let pageFill = try engine.block.createFill(.color)
  try engine.block.setColor(pageFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.95, b: 0.96, a: 1))
  try engine.block.setFill(page, fill: pageFill)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.star))
  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.27, g: 0.52, b: 0.96, a: 1))
  try engine.block.setFill(block, fill: fill)
  try engine.block.setWidth(block, value: 300)
  try engine.block.setHeight(block, value: 300)
  try engine.block.setPositionX(block, value: 250)
  try engine.block.setPositionY(block, value: 150)
  try engine.block.appendChild(to: page, child: block)

  try engine.scene.enableZoomAutoFit(
    page,
    axis: .both,
    paddingLeft: 40,
    paddingTop: 40,
    paddingRight: 40,
    paddingBottom: 40,
  )
}
```

Create a new scene from scratch to build designs with complete control over canvas dimensions and initial content.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-create-scene-from-scratch)

<EngineReferenceNote {...props} />

Starting from a blank canvas lets you build new designs without pre-existing content. `engine.scene.create()` creates an empty scene with its own camera, ready for pages and blocks. This differs from loading a template or an image, which start with existing content. See [Blocks](../concepts/blocks.md) for more on scene hierarchy.

> **Other Ways to Create Scenes:** You can also start with existing content:* [Create From Image](./from-image.md) — Start with an image as the base
> * [Load a Scene](./load-scene.md) — Resume editing a previously saved design

## Create an Empty Scene

Call `engine.scene.create(sceneLayout:)` to create a new design scene with a camera attached. The scene itself has no dimensions — you set the canvas size on each page, shown next.

```swift highlight-createSceneFromScratch-create
let scene = try engine.scene.create()
```

The `sceneLayout` parameter controls how pages are arranged: `.free` for independent positioning, `.verticalStack` or `.horizontalStack` for aligned layouts, and `.depthStack` for layered compositions. It defaults to `.free`.

## Configure Page Size

Create a page with `engine.block.create(.page)`, set its dimensions with `setWidth(_:value:)` and `setHeight(_:value:)` in design units, then parent it to the scene with `appendChild(to:child:)`.

```swift highlight-createSceneFromScratch-add-page
let page = try engine.block.create(.page)
try engine.block.setWidth(page, value: 800)
try engine.block.setHeight(page, value: 600)
try engine.block.appendChild(to: scene, child: page)
```

Width and height are separate values rather than a single size object. Repeat these calls to add as many pages as your design needs.

## Set a Background Color

Give the page a solid background by assigning it a color fill. Create a `.color` fill, set its `"fill/color/value"` property, then assign it to the page with `setFill(_:fill:)`.

```swift highlight-createSceneFromScratch-background
let pageFill = try engine.block.createFill(.color)
try engine.block.setColor(pageFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.95, b: 0.96, a: 1))
try engine.block.setFill(page, fill: pageFill)
```

Colors use components from `0` to `1`. The same `Color` value also accepts `.cmyk(...)` for print workflows and `.spot(...)` for named brand colors.

## Add Your First Block

Create a graphic block, assign it a shape and a fill so it has a visual representation, size and position it, then append it to the page. A graphic block needs both a shape and a fill to render.

```swift highlight-createSceneFromScratch-add-block
let block = try engine.block.create(.graphic)
try engine.block.setShape(block, shape: engine.block.createShape(.star))
let fill = try engine.block.createFill(.color)
try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.27, g: 0.52, b: 0.96, a: 1))
try engine.block.setFill(block, fill: fill)
try engine.block.setWidth(block, value: 300)
try engine.block.setHeight(block, value: 300)
try engine.block.setPositionX(block, value: 250)
try engine.block.setPositionY(block, value: 150)
try engine.block.appendChild(to: page, child: block)
```

`createShape(_:)` accepts shapes such as `.star`, `.rect`, and `.ellipse`; `createFill(_:)` accepts fills such as `.color`, `.image`, and the gradient types.

## Enable Auto-Fit Zoom

For interactive editing, enable auto-fit zoom so the page stays framed when the viewport resizes.

```swift highlight-createSceneFromScratch-zoom
try engine.scene.enableZoomAutoFit(
  page,
  axis: .both,
  paddingLeft: 40,
  paddingTop: 40,
  paddingRight: 40,
  paddingBottom: 40,
)
```

`enableZoomAutoFit(_:axis:)` continuously adjusts the zoom level to fit a block. Use `.horizontal` to fit the width, `.vertical` to fit the height, or `.both` to fit both; the padding parameters add space around the content. Only one block per scene can use auto-fit at a time, and it has no effect while the editor UI controls the zoom level. For a one-time adjustment, use `zoom(to:)`, and call `disableZoomAutoFit(_:)` to stop the continuous fit.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create(sceneLayout:)` | Create a new empty scene with a camera |
| `engine.block.create(_:)` | Create a block such as `.page` or `.graphic` |
| `engine.block.setWidth(_:value:)` / `setHeight(_:value:)` | Set a block's dimensions in design units |
| `engine.block.setPositionX(_:value:)` / `setPositionY(_:value:)` | Position a block on its parent |
| `engine.block.appendChild(to:child:)` | Add a block as a child of another |
| `engine.block.createShape(_:)` / `setShape(_:shape:)` | Create and assign a shape |
| `engine.block.createFill(_:)` / `setFill(_:fill:)` | Create and assign a fill |
| `engine.block.setColor(_:property:color:)` | Set a color property such as `"fill/color/value"` |
| `engine.scene.enableZoomAutoFit(_:axis:)` | Continuously fit a block in the viewport |
| `engine.scene.zoom(to:)` | Frame a block once |
| `engine.scene.disableZoomAutoFit(_:)` | Stop auto-fit zoom |

## Next Steps

- [Save](../export-save-publish/save.md) — Persist your design to a file or backend service
- [Blocks](../concepts/blocks.md) — Learn about scene hierarchy and block relationships
- [Create From Image](./from-image.md) — Start with an existing image instead of a blank canvas



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
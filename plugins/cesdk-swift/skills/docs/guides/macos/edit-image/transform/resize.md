> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Resize](./resize.md)

---

```swift file=@cesdk_swift_examples/engine-guides-edit-image-transform-resize/ResizeImages.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func resizeImages(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let baseURL = try engine.guidesBaseURL

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let imageBlock = try createImageBlock(engine: engine, page: page, baseURL: baseURL)

  try engine.editor.setResizeHandlesVisibility(.always)
  let resizeHandlesVisibility = try engine.editor.getResizeHandlesVisibility()
  print("Resize handles: \(resizeHandlesVisibility.rawValue)")

  try engine.block.setWidthMode(imageBlock, mode: .absolute)
  try engine.block.setHeightMode(imageBlock, mode: .absolute)
  try engine.block.setWidth(imageBlock, value: 400)
  try engine.block.setHeight(imageBlock, value: 300)

  let absoluteWidth = try engine.block.getWidth(imageBlock)
  let absoluteHeight = try engine.block.getHeight(imageBlock)
  print("Configured size: \(absoluteWidth) x \(absoluteHeight)")

  // Center the resized block on the page for the guide's hero image.
  try engine.block.setPositionX(imageBlock, value: 200)
  try engine.block.setPositionY(imageBlock, value: 150)
  try await engine.captureGuide(page, label: "hero")

  try engine.block.setWidthMode(imageBlock, mode: .percent)
  try engine.block.setHeightMode(imageBlock, mode: .percent)
  try engine.block.setWidth(imageBlock, value: 0.5)
  try engine.block.setHeight(imageBlock, value: 0.5)

  let percentWidth = try engine.block.getWidth(imageBlock)
  let widthMode = try engine.block.getWidthMode(imageBlock)
  print("Configured width: \(percentWidth) (mode is percent: \(widthMode == .percent))")

  let frameWidth = try engine.block.getFrameWidth(imageBlock)
  let frameHeight = try engine.block.getFrameHeight(imageBlock)
  print("Frame size: \(frameWidth) x \(frameHeight)")

  try engine.block.setContentFillMode(imageBlock, mode: .crop)
  try engine.block.setWidthMode(imageBlock, mode: .absolute)
  try engine.block.setHeightMode(imageBlock, mode: .absolute)
  try engine.block.setWidth(imageBlock, value: 520, maintainCrop: true)
  try engine.block.setHeight(imageBlock, value: 320, maintainCrop: true)

  let contentFillMode = try engine.block.getContentFillMode(imageBlock)
  print("Content fill mode is crop: \(contentFillMode == .crop)")

  let secondImageBlock = try createImageBlock(engine: engine, page: page, baseURL: baseURL)
  try engine.block.setPositionX(secondImageBlock, value: 460)

  let group = try engine.block.group([imageBlock, secondImageBlock])
  try engine.block.setWidth(group, value: 600)

  let groupWidth = try engine.block.getWidth(group)
  print("Group width: \(groupWidth)")

  try engine.block.resizeContentAware([page], width: 1080, height: 1080)

  let pageWidth = try engine.block.getWidth(page)
  print("Page width after content-aware resize: \(pageWidth)")

  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.block.setScopeEnabled(group, key: "layer/resize", enabled: false)
  let resizeAllowed = try engine.block.isAllowedByScope(group, key: "layer/resize")
  print("Resize allowed: \(resizeAllowed)")

  try engine.block.setTransformLocked(group, locked: true)
  let locked = try engine.block.isTransformLocked(group)
  print("Transform locked: \(locked)")
}

@MainActor
private func createImageBlock(
  engine: Engine,
  page: DesignBlockID,
  baseURL: URL,
) throws -> DesignBlockID {
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 320)
  try engine.block.setHeight(imageBlock, value: 240)
  try engine.block.setPositionX(imageBlock, value: 120)
  try engine.block.setPositionY(imageBlock, value: 120)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  return imageBlock
}

```

Change image dimensions by setting exact width and height values, switching size modes, preserving crop state, or resizing grouped blocks together.

![A sample photo resized to 400 by 300 pixels and centered on the page canvas.](https://img.ly/docs/cesdk/macos/edit-image/transform/resize-407242/assets/swift-based.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-edit-image-transform-resize)

<EngineReferenceNote {...props} />

Image resizing changes a block's dimensions rather than applying a scale multiplier. Use `engine.block.setWidth(_:value:)` and `engine.block.setHeight(_:value:)` for individual dimensions, and choose a `SizeMode` to control how each value is interpreted.

This guide covers resizing image blocks with absolute or percentage sizing, preserving crop state during resize, resizing groups, and locking resize permissions for templates. To grow or shrink an image proportionally instead, see [Scale](./scale.md).

## Create an Image Block

Create a graphic block with an image fill before applying resize operations:

```swift highlight-resizeImages-createImageBlock
@MainActor
private func createImageBlock(
  engine: Engine,
  page: DesignBlockID,
  baseURL: URL,
) throws -> DesignBlockID {
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 320)
  try engine.block.setHeight(imageBlock, value: 240)
  try engine.block.setPositionX(imageBlock, value: 120)
  try engine.block.setPositionY(imageBlock, value: 120)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  return imageBlock
}
```

The resize APIs operate on the block frame. The image fill stays attached to the graphic block and follows the crop and fill mode settings.

## Understanding Size Modes

Size values are interpreted in three modes. `SizeMode.absolute` uses fixed design units, `SizeMode.percent` uses parent-relative values from `0.0` to `1.0`, and `SizeMode.auto` lets CE.SDK calculate the size from content where supported.

Use `engine.block.getWidth(_:)` and `engine.block.getHeight(_:)` to read the configured values. Use `engine.block.getFrameWidth(_:)` and `engine.block.getFrameHeight(_:)` when you need the calculated layout dimensions after CE.SDK resolves the block.

## Using the Built-In Resize UI

When you build an interactive editor with CE.SDK, a selected block displays resize handles on its edges. Control when the non-proportional edge handles appear with the typed resize-handle visibility API:

```swift highlight-resizeImages-resizeHandles
try engine.editor.setResizeHandlesVisibility(.always)
let resizeHandlesVisibility = try engine.editor.getResizeHandlesVisibility()
print("Resize handles: \(resizeHandlesVisibility.rawValue)")
```

`HandleVisibility` accepts `.always`, `.never`, and `.auto`. This setting controls edge-handle visibility only. Programmatic resize APIs and other transform controls still follow the block's scopes and transform lock state.

## Setting Absolute Dimensions

Set explicit dimensions by switching both axes to `SizeMode.absolute`, then writing width and height values:

```swift highlight-resizeImages-absoluteSize
  try engine.block.setWidthMode(imageBlock, mode: .absolute)
  try engine.block.setHeightMode(imageBlock, mode: .absolute)
  try engine.block.setWidth(imageBlock, value: 400)
  try engine.block.setHeight(imageBlock, value: 300)

  let absoluteWidth = try engine.block.getWidth(imageBlock)
  let absoluteHeight = try engine.block.getHeight(imageBlock)
  print("Configured size: \(absoluteWidth) x \(absoluteHeight)")
```

Absolute sizing is the most direct option for fixed layouts, templates, and exports where the target design units are known.

## Percentage Sizing

Use percentage mode for responsive sizing. A value of `1.0` means 100 percent of the parent on that axis:

```swift highlight-resizeImages-percentSize
  try engine.block.setWidthMode(imageBlock, mode: .percent)
  try engine.block.setHeightMode(imageBlock, mode: .percent)
  try engine.block.setWidth(imageBlock, value: 0.5)
  try engine.block.setHeight(imageBlock, value: 0.5)

  let percentWidth = try engine.block.getWidth(imageBlock)
  let widthMode = try engine.block.getWidthMode(imageBlock)
  print("Configured width: \(percentWidth) (mode is percent: \(widthMode == .percent))")
```

Percentage sizing adapts when the parent dimensions change, which makes it useful for reusable templates and generated layouts.

## Getting Frame Dimensions

Configured width and height can differ from the rendered frame in percentage and auto modes. Read the frame dimensions when you need the final layout size:

```swift highlight-resizeImages-frameDimensions
let frameWidth = try engine.block.getFrameWidth(imageBlock)
let frameHeight = try engine.block.getFrameHeight(imageBlock)
print("Frame size: \(frameWidth) x \(frameHeight)")
```

Frame dimensions reflect the block's resolved layout, which CE.SDK calculates after size or mode changes. Read them once the engine has processed the update.

## Maintaining Crop During Resize

When you resize an image block, you change the image frame. The fill and crop state control how the image content stays framed inside that new size.

Pass `maintainCrop: true` when the current crop should stay visually stable while the frame changes:

```swift highlight-resizeImages-maintainCrop
  try engine.block.setContentFillMode(imageBlock, mode: .crop)
  try engine.block.setWidthMode(imageBlock, mode: .absolute)
  try engine.block.setHeightMode(imageBlock, mode: .absolute)
  try engine.block.setWidth(imageBlock, value: 520, maintainCrop: true)
  try engine.block.setHeight(imageBlock, value: 320, maintainCrop: true)

  let contentFillMode = try engine.block.getContentFillMode(imageBlock)
  print("Content fill mode is crop: \(contentFillMode == .crop)")
```

Use this for user-adjusted images or layout changes where visual continuity matters. Leave `maintainCrop` at its default when crop values should stay unadjusted and the visible framing can change according to the current fill and crop state. For reusable code that may receive other block types, call `engine.block.supportsContentFillMode(_:)` before reading or setting the content fill mode.

## Resizing Groups

Group multiple blocks, then resize the group block to keep the members together:

```swift highlight-resizeImages-groupResize
  let group = try engine.block.group([imageBlock, secondImageBlock])
  try engine.block.setWidth(group, value: 600)

  let groupWidth = try engine.block.getWidth(group)
  print("Group width: \(groupWidth)")
```

When a group is resized, CE.SDK keeps the group aspect ratio and updates both dimensions proportionally.

## Content-Aware Resizing

Use `resizeContentAware(_:width:height:)` when changing page dimensions for another output format:

```swift highlight-resizeImages-contentAwareResize
  try engine.block.resizeContentAware([page], width: 1080, height: 1080)

  let pageWidth = try engine.block.getWidth(page)
  print("Page width after content-aware resize: \(pageWidth)")
```

This keeps full-page blocks attached to the page and scales other content proportionally.

## Locking Resize Operations

Resize permissions have two layers: a **global scope** that sets the scene-wide default, and a **block-level scope** that overrides it. The block-level setting only takes effect when the global scope is `.defer`. Under the default Creator role every global scope is `.allow`, so block-level settings are ignored until you defer the global scope first.

To keep a template block at its configured size, set the global `layer/resize` scope to `.defer`, then disable it on the specific block. Read the effective permission with `isAllowedByScope(_:key:)`, which evaluates both layers — `isScopeEnabled(_:key:)` only reports the block-level flag. For an unconditional lock that also prevents moving and rotating, use `setTransformLocked(_:locked:)`:

```swift highlight-resizeImages-lockResize
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.block.setScopeEnabled(group, key: "layer/resize", enabled: false)
  let resizeAllowed = try engine.block.isAllowedByScope(group, key: "layer/resize")
  print("Resize allowed: \(resizeAllowed)")

  try engine.block.setTransformLocked(group, locked: true)
  let locked = try engine.block.isTransformLocked(group)
  print("Transform locked: \(locked)")
```

See [Lock Content](../../rules/lock-content.md) for the full scope and permission model.

## Troubleshooting

### Image Not Resizing

Check whether the `layer/resize` scope is disabled or the block is transform-locked. Then verify that the block exists and that the width and height modes match the values you write.

### Unexpected Size Values

Read `getWidthMode(_:)` and `getHeightMode(_:)` before interpreting numeric values. In percentage mode, `0.5` means 50 percent of the parent, not 0.5 design units.

### Image Appears Cropped

Resize changes the frame around the image content. Use `maintainCrop: true` to preserve the existing crop framing, or adjust the crop after resize when you want a different composition.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.create(_:)` | Create a page or graphic block |
| `engine.block.createShape(_:)` | Create the shape used by a graphic block |
| `engine.block.setShape(_:shape:)` | Attach a shape to a graphic block |
| `engine.block.createFill(_:)` | Create an image fill |
| `engine.block.setURL(_:property:value:)` | Set the image URI on the fill |
| `engine.block.setFill(_:fill:)` | Attach a fill to a block |
| `engine.block.appendChild(to:child:)` | Add the image block to the page |
| `engine.block.setPositionX(_:value:)` | Set a block's x position |
| `engine.block.setPositionY(_:value:)` | Set a block's y position |
| `engine.editor.setResizeHandlesVisibility(_:)` | Set when editor resize handles are shown |
| `engine.editor.getResizeHandlesVisibility()` | Read when editor resize handles are shown |
| `engine.block.setWidthMode(_:mode:)` | Set how CE.SDK interprets the width value |
| `engine.block.setHeightMode(_:mode:)` | Set how CE.SDK interprets the height value |
| `engine.block.setWidth(_:value:maintainCrop:)` | Set a block width and optionally preserve crop state |
| `engine.block.setHeight(_:value:maintainCrop:)` | Set a block height and optionally preserve crop state |
| `engine.block.getWidth(_:)` | Read the configured width value |
| `engine.block.getHeight(_:)` | Read the configured height value |
| `engine.block.getWidthMode(_:)` | Read the width mode |
| `engine.block.getHeightMode(_:)` | Read the height mode |
| `engine.block.getFrameWidth(_:)` | Read the resolved frame width after layout |
| `engine.block.getFrameHeight(_:)` | Read the resolved frame height after layout |
| `engine.block.supportsContentFillMode(_:)` | Check whether a block exposes content fill mode |
| `engine.block.setContentFillMode(_:mode:)` | Set how image content fills its frame |
| `engine.block.getContentFillMode(_:)` | Read how image content fills its frame |
| `engine.block.group(_:)` | Group blocks before resizing them together |
| `engine.block.resizeContentAware(_:width:height:)` | Resize blocks while adjusting contained content |
| `engine.editor.setGlobalScope(key:value:)` | Set the scene-wide default for a scope |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Enable or disable a scope on a block (applies when the global scope is `.defer`) |
| `engine.block.isAllowedByScope(_:key:)` | Read the effective permission after evaluating global and block-level scopes |
| `engine.block.setTransformLocked(_:locked:)` | Lock or unlock all transforms on a block |
| `engine.block.isTransformLocked(_:)` | Read the transform lock state |

## Next Steps

- Resize images proportionally with [Scale](./scale.md).
- Control image framing and visible content with [Crop](./crop.md).
- Apply resizing across complete designs with [Auto-Resize](../../automation/auto-resize.md).



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
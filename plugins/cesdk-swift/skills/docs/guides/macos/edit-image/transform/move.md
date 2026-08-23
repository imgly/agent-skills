> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Move](./move.md)

---

```swift file=@cesdk_swift_examples/engine-guides-edit-image-transform-move/MoveImages.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func moveImages(engine: Engine) async throws {
  // Demo scaffolding: a scene with two image blocks on a single page so we can
  // demonstrate every positioning API against real, renderable content.
  let scene = try engine.scene.create()
  let baseURL = try engine.guidesBaseURL

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let imageBlock = try makeImageBlock(
    engine: engine,
    url: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    width: 240,
    height: 200,
  )
  try engine.block.appendChild(to: page, child: imageBlock)

  let secondImage = try makeImageBlock(
    engine: engine,
    url: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
    width: 240,
    height: 200,
  )
  try engine.block.appendChild(to: page, child: secondImage)
  try engine.block.setPositionX(secondImage, value: 460)
  try engine.block.setPositionY(secondImage, value: 350)

  try engine.block.setPositionX(imageBlock, value: 150)
  try engine.block.setPositionY(imageBlock, value: 100)

  try await engine.captureGuide(page, label: "after-set-position")

  let xPosition = try engine.block.getPositionX(imageBlock)
  let yPosition = try engine.block.getPositionY(imageBlock)
  _ = (xPosition, yPosition)

  try engine.block.setPositionXMode(imageBlock, mode: .percent)
  try engine.block.setPositionYMode(imageBlock, mode: .percent)
  try engine.block.setPositionX(imageBlock, value: 0.5)
  try engine.block.setPositionY(imageBlock, value: 0.5)

  try await engine.captureGuide(page, label: "after-percent")

  let xMode = try engine.block.getPositionXMode(imageBlock)
  let yMode = try engine.block.getPositionYMode(imageBlock)
  _ = (xMode, yMode)

  let currentX = try engine.block.getPositionX(imageBlock)
  try engine.block.setPositionX(imageBlock, value: currentX + 0.05)

  // Switch back to absolute mode before grouping so the group below uses pixel
  // coordinates. The reader sees the explicit mode flip once and then keeps
  // working in absolute units.
  try engine.block.setPositionXMode(imageBlock, mode: .absolute)
  try engine.block.setPositionYMode(imageBlock, mode: .absolute)
  try engine.block.setPositionX(imageBlock, value: 120)
  try engine.block.setPositionY(imageBlock, value: 80)
  try engine.block.setPositionX(secondImage, value: 420)
  try engine.block.setPositionY(secondImage, value: 80)

  if try engine.block.isGroupable([imageBlock, secondImage]) {
    let group = try engine.block.group([imageBlock, secondImage])
    try engine.block.setPositionX(group, value: 80)
    try engine.block.setPositionY(group, value: 200)
  }

  try await engine.captureGuide(page, label: "hero")

  try engine.block.setTransformLocked(imageBlock, locked: true)
}

@MainActor
private func makeImageBlock(
  engine: Engine,
  url: URL,
  width: Float,
  height: Float,
) throws -> DesignBlockID {
  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  let fill = try engine.block.createFill(.image)
  try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: url)
  try engine.block.setFill(block, fill: fill)
  try engine.block.setContentFillMode(block, mode: .cover)
  try engine.block.setWidth(block, value: width)
  try engine.block.setHeight(block, value: height)
  return block
}
```

Position images on the canvas using absolute pixel coordinates or percentage-based positioning for responsive layouts.

![Two images repositioned and grouped on a single page after switching between absolute and percentage position modes.](https://img.ly/docs/cesdk/macos/edit-image/transform/move-818dd9/assets/swift-based.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/engine-guides-edit-image-transform-move)

<EngineReferenceNote {...props} />

Position images on the canvas using coordinates that start at the top-left corner `(0, 0)`. X increases to the right, Y increases downward. Values are relative to the parent block, which simplifies nested layouts.

## Position Coordinates

Coordinates originate at the top-left `(0, 0)` of the parent container. Use **absolute** mode for fixed pixel values or **percentage** mode (`0.0` to `1.0`) for responsive layouts that adapt to parent size changes.

## Positioning Images

Set the image's coordinates with `setPositionX(_:value:)` and `setPositionY(_:value:)`. Both setters take a `Float` interpreted in the current position mode — absolute design units when the mode is `.absolute` (pixels on a default `DesignUnit.px` scene), or `0.0`–`1.0` fractions of the parent's size when the mode is `.percent`.

```swift highlight-moveImages-setPosition
try engine.block.setPositionX(imageBlock, value: 150)
try engine.block.setPositionY(imageBlock, value: 100)
```

## Getting Current Position

Read the current coordinates with `getPositionX(_:)` and `getPositionY(_:)`. Each returns a `Float` interpreted in the block's current position mode (absolute pixels or a `0.0`–`1.0` fraction).

```swift highlight-moveImages-getPosition
let xPosition = try engine.block.getPositionX(imageBlock)
let yPosition = try engine.block.getPositionY(imageBlock)
```

## Configuring Position Modes

Each axis carries its own mode. Use `setPositionXMode(_:mode:)` and `setPositionYMode(_:mode:)` with `PositionMode.absolute` or `PositionMode.percent`. Read the current mode back with `getPositionXMode(_:)` and `getPositionYMode(_:)`.

```swift highlight-moveImages-getMode
let xMode = try engine.block.getPositionXMode(imageBlock)
let yMode = try engine.block.getPositionYMode(imageBlock)
```

The Percentage Positioning section below shows how to flip both axes to `.percent` and use fractional values.

## Percentage Positioning

Switch the modes to `.percent` and use values from `0.0` to `1.0`. The example centers the image on the page by placing its anchor at the midpoint of the parent on both axes.

```swift highlight-moveImages-percent
try engine.block.setPositionXMode(imageBlock, mode: .percent)
try engine.block.setPositionYMode(imageBlock, mode: .percent)
try engine.block.setPositionX(imageBlock, value: 0.5)
try engine.block.setPositionY(imageBlock, value: 0.5)
```

Percentage positioning adapts automatically when the parent block's dimensions change, keeping the image's relative placement stable across responsive scenes.

## Relative Positioning

Move an image relative to its current position by reading the current coordinate and adding an offset. Because position values are interpreted in the current mode, the offset uses the same units — pixels in `.absolute` mode, fractions in `.percent` mode.

```swift highlight-moveImages-relative
let currentX = try engine.block.getPositionX(imageBlock)
try engine.block.setPositionX(imageBlock, value: currentX + 0.05)
```

## Positioning Groups

To move several images together while preserving their relative positions, group them and move the group block. Confirm the blocks can be grouped first with `isGroupable(_:)`, then call `group(_:)` and position the returned group ID like any other block.

```swift highlight-moveImages-group
if try engine.block.isGroupable([imageBlock, secondImage]) {
  let group = try engine.block.group([imageBlock, secondImage])
  try engine.block.setPositionX(group, value: 80)
  try engine.block.setPositionY(group, value: 200)
}
```

## Locking Transforms

Lock move, scale, and rotate on a block with `setTransformLocked(_:locked:)`. Subsequent calls to `setPositionX`, `setPositionY`, `setWidth`, `setHeight`, and the matching mode setters throw an `EngineError` whose `catalogCode` is `EngineErrorCode.blockPositionLocked` (or `EngineErrorCode.blockTransformLockedResize`) until the block is unlocked.

```swift highlight-moveImages-transformLock
try engine.block.setTransformLocked(imageBlock, locked: true)
```

## Troubleshooting

### Image Not Moving

Check whether transforms are locked using `isTransformLocked(_:)`. Verify the image block exists and that target coordinates fall within the parent's bounds.

### Unexpected Position Values

Read the mode with `getPositionXMode(_:)` and `getPositionYMode(_:)`. Pixel values in `.absolute` mode and `0.0`–`1.0` fractions in `.percent` mode look very different — a value of `0.5` is half a pixel in one and the middle of the parent in the other.

### Positioned Outside Visible Area

Confirm the parent block's width and height. Coordinates originate at the top-left, not the center, so a position equal to the parent's size lands the block's anchor flush against the parent's far edge.

### Percentage Positioning Not Responsive

Both axes need to be in `.percent` mode for fractional values to be interpreted as percentages. Set the mode on each axis before assigning the percent value, and keep the value between `0.0` and `1.0`.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.setPositionX(_:value:)` | Set the X coordinate of a block |
| `engine.block.setPositionY(_:value:)` | Set the Y coordinate of a block |
| `engine.block.getPositionX(_:)` | Read the current X coordinate |
| `engine.block.getPositionY(_:)` | Read the current Y coordinate |
| `engine.block.setPositionXMode(_:mode:)` | Set the position mode for the X axis |
| `engine.block.setPositionYMode(_:mode:)` | Set the position mode for the Y axis |
| `engine.block.getPositionXMode(_:)` | Read the X axis position mode |
| `engine.block.getPositionYMode(_:)` | Read the Y axis position mode |
| `engine.block.isGroupable(_:)` | Check whether a set of blocks can be grouped |
| `engine.block.group(_:)` | Group blocks into a single movable parent |
| `engine.block.setTransformLocked(_:locked:)` | Lock or unlock move, scale, and rotate on a block |
| `engine.block.isTransformLocked(_:)` | Read the transform lock state |

### Enums

| Enum | Cases | Description |
| --- | --- | --- |
| `PositionMode` | `.absolute`, `.percent`, `.auto` | How a position value is interpreted on its axis |

## Next Steps

- [Lock Content](../../rules/lock-content.md) — Restrict editing with the scope-based permission system
- [Replace Colors](../replace-colors.md) — Modify image colors programmatically
- [Image Fills](../../fills/image.md) — Apply images as fills to shapes
- [Gradient Fills](../../fills/gradient.md) — Create gradient backgrounds and effects
- [Crop Images](./crop.md) — Frame your subject and remove unwanted edges&#x20;



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Position and Align](./position-and-align.md)

---

Position, align, and distribute design elements precisely using CE.SDK's
layout APIs and snapping system.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/engine-guides-position-and-align)

CE.SDK positions blocks relative to their parent container with the origin at the top left. You can set positions using absolute values (design units) or as percentages of the parent's dimensions. For multi-element layouts, alignment and distribution APIs arrange blocks precisely without manual calculations. Snapping settings let you tune the visual guides shown when users drag elements in the editor.

```swift file=@cesdk_swift_examples/engine-guides-position-and-align/PositionAndAlign.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func positionAndAlign(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Resolve sample assets against the bundled asset base URL.
  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  // Block 1: Absolute positioning at specific coordinates (in design units).
  let block1 = try engine.block.create(.graphic)
  try engine.block.setShape(block1, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block1, value: 150)
  try engine.block.setHeight(block1, value: 100)
  let fill1 = try engine.block.createFill(.image)
  try engine.block.setURL(fill1, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(block1, fill: fill1)
  try engine.block.appendChild(to: page, child: block1)

  try engine.block.setPositionX(block1, value: 50)
  try engine.block.setPositionY(block1, value: 50)

  // Query the current position.
  let x1 = try engine.block.getPositionX(block1)
  let y1 = try engine.block.getPositionY(block1)
  print("Block 1 position: (\(x1), \(y1))")

  // Block 2: Percentage-based positioning relative to the parent's size.
  let block2 = try engine.block.create(.graphic)
  try engine.block.setShape(block2, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block2, value: 150)
  try engine.block.setHeight(block2, value: 100)
  let fill2 = try engine.block.createFill(.image)
  try engine.block.setURL(fill2, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(block2, fill: fill2)
  try engine.block.appendChild(to: page, child: block2)

  // Switch position modes to .percent and use fractional values where
  // 1.0 represents 100% of the parent's size.
  try engine.block.setPositionXMode(block2, mode: .percent)
  try engine.block.setPositionYMode(block2, mode: .percent)
  try engine.block.setPositionX(block2, value: 0.5) // 50% from left
  try engine.block.setPositionY(block2, value: 0.5) // 50% from top

  // Query the position mode.
  let xMode = try engine.block.getPositionXMode(block2)
  let yMode = try engine.block.getPositionYMode(block2)
  print("Block 2 position modes: X=\(xMode), Y=\(yMode)")

  // Build a small set of blocks for alignment.
  var alignBlocks: [DesignBlockID] = []
  let alignPositions: [(Float, Float)] = [(100, 100), (250, 150), (180, 250), (350, 200)]
  for (x, y) in alignPositions {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 100)
    try engine.block.setHeight(block, value: 80)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setPositionX(block, value: x)
    try engine.block.setPositionY(block, value: y)
    alignBlocks.append(block)
  }

  // Confirm the blocks support alignment before calling alignment APIs.
  let canAlign = try engine.block.isAlignable(alignBlocks)
  print("Can align blocks: \(canAlign)")

  // Align the blocks to the left edge of their combined bounding box.
  if canAlign {
    try engine.block.alignHorizontally(alignBlocks, alignment: .left)
  }

  // Passing a single block aligns it to its parent rather than to a group
  // bounding box. This is convenient for centering an element on a page.
  let singleBlock = try engine.block.create(.graphic)
  try engine.block.setShape(singleBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(singleBlock, value: 150)
  try engine.block.setHeight(singleBlock, value: 100)
  let singleFill = try engine.block.createFill(.image)
  try engine.block.setURL(singleFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(singleBlock, fill: singleFill)
  try engine.block.appendChild(to: page, child: singleBlock)
  try engine.block.setPositionX(singleBlock, value: 500)
  try engine.block.setPositionY(singleBlock, value: 300)

  if try engine.block.isAlignable([singleBlock]) {
    try engine.block.alignHorizontally([singleBlock], alignment: .center)
    try engine.block.alignVertically([singleBlock], alignment: .center)
  }

  // Build another row of blocks at uneven horizontal positions for distribution.
  var distributeBlocks: [DesignBlockID] = []
  let xPositions: [Float] = [50, 180, 400, 650]
  for x in xPositions {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 100)
    try engine.block.setHeight(block, value: 80)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setPositionX(block, value: x)
    try engine.block.setPositionY(block, value: 200)
    distributeBlocks.append(block)
  }

  // Confirm the blocks support distribution before calling distribution APIs.
  let canDistribute = try engine.block.isDistributable(distributeBlocks)
  print("Can distribute blocks: \(canDistribute)")

  // Distribute blocks horizontally so the space between them is even.
  // The first and last blocks remain in place.
  if canDistribute {
    try engine.block.distributeHorizontally(distributeBlocks)
  }

  // Build a column of blocks at uneven vertical positions for vertical
  // distribution.
  var verticalBlocks: [DesignBlockID] = []
  let yPositions: [Float] = [50, 150, 350, 500]
  for y in yPositions {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 100)
    try engine.block.setHeight(block, value: 80)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setPositionX(block, value: 600)
    try engine.block.setPositionY(block, value: y)
    verticalBlocks.append(block)
  }

  if try engine.block.isDistributable(verticalBlocks) {
    try engine.block.distributeVertically(verticalBlocks)
  }

  // Configure the position snapping threshold (in pixels). Higher values
  // make snapping activate from further away.
  try engine.editor.setSettingFloat("positionSnappingThreshold", value: 10)

  // Configure the rotation snapping threshold (in radians).
  try engine.editor.setSettingFloat("rotationSnappingThreshold", value: 5 * .pi / 180)

  // Customize snapping guide colors. `snappingGuideColor` controls the
  // position snapping lines and `rotationSnappingGuideColor` controls the
  // rotation guides.
  try engine.editor.setSettingColor(
    "snappingGuideColor",
    color: .rgba(r: 0.2, g: 0.6, b: 1.0, a: 1.0),
  )
  try engine.editor.setSettingColor(
    "rotationSnappingGuideColor",
    color: .rgba(r: 1.0, g: 0.4, b: 0.2, a: 1.0),
  )
}
```

This guide covers how to set block positions using different modes, align blocks horizontally and vertically, distribute blocks with even spacing, and configure snapping for interactive editing.

## Setup

We start with a scene and a page that we will use as the parent for every block created in this guide.

```swift highlight-positionAndAlign-setup
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)
```

## Coordinate System

CE.SDK uses a coordinate system where the origin (0, 0) is at the top-left corner of the parent container. The X axis extends to the right and the Y axis extends downward. All positions are relative to the block's parent.

## Setting Block Positions

### Absolute Positioning

We can position blocks using absolute coordinates in design units. This is useful when you need precise control over element placement.

```swift highlight-positionAndAlign-absolutePosition
  // Block 1: Absolute positioning at specific coordinates (in design units).
  let block1 = try engine.block.create(.graphic)
  try engine.block.setShape(block1, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block1, value: 150)
  try engine.block.setHeight(block1, value: 100)
  let fill1 = try engine.block.createFill(.image)
  try engine.block.setURL(fill1, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(block1, fill: fill1)
  try engine.block.appendChild(to: page, child: block1)

  try engine.block.setPositionX(block1, value: 50)
  try engine.block.setPositionY(block1, value: 50)

  // Query the current position.
  let x1 = try engine.block.getPositionX(block1)
  let y1 = try engine.block.getPositionY(block1)
  print("Block 1 position: (\(x1), \(y1))")
```

`setPositionX(_:value:)` and `setPositionY(_:value:)` set the block's position relative to its parent. Use `getPositionX(_:)` and `getPositionY(_:)` to query the current position.

### Percentage-Based Positioning

Positions can also be set as percentages of the parent's dimensions. This approach is useful for layouts that should adapt to different container sizes.

```swift highlight-positionAndAlign-percentPosition
  // Block 2: Percentage-based positioning relative to the parent's size.
  let block2 = try engine.block.create(.graphic)
  try engine.block.setShape(block2, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block2, value: 150)
  try engine.block.setHeight(block2, value: 100)
  let fill2 = try engine.block.createFill(.image)
  try engine.block.setURL(fill2, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(block2, fill: fill2)
  try engine.block.appendChild(to: page, child: block2)

  // Switch position modes to .percent and use fractional values where
  // 1.0 represents 100% of the parent's size.
  try engine.block.setPositionXMode(block2, mode: .percent)
  try engine.block.setPositionYMode(block2, mode: .percent)
  try engine.block.setPositionX(block2, value: 0.5) // 50% from left
  try engine.block.setPositionY(block2, value: 0.5) // 50% from top

  // Query the position mode.
  let xMode = try engine.block.getPositionXMode(block2)
  let yMode = try engine.block.getPositionYMode(block2)
  print("Block 2 position modes: X=\(xMode), Y=\(yMode)")
```

Position modes are set using `setPositionXMode(_:mode:)` and `setPositionYMode(_:mode:)`. When set to `.percent`, position values represent a fraction of the parent's size (`0.5` = 50%). Query the current mode with `getPositionXMode(_:)` and `getPositionYMode(_:)`. The third mode, `.auto`, lets the engine determine the position automatically.

## Aligning Blocks

### Aligning Multiple Blocks

Multiple blocks can be aligned within their combined bounding box. This is useful for creating visually organized layouts.

```swift highlight-positionAndAlign-checkAlignable
  // Build a small set of blocks for alignment.
  var alignBlocks: [DesignBlockID] = []
  let alignPositions: [(Float, Float)] = [(100, 100), (250, 150), (180, 250), (350, 200)]
  for (x, y) in alignPositions {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 100)
    try engine.block.setHeight(block, value: 80)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setPositionX(block, value: x)
    try engine.block.setPositionY(block, value: y)
    alignBlocks.append(block)
  }

  // Confirm the blocks support alignment before calling alignment APIs.
  let canAlign = try engine.block.isAlignable(alignBlocks)
  print("Can align blocks: \(canAlign)")
```

Before aligning, we check if the blocks can be aligned using `isAlignable(_:)`. This method returns `true` if the blocks support alignment operations.

```swift highlight-positionAndAlign-alignHorizontal
// Align the blocks to the left edge of their combined bounding box.
if canAlign {
  try engine.block.alignHorizontally(alignBlocks, alignment: .left)
}
```

`alignHorizontally(_:alignment:)` accepts an array of block IDs and a `HorizontalBlockAlignment` value: `.left`, `.right`, or `.center`. Similarly, `alignVertically(_:alignment:)` accepts `VerticalBlockAlignment` values `.top`, `.bottom`, or `.center`.

### Aligning a Single Block to Parent

When you pass a single block to the alignment methods, it aligns within its parent container rather than a group bounding box.

```swift highlight-positionAndAlign-alignSingleBlock
  // Passing a single block aligns it to its parent rather than to a group
  // bounding box. This is convenient for centering an element on a page.
  let singleBlock = try engine.block.create(.graphic)
  try engine.block.setShape(singleBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(singleBlock, value: 150)
  try engine.block.setHeight(singleBlock, value: 100)
  let singleFill = try engine.block.createFill(.image)
  try engine.block.setURL(singleFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(singleBlock, fill: singleFill)
  try engine.block.appendChild(to: page, child: singleBlock)
  try engine.block.setPositionX(singleBlock, value: 500)
  try engine.block.setPositionY(singleBlock, value: 300)

  if try engine.block.isAlignable([singleBlock]) {
    try engine.block.alignHorizontally([singleBlock], alignment: .center)
    try engine.block.alignVertically([singleBlock], alignment: .center)
  }
```

This approach is useful for centering elements on a page or positioning them at specific edges of the container.

## Distributing Blocks

Distribution spaces blocks evenly within their bounding box. This is ideal for creating consistent spacing in grid layouts or navigation elements.

```swift highlight-positionAndAlign-checkDistributable
  // Build another row of blocks at uneven horizontal positions for distribution.
  var distributeBlocks: [DesignBlockID] = []
  let xPositions: [Float] = [50, 180, 400, 650]
  for x in xPositions {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 100)
    try engine.block.setHeight(block, value: 80)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setPositionX(block, value: x)
    try engine.block.setPositionY(block, value: 200)
    distributeBlocks.append(block)
  }

  // Confirm the blocks support distribution before calling distribution APIs.
  let canDistribute = try engine.block.isDistributable(distributeBlocks)
  print("Can distribute blocks: \(canDistribute)")
```

`isDistributable(_:)` verifies that the blocks can be distributed.

```swift highlight-positionAndAlign-distributeHorizontal
// Distribute blocks horizontally so the space between them is even.
// The first and last blocks remain in place.
if canDistribute {
  try engine.block.distributeHorizontally(distributeBlocks)
}
```

`distributeHorizontally(_:)` arranges blocks so the horizontal space between them is equal. The first and last blocks remain in place while the middle blocks are repositioned.

```swift highlight-positionAndAlign-distributeVertical
  // Build a column of blocks at uneven vertical positions for vertical
  // distribution.
  var verticalBlocks: [DesignBlockID] = []
  let yPositions: [Float] = [50, 150, 350, 500]
  for y in yPositions {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 100)
    try engine.block.setHeight(block, value: 80)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setPositionX(block, value: 600)
    try engine.block.setPositionY(block, value: y)
    verticalBlocks.append(block)
  }

  if try engine.block.isDistributable(verticalBlocks) {
    try engine.block.distributeVertically(verticalBlocks)
  }
```

Similarly, `distributeVertically(_:)` distributes blocks with equal vertical spacing.

## Configuring Snapping

Snapping provides visual guides when dragging elements in the editor, helping users align blocks precisely. Configure the snapping sensitivity and appearance using editor settings.

### Setting Snapping Thresholds

```swift highlight-positionAndAlign-snappingThreshold
  // Configure the position snapping threshold (in pixels). Higher values
  // make snapping activate from further away.
  try engine.editor.setSettingFloat("positionSnappingThreshold", value: 10)

  // Configure the rotation snapping threshold (in radians).
  try engine.editor.setSettingFloat("rotationSnappingThreshold", value: 5 * .pi / 180)
```

The `positionSnappingThreshold` setting controls how close (in pixels) a block must be to a snap target before snapping activates. Higher values make snapping more "sticky". The `rotationSnappingThreshold` setting controls rotation snapping sensitivity in radians.

### Customizing Snapping Guide Colors

```swift highlight-positionAndAlign-snappingColors
// Customize snapping guide colors. `snappingGuideColor` controls the
// position snapping lines and `rotationSnappingGuideColor` controls the
// rotation guides.
try engine.editor.setSettingColor(
  "snappingGuideColor",
  color: .rgba(r: 0.2, g: 0.6, b: 1.0, a: 1.0),
)
try engine.editor.setSettingColor(
  "rotationSnappingGuideColor",
  color: .rgba(r: 1.0, g: 0.4, b: 0.2, a: 1.0),
)
```

Customize the appearance of snapping guides using color settings. `snappingGuideColor` controls position snapping lines and `rotationSnappingGuideColor` controls rotation guides.

## Troubleshooting

### Position Not Updating

If a block's position doesn't change after calling the setter methods:

- Verify the block's transform is not locked with `isTransformLocked(_:)`
- Check that the block has the `"layer/move"` scope enabled
- Ensure you're using the correct position mode for your values

### Alignment Not Working

If `alignHorizontally(_:alignment:)` or `alignVertically(_:alignment:)` has no effect:

- Confirm `isAlignable(_:)` returns `true` for the blocks
- Verify all block IDs in the array are valid
- Check that blocks have the `"layer/move"` scope enabled

### Blocks Cannot Be Distributed

If `distributeHorizontally(_:)` or `distributeVertically(_:)` doesn't work:

- Verify `isDistributable(_:)` returns `true`
- Ensure you have at least three blocks in the array
- Check that all blocks share the same parent

## API Reference

| Method | Description |
|--------|-------------|
| `block.getPositionX(_:)` | Get a block's X position |
| `block.getPositionY(_:)` | Get a block's Y position |
| `block.setPositionX(_:value:)` | Set a block's X position |
| `block.setPositionY(_:value:)` | Set a block's Y position |
| `block.getPositionXMode(_:)` | Get a block's X position mode |
| `block.getPositionYMode(_:)` | Get a block's Y position mode |
| `block.setPositionXMode(_:mode:)` | Set a block's X position mode |
| `block.setPositionYMode(_:mode:)` | Set a block's Y position mode |
| `block.isAlignable(_:)` | Check if blocks can be aligned |
| `block.alignHorizontally(_:alignment:)` | Align blocks horizontally |
| `block.alignVertically(_:alignment:)` | Align blocks vertically |
| `block.isDistributable(_:)` | Check if blocks can be distributed |
| `block.distributeHorizontally(_:)` | Distribute blocks horizontally with even spacing |
| `block.distributeVertically(_:)` | Distribute blocks vertically with even spacing |
| `editor.setSettingFloat(_:value:)` | Set a float setting (snapping thresholds) |
| `editor.setSettingColor(_:color:)` | Set a color setting (snapping guide colors) |

## Next Steps

Now that you understand positioning and alignment, explore related layout features:

- [Layer Management](./layer-management.md) — Control the stacking order of elements
- [Grouping](./group-and-ungroup.md) — Group related elements together
- [Multi-Page Layouts](./multi-page.md) — Create multi-page designs with multiple pages in a single scene



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
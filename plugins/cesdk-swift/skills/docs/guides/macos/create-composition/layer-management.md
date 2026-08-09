> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Layers](./layer-management.md)

---

```swift file=@cesdk_swift_examples/engine-guides-layer-management/LayerManagement.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func layerManagement(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Create a red rectangle
  let redRect = try engine.block.create(.graphic)
  try engine.block.setShape(redRect, shape: engine.block.createShape(.rect))
  let redFill = try engine.block.createFill(.color)
  try engine.block.setFill(redRect, fill: redFill)
  try engine.block.setColor(redFill, property: "fill/color/value", color: .rgba(r: 0.9, g: 0.2, b: 0.2, a: 1.0))
  try engine.block.setWidth(redRect, value: 180)
  try engine.block.setHeight(redRect, value: 180)
  try engine.block.setPositionX(redRect, value: 220)
  try engine.block.setPositionY(redRect, value: 120)

  // Create a green rectangle
  let greenRect = try engine.block.create(.graphic)
  try engine.block.setShape(greenRect, shape: engine.block.createShape(.rect))
  let greenFill = try engine.block.createFill(.color)
  try engine.block.setFill(greenRect, fill: greenFill)
  try engine.block.setColor(greenFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.8, b: 0.2, a: 1.0))
  try engine.block.setWidth(greenRect, value: 180)
  try engine.block.setHeight(greenRect, value: 180)
  try engine.block.setPositionX(greenRect, value: 280)
  try engine.block.setPositionY(greenRect, value: 180)

  // Create a blue rectangle
  let blueRect = try engine.block.create(.graphic)
  try engine.block.setShape(blueRect, shape: engine.block.createShape(.rect))
  let blueFill = try engine.block.createFill(.color)
  try engine.block.setFill(blueRect, fill: blueFill)
  try engine.block.setColor(blueFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0))
  try engine.block.setWidth(blueRect, value: 180)
  try engine.block.setHeight(blueRect, value: 180)
  try engine.block.setPositionX(blueRect, value: 340)
  try engine.block.setPositionY(blueRect, value: 240)

  // Add blocks to the page — last appended is on top
  try engine.block.appendChild(to: page, child: redRect)
  try engine.block.appendChild(to: page, child: greenRect)
  try engine.block.appendChild(to: page, child: blueRect)

  // Get the parent of a block
  let parent = try engine.block.getParent(redRect)
  print("Parent of red rectangle:", parent as Any)

  // Get all children of the page
  let children = try engine.block.getChildren(page)
  print("Page children (in render order):", children)

  // Insert a new block at a specific position (index 0 = back)
  let yellowRect = try engine.block.create(.graphic)
  try engine.block.setShape(yellowRect, shape: engine.block.createShape(.rect))
  let yellowFill = try engine.block.createFill(.color)
  try engine.block.setFill(yellowRect, fill: yellowFill)
  try engine.block.setColor(yellowFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.85, b: 0.2, a: 1.0))
  try engine.block.setWidth(yellowRect, value: 180)
  try engine.block.setHeight(yellowRect, value: 180)
  try engine.block.setPositionX(yellowRect, value: 160)
  try engine.block.setPositionY(yellowRect, value: 60)
  try engine.block.insertChild(into: page, child: yellowRect, at: 0)

  // Bring the red rectangle to the front
  try engine.block.bringToFront(redRect)
  print("Red rectangle brought to front")

  // Send the blue rectangle to the back
  try engine.block.sendToBack(blueRect)
  print("Blue rectangle sent to back")

  // Move the green rectangle forward one layer
  try engine.block.bringForward(greenRect)
  print("Green rectangle moved forward")

  // Move the yellow rectangle backward one layer
  try engine.block.sendBackward(yellowRect)
  print("Yellow rectangle moved backward")

  // Check and toggle visibility
  let isVisible = try engine.block.isVisible(blueRect)
  print("Blue rectangle visible:", isVisible)

  // Hide the blue rectangle temporarily
  try engine.block.setVisible(blueRect, visible: false)
  print("Blue rectangle hidden")

  // Show it again for the final composition
  try engine.block.setVisible(blueRect, visible: true)
  print("Blue rectangle shown again")

  // Duplicate a block
  let duplicateGreen = try engine.block.duplicate(greenRect)
  try engine.block.setPositionX(duplicateGreen, value: 400)
  try engine.block.setPositionY(duplicateGreen, value: 300)
  // Change the duplicate's color to purple
  let purpleFill = try engine.block.createFill(.color)
  try engine.block.setFill(duplicateGreen, fill: purpleFill)
  try engine.block.setColor(purpleFill, property: "fill/color/value", color: .rgba(r: 0.6, g: 0.2, b: 0.8, a: 1.0))
  print("Green rectangle duplicated")

  // Check if a block is valid before operations
  let isValidBefore = engine.block.isValid(yellowRect)
  print("Yellow rectangle valid before destroy:", isValidBefore)

  // Remove a block from the scene
  try engine.block.destroy(yellowRect)
  print("Yellow rectangle destroyed")

  // Check validity after destruction
  let isValidAfter = engine.block.isValid(yellowRect)
  print("Yellow rectangle valid after destroy:", isValidAfter)

  try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
}
```

Organize design elements in CE.SDK using a hierarchical layer stack to control stacking order, visibility, and element relationships.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-layer-management)

Design elements in CE.SDK are organized in a hierarchical parent-child structure. Children of a block are rendered in order, with the last child appearing on top. This layer stack model gives you precise control over how elements overlap and interact visually.

This guide covers how to navigate the block hierarchy, reorder elements in the layer stack, toggle visibility, and manage block lifecycles through duplication and deletion.

## Creating Visual Blocks

To demonstrate layer ordering, we create colored rectangles that overlap on the canvas. Each block is created using `engine.block.create(.graphic)` and configured with a shape, fill color, dimensions, and position.

```swift highlight-layerManagement-createBlock
// Create a red rectangle
let redRect = try engine.block.create(.graphic)
try engine.block.setShape(redRect, shape: engine.block.createShape(.rect))
let redFill = try engine.block.createFill(.color)
try engine.block.setFill(redRect, fill: redFill)
try engine.block.setColor(redFill, property: "fill/color/value", color: .rgba(r: 0.9, g: 0.2, b: 0.2, a: 1.0))
try engine.block.setWidth(redRect, value: 180)
try engine.block.setHeight(redRect, value: 180)
try engine.block.setPositionX(redRect, value: 220)
try engine.block.setPositionY(redRect, value: 120)
```

## Navigating the Block Hierarchy

CE.SDK organizes blocks in a parent-child tree. Every block can have one parent and multiple children. Understanding this hierarchy is essential for programmatic layer management.

### Getting a Block's Parent

Retrieve the parent of any block using `engine.block.getParent(_:)`. This returns the parent's block ID, or `nil` if the block has no parent.

```swift highlight-layerManagement-getParent
// Get the parent of a block
let parent = try engine.block.getParent(redRect)
print("Parent of red rectangle:", parent as Any)
```

### Listing Child Blocks

Get all direct children of a block using `engine.block.getChildren(_:)`. Children are returned sorted in their rendering order — the last child renders in front of other children.

```swift highlight-layerManagement-getChildren
// Get all children of the page
let children = try engine.block.getChildren(page)
print("Page children (in render order):", children)
```

This method is useful for iterating over all elements on a page or within a group.

## Adding and Positioning Blocks

When you create a new block, it exists independently until you add it to the hierarchy. There are two ways to attach blocks to a parent: appending to the end or inserting at a specific position.

### Appending Blocks

Add a block as the last child of a parent using `engine.block.appendChild(to:child:)`. Since the last child renders on top, the appended block becomes the topmost element.

```swift highlight-layerManagement-appendChild
// Add blocks to the page — last appended is on top
try engine.block.appendChild(to: page, child: redRect)
try engine.block.appendChild(to: page, child: greenRect)
try engine.block.appendChild(to: page, child: blueRect)
```

When you append multiple blocks in sequence, each new block appears in front of the previous ones.

### Inserting at a Specific Position

Insert a block at a specific index in the layer stack using `engine.block.insertChild(into:child:at:)`. Index 0 places the block at the back, behind all other children.

```swift highlight-layerManagement-insertChild
// Insert a new block at a specific position (index 0 = back)
let yellowRect = try engine.block.create(.graphic)
try engine.block.setShape(yellowRect, shape: engine.block.createShape(.rect))
let yellowFill = try engine.block.createFill(.color)
try engine.block.setFill(yellowRect, fill: yellowFill)
try engine.block.setColor(yellowFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.85, b: 0.2, a: 1.0))
try engine.block.setWidth(yellowRect, value: 180)
try engine.block.setHeight(yellowRect, value: 180)
try engine.block.setPositionX(yellowRect, value: 160)
try engine.block.setPositionY(yellowRect, value: 60)
try engine.block.insertChild(into: page, child: yellowRect, at: 0)
```

### Reparenting Blocks

When you add a block to a new parent using `appendChild(to:child:)` or `insertChild(into:child:at:)`, it is automatically removed from its previous parent. This makes reparenting straightforward without needing to manually detach blocks first.

## Changing Z-Order

Once blocks are in the hierarchy, you can change their stacking order without removing and re-adding them. CE.SDK provides four methods for z-order manipulation.

### Bring to Front

Move an element to the top of its siblings using `engine.block.bringToFront(_:)`. This gives the block the highest stacking order among its siblings.

```swift highlight-layerManagement-bringToFront
// Bring the red rectangle to the front
try engine.block.bringToFront(redRect)
print("Red rectangle brought to front")
```

### Send to Back

Move an element behind all its siblings using `engine.block.sendToBack(_:)`. This gives the block the lowest stacking order among its siblings.

```swift highlight-layerManagement-sendToBack
// Send the blue rectangle to the back
try engine.block.sendToBack(blueRect)
print("Blue rectangle sent to back")
```

### Move Forward One Layer

Move an element one position forward using `engine.block.bringForward(_:)`. This swaps the block with its immediate sibling in front.

```swift highlight-layerManagement-bringForward
// Move the green rectangle forward one layer
try engine.block.bringForward(greenRect)
print("Green rectangle moved forward")
```

### Move Backward One Layer

Move an element one position backward using `engine.block.sendBackward(_:)`. This swaps the block with its immediate sibling behind.

```swift highlight-layerManagement-sendBackward
// Move the yellow rectangle backward one layer
try engine.block.sendBackward(yellowRect)
print("Yellow rectangle moved backward")
```

These incremental operations are useful for fine-tuning layer order without jumping to extremes.

## Controlling Visibility

Visibility allows you to temporarily hide elements without removing them from the scene. Hidden elements remain in the hierarchy and preserve their properties but are not rendered.

Query the current visibility state using `engine.block.isVisible(_:)` and change it using `engine.block.setVisible(_:visible:)`.

```swift highlight-layerManagement-visibility
  // Check and toggle visibility
  let isVisible = try engine.block.isVisible(blueRect)
  print("Blue rectangle visible:", isVisible)

  // Hide the blue rectangle temporarily
  try engine.block.setVisible(blueRect, visible: false)
  print("Blue rectangle hidden")

  // Show it again for the final composition
  try engine.block.setVisible(blueRect, visible: true)
  print("Blue rectangle shown again")
```

Visibility is useful for creating before/after comparisons, hiding elements during editing, or implementing show/hide functionality in your application.

## Managing Block Lifecycle

CE.SDK provides methods for duplicating blocks to create copies and destroying blocks to remove them permanently.

### Duplicating Blocks

Create a copy of a block and all its children using `engine.block.duplicate(_:)`. By default, the duplicate is attached to the same parent as the original.

```swift highlight-layerManagement-duplicate
// Duplicate a block
let duplicateGreen = try engine.block.duplicate(greenRect)
try engine.block.setPositionX(duplicateGreen, value: 400)
try engine.block.setPositionY(duplicateGreen, value: 300)
// Change the duplicate's color to purple
let purpleFill = try engine.block.createFill(.color)
try engine.block.setFill(duplicateGreen, fill: purpleFill)
try engine.block.setColor(purpleFill, property: "fill/color/value", color: .rgba(r: 0.6, g: 0.2, b: 0.8, a: 1.0))
print("Green rectangle duplicated")
```

The duplicated block is positioned at the same location as the original. Reposition it to make it visible as a separate element.

### Checking Block Validity

Before performing operations on a block, verify it still exists using `engine.block.isValid(_:)`. A block becomes invalid after it has been destroyed.

```swift highlight-layerManagement-isValid
// Check if a block is valid before operations
let isValidBefore = engine.block.isValid(yellowRect)
print("Yellow rectangle valid before destroy:", isValidBefore)
```

### Removing Blocks

Permanently remove a block and all its children from the scene using `engine.block.destroy(_:)`.

```swift highlight-layerManagement-destroy
  // Remove a block from the scene
  try engine.block.destroy(yellowRect)
  print("Yellow rectangle destroyed")

  // Check validity after destruction
  let isValidAfter = engine.block.isValid(yellowRect)
  print("Yellow rectangle valid after destroy:", isValidAfter)
```

After destruction, any reference to the block becomes invalid. Attempting to use an invalid block ID results in errors.

## Framing the Result

After making layer changes, zoom to fit the page in the viewport so the composition is clearly visible.

```swift highlight-layerManagement-zoom
try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
```

## Troubleshooting

**Block not visible after appendChild**: The block may be behind other elements. Use `engine.block.bringToFront(_:)` or adjust the insert index to control stacking order.

**getParent returns nil**: The block is not attached to any parent. Use `engine.block.appendChild(to:child:)` or `engine.block.insertChild(into:child:at:)` to attach it to a page or container.

**Changes not reflected**: The block handle may be invalid. Check with `engine.block.isValid(_:)` before performing operations.

**Z-order not updating**: Verify you're operating on the correct block ID and that the block is in the expected parent context.

**Duplicate not appearing**: If `attachToParent` is set to false, the duplicate won't be attached automatically. Set it to true or manually attach the duplicate to a parent.

## API Reference

| Method | Category | Description |
| --- | --- | --- |
| `engine.block.getParent(_:)` | Hierarchy | Get the parent block of a given block |
| `engine.block.getChildren(_:)` | Hierarchy | Get all child blocks in rendering order |
| `engine.block.appendChild(to:child:)` | Hierarchy | Append a block as the last child |
| `engine.block.insertChild(into:child:at:)` | Hierarchy | Insert a block at a specific position |
| `engine.block.bringToFront(_:)` | Z-Order | Bring a block to the front of its siblings |
| `engine.block.sendToBack(_:)` | Z-Order | Send a block to the back of its siblings |
| `engine.block.bringForward(_:)` | Z-Order | Move a block one position forward |
| `engine.block.sendBackward(_:)` | Z-Order | Move a block one position backward |
| `engine.block.isVisible(_:)` | Visibility | Check if a block is visible |
| `engine.block.setVisible(_:visible:)` | Visibility | Set the visibility of a block |
| `engine.block.duplicate(_:)` | Lifecycle | Duplicate a block and its children |
| `engine.block.destroy(_:)` | Lifecycle | Remove a block and its children |
| `engine.block.isValid(_:)` | Lifecycle | Check if a block handle is valid |

## Next Steps

- [Grouping](./group-and-ungroup.md) — Group multiple blocks to move or transform them together
- [Position and Align](./position-and-align.md) — Precisely position elements on the canvas
- [Multi-Page Layouts](./multi-page.md) — Work with multiple pages in a single scene



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Design a Layout](./layout.md)

---

```swift file=@cesdk_swift_examples/engine-guides-layout/Layout.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func layout(engine: Engine) async throws {
  // Create a scene with VerticalStack layout. Pages appended to the stack
  // container are arranged top-to-bottom automatically.
  try engine.scene.create(sceneLayout: .verticalStack)

  // Get the stack container that was created with the scene.
  let stacks = try engine.block.find(byType: .stack)
  let stack = stacks[0]

  // Create two pages that will stack vertically.
  let page1 = try engine.block.create(.page)
  try engine.block.setWidth(page1, value: 400)
  try engine.block.setHeight(page1, value: 300)
  try engine.block.appendChild(to: stack, child: page1)

  let page2 = try engine.block.create(.page)
  try engine.block.setWidth(page2, value: 400)
  try engine.block.setHeight(page2, value: 300)
  try engine.block.appendChild(to: stack, child: page2)

  // Configure spacing between stacked pages.
  try engine.block.setFloat(stack, property: "stack/spacing", value: 20)
  try engine.block.setBool(stack, property: "stack/spacingInScreenspace", value: true)

  // Resolve sample assets against the bundled asset base URL.
  let baseURL = try engine.guidesBaseURL

  // Add an image block to the first page.
  let block1 = try engine.block.create(.graphic)
  let shape1 = try engine.block.createShape(.rect)
  try engine.block.setShape(block1, shape: shape1)
  try engine.block.setWidth(block1, value: 350)
  try engine.block.setHeight(block1, value: 250)
  try engine.block.setPositionX(block1, value: 25)
  try engine.block.setPositionY(block1, value: 25)
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(block1, fill: imageFill)
  try engine.block.appendChild(to: page1, child: block1)

  // Add a colored rectangle to the second page.
  let block2 = try engine.block.create(.graphic)
  let shape2 = try engine.block.createShape(.rect)
  try engine.block.setShape(block2, shape: shape2)
  try engine.block.setWidth(block2, value: 350)
  try engine.block.setHeight(block2, value: 250)
  try engine.block.setPositionX(block2, value: 25)
  try engine.block.setPositionY(block2, value: 25)
  let colorFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    colorFill,
    property: "fill/color/value",
    color: .rgba(r: 0.3, g: 0.6, b: 0.9, a: 1.0),
  )
  try engine.block.setFill(block2, fill: colorFill)
  try engine.block.appendChild(to: page2, child: block2)

  // Switch to a horizontal stack. Existing pages reposition left-to-right.
  try engine.scene.setLayout(.horizontalStack)

  // Verify the layout type.
  let currentLayout = try engine.scene.getLayout()
  print("Current layout:", currentLayout)

  // Append a new page to the existing stack. It snaps to the end with the
  // configured spacing.
  let page3 = try engine.block.create(.page)
  try engine.block.setWidth(page3, value: 400)
  try engine.block.setHeight(page3, value: 300)
  try engine.block.appendChild(to: stack, child: page3)

  // Add content to the new page.
  let block3 = try engine.block.create(.graphic)
  let shape3 = try engine.block.createShape(.rect)
  try engine.block.setShape(block3, shape: shape3)
  try engine.block.setWidth(block3, value: 350)
  try engine.block.setHeight(block3, value: 250)
  try engine.block.setPositionX(block3, value: 25)
  try engine.block.setPositionY(block3, value: 25)
  let fill3 = try engine.block.createFill(.color)
  try engine.block.setColor(
    fill3,
    property: "fill/color/value",
    color: .rgba(r: 0.9, g: 0.5, b: 0.3, a: 1.0),
  )
  try engine.block.setFill(block3, fill: fill3)
  try engine.block.appendChild(to: page3, child: block3)

  // Move page3 to the first position using insertChild.
  try engine.block.insertChild(into: stack, child: page3, at: 0)

  // Verify the new order.
  let pageOrder = try engine.block.getChildren(stack)
  print("Page order after reordering:", pageOrder)

  // Update the spacing between stacked pages.
  try engine.block.setFloat(stack, property: "stack/spacing", value: 40)

  // Verify the spacing value.
  let updatedSpacing = try engine.block.getFloat(stack, property: "stack/spacing")
  print("Updated spacing:", updatedSpacing)

  // Switch back to a free layout to position pages manually.
  try engine.scene.setLayout(.free)

  // Position a page directly — stacks no longer manage placement.
  let pages = try engine.block.find(byType: .page)
  let page = pages[0]
  try engine.block.setPositionX(page, value: 100)
  try engine.block.setPositionY(page, value: 200)
}
```

Create structured compositions using stack layouts that automatically arrange pages vertically or horizontally with consistent spacing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-layout)

Stack layouts arrange pages automatically with consistent spacing. Vertical stacks arrange pages top-to-bottom, while horizontal stacks arrange them left-to-right. This eliminates manual positioning for compositions like photo collages, product catalogs, or social media carousels.

This guide covers how to:

- Create vertical and horizontal stack layouts
- Add pages and blocks to stacks
- Configure spacing between stacked pages
- Reorder pages within a stack
- Switch between stack and free layouts

## Create a Vertical Stack Layout

Vertical stacks arrange pages from top to bottom. Create a scene with `.verticalStack` layout, then append pages to the stack container.

```swift highlight-layout-verticalStack
  // Create a scene with VerticalStack layout. Pages appended to the stack
  // container are arranged top-to-bottom automatically.
  try engine.scene.create(sceneLayout: .verticalStack)

  // Get the stack container that was created with the scene.
  let stacks = try engine.block.find(byType: .stack)
  let stack = stacks[0]

  // Create two pages that will stack vertically.
  let page1 = try engine.block.create(.page)
  try engine.block.setWidth(page1, value: 400)
  try engine.block.setHeight(page1, value: 300)
  try engine.block.appendChild(to: stack, child: page1)

  let page2 = try engine.block.create(.page)
  try engine.block.setWidth(page2, value: 400)
  try engine.block.setHeight(page2, value: 300)
  try engine.block.appendChild(to: stack, child: page2)

  // Configure spacing between stacked pages.
  try engine.block.setFloat(stack, property: "stack/spacing", value: 20)
  try engine.block.setBool(stack, property: "stack/spacingInScreenspace", value: true)
```

When you create a scene with `.verticalStack`, CE.SDK automatically adds a stack container. Pages appended to this container position themselves with the configured spacing. The `stack/spacingInScreenspace` property keeps spacing visually consistent at any zoom level.

The distinction applies to the canvas preview only. Exports always interpret the spacing in design units, whatever the property is set to.

Switching the property never converts the number. A spacing of `40` stays `40` and is reinterpreted in the other space, which changes how far apart the pages appear.

## Add Blocks to Pages

Each page can contain multiple blocks. Create blocks with a shape and fill, position them inside the page, then append them as children.

```swift highlight-layout-addBlocks
  // Add an image block to the first page.
  let block1 = try engine.block.create(.graphic)
  let shape1 = try engine.block.createShape(.rect)
  try engine.block.setShape(block1, shape: shape1)
  try engine.block.setWidth(block1, value: 350)
  try engine.block.setHeight(block1, value: 250)
  try engine.block.setPositionX(block1, value: 25)
  try engine.block.setPositionY(block1, value: 25)
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(block1, fill: imageFill)
  try engine.block.appendChild(to: page1, child: block1)

  // Add a colored rectangle to the second page.
  let block2 = try engine.block.create(.graphic)
  let shape2 = try engine.block.createShape(.rect)
  try engine.block.setShape(block2, shape: shape2)
  try engine.block.setWidth(block2, value: 350)
  try engine.block.setHeight(block2, value: 250)
  try engine.block.setPositionX(block2, value: 25)
  try engine.block.setPositionY(block2, value: 25)
  let colorFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    colorFill,
    property: "fill/color/value",
    color: .rgba(r: 0.3, g: 0.6, b: 0.9, a: 1.0),
  )
  try engine.block.setFill(block2, fill: colorFill)
  try engine.block.appendChild(to: page2, child: block2)
```

Graphic blocks require both a shape and a fill to be visible. Use an image fill with `fill/image/imageFileURI` for image content, or a color fill for solid colors. Position blocks inside their parent page with `setPositionX` and `setPositionY`.

## Switch to Horizontal Layout

Change the layout direction at any time with `setLayout`. Horizontal stacks arrange pages left-to-right instead of top-to-bottom.

```swift highlight-layout-horizontalStack
  // Switch to a horizontal stack. Existing pages reposition left-to-right.
  try engine.scene.setLayout(.horizontalStack)

  // Verify the layout type.
  let currentLayout = try engine.scene.getLayout()
  print("Current layout:", currentLayout)
```

Horizontal layouts suit carousels, timelines, and horizontal galleries. Existing pages reposition automatically when you change the layout type.

## Add Pages to Existing Stacks

Append new pages to an existing stack at any time. Pages snap to the end of the stack with the configured spacing.

```swift highlight-layout-addPage
  // Append a new page to the existing stack. It snaps to the end with the
  // configured spacing.
  let page3 = try engine.block.create(.page)
  try engine.block.setWidth(page3, value: 400)
  try engine.block.setHeight(page3, value: 300)
  try engine.block.appendChild(to: stack, child: page3)

  // Add content to the new page.
  let block3 = try engine.block.create(.graphic)
  let shape3 = try engine.block.createShape(.rect)
  try engine.block.setShape(block3, shape: shape3)
  try engine.block.setWidth(block3, value: 350)
  try engine.block.setHeight(block3, value: 250)
  try engine.block.setPositionX(block3, value: 25)
  try engine.block.setPositionY(block3, value: 25)
  let fill3 = try engine.block.createFill(.color)
  try engine.block.setColor(
    fill3,
    property: "fill/color/value",
    color: .rgba(r: 0.9, g: 0.5, b: 0.3, a: 1.0),
  )
  try engine.block.setFill(block3, fill: fill3)
  try engine.block.appendChild(to: page3, child: block3)
```

The stack container handles positioning automatically. You can populate the new page with content before or after appending it.

## Reorder Pages

Change page order with `insertChild` to place a page at a specific index inside the stack.

```swift highlight-layout-reorder
  // Move page3 to the first position using insertChild.
  try engine.block.insertChild(into: stack, child: page3, at: 0)

  // Verify the new order.
  let pageOrder = try engine.block.getChildren(stack)
  print("Page order after reordering:", pageOrder)
```

Removing a page from its current slot and reinserting it at a new index moves it to that position. The remaining pages shift to make room.

## Change Stack Spacing

Adjust spacing between pages by setting the `stack/spacing` property on the stack block.

```swift highlight-layout-spacing
  // Update the spacing between stacked pages.
  try engine.block.setFloat(stack, property: "stack/spacing", value: 40)

  // Verify the spacing value.
  let updatedSpacing = try engine.block.getFloat(stack, property: "stack/spacing")
  print("Updated spacing:", updatedSpacing)
```

Spacing updates take effect immediately and pages reposition automatically. Read the current value back with `getFloat`.

## Switch to Free Layout

For manual positioning, switch to `.free`. Pages keep their current positions but stop auto-arranging.

```swift highlight-layout-freeLayout
  // Switch back to a free layout to position pages manually.
  try engine.scene.setLayout(.free)

  // Position a page directly — stacks no longer manage placement.
  let pages = try engine.block.find(byType: .page)
  let page = pages[0]
  try engine.block.setPositionX(page, value: 100)
  try engine.block.setPositionY(page, value: 200)
```

Free layout gives full control over page positions. Use this when you need precise placement that stack layouts cannot provide.

## Troubleshooting

**Pages not arranging automatically** — Verify the scene layout is `.verticalStack` or `.horizontalStack` with `getLayout()`.

**Spacing not applying** — Set `stack/spacing` on the stack block, not the scene. Use `find(byType: .stack)` to locate the container.

**Pages overlapping** — Ensure pages are direct children of the stack container. Nested pages do not auto-arrange.

**Can't position manually** — Stack layouts override manual positions. Switch to `.free` for manual control.

**Wrong stacking order** — Child order determines position. Use `insertChild(into:child:at:)` to move pages to a specific slot.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.scene.create(sceneLayout:)` | Create a scene with the specified layout (`.free`, `.verticalStack`, `.horizontalStack`). |
| `engine.scene.setLayout(_:)` | Change the layout of the current scene. |
| `engine.scene.getLayout()` | Get the current scene layout. |
| `engine.block.find(byType: .stack)` | Find the stack container block. |
| `engine.block.setFloat(_:property:value:)` with `stack/spacing` | Set spacing between stacked pages. |
| `engine.block.getFloat(_:property:)` with `stack/spacing` | Get the current spacing value. |
| `engine.block.appendChild(to:child:)` | Append a page to the stack. |
| `engine.block.insertChild(into:child:at:)` | Insert a page at a specific position. |
| `engine.block.getChildren(_:)` | Get child blocks in order. |

## Next Steps

- [Auto-resize](../automation/auto-resize.md) — Make blocks fit parent containers
- [Manual Positioning](../edit-image/transform/move.md) — Position blocks in free layouts
- [Layer Hierarchies](./layer-management.md) — Organize blocks in hierarchical structures
- [Create a Collage](./collage.md) — Build photo collages with templates



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
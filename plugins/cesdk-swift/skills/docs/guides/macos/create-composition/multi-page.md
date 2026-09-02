> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Multi-Page Layouts](./multi-page.md)

---

```swift file=@cesdk_swift_examples/engine-guides-multi-page/MultiPage.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func multiPage(engine: Engine) async throws {
  // Create a scene with HorizontalStack layout
  try engine.scene.create(sceneLayout: .horizontalStack)

  // Get the stack container
  let stacks = try engine.block.find(byType: .stack)
  let stack = stacks[0]

  // Create the first page
  let firstPage = try engine.block.create(.page)
  try engine.block.setWidth(firstPage, value: 800)
  try engine.block.setHeight(firstPage, value: 600)
  try engine.block.appendChild(to: stack, child: firstPage)

  // Resolve sample assets against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL

  // Add spacing between pages (20 pixels in screen space)
  try engine.block.setFloat(stack, property: "stack/spacing", value: 20)
  try engine.block.setBool(stack, property: "stack/spacingInScreenspace", value: true)

  // Add content to the first page
  let imageBlock1 = try engine.block.create(.graphic)
  let rectShape1 = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock1, shape: rectShape1)
  try engine.block.setWidth(imageBlock1, value: 300)
  try engine.block.setHeight(imageBlock1, value: 200)
  try engine.block.setPositionX(imageBlock1, value: 250)
  try engine.block.setPositionY(imageBlock1, value: 200)
  let imageFill1 = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill1,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock1, fill: imageFill1)
  try engine.block.appendChild(to: firstPage, child: imageBlock1)

  // Create a second page with different content
  let secondPage = try engine.block.create(.page)
  try engine.block.setWidth(secondPage, value: 800)
  try engine.block.setHeight(secondPage, value: 600)
  try engine.block.appendChild(to: stack, child: secondPage)

  // Add a different image to the second page
  let imageBlock2 = try engine.block.create(.graphic)
  let rectShape2 = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock2, shape: rectShape2)
  try engine.block.setWidth(imageBlock2, value: 300)
  try engine.block.setHeight(imageBlock2, value: 200)
  try engine.block.setPositionX(imageBlock2, value: 250)
  try engine.block.setPositionY(imageBlock2, value: 200)
  let imageFill2 = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill2,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
  )
  try engine.block.setFill(imageBlock2, fill: imageFill2)
  try engine.block.appendChild(to: secondPage, child: imageBlock2)

  try engine.block.select(firstPage)
  try engine.scene.enableZoomAutoFit(firstPage, axis: .both)
}
```

Create multi-page designs in CE.SDK for brochures, presentations, catalogs,
and other documents requiring multiple pages within a single scene.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260902/engine-guides-multi-page)

Multi-page layouts allow you to create documents with multiple artboards within a single scene. Each page operates as an independent canvas that can contain different content while sharing the same scene context. CE.SDK provides scene layout modes that automatically arrange pages vertically, horizontally, or in a free-form canvas.

This guide covers how to create multi-page scenes, add pages, and configure spacing between pages.

## Using the Built-in Page Management UI

The CE.SDK editor provides built-in UI controls for managing pages. Users can interact with the page panel to add new pages, duplicate existing ones, reorder them with drag-and-drop, delete pages, and navigate between pages by tapping.

The page panel displays thumbnails of all pages in the scene, making it easy to understand the document structure at a glance. When a page thumbnail is tapped, the viewport automatically zooms to that page.

## Creating Multi-Page Scenes Programmatically

We can create scenes with multiple pages using the engine API. The scene acts as a container for pages, and each page can hold any number of content blocks.

### Creating a Scene with Pages

We create a new scene using `engine.scene.create(sceneLayout:)` and specify the layout type. The layout type determines how pages are arranged in the viewport. After creating the scene, we look up the stack container with `engine.block.find(byType: .stack)` and append pages to it.

```swift highlight-multiPage-createScene
  // Create a scene with HorizontalStack layout
  try engine.scene.create(sceneLayout: .horizontalStack)

  // Get the stack container
  let stacks = try engine.block.find(byType: .stack)
  let stack = stacks[0]

  // Create the first page
  let firstPage = try engine.block.create(.page)
  try engine.block.setWidth(firstPage, value: 800)
  try engine.block.setHeight(firstPage, value: 600)
  try engine.block.appendChild(to: stack, child: firstPage)
```

The scene is created with a `.horizontalStack` layout, meaning pages are arranged side by side from left to right. We then create a page, set its dimensions, and append it to the stack container.

### Configuring Page Spacing

We can add spacing between pages in a stack layout using the `stack/spacing` property. This creates visual separation between pages.

```swift highlight-multiPage-stackSpacing
// Add spacing between pages (20 pixels in screen space)
try engine.block.setFloat(stack, property: "stack/spacing", value: 20)
try engine.block.setBool(stack, property: "stack/spacingInScreenspace", value: true)
```

Setting `stack/spacingInScreenspace` to `true` means the spacing value is interpreted as screen pixels, maintaining consistent visual spacing regardless of zoom level.

The distinction applies to the canvas preview only. Exports always interpret the spacing in design units, whatever the property is set to.

Switching the property never converts the number. A spacing of `40` stays `40` and is reinterpreted in the other space, which changes how far apart the pages appear.

### Adding More Pages

To add additional pages, we create new page blocks, set their dimensions, and append them to the stack container.

```swift highlight-multiPage-addPage
  // Create a second page with different content
  let secondPage = try engine.block.create(.page)
  try engine.block.setWidth(secondPage, value: 800)
  try engine.block.setHeight(secondPage, value: 600)
  try engine.block.appendChild(to: stack, child: secondPage)

  // Add a different image to the second page
  let imageBlock2 = try engine.block.create(.graphic)
  let rectShape2 = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock2, shape: rectShape2)
  try engine.block.setWidth(imageBlock2, value: 300)
  try engine.block.setHeight(imageBlock2, value: 200)
  try engine.block.setPositionX(imageBlock2, value: 250)
  try engine.block.setPositionY(imageBlock2, value: 200)
  let imageFill2 = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill2,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
  )
  try engine.block.setFill(imageBlock2, fill: imageFill2)
  try engine.block.appendChild(to: secondPage, child: imageBlock2)
```

Each page can contain different content. Here we add different images to each page to demonstrate independent page content.

## Scene Layout Types

CE.SDK supports different layout modes that control how pages are arranged on the canvas. You specify the layout type when creating the scene with `engine.scene.create(sceneLayout:)`.

**Free Layout** (`.free`) is the default where pages can be positioned anywhere on the canvas. This provides complete control over page placement.

**VerticalStack Layout** (`.verticalStack`) arranges pages automatically in a vertical stack from top to bottom. This is useful for scroll-based document previews.

**HorizontalStack Layout** (`.horizontalStack`) arranges pages side by side from left to right. This is useful for carousel-style presentations or side-by-side comparisons.

## Setting the Zoom Level

We can focus the viewport on a specific page using `engine.scene.enableZoomAutoFit(_:axis:)`. This keeps the target page fitted to the viewport as the scene changes.

```swift highlight-multiPage-zoom
try engine.block.select(firstPage)
try engine.scene.enableZoomAutoFit(firstPage, axis: .both)
```

## Troubleshooting

**Page not visible after creation**: Ensure the page is attached to the stack with `appendChild(to:child:)` and has valid dimensions set with `setWidth(_:value:)` and `setHeight(_:value:)`.

**Cannot add content to page**: Verify you're appending blocks to the page block, not the scene directly. Content blocks should be children of pages.

**Pages overlapping**: When using stack layouts, make sure pages are appended to the stack container (found via `find(byType: .stack)`), not directly to the scene.

**Spacing not visible**: Check that `stack/spacing` is set to a positive value and that you're using a stack layout (`.horizontalStack` or `.verticalStack`).



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
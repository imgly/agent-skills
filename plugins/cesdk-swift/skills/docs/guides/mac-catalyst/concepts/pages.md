> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Pages](./pages.md)

---

```swift file=@cesdk_swift_examples/engine-guides-concepts-pages/Pages.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func pages(engine: Engine) async throws {
  // Create a scene with VerticalStack layout for multi-page designs
  let scene = try engine.scene.create(sceneLayout: .verticalStack)

  // Configure spacing between pages
  let stacks = try engine.block.find(byType: .stack)
  let stack = stacks[0]
  try engine.block.setFloat(stack, property: "stack/spacing", value: 20)
  try engine.block.setBool(stack, property: "stack/spacingInScreenspace", value: true)

  // Set page dimensions at the scene level (all pages share these dimensions)
  try engine.block.setFloat(scene, property: "scene/pageDimensions/width", value: 800)
  try engine.block.setFloat(scene, property: "scene/pageDimensions/height", value: 600)

  // Create the first page and set its dimensions
  let firstPage = try engine.block.create(.page)
  try engine.block.setWidth(firstPage, value: 800)
  try engine.block.setHeight(firstPage, value: 600)
  try engine.block.appendChild(to: stack, child: firstPage)

  // Create the second page with the same dimensions
  let secondPage = try engine.block.create(.page)
  try engine.block.setWidth(secondPage, value: 800)
  try engine.block.setHeight(secondPage, value: 600)
  try engine.block.appendChild(to: stack, child: secondPage)

  // Resolve sample assets against the bundled assets base URL.
  let baseURL = try engine.guidesBaseURL

  // Add an image block to the first page
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.appendChild(to: firstPage, child: imageBlock)

  // Create a rect shape for the graphic block
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock, shape: rectShape)

  // Configure size and position after appending to the page
  try engine.block.setWidth(imageBlock, value: 400)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.setPositionX(imageBlock, value: 200)
  try engine.block.setPositionY(imageBlock, value: 150)

  // Create and configure the image fill
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)

  // Add a text block to the second page
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: secondPage, child: textBlock)

  // Configure text properties
  try engine.block.replaceText(textBlock, text: "Page 2")
  try engine.block.setTextFontSize(textBlock, fontSize: 48)
  try engine.block.setTextColor(textBlock, color: .rgba(r: 0.2, g: 0.2, b: 0.2, a: 1.0))
  try engine.block.setEnum(textBlock, property: "text/horizontalAlignment", value: "Center")
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)

  // Enable and set margins for print bleed on the first page
  try engine.block.setBool(firstPage, property: "page/marginEnabled", value: true)
  try engine.block.setFloat(firstPage, property: "page/margin/top", value: 10)
  try engine.block.setFloat(firstPage, property: "page/margin/bottom", value: 10)
  try engine.block.setFloat(firstPage, property: "page/margin/left", value: 10)
  try engine.block.setFloat(firstPage, property: "page/margin/right", value: 10)

  // Set custom title templates for each page
  try engine.block.setString(firstPage, property: "page/titleTemplate", value: "Cover")
  try engine.block.setString(secondPage, property: "page/titleTemplate", value: "Content")

  // Set a background fill on the second page
  let colorFill = try engine.block.createFill(.color)
  try engine.block.setColor(colorFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.95, b: 1.0, a: 1.0))
  try engine.block.setFill(secondPage, fill: colorFill)

  // Get all pages in sorted order
  let allPages = try engine.scene.getPages()
  print("All pages:", allPages)
  print("Number of pages:", allPages.count)

  // Get the current page (nearest to viewport center or containing selection)
  let currentPage = try engine.scene.getCurrentPage()
  print("Current page:", currentPage as Any)

  // Find pages using the block API
  let pagesByType = try engine.block.find(byType: .page)
  print("Pages found by type:", pagesByType)
}
```

Pages define the format of your designs — every graphic block, text element, and media file lives inside a page. This guide covers how pages fit into the scene hierarchy, their properties like margins and title templates, and how to configure page dimensions for different layout modes.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-concepts-pages)

Pages provide the canvas and frame for your designs. Whether you're building a multi-page document, a social media carousel, or a video composition, understanding how pages work helps you structure content correctly.

This guide covers:

- Understanding the scene hierarchy: Scene → Pages → Blocks
- Creating and managing multiple pages
- Setting page dimensions at the scene level
- Configuring page properties like margins and title templates
- Navigating between pages programmatically

## Pages in the Scene Hierarchy

In CE.SDK, content follows a strict hierarchy: a **scene** contains **pages**, and pages contain **content blocks**. Only blocks attached to a page are rendered on the canvas.

```swift highlight-pages-createScene
  // Create a scene with VerticalStack layout for multi-page designs
  let scene = try engine.scene.create(sceneLayout: .verticalStack)

  // Configure spacing between pages
  let stacks = try engine.block.find(byType: .stack)
  let stack = stacks[0]
  try engine.block.setFloat(stack, property: "stack/spacing", value: 20)
  try engine.block.setBool(stack, property: "stack/spacingInScreenspace", value: true)
```

When you create a scene with a layout mode like `verticalStack`, pages are automatically arranged according to that mode. Create pages using `engine.block.create(.page)`, set their dimensions with `setWidth()` and `setHeight()`, then attach them to the scene's stack container with `engine.block.appendChild(to:child:)`.

```swift highlight-pages-createPages
  // Create the first page and set its dimensions
  let firstPage = try engine.block.create(.page)
  try engine.block.setWidth(firstPage, value: 800)
  try engine.block.setHeight(firstPage, value: 600)
  try engine.block.appendChild(to: stack, child: firstPage)

  // Create the second page with the same dimensions
  let secondPage = try engine.block.create(.page)
  try engine.block.setWidth(secondPage, value: 800)
  try engine.block.setHeight(secondPage, value: 600)
  try engine.block.appendChild(to: stack, child: secondPage)
```

Content blocks must be added as children of a page to render. For graphic blocks, set both a shape and a fill for content to display. Append blocks to the page before configuring their properties.

```swift highlight-pages-addContent
  // Add an image block to the first page
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.appendChild(to: firstPage, child: imageBlock)

  // Create a rect shape for the graphic block
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock, shape: rectShape)

  // Configure size and position after appending to the page
  try engine.block.setWidth(imageBlock, value: 400)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.setPositionX(imageBlock, value: 200)
  try engine.block.setPositionY(imageBlock, value: 150)

  // Create and configure the image fill
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)

  // Add a text block to the second page
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: secondPage, child: textBlock)

  // Configure text properties
  try engine.block.replaceText(textBlock, text: "Page 2")
  try engine.block.setTextFontSize(textBlock, fontSize: 48)
  try engine.block.setTextColor(textBlock, color: .rgba(r: 0.2, g: 0.2, b: 0.2, a: 1.0))
  try engine.block.setEnum(textBlock, property: "text/horizontalAlignment", value: "Center")
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)
```

## Page Dimensions and Consistency

The CE.SDK engine supports pages with different dimensions. When using stacked layout modes (`verticalStack`, `horizontalStack`), the Editor UI expects all pages to share the same size. With the `free` layout mode, you can set different dimensions for each page in the UI.

```swift highlight-pages-setDimensions
// Set page dimensions at the scene level (all pages share these dimensions)
try engine.block.setFloat(scene, property: "scene/pageDimensions/width", value: 800)
try engine.block.setFloat(scene, property: "scene/pageDimensions/height", value: 600)
```

Set default page dimensions at the scene level using `engine.block.setFloat(_:property:value:)` with `scene/pageDimensions/width` and `scene/pageDimensions/height`. The `scene/aspectRatioLock` property controls whether changing one dimension automatically adjusts the other. Individual pages can also have their dimensions set directly with `setWidth()` and `setHeight()`.

## Finding and Navigating Pages

CE.SDK provides several methods to locate and navigate between pages in your scene.

```swift highlight-pages-findPages
  // Get all pages in sorted order
  let allPages = try engine.scene.getPages()
  print("All pages:", allPages)
  print("Number of pages:", allPages.count)

  // Get the current page (nearest to viewport center or containing selection)
  let currentPage = try engine.scene.getCurrentPage()
  print("Current page:", currentPage as Any)

  // Find pages using the block API
  let pagesByType = try engine.block.find(byType: .page)
  print("Pages found by type:", pagesByType)
```

Use these methods based on your needs:

- `engine.scene.getPages()` returns all pages in sorted order
- `engine.scene.getCurrentPage()` returns the page containing the current selection, or the page nearest to the viewport center
- `engine.block.find(byType: .page)` finds all page blocks in the scene

## Page Properties

Each page has its own properties that control its appearance and behavior. These are set on the page block itself, not on the scene.

### Margins

Page margins define bleed areas useful for print designs. Enable margins and configure each side individually:

```swift highlight-pages-pageMargins
// Enable and set margins for print bleed on the first page
try engine.block.setBool(firstPage, property: "page/marginEnabled", value: true)
try engine.block.setFloat(firstPage, property: "page/margin/top", value: 10)
try engine.block.setFloat(firstPage, property: "page/margin/bottom", value: 10)
try engine.block.setFloat(firstPage, property: "page/margin/left", value: 10)
try engine.block.setFloat(firstPage, property: "page/margin/right", value: 10)
```

Set `page/marginEnabled` to `true` to enable margins, then use `page/margin/top`, `page/margin/bottom`, `page/margin/left`, and `page/margin/right` to configure each side.

### Title Template

The `page/titleTemplate` property defines the display label shown for each page. It supports template variables like `{{ubq.page_index}}` for dynamic numbering.

```swift highlight-pages-titleTemplate
// Set custom title templates for each page
try engine.block.setString(firstPage, property: "page/titleTemplate", value: "Cover")
try engine.block.setString(secondPage, property: "page/titleTemplate", value: "Content")
```

The default value is `"Page {{ubq.page_index}}"`. Customize this to show labels like "Slide 1", "Cover", or any custom text.

### Fill and Background

Pages support fills for background colors or images using the standard fill system.

```swift highlight-pages-pageBackground
// Set a background fill on the second page
let colorFill = try engine.block.createFill(.color)
try engine.block.setColor(colorFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.95, b: 1.0, a: 1.0))
try engine.block.setFill(secondPage, fill: colorFill)
```

Create a fill using `engine.block.createFill(.color)` or `engine.block.createFill(.image)`, configure its properties, then apply it to the page with `engine.block.setFill(_:fill:)`.

## Page Layout Modes

The scene's layout mode controls how multiple pages are arranged. Set this when creating the scene with `engine.scene.create(sceneLayout:)` or update it with `engine.scene.setLayout()`:

| Layout | Description |
|--------|-------------|
| `.verticalStack` | Pages stack vertically, one below the other (default for design) |
| `.horizontalStack` | Pages arrange horizontally, side by side |
| `.depthStack` | Pages overlay each other, typically used in video mode |
| `.free` | Pages can be positioned freely without automatic arrangement |

## Next Steps

- [Scenes](./scenes.md) — Learn about scene structure and management
- [Blocks](./blocks.md) — Understand the building blocks that live inside pages



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
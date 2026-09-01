> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Blocks](./blocks.md)

---

```swift file=@cesdk_swift_examples/engine-guides-concepts-blocks/ConceptsBlocks.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func conceptsBlocks(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)

  let baseURL = try engine.guidesBaseURL

  // Find the page block - pages contain all design elements
  let pages = try engine.block.find(byType: .page)
  let firstPage = pages[0]

  // Query the block type - returns the full type path
  let pageType = try engine.block.getType(firstPage)
  print("Page block type:", pageType) // '//ly.img.ubq/page'

  // Type is immutable, determined at creation
  // Kind is a custom label you can set and change
  try engine.block.setKind(firstPage, kind: "main-canvas")
  let pageKind = try engine.block.getKind(firstPage)
  print("Page kind:", pageKind) // 'main-canvas'

  // Find blocks by kind
  let mainCanvasBlocks = try engine.block.find(byKind: "main-canvas")
  print("Blocks with kind 'main-canvas':", mainCanvasBlocks.count)

  // Create a graphic block for an image
  let graphic = try engine.block.create(.graphic)

  // Duplicate creates a copy with a new UUID
  let graphicCopy = try engine.block.duplicate(graphic)

  // Destroy removes a block - the duplicate is no longer needed
  try engine.block.destroy(graphicCopy)

  // Check if a block ID is still valid after operations
  let isOriginalValid = engine.block.isValid(graphic)
  let isCopyValid = engine.block.isValid(graphicCopy)
  print("Original valid:", isOriginalValid) // true
  print("Copy valid after destroy:", isCopyValid) // false

  // Create a rect shape to define the graphic's bounds
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(graphic, shape: rectShape)

  // Position and size the graphic
  try engine.block.setPositionX(graphic, value: 200)
  try engine.block.setPositionY(graphic, value: 100)
  try engine.block.setWidth(graphic, value: 400)
  try engine.block.setHeight(graphic, value: 300)

  // Create an image fill and attach it to the graphic
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(graphic, fill: imageFill)

  // Set content fill mode so the image fills the block bounds
  try engine.block.setEnum(graphic, property: "contentFill/mode", value: "Cover")

  // Blocks form a tree: scene > page > elements
  // Append the graphic to the page to make it visible
  try engine.block.appendChild(to: page, child: graphic)

  // Query parent-child relationships
  let graphicParent = try engine.block.getParent(graphic)
  print("Graphic parent is page:", graphicParent == page) // true

  let pageChildren = try engine.block.getChildren(page)
  print("Page has children:", pageChildren.count)

  // Create a text block with content
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: textBlock)

  // Position the text block
  try engine.block.setPositionX(textBlock, value: 200)
  try engine.block.setPositionY(textBlock, value: 450)
  try engine.block.setWidth(textBlock, value: 400)
  try engine.block.setHeight(textBlock, value: 80)

  // Set text content and styling
  try engine.block.setString(textBlock, property: "text/text", value: "Blocks are the building units of CE.SDK designs")
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 24)
  try engine.block.setEnum(textBlock, property: "text/horizontalAlignment", value: "Center")

  // Check the text block type
  let textType = try engine.block.getType(textBlock)
  print("Text block type:", textType) // '//ly.img.ubq/text'

  // Use reflection to discover available properties
  let graphicProperties = try engine.block.findAllProperties(graphic)
  print("Graphic block has", graphicProperties.count, "properties")

  // Get property type information
  let opacityType = try engine.block.getType(ofProperty: "opacity")
  print("Opacity property type:", opacityType) // .float

  // Check if properties are readable/writable
  let isOpacityReadable = try engine.block.isPropertyReadable(property: "opacity")
  let isOpacityWritable = try engine.block.isPropertyWritable(property: "opacity")
  print("Opacity readable:", isOpacityReadable, "writable:", isOpacityWritable)

  // Use type-specific getters and setters
  // Float properties
  try engine.block.setFloat(graphic, property: "opacity", value: 0.9)
  let opacity = try engine.block.getFloat(graphic, property: "opacity")
  print("Graphic opacity:", opacity)

  // Bool properties
  try engine.block.setBool(page, property: "page/marginEnabled", value: false)
  let marginEnabled = try engine.block.getBool(page, property: "page/marginEnabled")
  print("Page margin enabled:", marginEnabled)

  // Enum properties - get allowed values first
  let blendModes = try engine.block.getEnumValues(ofProperty: "blend/mode")
  print("Available blend modes:", blendModes.prefix(3).joined(separator: ", "), "...")

  try engine.block.setEnum(graphic, property: "blend/mode", value: "Multiply")
  let blendMode = try engine.block.getEnum(graphic, property: "blend/mode")
  print("Graphic blend mode:", blendMode)

  // Each block has a stable UUID across save/load cycles
  let graphicUUID = try engine.block.getUUID(graphic)
  print("Graphic UUID:", graphicUUID)

  // Block names are mutable labels for organization
  try engine.block.setName(graphic, name: "Hero Image")
  try engine.block.setName(textBlock, name: "Caption")

  let graphicName = try engine.block.getName(graphic)
  print("Graphic name:", graphicName) // 'Hero Image'

  // Select a block programmatically
  try engine.block.select(graphic) // Selects graphic, deselects others

  // Check selection state
  let isGraphicSelected = try engine.block.isSelected(graphic)
  print("Graphic is selected:", isGraphicSelected) // true

  // Add to selection without deselecting others
  try engine.block.setSelected(textBlock, selected: true)

  // Get all selected blocks
  let selectedBlocks = engine.block.findAllSelected()
  print("Selected blocks count:", selectedBlocks.count) // 2

  // Subscribe to selection changes
  let selectionTask = Task {
    for await _ in engine.block.onSelectionChanged {
      let selected = engine.block.findAllSelected()
      print("Selection changed, now selected:", selected.count, "blocks")
    }
  }

  // Control block visibility
  try engine.block.setVisible(graphic, visible: true)
  let isVisible = try engine.block.isVisible(graphic)
  print("Graphic is visible:", isVisible)

  // Control export inclusion
  try engine.block.setIncludedInExport(graphic, enabled: true)
  let inExport = try engine.block.isIncludedInExport(graphic)
  print("Graphic included in export:", inExport)

  // Control clipping behavior
  try engine.block.setClipped(graphic, clipped: false)
  let isClipped = try engine.block.isClipped(graphic)
  print("Graphic is clipped:", isClipped)

  // Query block state - indicates loading status
  let graphicState = try engine.block.getState(graphic)
  print("Graphic state:", graphicState)

  // Subscribe to state changes (useful for loading indicators)
  let stateTask = Task {
    for await changedBlocks in engine.block.onStateChanged([graphic]) {
      for blockID in changedBlocks {
        let state = try engine.block.getState(blockID)
        print("Block \(blockID) state changed to:", state)
      }
    }
  }

  // Save blocks to a string for persistence
  let savedString = try await engine.block.saveToString(blocks: [graphic, textBlock])
  print("Blocks saved to string, length:", savedString.count)

  // Load blocks from string (creates new blocks, not attached to scene)
  let loadedBlocks = try await engine.block.load(from: savedString)
  print("Loaded blocks from string:", loadedBlocks.count)

  // Loaded blocks must be parented to appear in the scene
  // For demo purposes, destroy them to avoid duplicates
  for loadedBlock in loadedBlocks {
    try engine.block.destroy(loadedBlock)
  }

  // Clean up async subscriptions
  selectionTask.cancel()
  stateTask.cancel()
}
```

Work with blocks—the fundamental building units for all visual elements in
CE.SDK designs.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-concepts-blocks)

Every visual element in CE.SDK—images, text, shapes, and audio—is represented as a block. Blocks are organized in a tree structure within scenes and pages, where parent-child relationships determine rendering order and visibility. Each block has properties you can read and modify, a `Type` that defines its core behavior, and an optional `Kind` for custom categorization.

This guide covers block types and their uses, how to create and manage blocks programmatically, how to work with block properties using the reflection system, and how to handle selection, visibility, and state changes.

## Block Types

CE.SDK provides several block types, each designed for specific content:

- **graphic** (`//ly.img.ubq/graphic`): Visual blocks for images, shapes, and graphics
- **text** (`//ly.img.ubq/text`): Text content with typography controls
- **audio** (`//ly.img.ubq/audio`): Audio content for video scenes
- **page** (`//ly.img.ubq/page`): Container blocks representing canvases or artboards
- **cutout** (`//ly.img.ubq/cutout`): Blocks for masking operations

Query a block's type using `getType()` and find blocks of a specific type with `find(byType:)`:

```swift highlight-block-types
  // Find the page block - pages contain all design elements
  let pages = try engine.block.find(byType: .page)
  let firstPage = pages[0]

  // Query the block type - returns the full type path
  let pageType = try engine.block.getType(firstPage)
  print("Page block type:", pageType) // '//ly.img.ubq/page'
```

Block types are immutable—once created, a block's type cannot change. This distinguishes type from kind.

## Type vs Kind

Type and kind serve different purposes. The **type** is determined at creation and defines core behavior. The **kind** is a custom string label you assign for application-specific categorization.

```swift highlight-type-vs-kind
  // Type is immutable, determined at creation
  // Kind is a custom label you can set and change
  try engine.block.setKind(firstPage, kind: "main-canvas")
  let pageKind = try engine.block.getKind(firstPage)
  print("Page kind:", pageKind) // 'main-canvas'

  // Find blocks by kind
  let mainCanvasBlocks = try engine.block.find(byKind: "main-canvas")
  print("Blocks with kind 'main-canvas':", mainCanvasBlocks.count)
```

Use kind to tag blocks for your application's logic. Set it with `setKind()`, query it with `getKind()`, and find blocks by kind with `find(byKind:)`.

## Block Hierarchy

Blocks form a tree structure where scenes contain pages, and pages contain design elements.

```swift highlight-block-hierarchy
  // Blocks form a tree: scene > page > elements
  // Append the graphic to the page to make it visible
  try engine.block.appendChild(to: page, child: graphic)

  // Query parent-child relationships
  let graphicParent = try engine.block.getParent(graphic)
  print("Graphic parent is page:", graphicParent == page) // true

  let pageChildren = try engine.block.getChildren(page)
  print("Page has children:", pageChildren.count)
```

Only blocks that are direct or indirect children of a page block are rendered. A scene without any page children won't display content in the editor. Use `appendChild(to:child:)` to add blocks to parents, `getParent()` to query a block's parent, and `getChildren()` to get a block's children.

## Block Lifecycle

Create new blocks with `create()`, duplicate existing blocks with `duplicate()`, and remove blocks with `destroy()`. After destroying a block, `isValid()` returns `false` for that block ID.

```swift highlight-block-lifecycle
  // Create a graphic block for an image
  let graphic = try engine.block.create(.graphic)

  // Duplicate creates a copy with a new UUID
  let graphicCopy = try engine.block.duplicate(graphic)

  // Destroy removes a block - the duplicate is no longer needed
  try engine.block.destroy(graphicCopy)

  // Check if a block ID is still valid after operations
  let isOriginalValid = engine.block.isValid(graphic)
  let isCopyValid = engine.block.isValid(graphicCopy)
  print("Original valid:", isOriginalValid) // true
  print("Copy valid after destroy:", isCopyValid) // false
```

When duplicating a block, all children are included, and the duplicate receives a new UUID.

## Working with Fills

Graphic blocks display content through fills. Create a fill, attach it to a block, and configure its source.

```swift highlight-fill
  // Create a rect shape to define the graphic's bounds
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(graphic, shape: rectShape)

  // Position and size the graphic
  try engine.block.setPositionX(graphic, value: 200)
  try engine.block.setPositionY(graphic, value: 100)
  try engine.block.setWidth(graphic, value: 400)
  try engine.block.setHeight(graphic, value: 300)

  // Create an image fill and attach it to the graphic
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(graphic, fill: imageFill)

  // Set content fill mode so the image fills the block bounds
  try engine.block.setEnum(graphic, property: "contentFill/mode", value: "Cover")
```

CE.SDK supports several fill types including image, video, color, and gradient fills. See the [Fills guide](../fills/overview.md) for details on available fill types.

## Creating Text Blocks

Text blocks display formatted text content. Create a text block, position it, and set its content and styling.

```swift highlight-text-block
  // Create a text block with content
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: textBlock)

  // Position the text block
  try engine.block.setPositionX(textBlock, value: 200)
  try engine.block.setPositionY(textBlock, value: 450)
  try engine.block.setWidth(textBlock, value: 400)
  try engine.block.setHeight(textBlock, value: 80)

  // Set text content and styling
  try engine.block.setString(textBlock, property: "text/text", value: "Blocks are the building units of CE.SDK designs")
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 24)
  try engine.block.setEnum(textBlock, property: "text/horizontalAlignment", value: "Center")

  // Check the text block type
  let textType = try engine.block.getType(textBlock)
  print("Text block type:", textType) // '//ly.img.ubq/text'
```

Text blocks support extensive typography controls covered in the [Text guides](../text.md).

## Block Properties

The reflection system lets you discover and manipulate any block property dynamically. Use `findAllProperties()` to get all available properties for a block—they're prefixed by category like `shape/star/points` or `text/fontSize`.

```swift highlight-block-properties
  // Use reflection to discover available properties
  let graphicProperties = try engine.block.findAllProperties(graphic)
  print("Graphic block has", graphicProperties.count, "properties")

  // Get property type information
  let opacityType = try engine.block.getType(ofProperty: "opacity")
  print("Opacity property type:", opacityType) // .float

  // Check if properties are readable/writable
  let isOpacityReadable = try engine.block.isPropertyReadable(property: "opacity")
  let isOpacityWritable = try engine.block.isPropertyWritable(property: "opacity")
  print("Opacity readable:", isOpacityReadable, "writable:", isOpacityWritable)
```

Query property types with `getType(ofProperty:)`. Returns a `PropertyType` value such as `.bool`, `.int`, `.float`, `.double`, `.string`, `.color`, `.enum`, or `.struct`. For enum properties, use `getEnumValues(ofProperty:)` to get allowed values.

### Property Accessors

Use type-specific getters and setters matching the property type:

```swift highlight-property-accessors
  // Use type-specific getters and setters
  // Float properties
  try engine.block.setFloat(graphic, property: "opacity", value: 0.9)
  let opacity = try engine.block.getFloat(graphic, property: "opacity")
  print("Graphic opacity:", opacity)

  // Bool properties
  try engine.block.setBool(page, property: "page/marginEnabled", value: false)
  let marginEnabled = try engine.block.getBool(page, property: "page/marginEnabled")
  print("Page margin enabled:", marginEnabled)

  // Enum properties - get allowed values first
  let blendModes = try engine.block.getEnumValues(ofProperty: "blend/mode")
  print("Available blend modes:", blendModes.prefix(3).joined(separator: ", "), "...")

  try engine.block.setEnum(graphic, property: "blend/mode", value: "Multiply")
  let blendMode = try engine.block.getEnum(graphic, property: "blend/mode")
  print("Graphic blend mode:", blendMode)
```

Using the wrong accessor type for a property causes an error. Always check `getType(ofProperty:)` if you're unsure which accessor to use.

## UUID, Names, and Identity

Each block has a UUID that remains stable across save and load operations. Block names are mutable labels for organization.

```swift highlight-uuid-identity
  // Each block has a stable UUID across save/load cycles
  let graphicUUID = try engine.block.getUUID(graphic)
  print("Graphic UUID:", graphicUUID)

  // Block names are mutable labels for organization
  try engine.block.setName(graphic, name: "Hero Image")
  try engine.block.setName(textBlock, name: "Caption")

  let graphicName = try engine.block.getName(graphic)
  print("Graphic name:", graphicName) // 'Hero Image'
```

Use `getUUID()` when you need a persistent identifier for a block. Names are useful for user-facing labels and can be changed freely with `setName()`.

## Selection

Control which blocks are selected programmatically. Use `select()` to select a single block (deselecting others) or `setSelected()` to modify selection without affecting other blocks.

```swift highlight-selection
  // Select a block programmatically
  try engine.block.select(graphic) // Selects graphic, deselects others

  // Check selection state
  let isGraphicSelected = try engine.block.isSelected(graphic)
  print("Graphic is selected:", isGraphicSelected) // true

  // Add to selection without deselecting others
  try engine.block.setSelected(textBlock, selected: true)

  // Get all selected blocks
  let selectedBlocks = engine.block.findAllSelected()
  print("Selected blocks count:", selectedBlocks.count) // 2

  // Subscribe to selection changes
  let selectionTask = Task {
    for await _ in engine.block.onSelectionChanged {
      let selected = engine.block.findAllSelected()
      print("Selection changed, now selected:", selected.count, "blocks")
    }
  }
```

Subscribe to selection changes with `onSelectionChanged`, an `AsyncStream` you iterate over with `for await` to update your UI when the selection state changes.

## Visibility

Control whether blocks appear on the canvas and are included in exports.

```swift highlight-visibility
  // Control block visibility
  try engine.block.setVisible(graphic, visible: true)
  let isVisible = try engine.block.isVisible(graphic)
  print("Graphic is visible:", isVisible)

  // Control export inclusion
  try engine.block.setIncludedInExport(graphic, enabled: true)
  let inExport = try engine.block.isIncludedInExport(graphic)
  print("Graphic included in export:", inExport)
```

A block with `isVisible()` returning true may still not appear if it hasn't been added to a parent, the parent is hidden, or another block obscures it.

### Clipping

Clipping determines whether a block's content is constrained to its parent's bounds. When `setClipped(block, clipped: true)` is set, any portion of the block extending beyond its parent's boundaries is hidden. When clipping is disabled, the block renders fully even if it overflows its parent container.

```swift highlight-clipping
// Control clipping behavior
try engine.block.setClipped(graphic, clipped: false)
let isClipped = try engine.block.isClipped(graphic)
print("Graphic is clipped:", isClipped)
```

## Block State

Blocks track loading progress and error conditions through a state system with three possible states:

- **`.ready`**: Normal state, no pending operations
- **`.pending(progress:)`**: Operation in progress with a progress value (0–1)
- **`.error(_:)`**: Operation failed (`audioDecoding`, `imageDecoding`, `fileFetch`, `videoDecoding`, `unknown`)

```swift highlight-block-state
  // Query block state - indicates loading status
  let graphicState = try engine.block.getState(graphic)
  print("Graphic state:", graphicState)

  // Subscribe to state changes (useful for loading indicators)
  let stateTask = Task {
    for await changedBlocks in engine.block.onStateChanged([graphic]) {
      for blockID in changedBlocks {
        let state = try engine.block.getState(blockID)
        print("Block \(blockID) state changed to:", state)
      }
    }
  }
```

Subscribe to state changes with `onStateChanged()`, which returns an `AsyncStream` you iterate over to show loading indicators or handle errors in your UI.

## Serialization

Save blocks to strings for persistence and restore them later.

```swift highlight-serialization
  // Save blocks to a string for persistence
  let savedString = try await engine.block.saveToString(blocks: [graphic, textBlock])
  print("Blocks saved to string, length:", savedString.count)

  // Load blocks from string (creates new blocks, not attached to scene)
  let loadedBlocks = try await engine.block.load(from: savedString)
  print("Loaded blocks from string:", loadedBlocks.count)

  // Loaded blocks must be parented to appear in the scene
  // For demo purposes, destroy them to avoid duplicates
  for loadedBlock in loadedBlocks {
    try engine.block.destroy(loadedBlock)
  }
```

Use `saveToString(blocks:)` for lightweight serialization or `saveToArchive(blocks:)` to include all referenced assets.

Blocks can be loaded with `load(from: String)`, `loadArchive(from: URL)`, or `load(from: URL)`.
For `loadArchive(from:)`, the URL should point to the zipped archive file previously saved with `saveToArchive()`,
whereas for `load(from: URL)`, it should point to a blocks file within an unzipped archive directory.

Loaded blocks are not automatically attached to the scene—you must parent them with `appendChild(to:child:)` to make them visible.

## Troubleshooting

**Block not visible**: Ensure the block is a child of a page that's a child of the scene.

**Property setter fails**: Verify the property type matches the setter method used. Use `getType(ofProperty:)` to check.

**Block ID invalid after destroy**: Use `isValid()` before operations on potentially destroyed blocks.

**State stuck in Pending**: Check network connectivity for remote resources or use state change events to monitor progress.

## Next Steps

- [Scenes](./scenes.md) — Understand the root container that holds every block.
- [Pages](./pages.md) — Learn how pages group blocks into discrete canvases.
- [Events](./events.md) — Subscribe to block creation, update, and deletion.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
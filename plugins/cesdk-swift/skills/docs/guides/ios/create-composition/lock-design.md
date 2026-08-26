> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Lock Design](./lock-design.md)

---

Protect design elements from unwanted modifications using CE.SDK's scope-based permission system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-lock-design)

CE.SDK uses a two-layer scope system to control editing permissions. Global scopes set defaults for the entire scene, while block-level scopes override when the global setting is `.defer`. This enables flexible permission models from fully locked to selectively editable designs.

```swift file=@cesdk_swift_examples/engine-guides-lock-design/LockDesign.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func lockDesign(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  // Column 1: Fully Locked
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setPositionX(imageBlock, value: 30)
  try engine.block.setPositionY(imageBlock, value: 100)
  try engine.block.setWidth(imageBlock, value: 220)
  try engine.block.setHeight(imageBlock, value: 165)
  try engine.block.appendChild(to: page, child: imageBlock)

  // Column 2: Text Editing Only
  let textBlock = try engine.block.create(.text)
  try engine.block.setString(textBlock, property: "text/text", value: "Edit Me")
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 72)
  try engine.block.setPositionX(textBlock, value: 290)
  try engine.block.setPositionY(textBlock, value: 100)
  try engine.block.setWidth(textBlock, value: 220)
  try engine.block.setHeight(textBlock, value: 165)
  try engine.block.appendChild(to: page, child: textBlock)

  // Column 3: Image Replace Only
  let placeholderBlock = try engine.block.create(.graphic)
  try engine.block.setShape(placeholderBlock, shape: engine.block.createShape(.rect))
  let placeholderFill = try engine.block.createFill(.image)
  try engine.block.setURL(placeholderFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(placeholderBlock, fill: placeholderFill)
  try engine.block.setPositionX(placeholderBlock, value: 550)
  try engine.block.setPositionY(placeholderBlock, value: 100)
  try engine.block.setWidth(placeholderBlock, value: 220)
  try engine.block.setHeight(placeholderBlock, value: 165)
  try engine.block.appendChild(to: page, child: placeholderBlock)

  // Lock the entire design by setting all scopes to .deny
  let scopes = try engine.editor.findAllScopes()
  for scope in scopes {
    try engine.editor.setGlobalScope(key: scope, value: .deny)
  }

  // Enable selection for specific blocks
  try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
  try engine.block.setScopeEnabled(textBlock, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(placeholderBlock, key: "editor/select", enabled: true)

  // Enable text editing on the text block
  try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
  try engine.editor.setGlobalScope(key: "text/character", value: .defer)
  try engine.block.setScopeEnabled(textBlock, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(textBlock, key: "text/character", enabled: true)

  // Enable image replacement on the placeholder block
  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
  try engine.block.setScopeEnabled(placeholderBlock, key: "fill/change", enabled: true)

  // Check if operations are permitted on blocks
  let canEditText = try engine.block.isAllowedByScope(textBlock, key: "text/edit")
  let canMoveImage = try engine.block.isAllowedByScope(imageBlock, key: "layer/move")
  let canReplacePlaceholder = try engine.block.isAllowedByScope(placeholderBlock, key: "fill/change")

  print("Permission status:")
  print("- Can edit text:", canEditText) // true
  print("- Can move locked image:", canMoveImage) // false
  print("- Can replace placeholder:", canReplacePlaceholder) // true

  // Discover all available scopes
  let allScopes = try engine.editor.findAllScopes()
  print("Available scopes:", allScopes)

  // Check global scope settings
  let textEditGlobal = try engine.editor.getGlobalScope(key: "text/edit")
  let layerMoveGlobal = try engine.editor.getGlobalScope(key: "layer/move")
  print("Global text/edit:", textEditGlobal) // .defer
  print("Global layer/move:", layerMoveGlobal) // .deny

  // Check block-level scope settings
  let textEditEnabled = try engine.block.isScopeEnabled(textBlock, key: "text/edit")
  print("Text block text/edit enabled:", textEditEnabled) // true

  // Select the text block to demonstrate editability
  try engine.block.select(textBlock)
}
```

This guide covers how to lock entire designs, selectively enable specific editing capabilities, and check permissions programmatically.

## Understanding the Scope Permission Model

Scopes control what operations users can perform on design elements. CE.SDK combines global scope settings with block-level settings to determine the final permission.

| Global Scope | Block Scope | Result    |
| ------------ | ----------- | --------- |
| `.allow`     | any         | Permitted |
| `.deny`      | any         | Blocked   |
| `.defer`     | enabled     | Permitted |
| `.defer`     | disabled    | Blocked   |

Global scopes have three possible values:

- **`.allow`**: The operation is always permitted, regardless of block-level settings
- **`.deny`**: The operation is always blocked, regardless of block-level settings
- **`.defer`**: The permission depends on the block-level scope setting

Block-level scopes are binary: enabled or disabled. They only take effect when the global scope is set to `.defer`.

## Locking an Entire Design

To lock all editing operations, iterate through all available scopes and set each to `.deny`. We use `engine.editor.findAllScopes()` to discover all scope names dynamically.

```swift highlight-lockDesign-lockEntireDesign
// Lock the entire design by setting all scopes to .deny
let scopes = try engine.editor.findAllScopes()
for scope in scopes {
  try engine.editor.setGlobalScope(key: scope, value: .deny)
}
```

When all scopes are set to `.deny`, users cannot modify any aspect of the design. This includes selecting, moving, editing text, or changing any visual properties.

## Enabling Selection for Interactive Blocks

Before users can interact with any block, you must enable the `editor/select` scope. Without selection, users cannot click on or access any blocks, even if other editing capabilities are enabled.

```swift highlight-lockDesign-enableSelection
// Enable selection for specific blocks
try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
try engine.block.setScopeEnabled(textBlock, key: "editor/select", enabled: true)
try engine.block.setScopeEnabled(placeholderBlock, key: "editor/select", enabled: true)
```

Setting the global `editor/select` scope to `.defer` delegates the decision to each block. We then enable selection only on the specific blocks users should be able to interact with.

## Selective Locking Patterns

Lock everything first, then selectively enable specific capabilities on chosen blocks. This pattern provides fine-grained control over what users can modify.

### Text-Only Editing

To allow users to edit text content while protecting everything else, enable the `text/edit` scope. For text styling changes like font, size, and color, also enable `text/character`.

```swift highlight-lockDesign-textEditing
// Enable text editing on the text block
try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
try engine.editor.setGlobalScope(key: "text/character", value: .defer)
try engine.block.setScopeEnabled(textBlock, key: "text/edit", enabled: true)
try engine.block.setScopeEnabled(textBlock, key: "text/character", enabled: true)
```

Users can now type new text content in the designated text block but cannot move, resize, or delete it.

### Image Replacement

To allow users to swap images while protecting layout and position, enable the `fill/change` scope on placeholder blocks.

```swift highlight-lockDesign-imageReplacement
// Enable image replacement on the placeholder block
try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
try engine.block.setScopeEnabled(placeholderBlock, key: "fill/change", enabled: true)
```

Users can replace the image content but the block's position, dimensions, and other properties remain locked.

## Checking Permissions

Verify whether operations are permitted using `engine.block.isAllowedByScope(_:key:)`. This method evaluates both global and block-level settings to return the effective permission state.

```swift highlight-lockDesign-checkPermissions
  // Check if operations are permitted on blocks
  let canEditText = try engine.block.isAllowedByScope(textBlock, key: "text/edit")
  let canMoveImage = try engine.block.isAllowedByScope(imageBlock, key: "layer/move")
  let canReplacePlaceholder = try engine.block.isAllowedByScope(placeholderBlock, key: "fill/change")

  print("Permission status:")
  print("- Can edit text:", canEditText) // true
  print("- Can move locked image:", canMoveImage) // false
  print("- Can replace placeholder:", canReplacePlaceholder) // true
```

The distinction between checking methods is:

- `isAllowedByScope(_:key:)` returns the **effective permission** after evaluating all scope levels
- `isScopeEnabled(_:key:)` returns only the **block-level setting**
- `getGlobalScope(key:)` returns only the **global setting**

## Discovering Available Scopes

To work with scopes programmatically, you can discover all available scope names and check their current settings.

```swift highlight-lockDesign-getScopes
  // Discover all available scopes
  let allScopes = try engine.editor.findAllScopes()
  print("Available scopes:", allScopes)

  // Check global scope settings
  let textEditGlobal = try engine.editor.getGlobalScope(key: "text/edit")
  let layerMoveGlobal = try engine.editor.getGlobalScope(key: "layer/move")
  print("Global text/edit:", textEditGlobal) // .defer
  print("Global layer/move:", layerMoveGlobal) // .deny

  // Check block-level scope settings
  let textEditEnabled = try engine.block.isScopeEnabled(textBlock, key: "text/edit")
  print("Text block text/edit enabled:", textEditEnabled) // true
```

## Available Scopes Reference

| Scope                    | Description                             |
| ------------------------ | --------------------------------------- |
| `layer/move`             | Move block position                     |
| `layer/resize`           | Resize block dimensions                 |
| `layer/rotate`           | Rotate block                            |
| `layer/flip`             | Flip block horizontally or vertically   |
| `layer/crop`             | Crop block content                      |
| `layer/opacity`          | Change block opacity                    |
| `layer/blendMode`        | Change blend mode                       |
| `layer/visibility`       | Toggle block visibility                 |
| `layer/clipping`         | Change clipping behavior                |
| `fill/change`            | Change fill content                     |
| `fill/changeType`        | Change fill type                        |
| `stroke/change`          | Change stroke properties                |
| `shape/change`           | Change shape type                       |
| `text/edit`              | Edit text content                       |
| `text/character`         | Change text styling (font, size, color) |
| `appearance/adjustments` | Change color adjustments                |
| `appearance/filter`      | Apply or change filters                 |
| `appearance/effect`      | Apply or change effects                 |
| `appearance/blur`        | Apply or change blur                    |
| `appearance/shadow`      | Apply or change shadows                 |
| `appearance/animation`   | Apply or change animations              |
| `lifecycle/destroy`      | Delete the block                        |
| `lifecycle/duplicate`    | Duplicate the block                     |
| `editor/add`             | Add new blocks                          |
| `editor/select`          | Select blocks                           |

## Next Steps

- [Lock Templates](../create-templates/lock.md) - Lock templates for consistent reuse
- [Lock Content](../rules/lock-content.md) — Lock content using the rules system
- [Rules Overview](../rules/overview.md) - Understand the broader rules system



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
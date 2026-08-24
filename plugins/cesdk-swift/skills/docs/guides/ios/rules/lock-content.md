> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Lock Content](./lock-content.md)

---

```swift file=@cesdk_swift_examples/engine-guides-lock-content/LockContent.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func lockContent(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let sampleImage1 = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  let sampleImage2 = baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg")

  // Build a sample scene with four blocks, each demonstrating a different
  // locking outcome. This setup runs before any scope is locked, so every
  // creation call succeeds.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1200)
  try engine.block.setHeight(page, value: 800)
  try engine.block.appendChild(to: scene, child: page)

  // Top-left: an image that stays fully locked.
  let lockedImage = try engine.block.create(.graphic)
  try engine.block.setShape(lockedImage, shape: engine.block.createShape(.rect))
  let lockedFill = try engine.block.createFill(.image)
  try engine.block.setURL(lockedFill, property: "fill/image/imageFileURI", value: sampleImage1)
  try engine.block.setFill(lockedImage, fill: lockedFill)
  try engine.block.setPositionX(lockedImage, value: 185)
  try engine.block.setPositionY(lockedImage, value: 70)
  try engine.block.setWidth(lockedImage, value: 300)
  try engine.block.setHeight(lockedImage, value: 200)
  try engine.block.setName(lockedImage, name: "Locked Image")
  try engine.block.appendChild(to: page, child: lockedImage)

  // Top-right: a text block that allows text editing only.
  let editableText = try engine.block.create(.text)
  try engine.block.setString(editableText, property: "text/text", value: "Edit me!")
  try engine.block.setFloat(editableText, property: "text/fontSize", value: 90)
  try engine.block.setPositionX(editableText, value: 565)
  try engine.block.setPositionY(editableText, value: 70)
  try engine.block.setWidth(editableText, value: 450)
  try engine.block.setHeight(editableText, value: 200)
  try engine.block.setName(editableText, name: "Editable Text")
  try engine.block.appendChild(to: page, child: editableText)

  // Bottom-left: an image that allows replacement only.
  let replaceableImage = try engine.block.create(.graphic)
  try engine.block.setShape(replaceableImage, shape: engine.block.createShape(.rect))
  let replaceableFill = try engine.block.createFill(.image)
  try engine.block.setURL(replaceableFill, property: "fill/image/imageFileURI", value: sampleImage2)
  try engine.block.setFill(replaceableImage, fill: replaceableFill)
  try engine.block.setPositionX(replaceableImage, value: 185)
  try engine.block.setPositionY(replaceableImage, value: 380)
  try engine.block.setWidth(replaceableImage, value: 300)
  try engine.block.setHeight(replaceableImage, value: 200)
  try engine.block.setName(replaceableImage, name: "Replaceable Image")
  try engine.block.appendChild(to: page, child: replaceableImage)

  // Bottom-right: a shape that allows moving and resizing only.
  let movableShape = try engine.block.create(.graphic)
  try engine.block.setShape(movableShape, shape: engine.block.createShape(.rect))
  let shapeFill = try engine.block.createFill(.color)
  try engine.block.setColor(shapeFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.6, b: 0.9, a: 1.0))
  try engine.block.setFill(movableShape, fill: shapeFill)
  try engine.block.setPositionX(movableShape, value: 565)
  try engine.block.setPositionY(movableShape, value: 380)
  try engine.block.setWidth(movableShape, value: 200)
  try engine.block.setHeight(movableShape, value: 200)
  try engine.block.setName(movableShape, name: "Movable Shape")
  try engine.block.appendChild(to: page, child: movableShape)

  let allScopes = engine.editor.findAllScopes()
  print("Available scopes:", allScopes)

  for scope in allScopes {
    try engine.editor.setGlobalScope(key: scope, value: .deny)
  }

  // editor/select was locked along with everything else. Re-open it so the
  // interactive blocks below can be selected; a block cannot be touched at all
  // while its selection is denied, no matter which other scopes are enabled.
  try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
  try engine.block.setScopeEnabled(editableText, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(replaceableImage, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(movableShape, key: "editor/select", enabled: true)

  // text/edit gates the content, text/character gates styling (font, size, color).
  try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
  try engine.editor.setGlobalScope(key: "text/character", value: .defer)
  try engine.block.setScopeEnabled(editableText, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "text/character", enabled: true)

  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
  try engine.block.setScopeEnabled(replaceableImage, key: "fill/change", enabled: true)

  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.block.setScopeEnabled(movableShape, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(movableShape, key: "layer/resize", enabled: true)

  let canEditText = try engine.block.isAllowedByScope(editableText, key: "text/edit")
  let canMoveLockedImage = try engine.block.isAllowedByScope(lockedImage, key: "layer/move")
  let canReplaceImage = try engine.block.isAllowedByScope(replaceableImage, key: "fill/change")
  let canMoveShape = try engine.block.isAllowedByScope(movableShape, key: "layer/move")

  print("Can edit text:", canEditText) // true
  print("Can move locked image:", canMoveLockedImage) // false
  print("Can replace image:", canReplaceImage) // true
  print("Can move shape:", canMoveShape) // true

  let textEditGlobal = try engine.editor.getGlobalScope(key: "text/edit")
  let textEditEnabled = try engine.block.isScopeEnabled(editableText, key: "text/edit")
  print("Global text/edit is .defer:", textEditGlobal == .defer) // true
  print("Block-level text/edit enabled:", textEditEnabled) // true
}
```

Lock design elements to prevent unwanted modifications using CE.SDK's scope-based permission system.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260824/engine-guides-lock-content)

<EngineReferenceNote {...props} />

CE.SDK uses **scopes** to control what users can modify in a design. Each scope gates a specific capability—moving, resizing, text editing, image replacement, and more. The permission system has two layers: **global scopes** set defaults for the entire scene, and **block-level scopes** override those defaults when the global scope is set to `.defer`.

The example builds a sample page with four blocks—a fully locked image, an editable text block, a replaceable image, and a movable shape—then applies a different permission policy to each. This guide covers how to discover available scopes, lock an entire design, and selectively enable specific editing capabilities on individual blocks.

## Understanding the Scope Permission Model

Global and block-level scopes combine to determine whether an operation is permitted. The global scope can be set to one of three values:

| Global Scope | Block Scope | Result    |
| ------------ | ----------- | --------- |
| `.allow`     | any         | Permitted |
| `.deny`      | any         | Blocked   |
| `.defer`     | enabled     | Permitted |
| `.defer`     | disabled    | Blocked   |

When global is `.allow`, the operation is always permitted regardless of block settings. When global is `.deny`, it is always blocked. When global is `.defer`, the block-level enabled state determines the outcome.

## Discovering Available Scopes

Retrieve every available scope name with `engine.editor.findAllScopes()`. It returns an array of scope identifiers you can pass to the global and block-level scope APIs.

```swift highlight-lockContent-findAllScopes
let allScopes = engine.editor.findAllScopes()
print("Available scopes:", allScopes)
```

## Locking an Entire Design

To lock everything, iterate through all scopes and set each global scope to `.deny`. This blocks every editing operation on every block in the design.

```swift highlight-lockContent-lockAll
for scope in allScopes {
  try engine.editor.setGlobalScope(key: scope, value: .deny)
}
```

When all scopes are set to `.deny`, the `editor/select` scope is locked too. Users cannot interact with a block they cannot select, so before enabling specific capabilities you must also set `editor/select` to `.defer` and enable it on the blocks users should be able to reach.

## Selective Locking Patterns

In most real-world scenarios you want to lock some aspects while allowing others. The following patterns enable specific capabilities on individual blocks after everything has been locked.

### Allowing Text Editing

To let users edit text content but nothing else, set the `text/edit` and `text/character` global scopes to `.defer`, then enable them on specific text blocks with `engine.block.setScopeEnabled(_:key:enabled:)`.

```swift highlight-lockContent-textEdit
// text/edit gates the content, text/character gates styling (font, size, color).
try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
try engine.editor.setGlobalScope(key: "text/character", value: .defer)
try engine.block.setScopeEnabled(editableText, key: "text/edit", enabled: true)
try engine.block.setScopeEnabled(editableText, key: "text/character", enabled: true)
```

### Allowing Image Replacement

To let users swap images while protecting layout, set the `fill/change` global scope to `.defer` and enable it on specific image blocks.

```swift highlight-lockContent-imageReplace
try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
try engine.block.setScopeEnabled(replaceableImage, key: "fill/change", enabled: true)
```

### Allowing Position Adjustments

To allow repositioning and resizing of specific elements, set `layer/move` and `layer/resize` to `.defer` globally, then enable them on the chosen blocks.

```swift highlight-lockContent-positionAdjust
try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
try engine.block.setScopeEnabled(movableShape, key: "layer/move", enabled: true)
try engine.block.setScopeEnabled(movableShape, key: "layer/resize", enabled: true)
```

## Checking Permissions

Verify the effective permission on a block with `engine.block.isAllowedByScope(_:key:)`. It returns `true` when the operation is permitted after evaluating both the global and block-level settings.

```swift highlight-lockContent-checkPermissions
  let canEditText = try engine.block.isAllowedByScope(editableText, key: "text/edit")
  let canMoveLockedImage = try engine.block.isAllowedByScope(lockedImage, key: "layer/move")
  let canReplaceImage = try engine.block.isAllowedByScope(replaceableImage, key: "fill/change")
  let canMoveShape = try engine.block.isAllowedByScope(movableShape, key: "layer/move")

  print("Can edit text:", canEditText) // true
  print("Can move locked image:", canMoveLockedImage) // false
  print("Can replace image:", canReplaceImage) // true
  print("Can move shape:", canMoveShape) // true

  let textEditGlobal = try engine.editor.getGlobalScope(key: "text/edit")
  let textEditEnabled = try engine.block.isScopeEnabled(editableText, key: "text/edit")
  print("Global text/edit is .defer:", textEditGlobal == .defer) // true
  print("Block-level text/edit enabled:", textEditEnabled) // true
```

`isAllowedByScope(_:key:)` returns the effective permission, `isScopeEnabled(_:key:)` returns only the block-level setting, and `getGlobalScope(key:)` returns only the global setting. `GlobalScope` is an Objective-C–backed enum, so compare it with `==` (for example `scope == .defer`) rather than printing it directly.

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

## Troubleshooting

| Issue                                | Cause                                 | Solution                                                          |
| ------------------------------------ | ------------------------------------- | ---------------------------------------------------------------- |
| Block still editable                 | Global scope set to `.allow`          | Change the global scope to `.deny` or `.defer`                   |
| Block unexpectedly locked            | Global scope set to `.deny`           | Set the global scope to `.defer` and enable the block-level scope |
| Can't interact with unlocked block   | `editor/select` scope is locked       | Enable `editor/select` on blocks users should interact with      |
| Permission check returns wrong value | Checking the wrong scope level        | Use `isAllowedByScope(_:key:)` for the effective permission       |
| New SDK scopes not locked            | Locking code doesn't cover new scopes | Use `findAllScopes()` dynamically instead of a hardcoded list     |

## Next Steps

- [Rules Overview](./overview.md) — Understand the broader rules system in CE.SDK
- [Lock Templates](../create-templates/lock.md) — Lock templates for consistent reuse



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
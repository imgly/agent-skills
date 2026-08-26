> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Lock Design](./lock-design.md)

---

```swift file=@cesdk_swift_examples/engine-guides-lock-video-design/LockVideoDesign.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func lockVideoDesign(engine: Engine) async throws {
  // Build a small video scene: one page with a track that holds one video
  // clip, plus an editable title overlay and a locked watermark overlay.
  // The blocks below are reference context for the scope calls in the
  // highlighted sections.
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 12)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)

  let baseURL = try engine.guidesBaseURL

  let videoClip = try engine.block.create(.graphic)
  try engine.block.setShape(videoClip, shape: engine.block.createShape(.rect))
  try engine.block.setDuration(videoClip, duration: 12)
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    videoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
  )
  try engine.block.setFill(videoClip, fill: videoFill)
  try engine.block.appendChild(to: track, child: videoClip)
  try engine.block.fillParent(track)

  let titleOverlay = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: titleOverlay)
  try engine.block.setWidthMode(titleOverlay, mode: .auto)
  try engine.block.setHeightMode(titleOverlay, mode: .auto)
  try engine.block.setPositionX(titleOverlay, value: 80)
  try engine.block.setPositionY(titleOverlay, value: 80)
  try engine.block.setDuration(titleOverlay, duration: 12)
  try engine.block.replaceText(titleOverlay, text: "Editable title")

  let watermarkOverlay = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: watermarkOverlay)
  try engine.block.setWidthMode(watermarkOverlay, mode: .auto)
  try engine.block.setHeightMode(watermarkOverlay, mode: .auto)
  try engine.block.setPositionX(watermarkOverlay, value: 980)
  try engine.block.setPositionY(watermarkOverlay, value: 640)
  try engine.block.setDuration(watermarkOverlay, duration: 12)
  try engine.block.replaceText(watermarkOverlay, text: "LOCKED")

  let scopes = engine.editor.findAllScopes()
  for scope in scopes {
    try engine.editor.setGlobalScope(key: scope, value: .deny)
  }

  try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
  try engine.block.setScopeEnabled(videoClip, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(titleOverlay, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(watermarkOverlay, key: "editor/select", enabled: false)

  try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
  try engine.editor.setGlobalScope(key: "text/character", value: .defer)
  try engine.block.setScopeEnabled(titleOverlay, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(titleOverlay, key: "text/character", enabled: true)

  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
  try engine.block.setScopeEnabled(videoClip, key: "fill/change", enabled: true)

  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/rotate", value: .defer)
  try engine.block.setScopeEnabled(titleOverlay, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(titleOverlay, key: "layer/resize", enabled: true)
  try engine.block.setScopeEnabled(titleOverlay, key: "layer/rotate", enabled: true)

  let lockedOverlayScopes = [
    "text/edit",
    "text/character",
    "fill/change",
    "layer/move",
    "layer/resize",
    "layer/rotate",
  ]
  for scope in lockedOverlayScopes {
    try engine.block.setScopeEnabled(watermarkOverlay, key: scope, enabled: false)
  }

  let canSelectVideoClip = try engine.block.isAllowedByScope(videoClip, key: "editor/select")
  let canReplaceVideoClip = try engine.block.isAllowedByScope(videoClip, key: "fill/change")
  let canMoveVideoClip = try engine.block.isAllowedByScope(videoClip, key: "layer/move")
  let canEditTitle = try engine.block.isAllowedByScope(titleOverlay, key: "text/edit")
  let canMoveTitle = try engine.block.isAllowedByScope(titleOverlay, key: "layer/move")
  let canSelectWatermark = try engine.block.isAllowedByScope(watermarkOverlay, key: "editor/select")

  let titleTextEditEnabled = try engine.block.isScopeEnabled(titleOverlay, key: "text/edit")
  let textEditGlobalScope = try engine.editor.getGlobalScope(key: "text/edit")

  print("Permission status:")
  print("- Can select video clip:", canSelectVideoClip) // true
  print("- Can replace video clip fill:", canReplaceVideoClip) // true
  print("- Can move video clip:", canMoveVideoClip) // false
  print("- Can edit title:", canEditTitle) // true
  print("- Can move title:", canMoveTitle) // true
  print("- Can select watermark:", canSelectWatermark) // false
  print("- Title text/edit block scope enabled:", titleTextEditEnabled) // true
  print("- text/edit global is .defer:", textEditGlobalScope == .defer) // true

  let availableScopes = engine.editor.findAllScopes()
  print("Available scopes:", availableScopes)

  for scope in availableScopes {
    let globalSetting = try engine.editor.getGlobalScope(key: scope)
    print("- \(scope) is .defer:", globalSetting == .defer)
  }
}
```

Protect video clips, overlays, and placeholders from unwanted edits using CE.SDK's scope-based permission system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-lock-video-design)

<EngineReferenceNote {...props} />

CE.SDK uses global scopes and block-level scopes to decide which editing operations are allowed. For video designs, the same model can lock the whole scene, keep watermarks protected, and make only selected clips or overlays editable.

The backing sample creates a small headless video scene with one clip, one editable title overlay, and one locked watermark. Those blocks provide context for the scope calls below.

## Understanding Scope Permissions

Scopes control what operations users can perform on video clips, text overlays, watermarks, and other design blocks. CE.SDK combines global scope settings with block-level settings to determine the effective permission.

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

Block-level scopes are binary. They only take effect when the matching global scope is set to `.defer`.

## Lock the Entire Video Design

To lock all editing operations, discover the current scope keys with `engine.editor.findAllScopes()` and set each global scope to `.deny`.

```swift highlight-lockVideoDesign-lockEntireDesign
let scopes = engine.editor.findAllScopes()
for scope in scopes {
  try engine.editor.setGlobalScope(key: scope, value: .deny)
}
```

When all scopes are denied, users cannot select, move, edit text, replace fills, or delete blocks. This also prevents changes to video clips and overlays until you defer the global scope and enable the matching block-level scope on the blocks you want editable.

## Enable Selection for Editable Video Blocks

Before users can interact with any block, enable `editor/select`. Setting the global scope to `.defer` delegates the decision to each block, so only selected clips or overlays become interactive.

```swift highlight-lockVideoDesign-enableSelection
try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
try engine.block.setScopeEnabled(videoClip, key: "editor/select", enabled: true)
try engine.block.setScopeEnabled(titleOverlay, key: "editor/select", enabled: true)
try engine.block.setScopeEnabled(watermarkOverlay, key: "editor/select", enabled: false)
```

## Selective Video Locking Patterns

Lock everything first, then selectively enable the capabilities that each video block needs. This keeps the default state restrictive while allowing controlled editing.

### Text Overlay Editing

Enable `text/edit` for text changes and `text/character` when users should also adjust text styling. The sample applies both scopes only to the title overlay.

```swift highlight-lockVideoDesign-textOverlayEditing
try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
try engine.editor.setGlobalScope(key: "text/character", value: .defer)
try engine.block.setScopeEnabled(titleOverlay, key: "text/edit", enabled: true)
try engine.block.setScopeEnabled(titleOverlay, key: "text/character", enabled: true)
```

The title text can now be edited while unrelated layout, fill, and lifecycle operations stay locked unless another section enables them.

### Video Clip Replacement

Enable `fill/change` on a video placeholder when users may replace the media source but should not change layout. The sample keeps movement, resize, and rotation denied on the video clip.

```swift highlight-lockVideoDesign-videoReplacement
try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
try engine.block.setScopeEnabled(videoClip, key: "fill/change", enabled: true)
```

### Overlay Layout Adjustments

Enable layout scopes only for blocks that users may reposition. The sample allows moving, resizing, and rotating the title overlay while keeping the video clip layout fixed.

```swift highlight-lockVideoDesign-layoutAdjustments
try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
try engine.editor.setGlobalScope(key: "layer/rotate", value: .defer)
try engine.block.setScopeEnabled(titleOverlay, key: "layer/move", enabled: true)
try engine.block.setScopeEnabled(titleOverlay, key: "layer/resize", enabled: true)
try engine.block.setScopeEnabled(titleOverlay, key: "layer/rotate", enabled: true)
```

### Protected Overlays

Keep scopes disabled for watermarks, legal text, brand marks, or other protected overlays. Explicitly disabling the relevant block-level scopes makes the intent clear when the matching global scopes are deferred elsewhere.

```swift highlight-lockVideoDesign-protectOverlay
let lockedOverlayScopes = [
  "text/edit",
  "text/character",
  "fill/change",
  "layer/move",
  "layer/resize",
  "layer/rotate",
]
for scope in lockedOverlayScopes {
  try engine.block.setScopeEnabled(watermarkOverlay, key: scope, enabled: false)
}
```

## Check Effective Permissions

Use `engine.block.isAllowedByScope(_:key:)` to verify what the current scope configuration actually permits. This method evaluates both global and block-level settings.

```swift highlight-lockVideoDesign-checkPermissions
  let canSelectVideoClip = try engine.block.isAllowedByScope(videoClip, key: "editor/select")
  let canReplaceVideoClip = try engine.block.isAllowedByScope(videoClip, key: "fill/change")
  let canMoveVideoClip = try engine.block.isAllowedByScope(videoClip, key: "layer/move")
  let canEditTitle = try engine.block.isAllowedByScope(titleOverlay, key: "text/edit")
  let canMoveTitle = try engine.block.isAllowedByScope(titleOverlay, key: "layer/move")
  let canSelectWatermark = try engine.block.isAllowedByScope(watermarkOverlay, key: "editor/select")

  let titleTextEditEnabled = try engine.block.isScopeEnabled(titleOverlay, key: "text/edit")
  let textEditGlobalScope = try engine.editor.getGlobalScope(key: "text/edit")

  print("Permission status:")
  print("- Can select video clip:", canSelectVideoClip) // true
  print("- Can replace video clip fill:", canReplaceVideoClip) // true
  print("- Can move video clip:", canMoveVideoClip) // false
  print("- Can edit title:", canEditTitle) // true
  print("- Can move title:", canMoveTitle) // true
  print("- Can select watermark:", canSelectWatermark) // false
  print("- Title text/edit block scope enabled:", titleTextEditEnabled) // true
  print("- text/edit global is .defer:", textEditGlobalScope == .defer) // true
```

The distinction between checking methods is:

- `isAllowedByScope(_:key:)` returns the **effective permission** after evaluating both levels
- `isScopeEnabled(_:key:)` returns only the **block-level setting**
- `getGlobalScope(key:)` returns only the **global setting**

## Discover Available Scopes

Use `engine.editor.findAllScopes()` instead of hardcoding a complete scope list. This keeps locking code aligned with the scopes available in the current engine.

```swift highlight-lockVideoDesign-discoverScopes
  let availableScopes = engine.editor.findAllScopes()
  print("Available scopes:", availableScopes)

  for scope in availableScopes {
    let globalSetting = try engine.editor.getGlobalScope(key: scope)
    print("- \(scope) is .defer:", globalSetting == .defer)
  }
```

## Available Scopes Reference

| Scope                    | Description                              |
| ------------------------ | ---------------------------------------- |
| `layer/move`             | Move block position                      |
| `layer/resize`           | Resize block dimensions                  |
| `layer/rotate`           | Rotate block                             |
| `layer/flip`             | Flip block horizontally or vertically    |
| `layer/crop`             | Crop block content                       |
| `layer/opacity`          | Change block opacity                     |
| `layer/blendMode`        | Change blend mode                        |
| `layer/visibility`       | Toggle block visibility                  |
| `layer/clipping`         | Change clipping behavior                 |
| `fill/change`            | Change fill content or text color        |
| `fill/changeType`        | Change fill type                         |
| `stroke/change`          | Change stroke properties                 |
| `shape/change`           | Change shape type                        |
| `text/edit`              | Edit text content                        |
| `text/character`         | Change text styling such as font or size |
| `appearance/adjustments` | Change color adjustments                 |
| `appearance/filter`      | Apply or change filters                  |
| `appearance/effect`      | Apply or change effects                  |
| `appearance/blur`        | Apply or change blur                     |
| `appearance/shadow`      | Apply or change shadows                  |
| `appearance/animation`   | Apply or change animations               |
| `lifecycle/destroy`      | Delete the block                         |
| `lifecycle/duplicate`    | Duplicate the block                      |
| `editor/add`             | Add new blocks                           |
| `editor/select`          | Select blocks                            |

## Troubleshooting

| Issue                              | Cause                                | Solution                                                           |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Block is still editable            | The global scope is `.allow`         | Set the global scope to `.deny` or `.defer`                        |
| Block is unexpectedly locked       | The global scope is `.deny`          | Set the global scope to `.defer` and enable the block-level scope  |
| Users cannot select a block        | `editor/select` is still locked      | Enable `editor/select` for blocks users should select              |
| Permission check returns `false`   | The code checks the wrong scope level | Use `isAllowedByScope(_:key:)` for the effective permission       |
| New scopes are not locked          | The code uses a hardcoded scope list | Use `findAllScopes()` to discover scopes dynamically               |

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.editor.findAllScopes()` | Get all available scope names |
| `engine.editor.setGlobalScope(key:value:)` | Set a global scope to `.allow`, `.deny`, or `.defer` |
| `engine.editor.getGlobalScope(key:)` | Get the current global setting for one scope |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Enable or disable a scope on one block |
| `engine.block.isScopeEnabled(_:key:)` | Check only the block-level scope setting |
| `engine.block.isAllowedByScope(_:key:)` | Check the effective permission after global and block-level scopes are evaluated |

## Next Steps

- [Lock Content](../rules/lock-content.md) — Lock design elements to prevent unwanted modifications using CE.SDK's scope-based permission system.
- [Lock Templates](../create-templates/lock.md) - Lock templates for consistent reuse
- [Rules Overview](../rules/overview.md) - Understand the broader rules system



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
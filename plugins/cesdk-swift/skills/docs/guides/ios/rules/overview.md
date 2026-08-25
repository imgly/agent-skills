> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Overview](./overview.md)

---

```swift file=@cesdk_swift_examples/engine-guides-rules-overview/RulesOverview.swift reference-only
import IMGLYEngine

@MainActor
func rulesOverview(engine: Engine) async throws {
  // Set up a design scene with a page to host the demo blocks.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1600)
  try engine.block.setHeight(page, value: 1000)
  try engine.block.appendChild(to: scene, child: page)

  // The default Creator role allows every scope globally, which would short-circuit
  // the block-level checks below — set each scope to `.defer` to honor per-block settings.
  // Layer operations
  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/rotate", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/flip", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/crop", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/opacity", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/blendMode", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/visibility", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/clipping", value: .defer)
  // Appearance
  try engine.editor.setGlobalScope(key: "appearance/adjustments", value: .defer)
  try engine.editor.setGlobalScope(key: "appearance/filter", value: .defer)
  try engine.editor.setGlobalScope(key: "appearance/effect", value: .defer)
  try engine.editor.setGlobalScope(key: "appearance/blur", value: .defer)
  try engine.editor.setGlobalScope(key: "appearance/shadow", value: .defer)
  // Content editing
  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
  try engine.editor.setGlobalScope(key: "fill/changeType", value: .defer)
  try engine.editor.setGlobalScope(key: "stroke/change", value: .defer)
  // Lifecycle
  try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/duplicate", value: .defer)
  try engine.editor.setGlobalScope(key: "editor/add", value: .defer)
  try engine.editor.setGlobalScope(key: "editor/select", value: .defer)

  // Create five demo blocks, one per scope configuration. Each is a gray
  // rectangle; only the name and per-block scope settings differ.
  let blockNames = [
    "Layer Operations Disabled",
    "Appearance Disabled",
    "Content Editing Disabled",
    "All Scopes Disabled",
    "All Scopes Enabled",
  ]
  var demoBlocks: [DesignBlockID] = []
  for name in blockNames {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 300)
    try engine.block.setHeight(block, value: 300)
    let fill = try engine.block.createFill(.color)
    try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.6, g: 0.6, b: 0.6, a: 1))
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try engine.block.setName(block, name: name)
    demoBlocks.append(block)
  }
  let layerBlock = demoBlocks[0]
  let appearanceBlock = demoBlocks[1]
  let contentBlock = demoBlocks[2]
  let lockedBlock = demoBlocks[3]
  let enabledBlock = demoBlocks[4]

  // The complete set of scopes, used to fully lock or fully unlock a block.
  let allScopes = [
    "layer/move", "layer/resize", "layer/rotate", "layer/flip", "layer/crop",
    "layer/opacity", "layer/blendMode", "layer/visibility", "layer/clipping",
    "appearance/adjustments", "appearance/filter", "appearance/effect",
    "appearance/blur", "appearance/shadow",
    "fill/change", "fill/changeType", "stroke/change",
    "lifecycle/destroy", "lifecycle/duplicate", "editor/add", "editor/select",
  ]

  try engine.block.setScopeEnabled(layerBlock, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/resize", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/rotate", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/flip", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/crop", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/opacity", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/blendMode", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/visibility", enabled: false)
  try engine.block.setScopeEnabled(layerBlock, key: "layer/clipping", enabled: false)
  // Keep other categories editable.
  try engine.block.setScopeEnabled(layerBlock, key: "fill/change", enabled: true)
  try engine.block.setScopeEnabled(layerBlock, key: "lifecycle/destroy", enabled: true)
  try engine.block.setScopeEnabled(layerBlock, key: "editor/select", enabled: true)

  // Block 2: disable the appearance scopes.
  try engine.block.setScopeEnabled(appearanceBlock, key: "appearance/adjustments", enabled: false)
  try engine.block.setScopeEnabled(appearanceBlock, key: "appearance/filter", enabled: false)
  try engine.block.setScopeEnabled(appearanceBlock, key: "appearance/effect", enabled: false)
  try engine.block.setScopeEnabled(appearanceBlock, key: "appearance/blur", enabled: false)
  try engine.block.setScopeEnabled(appearanceBlock, key: "appearance/shadow", enabled: false)

  // Block 3: disable the content-editing scopes.
  try engine.block.setScopeEnabled(contentBlock, key: "fill/change", enabled: false)
  try engine.block.setScopeEnabled(contentBlock, key: "fill/changeType", enabled: false)
  try engine.block.setScopeEnabled(contentBlock, key: "stroke/change", enabled: false)

  // Block 4: disable every scope, fully locking the block.
  for scope in allScopes {
    try engine.block.setScopeEnabled(lockedBlock, key: scope, enabled: false)
  }

  // Block 5: enable every scope, leaving the block fully editable.
  for scope in allScopes {
    try engine.block.setScopeEnabled(enabledBlock, key: scope, enabled: true)
  }

  let canMoveLayer = try engine.block.isAllowedByScope(layerBlock, key: "layer/move")
  let canMoveEnabled = try engine.block.isAllowedByScope(enabledBlock, key: "layer/move")
  let canMoveLocked = try engine.block.isAllowedByScope(lockedBlock, key: "layer/move")

  print("Layer block - can move: \(canMoveLayer)") // false
  print("Enabled block - can move: \(canMoveEnabled)") // true
  print("Locked block - can move: \(canMoveLocked)") // false

  try engine.editor.setGlobalScope(key: "layer/flip", value: .deny)
  let canFlipEnabled = try engine.block.isAllowedByScope(enabledBlock, key: "layer/flip")

  print("Enabled block - can flip after global deny: \(canFlipEnabled)") // false
}
```

Learn how CE.SDK's rules system enforces design constraints and controls
editing permissions through the scopes mechanism.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-rules-overview)

<EngineReferenceNote {...props} />

In CE.SDK, *rules* are the design constraints and guardrails that control which editing operations are permitted. The primary mechanism for enforcing rules is the **scopes system** — permission flags that let you build guided editing experiences, maintain brand consistency, ensure design quality, and prevent unauthorized modifications.

This guide covers the scopes system conceptually: the available scope categories, the difference between global and block-level scopes, and how to resolve the effective permission for any block. For detailed implementation of specific rule use cases, see the guides linked under Common Use Cases.

## What Are Scopes

Scopes are permission flags that control specific editing capabilities. Each scope maps to a particular operation category, identified by a string key such as `layer/move` or `fill/change`. CE.SDK organizes scopes into four categories:

**Layer operations** — Control positioning and transformation:

- `layer/move`, `layer/resize`, `layer/rotate`, `layer/flip`
- `layer/crop`, `layer/opacity`, `layer/blendMode`
- `layer/visibility`, `layer/clipping`

**Appearance** — Control visual effects and adjustments:

- `appearance/adjustments`, `appearance/filter`, `appearance/effect`
- `appearance/blur`, `appearance/shadow`, `appearance/animation`

**Content editing** — Control content modifications:

- `text/edit`, `text/character`
- `fill/change`, `fill/changeType`
- `stroke/change`, `shape/change`

**Lifecycle** — Control block management:

- `lifecycle/destroy`, `lifecycle/duplicate`
- `editor/add`, `editor/select`

## Setting Global Scopes

Global scopes set editor-wide defaults that apply to every block. Use `setGlobalScope(key:value:)` with one of three `GlobalScope` permission levels:

- `.allow` — The operation is always permitted for all blocks.
- `.deny` — The operation is always blocked for all blocks.
- `.defer` — Control is deferred to each block's individual scope setting.

```swift highlight-rulesOverview-globalScope
// The default Creator role allows every scope globally, which would short-circuit
// the block-level checks below — set each scope to `.defer` to honor per-block settings.
// Layer operations
try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
try engine.editor.setGlobalScope(key: "layer/rotate", value: .defer)
try engine.editor.setGlobalScope(key: "layer/flip", value: .defer)
try engine.editor.setGlobalScope(key: "layer/crop", value: .defer)
try engine.editor.setGlobalScope(key: "layer/opacity", value: .defer)
try engine.editor.setGlobalScope(key: "layer/blendMode", value: .defer)
try engine.editor.setGlobalScope(key: "layer/visibility", value: .defer)
try engine.editor.setGlobalScope(key: "layer/clipping", value: .defer)
// Appearance
try engine.editor.setGlobalScope(key: "appearance/adjustments", value: .defer)
try engine.editor.setGlobalScope(key: "appearance/filter", value: .defer)
try engine.editor.setGlobalScope(key: "appearance/effect", value: .defer)
try engine.editor.setGlobalScope(key: "appearance/blur", value: .defer)
try engine.editor.setGlobalScope(key: "appearance/shadow", value: .defer)
// Content editing
try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
try engine.editor.setGlobalScope(key: "fill/changeType", value: .defer)
try engine.editor.setGlobalScope(key: "stroke/change", value: .defer)
// Lifecycle
try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)
try engine.editor.setGlobalScope(key: "lifecycle/duplicate", value: .defer)
try engine.editor.setGlobalScope(key: "editor/add", value: .defer)
try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
```

When a scope is set to `.defer`, the effective permission comes from the block-level setting, enabling fine-grained per-element control. Read the current value back with `getGlobalScope(key:)`.

## Setting Block-Level Scopes

Block-level scopes override a deferred global setting for individual blocks. Use `setScopeEnabled(_:key:enabled:)` to enable or disable an operation on a specific block. The example creates five demo blocks and configures each with a different scope category:

- **`layerBlock`** — Layer operations disabled; other categories editable.
- **`appearanceBlock`** — Appearance scopes disabled.
- **`contentBlock`** — Content-editing scopes disabled.
- **`lockedBlock`** — Every scope disabled, fully locking the block.
- **`enabledBlock`** — Every scope enabled, leaving the block fully editable.

The first block disables all layer operations while keeping the remaining categories editable:

```swift highlight-rulesOverview-blockScope
try engine.block.setScopeEnabled(layerBlock, key: "layer/move", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/resize", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/rotate", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/flip", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/crop", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/opacity", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/blendMode", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/visibility", enabled: false)
try engine.block.setScopeEnabled(layerBlock, key: "layer/clipping", enabled: false)
// Keep other categories editable.
try engine.block.setScopeEnabled(layerBlock, key: "fill/change", enabled: true)
try engine.block.setScopeEnabled(layerBlock, key: "lifecycle/destroy", enabled: true)
try engine.block.setScopeEnabled(layerBlock, key: "editor/select", enabled: true)
```

Block-level settings only take effect when the matching global scope is `.defer`. Query a block's current setting with `isScopeEnabled(_:key:)`.

## Checking Scope Permissions

Before performing an operation programmatically, verify that it is allowed with `isAllowedByScope(_:key:)`. This method resolves the effective permission from both the global and block-level settings:

```swift highlight-rulesOverview-checkScope
  let canMoveLayer = try engine.block.isAllowedByScope(layerBlock, key: "layer/move")
  let canMoveEnabled = try engine.block.isAllowedByScope(enabledBlock, key: "layer/move")
  let canMoveLocked = try engine.block.isAllowedByScope(lockedBlock, key: "layer/move")

  print("Layer block - can move: \(canMoveLayer)") // false
  print("Enabled block - can move: \(canMoveEnabled)") // true
  print("Locked block - can move: \(canMoveLocked)") // false
```

A global `.deny` blocks an operation on every block regardless of its block-level setting — even a fully enabled block can no longer perform the operation:

```swift highlight-rulesOverview-denyGlobal
  try engine.editor.setGlobalScope(key: "layer/flip", value: .deny)
  let canFlipEnabled = try engine.block.isAllowedByScope(enabledBlock, key: "layer/flip")

  print("Enabled block - can flip after global deny: \(canFlipEnabled)") // false
```

## Common Use Cases

The scopes system supports a range of rule-enforcement scenarios:

- [Lock Content](./lock-content.md) — Prevent modifications to specific elements such as logos or legal text.
- **Define safe zones** — Mark areas where content must remain for correct trimming.
- [Enforce Brand Guidelines](./enforce-brand-guidelines.md) — Restrict fonts, colors, and styles to approved options.
- [Moderate Content](./moderate-content.md) — Integrate external services to validate content appropriateness.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.editor.setGlobalScope(key:value:)` | Global | Set an editor-wide scope permission |
| `engine.editor.getGlobalScope(key:)` | Global | Get the current global scope value |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Block | Enable or disable a scope for a specific block |
| `engine.block.isScopeEnabled(_:key:)` | Block | Check whether a scope is enabled for a block |
| `engine.block.isAllowedByScope(_:key:)` | Block | Check whether an operation is allowed |



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Dynamic Content](../add-dynamic-content.md) > [Set Editing Constraints](./set-editing-constraints.md)

---

```swift file=@cesdk_swift_examples/engine-guides-set-editing-constraints/SetEditingConstraints.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func setEditingConstraints(engine: Engine) throws {
  // Demo scaffolding: a scene and page to hold the constrained blocks.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1200)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/duplicate", value: .defer)

  // Demo scaffolding: two renderable graphic blocks, constrained independently.
  let positionLocked = try engine.block.create(.graphic)
  try engine.block.setShape(positionLocked, shape: engine.block.createShape(.rect))
  try engine.block.setFill(positionLocked, fill: engine.block.createFill(.color))
  try engine.block.setWidth(positionLocked, value: 200)
  try engine.block.setHeight(positionLocked, value: 200)
  try engine.block.appendChild(to: page, child: positionLocked)

  let deletionLocked = try engine.block.create(.graphic)
  try engine.block.setShape(deletionLocked, shape: engine.block.createShape(.rect))
  try engine.block.setFill(deletionLocked, fill: engine.block.createFill(.color))
  try engine.block.setWidth(deletionLocked, value: 200)
  try engine.block.setHeight(deletionLocked, value: 200)
  try engine.block.appendChild(to: page, child: deletionLocked)

  try engine.block.setScopeEnabled(positionLocked, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(positionLocked, key: "layer/resize", enabled: true)

  try engine.block.setScopeEnabled(deletionLocked, key: "lifecycle/destroy", enabled: false)
  try engine.block.setScopeEnabled(deletionLocked, key: "lifecycle/duplicate", enabled: false)
  try engine.block.setScopeEnabled(deletionLocked, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(deletionLocked, key: "layer/resize", enabled: true)

  let canMove = try engine.block.isScopeEnabled(positionLocked, key: "layer/move")
  print("layer/move enabled at block level: \(canMove)") // false

  let moveAllowed = try engine.block.isAllowedByScope(positionLocked, key: "layer/move")
  print("layer/move allowed: \(moveAllowed)") // false
}
```

Control what users can edit in templates by setting fine-grained permissions
on individual blocks or globally across your scene using the CE.SDK Scope
system.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-set-editing-constraints)

<EngineReferenceNote {...props} />

Editing constraints let you lock specific properties of design elements while keeping others editable. The Scope system provides granular control over more than 20 editing capabilities, including movement, resizing, rotation, fill changes, text editing, and lifecycle operations. Use it to create brand templates, guided editing experiences, and form-based workflows where design integrity must be preserved while still allowing controlled personalization.

## Understanding Scopes

### What are Scopes?

A scope is a permission key that controls a specific editing capability. Each scope represents a distinct action, such as moving blocks (`"layer/move"`), changing fills (`"fill/change"`), or editing text content (`"text/edit"`). By enabling or disabling scopes, you control exactly what users can and cannot do with each design element.

Scopes exist at two levels:

- **Block-level scopes**: Per-block permissions set with `setScopeEnabled(_:key:enabled:)`.
- **Global scopes**: Default behavior for all blocks set with `setGlobalScope(key:value:)`.

These starting values depend on the editor role, which you set with `setRole(_:)`. Under the default Creator role, every global scope is `.allow`, so every action is permitted and block-level scopes are not consulted. Blocks created in this role start with their block-level scopes disabled — a setting that only takes effect once a scope defers to the block level, either by switching to the Adopter role (which defers global scopes to the block level) or by deferring individual global scopes yourself, as the rest of this guide does.

### Available Scope Categories

CE.SDK groups scopes into logical categories. Retrieve the full list at runtime with `engine.editor.findAllScopes()`.

| Category | Purpose | Example Scopes |
| --- | --- | --- |
| **Text Editing** | Control text content and formatting | `text/edit`, `text/character` |
| **Fill & Stroke** | Manage colors and gradients | `fill/change`, `fill/changeType`, `stroke/change` |
| **Shape** | Modify shape properties | `shape/change` |
| **Layer Transform** | Control position and dimensions | `layer/move`, `layer/resize`, `layer/rotate`, `layer/flip`, `layer/crop` |
| **Layer Appearance** | Manage visual properties | `layer/opacity`, `layer/blendMode`, `layer/visibility` |
| **Effects & Filters** | Apply visual effects | `appearance/adjustments`, `appearance/filter`, `appearance/effect`, `appearance/blur`, `appearance/shadow` |
| **Lifecycle** | Control creation and deletion | `lifecycle/destroy`, `lifecycle/duplicate` |
| **Editor** | Manage scene-level actions | `editor/add`, `editor/select` |

## Scope Configuration

### Global Scope Modes

Global scopes set the default behavior for all blocks in the scene. They have three modes:

| Mode | Behavior |
| --- | --- |
| `.allow` | Always allow the action, overriding block-level settings |
| `.deny` | Always deny the action, overriding block-level settings |
| `.defer` | Use the block-level setting for each block |

To make block-level constraints take effect under the default Creator role, defer the relevant global scopes to the block level:

```swift highlight-setEditingConstraints-globalScopes
try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)
try engine.editor.setGlobalScope(key: "lifecycle/duplicate", value: .defer)
```

### Scope Resolution Priority

When both global and block-level scopes apply, they resolve in this order:

1. **Global `.deny`** takes highest priority — the action is always denied.
2. **Global `.allow`** takes second priority — the action is always allowed.
3. **Global `.defer`** uses the block-level setting for each block.

## Setting Block-Level Constraints

### Locking Position

Prevent users from moving a block while keeping other edits available:

```swift highlight-setEditingConstraints-lockPosition
try engine.block.setScopeEnabled(positionLocked, key: "layer/move", enabled: false)
try engine.block.setScopeEnabled(positionLocked, key: "layer/resize", enabled: true)
```

Disabling `layer/move` locks the block's position. Because deferring a scope makes the engine consult the block-level setting — and block-level scopes start disabled — explicitly enable `layer/resize` so resizing stays available. Scopes you did not defer (such as `fill/change` and `layer/rotate`) remain at their global `.allow` default and stay editable.

### Preventing Deletion

Protect a block from being deleted or duplicated:

```swift highlight-setEditingConstraints-preventDeletion
try engine.block.setScopeEnabled(deletionLocked, key: "lifecycle/destroy", enabled: false)
try engine.block.setScopeEnabled(deletionLocked, key: "lifecycle/duplicate", enabled: false)
try engine.block.setScopeEnabled(deletionLocked, key: "layer/move", enabled: true)
try engine.block.setScopeEnabled(deletionLocked, key: "layer/resize", enabled: true)
```

Disabling `lifecycle/destroy` and `lifecycle/duplicate` keeps the block in the template. Enabling `layer/move` and `layer/resize` keeps those deferred capabilities available, so the block stays movable and resizable while it cannot be removed. Use this for essential template elements that must remain present.

### Checking Scope State

Query the block-level setting for any scope:

```swift highlight-setEditingConstraints-checkScope
let canMove = try engine.block.isScopeEnabled(positionLocked, key: "layer/move")
print("layer/move enabled at block level: \(canMove)") // false
```

`isScopeEnabled(_:key:)` returns whether the scope is enabled at the block level. It does not consider the global scope.

### Checking Effective Permissions

Check the effective permission, which resolves both the block-level and global settings:

```swift highlight-setEditingConstraints-checkAllowed
let moveAllowed = try engine.block.isAllowedByScope(positionLocked, key: "layer/move")
print("layer/move allowed: \(moveAllowed)") // false
```

`isAllowedByScope(_:key:)` returns the final permission after applying the resolution priority above. Use it when you need to know whether an action is actually permitted.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Enable or disable a scope for a specific block |
| `engine.block.isScopeEnabled(_:key:)` | Check whether a scope is enabled at the block level |
| `engine.block.isAllowedByScope(_:key:)` | Check whether a scope is allowed, considering both block and global settings |
| `engine.editor.setGlobalScope(key:value:)` | Set the global scope policy (`.allow`, `.deny`, or `.defer`) |
| `engine.editor.findAllScopes()` | List all available scope keys |



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
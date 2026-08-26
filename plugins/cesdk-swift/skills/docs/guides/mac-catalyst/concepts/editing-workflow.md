> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Editing Workflow](./editing-workflow.md)

---

CE.SDK controls editing access through roles and scopes, enabling template workflows where designers create locked layouts and end-users customize only permitted elements.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-editing-workflow)

CE.SDK uses a two-tier permission system: **roles** define user types with preset permissions, while **scopes** control specific capabilities. This enables workflows where templates can be prepared by designers and safely customized by end-users.

```swift file=@cesdk_swift_examples/engine-guides-editing-workflow/EditingWorkflow.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func editingWorkflow(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block, value: 100)
  try engine.block.setHeight(block, value: 100)
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.appendChild(to: page, child: block)

  // Roles define user types: "Creator", "Adopter", "Viewer", "Presenter"
  let role = try engine.editor.getRole()
  print("Current role:", role) // "Creator"

  // Switch to a different role
  try engine.editor.setRole("Adopter")
  print("New role:", try engine.editor.getRole()) // "Adopter"

  // Switch back to Creator for the rest of the guide
  try engine.editor.setRole("Creator")

  // Set global scopes to 'Defer' so block-level settings take effect
  try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)

  // Query a global scope value
  let moveScope = try engine.editor.getGlobalScope(key: "layer/move")
  print("Global 'layer/move' scope:", moveScope) // .defer

  // List all available scopes
  let allScopes = try engine.editor.findAllScopes()
  print("Available scopes:", allScopes.count)

  // Lock the block — Adopters cannot select, move, or delete it
  try engine.block.setScopeEnabled(block, key: "editor/select", enabled: false)
  try engine.block.setScopeEnabled(block, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(block, key: "lifecycle/destroy", enabled: false)

  // Query a block-level scope
  let canMove = try engine.block.isScopeEnabled(block, key: "layer/move")
  print("Block 'layer/move' enabled:", canMove) // false

  // Check the final resolved permission (role + global + block scopes)
  let isAllowed = try engine.block.isAllowedByScope(block, key: "layer/move")
  print("Moving allowed:", isAllowed) // false (global is .defer, block is disabled)

  // Switch to Adopter — restrictions now apply
  try engine.editor.setRole("Adopter")

  let isAllowedAsAdopter = try engine.block.isAllowedByScope(block, key: "layer/move")
  print("Moving allowed as Adopter:", isAllowedAsAdopter) // false

  // Switch back to Creator — full access restored
  try engine.editor.setRole("Creator")

  let isAllowedAsCreator = try engine.block.isAllowedByScope(block, key: "layer/move")
  print("Moving allowed as Creator:", isAllowedAsCreator) // true
}
```

This guide covers:

- The four user roles and their purposes
- How scopes control editing capabilities
- The permission resolution hierarchy
- Common template workflow patterns

## Roles

Roles define user types with different default permissions:

| Role | Purpose | Default Access |
|------|---------|----------------|
| **Creator** | Designers building templates | Full access to all operations |
| **Adopter** | End-users customizing templates | Limited by block-level scopes |
| **Viewer** | Static preview without interaction | Read-only, no playback controls |
| **Presenter** | Presenting slideshows or playing videos | Read-only with playback and navigation |

Creators set the block-level scopes that constrain what Adopters can do. This separation enables brand consistency while allowing personalization.

```swift highlight-editingWorkflow-roles
  // Roles define user types: "Creator", "Adopter", "Viewer", "Presenter"
  let role = try engine.editor.getRole()
  print("Current role:", role) // "Creator"

  // Switch to a different role
  try engine.editor.setRole("Adopter")
  print("New role:", try engine.editor.getRole()) // "Adopter"

  // Switch back to Creator for the rest of the guide
  try engine.editor.setRole("Creator")
```

## Scopes

Scopes define specific capabilities organized into categories:

- **Text**: Editing content and character formatting
- **Fill/Stroke**: Changing colors and shapes
- **Layer**: Moving, resizing, rotating, cropping
- **Appearance**: Filters, effects, shadows, animations
- **Lifecycle**: Deleting and duplicating elements
- **Editor**: Adding new elements and selecting

## Global vs Block-Level Scopes

**Global scopes** apply editor-wide and determine whether block-level settings are checked:

- `.allow` — Always permit the operation
- `.deny` — Always block the operation
- `.defer` — Check block-level scope settings

**Block-level scopes** control permissions on individual blocks. These settings only take effect when the corresponding global scope is set to `.defer`.

```swift highlight-editingWorkflow-globalScopes
  // Set global scopes to 'Defer' so block-level settings take effect
  try engine.editor.setGlobalScope(key: "editor/select", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)

  // Query a global scope value
  let moveScope = try engine.editor.getGlobalScope(key: "layer/move")
  print("Global 'layer/move' scope:", moveScope) // .defer

  // List all available scopes
  let allScopes = try engine.editor.findAllScopes()
  print("Available scopes:", allScopes.count)
```

To lock a specific block, disable its scopes:

```swift highlight-editingWorkflow-blockScopes
  // Lock the block — Adopters cannot select, move, or delete it
  try engine.block.setScopeEnabled(block, key: "editor/select", enabled: false)
  try engine.block.setScopeEnabled(block, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(block, key: "lifecycle/destroy", enabled: false)

  // Query a block-level scope
  let canMove = try engine.block.isScopeEnabled(block, key: "layer/move")
  print("Block 'layer/move' enabled:", canMove) // false
```

## Permission Resolution

Permissions resolve in this order:

1. **Role defaults** — Each role has preset global scope values
2. **Global scope** — If `.allow` or `.deny`, this is the final answer
3. **Block-level scope** — If global is `.defer`, check the block's settings

Use `isAllowedByScope(_:key:)` to check the final computed permission for any block and scope combination:

```swift highlight-editingWorkflow-checkPermissions
// Check the final resolved permission (role + global + block scopes)
let isAllowed = try engine.block.isAllowedByScope(block, key: "layer/move")
print("Moving allowed:", isAllowed) // false (global is .defer, block is disabled)
```

## Switching Roles

Change roles at runtime with `setRole(_:)`. When switching to Adopter, block-level restrictions take effect. Switching back to Creator restores full access.

```swift highlight-editingWorkflow-switchRole
  // Switch to Adopter — restrictions now apply
  try engine.editor.setRole("Adopter")

  let isAllowedAsAdopter = try engine.block.isAllowedByScope(block, key: "layer/move")
  print("Moving allowed as Adopter:", isAllowedAsAdopter) // false

  // Switch back to Creator — full access restored
  try engine.editor.setRole("Creator")

  let isAllowedAsCreator = try engine.block.isAllowedByScope(block, key: "layer/move")
  print("Moving allowed as Creator:", isAllowedAsCreator) // true
```

## Customizing Role Behavior

The `onRoleChanged` property provides an `AsyncStream<String>` that fires after role defaults are applied. Use it to customize scopes per role:

```swift
// Subscribe to role changes
Task {
  for await role in engine.editor.onRoleChanged {
    if role == "Adopter" {
      // Enable filters for adopters even though normally restricted
      try engine.editor.setGlobalScope(key: "appearance/filter", value: .allow)
    }
  }
}
```

> **Warning:** The `onRoleChanged` stream fires *after* role defaults are applied. Any scope changes you make in the callback override the defaults.

## Template Workflow Pattern

A typical template workflow:

1. **Designer (Creator)** creates the template layout
2. **Designer** locks brand elements using block scopes
3. **Designer** keeps personalization fields editable
4. **End-user (Adopter)** opens the template
5. **End-user** edits only permitted elements
6. **End-user** exports the personalized result

This pattern ensures brand consistency while enabling personalization.

## Next Steps

- [Lock Design Elements](../create-templates/lock.md) — Step-by-step instructions for locking specific elements in templates.
- [Set Editing Constraints](../create-templates/add-dynamic-content/set-editing-constraints.md) — Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences.
- [Editor State](./edit-modes.md) — Track edit modes and selection to react to workflow transitions.
- [Events](./events.md) — Subscribe to block creation, update, and deletion.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
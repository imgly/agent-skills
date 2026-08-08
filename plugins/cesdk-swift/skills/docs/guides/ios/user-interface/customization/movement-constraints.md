> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Movement Constraints](./movement-constraints.md)

---

```swift file=@cesdk_swift_examples/engine-guides-movement-constraints/MovementConstraints.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func movementConstraints(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.appendChild(to: page, child: block)

  // Allow every block in the scene to overshoot by 20% of its own size.
  try engine.editor.setMovementConstraint(MovementConstraintRule(overshoot: 0.2))

  // Pin all text and caption blocks fully inside the page.
  try engine.editor.setMovementConstraint([
    MovementConstraintRule(overshoot: 0, scope: .blockType("text")),
    MovementConstraintRule(overshoot: 0, scope: .blockType("caption")),
  ])

  // Override the scene-wide default for blocks on this page.
  try engine.editor.setMovementConstraint(
    MovementConstraintRule(overshoot: 0.1, scope: .block(page)),
  )

  // Override every other level for one specific block.
  try engine.editor.setMovementConstraint(
    MovementConstraintRule(overshoot: 0, scope: .block(block)),
  )

  // Read the resolved constraint, walking the priority chain:
  // block > parent page > blockType > scene-wide.
  let active = try engine.editor.getMovementConstraint(block)

  // Clear a scope by passing the matching descriptor. Use no argument to remove
  // the scene-wide default.
  try engine.editor.removeMovementConstraint(.block(block)) // per-block
  try engine.editor.removeMovementConstraint(.blockType("text")) // per-type
  try engine.editor.removeMovementConstraint(.block(page)) // per-page
  try engine.editor.removeMovementConstraint() // scene-wide default

  _ = active
}

```

Limit how far a block may extend past its page during user interactions.
The constraints apply to mouse and touch gestures — moving, resizing, and
scaling. API calls bypass them.

`overshoot` is a non-negative fraction of the **block's own size**: `0` pins the block fully inside, `0.2` allows a 20% overshoot. Each rule's scope decides which blocks it applies to:

- `.scene` — scene-wide default.
- `.block(id)` — a specific block (pages count as blocks).
- `.blockType(name)` — every block of the given type.

## Scene-wide default

Apply a rule that affects every page in the scene:

```swift highlight-movement-constraint-scene-wide
// Allow every block in the scene to overshoot by 20% of its own size.
try engine.editor.setMovementConstraint(MovementConstraintRule(overshoot: 0.2))
```

## Per block type

Scope a rule with `.blockType` to restrict all blocks of that type. Call `setMovementConstraint` with an array to apply several rules in one call:

```swift highlight-movement-constraint-per-type
// Pin all text and caption blocks fully inside the page.
try engine.editor.setMovementConstraint([
  MovementConstraintRule(overshoot: 0, scope: .blockType("text")),
  MovementConstraintRule(overshoot: 0, scope: .blockType("caption")),
])
```

## Per page

Pages are blocks, so you can target a page block to set a default for its children:

```swift highlight-movement-constraint-per-page
// Override the scene-wide default for blocks on this page.
try engine.editor.setMovementConstraint(
  MovementConstraintRule(overshoot: 0.1, scope: .block(page)),
)
```

## Per block

Target a specific block ID to override every other level:

```swift highlight-movement-constraint-per-block
// Override every other level for one specific block.
try engine.editor.setMovementConstraint(
  MovementConstraintRule(overshoot: 0, scope: .block(block)),
)
```

## Read the active value

Read the resolved constraint for a block. The lookup walks the priority chain: block, parent page, blockType, then scene-wide. It returns `nil` when the block is unconstrained.

```swift highlight-movement-constraint-read
// Read the resolved constraint, walking the priority chain:
// block > parent page > blockType > scene-wide.
let active = try engine.editor.getMovementConstraint(block)
```

## Remove a constraint

Pass the matching `MovementConstraintScope` to clear any level of the priority chain, or call `removeMovementConstraint()` with no argument to clear the scene-wide default:

```swift highlight-movement-constraint-remove
// Clear a scope by passing the matching descriptor. Use no argument to remove
// the scene-wide default.
try engine.editor.removeMovementConstraint(.block(block)) // per-block
try engine.editor.removeMovementConstraint(.blockType("text")) // per-type
try engine.editor.removeMovementConstraint(.block(page)) // per-page
try engine.editor.removeMovementConstraint() // scene-wide default
```

## Full code

Here's the full code:

```swift highlight-movement-constraints
import Foundation
import IMGLYEngine

@MainActor
func movementConstraints(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.appendChild(to: page, child: block)

  // Allow every block in the scene to overshoot by 20% of its own size.
  try engine.editor.setMovementConstraint(MovementConstraintRule(overshoot: 0.2))

  // Pin all text and caption blocks fully inside the page.
  try engine.editor.setMovementConstraint([
    MovementConstraintRule(overshoot: 0, scope: .blockType("text")),
    MovementConstraintRule(overshoot: 0, scope: .blockType("caption")),
  ])

  // Override the scene-wide default for blocks on this page.
  try engine.editor.setMovementConstraint(
    MovementConstraintRule(overshoot: 0.1, scope: .block(page)),
  )

  // Override every other level for one specific block.
  try engine.editor.setMovementConstraint(
    MovementConstraintRule(overshoot: 0, scope: .block(block)),
  )

  // Read the resolved constraint, walking the priority chain:
  // block > parent page > blockType > scene-wide.
  let active = try engine.editor.getMovementConstraint(block)

  // Clear a scope by passing the matching descriptor. Use no argument to remove
  // the scene-wide default.
  try engine.editor.removeMovementConstraint(.block(block)) // per-block
  try engine.editor.removeMovementConstraint(.blockType("text")) // per-type
  try engine.editor.removeMovementConstraint(.block(page)) // per-page
  try engine.editor.removeMovementConstraint() // scene-wide default

  _ = active
}
```



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
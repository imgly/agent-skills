> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Group and Ungroup Objects](./group-and-ungroup.md)

---

```swift file=@cesdk_swift_examples/engine-guides-grouping/Grouping.swift reference-only
import IMGLYEngine

@MainActor
func grouping(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Create a graphic block with a colored rectangle shape
  let block1 = try engine.block.create(.graphic)
  try engine.block.setShape(block1, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block1, value: 120)
  try engine.block.setHeight(block1, value: 120)
  try engine.block.setPositionX(block1, value: 200)
  try engine.block.setPositionY(block1, value: 240)
  let fill1 = try engine.block.createFill(.color)
  try engine.block.setColor(fill1, property: "fill/color/value", color: .rgba(r: 0.4, g: 0.6, b: 0.9, a: 1.0))
  try engine.block.setFill(block1, fill: fill1)
  try engine.block.appendChild(to: page, child: block1)

  // Create two more blocks for grouping
  let block2 = try engine.block.create(.graphic)
  try engine.block.setShape(block2, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block2, value: 120)
  try engine.block.setHeight(block2, value: 120)
  try engine.block.setPositionX(block2, value: 340)
  try engine.block.setPositionY(block2, value: 240)
  let fill2 = try engine.block.createFill(.color)
  try engine.block.setColor(fill2, property: "fill/color/value", color: .rgba(r: 0.9, g: 0.5, b: 0.4, a: 1.0))
  try engine.block.setFill(block2, fill: fill2)
  try engine.block.appendChild(to: page, child: block2)

  let block3 = try engine.block.create(.graphic)
  try engine.block.setShape(block3, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block3, value: 120)
  try engine.block.setHeight(block3, value: 120)
  try engine.block.setPositionX(block3, value: 480)
  try engine.block.setPositionY(block3, value: 240)
  let fill3 = try engine.block.createFill(.color)
  try engine.block.setColor(fill3, property: "fill/color/value", color: .rgba(r: 0.5, g: 0.8, b: 0.5, a: 1.0))
  try engine.block.setFill(block3, fill: fill3)
  try engine.block.appendChild(to: page, child: block3)

  // Check if the blocks can be grouped together
  let canGroup = try engine.block.isGroupable([block1, block2, block3])
  print("Blocks can be grouped:", canGroup)

  // Group the blocks together
  if canGroup {
    let groupID = try engine.block.group([block1, block2, block3])
    print("Created group with ID:", groupID)

    // Select the group to show it in the UI
    try engine.block.setSelected(groupID, selected: true)

    // Enter the group to select individual members
    try engine.block.enterGroup(groupID)

    // Select a specific member within the group
    try engine.block.setSelected(block2, selected: true)
    print("Selected member inside group")

    // Exit the group to return selection to the parent group
    try engine.block.exitGroup(block2)
    print("Exited group, group is now selected")

    // Find all groups in the scene
    let allGroups = try engine.block.find(byType: .group)
    print("Number of groups in scene:", allGroups.count)

    // Check the type of the group block
    let groupType = try engine.block.getType(groupID)
    print("Group block type:", groupType)

    // Get the members of the group
    let members = try engine.block.getChildren(groupID)
    print("Group has", members.count, "members")

    // Ungroup the blocks to make them independent again
    try engine.block.ungroup(groupID)
    print("Ungrouped blocks")

    // Verify blocks are no longer in a group
    let groupsAfterUngroup = try engine.block.find(byType: .group)
    print("Groups after ungrouping:", groupsAfterUngroup.count)

    // Re-group for the final display
    let finalGroup = try engine.block.group([block1, block2, block3])
    try engine.block.setSelected(finalGroup, selected: true)
  }

  try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
}
```

Group multiple blocks to move, scale, and transform them as a single unit; ungroup to edit them individually.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-rc.1/engine-guides-grouping)

Groups let you treat multiple blocks as a cohesive unit. Grouped blocks move, scale, and rotate together while maintaining their relative positions. Groups can contain other groups, enabling hierarchical compositions.

> **Note:** Groups are not currently available when editing videos.

This guide covers how to check if blocks can be grouped, create and dissolve groups, navigate into groups to select individual members, and find existing groups in a scene.

## Understanding Groups

Groups are blocks with type `.group` that contain child blocks as members. Transformations applied to a group affect all members proportionally — position, scale, and rotation cascade to all children.

Groups can be nested, meaning a group can contain other groups. This enables complex hierarchical structures where multiple logical units can be combined and manipulated together.

> **Note:** **What cannot be grouped*** Scene blocks cannot be grouped
> * Blocks already part of a group cannot be grouped again until ungrouped

## Create the Blocks

We first create several graphic blocks that we'll group together. Each block has a different color fill to make them visually distinct.

```swift highlight-grouping-createBlocks
// Create a graphic block with a colored rectangle shape
let block1 = try engine.block.create(.graphic)
try engine.block.setShape(block1, shape: engine.block.createShape(.rect))
try engine.block.setWidth(block1, value: 120)
try engine.block.setHeight(block1, value: 120)
try engine.block.setPositionX(block1, value: 200)
try engine.block.setPositionY(block1, value: 240)
let fill1 = try engine.block.createFill(.color)
try engine.block.setColor(fill1, property: "fill/color/value", color: .rgba(r: 0.4, g: 0.6, b: 0.9, a: 1.0))
try engine.block.setFill(block1, fill: fill1)
try engine.block.appendChild(to: page, child: block1)
```

The remaining two blocks are created with the same pattern and appended to the page.

## Check If Blocks Can Be Grouped

Before grouping, verify that the selected blocks can be grouped using `engine.block.isGroupable(_:)`. This method returns `true` if all blocks can be grouped together, or `false` if any block is a scene or already belongs to a group.

```swift highlight-grouping-checkGroupable
// Check if the blocks can be grouped together
let canGroup = try engine.block.isGroupable([block1, block2, block3])
print("Blocks can be grouped:", canGroup)
```

## Create a Group

Use `engine.block.group(_:)` to combine multiple blocks into a new group. The method returns the ID of the newly created group block. The group inherits the combined bounding box of its members.

```swift highlight-grouping-createGroup
  // Group the blocks together
  if canGroup {
    let groupID = try engine.block.group([block1, block2, block3])
    print("Created group with ID:", groupID)

    // Select the group to show it in the UI
    try engine.block.setSelected(groupID, selected: true)
```

## Navigate Group Selection

CE.SDK provides methods to navigate into and out of groups while editing.

### Enter a Group

When a group is selected, use `engine.block.enterGroup(_:)` to enter editing mode for that group. This allows you to select and modify individual members within the group.

```swift highlight-grouping-enterGroup
    // Enter the group to select individual members
    try engine.block.enterGroup(groupID)

    // Select a specific member within the group
    try engine.block.setSelected(block2, selected: true)
    print("Selected member inside group")
```

### Exit a Group

When editing a member inside a group, use `engine.block.exitGroup(_:)` to return selection to the parent group. This method takes a member block ID and selects its parent group.

```swift highlight-grouping-exitGroup
// Exit the group to return selection to the parent group
try engine.block.exitGroup(block2)
print("Exited group, group is now selected")
```

## Find and Inspect Groups

Discover groups in a scene and inspect their contents using `engine.block.find(byType:)`, `engine.block.getType(_:)`, and `engine.block.getChildren(_:)`.

```swift highlight-grouping-findGroups
    // Find all groups in the scene
    let allGroups = try engine.block.find(byType: .group)
    print("Number of groups in scene:", allGroups.count)

    // Check the type of the group block
    let groupType = try engine.block.getType(groupID)
    print("Group block type:", groupType)

    // Get the members of the group
    let members = try engine.block.getChildren(groupID)
    print("Group has", members.count, "members")
```

Use `engine.block.find(byType: .group)` to get all group blocks in the current scene. Use `engine.block.getType(_:)` to check if a specific block is a group (returns `"//ly.img.ubq/group"`). Use `engine.block.getChildren(_:)` to get the member blocks of a group.

## Ungroup Blocks

Use `engine.block.ungroup(_:)` to dissolve a group and release its children back to the parent container. The children maintain their current positions in the scene.

```swift highlight-grouping-ungroup
    // Ungroup the blocks to make them independent again
    try engine.block.ungroup(groupID)
    print("Ungrouped blocks")

    // Verify blocks are no longer in a group
    let groupsAfterUngroup = try engine.block.find(byType: .group)
    print("Groups after ungrouping:", groupsAfterUngroup.count)
```

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.isGroupable(_:)` | Check if blocks can be grouped together |
| `engine.block.group(_:)` | Create a group from multiple blocks |
| `engine.block.ungroup(_:)` | Dissolve a group and release its children |
| `engine.block.enterGroup(_:)` | Enter group editing mode (select member) |
| `engine.block.exitGroup(_:)` | Exit group editing mode (select parent group) |
| `engine.block.find(byType:)` | Find all blocks of a specific type |
| `engine.block.getType(_:)` | Get the type string of a block |
| `engine.block.getParent(_:)` | Get the parent block |
| `engine.block.getChildren(_:)` | Get child blocks of a container |

## Next Steps

- [Layer Management](./layer-management.md) — Control z-order and visibility of blocks
- [Position and Align](./position-and-align.md) — Arrange blocks precisely on the canvas
- [Lock Design](./lock-design.md) — Prevent modifications to specific elements



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Group and Ungroup Objects](./group-and-ungroup.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-grouping/Grouping.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

suspend fun grouping(engine: Engine) {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val block1 = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block1, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block1, value = 120F)
    engine.block.setHeight(block1, value = 120F)
    engine.block.setPositionX(block1, value = 200F)
    engine.block.setPositionY(block1, value = 240F)
    engine.block.setFill(block1, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block1,
        color = Color.fromRGBA(r = 0.4F, g = 0.6F, b = 0.9F, a = 1.0F),
    )
    engine.block.appendChild(parent = page, child = block1)

    val block2 = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block2, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block2, value = 120F)
    engine.block.setHeight(block2, value = 120F)
    engine.block.setPositionX(block2, value = 340F)
    engine.block.setPositionY(block2, value = 240F)
    engine.block.setFill(block2, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block2,
        color = Color.fromRGBA(r = 0.9F, g = 0.5F, b = 0.4F, a = 1.0F),
    )
    engine.block.appendChild(parent = page, child = block2)

    val block3 = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block3, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block3, value = 120F)
    engine.block.setHeight(block3, value = 120F)
    engine.block.setPositionX(block3, value = 480F)
    engine.block.setPositionY(block3, value = 240F)
    engine.block.setFill(block3, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block3,
        color = Color.fromRGBA(r = 0.5F, g = 0.8F, b = 0.5F, a = 1.0F),
    )
    engine.block.appendChild(parent = page, child = block3)

    val blocks = listOf(block1, block2, block3)
    val canGroup = engine.block.isGroupable(blocks)

    val group = if (canGroup) {
        engine.block.group(blocks)
    } else {
        error("Select blocks that can be grouped before calling group(...).")
    }
    engine.block.setSelected(group, selected = true)

    engine.block.enterGroup(group)
    // enterGroup selects the first member by default; select another member when needed.
    engine.block.select(block2)

    engine.block.exitGroup(block2)

    val allGroups = engine.block.findByType(DesignBlockType.Group)
    val groupType = engine.block.getType(group)
    val members = engine.block.getChildren(group)

    engine.block.ungroup(group)
    val groupsAfterUngroup = engine.block.findByType(DesignBlockType.Group)

    check(allGroups.isNotEmpty())
    check(groupType == DesignBlockType.Group.key)
    check(members.size == blocks.size)
    check(groupsAfterUngroup.isEmpty())
}
```

Group multiple blocks to move, scale, and transform them as a single unit;
ungroup to edit them individually.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/engine-guides-grouping)

<EngineReferenceNote {...props} />

Use groups when related blocks should stay linked through later edits. Nested groups help model larger composition units, such as cards, badges, or reusable layout sections.

This guide covers how to check if blocks can be grouped, create and dissolve groups, navigate into groups to select individual members, and find existing groups in a scene.

## Understanding Groups

Groups are blocks with type `DesignBlockType.Group`, and their child blocks are the group members. Android exposes groups through the same block APIs used for other containers, so you can inspect a group's type and children after creation.

Use nested groups only after each candidate selection passes `engine.block.isGroupable(...)`; blocks that already belong to another group need to be ungrouped first.

## Create the Blocks

We first create several graphic blocks that we'll group together. Each block has a different color fill to make them visually distinct.

```kotlin highlight-android-create-blocks
val block1 = engine.block.create(DesignBlockType.Graphic)
engine.block.setShape(block1, shape = engine.block.createShape(ShapeType.Rect))
engine.block.setWidth(block1, value = 120F)
engine.block.setHeight(block1, value = 120F)
engine.block.setPositionX(block1, value = 200F)
engine.block.setPositionY(block1, value = 240F)
engine.block.setFill(block1, fill = engine.block.createFill(FillType.Color))
engine.block.setFillSolidColor(
    block = block1,
    color = Color.fromRGBA(r = 0.4F, g = 0.6F, b = 0.9F, a = 1.0F),
)
engine.block.appendChild(parent = page, child = block1)
```

The remaining two blocks are created with the same pattern and appended to the page.

## Check If Blocks Can Be Grouped

Before grouping, verify that the selected blocks can be grouped using `engine.block.isGroupable(...)`. For valid block IDs, this method returns `true` only when the list is non-empty, no block is a scene or page, no block already belongs to another group, and all blocks are attached to the same page or all are detached from pages. Invalid block IDs fail instead of returning `false`.

```kotlin highlight-android-check-groupable
val blocks = listOf(block1, block2, block3)
val canGroup = engine.block.isGroupable(blocks)
```

## Create a Group

Use `engine.block.group(...)` to combine multiple blocks into a new group. Guard the call with the `isGroupable(...)` result so invalid selections do not reach `group(...)`. When the guard passes, the method returns the ID of the newly created group block, and the group inherits the combined bounding box of its members. The later snippets use that returned group.

```kotlin highlight-android-create-group
val group = if (canGroup) {
    engine.block.group(blocks)
} else {
    error("Select blocks that can be grouped before calling group(...).")
}
engine.block.setSelected(group, selected = true)
```

## Navigate Group Selection

CE.SDK provides methods to navigate into and out of groups while editing.

### Enter a Group

When a group is selected, use `engine.block.enterGroup(...)` to enter editing mode for that group. This allows you to select and modify individual members within the group.

```kotlin highlight-android-enter-group
engine.block.enterGroup(group)
// enterGroup selects the first member by default; select another member when needed.
engine.block.select(block2)
```

### Exit a Group

When editing a member inside a group, use `engine.block.exitGroup(...)` to return selection to the parent group. This method takes a member block ID and selects its parent group.

```kotlin highlight-android-exit-group
engine.block.exitGroup(block2)
```

## Find and Inspect Groups

Discover groups in a scene and inspect their contents using `engine.block.findByType(...)`, `engine.block.getType(...)`, and `engine.block.getChildren(...)`.

```kotlin highlight-android-find-groups
val allGroups = engine.block.findByType(DesignBlockType.Group)
val groupType = engine.block.getType(group)
val members = engine.block.getChildren(group)
```

Use `engine.block.findByType(DesignBlockType.Group)` to get all group blocks in the current scene. Use `engine.block.getType(...)` to check if a specific block is a group by comparing the result to `DesignBlockType.Group.key`. Use `engine.block.getChildren(...)` to get the member blocks of a group.

## Ungroup Blocks

Use `engine.block.ungroup(...)` to dissolve a group and release its children back to the parent container. The children maintain their current positions in the scene.

```kotlin highlight-android-ungroup
engine.block.ungroup(group)
val groupsAfterUngroup = engine.block.findByType(DesignBlockType.Group)
```

## Troubleshooting

### Blocks Cannot Be Grouped

If `engine.block.isGroupable(...)` returns `false`:

- Check that none of the blocks is a scene or page block, because scenes and pages cannot be grouped
- Check that all blocks are attached to the same page, or that all are detached from pages
- Check whether a block already belongs to a group by calling `engine.block.getParent(...)`, then checking that parent with `engine.block.getType(...) == DesignBlockType.Group.key`

If the list contains an invalid block ID, Android reports an error instead of returning `false`. Recreate the selection from current blocks before calling `isGroupable(...)`.

### Enter Group Has No Effect

If `engine.block.enterGroup(...)` does not change selection:

- Verify that the selected block is a group with `engine.block.getType(...)`
- Ensure the `editor/select` scope is enabled for the current editing context

### Group Not Visible After Creation

If a newly created group is not visible:

- Check that each member block was visible before grouping
- Verify the group's opacity with `engine.block.getOpacity(...)`

## API Reference

| Method                                                | Description                               |
| ----------------------------------------------------- | ----------------------------------------- |
| `engine.block.create(blockType=_)`                    | Create a block                            |
| `engine.block.createShape(type=_)`                    | Create a shape block                      |
| `engine.block.setShape(block=_, shape=_)`             | Assign a shape to a graphic block         |
| `engine.block.setWidth(block=_, value=_)`             | Set the block width                       |
| `engine.block.setHeight(block=_, value=_)`            | Set the block height                      |
| `engine.block.setPositionX(block=_, value=_)`         | Set the block's x position                |
| `engine.block.setPositionY(block=_, value=_)`         | Set the block's y position                |
| `engine.block.createFill(fillType=_)`                 | Create a fill block                       |
| `engine.block.setFill(block=_, fill=_)`               | Assign a fill to a block                  |
| `engine.block.setFillSolidColor(block=_, color=_)`    | Set a color fill                          |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)`                  | Create an RGBA color value                |
| `engine.block.appendChild(parent=_, child=_)`         | Add a block to a parent                   |
| `engine.block.isGroupable(blocks=_)`                  | Check if blocks can be grouped together   |
| `engine.block.group(blocks=_)`                        | Create a group from multiple blocks       |
| `engine.block.setSelected(block=_, selected=_)`       | Add a block to the selection              |
| `engine.block.enterGroup(block=_)`                    | Enter group editing mode                  |
| `engine.block.select(block=_)`                        | Select one block                          |
| `engine.block.exitGroup(block=_)`                     | Exit group editing mode                   |
| `engine.block.findByType(type=DesignBlockType.Group)` | Find all blocks of a specific type        |
| `engine.block.getType(block=_)`                       | Get the type string of a block            |
| `engine.block.getParent(block=_)`                     | Get the parent block                      |
| `engine.block.getChildren(block=_)`                   | Get child blocks of a container           |
| `engine.block.ungroup(block=_)`                       | Dissolve a group and release its children |
| `engine.block.getOpacity(block=_)`                    | Get a block's opacity                     |

## Next Steps

- [Layer Management](./layer-management.md) - Control z-order and visibility of blocks
- [Position and Align](./position-and-align.md) - Arrange blocks precisely on the canvas
- [Lock Design](./lock-design.md) - Protect design elements from unwanted modifications
  using CE.SDK's scope-based permission system. Control which properties users can
  edit at both global and block levels.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Move](./move.md)

---

This guide shows how to move video blocks on the canvas using CE.SDK in your app. You’ll learn how to reposition single elements, move groups, and constrain movement behavior within templates. You can move elements programmatically or by using the built-in IMG.LY UI editors.

## What You’ll Learn

- Move video programmatically using Swift
- Use the IMG.LY UI to drag images
- Adjust video position on the canvas
- Move multiple blocks together
- Constrain video movement in templates

## When to Use

Use movement to:

- Position content precisely in designs
- Align video with text, backgrounds, or grid layouts
- Enable drag-and-drop or animated movement workflows

***

## Move Videos With the UI

Users can drag and drop elements directly in the editor canvas.

***

## Move a Video Block Programmatically

Video block position is controlled using the `position/x` and `position/y` properties. They can either use absolute or percentage (relative) values. In addition to setting the properties, there are helper functions.

```swift
try engine.block.setFloat(videoBlock, property: "position/x", value: 150)
try engine.block.setFloat(videoBlock, property: "position/y", value: 100)
```

or

```swift
try engine.block.setPositionX(videoBlock, value: 150)
try engine.block.setPositionY(videoBlock, value: 150)
```

This moves the video to coordinates (150, 100) on the canvas. The origin point (0, 0) is at the top-left.

```swift
try engine.block.setPositionXMode(videoBlock, mode: .percent)
try engine.block.setPositionYMode(videoBlock, mode: .percent)
try engine.block.setPositionX(videoBlock, value: 0.5)
try engine.block.setPositionY(videoBlock, value: 0.5)
```

This moves the video to the center of the canvas, regardless of the dimensions of the canvas. As with setting position, you can update or check the mode using `position/x/mode` and `position/y/mode` properties.

```swift
let xPosition = try engine.block.getPositionX(videoBlock)
let yPosition = try engine.block.getPositionY(videoBlock)
```

***

## Move Multiple Elements Together

Group elements before moving to keep them aligned:

```swift
let groupId = try engine.block.group([videoBlockId, textBlockId])
try engine.block.setPositionX(groupId, value: 200)
```

This moves the entire group to 200 from the left edge.

***

## Move Rrelative to Current Position

To nudge a video instead of setting an absolute position:

```swift
let xPosition = try engine.block.getPositionX(videoBlock)
try engine.block.setPositionX(videoBlock, value: xPosition + 20)
```

This moves the video 20 points to the right.

***

## Lock Movement (optional)

When building templates, you might want to lock movement to protect the layout:

```swift
try engine.block.setScopeEnabled(videoBlock, key: "layer/move", enabled: false)
```

You can also disable all transformations for a block by locking, this is regardless of working with a template.

```swift
try engine.block.setTransformLocked(videoBlock, locked: true)
```

***

## Troubleshooting

| Issue                    | Solution                                              |
| ------------------------ | ----------------------------------------------------- |
| Video block not moving   | Ensure it is not constrained or locked                |
| Unexpected position      | Check canvas coordinates and alignment settings       |
| Grouped items misaligned | Confirm all items share the same reference point      |
| Can’t move via UI        | Ensure the move feature is enabled in the UI settings |

***



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
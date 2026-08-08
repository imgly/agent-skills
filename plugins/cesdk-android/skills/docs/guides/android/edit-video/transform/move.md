> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Move](./move.md)

---

Video positioning is crucial for creating professional video compositions in Android apps.
The CreativeEditor SDK enables precise video placement through both touch-based dragging
and coordinate-based Kotlin APIs. Perfect for building video collages, picture-in-picture
effects, or complex multi-layer video compositions.

## Video positioning features

- Touch-based video dragging with smooth gestures
- Coordinate-based positioning through Kotlin code
- Multi-video positioning with relationship preservation
- Position constraints for maintaining video layouts

## Video positioning scenarios

Apply video movement for:

- Creating picture-in-picture video layouts
- Building video collages and multi-layer compositions
- Implementing drag-and-drop video editing interfaces

***

## Move videos with the UI

Users can drag and drop elements directly in the editor canvas.

***

## Move a video block programmatically

Video block position is controlled using the `position/x` and `position/y` properties. They can either use absolute or percentage (relative) values. In addition to setting the properties, there are helper functions.

```kotlin
engine.block.setFloat(videoBlock, "position/x", 150f)
engine.block.setFloat(videoBlock, "position/y", 100f)
```

or

```kotlin
engine.block.setPositionX(videoBlock, 150f)
engine.block.setPositionY(videoBlock, 100f)
```

The preceding code moves the video to coordinates (150, 100) on the canvas. The origin point (0, 0) is at the top-left.

```kotlin
import ly.img.engine.PositionMode

engine.block.setPositionXMode(videoBlock, PositionMode.PERCENT)
engine.block.setPositionYMode(videoBlock, PositionMode.PERCENT)
engine.block.setPositionX(videoBlock, 0.5f)
engine.block.setPositionY(videoBlock, 0.5f)
```

The preceding code moves the video to the center of the canvas, regardless of the dimensions of the canvas. As with setting position, you can update or check the mode using `position/x/mode` and `position/y/mode` properties.

```kotlin
val xPosition = engine.block.getPositionX(videoBlock)
val yPosition = engine.block.getPositionY(videoBlock)
```

***

## Move multiple elements together

Group elements before moving to keep them aligned:

```kotlin
val groupId = engine.block.group(listOf(videoBlock, textBlock))
engine.block.setPositionX(groupId, 200f)
```

The preceding code moves the entire group to 200 from the left edge.

***

## Move relative to current position

To nudge a video instead of setting an absolute position:

```kotlin
val xPosition = engine.block.getPositionX(videoBlock)
engine.block.setPositionX(videoBlock, xPosition + 20f)
```

The preceding code moves the video 20 points to the right.

***

## Lock movement (optional)

When building templates, you might want to lock movement to protect the layout:

```kotlin
engine.block.setScopeEnabled(videoBlock, "layer/move", false)
```

You can also disable all transformations for a block by locking, this is regardless of working with a template.

```kotlin
engine.block.setTransformLocked(videoBlock, true)
```

***

## Troubleshooting

| Issue                    | Solution                                              |
| ------------------------ | ----------------------------------------------------- |
| Video block not moving   | Ensure it is not constrained or locked                |
| Unexpected position      | Check canvas coordinates and alignment settings       |
| Grouped items misaligned | Confirm all items share the same reference point      |
| Can't move via UI        | Ensure the move feature is enabled in the UI settings |

***



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
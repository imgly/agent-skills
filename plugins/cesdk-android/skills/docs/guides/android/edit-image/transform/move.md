> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Move](./move.md)

---

The CreativeEditor SDK provides a **positioning** feature you can add to your Android app. Positioning images accurately is fundamental to creating **professional layouts**. Both drag-and-drop interfaces and precise coordinate-based positioning are available through Kotlin. Whether you're building **grid layouts**, **freeform canvases**, or **template-based designs**, this guide covers all positioning needs.

## Movement Capabilities

The positioning feature in CE.SDK enables the following movements:

- **Precise positioning** with Kotlin coordinate APIs.
- **Drag-and-drop** interface for user interaction.
- Canvas-based absolute and **percentage** positioning.
- Group movement for **maintaining element relationships**.
- Position constraints for **template protection**.

## Position control scenarios

Implement positioning to:

- Create pixel-perfect layouts for Android interfaces.
- Enable intuitive drag-and-drop editing experiences.
- Create snap-to-grid or guided positioning systems.

***

## Move an image block programmatically

Image position is controlled using the `position/x` and `position/y` properties. They can use either absolute or relative (percentage) values. Helper functions are also available for setting properties.

For example, the following code moves the image to coordinates (150, 100) on the canvas.

```kotlin
engine.block.setFloat(imageBlock, "position/x", 150f)
engine.block.setFloat(imageBlock, "position/y", 100f)
```

or

```kotlin
engine.block.setPositionX(imageBlock, 150f)
engine.block.setPositionY(imageBlock, 100f)
```

For percentage-based positioning, the following code moves the image to the center of the canvas, regardless of the dimensions of the canvas:

```kotlin
import ly.img.engine.PositionMode

engine.block.setPositionXMode(imageBlock, PositionMode.PERCENT)
engine.block.setPositionYMode(imageBlock, PositionMode.PERCENT)
engine.block.setPositionX(imageBlock, 0.5f)
engine.block.setPositionY(imageBlock, 0.5f)
```

As with setting position, you can update or check the mode using `position/x/mode` and `position/y/mode` properties.

```kotlin
val xPosition = engine.block.getPositionX(imageBlock)
val yPosition = engine.block.getPositionY(imageBlock)
```

***

## Move images with the UI

Users can drag and drop elements directly in the editor canvas.

***

## Move multiple elements together

Group elements before moving to keep them aligned:

```kotlin
val groupId = engine.block.group(listOf(imageBlock, textBlock))
engine.block.setPositionX(groupId, 200f)
```

The preceding code moves the entire group to 200 from the left edge.

***

## Move relative to current position

To nudge an image instead of setting an absolute position:

```kotlin
val xPosition = engine.block.getPositionX(imageBlock)
engine.block.setPositionX(imageBlock, xPosition + 20f)
```

The preceding code moves the image 20 points to the right.

***

## Lock movement (optional)

When building templates, you might want to lock movement to protect the layout:

```kotlin
engine.block.setScopeEnabled(imageBlock, "layer/move", false)
```

You can also disable all transformations by locking, this is regardless of working with a template.

```kotlin
engine.block.setTransformLocked(imageBlock, true)
```

***

## Troubleshooting

| Issue                    | Solution                                              |
| ------------------------ | ----------------------------------------------------- |
| Image not moving         | Ensure it is not constrained or locked                |
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
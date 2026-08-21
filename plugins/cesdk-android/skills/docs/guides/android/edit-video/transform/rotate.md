> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Rotate](./rotate.md)

---

Video rotation is critical for Android video apps, especially when dealing with content
from mobile cameras that may be recorded in different orientations. The CreativeEditor
SDK provides smooth video rotation with both touch controls and precise Kotlin APIs,
ensuring your users can easily correct orientation and create dynamic video compositions.

## Video rotation features

- Smooth video rotation with real-time preview
- Orientation correction for mobile-recorded content
- Precise angle control through Kotlin programming
- Multi-video rotation for synchronized editing

### Rotating a Video Using the UI

By default, selecting a block will show handles for resizing and rotating. You can freeform rotate a block by dragging the rotation handle.

![Video rotation handle showing video can be rotated](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/rotate-example-1.png)

### Rotating a Video Using Code

You can rotate a video block using the `setRotation` function. It takes the `id` of the block and a rotation amount in radians.

```kotlin
import kotlin.math.PI

engine.block.setRotation(videoBlock, (PI / 4).toFloat())
```

If you need to convert between radians and degrees, multiply the number in degrees by pi and divide by 180.

```kotlin
val angleInRadians: Float = (angleInDegrees * PI / 180).toFloat()

val angleInDegrees: Float = (angleInRadians * 180 / PI).toFloat()
```

You can discover the current rotation of a block using the `getRotation` function.

```kotlin
val rotationOfVideo = engine.block.getRotation(videoBlock)
```

![Video rotated by 45 degrees](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/rotate-example-2.png)

> **Note:** This rotates the entire block. If you want to rotate a video that is filling
> a block but not the block, explore the crop rotate function.

### Locking Rotation

You can remove the rotation handle from the UI by changing the setting for the engine. This will affect *all* blocks.

```kotlin
engine.editor.setSettingBoolean("controlGizmo/showRotateHandles", false)
```

Though the handle is gone, the user can still use the two finger rotation gesture on a touch device. You can disable that gesture with the following setting.

```kotlin
engine.editor.setSettingBoolean("touch/rotateAction", false)
```

When you want to lock only certain blocks, you can toggle the transform lock property. This will apply to all transformations for the block.

```kotlin
engine.block.setTransformLocked(videoBlock, true)
```

### Rotating As a Group

To rotate multiple elements together, first add them to a `group` and then rotate the group.

```kotlin
import kotlin.math.PI

val groupId = engine.block.group(listOf(videoBlock, textBlock))
engine.block.setRotation(groupId, (PI / 2).toFloat())
```

### Troubleshooting

Troubleshooting

| Issue                               | Solution                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| Video appears offset after rotation | Make sure the pivot point is centered (default is center).                      |
| Rotation not applying               | Confirm that the video block is inserted and rendered before applying rotation. |
| Rotation handle not visible         | Check that interactive UI controls are enabled in the settings.                 |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Rotate](./rotate.md)

---

The CreativeEditor SDK provides a **rotation** feature for Android apps. Image rotation is a core editing feature that Android users expect in photo apps.

The CreativeEditor SDK offers straightforward methods for incorporating both **touch-based rotation** controls and precise **programmatic rotation** using **Kotlin**. This guide covers everything from basic rotation gestures to advanced group transformations and rotation constraints.

## Key rotation features

- Touch-based rotation with intuitive drag handles
- Precise angle control through Kotlin APIs
- Rotation locking for template protection
- Multi-element rotation as grouped objects

### Touch-based image rotation

Users can rotate images naturally using the built-in rotation handles. When you select an image:

1. Rotation controls automatically appear.
2. You can now freely rotate the image through drag gestures.

![Rotation handle of the control gizmo](https://img.ly/docs/cesdk/android/edit-image/transform/mobile-assets/rotation-handle.png)

### Implementing rotation in Kotlin

Your Android app can control image rotation programmatically using the `setRotation` method. Pass the block ID and rotation angle in radians:

```kotlin
import kotlin.math.PI

engine.block.setRotation(imageBlock, (PI / 4).toFloat())
```

Since Android developers often work with degrees, here are handy conversion utilities:

```kotlin
val angleInRadians: Float = (angleInDegrees * PI / 180).toFloat()

val angleInDegrees: Float = (angleInRadians * 180 / PI).toFloat()
```

To read the current rotation state in your app:

```kotlin
val currentRotation = engine.block.getRotation(imageBlock)
```

> **Note:** This rotates the entire block. If you want to rotate an image that is filling
> a block but not the block, explore the
> [crop rotate](./crop.md) function.

### Locking Rotation

You can remove the rotation handle from the UI by changing the setting for the engine. This will affect *all* blocks.

```kotlin
engine.editor.setSettingBoolean("controlGizmo/showRotateHandles", false)
```

Although the code makes the rotation handle invisible, the user can still use the two-finger rotation gesture on a touch device. You can turn off that gesture with the following setting:

```kotlin
engine.editor.setSettingBoolean("touch/rotateAction", false)
```

When you want to lock only certain blocks, you can toggle the transform lock property. This will apply to all transformations for the block.

```kotlin
engine.block.setTransformLocked(imageBlock, true)
```

### Rotating As a Group

To rotate multiple elements together, first add them to a `group` and then rotate the group.

```kotlin
import kotlin.math.PI

val groupId = engine.block.group(listOf(imageBlock, textBlock))
engine.block.setRotation(groupId, (PI / 2).toFloat())
```

### Troubleshooting

Troubleshooting

| Issue                               | Solution                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| Image appears offset after rotation | Make sure the pivot point is centered (default is center).                      |
| Rotation not applying               | Confirm that the image block is inserted and rendered before applying rotation. |
| Rotation handle not visible         | Check that interactive UI controls are enabled in the settings.                 |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
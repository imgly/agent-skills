> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Rotate](./rotate.md)

---

Learn how to programmatically and interactively rotate videos in your iOS app
using CE.SDK. This guide walks you through rotating video blocks in an editor,
using Swift to rotate, and giving your users intuitive controls and ensuring
predictable editing behavior.

## What you'll learn

- How to rotate a video as a user using the handles
- Rotate a video block by a specific angle
- How to lock video rotation
- How to rotate multiple images as a group

### Rotating a Video Using the UI

By default selecting a block will show handles for resizing. You can freeform rotate a block using a standard two-finger rotation gesture. To give the user the rotation handles, set the `editor` configuration setting.

```swift
try engine.editor.setSettingBool("controlGizmo/showRotateHandles", value: true)
```

When working with an editor, it's best to modify settings in the `EditorConfiguration.onCreate` callback. When working with the engine directly, they can be set at any time.

![Rotation handle of the control gizmo enabled for a video block](https://img.ly/docs/cesdk/ios/edit-video/transform/mobile-assets/rotate-example-1.png)

Use the `Crop` tab to rotate a video up to 45 degrees using the sliding control and in 90 degree increments using the rotation button.

![Crop menu showing rotation slider and button](https://img.ly/docs/cesdk/ios/edit-video/transform/mobile-assets/rotate-example-2.png)

> **Note:** Notice that using the Crop menu rotates the video, but not the block
> containing the video.

### Rotating a view using code

You can rotate a video block using the `setRotation` function. It takes the `id` of the block and a rotation amount in radians. Positive rotation values rotate **counterclockwise**.

```swift
try engine.block.setRotation(videoBlock, radians: .pi / 4)
```

> **Note:** This rotates the entire block. If you want to rotate a video that is filling a
> block but not the block, explore the
> [crop rotate](./crop.md) function.

If you need to convert between radians and degrees, multiply the number in degrees by pi and divide by 180.

```swift
let angleInRadians: Double = angleInDegrees * Double.pi / 180

let angleInDegrees: Double = angleInRadians * 180 / Double.pi
```

You can discover the current rotation of a block using the `getRotation` function.

```swift
let rotationOfClip= try engine.block.getRotation(videoBlock)
```

### Rotating as a group

To rotate multiple elements together, first add them to a `group` and then rotate the group.

```swift
let groupId = try engine.block.group([videoBlock, textBlock])
engine.block.setRotation(groupId, radians: pi / 2)
```

### Locking rotation

You can remove the rotation handle from the UI by changing the setting for the engine. This will affect *all* blocks.

```swift
try engine.editor.setSettingBool("controlGizmo/showRotateHandles", value: false)
```

Though the handle is gone, the user can still use the two finger rotation gesture on a touch device. You can disable that gesture with the following setting.

```swift
try engine.editor.setSettingBool("touch/rotateAction", value: false)
```

When you want to lock only certain blocks, you can toggle the transform lock property. This will apply to all transformations for the block.

```swift
try engine.block.setTransformLocked(videoBlock, locked: true)
```

When working with templates, you can lock a block from rotating by setting its scope. Remember that the global layer has to defer to the blocks using `setGlobalScope`.

```swift
try engine.block.setScopeEnabled(imageBlock, key: "layer/rotate", enabled: false)
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

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
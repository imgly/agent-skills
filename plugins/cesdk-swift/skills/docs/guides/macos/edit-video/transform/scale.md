> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Scale](./scale.md)

---

This guide shows you how to scale video clips using CE.SDK in your iOS
project. You'll learn how to scale video blocks proportionally, scale groups
and apply scaling constraints to protect template structure. Because of the
CE.SDK block architecture, many of the commands and concepts apply to all
types of graphical fills. Methods for scaling video work the same when scaling
images, text and other types of blocks.

## What you'll learn

- Scale video using the UI
- Scale video programmatically using Swift
- Scale proportionally or non-uniformly
- Scale grouped elements
- Apply scale constraints in templates

## When to use

Use scaling to:

- Emphasize or de-emphasize elements
- Fit video to available space without cropping
- Enable pinch-to-zoom gestures or dynamic layouts

***

### Scale video using the UI

When using an editor such as the **Video Editor** there are two methods for scaling video clip blocks, touch controls or the `Crop` menu. CE.SDK supports the standard pinch-to-zoom gesture for scaling. Scaling using the touch controls changes the scale of the entire video block. Scaling in the `Crop` menu changes the scale of the underlying video, but leaves the block's scale unchanged. Learn more about scaling while cropping in the [Crop guide](./crop.md). The **Video Editor** also has a `Resize` menu, but those settings are for resizing the entire scene, not individual clips.

![Example of scaling the size of a block and crop scaling the underlying video](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-2.png)

## Scale video programmatically using Swift

### Scale uniformly

Scaling uses the `scale(_ id: DesignBlockID, to scale: Float)` function. A scale value of `1.0` is the original scale. Values larger than `1.0` increase the scale of the block and values lower than `1.0` scale the block smaller. A value of `2.0`, for example makes the block twice as large.

This scales the video to 150% of its original size. The origin anchor point is unchanged, so the image expands down and to the right.

```swift
try engine.block.scale(block, to: 1.5)
```

![Original image and scaled image](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-3.png)

By default, the anchor point for the video when scaling is the origin point on the top left. The scale function has two optional parameters to move the anchor point in the x and y direction. They can have values between `0.0` and `1.0`

This scales the video to 150% of its original size. The origin anchor point is 0.5, 0.5 so the video expands from the center.

```swift
try engine.block.scale(block, to: 1.5, anchorX: 0.5, anchorY: 0.5)
```

![Original video placed over the scaled video, aligned on the center anchor point](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-4.png)

***

### Scale non-uniformly

To stretch or compress only one axis, thus distorting a video, use the crop scale function in combination with the width or height function. How you decide to make the adjustment will have different results. Below are three examples of scaling the original video in the x direction only.

![Allowing the engine to scale the video as you adjust the width of the block](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-5.png)

```swift
try engine.block.setWidthMode(imageBlock, mode: .absolute)
let newWidth: Float = try engine.block.getWidth(imageBlock) * 1.5
try engine.block.setWidth(imageBlock, value: newWidth)
```

This adjusts the width of the block and allows the engine to adjust the scale of the video to maintain it as a fill. The video isn't distorted, but it no longer fits the frame of the block.

![Using crop scale for the horizontal axis and adjusting the width of the block](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-6.png)

```swift
try engine.block.setCropScaleX(block, scaleX:  1.50)
try engine.block.setWidthMode(block, mode: .absolute)
let newWidth: Float = try engine.block.getWidth(block) * 1.5
try engine.block.setWidth(block, value: newWidth)
```

This uses crop scale to scale the video in a single direction and then adjusts the block's width to match the change. The change in width does not take the crop into account and so distorts the video as it's scaling the scaled video.

![Using crop scale for the horizontal axis and using the maintainCrop property when changing the width](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-7.png)

```swift
try engine.block.setCropScaleX(block, scaleX:  1.50)
try engine.block.setWidthMode(block, mode: .absolute)
let newWidth: Float = try engine.block.getWidth(block) * 1.5
try engine.block.setWidth(block, value: newWidth, maintainCrop: true)
```

By setting the `maintainCrop` option to true, expanding the width of the video by the scale factor respects the crop scale and the video is less distorted.

## Scale multiple elements together

Group blocks to scale them proportionally:

```swift
let groupId = try engine.block.group([videoBlock, textBlock])
try engine.block.scale(groupId, to: 0.75)
```

This scales the entire group to 75%.

***

## Lock scaling

A standard pinch-to-zoom gesture allows a user to scale a block. Toggle this ability for users by changing the "touch/pinchAction" property of the `editor`:

```swift
//disable pinch-to-scale
try engine.editor.setSettingBool("touch/pinchAction", value: false)
```

By default, video clip blocks in the **Video Editor** do not enable their scale handles, toggle this ability using the `controlGizmo/showScaleHandles` property of the `editor`. Displaying the scale handles will allow the user to scale even when pinch-to-zoom is disabled.

```swift
//show scale handles
try engine.editor.setSettingBool("controlGizmo/showScaleHandles", value: true)
```

![Video clip with scale handles enabled in Video Editor](https://img.ly/docs/cesdk/macos/edit-video/transform/mobile-assets/scale-example-1.png)

> **Note:** When working with an editor such as the **Video Editor**, editor settings are
> best set in the `EditorConfiguration.onCreate` callback. When working directly with the
> **engine** they can be set at any time.

When working with templates, you can lock a block from scaling by setting its scope. Remember that the global layer has to defer to the blocks using `setGlobalScope`.

```swift
try engine.block.setScopeEnabled(videoBlock, key: "layer/resize", enabled: false)
```

To prevent users from transforming an element at all:

```swift
try engine.block.setTransformLocked(videoBlock, locked: true)
```

***



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
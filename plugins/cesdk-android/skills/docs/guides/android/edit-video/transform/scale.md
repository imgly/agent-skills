> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Scale](./scale.md)

---

This guide shows how to scale videos using CE.SDK in your Android app. You'll
learn how to scale video blocks proportionally, scale groups, and apply
scaling constraints to protect template structure.

## What you'll learn

- Scale videos programmatically using Kotlin
- Scale proportionally or non-uniformly
- Scale grouped elements
- Apply scale constraints in templates

## When to use

Use scaling to:

- Emphasize or de-emphasize elements
- Fit videos to available space without cropping
- Enable pinch-to-zoom gestures or dynamic layouts

***

## Scale a video uniformly

Scaling uses the `scale(block: DesignBlock, scaleX: Float, scaleY: Float, anchorX: Float = 0f, anchorY: Float = 0f)` function. A scale value of `1.0f` is the original scale. Values larger than `1.0f` increase the scale of the block and values lower than `1.0f` scale the block smaller. A value of `2.0f`, for example makes the block twice as large.

The following code scales the video to 150% of its original size. The origin anchor point remains unchanged, so the video expands down and to the right:

```kotlin
engine.block.scale(videoBlock, 1.5f, 1.5f)
```

![Original video and scaled video](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/scale-example-1.png)

By default, the anchor point for the video when scaling is the origin point on the top left. The scale function has optional parameters to move the anchor point in the x and y direction. They can have values between `0.0f` and `1.0f`

The following code scales the video to 150% of its original size. The origin anchor point is 0.5, 0.5, so the video expands from the center:

```kotlin
engine.block.scale(videoBlock, 1.5f, 1.5f, 0.5f, 0.5f)
```

![Original video placed over the scaled video, aligned on the center anchor point](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/scale-example-2.png)

***

## Scale non-uniformly

To stretch or compress only one axis, thus distorting a video, use the crop scale function in combination with the width or height function. How you decide to make the adjustment will have different results. Below are three examples of scaling the original video in the x direction only.

![Allowing the engine to scale the video as you adjust the width of the block](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/scale-example-3.png)

```kotlin
import ly.img.engine.SizeMode

engine.block.setWidthMode(videoBlock, SizeMode.AUTO)
val newWidth = engine.block.getWidth(videoBlock) * 1.5f
engine.block.setWidth(videoBlock, newWidth)
```

The preceding code adjusts the width of the block and allows the engine to adjust the scale of the video to maintain it as a fill.

![Using crop scale for the horizontal axis and adjusting the width of the block](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/scale-example-4.png)

```kotlin
engine.block.setCropScaleX(videoBlock, 1.5f)
engine.block.setWidthMode(videoBlock, SizeMode.AUTO)
val newWidth = engine.block.getWidth(videoBlock) * 1.5f
engine.block.setWidth(videoBlock, newWidth)
```

The preceding code uses crop scale to scale the video in a single direction and then adjusts the block's width to match the change. The change in width does not take the crop into account and so distorts the video as it's scaling the scaled video.

![Using crop scale for the horizontal axis and using the maintainCrop property when changing the width](https://img.ly/docs/cesdk/android/edit-video/transform/mobile-assets/scale-example-5.png)

```kotlin
engine.block.setCropScaleX(videoBlock, 1.5f)
engine.block.setWidthMode(videoBlock, SizeMode.AUTO)
val newWidth = engine.block.getWidth(videoBlock) * 1.5f
engine.block.setWidth(videoBlock, newWidth, true) // maintainCrop = true
```

By setting the `maintainCrop` parameter to true, expanding the width of the video by the scale factor respects the crop scale and the video is less distorted.

***

## Scale multiple elements together

Group blocks to scale them proportionally:

```kotlin
val groupId = engine.block.group(listOf(videoBlock, textBlock))
engine.block.scale(groupId, 0.75f, 0.75f)
```

The preceding code scales the entire group to 75%.

***

## Lock scaling

When working with templates, you can lock a block from scaling by setting its scope. Remember that the global layer has to defer to the blocks using `setGlobalScope`.

```kotlin
engine.block.setScopeEnabled(videoBlock, "layer/resize", false)
```

To prevent users from transforming an element at all:

```kotlin
engine.block.setTransformLocked(videoBlock, true)
```

***



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
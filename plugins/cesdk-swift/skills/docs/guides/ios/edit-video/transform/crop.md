> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Videos](../../create-video.md) > [Transform](../transform.md) > [Crop](./crop.md)

---

Crop videos to focus on specific areas or remove unwanted edges using
programmatic crop transforms.

![Cropped video frame after scaling, translating, rotating, and flipping](https://img.ly/docs/cesdk/ios/edit-video/transform/crop-8b1741/assets/swift-based.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/engine-guides-create-video-transform-crop)

Video cropping in CreativeEditor SDK (CE.SDK) lets you re-frame clips and remove unwanted edges by moving the content inside the block. Unlike resizing or scaling which affects the entire frame uniformly, cropping selects a specific region of the source video to display inside the block's existing dimensions.

```swift file=@cesdk_swift_examples/engine-guides-create-video-transform-crop/CropVideo.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func cropVideo(engine: Engine) async throws {
  // Demo scaffolding: a video scene with a single video block that fills the page.
  let scene = try engine.scene.createVideo()
  let baseURL = try engine.guidesBaseURL
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.setDuration(page, duration: 5)

  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(videoBlock, fill: videoFill)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
  try engine.block.appendChild(to: track, child: videoBlock)
  try engine.block.fillParent(track)

  // Decode at least one video frame before exporting snapshots.
  try await engine.block.forceLoadAVResource(videoFill)

  let canCrop = try engine.block.supportsCrop(videoBlock)
  _ = canCrop

  // Center-crop: scale both axes uniformly while keeping the content centered.
  try engine.block.setCropScaleRatio(videoBlock, scaleRatio: 1.5)

  try await engine.captureGuide(page, label: "after-scale")

  // Or scale each axis independently. Unequal values stretch the content.
  try engine.block.setCropScaleX(videoBlock, scaleX: 1.5)
  try engine.block.setCropScaleY(videoBlock, scaleY: 2.0)

  // Pan the content within the frame. Values are normalized fractions of the
  // frame dimensions: 0.25 moves the content one quarter of the frame to the right.
  try engine.block.setCropTranslationX(videoBlock, translationX: 0.25)
  try engine.block.setCropTranslationY(videoBlock, translationY: -0.1)

  try await engine.captureGuide(page, label: "after-translate")

  // Rotate the content within the crop frame. Rotation is in radians.
  try engine.block.setCropRotation(videoBlock, rotation: .pi / 6)

  let scaleRatio = try engine.block.getCropScaleRatio(videoBlock)
  let scaleX = try engine.block.getCropScaleX(videoBlock)
  let scaleY = try engine.block.getCropScaleY(videoBlock)
  let rotation = try engine.block.getCropRotation(videoBlock)
  let offsetX = try engine.block.getCropTranslationX(videoBlock)
  let offsetY = try engine.block.getCropTranslationY(videoBlock)
  _ = (scaleRatio, scaleX, scaleY, rotation, offsetX, offsetY)

  // After translating or rotating you can re-fill the frame to remove letterboxing.
  try engine.block.adjustCropToFillFrame(videoBlock, minScaleRatio: 1.0)

  // Mirror the content along the vertical axis.
  try engine.block.flipCropHorizontal(videoBlock)

  try await engine.captureGuide(page, label: "hero")

  try engine.block.setCropAspectRatioLocked(videoBlock, locked: true)
  let isLocked = try engine.block.isCropAspectRatioLocked(videoBlock)
  _ = isLocked

  // Reset every crop transform back to its starting state.
  try engine.block.resetCrop(videoBlock)
}
```

This guide covers the programmatic crop API: checking crop support, scaling and translating the content, rotating and flipping it, locking the aspect ratio, and resetting the transform.

## Check Crop Support

Before applying crop operations, verify the block supports cropping with `engine.block.supportsCrop(_:)`. Graphic blocks with image or video fills return `true`:

```swift highlight-cropVideo-checkSupport
let canCrop = try engine.block.supportsCrop(videoBlock)
```

## Scale Crop

Use `engine.block.setCropScaleRatio(_:scaleRatio:)` to scale the video content uniformly within its frame. Values greater than `1.0` zoom in, values less than `1.0` zoom out, and the transform keeps the content centered:

```swift highlight-cropVideo-scale
// Center-crop: scale both axes uniformly while keeping the content centered.
try engine.block.setCropScaleRatio(videoBlock, scaleRatio: 1.5)
```

If you need to scale each axis independently — for example to stretch the content — call `setCropScaleX` and `setCropScaleY` directly. Unequal values distort the video:

```swift highlight-cropVideo-scaleAxis
// Or scale each axis independently. Unequal values stretch the content.
try engine.block.setCropScaleX(videoBlock, scaleX: 1.5)
try engine.block.setCropScaleY(videoBlock, scaleY: 2.0)
```

## Translate Crop

Pan the video content within the crop frame with `engine.block.setCropTranslationX(_:translationX:)` and `engine.block.setCropTranslationY(_:translationY:)`. Translation values are normalized fractions of the frame dimensions, so `0.25` moves the content one quarter of the frame to the right and `-0.1` moves it 10% up:

```swift highlight-cropVideo-translate
// Pan the content within the frame. Values are normalized fractions of the
// frame dimensions: 0.25 moves the content one quarter of the frame to the right.
try engine.block.setCropTranslationX(videoBlock, translationX: 0.25)
try engine.block.setCropTranslationY(videoBlock, translationY: -0.1)
```

## Rotate Crop

Rotate the video content within its frame using `engine.block.setCropRotation(_:rotation:)`. Rotation is specified in radians where `.pi` equals 180 degrees:

```swift highlight-cropVideo-rotate
// Rotate the content within the crop frame. Rotation is in radians.
try engine.block.setCropRotation(videoBlock, rotation: .pi / 6)
```

## Get Crop Values

Read the current crop state with the matching getters. The example below captures the scale ratio, the per-axis scales, the rotation, and the translation offsets:

```swift highlight-cropVideo-getValues
let scaleRatio = try engine.block.getCropScaleRatio(videoBlock)
let scaleX = try engine.block.getCropScaleX(videoBlock)
let scaleY = try engine.block.getCropScaleY(videoBlock)
let rotation = try engine.block.getCropRotation(videoBlock)
let offsetX = try engine.block.getCropTranslationX(videoBlock)
let offsetY = try engine.block.getCropTranslationY(videoBlock)
```

## Fill Frame

Translations and rotations can reveal the empty area behind the video as letterboxing. Call `engine.block.adjustCropToFillFrame(_:minScaleRatio:)` to automatically adjust the scale and translation so the content covers the full frame. The `minScaleRatio` argument sets the minimum scale the engine is allowed to settle on:

```swift highlight-cropVideo-fillFrame
// After translating or rotating you can re-fill the frame to remove letterboxing.
try engine.block.adjustCropToFillFrame(videoBlock, minScaleRatio: 1.0)
```

## Flip Crop

Flip the content horizontally or vertically within its crop frame with `engine.block.flipCropHorizontal(_:)` and `engine.block.flipCropVertical(_:)`. These flip the *content*, not the block on the canvas — every call toggles the orientation, so calling the same function twice returns the content to its original state:

```swift highlight-cropVideo-flip
// Mirror the content along the vertical axis.
try engine.block.flipCropHorizontal(videoBlock)
```

## Lock Aspect Ratio

Lock the crop's aspect ratio during interactive editing with `engine.block.setCropAspectRatioLocked(_:locked:)`. When locked, crop handles in the editor maintain the current aspect ratio while the user drags. Use `engine.block.isCropAspectRatioLocked(_:)` to query the current state:

```swift highlight-cropVideo-lockAspect
try engine.block.setCropAspectRatioLocked(videoBlock, locked: true)
let isLocked = try engine.block.isCropAspectRatioLocked(videoBlock)
```

## Reset Crop

Reset every crop transform back to the engine's initial values using `engine.block.resetCrop(_:)`. The engine restores the scale and translation that were applied when the video was first placed inside the block:

```swift highlight-cropVideo-reset
// Reset every crop transform back to its starting state.
try engine.block.resetCrop(videoBlock)
```

## Coordinate System

Crop transforms operate in normalized units rather than pixels:

| Property | Value Type | Description |
| --- | --- | --- |
| Scale | `Float` (0.0+) | `1.0` is original size, `2.0` is double, `0.5` is half |
| Translation | `Float` | Fraction of the frame dimensions; `1.0` shifts by a full frame |
| Rotation | `Float` (radians) | `.pi` equals 180°, `.pi / 2` equals 90° |

All crop values are independent of the canvas zoom level and the timeline duration — cropping changes the visual framing of the clip for its entire duration but does not trim time.

## Combining with Other Transforms

Crop transforms move the content inside the block; the block's own position, rotation, and scale move the block on the canvas. The two are independent — you can chain them freely. For example, after scaling and rotating the crop you can change the block's own rotation and width with `engine.block.setRotation(_:radians:)` and `engine.block.setWidth(_:value:)`. The order of crop calls matters: rotating first and then scaling does not produce the same frame as scaling first and then rotating.

## Troubleshooting

### Crop functions throw a scope error

Crop functions require the `layer/crop` scope. The default *Creator* role has it enabled; if you've switched to a more restrictive role, re-enable the scope before calling the crop API.

### Crop handles are not visible

Confirm the selected block has a video fill. Crop handles only appear for blocks whose fill type supports cropping. Check that `controlGizmo/showCropHandles` is still enabled in your engine settings.

### Black bars after scaling or translating

Call `engine.block.adjustCropToFillFrame(_:minScaleRatio:)` so the engine re-fits the content to the frame, or raise the scale ratio until the content fully covers the block.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsCrop(_:)` | Check if a block supports cropping |
| `engine.block.setCropScaleRatio(_:scaleRatio:)` | Set the uniform scale ratio |
| `engine.block.setCropScaleX(_:scaleX:)` | Set the horizontal scale |
| `engine.block.setCropScaleY(_:scaleY:)` | Set the vertical scale |
| `engine.block.setCropTranslationX(_:translationX:)` | Set the horizontal pan |
| `engine.block.setCropTranslationY(_:translationY:)` | Set the vertical pan |
| `engine.block.setCropRotation(_:rotation:)` | Set the rotation in radians |
| `engine.block.getCropScaleRatio(_:)` | Read the current scale ratio |
| `engine.block.getCropScaleX(_:)` | Read the current horizontal scale |
| `engine.block.getCropScaleY(_:)` | Read the current vertical scale |
| `engine.block.getCropTranslationX(_:)` | Read the current horizontal translation |
| `engine.block.getCropTranslationY(_:)` | Read the current vertical translation |
| `engine.block.getCropRotation(_:)` | Read the current rotation |
| `engine.block.adjustCropToFillFrame(_:minScaleRatio:)` | Auto-adjust to fill the frame |
| `engine.block.flipCropHorizontal(_:)` | Flip content horizontally |
| `engine.block.flipCropVertical(_:)` | Flip content vertically |
| `engine.block.setCropAspectRatioLocked(_:locked:)` | Lock or unlock the aspect ratio |
| `engine.block.isCropAspectRatioLocked(_:)` | Check whether the aspect ratio is locked |
| `engine.block.resetCrop(_:)` | Reset every crop transform |



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
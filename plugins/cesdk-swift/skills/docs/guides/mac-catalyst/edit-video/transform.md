> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Transform](./transform.md)

---

```swift file=@cesdk_swift_examples/engine-guides-video-transform/VideoTransform.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func transformVideo(engine: Engine) throws {
  // Resolve the sample video against the engine's base URL.
  let baseURL = try engine.guidesBaseURL
  let sampleVideoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 8)

  // Four video blocks, one per transformation demonstrated below.
  let positionedVideo = try engine.block.create(.graphic)
  let positionedVideoFill = try engine.block.createFill(.video)
  try engine.block.setName(positionedVideo, name: "Positioned video")
  try engine.block.setShape(positionedVideo, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(positionedVideo, value: 80)
  try engine.block.setPositionY(positionedVideo, value: 80)
  try engine.block.setWidth(positionedVideo, value: 300)
  try engine.block.setHeight(positionedVideo, value: 170)
  try engine.block.setURL(positionedVideoFill, property: "fill/video/fileURI", value: sampleVideoURL)
  try engine.block.setFill(positionedVideo, fill: positionedVideoFill)
  try engine.block.setContentFillMode(positionedVideo, mode: .cover)
  try engine.block.setDuration(positionedVideo, duration: 8)
  try engine.block.appendChild(to: page, child: positionedVideo)

  let rotatedVideo = try engine.block.create(.graphic)
  let rotatedVideoFill = try engine.block.createFill(.video)
  try engine.block.setName(rotatedVideo, name: "Rotated video")
  try engine.block.setShape(rotatedVideo, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(rotatedVideo, value: 460)
  try engine.block.setPositionY(rotatedVideo, value: 80)
  try engine.block.setWidth(rotatedVideo, value: 300)
  try engine.block.setHeight(rotatedVideo, value: 170)
  try engine.block.setURL(rotatedVideoFill, property: "fill/video/fileURI", value: sampleVideoURL)
  try engine.block.setFill(rotatedVideo, fill: rotatedVideoFill)
  try engine.block.setContentFillMode(rotatedVideo, mode: .cover)
  try engine.block.setDuration(rotatedVideo, duration: 8)
  try engine.block.appendChild(to: page, child: rotatedVideo)

  let croppedVideo = try engine.block.create(.graphic)
  let croppedVideoFill = try engine.block.createFill(.video)
  try engine.block.setName(croppedVideo, name: "Cropped video")
  try engine.block.setShape(croppedVideo, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(croppedVideo, value: 80)
  try engine.block.setPositionY(croppedVideo, value: 360)
  try engine.block.setWidth(croppedVideo, value: 300)
  try engine.block.setHeight(croppedVideo, value: 170)
  try engine.block.setURL(croppedVideoFill, property: "fill/video/fileURI", value: sampleVideoURL)
  try engine.block.setFill(croppedVideo, fill: croppedVideoFill)
  try engine.block.setContentFillMode(croppedVideo, mode: .cover)
  try engine.block.setDuration(croppedVideo, duration: 8)
  try engine.block.appendChild(to: page, child: croppedVideo)

  let lockedVideo = try engine.block.create(.graphic)
  let lockedVideoFill = try engine.block.createFill(.video)
  try engine.block.setName(lockedVideo, name: "Locked video")
  try engine.block.setShape(lockedVideo, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(lockedVideo, value: 460)
  try engine.block.setPositionY(lockedVideo, value: 360)
  try engine.block.setWidth(lockedVideo, value: 300)
  try engine.block.setHeight(lockedVideo, value: 170)
  try engine.block.setURL(lockedVideoFill, property: "fill/video/fileURI", value: sampleVideoURL)
  try engine.block.setFill(lockedVideo, fill: lockedVideoFill)
  try engine.block.setContentFillMode(lockedVideo, mode: .cover)
  try engine.block.setDuration(lockedVideo, duration: 8)
  try engine.block.appendChild(to: page, child: lockedVideo)

  try engine.block.setPositionXMode(positionedVideo, mode: .absolute)
  try engine.block.setPositionYMode(positionedVideo, mode: .absolute)
  try engine.block.setPositionX(positionedVideo, value: 120)
  try engine.block.setPositionY(positionedVideo, value: 104)

  try engine.block.setFlipHorizontal(rotatedVideo, flip: true)
  try engine.block.scale(rotatedVideo, to: 1.15, anchorX: 0.5, anchorY: 0.5)
  try engine.block.setRotation(rotatedVideo, radians: .pi / 8)

  try engine.block.setWidth(lockedVideo, value: 280, maintainCrop: true)
  try engine.block.setHeight(lockedVideo, value: 158, maintainCrop: true)

  if try engine.block.supportsCrop(croppedVideo) {
    try engine.block.setContentFillMode(croppedVideo, mode: .crop)
    try engine.block.setCropScaleRatio(croppedVideo, scaleRatio: 1.35)
    // Crop translations are relative to the block frame dimensions.
    try engine.block.setCropTranslationX(croppedVideo, translationX: -0.12)
    try engine.block.setCropTranslationY(croppedVideo, translationY: 0.08)
    try engine.block.setCropRotation(croppedVideo, rotation: .pi / 18)
    try engine.block.adjustCropToFillFrame(croppedVideo, minScaleRatio: 1.0)
  }

  try engine.editor.setSettingBool("controlGizmo/showMoveHandles", value: true)
  try engine.editor.setSettingBool("controlGizmo/showResizeHandles", value: true)
  try engine.editor.setSettingBool("controlGizmo/showScaleHandles", value: true)
  try engine.editor.setSettingBool("controlGizmo/showRotateHandles", value: true)
  try engine.editor.setSettingBool("controlGizmo/showCropHandles", value: true)
  try engine.editor.setSettingFloat("controlGizmo/blockScaleDownLimit", value: 12)
  try engine.editor.setSettingEnum("touch/rotateAction", value: "Rotate")
  try engine.editor.setSettingEnum("touch/pinchAction", value: "Scale")

  if try engine.block.isGroupable([positionedVideo, croppedVideo]) {
    let group = try engine.block.group([positionedVideo, croppedVideo])
    try engine.block.setPositionX(group, value: 180)
    try engine.block.setRotation(group, radians: .pi / 16)
  }

  if try engine.block.supportsAnimation(rotatedVideo) {
    let loopAnimation = try engine.block.createAnimation(.spinLoop)
    try engine.block.setLoopAnimation(rotatedVideo, animation: loopAnimation)
    try engine.block.setDuration(loopAnimation, duration: 2)
    try engine.block.setTimeOffset(rotatedVideo, offset: 1)
  }

  let blockFrameScopes = ["layer/move", "layer/rotate", "layer/resize", "layer/flip"]
  for scope in blockFrameScopes + ["layer/crop"] {
    try engine.editor.setGlobalScope(key: scope, value: .defer)
  }
  for scope in blockFrameScopes {
    try engine.block.setScopeEnabled(lockedVideo, key: scope, enabled: false)
  }
  try engine.block.setScopeEnabled(lockedVideo, key: "layer/crop", enabled: false)
  try engine.block.setTransformLocked(lockedVideo, locked: true)

  let transformsLocked = try engine.block.isTransformLocked(lockedVideo)
  let moveScopeEnabled = try engine.block.isScopeEnabled(lockedVideo, key: "layer/move")
  let moveAllowed = try engine.block.isAllowedByScope(lockedVideo, key: "layer/move")
  print("transformsLocked=\(transformsLocked) moveScopeEnabled=\(moveScopeEnabled) moveAllowed=\(moveAllowed)")
}
```

Transform video blocks by moving, rotating, scaling, cropping, grouping, and
locking them with the CE.SDK engine.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-video-transform)

<EngineReferenceNote {...props} />

Video transformations affect either the block frame or the media inside that frame. Block-level transforms change the graphic block's position, rotation, flip state, size, and group placement. Content-level crop transforms reframe the video fill without moving the block itself.

| Transform layer | Use it for | Main APIs |
| --- | --- | --- |
| Block | Move, rotate, flip, scale, and resize the video block in the scene. | `setPositionX`, `setRotation`, `setFlipHorizontal`, `scale`, `setWidth` |
| Content | Pan, zoom, or rotate the video inside the block frame. | `setCropScaleRatio`, `setCropTranslationX`, `setCropRotation`, `adjustCropToFillFrame` |
| Permissions | Restrict end-user edits, crop reframing, or block-frame geometry changes. | `setScopeEnabled`, `setTransformLocked` |

The snippets below run on the `@MainActor` — every engine call must happen on the main thread — and assume each named variable refers to a video graphic block in the current scene.

## Apply Block Transforms

Block transforms affect the whole graphic block. Use absolute or percentage position modes for placement, radians for rotation, booleans for flip states, and an anchor point when scaling.

```swift highlight-videoTransform-blockTransforms
  try engine.block.setPositionXMode(positionedVideo, mode: .absolute)
  try engine.block.setPositionYMode(positionedVideo, mode: .absolute)
  try engine.block.setPositionX(positionedVideo, value: 120)
  try engine.block.setPositionY(positionedVideo, value: 104)

  try engine.block.setFlipHorizontal(rotatedVideo, flip: true)
  try engine.block.scale(rotatedVideo, to: 1.15, anchorX: 0.5, anchorY: 0.5)
  try engine.block.setRotation(rotatedVideo, radians: .pi / 8)

  try engine.block.setWidth(lockedVideo, value: 280, maintainCrop: true)
  try engine.block.setHeight(lockedVideo, value: 158, maintainCrop: true)
```

Pass `maintainCrop: true` when resizing a video block and you want the engine to adjust crop values so the visible content stays framed.

## Adjust the Video Inside the Frame

Crop transforms change how the video fill appears inside the block frame. They do not change the block's own position or dimensions.

```swift highlight-videoTransform-contentTransforms
if try engine.block.supportsCrop(croppedVideo) {
  try engine.block.setContentFillMode(croppedVideo, mode: .crop)
  try engine.block.setCropScaleRatio(croppedVideo, scaleRatio: 1.35)
  // Crop translations are relative to the block frame dimensions.
  try engine.block.setCropTranslationX(croppedVideo, translationX: -0.12)
  try engine.block.setCropTranslationY(croppedVideo, translationY: 0.08)
  try engine.block.setCropRotation(croppedVideo, rotation: .pi / 18)
  try engine.block.adjustCropToFillFrame(croppedVideo, minScaleRatio: 1.0)
}
```

Crop translations are scaled offsets relative to the block frame, not pixel or design-unit positions. A `translationX` value of `-0.12` shifts the video content left by 12% of the frame width, while a `translationY` value of `0.08` shifts it down by 8% of the frame height. Positive X moves content right, and positive Y moves content down.

Check `supportsCrop(_:)` before applying crop transforms if your code handles mixed block types. `adjustCropToFillFrame(_:minScaleRatio:)` prevents empty frame areas after crop scale, translation, or rotation changes.

## Configure Transform Controls

The engine exposes interaction settings that an editor built on the engine reads to decide which handles appear and how touch gestures map to transforms.

```swift highlight-videoTransform-transformControls
try engine.editor.setSettingBool("controlGizmo/showMoveHandles", value: true)
try engine.editor.setSettingBool("controlGizmo/showResizeHandles", value: true)
try engine.editor.setSettingBool("controlGizmo/showScaleHandles", value: true)
try engine.editor.setSettingBool("controlGizmo/showRotateHandles", value: true)
try engine.editor.setSettingBool("controlGizmo/showCropHandles", value: true)
try engine.editor.setSettingFloat("controlGizmo/blockScaleDownLimit", value: 12)
try engine.editor.setSettingEnum("touch/rotateAction", value: "Rotate")
try engine.editor.setSettingEnum("touch/pinchAction", value: "Scale")
```

`controlGizmo/blockScaleDownLimit` uses screen pixels; the value above keeps scaled blocks at least 12 screen pixels wide and high. Programmatic transform calls use the block APIs directly and ignore these settings. Scope checks for those block APIs are disabled by default unless `debug/enforceScopesInAPIs` is enabled, while block-frame transform locks are enforced separately by the block-frame transform APIs.

## Transform Groups

Group multiple blocks when they should move or rotate together while preserving their relative placement.

```swift highlight-videoTransform-groupTransforms
if try engine.block.isGroupable([positionedVideo, croppedVideo]) {
  let group = try engine.block.group([positionedVideo, croppedVideo])
  try engine.block.setPositionX(group, value: 180)
  try engine.block.setRotation(group, radians: .pi / 16)
}
```

Call `isGroupable(_:)` before grouping arbitrary selections. A group receives its own block ID, so you can transform the group with the same block APIs used for single blocks.

## Animate and Time Transforms

Video scenes can combine static transforms with block animations and timeline placement. Attach animation blocks to the transformed video block and set the block's time offset when it should appear later in the page timeline.

```swift highlight-videoTransform-animatedTransforms
if try engine.block.supportsAnimation(rotatedVideo) {
  let loopAnimation = try engine.block.createAnimation(.spinLoop)
  try engine.block.setLoopAnimation(rotatedVideo, animation: loopAnimation)
  try engine.block.setDuration(loopAnimation, duration: 2)
  try engine.block.setTimeOffset(rotatedVideo, offset: 1)
}
```

Use the dedicated animation guides when you need keyframe-style motion, easing, or detailed animation property configuration.

## Restrict Transform Changes

For templates, disable individual transform scopes and use the transform lock for block-frame geometry. Block-level scope flags take effect when the matching global scope is set to `.defer`; use `isAllowedByScope(_:key:)` to read the effective permission.

```swift highlight-videoTransform-lockTransforms
  let blockFrameScopes = ["layer/move", "layer/rotate", "layer/resize", "layer/flip"]
  for scope in blockFrameScopes + ["layer/crop"] {
    try engine.editor.setGlobalScope(key: scope, value: .defer)
  }
  for scope in blockFrameScopes {
    try engine.block.setScopeEnabled(lockedVideo, key: scope, enabled: false)
  }
  try engine.block.setScopeEnabled(lockedVideo, key: "layer/crop", enabled: false)
  try engine.block.setTransformLocked(lockedVideo, locked: true)

  let transformsLocked = try engine.block.isTransformLocked(lockedVideo)
  let moveScopeEnabled = try engine.block.isScopeEnabled(lockedVideo, key: "layer/move")
  let moveAllowed = try engine.block.isAllowedByScope(lockedVideo, key: "layer/move")
  print("transformsLocked=\(transformsLocked) moveScopeEnabled=\(moveScopeEnabled) moveAllowed=\(moveAllowed)")
```

Use individual scopes when one operation should remain available, such as allowing crop but preventing movement. Disable `layer/crop` when crop or content reframing must stay fixed. `setTransformLocked(_:locked:)` protects block-frame geometry — moving, rotating, flipping, scaling, and resizing a locked block throws — while crop setters use the `layer/crop` permission path instead. `isScopeEnabled(_:key:)` reads only the block-level flag, while `isAllowedByScope(_:key:)` combines the global and block-level scope state. Engine API calls from your app code are not blocked by scopes unless `debug/enforceScopesInAPIs` is enabled, so gate the controls your app exposes on `isAllowedByScope(_:key:)`.

## Troubleshooting

| Issue | Check |
| --- | --- |
| A block does not move or rotate | For editor interactions, confirm the block is valid and `isAllowedByScope(_:key:)` returns `true` for the needed scope. For block API calls, also check whether `debug/enforceScopesInAPIs` is enabled and `isTransformLocked(_:)` is `false`. |
| Position values look wrong | Verify whether the block uses `PositionMode.absolute` or `PositionMode.percent`. |
| Rotation uses the wrong angle | Pass radians, not degrees. |
| Crop leaves empty frame areas | Call `adjustCropToFillFrame(_:minScaleRatio:)` after changing crop scale, translation, or rotation. |
| UI handles are missing | Check the `controlGizmo/*` settings and ensure the selected block supports the requested operation. |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.setPositionX(_:value:)` | Set the block's x position relative to its parent. |
| `engine.block.setPositionY(_:value:)` | Set the block's y position relative to its parent. |
| `engine.block.setPositionXMode(_:mode:)` | Choose absolute or percentage x positioning with `PositionMode`. |
| `engine.block.setPositionYMode(_:mode:)` | Choose absolute or percentage y positioning with `PositionMode`. |
| `engine.block.getPositionX(_:)` / `getPositionY(_:)` | Read the block's current x and y position. |
| `engine.block.setRotation(_:radians:)` | Rotate the block around its center. |
| `engine.block.getRotation(_:)` | Read the block's rotation in radians. |
| `engine.block.setFlipHorizontal(_:flip:)` / `setFlipVertical(_:flip:)` | Mirror the block horizontally or vertically. |
| `engine.block.isFlipHorizontal(_:)` / `isFlipVertical(_:)` | Check whether the block is mirrored. |
| `engine.block.scale(_:to:anchorX:anchorY:)` | Scale the block around a normalized anchor point. |
| `engine.block.setWidth(_:value:maintainCrop:)` / `setHeight(_:value:maintainCrop:)` | Resize the block and optionally preserve crop framing. |
| `engine.block.setContentFillMode(_:mode:)` | Choose `ContentFillMode.crop`, `.cover`, or `.contain` for the block's content. |
| `engine.block.supportsCrop(_:)` | Check whether the block supports crop transforms before applying crop values. |
| `engine.block.setCropScaleRatio(_:scaleRatio:)` | Uniformly scale the video content inside the frame. |
| `engine.block.setCropScaleX(_:scaleX:)` / `setCropScaleY(_:scaleY:)` | Scale the video content per axis inside the frame. |
| `engine.block.setCropTranslationX(_:translationX:)` / `setCropTranslationY(_:translationY:)` | Set the relative crop offset; `1.0` equals one frame dimension. |
| `engine.block.setCropRotation(_:rotation:)` | Rotate the video content inside the block frame. |
| `engine.block.adjustCropToFillFrame(_:minScaleRatio:)` | Adjust crop values so the content fills the block frame. |
| `engine.block.getCropScaleRatio(_:)` / `getCropScaleX(_:)` / `getCropScaleY(_:)` / `getCropTranslationX(_:)` / `getCropTranslationY(_:)` / `getCropRotation(_:)` | Read the current crop values. |
| `engine.block.resetCrop(_:)` | Reset manual crop values to their default state. |
| `engine.block.isGroupable(_:)` | Check whether the selected blocks can be grouped. |
| `engine.block.group(_:)` | Create a group that can be transformed as one block. |
| `engine.block.ungroup(_:)` | Dissolve a group back into its member blocks. |
| `engine.block.supportsAnimation(_:)` | Check whether a block can receive animations. |
| `engine.block.createAnimation(_:)` | Create an animation block such as `AnimationType.spinLoop`. |
| `engine.block.setInAnimation(_:animation:)` / `setLoopAnimation(_:animation:)` / `setOutAnimation(_:animation:)` | Attach an entry, looping, or exit animation to a block. |
| `engine.block.setTimeOffset(_:offset:)` | Place the block later in its parent timeline, in seconds. |
| `engine.block.setDuration(_:duration:)` | Set how long a page, video block, or animation block participates in the timeline. |
| `engine.editor.setGlobalScope(key:value:)` | Set a global scope to `GlobalScope.allow`, `.deny`, or `.defer`. |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Enable or disable a block-level scope such as `"layer/move"`, `"layer/rotate"`, `"layer/flip"`, `"layer/resize"`, or `"layer/crop"`. |
| `engine.block.isScopeEnabled(_:key:)` | Read only the block-level scope flag. |
| `engine.block.isAllowedByScope(_:key:)` | Read the effective permission after global and block-level scope state combine. |
| `engine.block.setTransformLocked(_:locked:)` / `isTransformLocked(_:)` | Lock, unlock, or check block-frame geometry transforms. |
| `engine.editor.setSettingBool(_:value:)` | Toggle `controlGizmo/*` handle visibility in the editor interaction layer. |
| `engine.editor.setSettingFloat(_:value:)` | Set `controlGizmo/blockScaleDownLimit`, the minimum on-screen block size while scaling. |
| `engine.editor.setSettingEnum(_:value:)` | Map `touch/rotateAction` and `touch/pinchAction` gestures to transform behavior. |

## Next Steps

- [Move](./transform/move.md) — Position video blocks with absolute or percentage coordinates.
- [Rotate](./transform/rotate.md) — Rotate video blocks with radians.
- [Flip](./transform/flip.md) — Mirror video blocks horizontally or vertically.
- [Scale](./transform/scale.md) — Scale video blocks around an anchor point.
- [Crop](./transform/crop.md) — Reframe video content inside a block.
- [Resize](./transform/resize.md) — Change video block dimensions while managing crop behavior.



---

## Related Pages

- [Transform Overview](./transform/overview.md) - Learn how CE.SDK applies geometric and crop transformations in video scenes, when to use them, and how they relate to the dedicated transform guides.
- [Move](./transform/move.md) - Position a video relative to its parent using either percentage or units
- [Crop Video](./transform/crop.md) - Cut out specific areas of a video to focus on key content or change aspect ratio
- [Rotate](./transform/rotate.md) - Rotate video clips either freeform or by set angles
- [Resize](./transform/resize.md) - Change the frame size of individual elements or groups
- [Scale](./transform/scale.md) - Scale video clips and streams uniformly in projects
- [Flip](./transform/flip.md) - Flip video clips horizontally or vertically or both


---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
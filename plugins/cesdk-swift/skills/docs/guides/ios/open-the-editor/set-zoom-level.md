> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Set Zoom Level](./set-zoom-level.md)

---

```swift file=@cesdk_swift_examples/engine-guides-set-zoom-level/SetZoomLevel.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func setZoomLevel(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let graphic = try engine.block.create(.graphic)
  try engine.block.setShape(graphic, shape: try engine.block.createShape(.rect))
  try engine.block.setFill(graphic, fill: try engine.block.createFill(.color))
  try engine.block.setWidth(graphic, value: 300)
  try engine.block.setHeight(graphic, value: 300)
  try engine.block.appendChild(to: page, child: graphic)

  try engine.scene.setZoom(1.0)

  let currentZoom = try engine.scene.getZoom()
  try engine.scene.setZoom(0.5 * currentZoom)

  try await engine.scene.zoom(
    to: page,
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
  )

  try engine.scene.immediateZoom(
    to: page,
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    forceUpdate: true,
  )

  try engine.scene.enableZoomAutoFit(
    page,
    axis: .both,
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
  )

  let autoFitEnabled = try engine.scene.isZoomAutoFitEnabled(page)
  print("Auto-fit enabled: \(autoFitEnabled)")

  try engine.scene.disableZoomAutoFit(page)

  try engine.scene.unstable_enableCameraZoomClamping(
    [page],
    minZoomLimit: 0.125,
    maxZoomLimit: 8.0,
  )

  let zoomClampingEnabled = try engine.scene.unstable_isCameraZoomClampingEnabled(scene)
  print("Zoom clamping enabled: \(zoomClampingEnabled)")

  try engine.scene.unstable_disableCameraZoomClamping()

  try engine.scene.unstable_enableCameraPositionClamping(
    [scene],
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  )

  let positionClampingEnabled = try engine.scene.unstable_isCameraPositionClampingEnabled(scene)
  print("Position clamping enabled: \(positionClampingEnabled)")

  try engine.scene.unstable_disableCameraPositionClamping()

  let zoomTask = Task {
    for await _ in engine.scene.onZoomLevelChanged {
      let zoom = try engine.scene.getZoom()
      print("Zoom level changed: \(zoom)")
    }
  }

  try engine.scene.setZoom(2.0)
  zoomTask.cancel()
}
```

Control how much of a design is visible by driving the camera zoom from code.
Set an exact zoom level, frame a block, follow content as it resizes, constrain
the camera, and react to zoom changes — all through the Engine `scene` API.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-set-zoom-level)

<EngineReferenceNote {...props} />

The zoom level is a ratio between design pixels and screen pixels. A zoom level of `1.0` shows one design pixel as one screen pixel; `2.0` shows it as two. Every call below operates on the engine's active scene and reads back through `engine.scene`.

## Get and Set the Zoom Level

Set an absolute zoom level with `setZoom(_:)` and read the current one with `getZoom()`. Reading the current value first lets you apply a relative change, such as halving the zoom.

```swift highlight-setZoomLevel-getSet
  try engine.scene.setZoom(1.0)

  let currentZoom = try engine.scene.getZoom()
  try engine.scene.setZoom(0.5 * currentZoom)
```

## Zoom to a Block

Frame a specific block — the page, a group, or any element — with `zoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:)`. Without padding the camera fits the block tightly; padding (in points) leaves breathing room on each side.

`immediateZoom(to:…forceUpdate:)` performs the same framing synchronously. It assumes the layout is already up to date; pass `forceUpdate: true` to run a layout pass first.

```swift highlight-setZoomLevel-zoomToBlock
  try await engine.scene.zoom(
    to: page,
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
  )

  try engine.scene.immediateZoom(
    to: page,
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    forceUpdate: true,
  )
```

## Auto-Fit Zoom

Auto-fit continuously refits a block as its bounding box changes. Choose the axis to follow with `ZoomAutoFitAxis` — `.both`, `.horizontal`, or `.vertical`. Auto-fit only takes effect while the zoom level is not being driven by an editor UI layer, and calling `setZoom(_:)` or `zoom(to:)` disables it.

```swift highlight-setZoomLevel-autoFit
try engine.scene.enableZoomAutoFit(
  page,
  axis: .both,
  paddingLeft: 20,
  paddingTop: 20,
  paddingRight: 20,
  paddingBottom: 20,
)
```

## Disable Auto-Fit

Stop following a block with `disableZoomAutoFit(_:)`, and check whether auto-fit is currently enabled with `isZoomAutoFitEnabled(_:)`.

```swift highlight-setZoomLevel-disableAutoFit
  let autoFitEnabled = try engine.scene.isZoomAutoFitEnabled(page)
  print("Auto-fit enabled: \(autoFitEnabled)")

  try engine.scene.disableZoomAutoFit(page)
```

## Limit the Zoom Range

`unstable_enableCameraZoomClamping(_:minZoomLimit:maxZoomLimit:…)` keeps the camera zoom within a range relative to the given blocks. A negative limit means unbounded. Query whether clamping is active with `unstable_isCameraZoomClampingEnabled(_:)` and remove it with `unstable_disableCameraZoomClamping()`. These camera-clamping APIs are experimental, indicated by the `unstable_` prefix.

```swift highlight-setZoomLevel-zoomClamping
  try engine.scene.unstable_enableCameraZoomClamping(
    [page],
    minZoomLimit: 0.125,
    maxZoomLimit: 8.0,
  )

  let zoomClampingEnabled = try engine.scene.unstable_isCameraZoomClampingEnabled(scene)
  print("Zoom clamping enabled: \(zoomClampingEnabled)")

  try engine.scene.unstable_disableCameraZoomClamping()
```

## Constrain the Camera Position

`unstable_enableCameraPositionClamping(_:…)` keeps the camera within the bounds of the given blocks, so panning never leaves the content. Padding (in points) defines how far past the bounds the camera may move. Query with `unstable_isCameraPositionClampingEnabled(_:)` and remove with `unstable_disableCameraPositionClamping()`. Camera clamping also integrates with the editor's global settings — see the [Settings](../settings.md) guide.

```swift highlight-setZoomLevel-positionClamping
  try engine.scene.unstable_enableCameraPositionClamping(
    [scene],
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  )

  let positionClampingEnabled = try engine.scene.unstable_isCameraPositionClampingEnabled(scene)
  print("Position clamping enabled: \(positionClampingEnabled)")

  try engine.scene.unstable_disableCameraPositionClamping()
```

## Subscribe to Zoom Changes

`onZoomLevelChanged` is an `AsyncStream` that emits whenever the zoom level changes. Iterate it in a `Task` to keep custom UI — a zoom indicator, say — in sync, and cancel the task when you no longer need updates.

```swift highlight-setZoomLevel-subscribe
  let zoomTask = Task {
    for await _ in engine.scene.onZoomLevelChanged {
      let zoom = try engine.scene.getZoom()
      print("Zoom level changed: \(zoom)")
    }
  }

  try engine.scene.setZoom(2.0)
  zoomTask.cancel()
```

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `setZoom(_:)` | Set the active scene's zoom level, in unit `1/px`. |
| `getZoom()` | Read the active scene's current zoom level. |
| `zoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:)` | Animate the camera to frame a block, with optional per-side padding in points. |
| `immediateZoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:forceUpdate:)` | Frame a block without animation; pass `forceUpdate: true` to run a layout pass first. |
| `enableZoomAutoFit(_:axis:paddingLeft:paddingTop:paddingRight:paddingBottom:)` | Continuously refit a block on the given `ZoomAutoFitAxis`. |
| `disableZoomAutoFit(_:)` | Stop a previously enabled auto-fit. |
| `isZoomAutoFitEnabled(_:)` | Query whether auto-fit is enabled. |
| `unstable_enableCameraZoomClamping(_:minZoomLimit:maxZoomLimit:…)` | Constrain the zoom range relative to the given blocks. Experimental. |
| `unstable_disableCameraZoomClamping()` | Remove zoom clamping. Experimental. |
| `unstable_isCameraZoomClampingEnabled(_:)` | Query whether zoom clamping is enabled. Experimental. |
| `unstable_enableCameraPositionClamping(_:…)` | Keep the camera within the bounds of the given blocks. Experimental. |
| `unstable_disableCameraPositionClamping()` | Remove position clamping. Experimental. |
| `unstable_isCameraPositionClampingEnabled(_:)` | Query whether position clamping is enabled. Experimental. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `onZoomLevelChanged` | `AsyncStream<Void>` | Emits whenever the zoom level changes. |

## Troubleshooting

| Problem | Resolution |
| --- | --- |
| Zoom level doesn't change | Confirm a scene exists before calling zoom methods, and that no editor UI layer is overriding the zoom. |
| Auto-fit has no effect | Only one block per scene can drive auto-fit, and `setZoom(_:)` or `zoom(to:)` disables it. Pass a valid block that belongs to the active scene. |
| Zoom feels capped | An active zoom clamp limits the range. Check with `unstable_isCameraZoomClampingEnabled(_:)` and adjust or remove it. |

## Next Steps

- [Start With Blank Canvas](./blank-canvas.md) — Start the editor with an empty scene to zoom into.
- [Load a Scene](./load-scene.md) — Open an existing design before adjusting the camera.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Apply Blur](./blur.md)

---

```swift file=@cesdk_swift_examples/engine-guides-blur/Blur.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func blur(engine: Engine) async throws {
  // Demo scaffolding: a 2x2 grid of the same photo so each cell can render
  // a different blur type side by side.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  let uniformCell = try makeImageCell(engine: engine, page: page, x: 20, y: 20, imageURL: imageURL)
  let linearCell = try makeImageCell(engine: engine, page: page, x: 400, y: 20, imageURL: imageURL)
  let radialCell = try makeImageCell(engine: engine, page: page, x: 20, y: 300, imageURL: imageURL)
  let mirroredCell = try makeImageCell(engine: engine, page: page, x: 400, y: 300, imageURL: imageURL)

  try await engine.captureGuide(page, label: "before-blur")

  guard try engine.block.supportsBlur(uniformCell) else { return }

  let uniformBlur = try engine.block.createBlur(.uniform)
  try engine.block.setBlur(uniformCell, blurID: uniformBlur)
  try engine.block.setBlurEnabled(uniformCell, enabled: true)

  try engine.block.setFloat(uniformBlur, property: "blur/uniform/intensity", value: 0.8)

  let linearBlur = try engine.block.createBlur(.linear)
  try engine.block.setFloat(linearBlur, property: "blur/linear/blurRadius", value: 35)
  try engine.block.setFloat(linearBlur, property: "blur/linear/x1", value: 0.0)
  try engine.block.setFloat(linearBlur, property: "blur/linear/y1", value: 0.3)
  try engine.block.setFloat(linearBlur, property: "blur/linear/x2", value: 1.0)
  try engine.block.setFloat(linearBlur, property: "blur/linear/y2", value: 0.7)
  try engine.block.setBlur(linearCell, blurID: linearBlur)
  try engine.block.setBlurEnabled(linearCell, enabled: true)

  let radialBlur = try engine.block.createBlur(.radial)
  try engine.block.setFloat(radialBlur, property: "blur/radial/blurRadius", value: 45)
  try engine.block.setFloat(radialBlur, property: "blur/radial/radius", value: 40)
  try engine.block.setFloat(radialBlur, property: "blur/radial/gradientRadius", value: 30)
  try engine.block.setFloat(radialBlur, property: "blur/radial/x", value: 0.5)
  try engine.block.setFloat(radialBlur, property: "blur/radial/y", value: 0.5)
  try engine.block.setBlur(radialCell, blurID: radialBlur)
  try engine.block.setBlurEnabled(radialCell, enabled: true)

  let mirroredBlur = try engine.block.createBlur(.mirrored)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/blurRadius", value: 50)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/size", value: 30)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/gradientSize", value: 25)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/x1", value: 0.0)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/y1", value: 0.5)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/x2", value: 1.0)
  try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/y2", value: 0.5)
  try engine.block.setBlur(mirroredCell, blurID: mirroredBlur)
  try engine.block.setBlurEnabled(mirroredCell, enabled: true)

  try await engine.captureGuide(page, label: "hero")

  let currentBlur = try engine.block.getBlur(radialCell)
  let currentRadius = try engine.block.getFloat(currentBlur, property: "blur/radial/blurRadius")
  print("current radial blur radius: \(currentRadius)")

  try engine.block.setBlurEnabled(uniformCell, enabled: false)
  let uniformEnabled = try engine.block.isBlurEnabled(uniformCell)
  print("uniform blur enabled: \(uniformEnabled)")

  try await engine.captureGuide(page, label: "after-toggle")

  let sharedBlur = try engine.block.createBlur(.uniform)
  try engine.block.setFloat(sharedBlur, property: "blur/uniform/intensity", value: 0.4)
  try engine.block.setBlur(uniformCell, blurID: sharedBlur)
  try engine.block.setBlurEnabled(uniformCell, enabled: true)
  try engine.block.setBlur(linearCell, blurID: sharedBlur)
  try engine.block.setBlurEnabled(linearCell, enabled: true)

  let existingBlur = try engine.block.getBlur(mirroredCell)
  try engine.block.destroy(existingBlur)
}

@MainActor
private func makeImageCell(
  engine: Engine,
  page: DesignBlockID,
  x: Float,
  y: Float,
  imageURL: URL,
) throws -> DesignBlockID {
  let cell = try engine.block.create(.graphic)
  try engine.block.setShape(cell, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(cell, value: x)
  try engine.block.setPositionY(cell, value: y)
  try engine.block.setWidth(cell, value: 380)
  try engine.block.setHeight(cell, value: 260)
  let fill = try engine.block.createFill(.image)
  try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(cell, fill: fill)
  try engine.block.appendChild(to: page, child: cell)
  return cell
}
```

Apply blur effects to design blocks using CE.SDK's dedicated blur system for softening backgrounds, simulating depth of field, or drawing focus toward specific elements.

![The same photo shown in a 2x2 grid under different blur types: uniform, linear, radial, and mirrored](https://img.ly/docs/cesdk/ios/filters-and-effects/blur-71d642/assets/swift-based.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-blur)

<EngineReferenceNote {...props} />

Unlike stackable effects, blur is a dedicated feature with its own API. Each block supports **exactly one** blur at a time, though the same blur instance can be shared across multiple blocks. CE.SDK provides four blur types: **uniform** for even softening, **linear** and **mirrored** for gradient-based effects along an axis, and **radial** for circular focal points.

## Programmatic Blur Application

Apply, configure, and combine blur directly through the engine's block API.

### Check Blur Support

Not every block type accepts blur, so call `supportsBlur(_:)` before reaching for any of the other blur APIs.

```swift highlight-blur-supportsBlur
guard try engine.block.supportsBlur(uniformCell) else { return }
```

### Create and Apply Blur

Create a blur instance with `createBlur(_:)`, passing the `BlurType` you want. Attach it to a block with `setBlur(_:blurID:)` and turn it on with `setBlurEnabled(_:enabled:)`. Creating a blur does not change the rendered output — the blur has to be attached and enabled first.

```swift highlight-blur-createAndApply
let uniformBlur = try engine.block.createBlur(.uniform)
try engine.block.setBlur(uniformCell, blurID: uniformBlur)
try engine.block.setBlurEnabled(uniformCell, enabled: true)
```

`BlurType` has four cases:

- `.uniform` — `//ly.img.ubq/blur/uniform`
- `.linear` — `//ly.img.ubq/blur/linear`
- `.mirrored` — `//ly.img.ubq/blur/mirrored`
- `.radial` — `//ly.img.ubq/blur/radial`

### Configure Blur Parameters

Each blur type exposes its own set of properties. Configure them with `setFloat(_:property:value:)`. Coordinate properties such as `x`, `y`, `x1`, `y1` are relative values in the range `0.0` – `1.0`, where `(0, 0)` is the top-left of the block and `(1, 1)` is the bottom-right.

### Apply Uniform Blur

The uniform blur (also known as a Gaussian blur) applies consistent softening across the entire block. It has a single parameter, `blur/uniform/intensity`, ranging from `0.0` (no blur) to `1.0` (maximum softness).

```swift highlight-blur-uniform
try engine.block.setFloat(uniformBlur, property: "blur/uniform/intensity", value: 0.8)
```

### Apply Linear Blur

The linear blur creates a directional blur along a line defined by two control points. Moving the control points rotates the blur axis and shifts where the transition occurs.

```swift highlight-blur-linear
let linearBlur = try engine.block.createBlur(.linear)
try engine.block.setFloat(linearBlur, property: "blur/linear/blurRadius", value: 35)
try engine.block.setFloat(linearBlur, property: "blur/linear/x1", value: 0.0)
try engine.block.setFloat(linearBlur, property: "blur/linear/y1", value: 0.3)
try engine.block.setFloat(linearBlur, property: "blur/linear/x2", value: 1.0)
try engine.block.setFloat(linearBlur, property: "blur/linear/y2", value: 0.7)
try engine.block.setBlur(linearCell, blurID: linearBlur)
try engine.block.setBlurEnabled(linearCell, enabled: true)
```

### Apply Radial Blur

The radial blur radiates outward from a center point, keeping a circular inner area sharp. Adjust the sharp region's size with `radius` and the width of the transition band with `gradientRadius`.

```swift highlight-blur-radial
let radialBlur = try engine.block.createBlur(.radial)
try engine.block.setFloat(radialBlur, property: "blur/radial/blurRadius", value: 45)
try engine.block.setFloat(radialBlur, property: "blur/radial/radius", value: 40)
try engine.block.setFloat(radialBlur, property: "blur/radial/gradientRadius", value: 30)
try engine.block.setFloat(radialBlur, property: "blur/radial/x", value: 0.5)
try engine.block.setFloat(radialBlur, property: "blur/radial/y", value: 0.5)
try engine.block.setBlur(radialCell, blurID: radialBlur)
try engine.block.setBlurEnabled(radialCell, enabled: true)
```

### Apply Mirrored Blur

The mirrored blur creates a band of focus with blur on both sides — a tilt-shift style effect. `size` controls the width of the clear band and `gradientSize` controls how quickly the blur ramps up on either side.

```swift highlight-blur-mirrored
let mirroredBlur = try engine.block.createBlur(.mirrored)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/blurRadius", value: 50)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/size", value: 30)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/gradientSize", value: 25)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/x1", value: 0.0)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/y1", value: 0.5)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/x2", value: 1.0)
try engine.block.setFloat(mirroredBlur, property: "blur/mirrored/y2", value: 0.5)
try engine.block.setBlur(mirroredCell, blurID: mirroredBlur)
try engine.block.setBlurEnabled(mirroredCell, enabled: true)
```

## Managing Blur

Inspect the blur already attached to a block, toggle it, share it across blocks, or remove it.

### Read an Applied Blur

Retrieve the blur attached to a block with `getBlur(_:)`, then read or modify its properties with the same setters and `getFloat(_:property:)`.

```swift highlight-blur-readBlur
let currentBlur = try engine.block.getBlur(radialCell)
let currentRadius = try engine.block.getFloat(currentBlur, property: "blur/radial/blurRadius")
print("current radial blur radius: \(currentRadius)")
```

### Enable and Disable Blur

Toggle blur on and off without removing it using `setBlurEnabled(_:enabled:)`. When disabled the blur stays attached to the block and its parameters are preserved for when it is enabled again. Read the current state with `isBlurEnabled(_:)`.

```swift highlight-blur-toggle
try engine.block.setBlurEnabled(uniformCell, enabled: false)
let uniformEnabled = try engine.block.isBlurEnabled(uniformCell)
print("uniform blur enabled: \(uniformEnabled)")
```

### Share a Blur Across Blocks

A single blur instance can be attached to multiple blocks. Create the blur once, then call `setBlur(_:blurID:)` on each block. Changes to the blur's properties update every block that uses it.

```swift highlight-blur-share
let sharedBlur = try engine.block.createBlur(.uniform)
try engine.block.setFloat(sharedBlur, property: "blur/uniform/intensity", value: 0.4)
try engine.block.setBlur(uniformCell, blurID: sharedBlur)
try engine.block.setBlurEnabled(uniformCell, enabled: true)
try engine.block.setBlur(linearCell, blurID: sharedBlur)
try engine.block.setBlurEnabled(linearCell, enabled: true)
```

Attaching a new blur to a block replaces the previous one on that block — a block only ever has one active blur.

### Remove a Blur

To remove a blur permanently, call `destroy(_:)` on the blur block. This frees the blur and detaches it from **every block that was using it**. When you only want to turn a blur off temporarily, prefer `setBlurEnabled(_:enabled:)` instead.

```swift highlight-blur-destroy
let existingBlur = try engine.block.getBlur(mirroredCell)
try engine.block.destroy(existingBlur)
```

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| No blur appears | The block doesn't support blur or blur isn't enabled | Verify with `supportsBlur(_:)` and `isBlurEnabled(_:)` |
| Property changes have no effect | Wrong property key | Check the exact property name — keys begin with `blur/<type>/` |
| Blur looks off-center | Coordinate values outside `0.0` – `1.0` | Confirm each `x`, `y`, `x1`, `y1` value is within range |
| Blur too subtle or too strong | Radius or intensity values | Increase or decrease `blurRadius` (linear, mirrored, radial) or `intensity` (uniform) |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.supportsBlur(_:)` | Check whether a block supports blur |
| `engine.block.createBlur(_:)` | Create a new blur instance of a `BlurType` |
| `engine.block.setBlur(_:blurID:)` | Attach a blur to a block |
| `engine.block.getBlur(_:)` | Get the blur attached to a block |
| `engine.block.setBlurEnabled(_:enabled:)` | Enable or disable the blur on a block |
| `engine.block.isBlurEnabled(_:)` | Check whether the blur on a block is enabled |
| `engine.block.setFloat(_:property:value:)` | Set a blur property |
| `engine.block.getFloat(_:property:)` | Read a blur property |
| `engine.block.getType(_:)` | Get the type identifier of a blur block |
| `engine.block.destroy(_:)` | Destroy a blur, detaching it from every block that used it |

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `blur/uniform/intensity` | Float | `0.5` | Uniform blur strength, `0.0` – `1.0` |
| `blur/linear/blurRadius` | Float | `30` | Linear blur intensity |
| `blur/linear/x1`, `y1` | Float | `0`, `0.5` | Linear blur start point |
| `blur/linear/x2`, `y2` | Float | `1`, `0.5` | Linear blur end point |
| `blur/mirrored/blurRadius` | Float | `30` | Mirrored blur intensity |
| `blur/mirrored/size` | Float | `75` | Width of the unblurred band |
| `blur/mirrored/gradientSize` | Float | `50` | Width of the transition zones |
| `blur/mirrored/x1`, `y1`, `x2`, `y2` | Float | `0`, `0.5`, `1`, `0.5` | Mirrored blur axis points |
| `blur/radial/blurRadius` | Float | `30` | Radial blur intensity |
| `blur/radial/radius` | Float | `75` | Size of the sharp center |
| `blur/radial/gradientRadius` | Float | `50` | Width of the transition band |
| `blur/radial/x`, `y` | Float | `0.5`, `0.5` | Radial blur center point |

## Next Steps

- [Apply Filters and Effects](./apply.md) — Stack visual effects such as adjustments, LUT filters, and duotone alongside blur.
- [Distortion Effects](./distortion.md) — Apply warping and glitch effects to design blocks.
- [Filters & Effects Overview](./overview.md) — Browse every filter and effect CE.SDK provides.
- [Modify Properties](../concepts/blocks.md) — Understand block properties and how to modify them.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
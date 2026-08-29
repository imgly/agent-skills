> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [With a Color Mask](./with-color-mask.md)

---

Remove specific colors from exported images and generate alpha masks using
CE.SDK's color mask export API for print workflows, transparency creation, and
compositing pipelines.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-export-with-color-mask)

When exporting, CE.SDK can remove specific RGB colors by replacing matching pixels with transparency. The export generates two files: the masked image with transparent areas and an alpha mask showing removed pixels.

```swift file=@cesdk_swift_examples/engine-guides-export-with-color-mask/ExportWithColorMask.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func exportWithColorMask(engine: Engine) async throws {
  // Demo scaffolding: build a small scene with two graphic blocks so the
  // exported PNG visibly demonstrates color masking — a pure-red rectangle
  // (which the mask removes) and a blue ellipse (which survives).
  // In your app you would start from a scene already loaded into the editor.
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let registrationMark = try engine.block.create(.graphic)
  try engine.block.setShape(registrationMark, shape: engine.block.createShape(.rect))
  let redFill = try engine.block.createFill(.color)
  try engine.block.setColor(redFill, property: "fill/color/value", color: .rgba(r: 1.0, g: 0.0, b: 0.0, a: 1.0))
  try engine.block.setFill(registrationMark, fill: redFill)
  try engine.block.setPositionX(registrationMark, value: 50)
  try engine.block.setPositionY(registrationMark, value: 50)
  try engine.block.setWidth(registrationMark, value: 200)
  try engine.block.setHeight(registrationMark, value: 200)
  try engine.block.appendChild(to: page, child: registrationMark)

  let artwork = try engine.block.create(.graphic)
  try engine.block.setShape(artwork, shape: engine.block.createShape(.ellipse))
  let blueFill = try engine.block.createFill(.color)
  try engine.block.setColor(blueFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0))
  try engine.block.setFill(artwork, fill: blueFill)
  try engine.block.setPositionX(artwork, value: 300)
  try engine.block.setPositionY(artwork, value: 100)
  try engine.block.setWidth(artwork, value: 400)
  try engine.block.setHeight(artwork, value: 400)
  try engine.block.appendChild(to: page, child: artwork)

  let blobs = try await engine.block.exportWithColorMask(
    page,
    mimeType: .png,
    maskColorR: 1.0,
    maskColorG: 0.0,
    maskColorB: 0.0,
  )
  let maskedImage = blobs[0]
  let alphaMask = blobs[1]

  let exportsDirectory = FileManager.default.temporaryDirectory
  try maskedImage.write(to: exportsDirectory.appendingPathComponent("design.masked.png"))
  try alphaMask.write(to: exportsDirectory.appendingPathComponent("design.alpha.png"))
}
```

Color mask exports work through exact RGB color matching — pixels that precisely match your specified color values (0.0–1.0 range) are removed. This is useful for print workflows (removing registration marks), transparency creation (removing background colors), or generating alpha masks for compositing tools.

## Exporting with Color Masks

Export blocks with color masking using the `exportWithColorMask` method. This method removes pixels matching the specified RGB color from the rendered output and returns both a masked image and an alpha mask.

```swift highlight-exportWithColorMask-export
let blobs = try await engine.block.exportWithColorMask(
  page,
  mimeType: .png,
  maskColorR: 1.0,
  maskColorG: 0.0,
  maskColorB: 0.0,
)
let maskedImage = blobs[0]
let alphaMask = blobs[1]
```

The method accepts the block to export, a `MIMEType`, three RGB color components as `Float` values in the 0.0–1.0 range, and optional `ExportOptions`. This example uses pure red `(1.0, 0.0, 0.0)` to identify and remove registration marks from the design.

The call returns an array of two `Blob` values (a `Blob` is `Foundation.Data`). The first element is the masked image with transparency applied where the specified color was found. The second element is the alpha mask — a black-and-white image showing which pixels were removed (black) and which remained (white).

> **Note:** Color matching is exact and bytewise. Anti-aliased edges between the mask color and another color are not removed, gradient stops that pass near the mask color render normally, and lossy formats like JPEG can shift pixels by a single bit and skip the match. Reserve mask colors for solid fills you control.

### Specifying RGB Color Values

RGB color components in CE.SDK use floating-point values from 0.0 to 1.0, not the 0–255 integer values common in design tools:

- Pure red: `(1.0, 0.0, 0.0)` — Common for registration marks
- Pure magenta: `(1.0, 0.0, 1.0)` — Distinctive marker color
- Pure cyan: `(0.0, 1.0, 1.0)` — Alternative marker color
- Pure yellow: `(1.0, 1.0, 0.0)` — Useful for exclusion zones

When converting from standard 0–255 RGB values, divide each component by 255. For example, RGB(255, 128, 0) becomes `(1.0, 0.502, 0.0)`.

## How to Export with Color Masks

A `Blob` is a `Foundation.Data` instance, so you can persist both outputs with the standard `write(to:)` API. This snippet writes the masked image and alpha mask side-by-side into the temporary directory so you can pick them up from your file pipeline or upload them to a print service.

```swift highlight-exportWithColorMask-write
let exportsDirectory = FileManager.default.temporaryDirectory
try maskedImage.write(to: exportsDirectory.appendingPathComponent("design.masked.png"))
try alphaMask.write(to: exportsDirectory.appendingPathComponent("design.alpha.png"))
```

The masked image is print-ready with the specified color removed. The alpha mask shows exactly where pixels were removed, useful for verification or compositing in external applications.

## API Reference

| Method                                                                                   | Description                                                                                 |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `engine.block.exportWithColorMask(_:mimeType:maskColorR:maskColorG:maskColorB:options:)` | Exports a block with the specified RGB color removed, returning `[maskedImage, alphaMask]`. |
| `engine.block.export(_:mimeType:options:)`                                               | Exports a block without color masking.                                                      |
| `engine.block.createFill(_:)`                                                            | Creates a fill definition that you can attach to a block.                                   |
| `engine.block.setColor(_:property:color:)`                                               | Sets a color value on a fill property.                                                      |

## Next Steps

- [Export Options](./overview.md) — Explore every supported export format and the options each one accepts.
- [Export to PDF](./to-pdf.md) — Produce print-ready PDFs with optional underlayers for spot-color workflows.
- [Partial Export](./partial-export.md) — Export individual blocks or groups instead of the full page.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
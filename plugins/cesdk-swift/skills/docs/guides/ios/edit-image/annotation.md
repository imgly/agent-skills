> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Images](../edit-image.md) > [Annotation](./annotation.md)

---

```swift file=@cesdk_swift_examples/engine-guides-annotation/ImageAnnotation.swift reference-only
import IMGLYEngine

@MainActor
func imageAnnotation(engine: Engine) async throws {
  // Demo scaffolding: a page with a light placeholder rectangle that stands in
  // for an image so the annotations rendered below have something to sit on
  // top of in the captured hero.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let imageArea = try engine.block.create(.graphic)
  try engine.block.setShape(imageArea, shape: engine.block.createShape(.rect))
  let imageAreaFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    imageAreaFill,
    property: "fill/color/value",
    color: .rgba(r: 0.92, g: 0.94, b: 0.96, a: 1.0),
  )
  try engine.block.setFill(imageArea, fill: imageAreaFill)
  try engine.block.setPositionX(imageArea, value: 40)
  try engine.block.setPositionY(imageArea, value: 40)
  try engine.block.setWidth(imageArea, value: 720)
  try engine.block.setHeight(imageArea, value: 520)
  try engine.block.appendChild(to: page, child: imageArea)

  let highlight = try addRectangleAnnotation(engine: engine, page: page)
  _ = try addCircleAnnotation(engine: engine, page: page)
  _ = try addLineAnnotation(engine: engine, page: page)
  _ = try addRedactionBox(engine: engine, page: page)
  try styleRectangleAnnotationAppearance(engine: engine, rectangle: highlight)

  try await engine.captureGuide(page, label: "hero")
}

@MainActor
func addRectangleAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let highlight = try engine.block.create(.graphic)
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(highlight, shape: rectShape)

  try engine.block.setPositionX(highlight, value: 100)
  try engine.block.setPositionY(highlight, value: 100)
  try engine.block.setWidth(highlight, value: 220)
  try engine.block.setHeight(highlight, value: 90)

  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(
    fill,
    property: "fill/color/value",
    color: .rgba(r: 1.0, g: 0.82, b: 0.0, a: 0.4),
  )
  try engine.block.setFill(highlight, fill: fill)

  try engine.block.appendChild(to: page, child: highlight)
  return highlight
}

@MainActor
func addCircleAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let callout = try engine.block.create(.graphic)
  let ellipseShape = try engine.block.createShape(.ellipse)
  try engine.block.setShape(callout, shape: ellipseShape)

  try engine.block.setPositionX(callout, value: 360)
  try engine.block.setPositionY(callout, value: 155)
  try engine.block.setWidth(callout, value: 120)
  try engine.block.setHeight(callout, value: 120)

  try engine.block.setFillEnabled(callout, enabled: false)
  try engine.block.setStrokeEnabled(callout, enabled: true)
  try engine.block.setStrokeColor(callout, color: .rgba(r: 1.0, g: 0.0, b: 0.0, a: 1.0))
  try engine.block.setStrokeWidth(callout, width: 4)

  try engine.block.appendChild(to: page, child: callout)
  return callout
}

@MainActor
func addLineAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let underline = try engine.block.create(.graphic)
  let lineShape = try engine.block.createShape(.line)
  try engine.block.setShape(underline, shape: lineShape)

  try engine.block.setPositionX(underline, value: 85)
  try engine.block.setPositionY(underline, value: 430)
  try engine.block.setWidth(underline, value: 320)
  let lineThickness: Float = 8
  try engine.block.setHeight(underline, value: lineThickness)

  try engine.block.setStrokeEnabled(underline, enabled: true)
  try engine.block.setStrokeColor(underline, color: .rgba(r: 0.05, g: 0.25, b: 0.95, a: 1.0))
  try engine.block.setStrokeWidth(underline, width: lineThickness)

  try engine.block.appendChild(to: page, child: underline)
  return underline
}

@MainActor
func addRedactionBox(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let redaction = try engine.block.create(.graphic)
  try engine.block.setShape(redaction, shape: engine.block.createShape(.rect))

  try engine.block.setPositionX(redaction, value: 500)
  try engine.block.setPositionY(redaction, value: 360)
  try engine.block.setWidth(redaction, value: 180)
  try engine.block.setHeight(redaction, value: 34)

  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(
    fill,
    property: "fill/color/value",
    color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0),
  )
  try engine.block.setFill(redaction, fill: fill)

  try engine.block.appendChild(to: page, child: redaction)
  return redaction
}

@MainActor
func styleRectangleAnnotationAppearance(engine: Engine, rectangle: DesignBlockID) throws {
  try engine.block.setOpacity(rectangle, value: 0.5)

  let shape = try engine.block.getShape(rectangle)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusTL", value: 10)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusTR", value: 10)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusBL", value: 10)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusBR", value: 10)

  try engine.block.setStrokeEnabled(rectangle, enabled: true)
  try engine.block.setStrokeStyle(rectangle, style: .dashed)
  try engine.block.setStrokeWidth(rectangle, width: 3)
  try engine.block.setStrokeColor(rectangle, color: .rgba(r: 0.9, g: 0.35, b: 0.0, a: 1.0))
}

```

Add rectangles, circles, lines, and redaction boxes on top of images or
designs with shape blocks.

![Shape annotations — a translucent yellow rectangle with rounded corners and a dashed orange outline highlights an area, a red ellipse outlines a callout, a thick blue line underlines a region, and a solid black bar covers redacted text](https://img.ly/docs/cesdk/ios/edit-image/annotation-142604/assets/swift-based.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1-rc.0/engine-guides-annotation)

<EngineReferenceNote {...props} />

Annotations in CE.SDK are graphic blocks with shape geometry. Use them to highlight important areas, circle details, underline content, hide sensitive information, or add visual review marks on top of existing page content.

The examples below append annotations to an existing page. Position and dimensions are set on the graphic block, while rectangle-specific properties such as corner radius are set on the attached shape block.

## Add Rectangle Annotation

Create a graphic block, attach a rectangle shape, position it, and give it a semi-transparent color fill. A transparent fill keeps the underlying image or design visible while drawing attention to a region.

```swift highlight-imageAnnotation-rectangle
@MainActor
func addRectangleAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let highlight = try engine.block.create(.graphic)
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(highlight, shape: rectShape)

  try engine.block.setPositionX(highlight, value: 100)
  try engine.block.setPositionY(highlight, value: 100)
  try engine.block.setWidth(highlight, value: 220)
  try engine.block.setHeight(highlight, value: 90)

  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(
    fill,
    property: "fill/color/value",
    color: .rgba(r: 1.0, g: 0.82, b: 0.0, a: 0.4),
  )
  try engine.block.setFill(highlight, fill: fill)

  try engine.block.appendChild(to: page, child: highlight)
  return highlight
}
```

## Add Circle Annotation

Use an ellipse shape for circles and callouts. Disable the fill and enable a stroke when the annotation should outline an item without covering it.

```swift highlight-imageAnnotation-circle
@MainActor
func addCircleAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let callout = try engine.block.create(.graphic)
  let ellipseShape = try engine.block.createShape(.ellipse)
  try engine.block.setShape(callout, shape: ellipseShape)

  try engine.block.setPositionX(callout, value: 360)
  try engine.block.setPositionY(callout, value: 155)
  try engine.block.setWidth(callout, value: 120)
  try engine.block.setHeight(callout, value: 120)

  try engine.block.setFillEnabled(callout, enabled: false)
  try engine.block.setStrokeEnabled(callout, enabled: true)
  try engine.block.setStrokeColor(callout, color: .rgba(r: 1.0, g: 0.0, b: 0.0, a: 1.0))
  try engine.block.setStrokeWidth(callout, width: 4)

  try engine.block.appendChild(to: page, child: callout)
  return callout
}
```

Use equal width and height for a circle. Different values produce an ellipse.

## Add Line Annotation

Use a line shape for underlines, separators, and markup strokes. The block width controls the line length.

```swift highlight-imageAnnotation-line
@MainActor
func addLineAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let underline = try engine.block.create(.graphic)
  let lineShape = try engine.block.createShape(.line)
  try engine.block.setShape(underline, shape: lineShape)

  try engine.block.setPositionX(underline, value: 85)
  try engine.block.setPositionY(underline, value: 430)
  try engine.block.setWidth(underline, value: 320)
  let lineThickness: Float = 8
  try engine.block.setHeight(underline, value: lineThickness)

  try engine.block.setStrokeEnabled(underline, enabled: true)
  try engine.block.setStrokeColor(underline, color: .rgba(r: 0.05, g: 0.25, b: 0.95, a: 1.0))
  try engine.block.setStrokeWidth(underline, width: lineThickness)

  try engine.block.appendChild(to: page, child: underline)
  return underline
}
```

Line shapes use stroke width for the visible thickness. Keep the block height in sync with the stroke width so the line bounds match the rendered stroke.

## Add a Visual Redaction Overlay

To visually cover content in flattened image output, place a solid rectangle over the sensitive area. Use an opaque fill so the covered content is not visible in the final flattened export.

The original block remains underneath the overlay in the editable CE.SDK scene and in layered or reusable outputs. For sensitive content, remove, crop, or replace the source content before sharing an editable scene.

```swift highlight-imageAnnotation-redaction
@MainActor
func addRedactionBox(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let redaction = try engine.block.create(.graphic)
  try engine.block.setShape(redaction, shape: engine.block.createShape(.rect))

  try engine.block.setPositionX(redaction, value: 500)
  try engine.block.setPositionY(redaction, value: 360)
  try engine.block.setWidth(redaction, value: 180)
  try engine.block.setHeight(redaction, value: 34)

  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(
    fill,
    property: "fill/color/value",
    color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0),
  )
  try engine.block.setFill(redaction, fill: fill)

  try engine.block.appendChild(to: page, child: redaction)
  return redaction
}
```

## Style Annotation Appearance

Common rectangle styling changes include opacity, rounded corners, and dashed strokes. Apply opacity and stroke settings to the graphic block, then update rectangle-specific corner geometry on the attached shape block.

```swift highlight-imageAnnotation-style
@MainActor
func styleRectangleAnnotationAppearance(engine: Engine, rectangle: DesignBlockID) throws {
  try engine.block.setOpacity(rectangle, value: 0.5)

  let shape = try engine.block.getShape(rectangle)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusTL", value: 10)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusTR", value: 10)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusBL", value: 10)
  try engine.block.setFloat(shape, property: "shape/rect/cornerRadiusBR", value: 10)

  try engine.block.setStrokeEnabled(rectangle, enabled: true)
  try engine.block.setStrokeStyle(rectangle, style: .dashed)
  try engine.block.setStrokeWidth(rectangle, width: 3)
  try engine.block.setStrokeColor(rectangle, color: .rgba(r: 0.9, g: 0.35, b: 0.0, a: 1.0))
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Shape not visible | Check that the block is appended to the page and that fill or stroke is enabled. |
| Shape positioned incorrectly | Verify x and y positions on the graphic block, not the shape block. |
| Stroke not showing | Enable stroke and set a stroke width greater than `0`. |
| Rounded corners not changing | Set the corner radius properties on the rectangle shape returned by `getShape(_:)`. |
| Shape covers too much content | Lower block opacity or use a stroke-only annotation. |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.create(_:)` | Create a design block such as a graphic block (`.graphic`). |
| `engine.block.createShape(_:)` | Create a shape block such as `.rect`, `.ellipse`, or `.line`. |
| `engine.block.setShape(_:shape:)` | Attach a shape block to a graphic block. |
| `engine.block.setPositionX(_:value:)` | Set the graphic block's x position. |
| `engine.block.setPositionY(_:value:)` | Set the graphic block's y position. |
| `engine.block.setWidth(_:value:)` | Set the graphic block's width. |
| `engine.block.setHeight(_:value:)` | Set the graphic block's height. |
| `engine.block.createFill(_:)` | Create a fill block such as `.color`. |
| `engine.block.setFill(_:fill:)` | Assign a fill to a graphic block. |
| `engine.block.setFillEnabled(_:enabled:)` | Enable or disable the graphic block's fill. |
| `engine.block.setStrokeEnabled(_:enabled:)` | Enable or disable the graphic block's stroke. |
| `engine.block.setStrokeColor(_:color:)` | Set the graphic block's stroke color. |
| `engine.block.setStrokeWidth(_:width:)` | Set the graphic block's stroke width. |
| `engine.block.setStrokeStyle(_:style:)` | Set a stroke style such as `.dashed`. |
| `engine.block.setOpacity(_:value:)` | Set block opacity from `0` to `1`. |
| `engine.block.getShape(_:)` | Get the shape block attached to a graphic block. |
| `engine.block.setColor(_:property:color:)` | Set a typed color property. |
| `engine.block.setFloat(_:property:value:)` | Set float shape properties such as rectangle corner radius. |
| `engine.block.appendChild(to:child:)` | Add the annotation block to a page or container. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `fill/color/value` | Color | Solid color of a color fill. |
| `shape/rect/cornerRadiusTL` | Float | Top-left corner radius of a rectangle shape. |
| `shape/rect/cornerRadiusTR` | Float | Top-right corner radius of a rectangle shape. |
| `shape/rect/cornerRadiusBL` | Float | Bottom-left corner radius of a rectangle shape. |
| `shape/rect/cornerRadiusBR` | Float | Bottom-right corner radius of a rectangle shape. |

## Next Steps

- [Transform Images](./transform.md) — Crop, resize, rotate, scale, or flip image content.
- [Edit Shapes](../stickers-and-shapes/create-edit/edit-shapes.md) — Modify shape geometry, color, size, position, and corner radius.
- [Grouping](../create-composition/group-and-ungroup.md) — Group multiple annotations together.
- [Layer Management](../create-composition/layer-management.md) — Control annotation stacking order.




---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
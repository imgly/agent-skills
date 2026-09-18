> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Exclusion Areas](./exclusion-areas.md)

---

An exclusion area marks a region of a page that content must stay clear of — an envelope window, a book spine, a glue flap, an address panel on a mailer. This guide covers creating an exclusion area, putting the artwork of the obstruction into it, controlling how it looks on the canvas, and cutting it out of an export.

An exclusion area is authoring geometry. It is visible while you design and stays out of the exported file, so a region you must respect no longer has to be faked with a locked graphic.

## Creating an Exclusion Area

Create an exclusion area with the `exclusionArea` block type and append it to a page:

```swift
let exclusionArea = try engine.block.create(.exclusionArea)
try engine.block.setPositionX(exclusionArea, value: 20)
try engine.block.setPositionY(exclusionArea, value: 20)
try engine.block.setWidth(exclusionArea, value: 40)
try engine.block.setHeight(exclusionArea, value: 40)
try engine.block.appendChild(to: page, child: exclusionArea)
```

A new exclusion area is a rectangle with a stripe fill (`//ly.img.ubq/fill/stripe`), so it is visible as soon as you create it. The stripes leave their gaps transparent, so the exclusion area marks the region without hiding what is behind it.

An exclusion area is a graphic. It takes a shape, a fill, a stroke, effects and a blur, so you can put the artwork of the obstruction into it. Assigning another fill replaces the stripes:

```swift
let fill = try engine.block.createFill(.image)
try engine.block.setString(
  fill,
  property: "fill/image/imageFileURI",
  value: "https://img.ly/static/ubq_samples/sample_1.jpg"
)
try engine.block.setFill(exclusionArea, fill: fill)
```

Because an exclusion area takes any shape a graphic takes, a round window or a die cut outline is an exclusion area with that shape assigned:

```swift
try engine.block.setShape(exclusionArea, shape: engine.block.createShape(.ellipse))
```

## Appearance

The engine washes every exclusion area in `page/exclusionAreaFillColor` and frames it in `page/exclusionAreaFrameColor`.

```swift
try engine.editor.setSettingColor(
  "page/exclusionAreaFillColor",
  r: 0.79, g: 0.12, b: 0.4, a: 0.35
)
```

Both are editor settings rather than block properties, so they apply to every exclusion area in the scene and neither reaches an export. A fully transparent `page/exclusionAreaFrameColor` hides the frame, and a fully transparent `page/exclusionAreaFillColor` hides the wash. The stripes are the exclusion area's fill, so neither setting changes them.

Reach the stripes of one exclusion area through its fill:

```swift
let stripes = try engine.block.getFill(exclusion area)
try engine.block.setColor(
  stripes,
  property: "fill/stripe/color",
  r: 0.79, g: 0.12, b: 0.4, a: 0.25
)
try engine.block.setFloat(stripes, property: "fill/stripe/width", value: 4)
try engine.block.setFloat(stripes, property: "fill/stripe/gap", value: 4)
try engine.block.setFloat(stripes, property: "fill/stripe/angle", value: 90)
```

`fill/stripe/width` and `fill/stripe/gap` are in pixels at the resolution of the scene, so they keep their size when you scale the exclusion area or change the design unit, and `fill/stripe/angle` is in degrees, where 0 stands the stripes upright and 90 lays them flat.

## Exclusion Areas and Export

An exclusion area is authoring state, so it is left out of an export. Set `includedInExport` to `true` on the exclusion area to put its artwork in the file. The guide colors still stay out:

```swift
try engine.block.setIncludedInExport(exclusionArea, enabled: true)
```

The stripes are the exclusion area's fill, so an exclusion area that still has the fill it was created with brings its stripes into the file. Assign the artwork of the obstruction to the exclusion area to export that in place of the stripes.

Set `exclusionArea/punchOut` to `true` to cut the exclusion area out of an export instead. The page and everything on it get a hole where the exclusion area is, so a die cut window in the design becomes a window in the exported file:

```swift
try engine.block.setBool(exclusionArea, property: "exclusionArea/punchOut", value: true)
```

The hole is transparent, which a print workflow reads as an absence of ink rather than as white. Punch-out is off by default, and the canvas keeps showing the content either way.

An exclusion area never changes the size of an export. An exclusion area that hangs over the edge of a page cannot grow the exported page, and an exclusion area parented to the scene does not grow an exported scene unless you opt it into the export.

## Selection

An exclusion area is the author's to move and resize. An adopter cannot select one, because a block created in the creator role carries no selection scope. Take the exclusion area out of reach in every role with:

```swift
try engine.editor.setSelectionEnabled(exclusionArea, enabled: false)
```

## Holding Content Out

An exclusion area marks a region, and on its own it moves nothing. Set `exclusionArea/constrains` to `true` for a region the engine must hold content out of, such as an envelope window or a die cut:

```swift
try engine.block.setBool(exclusion area, property: "exclusion area/constrains", value: true)
```

The exclusion area is then a wall while the user drags or resizes a block. The block stops against the exclusion area's own shape and slides along its edge, and the user drags around the exclusion area to reach the other side. An exclusion area shaped as a ring keeps blocks out of the ring and leaves the hole free, which is how a forbidden outer edge of a page is expressed. The exclusion area the block is up against draws a border on the canvas, so the user sees what stopped them. An exclusion area that marks without constraining draws that border too.

The engine never moves a block on its own, so a block that already overlaps an exclusion area stays where it is, and a call through the API is never constrained. Ask which blocks overlap an exclusion area with:

```swift
let offending = try engine.block.findAllInExclusionAreas()
```

## Limitations

Arrow keys are not constrained, and a block added through the API is placed wherever it is asked for. An exclusion area snaps by its bounding box while it constrains by its shape, so a curved exclusion area snaps as a rectangle.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.create(.exclusionArea)` | Create an exclusion area. |
| `engine.block.setShape(_:shape:)` | Give the exclusion area a non-rectangular outline. |
| `engine.block.setFill(_:fill:)` | Put the artwork of the obstruction into the exclusion area. |
| `engine.block.getFill(_:)` | Reach the stripe fill the exclusion area was created with. |
| `engine.block.setIncludedInExport(_:enabled:)` | Put the exclusion area's artwork into an export. |
| `engine.block.setBool(_:property:value:)` | Cut the exclusion area out of an export with `exclusionArea/punchOut`, or hold blocks out of it with `exclusionArea/constrains`. |
| `engine.block.findAllInExclusionAreas()` | List the blocks that overlap a constraining exclusion area. |
| `engine.editor.setSettingColor(_:r:g:b:a:)` | Set the wash and frame colors for every exclusion area. |
| `engine.editor.setSelectionEnabled(_:enabled:)` | Take the exclusion area out of reach in every role. |

## Next Steps

- [Pages](./pages.md) — page margins and the safety inset.
- [Blocks](./blocks.md) — block types, shapes and fills.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
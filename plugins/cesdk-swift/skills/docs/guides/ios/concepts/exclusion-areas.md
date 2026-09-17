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

A new exclusion area is a rectangle with no fill and shows a striped pattern, so it is visible as soon as you create it.

An exclusion area is a graphic. It takes a shape, a fill, a stroke, effects and a blur, so you can put the artwork of the obstruction into it. Assigning a fill replaces the stripes:

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

The engine washes every exclusion area in `page/exclusionAreaFillColor` and frames it in `page/exclusionAreaFrameColor`. The stripes on an exclusion area with no fill take the same color as the wash, at a lower alpha.

```swift
try engine.editor.setSettingColor(
  "page/exclusionAreaFillColor",
  r: 0.79, g: 0.12, b: 0.4, a: 0.35
)
```

Both are editor settings rather than block properties, so they apply to every exclusion area in the scene and neither reaches an export. A fully transparent `page/exclusionAreaFrameColor` hides the frame, and a fully transparent `page/exclusionAreaFillColor` hides the wash and the stripes.

## Exclusion Areas and Export

An exclusion area is authoring state, so it is left out of an export. Set `includedInExport` to `true` on the exclusion area to put its artwork in the file. The guide colors still stay out:

```swift
try engine.block.setIncludedInExport(exclusionArea, enabled: true)
```

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

## Limitations

An exclusion area marks a region. It does not yet stop a block from being moved into one.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.create(.exclusionArea)` | Create an exclusion area. |
| `engine.block.setShape(_:shape:)` | Give the exclusion area a non-rectangular outline. |
| `engine.block.setFill(_:fill:)` | Put the artwork of the obstruction into the exclusion area. |
| `engine.block.setIncludedInExport(_:enabled:)` | Put the exclusion area's artwork into an export. |
| `engine.block.setBool(_:property:value:)` | Cut the exclusion area out of an export with `exclusionArea/punchOut`. |
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
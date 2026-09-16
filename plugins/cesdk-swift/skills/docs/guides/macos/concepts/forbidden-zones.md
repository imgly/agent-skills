> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Forbidden Zones](./forbidden-zones.md)

---

A forbidden zone marks a region of a page that content must stay clear of — an envelope window, a book spine, a glue flap, an address panel on a mailer. This guide covers creating a zone, putting the artwork of the obstruction into it, controlling how it looks on the canvas, and cutting it out of an export.

A zone is authoring geometry. It is visible while you design and stays out of the exported file, so a region you must respect no longer has to be faked with a locked graphic.

## Creating a Zone

Create a zone with the `zone` block type and append it to a page:

```swift
let zone = try engine.block.create(.zone)
try engine.block.setPositionX(zone, value: 20)
try engine.block.setPositionY(zone, value: 20)
try engine.block.setWidth(zone, value: 40)
try engine.block.setHeight(zone, value: 40)
try engine.block.appendChild(to: page, child: zone)
```

A new zone is a rectangle with no fill and shows a striped pattern, so it is visible as soon as you create it.

A zone is a graphic. It takes a shape, a fill, a stroke, effects and a blur, so you can put the artwork of the obstruction into it. Assigning a fill replaces the stripes:

```swift
let fill = try engine.block.createFill(.image)
try engine.block.setString(
  fill,
  property: "fill/image/imageFileURI",
  value: "https://img.ly/static/ubq_samples/sample_1.jpg"
)
try engine.block.setFill(zone, fill: fill)
```

Because a zone takes any shape a graphic takes, a round window or a die cut outline is a zone with that shape assigned:

```swift
try engine.block.setShape(zone, shape: engine.block.createShape(.ellipse))
```

## Appearance

The engine washes every zone in `page/forbiddenZoneFillColor` and frames it in `page/forbiddenZoneFrameColor`. The stripes on a zone with no fill take the same color as the wash, at a lower alpha.

```swift
try engine.editor.setSettingColor(
  "page/forbiddenZoneFillColor",
  r: 0.79, g: 0.12, b: 0.4, a: 0.35
)
```

Both are editor settings rather than block properties, so they apply to every zone in the scene and neither reaches an export. A fully transparent `page/forbiddenZoneFrameColor` hides the frame, and a fully transparent `page/forbiddenZoneFillColor` hides the wash and the stripes.

## Zones and Export

A zone is authoring state, so it is left out of an export. Set `includedInExport` to `true` on the zone to put its artwork in the file. The guide colors still stay out:

```swift
try engine.block.setIncludedInExport(zone, enabled: true)
```

Set `zone/punchOut` to `true` to cut the zone out of an export instead. The page and everything on it get a hole where the zone is, so a die cut window in the design becomes a window in the exported file:

```swift
try engine.block.setBool(zone, property: "zone/punchOut", value: true)
```

The hole is transparent, which a print workflow reads as an absence of ink rather than as white. Punch-out is off by default, and the canvas keeps showing the content either way.

A zone never changes the size of an export. A zone that hangs over the edge of a page cannot grow the exported page, and a zone parented to the scene does not grow an exported scene unless you opt it into the export.

## Selection

A zone is the author's to move and resize. An adopter cannot select one, because a block created in the creator role carries no selection scope. Take the zone out of reach in every role with:

```swift
try engine.editor.setSelectionEnabled(zone, enabled: false)
```

## Limitations

A zone marks a region. It does not yet stop a block from being moved into one.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.create(.zone)` | Create a forbidden zone. |
| `engine.block.setShape(_:shape:)` | Give the zone a non-rectangular outline. |
| `engine.block.setFill(_:fill:)` | Put the artwork of the obstruction into the zone. |
| `engine.block.setIncludedInExport(_:enabled:)` | Put the zone's artwork into an export. |
| `engine.block.setBool(_:property:value:)` | Cut the zone out of an export with `zone/punchOut`. |
| `engine.editor.setSettingColor(_:r:g:b:a:)` | Set the wash and frame colors for every zone. |
| `engine.editor.setSelectionEnabled(_:enabled:)` | Take the zone out of reach in every role. |

## Next Steps

- [Pages](./pages.md) — page margins and the safety area.
- [Blocks](./blocks.md) — block types, shapes and fills.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
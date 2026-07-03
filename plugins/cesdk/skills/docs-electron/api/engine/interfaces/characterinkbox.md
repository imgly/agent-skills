> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Tight ink-paint bounding box of a single grapheme, in global scene
coordinates. Returned by `block.getTextCharacterInkBoxes`. The baseline
Y is reported separately because it does not equal `y + height` (the
box is the tight ink rect; the baseline anchors glyph descenders).

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `x` | `number` | Global X of the tight ink rect (left edge, Y-down scene space). |
|  `y` | `number` | Global Y of the tight ink rect (top edge, Y-down scene space). |
|  `width` | `number` | Width of the tight ink rect. |
|  `height` | `number` | Height of the tight ink rect. |
|  `baselineY` | `number` | Global Y of the glyph baseline. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
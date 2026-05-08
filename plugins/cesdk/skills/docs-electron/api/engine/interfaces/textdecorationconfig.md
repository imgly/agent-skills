> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Configuration for text decorations on a text run.

All active decoration lines share the same style and thickness.
An optional underline color override can be set; overline and strikethrough
always use the text color.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `lines` | [`TextDecorationLine`](./api/engine/type-aliases/textdecorationline.md)\[] | The active decoration line types. Use `['None']` to clear all decorations. When `'None'` is present, all other values are ignored. |
|  `style?` | [`TextDecorationStyle`](./api/engine/type-aliases/textdecorationstyle.md) | The style of the decoration lines. Defaults to 'Solid'. |
|  `underlineColor?` | [`Color`](./api/engine/type-aliases/color.md) | Optional color override for underlines only. Uses the text color if not set. Overline and strikethrough always use the text color. |
|  `underlineThickness?` | `number` | Multiplier for the underline thickness. Defaults to 1.0. |
|  `underlineOffset?` | `number` | Relative offset applied to the underline position as a multiplier on the font-default distance. 0 = font default, positive = proportionally further from baseline, negative = proportionally closer. The actual position is computed as `fontDefault * (1 + underlineOffset)`. Defaults to 0.0. |
|  `skipInk?` | `boolean` | When true, underlines skip over glyph descenders (skip-ink). Defaults to true. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
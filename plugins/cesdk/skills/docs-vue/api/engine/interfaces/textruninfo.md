> This is one page of the CE.SDK Vue `@cesdk/engine` API reference. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a single contiguous text run with uniform formatting.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `from` | `number` | Start grapheme index (inclusive). |
|  `to` | `number` | End grapheme index (exclusive). |
|  `text` | `string` | The text content of this run. |
|  `color` | [`Color`](./api/engine/type-aliases/color.md) | The text color. |
|  `fontWeight` | [`FontWeight`](./api/engine/type-aliases/fontweight.md) | The font weight. |
|  `fontStyle` | [`FontStyle`](./api/engine/type-aliases/fontstyle.md) | The font style. |
|  `fontSize` | `number` | The font size in points. |
|  `textCase` | [`TextCase`](./api/engine/type-aliases/textcase.md) | The text case transformation. |
|  `typeface` | [`Typeface`](./api/engine/interfaces/typeface.md) | The typeface used by this run. |
|  `resolvedFontFileUri` | `string` | The resolved font file URI. |
|  `textDecoration` | [`TextDecorationConfig`](./api/engine/interfaces/textdecorationconfig.md) | The text decoration configuration of this run. |
|  `kerning` | `number` | Additional kerning offset in em units. |


---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
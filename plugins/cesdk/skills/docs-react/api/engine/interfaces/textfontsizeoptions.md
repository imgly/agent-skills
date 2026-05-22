> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for text font size operations with unit support.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `unit?` | [`FontSizeUnit`](./api/engine/type-aliases/fontsizeunit.md) | The unit of the font size. Defaults to the scene's `fontSizeUnit` (configured via `engine.scene.setFontSizeUnit()`), which itself defaults to `'Point'`. |
|  `from?` | `number` | The start index of the UTF-16 range. Defaults to -1 (start of selection/text) |
|  `to?` | `number` | The end index of the UTF-16 range. Defaults to -1 (end of selection/text) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
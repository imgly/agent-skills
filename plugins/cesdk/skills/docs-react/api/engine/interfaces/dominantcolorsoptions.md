> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for `BlockAPI.getDominantColors`.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `count?` | `number` | `5` | Number of dominant colors to extract. The returned palette may contain fewer entries for images with very little variation, and is empty when `count` is `0`. |
|  `ignoreWhite?` | `boolean` | `false` | If `true`, near-white pixels are excluded from the analysis. Useful when analyzing images on white backgrounds to avoid the background dominating the result. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
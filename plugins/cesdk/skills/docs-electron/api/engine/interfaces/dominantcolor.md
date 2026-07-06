> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A single color extracted from the rendered appearance of a block.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `r` | `number` | Red component in sRGB, normalized to the range \[0, 1]. |
|  `g` | `number` | Green component in sRGB, normalized to the range \[0, 1]. |
|  `b` | `number` | Blue component in sRGB, normalized to the range \[0, 1]. |
|  `weight` | `number` | Share of analyzed pixels represented by this color, in the range \[0, 1]. Higher values indicate a more prominent color. The sum of weights returned by a single `BlockAPI.getDominantColors` call is `1.0`. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
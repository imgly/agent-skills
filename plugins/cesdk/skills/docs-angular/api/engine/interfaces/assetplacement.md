> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Where the block created from an asset is placed.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `parent?` | `number` | The block that the new block is added to. Omit it to use the current page. |
|  `center?` | `object` | The center of the new block, in design units relative to `parent`. Both values must be finite. Omit it to place the block automatically. |
| `center.x` | `number` | - |
| `center.y` | `number` | - |


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
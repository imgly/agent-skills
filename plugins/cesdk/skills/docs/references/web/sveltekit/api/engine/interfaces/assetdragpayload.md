> This is one page of the CE.SDK SvelteKit `@cesdk/engine` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The payload of the `asset.drag` action: the `dragstart` event and the dragged asset.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `event` | `object` | The `dragstart` event, from the DOM or from a framework that wraps it. |
| `event.dataTransfer` | `DataTransfer` | - |
|  `asset` | [`CompleteAssetResult`](./api/engine/interfaces/completeassetresult.md) | A result of `findAssets` or `fetchAsset`, which carries its asset source. |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Vanilla JS/TS `@cesdk/engine` API reference. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Return type of a `findAssets` query.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`AssetResult`](./api/engine/interfaces/assetresult.md) | [`AssetResult`](./api/engine/interfaces/assetresult.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `assets` | `T`\[] | The assets in the requested page |
|  `currentPage` | `number` | The current, requested page |
|  `nextPage?` | `number` | The next page to query if it exists |
|  `total` | `number` | How many assets are there in total for the current query regardless of the page |


---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
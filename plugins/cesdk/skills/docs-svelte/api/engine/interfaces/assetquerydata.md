> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Defines a request for querying assets

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `query?` | `string` | A query string used for (fuzzy) searching of labels and tags |
|  `page` | `number` | The current page queried for paginated views. |
|  `tags?` | `string` | `string`\[] | Tags are searched with the query parameter, but this search is fuzzy. If one needs to get assets with exactly the tag (from a tag cloud or filter) this query parameter should be used. |
|  `groups?` | [`AssetGroups`](./api/engine/type-aliases/assetgroups.md) | Query only these groups |
|  `excludeGroups?` | [`AssetGroups`](./api/engine/type-aliases/assetgroups.md) | Filter out assets with this groups |
|  `locale?` | `string` | Choose the locale of the labels and tags for localized search and filtering. For local asset sources, labels and tags are resolved using a fallback chain: requested locale → "en" → first available entry → empty default. |
|  `perPage` | `number` | The number of results queried. How many assets shall be returned regardless of the total number of assets available. Together with `page` this can be used for pagination. |
|  `sortingOrder?` | [`SortingOrder`](./api/engine/type-aliases/sortingorder.md) | The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source. |
|  `sortKey?` | `string` | The key that identifies the meta data value to sort by or 'id' to sort by the asset ID. If empty, the assets are sorted by the index. |
|  `sortActiveFirst?` | `boolean` | Sort assets that are marked as active first. |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
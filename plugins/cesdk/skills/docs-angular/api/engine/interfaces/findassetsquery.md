> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a query for finding assets.

The `FindAssetsQuery` interface provides a set of properties that describe a query for finding
assets, including the number of assets per page, the page number, the query string, the tags,
the groups, the excluded groups, the locale, the sorting order, the sort key, and whether to
sort active assets first.

Methods for working with queries for finding assets.

## Properties

| Property | Type |
| ------ | ------ |
|  `perPage` | `number` |
|  `page` | `number` |
|  `query` | `string` |
|  `tags` | `string`\[] |
|  `groups` | `string`\[] |
|  `excludeGroups` | `string`\[] |
|  `locale` | `string` |
|  `sortingOrder` | [`SortingOrder`](./api/engine/type-aliases/sortingorder.md) |
|  `sortKey` | `string` |
|  `sortActiveFirst` | `boolean` |


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
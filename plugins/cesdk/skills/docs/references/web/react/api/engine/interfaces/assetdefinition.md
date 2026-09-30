> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Definition of an asset used if an asset is added to an asset source.

## Extends

- [`Asset`](./api/engine/interfaces/asset.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `id` | `string` | The unique id of this asset. | [`Asset`](./api/engine/interfaces/asset.md).[`id`](./api/engine/interfaces/asset.md) |
|  `groups?` | [`AssetGroups`](./api/engine/type-aliases/assetgroups.md) | Groups of the asset. | [`Asset`](./api/engine/interfaces/asset.md).[`groups`](./api/engine/interfaces/asset.md) |
|  `meta?` | [`AssetMetaData`](./api/engine/type-aliases/assetmetadata.md) | Asset-specific and custom meta information | [`Asset`](./api/engine/interfaces/asset.md).[`meta`](./api/engine/interfaces/asset.md) |
|  `payload?` | [`AssetPayload`](./api/engine/interfaces/assetpayload.md) | Structured asset-specific data | [`Asset`](./api/engine/interfaces/asset.md).[`payload`](./api/engine/interfaces/asset.md) |
|  `label?` | `Record`\<[`Locale`](./api/engine/type-aliases/locale.md), `string`> | Label used to display in aria-label and as a tooltip. Will be also searched in a query and should be localized | - |
|  `tags?` | `Record`\<[`Locale`](./api/engine/type-aliases/locale.md), `string`\[]> | Tags for this asset. Can be used for filtering, but is also useful for free-text search. Since the label is searched as well as used for tooltips you do not want to overdo it, but still add things which are searched. Thus, it should be localized similar to the `label`. | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
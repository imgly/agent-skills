> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Single asset result of a query from the engine.

## Extends

- [`Asset`](./api/engine/interfaces/asset.md)

## Extended by

- [`CompleteAssetResult`](./api/engine/interfaces/completeassetresult.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `id` | `string` | The unique id of this asset. | [`Asset`](./api/engine/interfaces/asset.md).[`id`](./api/engine/interfaces/asset.md) |
|  `groups?` | [`AssetGroups`](./api/engine/type-aliases/assetgroups.md) | Groups of the asset. | [`Asset`](./api/engine/interfaces/asset.md).[`groups`](./api/engine/interfaces/asset.md) |
|  `meta?` | [`AssetMetaData`](./api/engine/type-aliases/assetmetadata.md) | Asset-specific and custom meta information | [`Asset`](./api/engine/interfaces/asset.md).[`meta`](./api/engine/interfaces/asset.md) |
|  `payload?` | [`AssetPayload`](./api/engine/interfaces/assetpayload.md) | Structured asset-specific data | [`Asset`](./api/engine/interfaces/asset.md).[`payload`](./api/engine/interfaces/asset.md) |
|  `locale?` | `string` | The locale of the label and tags | - |
|  `label?` | `string` | The label of the result. Used for description and tooltips. | - |
|  `tags?` | `string`\[] | The tags of this asset. Used for filtering and free-text searching. | - |
|  `active?` | `boolean` | If the asset is marked as active, i.e., used in a currently selected element. | - |
|  `credits?` | `object` | Credits for the artist of the asset | - |
| `credits.name` | `string` | - | - |
| `credits.url?` | `string` | - | - |
|  `license?` | `object` | License for this asset. Overwrites the source license if present | - |
| `license.name` | `string` | - | - |
| `license.url?` | `string` | - | - |
|  `utm?` | `object` | UTM parameters for the links inside the credits | - |
| `utm.source?` | `string` | - | - |
| `utm.medium?` | `string` | - | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
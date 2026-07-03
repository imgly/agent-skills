> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Asset results that are returned from the engine.

They contain additional information about the context of the asset.

## Extends

- [`AssetResult`](./api/engine/interfaces/assetresult.md)

## Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `id` | `string` | The unique id of this asset. | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`id`](./api/engine/interfaces/assetresult.md) |
|  `groups?` | [`AssetGroups`](./api/engine/type-aliases/assetgroups.md) | Groups of the asset. | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`groups`](./api/engine/interfaces/assetresult.md) |
|  `meta?` | [`AssetMetaData`](./api/engine/type-aliases/assetmetadata.md) | Asset-specific and custom meta information | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`meta`](./api/engine/interfaces/assetresult.md) |
|  `payload?` | [`AssetPayload`](./api/engine/interfaces/assetpayload.md) | Structured asset-specific data | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`payload`](./api/engine/interfaces/assetresult.md) |
|  `locale?` | `string` | The locale of the label and tags | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`locale`](./api/engine/interfaces/assetresult.md) |
|  `label?` | `string` | The label of the result. Used for description and tooltips. | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`label`](./api/engine/interfaces/assetresult.md) |
|  `tags?` | `string`\[] | The tags of this asset. Used for filtering and free-text searching. | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`tags`](./api/engine/interfaces/assetresult.md) |
|  `credits?` | `object` | Credits for the artist of the asset | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`credits`](./api/engine/interfaces/assetresult.md) |
| `credits.name` | `string` | - | - | - |
| `credits.url?` | `string` | - | - | - |
|  `license?` | `object` | License for this asset. Overwrites the source license if present | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`license`](./api/engine/interfaces/assetresult.md) |
| `license.name` | `string` | - | - | - |
| `license.url?` | `string` | - | - | - |
|  `utm?` | `object` | UTM parameters for the links inside the credits | - | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`utm`](./api/engine/interfaces/assetresult.md) |
| `utm.source?` | `string` | - | - | - |
| `utm.medium?` | `string` | - | - | - |
|  `context` | `object` | Context how an asset was added or shall be used in the future. This is added to all assets coming from the engine. | - | - |
| `context.sourceId` | `string` | - | - | - |
|  `active` | `boolean` | This is optional in `AssetResult` but always present here | [`AssetResult`](./api/engine/interfaces/assetresult.md).[`active`](./api/engine/interfaces/assetresult.md) | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
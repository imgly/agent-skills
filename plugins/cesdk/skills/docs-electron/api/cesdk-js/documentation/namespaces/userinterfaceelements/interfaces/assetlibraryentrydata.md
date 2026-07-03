> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing the data configuration for an asset library entry.

- `id`: The unique identifier for the asset library entry.
- `sourceIds`: An array of source IDs associated with the asset library entry, or a function that returns an array of source IDs.
- `sceneMode`:

## Deprecated

Since v1.72. Optional configuration for the scene mode. Not needed for new scenes.

- `excludeGroups`: Optional array of group IDs to exclude from the asset library entry.
- `includeGroups`: Optional array of group IDs to include in the asset library entry.
- `title`: Optional title for the asset library entry, which can be a string or a function returning a string or undefined.
- `canAdd`: Optional boolean or function indicating whether the asset can be added to the source.
- `canRemove`: Optional boolean or function indicating whether the asset can be removed from the source.

## Extended by

- [`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`id`~~ | `string` | - |
|  ~~`sourceIds`~~ | `string`\[] | ((`context`) => `string`\[]) | - |
|  ~~`sceneMode?`~~ | `any` | **Deprecated** Since v1.72. Scene mode no longer affects engine behavior. Not setting this will make the entry available for all scenes. |
|  ~~`excludeGroups?`~~ | `string`\[] | - |
|  ~~`includeGroups?`~~ | `string`\[] | - |
|  ~~`title?`~~ | `string` | ((`options`) => `string`) | - |
|  ~~`canAdd?`~~ | `boolean` | ((`sourceId`) => `boolean`) | If `true` an upload button will be shown and the uploaded file will be added to the source. If a function is used it will be called with the current asset source id. The asset source needs to support `addAsset`. |
|  ~~`canRemove?`~~ | `boolean` | ((`sourceId`) => `boolean`) | If `true` the asset can be removed from the asset source. If a function is used it will be called with the current asset source id. The asset source needs to support `removeAsset`. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type DeleteAssetAction = (params) => void | Promise<void>;
```

Action function for deleting an asset from an asset source.

The default implementation opens a confirmation dialog and, on confirm,
calls `engine.asset.removeAssetFromSource(sourceId, asset.id)` followed by
`engine.asset.assetSourceContentsChanged(sourceId)`. Register a custom
implementation to replace the dialog content, swap in a custom dialog, or
change the deletion behavior entirely. The asset and its source id are
provided so handlers can derive per-asset context (e.g. metadata, page
number) for their custom UI.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `sourceId`: `string`; `asset`: [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md); } | The asset to delete and the id of its source |
| `params.sourceId` | `string` | - |
| `params.asset` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | - |

## Returns

`void` | `Promise`\<`void`>

A promise that resolves when the delete operation is complete, or void for synchronous operations


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
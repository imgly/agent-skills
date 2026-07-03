> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetLibraryPanelPayload = object;
```

Represents the payload for the asset library panel in the Creative Editor SDK.
This interface defines the title, entries, and placement options for the asset library panel.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `title?` | `string` | `string`\[] | - |
|  `entries?` | `string`\[] | - |
|  `applyAssetContext?` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | Context for asset application. Passed directly to engine.asset.apply() when an asset is selected. |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
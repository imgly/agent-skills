> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Provides context for replacing asset library entries, including selected blocks and default entry IDs.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `selectedBlocks` | `object`\[] | - |
|  `defaultEntryIds` | `string`\[] | - |
|  `replaceIntent?` | `"shape"` | `"fill"` | The intent of the replacement operation. - `'shape'`: User explicitly wants to replace the shape (e.g., from shape options panel) - `'fill'`: User wants to replace the fill content - `undefined`: No explicit intent, system determines based on block properties |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Provides context for replacing asset library entries, including the selected blocks and the
default entries (each may carry per-entry source exclusions).

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `selectedBlocks` | `object`\[] | - |
|  `defaultEntryIds` | [`AssetLibraryEntryInput`](./api/cesdk-js/type-aliases/assetlibraryentryinput.md)\[] | - |
|  `replaceIntent?` | `"shape"` | `"fill"` | `"textStyle"` | `"captionStyle"` | The intent of the replacement operation. - `'shape'`: User explicitly wants to replace the shape (e.g., from shape options panel) - `'fill'`: User wants to replace the fill content - `'textStyle'`: User wants to apply a text style preset - `'captionStyle'`: User wants to apply a caption style preset - `undefined`: No explicit intent, system determines based on block properties |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
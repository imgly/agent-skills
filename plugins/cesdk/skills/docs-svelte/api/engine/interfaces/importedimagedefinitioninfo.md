> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

**`Experimental`**

The definition attached to an image fill.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `colorSpace` | [`ImportedImageColorSpace`](./api/engine/type-aliases/importedimagecolorspace.md) | **`Experimental`** The color space the engine decodes the samples in. |
|  `declaredColorSpace` | [`ImportedImageColorSpace`](./api/engine/type-aliases/importedimagecolorspace.md) | **`Experimental`** The color space the source file names. |
|  `profileContentHash` | `string` | **`Experimental`** The content hash of the ICC profile, or an empty string without one. |
|  `decode` | `number`\[] | **`Experimental`** PDF `/Decode` ranges, or an empty array for the identity mapping. |
|  `colorTransform?` | `number` | **`Experimental`** PDF `/ColorTransform`, if one was set. |
|  `renderingIntent?` | [`ColorRenderingIntent`](./api/engine/enumerations/colorrenderingintent.md) | **`Experimental`** The rendering intent for this image, if one was set. |
|  `importerRecord` | `string` | **`Experimental`** Data the importer keeps with the definition. |
|  `importerRecordFormat` | `string` | **`Experimental`** The format of `importerRecord`. |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
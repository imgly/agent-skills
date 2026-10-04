> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

**`Experimental`**

The color definition found beside an imported JPEG's bytes.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `colorSpace` | [`ImportedImageColorSpace`](./api/engine/type-aliases/importedimagecolorspace.md) | **`Experimental`** The color space the engine decodes the samples in. `ICCBased` requires `iccProfile`. |
|  `declaredColorSpace?` | [`ImportedImageColorSpace`](./api/engine/type-aliases/importedimagecolorspace.md) | **`Experimental`** The color space the source file names. Defaults to `colorSpace` and does not change rendering. `ICCBased` is allowed only when `colorSpace` is `ICCBased`. |
|  `iccProfile?` | `Uint8Array` | **`Experimental`** Gray, RGB or CMYK ICC profile bytes. Required for `ICCBased` and not allowed otherwise. |
|  `decode?` | `number`\[] | **`Experimental`** PDF `/Decode` ranges: a minimum and a maximum per component. A sample of 0 maps to the minimum and 255 to the maximum, clamped to \[0, 1]. Omit for the identity mapping. |
|  `colorTransform?` | `number` | **`Experimental`** PDF `/ColorTransform`: 0 reads the samples as stored, 1 converts them from YCbCr or YCCK. Omit to follow the JPEG header. |
|  `renderingIntent?` | [`ColorRenderingIntent`](./api/engine/enumerations/colorrenderingintent.md) | **`Experimental`** The rendering intent for this image. Omit to use the scene's rendering intent. |
|  `importerRecord?` | `string` | **`Experimental`** Data the importer keeps with the definition, at most 64 KiB. The engine does not read it. |
|  `importerRecordFormat?` | `string` | **`Experimental`** The format of `importerRecord`. Required when a record is present. |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
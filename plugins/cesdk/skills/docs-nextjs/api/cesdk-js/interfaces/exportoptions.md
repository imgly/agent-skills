> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Specifies options for exporting design blocks to various formats.

The `ExportOptions` interface provides a set of properties that control the
behavior and quality of the exported content. These options include settings
for JPEG, WebP, PNG, and PDF exports, as well as options for resizing and
adding underlayers.

## Extends

- `Pick`\<[`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md),
  | `"pngCompressionLevel"`
  | `"jpegQuality"`
  | `"webpQuality"`
  | `"exportPdfWithHighCompatibility"`
  | `"pdfImageQuality"`
  | `"exportPdfWithUnderlayer"`
  | `"underlayerSpotColorName"`
  | `"underlayerOffset"`
  | `"onProgress"`>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `pngCompressionLevel` | `EngineExportOptions` | - | `Pick.pngCompressionLevel` |
|  `jpegQuality` | `EngineExportOptions` | - | `Pick.jpegQuality` |
|  `webpQuality` | `EngineExportOptions` | - | `Pick.webpQuality` |
|  `exportPdfWithHighCompatibility` | `EngineExportOptions` | - | `Pick.exportPdfWithHighCompatibility` |
|  `pdfImageQuality` | `EngineExportOptions` | - | `Pick.pdfImageQuality` |
|  `exportPdfWithUnderlayer` | `EngineExportOptions` | - | `Pick.exportPdfWithUnderlayer` |
|  `underlayerSpotColorName` | `EngineExportOptions` | - | `Pick.underlayerSpotColorName` |
|  `underlayerOffset` | `EngineExportOptions` | - | `Pick.underlayerOffset` |
|  `onProgress` | `EngineExportOptions` | - | `Pick.onProgress` |
|  `mimeType` | `MimeType_2` | The mime type of the exported blob | - |
|  `pages?` | `number`\[] | The pages to export with the selected page as the default | - |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
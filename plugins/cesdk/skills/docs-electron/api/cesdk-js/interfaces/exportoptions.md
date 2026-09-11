> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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
  | `"exportPdfWithUnderlayer"`
  | `"underlayerSpotColorName"`
  | `"underlayerOffset"`>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `pngCompressionLevel` | `EngineExportOptions` | - | `Pick.pngCompressionLevel` |
|  `jpegQuality` | `EngineExportOptions` | - | `Pick.jpegQuality` |
|  `webpQuality` | `EngineExportOptions` | - | `Pick.webpQuality` |
|  `exportPdfWithHighCompatibility` | `EngineExportOptions` | - | `Pick.exportPdfWithHighCompatibility` |
|  `exportPdfWithUnderlayer` | `EngineExportOptions` | - | `Pick.exportPdfWithUnderlayer` |
|  `underlayerSpotColorName` | `EngineExportOptions` | - | `Pick.underlayerSpotColorName` |
|  `underlayerOffset` | `EngineExportOptions` | - | `Pick.underlayerOffset` |
|  `mimeType` | `MimeType_2` | The mime type of the exported blob | - |
|  `pages?` | `number`\[] | The pages to export with the selected page as the default | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
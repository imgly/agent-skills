> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Specifies options for exporting design blocks to various formats.

The `UBQExportOptions` interface provides a set of properties that control the
behavior and quality of the exported content. These options include settings
for JPEG, WebP, PNG, and PDF exports, as well as options for resizing and
adding underlayers.

## Properties

| Property | Type |
| ------ | ------ |
|  `jpegQuality` | `number` |
|  `webpQuality` | `number` |
|  `pngCompressionLevel` | `number` |
|  `useTargetSize` | `boolean` |
|  `targetWidth` | `number` |
|  `targetHeight` | `number` |
|  `exportPdfWithHighCompatibility` | `boolean` |
|  `exportPdfWithUnderlayer` | `boolean` |
|  `underlayerSpotColorName` | `string` |
|  `underlayerOffset` | `number` |
|  `underlayerRenderRatio` | `number` |
|  `underlayerMaxError` | `number` |
|  `allowTextOverhang` | `boolean` |
|  `exportPdfWithDeviceCMYK` | `boolean` |
|  `pdfImageQuality` | `number` |


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
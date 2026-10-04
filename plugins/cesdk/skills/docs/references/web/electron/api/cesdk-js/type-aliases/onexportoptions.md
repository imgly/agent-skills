> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type OnExportOptions = AddImageOptions & object;
```

This interface extends the base ExportOptions with additional information about the export,
including which design blocks were exported and the mimeType.

## Type Declaration

| Name | Type |
| ------ | ------ |
| `mimeType` | `Required`\<[`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md)>\[`"mimeType"`] |
| `exportedBlocks?` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md)\[] |

## See

- ExportOptions For base export configuration options
- DesignBlockId For design block identifier type


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
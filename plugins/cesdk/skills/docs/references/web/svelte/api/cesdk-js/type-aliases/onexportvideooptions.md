> This is one page of the CE.SDK Svelte `@cesdk/cesdk-js` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type OnExportVideoOptions = AddImageOptions & object;
```

This interface extends the base VideoExportOptions with additional information about the export,
including which design blocks were exported and the mimeType.

## Type Declaration

| Name | Type |
| ------ | ------ |
| `mimeType` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) |
| `exportedBlocks?` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md)\[] |

## See

- VideoExportOptions For base export configuration options
- DesignBlockId For design block identifier type


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
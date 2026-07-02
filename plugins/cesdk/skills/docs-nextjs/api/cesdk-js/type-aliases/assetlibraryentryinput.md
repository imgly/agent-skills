> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetLibraryEntryInput = 
  | AssetEntryId
  | {
  entry: AssetEntryId;
  excludeSourceIds?: string[];
};
```

A reference to an asset library entry to display. Either an entry ID, or an object that names the
entry plus source IDs to hide for this display only — for example a replace panel that shows a
library with a non-applicable source hidden (the text "Styles" panel shows `ly.img.text` but
hides its text-combinations source). This per-display `excludeSourceIds` is distinct from the
entry's own `includeGroups`/`excludeGroups`, which apply wherever the entry is shown.


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
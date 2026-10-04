> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
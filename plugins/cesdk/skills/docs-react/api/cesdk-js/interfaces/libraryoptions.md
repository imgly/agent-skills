> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a library.

The `LibraryOptions` interface provides a set of properties that control the
behavior and appearance of a library. These options include settings for the
entries, select handler, and searchable state.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `entries` | | `string`\[] | [`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md)\[] | `AssetLibraryEntry[]` is deprecated and will be removed in the future; use `string[]` instead to pass a list of the asset library entries. Read more about adding asset library entries in the (documentation)\[https://img.ly/docs/cesdk/ui/customization/api/assetLibraryEntry/]. |
|  `onSelect?` | (`asset`) => `Promise`\<`void`> | - |
|  `searchable?` | `boolean` | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
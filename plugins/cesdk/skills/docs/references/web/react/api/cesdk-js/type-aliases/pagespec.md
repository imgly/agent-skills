> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type PageSpec = 
  | PageDimensions
  | PageAssetReference
  | AddImageOptions & object;
```

A page can be specified as direct dimensions, an asset source reference,
or an asset object (e.g., from engine.asset.fetchAsset()).
All variants optionally accept a `color` to set the page fill color.

## Type Declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `color?` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | Fill color for the page. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
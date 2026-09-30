> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type DefaultAssetSourceId = 
  | "ly.img.sticker"
  | "ly.img.vectorpath"
  | "ly.img.colors.defaultPalette"
  | "ly.img.filter.lut"
  | "ly.img.filter.duotone"
  | "ly.img.effect"
  | "ly.img.blur"
  | "ly.img.typeface"
  | "ly.img.page.presets"
  | "ly.img.page.presets.video"
  | "ly.img.crop.presets"
  | "ly.img.text"
  | "ly.img.captionPresets";
```

Represents the default asset source IDs used in the editor.

## Deprecated

This function uses legacy v4 asset source IDs. Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI() directly.


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
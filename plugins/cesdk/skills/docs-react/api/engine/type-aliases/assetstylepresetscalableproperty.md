> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetStylePresetScalableProperty = 
  | "stroke/width"
  | "dropShadow/offset/x"
  | "dropShadow/offset/y"
  | "dropShadow/blurRadius/x"
  | "dropShadow/blurRadius/y"
  | "backgroundColor/cornerRadius";
```

A length property a style preset may scale with the block's font size (see [AssetStylePreset.scaleWithFontSize](./api/engine/interfaces/assetstylepreset.md)). Restricted to the decoration lengths for which scaling is
meaningful — stroke width, drop-shadow offset/blur and the caption background corner radius — not
arbitrary numeric properties like `rotation` or `opacity`.


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
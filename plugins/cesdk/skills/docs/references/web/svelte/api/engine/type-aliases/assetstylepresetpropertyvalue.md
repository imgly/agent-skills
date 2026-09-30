> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetStylePresetPropertyValue = 
  | boolean
  | number
  | string
  | RGBColor
  | RGBAColor
  | null;
```

A value a style preset can set on a property: a boolean, number, string (including enum values) or
an RGB(A) color. Colors must be RGB(A) (`{ r, g, b, a? }`); CMYK and spot colors are not supported in
presets. Structs and source sets cannot be set from a preset. A `null` value is ignored for regular
properties; for the virtual `text/path` property it clears the baseline path.


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
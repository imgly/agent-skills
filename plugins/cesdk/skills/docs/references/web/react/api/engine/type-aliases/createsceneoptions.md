> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type CreateSceneOptions = object;
```

Options for creating a video scene.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `page?` | `object` | The page options |
| `page.size` | | `number` | \{ `width`: `number`; `height`: `number`; } | The size of the page |
| `page.color?` | [`Color`](./api/engine/type-aliases/color.md) | The background color of the page |
|  `designUnit?` | [`DesignUnit`](./api/engine/type-aliases/designunit.md) | The design unit of the new scene. Defaults to `Pixel`. |
|  `fontSizeUnit?` | [`SceneFontSizeUnit`](./api/engine/type-aliases/scenefontsizeunit.md) | The unit in which font sizes for `setTextFontSize` and `getTextFontSizes` are interpreted. If omitted, it is paired with `designUnit`: `Pixel` scenes get `Pixel`, all other scenes get `Point`. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
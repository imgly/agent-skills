> This is one page of the CE.SDK Vue `@cesdk/engine` API reference. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetMetaData = object & Record<string, unknown>;
```

Generic asset information

## Type Declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `mimeType?` | `string` | The mime type of this asset or the data behind the asset's uri. |
| `blockType?` | `string` | The type id of the design block that should be created from this asset. |
| `fillType?` | `string` | - |
| `shapeType?` | `string` | - |
| `kind?` | `string` | - |
| `uri?` | `string` | - |
| `thumbUri?` | `string` | - |
| `previewUri?` | `string` | - |
| `sourceSet?` | [`Source`](./api/engine/interfaces/source.md)\[] | - |
| `filename?` | `string` | - |
| `vectorPath?` | `string` | - |
| `width?` | `number` | - |
| `height?` | `number` | - |
| `duration?` | `string` | - |
| `effectType?` | [`EffectType`](./api/engine/type-aliases/effecttype.md) | - |
| `blurType?` | [`BlurType`](./api/engine/type-aliases/blurtype.md) | - |
| `looping?` | `boolean` | - |


---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
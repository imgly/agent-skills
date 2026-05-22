> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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
| `effectType?` | `string` | Effect kind hint. Widened to `string` so this metadata stays cross-binding (the narrow `EffectType` union remains the source of truth for `BlockAPI.createEffect`). |
| `blurType?` | `string` | Blur kind hint. Widened to `string` for the same reason as `effectType` — the narrow `BlurType` union still gates `BlockAPI.createBlur`. |
| `looping?` | `boolean` | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
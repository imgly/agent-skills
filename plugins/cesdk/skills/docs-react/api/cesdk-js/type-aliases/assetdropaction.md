> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetDropAction = (payload) => void | Promise<void>;
```

Action function for an asset dropped on the canvas.

The default implementation replaces the content of `target` with the asset, or adds the asset
to `page` centered on the drop point. Register a custom implementation to change what a drop
does, for example to handle assets from your own drag source.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`AssetDropPayload`](./api/cesdk-js/interfaces/assetdroppayload.md) | Where the asset was released |

## Returns

`void` | `Promise`\<`void`>

A promise that resolves when the drop is handled, or void for synchronous operations


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
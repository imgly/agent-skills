> This is one page of the CE.SDK Vanilla JS/TS `@cesdk/cesdk-js` API reference. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetDragAction = (payload) => void;
```

Action function that starts a drag of an asset onto the canvas.

Run it in a `dragstart` handler. It writes the drag data that names the asset, so a drop on
the canvas runs `asset.drop` for it. A browser accepts drag data only inside `dragstart`, so a
custom implementation must write it synchronously.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | The `dragstart` event and the dragged asset |

## Returns

`void`


---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
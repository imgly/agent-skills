> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
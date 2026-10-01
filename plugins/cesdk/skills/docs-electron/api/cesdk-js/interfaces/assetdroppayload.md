> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Where a dragged asset was released on the canvas.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `sourceId` | `string` | The asset source of the dropped asset. |
|  `assetId` | `string` | The dropped asset. |
|  `target` | `any` | The block below the drop that can take the asset, or `null`. |
|  `page` | `any` | The page below the drop, or `null`. |
|  `pageX` | `number` | The drop point in the coordinates of `page`, in design units. `0` when `page` is `null`. |
|  `pageY` | `number` | The drop point in the coordinates of `page`, in design units. `0` when `page` is `null`. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
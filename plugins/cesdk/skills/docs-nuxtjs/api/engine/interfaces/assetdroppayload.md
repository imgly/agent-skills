> This is one page of the CE.SDK Nuxt.js `@cesdk/engine` API reference. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Where a dragged asset was released on the canvas. The payload of the `asset.drop`
action.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `sourceId` | `string` | The asset source of the dropped asset. Empty when the drag named no asset. |
|  `assetId` | `string` | The dropped asset. Empty when the drag named no asset. |
|  `target` | `number` | The block below the drop that can take the asset, or `null`. |
|  `page` | `number` | The page below the drop, or `null`. |
|  `pageX` | `number` | The drop point in the coordinates of `page`, in design units. `0` when `page` is `null`. |
|  `pageY` | `number` | The drop point in the coordinates of `page`, in design units. `0` when `page` is `null`. |


---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
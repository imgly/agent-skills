> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type PanelPayload<T> = T extends "//ly.img.panel/assetLibrary" ? AssetLibraryPanelPayload : T extends "//ly.img.panel/inspector/pageResize" ? PageResizePanelPayload : UnknownPanelPayload;
```

Represents the payload for a panel in the Creative Editor SDK.
This type defines the payload based on the panel ID.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`PanelId`](./api/cesdk-js/type-aliases/panelid.md) |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
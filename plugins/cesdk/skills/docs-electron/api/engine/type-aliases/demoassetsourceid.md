> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type DemoAssetSourceId = 
  | "ly.img.template"
  | "ly.img.image.upload"
  | "ly.img.video.upload"
  | "ly.img.audio.upload"
  | "ly.img.image"
  | "ly.img.video"
  | "ly.img.video.template"
  | "ly.img.audio"
  | "ly.img.textComponents";
```

Represents the default demo asset source IDs used in the editor.

## Deprecated

This function uses legacy v3 demo asset source IDs. Please migrate to v4 asset sources using engine.asset.addLocalAssetSourceFromJSONURI() directly.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
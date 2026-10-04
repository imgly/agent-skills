> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
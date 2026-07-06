> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetEntryId = 
  | "ly.img.templates"
  | "ly.img.upload"
  | "ly.img.image"
  | "ly.img.video"
  | "ly.img.audio"
  | "ly.img.text"
  | "ly.img.vector.shape"
  | "ly.img.sticker"
  | "ly.img.colors"
  | "ly.img.typefaces"
  | "ly.img.pagePresets"
  | "ly.img.cropPresets"
  | "ly.img.library.captionPresets"
  | "ly.img.animations"
  | "ly.img.textAnimations"
  | string & object;
```

Asset library entry IDs that can be used with asset library APIs.
Includes built-in entry IDs registered by the SDK, and allows custom entry IDs.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
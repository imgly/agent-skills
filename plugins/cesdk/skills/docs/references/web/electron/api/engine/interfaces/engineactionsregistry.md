> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The typed action ids. The engine types the actions it implements here. Augment via
`declare module '@cesdk/engine'` to type your own ids and get autocomplete on register/run,
while custom string ids stay allowed.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `asset.drop` | (`payload`) => `void` | `Promise`\<`void`> | Runs when a dragged asset is released on the canvas. The engine's action replaces the content of `target`, or adds the asset to `page` centered on the drop point. |
|  `video.decode.checkSupport` | () => `Promise`\<`boolean`> | Whether this platform can play video, which takes an H.264 decoder. Measures the codecs first when nothing has, so the answer is never "nobody asked yet". |
|  `video.encode.checkSupport` | () => `Promise`\<`boolean`> | Whether this platform can export video, which takes an H.264 video encoder and an AAC audio encoder. Measures the codecs first when nothing has. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
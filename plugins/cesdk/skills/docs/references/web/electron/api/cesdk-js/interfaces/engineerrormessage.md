> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Customer-facing copy resolved from a thrown engine error.

`message` is the short headline (only set for a structured [EngineError](./api/cesdk-js/variables/addimageoptions.md));
`description` is the longer body. Either may be absent — callers fall back to
their own contextual copy for whichever half is missing.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `message?` | `string` | Short headline. Set only for a [EngineError](./api/cesdk-js/variables/addimageoptions.md) with a catalog code. |
|  `description?` | `string` | Longer body: the engine `hint` for catalog errors, else the raw message. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
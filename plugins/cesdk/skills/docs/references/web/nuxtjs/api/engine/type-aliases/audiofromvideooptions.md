> This is one page of the CE.SDK Nuxt.js `@cesdk/engine` API reference. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AudioFromVideoOptions = object;
```

Options for configuring audio extraction from video operations.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `keepTrimSettings?` | `boolean` | `true` | If true, the audio block will have the same duration, trim length, and trim offset as the source video. If false, the full audio track is extracted without trim settings. |
|  `muteOriginalVideo?` | `boolean` | `true` | If true, mutes the audio of the original video fill block. |


---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
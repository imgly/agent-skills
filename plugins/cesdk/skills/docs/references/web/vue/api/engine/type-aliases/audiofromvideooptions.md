> This is one page of the CE.SDK Vue `@cesdk/engine` API reference. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AudioFromVideoOptions = object;
```

Options for configuring audio extraction from video operations.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `keepTrimSettings?` | `boolean` | `true` | If true, the audio block plays like the source video. It has the same duration and trim, and it copies the playback speed, looping, volume, mute state and audio fades. Above 3x, the audio is force muted like the video. If false, the full audio track is extracted with the default playback settings. |
|  `muteOriginalVideo?` | `boolean` | `true` | If true, mutes the audio of the original video fill block. |


---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
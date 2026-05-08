> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AudioExportOptions = object;
```

Represents the options for exporting audio.

Defines the possible options for exporting audio.

- 'mimeType': The MIME type of the output audio file.
- 'onProgress': A callback which reports on the progress of the export.
- 'timeOffset': The time offset in seconds relative to the target block.
- 'duration': The duration in seconds of the final audio.
- 'sampleRate': The sample rate of the exported audio.
- 'numberOfChannels': The number of channels of the exported audio.
- 'skipEncoding': Skip encoding (audio data will be returned immediately even if not compatible with target MIME type).

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `mimeType?` | [`AudioMimeType`](./api/engine/type-aliases/audiomimetype.md) | `'audio/wav'` | The MIME type of the output audio file. |
|  `onProgress?` | (`numberOfRenderedFrames`, `numberOfEncodedFrames`, `totalNumberOfFrames`) => `void` | `undefined` | A callback which reports on the progress of the export. |
|  `timeOffset?` | `number` | `0` | The time offset in seconds relative to the target block. |
|  `duration?` | `number` | `The duration of the block.` | The duration in seconds of the final audio. |
|  `sampleRate?` | `number` | `48000` | The sample rate of the exported audio. |
|  `numberOfChannels?` | `number` | `2` | The number of channels of the exported audio. |
|  `skipEncoding?` | `boolean` | `false` | Skip encoding (audio data will be returned immediately even if not compatible with target MIME type). |
|  `abortSignal?` | `AbortSignal` | `undefined` | An AbortSignal that can be used to cancel the audio export operation. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
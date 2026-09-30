> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Limitations](./limitations.md)

---

CE.SDK processes video on the Android device, so playback, editing, and export
performance depend on the available memory, GPU, and Android media codecs.
This reference helps you plan video workflows that stay within those device
limits.

<EngineReferenceNote {...props} />

Plan around the native device capabilities that vary across Android phones and
tablets: codec availability, maximum texture size, available memory, and the
amount of work required for the chosen resolution, frame rate, and duration.

## Resolution Limits

CE.SDK supports up to 4K UHD playback and export on capable Android hardware.
Higher resolutions need more GPU memory and processing time, so validate export
presets on the device classes your app supports.

Use `engine.editor.getMaxExportSize()` before exporting large videos. The value
is the maximum supported dimension in pixels for both width and height. When
Android returns `Int.MAX_VALUE`, the limit is unknown, not unlimited. Apply your
own conservative caps instead of comparing requested dimensions against that
sentinel.

## Duration Limits

Video duration affects editing responsiveness, memory use, and export time.
CE.SDK is optimized for short-form content while still allowing longer videos
when the device has enough resources.

- Stories and reels up to 2 minutes are the recommended target for smooth
  editing.
- Videos up to 10 minutes can work well on modern Android devices, with longer
  export times.
- Longer videos are possible but should be tested on representative devices
  before shipping.

For long-form workflows, split content into shorter scenes or segments, reduce
preview resolution where possible, and keep export progress visible in your UI.

## Frame Rate Support

Frame rate affects preview playback, rendering, and encoding. 30 FPS at 1080p is
the safest baseline for broad Android support.

60 FPS exports and high-resolution combinations depend on hardware acceleration
and encoder support. When you expose advanced export presets, pair frame rate
choices with conservative resolution and bitrate defaults so older devices can
still complete the export.

Variable frame rate source videos can introduce timing precision issues. For
predictable edits and exports, transcode variable frame rate footage to constant
frame rate before importing it.

## Supported Codecs

Android codec support is provided through the device media stack. A format can
be listed as supported by CE.SDK and still fail on a specific device if the
decoder or encoder is missing or cannot handle the requested resolution.

### Video Codecs

H.264/AVC in `.mp4` containers is the most reliable choice for Android import,
playback, and export.

H.265/HEVC in `.mp4` or `.mov` containers is device-dependent. Use it only after
testing on the Android devices you target, and provide an H.264 fallback when
you cannot control the source media.

### Audio Codecs

MP3 is supported as a standalone `.mp3` file or inside supported video
containers.

AAC is supported in `.m4a`, `.mp4`, or `.mov` containers. For exported MP4
videos, the default `ExportVideoOptions.audioBitrate = 0` lets CE.SDK choose 128
kbps for stereo AAC. Raise the audio bitrate only after testing the target
device class.

## Runtime Restrictions

The restrictions to plan for are:

- Device-specific encoder and decoder availability through Android media codecs
- GPU texture size limits that cap maximum export dimensions
- Memory pressure from high-resolution video, multiple tracks, effects, and
  overlays
- Thermal throttling or battery-saving modes that can slow long exports

## Hardware Requirements

Device capabilities directly affect video editing performance. Recent Android
phones and tablets provide the best results, especially for 4K, 60 FPS, or
multi-track projects.

### Recommended Hardware

Use phones and tablets released in the last 4 years as the practical baseline
for smooth video editing and export.

### GPU Considerations

Hardware acceleration improves decoding, rendering, and encoding performance.
The most visible gains appear when exporting high-resolution video, high frame
rates, or scenes with multiple video layers.

Integrated mobile GPUs can handle common short-form editing workflows. For
heavier compositions, reduce the target resolution, frame rate, or number of
simultaneous video tracks.

## Memory Constraints

Video processing consumes device memory. Large source files, multiple tracks,
effects, and high export dimensions all increase memory pressure.

Use `engine.editor.getUsedMemory()` and `engine.editor.getAvailableMemory()` as
coarse telemetry while profiling video workflows. On Android,
`getUsedMemory()` is based on the app process memory reported by the system, and
`getAvailableMemory()` reports currently available system memory. The engine
marks both values as testing and debugging signals whose results can be
unreliable, so treat them as heuristics instead of a hard preload or export
gate.

## Export Size Limitations

Export dimensions are bounded by the current device's rendering and encoding
capabilities. Always query `engine.editor.getMaxExportSize()` before offering or
starting large exports.

Both `targetWidth` and `targetHeight` must stay at or below the reported finite
limit. If the value is `Int.MAX_VALUE`, treat the limit as unknown and use
app-defined presets such as a 1080p baseline and 4K only for tested device
classes. An export can still fail for memory or codec reasons, so combine the
size check with conservative defaults for frame rate and bitrate.

## Troubleshooting

Common Android video limitation issues:

| Issue                                | Cause                                                                                     | Solution                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Export size is rejected              | Requested width or height exceeds the device limit                                        | Query `getMaxExportSize()` and reduce `targetWidth` or `targetHeight`            |
| Export fails on a specific device    | The Android encoder cannot handle the requested codec, resolution, frame rate, or bitrate | Use H.264 MP4, lower the preset, and test on that device class                   |
| Playback stutters at high resolution | The device cannot decode or render the source fast enough                                 | Use lower-resolution previews or reduce the number of simultaneous video tracks  |
| Large videos cause memory pressure   | Source files, overlays, or effects exceed available memory                                | Shorten the video, split it into segments, or lower source and export resolution |
| HEVC media does not import or play   | The device lacks compatible HEVC decoder support                                          | Prefer H.264 MP4 sources or provide an H.264 fallback                            |
| Long exports are slow                | Resolution, frame rate, duration, and effects exceed the device's comfortable workload    | Use shorter segments, lower export presets, and display export progress          |

## API Reference

| Method                                                                                                   | Description                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `engine.editor.getMaxExportSize()`                                                                       | Returns the current device's finite maximum export dimension in pixels, or `Int.MAX_VALUE` when Android cannot report a limit. |
| `engine.editor.getAvailableMemory()`                                                                     | Returns coarse available system memory in bytes for testing, debugging, and telemetry.                                         |
| `engine.editor.getUsedMemory()`                                                                          | Returns coarse app process memory usage in bytes for testing, debugging, and telemetry.                                        |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_)` | Exports a page timeline to video and reports rendering and encoding progress.                                                  |

## Next Steps

Explore related guides to build complete Android video workflows:

- [Size Limits](../export-save-publish/export/size-limits.md) — Understand and configure limits on exported file dimensions or data size
- [Video Overview](./overview.md) — Fundamentals of editing video with CE.SDK
- [File Format Support](../file-format-support.md) — Detailed compatibility matrix for
  images, videos, and audio
- [Export Overview](../export-save-publish/export/overview.md) — Fundamentals of exporting from CE.SDK



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
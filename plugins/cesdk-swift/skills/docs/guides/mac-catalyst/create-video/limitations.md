> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Limitations](./limitations.md)

---

CE.SDK processes video on the device, providing privacy and responsiveness
while operating within hardware and memory constraints. This reference covers
resolution limits, codec support, and platform considerations so you can plan
video workflows that run reliably on Apple devices.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-limitations)

Client-side video processing keeps user content on the device and avoids round trips to a server, but it depends on the device's CPU, GPU, and memory. Understanding these constraints helps you build apps that perform reliably across iPhone, iPad, and Mac configurations.

```swift file=@cesdk_swift_examples/engine-guides-limitations/Limitations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func limitations(engine: Engine) async throws {
  let maxExportSize = try engine.editor.getMaxExportSize()

  let usedMemory = try engine.editor.getUsedMemory()
  let usedMemoryMB = Double(usedMemory) / (1024 * 1024)

  let availableMemory = try? engine.editor.getAvailableMemory()
  let availableMemoryMB = availableMemory.map { Double($0) / (1024 * 1024) }

  let memoryUtilization: Double? = availableMemory.map { available in
    let total = Double(usedMemory + available)
    return total > 0 ? (Double(usedMemory) / total) * 100 : 0
  }

  let desiredWidth = 3840
  let desiredHeight = 2160
  let limitKnown = maxExportSize < Int(Int32.max)
  let canExport4K = limitKnown
    && desiredWidth <= maxExportSize
    && desiredHeight <= maxExportSize

  _ = usedMemoryMB
  _ = availableMemoryMB
  _ = memoryUtilization
  _ = limitKnown
  _ = canExport4K
}
```

This guide covers resolution and duration limits, codec support, hardware considerations, and the engine APIs you can call at runtime to query the current device's capabilities.

## Resolution Limits

Video resolution depends on the device's hardware and available memory. CE.SDK supports up to 4K UHD for playback and export on capable devices.

Import resolution has no fixed cap, but very large videos consume proportional amounts of memory while decoding and editing. Playback and export at 4K require enough GPU bandwidth and texture memory to keep up with the source.

Query the maximum export size before initiating an export to avoid failures:

```swift highlight-limitations-queryMaxExportSize
let maxExportSize = try engine.editor.getMaxExportSize()
```

`getMaxExportSize()` returns a single pixel limit that applies to both width and height. When the engine cannot read a cap from the active render target it returns `Int32.max` as a sentinel meaning the limit is unknown — not unlimited. Treat this case conservatively: the actual GPU and memory ceilings still apply, and exports may fail even when both dimensions are below `Int32.max`. Gate the feasibility check on the sentinel before comparing dimensions:

```swift highlight-limitations-checkExportFeasibility
let desiredWidth = 3840
let desiredHeight = 2160
let limitKnown = maxExportSize < Int(Int32.max)
let canExport4K = limitKnown
  && desiredWidth <= maxExportSize
  && desiredHeight <= maxExportSize
```

## Duration Limits

Video duration affects editing responsiveness and export time. CE.SDK optimizes for short-form content while supporting longer videos with performance trade-offs.

Stories and reels up to 2 minutes are fully supported with smooth editing performance. Videos up to 10 minutes work well on modern hardware, with export times typically around one minute for this length. Longer videos are technically possible but may impact editing responsiveness on less capable devices.

For long-form content, consider these approaches:

- Split longer videos into shorter segments for editing
- Use lower resolution previews during editing, then export at full quality
- Test on target devices to establish acceptable duration limits for your use case

## Frame Rate Support

Frame rate affects both playback smoothness and export performance. Hardware acceleration significantly impacts high frame rate capabilities.

30 FPS at 1080p is broadly supported and provides smooth playback on most devices. 60 FPS and high-resolution combinations benefit from hardware acceleration through VideoToolbox on Apple platforms. Variable frame rate sources may have timing precision limitations — for best results, consider transcoding variable frame rate content to constant frame rate before importing.

## Supported Codecs

CE.SDK supports widely-adopted video and audio codecs through the system's media frameworks.

### Video Codecs

- **H.264 / AVC** in `.mp4` containers — universal support
- **H.265 / HEVC** in `.mp4` containers — supported natively on Apple platforms via VideoToolbox

### Audio Codecs

- **MP3** in `.mp3` files or within `.mp4` containers
- **AAC** in `.m4a`, `.mp4`, or `.mov` containers

Codec decoding and encoding run on the system's media frameworks, so support is consistent across iPhone, iPad, and Mac as long as the underlying OS version provides the codec.

## Hardware Requirements

Device capabilities directly affect video processing performance. CE.SDK scales with available hardware resources.

### Recommended Hardware

| Device class                | Minimum                                                                  |
| --------------------------- | ------------------------------------------------------------------------ |
| iPhone                      | iPhone 8 or newer                                                        |
| iPad                        | iPad (6th gen) or newer                                                  |
| Mac / Mac Catalyst          | Mac released in 2018 or later with at least 4 GB of memory               |

### GPU Considerations

Hardware acceleration improves both decoding and encoding performance, and high-resolution or high-frame-rate exports benefit most from GPU support. Apple Silicon devices provide unified memory between the CPU and GPU, which simplifies high-resolution workflows. The maximum export dimension reported by `getMaxExportSize()` depends on the GPU's maximum texture size and varies between device generations.

## Memory Constraints

Client-side video processing operates within the app's available memory. The engine exposes two query APIs you can use to observe consumption as a coarse signal for telemetry, heuristics, and debugging.

Query current memory usage to understand how much has been consumed:

```swift highlight-limitations-queryMemoryUsage
let usedMemory = try engine.editor.getUsedMemory()
let usedMemoryMB = Double(usedMemory) / (1024 * 1024)
```

Check how much memory remains available for additional resources:

```swift highlight-limitations-queryAvailableMemory
let availableMemory = try? engine.editor.getAvailableMemory()
let availableMemoryMB = availableMemory.map { Double($0) / (1024 * 1024) }
```

`getAvailableMemory()` is unavailable on the iOS Simulator — the underlying memory API behaves differently in the simulated environment. The example wraps the call with `try?` so it returns `nil` on the Simulator and a byte count on real iOS devices, Mac Catalyst, and macOS. `try?` also swallows any other thrown error, so a `nil` result is not by itself proof that the host is the Simulator — use `do/catch` if you need to log the underlying error message. On a real device, calculate the utilization percentage from the used and available values:

```swift highlight-limitations-calculateMemoryPercentage
let memoryUtilization: Double? = availableMemory.map { available in
  let total = Double(usedMemory + available)
  return total > 0 ? (Double(usedMemory) / total) * 100 : 0
}
```

Both calls are process- and OS-level: `getUsedMemory()` reports the full process footprint (everything the app has allocated, not just the engine), and `getAvailableMemory()` reports memory still available to the process — on iOS devices this is the per-process OS budget, while on Mac and Mac Catalyst it is device-wide free RAM read via Mach host statistics and fluctuates with other apps' usage. The percentage therefore means different things across Apple targets: on iOS devices it tracks how close the app is to its own memory ceiling and rises with app pressure; on Mac and Mac Catalyst it reflects how much physical RAM is unused system-wide, so a low value mostly signals that other apps are busy rather than that this app is under pressure. Treat the ratio as a coarse process-level signal, not an engine-internal one.

Multiple video tracks, effects, and large source assets all increase memory usage proportionally. The engine flags `getUsedMemory()` and `getAvailableMemory()` as testing-and-debugging signals whose results may be unreliable — use them for telemetry and coarse heuristics, not as a hard pre-load gate. Plan capacity based on target-device profiling instead.

## Export Size Limitations

Export dimensions are bounded by GPU texture size limits. Always query `getMaxExportSize()` before initiating exports to ensure the requested dimensions are supported.

The maximum export size varies by device GPU capabilities. Common limits include:

- **4096 pixels**: older iPhones and iPads
- **8192 pixels**: most modern iPhones, iPads, and Intel Macs
- **16384 pixels**: high-end Mac configurations with discrete or Apple Silicon GPUs

Consider target playback requirements when planning export dimensions. Mobile playback and most streaming platforms rarely benefit from resolutions above 1080p or 4K, so exporting at extreme resolutions may not provide practical value.

## Troubleshooting

Common issues developers encounter related to video limitations:

| Issue                                | Cause                                                | Solution                                                          |
| ------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------- |
| Slow playback at high resolution     | Hardware cannot keep up with decoding                | Reduce preview resolution or use proxy editing                    |
| Export fails with large video        | Memory limits exceeded                               | Reduce resolution or split the video into shorter segments        |
| Export size rejected                 | Exceeds device GPU texture limits                    | Query `getMaxExportSize()` and reduce target dimensions           |
| `getAvailableMemory()` always throws | Running on the iOS Simulator                         | Test on a real device, or treat the `try?` `nil` path as the no-value branch |
| High memory usage during editing     | Multiple video tracks or high-resolution assets      | Lower `maxImageSize`, downscale source assets, or remove tracks   |
| Slow export on older devices         | Older GPU with limited hardware acceleration         | Export at 1080p instead of 4K, or shorten the video               |

## API Reference

| Method                               | Description                                              |
| ------------------------------------ | -------------------------------------------------------- |
| `engine.editor.getMaxExportSize()`   | Returns the maximum export dimension in pixels for the current device |
| `engine.editor.getUsedMemory()`      | Returns the process's physical memory footprint in bytes on Apple platforms |
| `engine.editor.getAvailableMemory()` | Returns memory available to the process in bytes — per-process OS budget on iOS device, device-wide free RAM on Mac and Mac Catalyst; throws on the iOS Simulator |

## Next Steps

Explore related guides to build complete video workflows:

- [Size Limits](../export-save-publish/export/size-limits.md) — Configure `maxImageSize` and handle export failures with retries
- [Video Overview](./overview.md) — Fundamentals of editing video with CE.SDK
- [File Format Support](../file-format-support.md) — Detailed compatibility matrix for images, videos, and audio
- [Export Overview](../export-save-publish/export/overview.md) — Fundamentals of exporting from CE.SDK



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
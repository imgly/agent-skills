> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Size Limits](./size-limits.md)

---

Configure size limits to balance quality and performance in CE.SDK applications.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-size-limits)

CE.SDK processes images and videos on the device, so size limits depend on the available memory and the device's rendering hardware. Tuning these limits keeps memory use predictable on smaller devices while still letting capable devices export at high resolution.

```swift file=@cesdk_swift_examples/engine-guides-size-limits/SizeLimits.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func sizeLimits(engine: Engine) async throws {
  try engine.scene.create()
  // Use pixels as the scene's design unit so block dimensions can be compared
  // directly to pixel-based limits like getMaxExportSize().
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  if let scene = try engine.scene.get() {
    try engine.block.appendChild(to: scene, child: page)
  }

  let currentMaxImageSize = try engine.editor.getSettingInt("maxImageSize")
  // The default value is 4096 pixels.

  // Lower the limit on memory-constrained devices. Apply this before loading
  // images so newly loaded textures are downscaled to the new limit.
  try engine.editor.setSettingInt("maxImageSize", value: 2048)

  // Or raise it for high-quality workflows on capable devices:
  // try engine.editor.setSettingInt("maxImageSize", value: 8192)

  // Observe settings changes via an AsyncStream and react to new values. Cancel
  // the task to unsubscribe.
  let observation = Task {
    for await _ in engine.editor.onSettingsChanged {
      let newMaxImageSize = try engine.editor.getSettingInt("maxImageSize")
      _ = newMaxImageSize
    }
  }
  // ...
  observation.cancel()

  // The engine reports the maximum export size supported on the current device.
  // The value is an upper bound — exports may still fail for memory or other
  // reasons. When the limit is unknown, the engine returns Int32.max.
  let maxExportSize = try engine.editor.getMaxExportSize()

  // getWidth/getHeight only return absolute pixel values when the scene's
  // design unit is .px AND the block's size mode is .absolute. With .percent
  // the value is a fraction of the parent's size; with .auto it is derived
  // from the block's content. Check both before comparing to the pixel-based
  // device limit.
  let designUnit = try engine.scene.getDesignUnit()
  let widthMode = try engine.block.getWidthMode(page)
  let heightMode = try engine.block.getHeightMode(page)
  if designUnit == .px, widthMode == .absolute, heightMode == .absolute {
    let pageWidth = try engine.block.getWidth(page)
    let pageHeight = try engine.block.getHeight(page)
    let withinLimit = Int(pageWidth.rounded(.up)) <= maxExportSize
      && Int(pageHeight.rounded(.up)) <= maxExportSize
    _ = withinLimit
  }

  // Catch export errors so the app can recover. Common remediations are
  // lowering targetWidth/targetHeight or reducing maxImageSize.
  // ExportOptions.targetWidth/targetHeight are always in pixels.
  do {
    let pngData = try await engine.block.export(page, mimeType: .png)
    _ = pngData
  } catch {
    try engine.editor.setSettingInt("maxImageSize", value: 2048)
    let retryOptions = ExportOptions(targetWidth: 1920, targetHeight: 1080)
    let retryData = try await engine.block.export(page, mimeType: .png, options: retryOptions)
    _ = retryData
  }
}
```

This guide covers reading and writing the `maxImageSize` setting, observing setting changes, querying the device's maximum export size, and handling export failures.

## Understanding Size Limits

CE.SDK manages size limits at two stages: **input** (when loading images) and **output** (when exporting). The `maxImageSize` setting controls input resolution and downscales images that exceed the configured limit before they reach the canvas. The default is 4096×4096 pixels, which keeps memory use predictable on a wide range of devices.

Export resolution has no artificial limit. The engine can render up to 16,384×16,384 pixels in theory, but the actual ceiling is determined by the device's rendering hardware and available memory. Use `engine.editor.getMaxExportSize()` to read the device's reported upper bound at runtime.

## Resolution & Duration Limits

## Configuring maxImageSize

Read and modify `maxImageSize` through the Settings API. The setting is an integer (pixels), so use the `Int` accessors on `engine.editor`.

### Reading the Current Setting

To check the value currently in effect:

```swift highlight-sizeLimits-readSetting
let currentMaxImageSize = try engine.editor.getSettingInt("maxImageSize")
// The default value is 4096 pixels.
```

The default is `4096`. Read this value at startup to surface it in your UI, or to make runtime decisions about asset loading.

### Setting a New Value

Apply a new limit before loading images so newly loaded textures are downscaled to the new size:

```swift highlight-sizeLimits-writeSetting
  // Lower the limit on memory-constrained devices. Apply this before loading
  // images so newly loaded textures are downscaled to the new limit.
  try engine.editor.setSettingInt("maxImageSize", value: 2048)

  // Or raise it for high-quality workflows on capable devices:
  // try engine.editor.setSettingInt("maxImageSize", value: 8192)
```

Images already on the canvas keep their loaded resolution until they are reloaded. Lower values reduce memory pressure on phones and tablets; higher values preserve detail on desktops and higher-end devices.

### Observing Settings Changes

Subscribe to settings changes through the `onSettingsChanged` async stream. The stream emits `Void` on every setting change, so read the value back inside the loop:

```swift highlight-sizeLimits-observeChanges
// Observe settings changes via an AsyncStream and react to new values. Cancel
// the task to unsubscribe.
let observation = Task {
  for await _ in engine.editor.onSettingsChanged {
    let newMaxImageSize = try engine.editor.getSettingInt("maxImageSize")
    _ = newMaxImageSize
  }
}
// ...
observation.cancel()
```

A Combine variant is also available as `engine.editor.onSettingsChangedPublisher`. Cancel the consuming `Task` (or the Combine subscription) to unsubscribe.

## Device Export Capabilities

The maximum export size on the current device is exposed directly:

```swift highlight-sizeLimits-maxExportSize
// The engine reports the maximum export size supported on the current device.
// The value is an upper bound — exports may still fail for memory or other
// reasons. When the limit is unknown, the engine returns Int32.max.
let maxExportSize = try engine.editor.getMaxExportSize()
```

`getMaxExportSize()` returns the upper export limit in pixels for both width and height. When the limit is unknown the engine returns `Int32.max` to signal "unlimited". The reported value is an upper bound: exports may still fail for memory reasons even when both dimensions are below it.

Use the value to:

- Cap export presets to dimensions the device can render
- Warn users when a requested export exceeds the device limit
- Pick a conservative default `maxImageSize` for the device class

You can also pre-validate a planned export against the limit. `getWidth(_:)` and `getHeight(_:)` only return absolute pixel values when the scene's design unit is `.px` **and** the block's size mode is `.absolute`. With `.percent` the value is a fraction of the parent's size; with `.auto` it is derived from the block's content. Verify both before comparing to `getMaxExportSize()`:

```swift highlight-sizeLimits-validateExport
// getWidth/getHeight only return absolute pixel values when the scene's
// design unit is .px AND the block's size mode is .absolute. With .percent
// the value is a fraction of the parent's size; with .auto it is derived
// from the block's content. Check both before comparing to the pixel-based
// device limit.
let designUnit = try engine.scene.getDesignUnit()
let widthMode = try engine.block.getWidthMode(page)
let heightMode = try engine.block.getHeightMode(page)
if designUnit == .px, widthMode == .absolute, heightMode == .absolute {
  let pageWidth = try engine.block.getWidth(page)
  let pageHeight = try engine.block.getHeight(page)
  let withinLimit = Int(pageWidth.rounded(.up)) <= maxExportSize
    && Int(pageHeight.rounded(.up)) <= maxExportSize
  _ = withinLimit
}
```

## Handling Export Errors

`engine.block.export(_:mimeType:options:)` is `async throws`, so wrap it in a `do/catch` block and provide a fallback when an export fails. A practical recovery is to lower `maxImageSize`, then retry with smaller `targetWidth`/`targetHeight` values:

```swift highlight-sizeLimits-handleExport
// Catch export errors so the app can recover. Common remediations are
// lowering targetWidth/targetHeight or reducing maxImageSize.
// ExportOptions.targetWidth/targetHeight are always in pixels.
do {
  let pngData = try await engine.block.export(page, mimeType: .png)
  _ = pngData
} catch {
  try engine.editor.setSettingInt("maxImageSize", value: 2048)
  let retryOptions = ExportOptions(targetWidth: 1920, targetHeight: 1080)
  let retryData = try await engine.block.export(page, mimeType: .png, options: retryOptions)
  _ = retryData
}
```

This pattern lets the app keep delivering an export even when the first attempt is too large for the current device or memory pressure is high.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Images appear blurry on the canvas | `maxImageSize` is below the source resolution | Raise `maxImageSize` if the device has the memory headroom |
| Out-of-memory crashes during editing | `maxImageSize` is too high for the device | Lower `maxImageSize`, especially on phones and tablets |
| Export throws unexpectedly | Output dimensions exceed `getMaxExportSize()` | Reduce `targetWidth`/`targetHeight` or pick a smaller export preset |
| Video export fails | Resolution or duration exceeds device capability | Export at 1080p instead of 4K, or shorten the video |
| Inconsistent results across devices | Different rendering hardware | Set a conservative `maxImageSize` (4096) and gate larger exports on `getMaxExportSize()` |

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.getSettingInt(_:)` | Reads an integer setting (e.g. `maxImageSize`) |
| `engine.editor.setSettingInt(_:value:)` | Updates an integer setting |
| `engine.editor.onSettingsChanged` | `AsyncStream<Void>` that emits when any setting changes |
| `engine.editor.getMaxExportSize()` | Returns the device's maximum export dimension in pixels |
| `engine.block.export(_:mimeType:options:)` | Exports a block as image data |
| `engine.block.getWidth(_:)` / `getHeight(_:)` | Returns block dimensions in the scene's design unit. Values are absolute only when the size mode is `.absolute`; `.percent` returns a parent-relative fraction and `.auto` returns a content-derived value |
| `engine.block.getWidthMode(_:)` / `getHeightMode(_:)` | Returns the size mode (`.absolute`, `.percent`, or `.auto`) used for the dimension |
| `engine.scene.getDesignUnit()` / `setDesignUnit(_:)` | Reads or sets the scene's design unit |

## Next Steps

Explore related guides to build complete export workflows:

- [Settings Guide](../../settings.md) - Complete Settings API reference and configuration options
- [File Format Support](../../file-format-support.md) - Supported image and video formats with capabilities
- [Export Overview](./overview.md) - Fundamentals of exporting images and videos from CE.SDK
- [Export to PDF](./to-pdf.md) - PDF export guide with multi-page support and print optimization



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
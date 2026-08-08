> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Compress](./compress.md)

---

Compressions goal is to reduce file sizes during export while maintaining as much visual quality as possible. With the CreativeEditor SDK (CE.SDK) for Swift, you can fine-tune compression settings for both images and videos. This allows your app to balance performance, quality, and storage efficiency across iOS, macOS, and Catalyst.

## What You’ll Learn

- How to configure compression for PNG, JPEG, and WebP exports.
- How to control video file size using bitrate and resolution scaling.
- How to balance file size, quality, and export performance for different use cases.
- How to configure compression programmatically during automation or batch operations.

## When to Use It

Compression tuning is useful whenever:

- Exported media is too large for upload limits
- You need to optimize storage quotas
- You have constrained network bandwidth

Use it when preparing images or videos for any workflow that benefits from:

- Faster load times and smaller files, like:
  - Social media
  - Web delivery

- Consistent file size and predictable performance, like:
  - Batch export
  - Automation scenarios

## Understanding Compression Options by Format

Each format supports its own parameters for balancing:

- Speed
- File size
- Quality

You pass these through the `ExportOptions` or `VideoExportOptions` structure when calling the export functions.

| Format | Parameter | Type | Effect | Default |
| ------- | ---------- | ---- | ------- | -------- |
| PNG | `pngCompressionLevel` | 0–9 | Higher = smaller, slower (lossless) | 5 |
| JPEG | `jpegQuality` | 0.0–1.0 | Lower = smaller, lower quality | 0.9 |
| WebP | `webpQuality` | 0.0–1.0 | 1.0 = lossless, \<1.0 = lossy | 1.0 |
| MP4 | `videoBitrate`, `audioBitrate` | bits/sec or `VideoBitrate.system` / `VideoBitrate.auto` | Higher = larger, higher quality | `VideoBitrate.system` |

## Export Images with Compression

Below is an example that exports a design block as PNG and JPEG while tuning compression options.

```swift
import Foundation
import IMGLYEngine
#if canImport(UIKit)
import UIKit
#endif

@MainActor
func exportCompressedImages(engine: Engine) async throws {
  // Load a demo scene
  let sceneURL = URL(string: "https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene")!

  let scene = try await engine.scene.load(from: sceneURL)

  // Select the first graphic block to export
  let block = try engine.block.find(byType: .graphic).first!

  // Export PNG with maximum compression (lossless)
  let pngOptions = ExportOptions(pngCompressionLevel: 9)
  let pngData = try await engine.block.export(block, mimeType: .png, options: pngOptions)

  // Export JPEG with balanced quality (lossy)
  let jpegOptions = ExportOptions(jpegQuality: 0.7)
  let jpegData = try await engine.block.export(block, mimeType: .jpeg, options: jpegOptions)

  // Convert to UIImage for preview (iOS)
  // pass these to another part of the app for preview
  let pngImage = UIImage(data: pngData)
  let jpegImage = UIImage(data: jpegData)
}
```

Choose a format depending on what matters the most for your output:

- **PNG** is ideal for flat graphics or assets that require **transparency**.
- **JPEG** is best for photographs where slight **compression** artifacts are acceptable.
- **WebP** can serve **both** roles: it supports transparency like PNG and delivers smaller files like JPEG.

## Combine Compression with Resolution Scaling

You can further reduce file size by downscaling exports:

```swift
let scaledOptions = ExportOptions(
  pngCompressionLevel: 7,
  targetWidth: 1080,
  targetHeight: 1080
)
let scaledBlob = try await engine.block.export(block, mimeType: .png, options: scaledOptions)
```

When you specify only one dimension, CE.SDK automatically preserves aspect ratio for consistent results.

## Compress Video Exports

The `VideoExportOptions` structure handles configuration for video compression. You can specify:

- Bitrate
- Framerate
- H.264 profile
- Target resolution

```swift
let videoOptions = VideoExportOptions(
  h264Profile: .main,
  h264Level: 52,
  videoBitrate: 2_000_000,     // 2 Mbps = moderate compression
  audioBitrate: 128_000,       // 128 kbps AAC
  framerate: 30.0,
  targetWidth: 1280,
  targetHeight: 720
)

// Export a page as compressed MP4
if let page = try engine.scene.getCurrentPage() {
  for try await export in try await engine.block.exportVideo(page, mimeType: .mp4, options: videoOptions) {
    switch export {
      case let .progress(_, encodedFrames, totalFrames):
        print("Progress: \(encodedFrames)/\(totalFrames)")
      case let .finished(video: videoData):
        print("Export complete: \(videoData.count) bytes")
    }
  }
}
```

About the bitrate’s values:

- **1–2 Mbps** produces high quality results for **web** and social media clips.
- **8–12 Mbps** is more appropriate for **downloadable HD video**.

Setting `videoBitrate` to `VideoBitrate.auto` (`-1`) lets CE.SDK choose a bounded, optimized bitrate based on resolution and frame rate. The default `VideoBitrate.system` (`0`) instead lets the platform encoder (VideoToolbox) decide.

The H.264 `profile` and `level` determine compatibility and encoder features.\
Use `.baseline` for mobile-friendly playback, `.main` for standard HD, and `.high` for the highest quality exports targeting desktop or professional workflows.

## Performance and Trade-Offs

Higher compression results in smaller files but slower export speeds. For example:

- PNG Level 9 may take twice as long to encode as Level 3–5, though it produces smaller files.
- JPEG and WebP are faster but can introduce visible compression artifacts.

Video exports are more demanding and depend heavily on device CPU and GPU performance.

You can check available export limits before encoding:

```swift
let maxSize = try engine.editor.getMaxExportSize()
let availableMemory = try engine.editor.getAvailableMemory()
print("Max export size: \(maxSize), Memory: \(availableMemory)")
```

## Real-World Compression Comparison (1080 × 1080)

The following table compares average results across different compression settings for photo-like and graphic-like images.

| Format | Setting | Avg. File Size (KB) | Encode Time (ms) | PSNR (dB)\* | Notes |
| ------- | -------- | ------------------- | ---------------- | ------------ | ------ |
| **PNG** | Level 0 | ~1 450 | ~44 | ∞ (lossless) | Fastest, largest |
| | Level 5 | ~1 260 | ~61 | ∞ | Balanced speed and size |
| | Level 9 | ~1 080 | ~88 | ∞ | Smallest, slowest |
| **JPEG** | Quality 95 | ~640 | ~24 | 43 | Near-lossless appearance |
| | Quality 80 | ~420 | ~20 | 39 | Good default for photos |
| | Quality 60 | ~290 | ~17 | 35 | Some artifacts visible |
| | Quality 40 | ~190 | ~15 | 31 | Heavy compression |
| **WebP** | Quality 95 | ~510 | ~27 | 44 | Smaller than JPEG |
| | Quality 80 | ~350 | ~23 | 39 | Excellent web balance |
| | Quality 60 | ~240 | ~20 | 35 | Mild artifacts |
| | Quality 40 | ~160 | ~18 | 31 | Compact, noticeable loss |
| | Lossless | ~830 | ~33 | ∞ | Smaller than PNG, keeps alpha |

\*PSNR > 40 dB ≈ visually lossless; 30–35 dB shows mild artifacts.

**Key Takeaways**:

- **WebP** achieves 70–85 % smaller files than uncompressed PNG with high quality around `webpQuality = 0.8`.
- **JPEG** performs well for photographs; use `jpegQuality = 0.8–0.9` for web or print, `0.6` for compact exports.
- **PNG** is essential for transparency and vector-like shapes; higher levels reduce size modestly at the cost of speed.
- Test on realistic assets: complex photos and flat graphics compress differently.

## Practical Presets

These presets provide starting points for common export scenarios.

| Use Case | Format | Typical Settings | Result | Notes |
|-----------|---------|------------------|---------|-------|
| **Web or Social Sharing** | JPEG / WebP | `jpegQuality: 0.8` or `webpQuality: 0.8` | ~60–70 % smaller than PNG | Balanced quality and size |
| **UI Graphics / Transparent Assets** | PNG / WebP | `pngCompressionLevel: 6–8` or `webpQuality: 1.0 (lossless)` | ~25 % smaller than default PNG | Maintains transparency |
| **High-Quality Print or Archival** | PNG / WebP Lossless | `pngCompressionLevel: 9` or `webpQuality: 1.0` | Maximum fidelity | Slower export, large files |
| **Video for Web / Social** | MP4 | `videoBitrate: 2_000_000`, `audioBitrate: 128_000`, `targetWidth: 1280` | Smooth playback, small file | Adjust for platform |
| **Video for Download / HD** | MP4 | `videoBitrate: 8_000_000`, `targetWidth: 1920`, `framerate: 30` | Full HD quality | Larger file, slower encode |

**PDF and Print**: PDF exports aren’t compressed by default.

Use `exportPdfWithHighCompatibility` when you need broad software support in print workflows.

> **Note:** Consider showing users an **estimated file size** before export. It helps them make informed choices about quality vs. performance.

## Automating Compression in Batch Exports

When exporting multiple elements, apply the same compression settings programmatically:

```swift
for block in try engine.block.find(byType: .graphic) {
  let options = ExportOptions(jpegQuality: 0.8)
  _ = try await engine.block.export(block, mimeType: .jpeg, options: options)
}
```

This ensures consistent quality and file size across all exported assets.

## Troubleshooting

**❌ File size not reduced**:

- Ensure correct property name such as`jpegQuality`, `webpQuality`.

**❌ JPEG Quality too low**:

- Increase quality to 0.9 or use PNG/WebP lossless.

**❌ Export slow**:

- Check for excessive compression level.
- Lower PNG level to 5–6.

**❌ Video not compressing**:

- Set `videoBitrate` to a non-zero reasonable value.

## Next Steps

Compression is one of the most practical tools for optimizing export workflows.\
By adjusting the `ExportOptions` and `VideoExportOptions` structures in Swift, you can deliver high-quality results efficiently—whether your users are exporting social media posts, UI assets, or professional-grade print layouts.

- [Export Overview](./overview.md) to learn about all available export formats.
- Apply compression consistently in automated exports using [batch processing](../../automation/batch-processing.md).
- Combine scaling and compression for [thumbnails](../create-thumbnail.md).



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
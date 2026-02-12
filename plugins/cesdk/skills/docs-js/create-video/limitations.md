> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Limitations](./create-video/limitations.md)

---

CE.SDK performs video processing client-side, providing privacy and
responsiveness while introducing hardware-dependent constraints. This
reference covers resolution limits, codec support, and platform-specific
restrictions to help you plan video workflows within platform capabilities.

![Video Limitations example showing the CE.SDK video editor](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-limitations-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-limitations-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-limitations-browser/)

Client-side video processing provides significant advantages for privacy and user experience, but it operates within the constraints of the user's device. Understanding these limitations helps you build applications that work reliably across different hardware configurations and browsers.

```typescript file=@cesdk_web_examples/guides-create-video-limitations-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Video Limitations Guide
 *
 * Demonstrates how to query video processing limitations in CE.SDK:
 * - Querying maximum export size
 * - Monitoring memory usage and availability
 * - Understanding resolution and duration constraints
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // Query the maximum export dimensions supported by this device
    const maxExportSize = engine.editor.getMaxExportSize();
    console.log('Maximum export size:', maxExportSize, 'pixels');
    // The maximum export size depends on the GPU texture size limit
    // Typical values: 4096, 8192, or 16384 pixels

    // Query current memory consumption
    const usedMemory = engine.editor.getUsedMemory();
    const usedMemoryMB = (usedMemory / (1024 * 1024)).toFixed(2);
    console.log('Memory used:', usedMemoryMB, 'MB');

    // Query available memory for video processing
    const availableMemory = engine.editor.getAvailableMemory();
    const availableMemoryMB = (availableMemory / (1024 * 1024)).toFixed(2);
    console.log('Memory available:', availableMemoryMB, 'MB');
    // Browser tabs typically cap around 2GB due to WebAssembly's 32-bit address space

    // Calculate memory utilization percentage
    const totalMemory = usedMemory + availableMemory;
    const memoryUtilization = ((usedMemory / totalMemory) * 100).toFixed(1);
    console.log('Memory utilization:', memoryUtilization, '%');

    // Check if a specific export size is feasible
    const desiredWidth = 3840; // 4K UHD
    const desiredHeight = 2160;
    const canExport4K =
      desiredWidth <= maxExportSize && desiredHeight <= maxExportSize;
    console.log(
      'Can export at 4K UHD (3840x2160):',
      canExport4K ? 'Yes' : 'No'
    );

    // Add a sample video to demonstrate the editor with video content
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a video block that fills the page
    const videoBlock = await engine.block.addVideo(
      videoUri,
      pageWidth,
      pageHeight
    );

    // Position the video at the center of the page
    engine.block.setPositionX(videoBlock, 0);
    engine.block.setPositionY(videoBlock, 0);

    // Select the video block
    engine.block.setSelected(videoBlock, true);

    // Re-check memory after loading video content
    const usedAfterLoad = engine.editor.getUsedMemory();
    const availableAfterLoad = engine.editor.getAvailableMemory();
    const usedAfterLoadMB = (usedAfterLoad / (1024 * 1024)).toFixed(2);
    const availableAfterLoadMB = (availableAfterLoad / (1024 * 1024)).toFixed(
      2
    );
    console.log('After loading video:');
    console.log('  Memory used:', usedAfterLoadMB, 'MB');
    console.log('  Memory available:', availableAfterLoadMB, 'MB');

    // Log summary of device capabilities
    console.log('--- Device Capabilities Summary ---');
    console.log('Max export dimension:', maxExportSize, 'px');
    console.log('4K UHD support:', canExport4K ? 'Supported' : 'Not supported');
    console.log(
      'Initial memory:',
      usedMemoryMB,
      'MB used /',
      availableMemoryMB,
      'MB available'
    );
    console.log(
      'Open the browser console to view detailed limitation information.'
    );
  }
}

export default Example;
```

## Resolution Limits

Video resolution capabilities depend on hardware resources and WebAssembly memory constraints. CE.SDK supports up to 4K UHD for playback and export on capable hardware.

Import resolution is bounded by WebAssembly's 32-bit address space and browser tab memory limits, which typically cap around 2GB. This means very high resolution video files may exceed available memory during processing. Playback and export at 4K depends on available GPU resources, and higher resolutions require proportionally more memory and processing power.

Query the maximum export size before initiating exports to avoid failures:

```typescript highlight-query-max-export-size
// Query the maximum export dimensions supported by this device
const maxExportSize = engine.editor.getMaxExportSize();
console.log('Maximum export size:', maxExportSize, 'pixels');
// The maximum export size depends on the GPU texture size limit
// Typical values: 4096, 8192, or 16384 pixels
```

The maximum export size varies by device GPU capabilities. Typical values range from 4096 to 16384 pixels depending on the graphics hardware. Before exporting at high resolutions, verify the target dimensions don't exceed this limit:

```typescript highlight-check-export-feasibility
// Check if a specific export size is feasible
const desiredWidth = 3840; // 4K UHD
const desiredHeight = 2160;
const canExport4K =
  desiredWidth <= maxExportSize && desiredHeight <= maxExportSize;
console.log(
  'Can export at 4K UHD (3840x2160):',
  canExport4K ? 'Yes' : 'No'
);
```

## Duration Limits

Video duration affects editing responsiveness and export time. CE.SDK optimizes for short-form content while supporting longer videos with performance trade-offs.

Stories and reels up to 2 minutes are fully supported with smooth editing performance. Videos up to 10 minutes work well on modern hardware, with export times typically around 1 minute for this length. Longer videos are technically possible but may impact editing responsiveness on less capable devices.

For long-form content, consider these approaches:

- Split longer videos into shorter segments for editing
- Use lower resolution previews during editing, then export at full quality
- Test on target devices to establish acceptable duration limits for your use case

## Frame Rate Support

Frame rate affects both playback smoothness and export performance. Hardware acceleration significantly impacts high frame rate capabilities.

30 FPS at 1080p is broadly supported across devices and provides smooth playback on most hardware. 60 FPS and high-resolution combinations benefit from hardware acceleration. When hardware acceleration is unavailable, high frame rate video may drop frames during preview playback, though exports will maintain the correct timing.

Variable frame rate sources may have timing precision limitations. For best results with variable frame rate content, consider transcoding to constant frame rate before importing into CE.SDK.

## Supported Codecs

CE.SDK supports widely-adopted video and audio codecs, with some platform-specific variations in availability.

### Video Codecs

H.264/AVC in `.mp4` containers has universal support across all browsers and platforms. This is the most reliable codec choice for broad compatibility.

H.265/HEVC in `.mp4` containers has platform-dependent support. Safari on macOS and iOS supports HEVC natively, while Chrome and Firefox support varies by operating system and codec availability.

### Audio Codecs

MP3 works in `.mp3` files or within `.mp4` containers, with universal browser support.

AAC in `.m4a`, `.mp4`, or `.mov` containers is widely supported, though some browsers may require system codecs for encoding during export.

## Browser and Platform Restrictions

Browser capabilities depend on the host operating system, introducing platform-specific limitations that affect video processing.

### Windows Limitations

H.265 transparency is not supported on Windows hosts. If your workflow requires alpha channel video with HEVC, consider processing on macOS or using H.264 which supports alpha on all platforms.

### Linux Limitations

Chrome on Linux typically lacks encoder support for H.264 and AAC due to licensing restrictions in the Chrome Linux build. This means video imports and playback may work correctly, but exports may fail.

If you're targeting Linux users, consider:

- Recommending Firefox, which may have different codec support
- Providing fallback export options
- Using server-side export processing for Linux users

Use the `video.decode.checkSupport` and `video.encode.checkSupport` actions to detect video capabilities programmatically and display appropriate user feedback. Alternatively, use `cesdk.utils.supportsVideoDecode()` and `cesdk.utils.supportsVideoEncode()` to check support silently without showing dialogs. See the [Actions API](./actions.md) for implementation details.

### Chromium Limitations

Chromium-based browsers (without proprietary codecs) don't include video codecs due to licensing. They may fall back to system libraries on some platforms, such as macOS, but support is not guaranteed. Video editing functionality may not work reliably in pure Chromium builds.

### Mobile Browser Limitations

Video editing is not supported on mobile browsers on any platform due to technical limitations causing performance issues. For mobile video editing capabilities, use the native mobile SDKs for iOS and Android, which provide full video support.

## Hardware Requirements

Device capabilities directly affect video processing performance. CE.SDK scales with available hardware resources.

### Recommended Hardware

| Platform         | Minimum Hardware                                                |
| ---------------- | --------------------------------------------------------------- |
| Desktop          | Notebook or desktop released in the last 7 years with at least 4GB memory |
| Mobile (Apple)   | iPhone 8, iPad (6th gen) or newer                               |
| Mobile (Android) | Phones and tablets released in the last 4 years                 |

### GPU Considerations

Hardware acceleration improves encoding and decoding performance significantly. High-resolution and high-frame-rate exports benefit most from GPU support. The maximum export size depends on the maximum texture size the device's GPU can allocate.

Integrated graphics can handle most common video editing tasks. Discrete GPUs provide better performance for 4K content and complex compositions with multiple video layers.

## Memory Constraints

Client-side video processing operates within browser memory limits. Use the memory APIs to monitor consumption and make informed decisions about resource loading.

Query current memory usage to understand how much has been consumed:

```typescript highlight-query-memory-usage
// Query current memory consumption
const usedMemory = engine.editor.getUsedMemory();
const usedMemoryMB = (usedMemory / (1024 * 1024)).toFixed(2);
console.log('Memory used:', usedMemoryMB, 'MB');
```

Check how much memory remains available for additional resources:

```typescript highlight-query-available-memory
// Query available memory for video processing
const availableMemory = engine.editor.getAvailableMemory();
const availableMemoryMB = (availableMemory / (1024 * 1024)).toFixed(2);
console.log('Memory available:', availableMemoryMB, 'MB');
// Browser tabs typically cap around 2GB due to WebAssembly's 32-bit address space
```

WebAssembly uses a 32-bit address space, limiting the maximum addressable memory. Browser tabs typically cap around 2GB of memory, though this varies by browser and system configuration. Multiple video tracks and effects increase memory usage proportionally.

Query memory APIs before loading additional video files to avoid out-of-memory conditions:

```typescript highlight-monitor-memory-after-load
// Re-check memory after loading video content
const usedAfterLoad = engine.editor.getUsedMemory();
const availableAfterLoad = engine.editor.getAvailableMemory();
const usedAfterLoadMB = (usedAfterLoad / (1024 * 1024)).toFixed(2);
const availableAfterLoadMB = (availableAfterLoad / (1024 * 1024)).toFixed(
  2
);
console.log('After loading video:');
console.log('  Memory used:', usedAfterLoadMB, 'MB');
console.log('  Memory available:', availableAfterLoadMB, 'MB');
```

## Export Size Limitations

Export dimensions are bounded by GPU texture size limits. Always query `getMaxExportSize()` before initiating exports to ensure the requested dimensions are supported.

The maximum export size varies by device GPU capabilities. Common limits include:

- **4096 pixels**: Older integrated graphics
- **8192 pixels**: Most modern integrated and discrete GPUs
- **16384 pixels**: High-end discrete GPUs

Consider target platform requirements when planning export dimensions. Mobile devices and web playback rarely benefit from resolutions above 1080p or 4K, so exporting at extreme resolutions may not provide practical value.

## Troubleshooting

Common issues developers encounter related to video limitations:

| Issue                              | Cause                                   | Solution                                            |
| ---------------------------------- | --------------------------------------- | --------------------------------------------------- |
| Video export fails on Linux        | Chrome lacks H.264/AAC encoder support  | Use Firefox or implement server-side export         |
| Slow playback at high resolution   | Hardware cannot keep up with decoding   | Reduce preview resolution or use proxy editing      |
| Export fails with large video      | Memory limits exceeded                  | Reduce resolution or split into shorter segments    |
| H.265 transparency not working     | Windows platform limitation             | Use H.264 or process on macOS                       |
| Mobile browser video not working   | Mobile browsers don't support video editing | Use native mobile SDK instead                     |
| Export size rejected               | Exceeds device GPU texture limits       | Query `getMaxExportSize()` and reduce dimensions    |

## API Reference

| Method                             | Description                                              |
| ---------------------------------- | -------------------------------------------------------- |
| `engine.editor.getMaxExportSize()` | Query the maximum export dimensions supported by the device |
| `engine.editor.getAvailableMemory()` | Get available memory in bytes for video processing     |
| `engine.editor.getUsedMemory()`    | Get current memory usage in bytes                        |



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Size Limits](./export-save-publish/export/size-limits.md)

---

Configure size limits to balance quality and performance in CE.SDK applications.

![Size Limits example showing CE.SDK with maxImageSize configuration](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-size-limits-browser/)

CE.SDK processes images and videos client-side, which means size limits depend on the user's GPU capabilities and available memory. Understanding and configuring these limits helps you build applications that deliver high-quality results while maintaining smooth performance across different devices.

```typescript file=@cesdk_web_examples/guides-export-save-publish-size-limits-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions to match image display size for safe export
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Add export image action to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportImage.navigationBar']
    });

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // ===== Section 1: Reading Current maxImageSize =====
    // Get the current maxImageSize setting
    const currentMaxSize = engine.editor.getSetting('maxImageSize');
    console.log('Current maxImageSize:', currentMaxSize);
    // Default is 4096 pixels

    // ===== Section 2: Setting Different maxImageSize Values =====
    // Configure maxImageSize for different use cases
    // This must be set BEFORE loading images to ensure they're downscaled

    // Low memory devices (mobile, tablets) - use 2048 for safety
    engine.editor.setSetting('maxImageSize', 2048);

    // High quality (professional workflows, desktop)
    // engine.editor.setSetting('maxImageSize', 8192);

    console.log(
      'Updated maxImageSize:',
      engine.editor.getSetting('maxImageSize')
    );

    // ===== Section 3: Observing Settings Changes =====
    // Subscribe to settings changes to update UI when maxImageSize changes
    engine.editor.onSettingsChanged(() => {
      const newMaxSize = engine.editor.getSetting('maxImageSize');
      console.log('maxImageSize changed to:', newMaxSize);
      // In a real app, update UI here to reflect the new setting
    });

    // The subscription returns an unsubscribe function if you need to clean up later
    // const unsubscribe = engine.editor.onSettingsChanged(() => { ... });
    // unsubscribe(); // Call when no longer needed

    // ===== Section 4: GPU Capability Detection (Web) =====
    // Query GPU max texture size to understand export limits
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      console.log('GPU Max Texture Size:', maxTextureSize);
      console.log(
        'Safe export dimensions: up to',
        maxTextureSize,
        '×',
        maxTextureSize
      );

      // Most modern GPUs support 4096×4096 to 16384×16384
      // Safe baseline is 4096×4096 for universal compatibility
    }

    // ===== Section 5: Pre-Export Size Validation =====
    // Calculate actual export dimensions including all content
    // Get bounding box of all content to check actual export size
    const allBlocks = engine.block.findByType('//ly.img.ubq/graphic');
    let maxRight = 0;
    let maxBottom = 0;

    allBlocks.forEach((blockId) => {
      const x = engine.block.getPositionX(blockId);
      const y = engine.block.getPositionY(blockId);
      const width = engine.block.getWidth(blockId);
      const height = engine.block.getHeight(blockId);
      maxRight = Math.max(maxRight, x + width);
      maxBottom = Math.max(maxBottom, y + height);
    });

    const exportWidth = Math.max(engine.block.getWidth(page), maxRight);
    const exportHeight = Math.max(engine.block.getHeight(page), maxBottom);

    console.log('Export dimensions:', exportWidth, '×', exportHeight);

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      // Use conservative limit (50% of max) for actual VRAM availability
      const safeTextureSize = Math.floor(maxTextureSize * 0.5);

      if (exportWidth > safeTextureSize || exportHeight > safeTextureSize) {
        cesdk.ui.showNotification({
          type: 'warning',
          message: `Export dimensions (${Math.round(exportWidth)}×${Math.round(exportHeight)}) exceed safe GPU limit (${safeTextureSize}×${safeTextureSize})`
        });
      } else {
        cesdk.ui.showNotification({
          type: 'success',
          message: 'Export dimensions are within safe limits'
        });
      }
    }

    // ===== Section 6: Handling Export Errors =====
    // Demonstrate proper error handling for size-related export failures
    try {
      // Example export operation (not actually exporting in this demo)
      // const blob = await engine.block.export(page, 'image/png');

      // If export fails, catch and handle the error
      console.log('Export would proceed here with proper error handling');
    } catch (error) {
      console.error('Export failed:', error);

      // Check if error is size-related
      if (
        error instanceof Error &&
        (error.message.includes('texture') ||
          error.message.includes('size') ||
          error.message.includes('memory'))
      ) {
        console.error('Size-related export error detected');
        console.error('Suggested remediation:');
        console.error('1. Reduce output dimensions');
        console.error('2. Decrease maxImageSize setting');
        console.error('3. Use export compression options');
      }
    }

    // Add an image to the page for demonstration
    // Note: NOT specifying size here - let maxImageSize control the texture loading
    const imageBlock = await engine.block.addImage(imageUri);
    engine.block.appendChild(page, imageBlock);

    // Fit image to page dimensions
    engine.block.setWidth(imageBlock, 800);
    engine.block.setHeight(imageBlock, 600);

    // Position image to fill the page (already matches page dimensions)
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    // Zoom to fit the content
    engine.scene.zoomToBlock(page, { padding: 40 });

    // Display information in console
    console.log('=== Size Limits Configuration Summary ===');
    console.log(
      'Current maxImageSize:',
      engine.editor.getSetting('maxImageSize')
    );
    console.log(
      'Page dimensions:',
      engine.block.getWidth(page),
      '×',
      engine.block.getHeight(page)
    );
    console.log(
      'Image dimensions:',
      engine.block.getWidth(imageBlock),
      '×',
      engine.block.getHeight(imageBlock)
    );

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      console.log('GPU max texture size:', maxTextureSize);
    }
  }
}

export default Example;
```

This guide covers how to configure the `maxImageSize` setting, query GPU capabilities, validate export dimensions, and handle size-related errors gracefully.

## Understanding Size Limits

CE.SDK manages size limits at two stages: **input** (when loading images) and **output** (when exporting). The `maxImageSize` setting controls input resolution, automatically downscaling images that exceed the configured limit (default: 4096×4096px). This reduces memory usage and improves performance across devices. Export resolution has no artificial limits—the theoretical maximum is 16,384×16,384 pixels, constrained only by GPU texture size, available VRAM, and platform capabilities (WebGL/WebGPU on web, Metal/OpenGL on native).

## Resolution & Duration Limits

## Configuring maxImageSize

You can read and modify the `maxImageSize` setting using the Settings API to match your application's requirements and target hardware capabilities.

### Reading the Current Setting

To check what `maxImageSize` value is currently configured:

```typescript highlight-get-max-image-size
// Get the current maxImageSize setting
const currentMaxSize = engine.editor.getSetting('maxImageSize');
console.log('Current maxImageSize:', currentMaxSize);
// Default is 4096 pixels
```

This returns the maximum size in pixels as an integer value (e.g., `4096` for the default 4096×4096 limit). You might display this value in your UI to inform users about the current quality settings, or use it to make runtime decisions about asset loading strategies.

### Setting a New Value

Configure `maxImageSize` to minimize memory usage on constrained devices:

```typescript highlight-set-max-image-size
    // Configure maxImageSize for different use cases
    // This must be set BEFORE loading images to ensure they're downscaled

    // Low memory devices (mobile, tablets) - use 2048 for safety
    engine.editor.setSetting('maxImageSize', 2048);

    // High quality (professional workflows, desktop)
    // engine.editor.setSetting('maxImageSize', 8192);

    console.log(
      'Updated maxImageSize:',
      engine.editor.getSetting('maxImageSize')
    );
```

The setting takes effect immediately for newly loaded images. Images already loaded on the canvas retain their current resolution until reloaded.

### Observing Settings Changes

Subscribe to setting changes to update your UI when `maxImageSize` is modified:

```typescript highlight-observe-settings-changes
    // Subscribe to settings changes to update UI when maxImageSize changes
    engine.editor.onSettingsChanged(() => {
      const newMaxSize = engine.editor.getSetting('maxImageSize');
      console.log('maxImageSize changed to:', newMaxSize);
      // In a real app, update UI here to reflect the new setting
    });

    // The subscription returns an unsubscribe function if you need to clean up later
    // const unsubscribe = engine.editor.onSettingsChanged(() => { ... });
    // unsubscribe(); // Call when no longer needed
```

This callback fires whenever any setting changes through the Settings API. You can use it to update quality indicators in your interface, recalculate memory estimates, or trigger asset reloading with the new size limit.

## GPU Capability Detection

Modern browsers expose GPU capabilities through WebGL, allowing you to determine safe export dimensions for the user's hardware.

```typescript highlight-query-gpu-capabilities
    // Query GPU max texture size to understand export limits
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      console.log('GPU Max Texture Size:', maxTextureSize);
      console.log(
        'Safe export dimensions: up to',
        maxTextureSize,
        '×',
        maxTextureSize
      );

      // Most modern GPUs support 4096×4096 to 16384×16384
      // Safe baseline is 4096×4096 for universal compatibility
    }
```

The `MAX_TEXTURE_SIZE` parameter returns the maximum width or height (in pixels) for a texture on the current GPU. Most modern GPUs support 4096×4096 to 16384×16384, while older or integrated GPUs may be limited to smaller dimensions.

You can use this information to:

- Set conservative `maxImageSize` defaults based on detected capabilities
- Show warnings when users attempt exports that may exceed hardware limits
- Provide quality presets that match the device's capabilities
- Calculate safe export dimensions automatically

## Troubleshooting

Common issues and solutions when working with size limits:

| Issue                                | Cause                                    | Solution                                                                                    |
| ------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| Images appear blurry/low quality     | `maxImageSize` too low                   | Increase `maxImageSize` if GPU supports it (query `MAX_TEXTURE_SIZE` first)                |
| Out of memory errors during editing  | `maxImageSize` too high                  | Decrease `maxImageSize` to reduce memory footprint                                          |
| Export fails with no error message   | Output exceeds GPU texture limit         | Reduce export dimensions or query `MAX_TEXTURE_SIZE` to set safe maximums                  |
| Video export fails                   | Resolution/duration too high             | Export at 1080p instead of 4K, or reduce video duration to under 2 minutes                 |
| Inconsistent results across devices  | Different GPU capabilities               | Set conservative `maxImageSize` (4096) or detect capabilities programmatically              |
| Images load slowly                   | High `maxImageSize` on slow hardware     | Lower `maxImageSize` to reduce processing time, especially on mobile devices                |
| Export succeeds but file is too large | No compression applied                   | Use JPEG format with quality settings, or apply PNG compression options                     |

## API Reference

Core methods for managing size limits and export operations:

| Method                          | Description                             |
| ------------------------------- | --------------------------------------- |
| `engine.editor.getSetting()`    | Retrieves the current value of a setting |
| `engine.editor.setSetting()`    | Updates a setting value                 |
| `engine.editor.onSettingsChanged()` | Subscribes to setting change events     |
| `engine.block.export()`         | Exports a block as an image or video    |
| `engine.block.getWidth()`       | Gets the width of a block in pixels     |
| `engine.block.getHeight()`      | Gets the height of a block in pixels    |

## Next Steps

Explore related guides to build complete export workflows:

- [Settings Guide](./settings.md) - Complete Settings API reference and configuration options
- [File Format Support](./file-format-support.md) - Supported image and video formats with capabilities
- [Export Overview](./export-save-publish/export/overview.md) - Fundamentals of exporting images and videos from CE.SDK
- [Export to PDF](./export-save-publish/export/to-pdf.md) - PDF export guide with multi-page support and print optimization



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
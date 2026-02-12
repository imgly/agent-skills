> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Improve Performance](./performance.md)

---

Optimize CE.SDK integration for faster load times, efficient memory usage, and
smooth runtime performance in browser environments.

CE.SDK has a large bundle size that can impact initial page load. Optimizing how you load, use, and dispose of the editor improves application performance and user experience.

This guide covers code splitting techniques to defer loading, source sets for managing large assets, export optimization with workers and quality settings, and proper lifecycle management.

## Code Splitting

Delay loading the engine module to improve initial page load time. Use dynamic imports to load the engine only when needed.

### Using a Bundler

Use dynamic `import()` with bundlers like Webpack, Rollup, or Vite to create separate chunks that load on demand. The bundler automatically handles code splitting when you use dynamic imports.

```ts
async function loadCreativeEditorSDK(): Promise<typeof CreativeEditorSDK> {
  const { default: CreativeEditorSDK } = await import('@cesdk/cesdk-js');
  return CreativeEditorSDK;
}
```

This approach keeps CE.SDK in a separate bundle that loads only when `loadCreativeEditorSDK()` is called. Users who never open the editor avoid downloading the SDK entirely.

### Using CDN

Load CE.SDK directly from CDN using dynamic imports. This works in modern browsers without any build tooling.

```ts
async function loadCreativeEditorSDK(): Promise<typeof CreativeEditorSDK> {
  const { default: CreativeEditorSDK } = await import(
    'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/index.js'
  );
  return CreativeEditorSDK;
}
```

CDN loading offloads bandwidth from your servers and leverages global CDN caching for faster delivery.

## Managing Large Assets

High-resolution images and videos consume significant memory. Optimize asset loading to reduce memory pressure and improve performance.

### Use Source Sets

Source sets allow you to provide multiple resolution variants of the same image. The engine automatically selects the most appropriate resolution based on the current display size, loading smaller images for previews and higher resolution assets only when needed for exports.

```ts
const imageFill = engine.block.createFill('image');

engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
  {
    uri: 'https://img.ly/static/ubq_samples/sample_1_512x341.jpg',
    width: 512,
    height: 341
  },
  {
    uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
    width: 1024,
    height: 683
  },
  {
    uri: 'https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg',
    width: 2048,
    height: 1366
  }
]);

engine.block.setFill(block, imageFill);
```

This approach reduces initial load times and memory usage during editing while ensuring high-quality exports. See [Source Sets](./import-media/source-sets.md) for more details.

### Additional Optimization Tips

- Remove unused assets from the scene when no longer needed
- Dispose the engine when the editing session ends
- Use optimized image formats (WebP, AVIF) for faster loading

## Export Optimization

Optimize export performance through worker configuration and export settings.

### Use Export Workers

CE.SDK uses Web Workers to offload export rendering to background threads, keeping the main thread responsive during exports. Workers are enabled by default for both image and video exports.

For video exports, the `exportWorker` configuration option controls worker usage:

```ts
const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  callbacks: {
    exportWorker: true // Enabled by default
  }
};

const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);
```

### Optimize Export Settings

Adjust export parameters to balance quality and performance:

- **Lower resolution**: Reduce `targetWidth` and `targetHeight` for faster exports on slower devices
- **Adjust quality**: Use lower JPEG quality (0.7-0.8) for smaller file sizes and faster encoding
- **Choose efficient formats**: WebP typically offers better compression than PNG for images with transparency

```ts
// Export with optimized settings for performance
const blob = await engine.block.export(page, 'image/jpeg', {
  targetWidth: 1920,
  targetHeight: 1080,
  jpegQuality: 0.8
});
```

### Export Size Limits

Check device export capabilities before attempting large exports using `engine.editor.getMaxExportSize()`.

```ts
const maxExportSize = engine.editor.getMaxExportSize();

// Verify design fits within limits
const pageWidth = engine.block.getWidth(page);
const pageHeight = engine.block.getHeight(page);

if (pageWidth > maxExportSize || pageHeight > maxExportSize) {
  console.warn('Design exceeds maximum export size - consider reducing dimensions');
}
```

This returns the maximum dimension in pixels that the device can reliably export.

## Engine Lifecycle

Follow proper patterns for initializing and disposing the engine to prevent memory leaks and ensure consistent behavior.

### Initialization

Initialize the engine once and reuse the instance. Pass essential configuration including license key and baseURL.

```ts
import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets'
};

const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);
const engine = cesdk.engine;
```

When using the full CE.SDK (not just the engine), the editor creates a managed canvas element accessible via `cesdk.engine`. Avoid creating multiple engine instances simultaneously.

### Disposal

Call `dispose()` when the editing session ends to free all resources including GPU memory, textures, and native allocations.

```ts
cesdk.dispose();
```

After disposal, the engine instance becomes unusable. Create a new instance if the user returns to the editor.

## Asset Loading

For production deployments, host engine assets on your own servers to improve reliability and reduce dependency on external CDNs. Configure `baseURL` to point to your asset location.

See [Serve Assets From Your Server](./serve-assets.md) for detailed setup instructions.

## Troubleshooting

### Large Initial Load Time

Implement code splitting to defer engine loading until needed. Use dynamic imports with bundlers or CDN loading to keep the main bundle small.

### Slow Export Performance

Enable export workers (default) and reduce export resolution or quality settings. For complex scenes, consider exporting at a lower resolution and scaling up if needed.

### Memory Leaks

Ensure `dispose()` is called when the editor is closed. In SPAs, use cleanup functions in component lifecycle hooks to dispose the engine on unmount.

## API Reference

| Method                             | Description                            |
| ---------------------------------- | -------------------------------------- |
| `CreativeEditorSDK.create()`       | Initialize a new CE.SDK instance       |
| `cesdk.dispose()`                  | Clean up all resources                 |
| `engine.editor.getMaxExportSize()` | Get maximum export dimension in pixels |
| `engine.block.export()`            | Export a block to image or video       |

## Next Steps

- [Architecture](./concepts/architecture.md) - Understand CE.SDK structure and components
- [Headless Mode](./concepts/headless-mode/browser.md) - Run the engine without UI for automation
- [Export Overview](./export-save-publish/export/overview.md) - Learn about export formats and options



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support